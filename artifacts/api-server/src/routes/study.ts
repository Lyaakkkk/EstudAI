import { AiUsageError, getAiGuardStatus } from '../lib/ai-guard';
import { aiGenerationRoutes, createAiAccessGate } from '../lib/ai-access';
import {
  Router,
  type IRouter,
  type Request,
  type Response,
} from "express";
import {
  GenerateStudyChallengesBody,
  GenerateStudyChallengesResponse,
  GenerateStudyQuizBody,
  GenerateStudyQuizResponse,
  GenerateStudySummaryBody,
  GenerateStudySummaryResponse,
  GetStudyAiStatusResponse,
  GradeStudyChallengeBody,
  GradeStudyChallengeResponse,
  type StudyChallengeGradeRequest,
  type StudyChallengeGrade,
  type StudyChallengeRequest,
  type StudyGenerationRequest,
  type StudyQuizRequest,
} from "@workspace/api-zod";
import {
  generateGeminiChat,
  generateGeminiJson,
  geminiSchemas,
  GeminiNotConfiguredError,
  GeminiProviderError,
  GeminiResponseError,
  isGeminiConfigured,
} from "../lib/gemini";

const router: IRouter = Router();
const summaryResponse = GenerateStudySummaryResponse.refine((summary) =>
  Boolean(summary.title.trim() && summary.overview.trim()) &&
  summary.sections.length > 0 &&
  summary.sections.every((section) => section.heading.trim() && section.explanation.trim()),
);
const quizResponse = GenerateStudyQuizResponse.refine((quiz) =>
  Boolean(quiz.title.trim()) &&
  new Set(quiz.questions.map((question) => question.id)).size === quiz.questions.length &&
  quiz.questions.every((question) =>
    question.id.trim() && question.prompt.trim() && question.explanation.trim() && question.topic.trim() &&
    question.options.length >= 2 && question.options.every((option) => option.trim()) &&
    new Set(question.options).size === question.options.length &&
    question.options.includes(question.correctAnswer) &&
    (question.type !== "verdadeiro-ou-falso" ||
      (question.options.length === 2 && question.options.includes("Verdadeiro") && question.options.includes("Falso"))),
  ),
);
const requestWindowMs = 15 * 60 * 1000;
const maxAiRequestsPerWindow = 12;
// O chat é uma conversa com várias mensagens, então tem um limite próprio e maior.
const maxChatRequestsPerWindow = 60;

type RateBucket = { count: number; resetsAt: number };

function createRateLimiter(maxRequests: number) {
  const requestsByClient = new Map<string, RateBucket>();

  return (req: Request, res: Response, next: () => void): void => {
    const now = Date.now();
    const clientKey = req.ip ?? "unknown";
    const existing = requestsByClient.get(clientKey);
    const bucket =
      !existing || existing.resetsAt <= now
        ? { count: 0, resetsAt: now + requestWindowMs }
        : existing;

    if (bucket.count >= maxRequests) {
      res.setHeader(
        "Retry-After",
        Math.ceil((bucket.resetsAt - now) / 1000).toString(),
      );
      res.status(429).json({
        code: "RATE_LIMITED",
        message: "Muitas solicitações em pouco tempo. Tente novamente mais tarde.",
      });
      return;
    }

    if (!existing && requestsByClient.size >= 5000) {
      for (const [key, value] of requestsByClient) if (value.resetsAt <= now) requestsByClient.delete(key);
      if (requestsByClient.size >= 5000) {
        res.setHeader('Retry-After', '60');
        res.status(503).json({ code: 'AI_BUSY', message: 'O assistente está ocupado. Tente novamente em instantes.' });
        return;
      }
    }
    bucket.count += 1;
    requestsByClient.set(clientKey, bucket);

    if (requestsByClient.size > 1000) {
      for (const [key, value] of requestsByClient) {
        if (value.resetsAt <= now) requestsByClient.delete(key);
      }
    }

    next();
  };
}

const aiRateLimiter = createRateLimiter(maxAiRequestsPerWindow);
const chatRateLimiter = createRateLimiter(maxChatRequestsPerWindow);

router.get("/study/ai-status", (_req, res): void => {
  const guard = getAiGuardStatus();
  const configured = isGeminiConfigured() && guard === 'ready';
  res.json(
    GetStudyAiStatusResponse.parse({
      configured,
      provider: "gemini",
      message: guard !== 'ready' ? 'Os recursos de IA estão temporariamente pausados ou aguardando configuração. Materiais e histórico continuam disponíveis.' : configured
        ? "Gemini está configurado."
        : "A IA está indisponível até que GEMINI_API_KEY seja configurada nos segredos do servidor.",
    }),
  );
});

// Express applies the same case/trailing-slash matching as the generation handlers.
router.post(aiGenerationRoutes, createAiAccessGate());

router.use("/study", (req, res, next): void => {
  if (req.method !== 'POST' || !['/chat', '/summaries', '/quizzes', '/challenges', '/challenges/grade'].includes(req.path)) { next(); return; }
  if (req.path === "/chat") {
    chatRateLimiter(req, res, next);
    return;
  }
  aiRateLimiter(req, res, next);
});

function validateStudySource(source: { text?: string; file?: { name?: string; mimeType?: string; base64: string } }): string | null {
  if (!source.text?.trim() && !source.file) return 'Adicione texto ou um arquivo antes de continuar.';
  if (source.text && source.text.length > 100000) return 'O texto deve ter no máximo 100.000 caracteres.';
  if (!source.file) return null;
  const file = source.file;
  if (!file.base64 || file.base64.length > 2796204 || !/^[A-Za-z0-9+/]+={0,2}$/.test(file.base64) || file.base64.length % 4 !== 0) return 'O arquivo enviado está em um formato inválido ou excede 2 MB.';
  if (file.name && file.name.length > 255) return 'O nome do arquivo é muito longo.';
  const bytes = Buffer.from(file.base64, 'base64');
  if (bytes.length > 2 * 1024 * 1024 || bytes.toString('base64') !== file.base64) return 'O arquivo enviado está em um formato inválido ou excede 2 MB.';
  const signature = file.mimeType === 'application/pdf' ? bytes.subarray(0,5).toString() === '%PDF-'
    : file.mimeType === 'image/png' ? bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    : file.mimeType === 'image/jpeg' ? bytes.subarray(0,3).equals(Buffer.from([255,216,255]))
    : file.mimeType === 'image/webp' ? bytes.subarray(0,4).toString() === 'RIFF' && bytes.subarray(8,12).toString() === 'WEBP' : false;
  return signature ? null : 'O conteúdo do arquivo não corresponde ao formato informado.';
}

function difficultyDescription(difficulty: string): string {
  switch (difficulty) {
    case "iniciante":
      return "iniciante: explique desde os conceitos fundamentais e defina termos";
    case "intermediario":
      return "intermediário: conecte conceitos e use aplicações comuns";
    default:
      return "avançado: explore nuances, exceções e aplicações complexas";
  }
}

function sendAiError(req: Request, res: Response, error: unknown): void {
  if (error instanceof AiUsageError) {
    res.setHeader('Retry-After', String(error.retryAfter));
    res.status(error.status).json({ code: error.code, message: error.message });
    return;
  }
  if (error instanceof GeminiNotConfiguredError) {
    res.status(503).json({
      code: "AI_NOT_CONFIGURED",
      message:
        "A IA ainda não está configurada. Adicione GEMINI_API_KEY aos segredos do servidor para habilitar esta função.",
    });
    return;
  }

  if (error instanceof GeminiResponseError) {
    res.status(502).json({
      code: "INVALID_AI_RESPONSE",
      message:
        "A IA não retornou um resultado que possa ser usado. Nenhum resultado foi salvo; tente novamente.",
    });
    return;
  }

  if (error instanceof GeminiProviderError) {
    const messages: Record<GeminiProviderError["reason"], string> = {
      unavailable: "O Gemini está temporariamente indisponível. Aguarde um pouco e clique em Gerar novamente.",
      timeout: "O Gemini demorou mais de 60 segundos para responder. Tente gerar novamente.",
      network: "A API não conseguiu se conectar ao Gemini. Tente novamente em instantes.",
      quota: "O limite de solicitações do Gemini foi atingido. Aguarde antes de tentar novamente.",
      authentication: "O Gemini recusou as credenciais do servidor. A configuração precisa ser verificada pelo responsável.",
      model: "O modelo configurado do Gemini não está disponível. A configuração precisa ser verificada pelo responsável.",
      unknown: "Não foi possível acessar o Gemini. Tente novamente mais tarde.",
    };
    res.status(502).json({
      code: "AI_PROVIDER_ERROR",
      message: `${messages[error.reason]} Nenhum resultado foi salvo.`,
    });
    return;
  }

  req.log.error(
    { errorName: error instanceof Error ? error.name : "unknown" },
    "Study AI request failed",
  );
  res.status(502).json({
    code: "AI_PROVIDER_ERROR",
    message: "Não foi possível concluir esta ação. Nenhum resultado foi salvo.",
  });
}

router.post("/study/summaries", async (req, res): Promise<void> => {
  const parsed = GenerateStudySummaryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Confira os dados do material e tente novamente." });
    return;
  }

  const input = parsed.data as StudyGenerationRequest;
  const sourceError = validateStudySource(input);
  if (sourceError) {
    res.status(400).json({ error: sourceError });
    return;
  }

  const prompt = [
    "Responda somente com um resumo didático em JSON, em português do Brasil.",
    "Baseie todo o conteúdo exclusivamente no material enviado. Não invente fatos nem complete lacunas com suposições.",
    `Nível: ${difficultyDescription(input.difficulty)}.`,
    "Explique o assunto desde os fundamentos, organize as ideias em seções e defina termos importantes.",
    "Se o material não trouxer informação suficiente para um ponto, não invente esse ponto.",
  ].join("\n");

  try {
    const result = await generateGeminiJson(
      prompt,
      input,
      geminiSchemas.summary,
    );
    const validated = summaryResponse.safeParse(result);
    if (!validated.success) throw new GeminiResponseError();
    res.json(validated.data);
  } catch (error) {
    sendAiError(req, res, error);
  }
});

router.post("/study/quizzes", async (req, res): Promise<void> => {
  const parsed = GenerateStudyQuizBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Confira os dados do quiz e tente novamente." });
    return;
  }

  const input = parsed.data as StudyQuizRequest;
  const sourceError = validateStudySource(input);
  if (sourceError) {
    res.status(400).json({ error: sourceError });
    return;
  }

  const prompt = [
    "Responda somente com um quiz em JSON, em português do Brasil.",
    "Use exclusivamente o material enviado; não invente fatos, alternativas ou respostas fora dele.",
    `Nível: ${difficultyDescription(input.difficulty)}.`,
    `Crie exatamente ${input.questionCount} questões variadas de múltipla escolha e verdadeiro ou falso.`,
    "Cada questão precisa ter resposta correta, explicação fundamentada no material e assunto relacionado.",
    "Para verdadeiro ou falso, use exatamente as opções Verdadeiro e Falso.",
  ].join("\n");

  try {
    const result = await generateGeminiJson(
      prompt,
      input,
      geminiSchemas.quiz,
    );
    const validated = quizResponse.safeParse(result);
    if (!validated.success || validated.data.questions.length !== input.questionCount) {
      throw new GeminiResponseError();
    }
    res.json(validated.data);
  } catch (error) {
    sendAiError(req, res, error);
  }
});

router.post("/study/challenges", async (req, res): Promise<void> => {
  const parsed = GenerateStudyChallengesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Confira os dados do desafio e tente novamente." });
    return;
  }

  const input = parsed.data as StudyChallengeRequest;
  const sourceError = validateStudySource(input);
  if (sourceError) {
    res.status(400).json({ error: sourceError });
    return;
  }

  const challengeLabels = {
    logica: "lógica",
    programacao: "programação",
    "resolucao-de-problemas": "resolução de problemas",
  } as const;
  const prompt = [
    "Responda somente com desafios práticos em JSON, em português do Brasil.",
    "Baseie o contexto e as soluções exclusivamente no material enviado. Não invente conceitos.",
    `Nível: ${difficultyDescription(input.difficulty)}.`,
    `Crie 2 desafios do tipo ${challengeLabels[input.challengeType]}.`,
    "Cada desafio deve incluir critérios de avaliação, uma resposta esperada e o assunto principal.",
  ].join("\n");

  try {
    const result = await generateGeminiJson(
      prompt,
      input,
      geminiSchemas.challenges,
    );
    res.json(GenerateStudyChallengesResponse.parse(result));
  } catch (error) {
    sendAiError(req, res, error);
  }
});

router.post("/study/challenges/grade", async (req, res): Promise<void> => {
  const parsed = GradeStudyChallengeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Confira sua resposta e tente novamente." });
    return;
  }

  const input = parsed.data as StudyChallengeGradeRequest;
  const sourceError = validateStudySource(input);
  if (sourceError) {
    res.status(400).json({ error: sourceError });
    return;
  }

  const prompt = [
    "Avalie a resposta do estudante em português do Brasil e responda somente com JSON.",
    "Use somente o material de estudo, o desafio, os critérios e a resposta enviados.",
    "Não atribua pontos quando não houver informação suficiente para avaliar com segurança: nesse caso, score deve ser null e evaluation deve explicar a limitação.",
    `Nível: ${difficultyDescription(input.difficulty)}.`,
    `Desafio: ${JSON.stringify(input.challenge)}.`,
    `Resposta do estudante: ${input.answer}`,
    "Use score de 0 a 100 somente quando for possível justificar a avaliação com os critérios.",
    "Inclua pontos fortes, melhorias concretas, resposta esperada e assuntos para revisar.",
  ].join("\n");

  try {
    const result = await generateGeminiJson<
      Omit<StudyChallengeGrade, "score"> & { score: number | null }
    >(prompt, input, geminiSchemas.challengeGrade);
    const raw = result as unknown as { score: number | null };

    if (raw.score === null) {
      res.status(422).json({
        code: "INVALID_AI_RESPONSE",
        message:
          "Não foi possível avaliar esta resposta com segurança usando o material enviado. Ela não foi pontuada nem registrada.",
      });
      return;
    }

    res.json(GradeStudyChallengeResponse.parse(result));
  } catch (error) {
    sendAiError(req, res, error);
  }
});

const maxChatMessages = 30;
const maxChatMessageChars = 4000;

type ChatBody = {
  messages: { role: "user" | "assistant"; content: string }[];
  material?: {
    title: string;
    text?: string;
    file?: { name: string; mimeType: string; base64: string };
  };
  difficulty?: string;
};

function parseChatBody(body: unknown): ChatBody | string {
  const invalid = "Confira a mensagem e tente novamente.";
  if (typeof body !== "object" || body === null) return invalid;
  const record = body as Record<string, unknown>;

  if (
    !Array.isArray(record.messages) ||
    record.messages.length === 0 ||
    record.messages.length > maxChatMessages
  ) {
    return invalid;
  }

  const messages: ChatBody["messages"] = [];
  for (const item of record.messages) {
    if (typeof item !== "object" || item === null) return invalid;
    const { role, content } = item as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return invalid;
    if (
      typeof content !== "string" ||
      !content.trim() ||
      content.length > maxChatMessageChars
    ) {
      return invalid;
    }
    messages.push({ role, content: content.trim() });
  }

  if (
    messages[0].role !== "user" ||
    messages[messages.length - 1].role !== "user"
  ) {
    return invalid;
  }

  let material: ChatBody["material"];
  if (record.material !== undefined && record.material !== null) {
    const source = record.material as Record<string, unknown>;
    if (typeof source !== "object" || typeof source.title !== "string") {
      return invalid;
    }
    material = { title: source.title.slice(0, 200) };
    if (typeof source.text === "string") {
      material.text = source.text.slice(0, 100_000);
    }
    if (typeof source.file === "object" && source.file !== null) {
      const file = source.file as Record<string, unknown>;
      const allowed = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];
      if (
        typeof file.name !== "string" ||
        typeof file.mimeType !== "string" ||
        !allowed.includes(file.mimeType) ||
        typeof file.base64 !== "string" ||
        file.base64.length > 11_500_000
      ) {
        return "O arquivo enviado está em um formato inválido.";
      }
      material.file = {
        name: file.name,
        mimeType: file.mimeType,
        base64: file.base64,
      };
    }
  }

  const difficulty =
    typeof record.difficulty === "string" &&
    ["iniciante", "intermediario", "avancado"].includes(record.difficulty)
      ? record.difficulty
      : undefined;

  // Se uma resposta anterior falhou, pode haver duas mensagens seguidas do estudante.
  // Junta turnos consecutivos do mesmo papel para manter a conversa alternada.
  const merged: ChatBody["messages"] = [];
  for (const message of messages) {
    const last = merged[merged.length - 1];
    if (last && last.role === message.role) {
      last.content = `${last.content}\n\n${message.content}`;
    } else {
      merged.push({ ...message });
    }
  }

  return { messages: merged, material, difficulty };
}

router.post("/study/chat", async (req, res): Promise<void> => {
  const parsed = parseChatBody(req.body);
  if (typeof parsed === "string") {
    res.status(400).json({ error: parsed });
    return;
  }

  if (parsed.material) {
    const sourceError = validateStudySource(parsed.material);
    if (sourceError) {
      res.status(400).json({ error: sourceError });
      return;
    }
  }

  const systemInstruction = [
    "Você é o assistente de estudos do EstudAI. Converse em português do Brasil, com tom acolhedor e didático.",
    "Explique com clareza, use exemplos curtos e vá do simples ao complexo. Respostas objetivas: só se aprofunde quando o estudante pedir.",
    parsed.difficulty
      ? `Nível do estudante: ${difficultyDescription(parsed.difficulty)}.`
      : null,
    parsed.material
      ? "O estudante anexou um material de estudo. Baseie as respostas nesse material. Se a pergunta não for coberta por ele, diga isso claramente antes de complementar com conhecimento geral, e deixe explícito o que vem do material e o que não vem."
      : "Nenhum material foi anexado. Responda com conhecimento geral e avise quando não tiver certeza em vez de inventar fatos, fontes ou números.",
    "Nunca invente citações, referências ou dados. Se não souber, diga que não sabe.",
    "Responda em texto simples, sem formatação markdown (sem **, #, tabelas ou blocos de código com crases). Para listas, use hífens ou números no início da linha. Trechos de código podem ser escritos em linhas separadas.",
    "Ajude o estudante a aprender: quando fizer sentido, sugira um próximo passo ou uma pergunta para ele testar o próprio entendimento, sem entregar respostas de exercícios sem explicar o raciocínio.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const reply = await generateGeminiChat(
      systemInstruction,
      parsed.messages,
      parsed.material,
    );
    res.json({ reply });
  } catch (error) {
    sendAiError(req, res, error);
  }
});

export default router;
