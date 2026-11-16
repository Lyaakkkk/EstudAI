import { AiUsageError, guardedProviderFetch, withAiConcurrency } from './ai-guard';
import { logger } from "./logger";

type GeminiJsonSchema = Record<string, unknown>;

type StudySource = {
  title: string;
  text?: string;
  file?: {
    name: string;
    mimeType: string;
    base64: string;
  };
};

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

export class GeminiNotConfiguredError extends Error {
  constructor() {
    super("A IA ainda não está configurada.");
    this.name = "GeminiNotConfiguredError";
  }
}

export class GeminiResponseError extends Error {
  constructor() {
    super("O Gemini não retornou uma resposta válida.");
    this.name = "GeminiResponseError";
  }
}

export class GeminiProviderError extends Error {
  constructor(
    readonly reason: "unavailable" | "timeout" | "network" | "quota" | "authentication" | "model" | "unknown" = "unknown",
  ) {
    super("Não foi possível conectar ao Gemini.");
    this.name = "GeminiProviderError";
  }
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function sourceParts(source: StudySource): GeminiPart[] {
  const parts: GeminiPart[] = [
    {
      text: `Material de estudo: ${source.title}`,
    },
  ];

  if (source.text?.trim()) {
    parts.push({ text: source.text });
  }

  if (source.file) {
    parts.push({
      inlineData: {
        mimeType: source.file.mimeType,
        data: source.file.base64,
      },
    });
  }

  return parts;
}

export function generateGeminiJson<T>(prompt: string, source: StudySource, responseSchema: GeminiJsonSchema): Promise<T> {
  return withAiConcurrency(() => generateGeminiJsonRequest<T>(prompt, source, responseSchema));
}

async function generateGeminiJsonRequest<T>(
  prompt: string,
  source: StudySource,
  responseSchema: GeminiJsonSchema,
): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiNotConfiguredError();
  }

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const parts: GeminiPart[] = [
    { text: prompt },
    ...sourceParts(source),
  ];

  let response: Response;
  const signal = AbortSignal.timeout(60_000);
  const startedAt = Date.now();
  try {
    const request = () => guardedProviderFetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
          maxOutputTokens: 8192,
        },
      }),
      signal,
    });
    response = await request();
    // Repete somente indisponibilidade transitória, uma vez, no mesmo prazo total.
    if (response.status === 503) {
      await response.body?.cancel();
      logger.warn({ statusCode: 503, model, attempt: 1 }, "Retrying unavailable Gemini request once");
      await new Promise<void>((resolve) => setTimeout(resolve, 1_000));
      signal.throwIfAborted();
      response = await request();
    }
  } catch (error) {
    if (error instanceof AiUsageError) throw error;
    logger.warn(
      { errorName: error instanceof Error ? error.name : "unknown", model, elapsedMs: Date.now() - startedAt },
      "Gemini request could not be completed",
    );
    throw new GeminiProviderError(signal.aborted ? "timeout" : "network");
  }

  if (!response.ok) {
    logger.warn(
      { statusCode: response.status, model, elapsedMs: Date.now() - startedAt },
      "Gemini returned an unsuccessful response",
    );
    const reason = response.status === 503 ? "unavailable"
      : response.status === 429 ? "quota"
      : response.status === 401 || response.status === 403 ? "authentication"
      : response.status === 404 ? "model" : "unknown";
    await response.body?.cancel();
    throw new GeminiProviderError(reason);
  }

  let payload: GeminiResponse;
  try {
    payload = (await readProviderJson(response)) as GeminiResponse;
  } catch {
    throw new GeminiResponseError();
  }

  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new GeminiResponseError();
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new GeminiResponseError();
  }
}

export const geminiSchemas = {
  summary: {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      overview: { type: "STRING" },
      sections: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            heading: { type: "STRING" },
            explanation: { type: "STRING" },
          },
          required: ["heading", "explanation"],
        },
      },
      keyTerms: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            term: { type: "STRING" },
            definition: { type: "STRING" },
          },
          required: ["term", "definition"],
        },
      },
      reviewTopics: { type: "ARRAY", items: { type: "STRING" } },
    },
    required: ["title", "overview", "sections", "keyTerms", "reviewTopics"],
  },
  quiz: {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      questions: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "STRING" },
            type: {
              type: "STRING",
              enum: ["multipla-escolha", "verdadeiro-ou-falso"],
            },
            prompt: { type: "STRING" },
            options: { type: "ARRAY", items: { type: "STRING" } },
            correctAnswer: { type: "STRING" },
            explanation: { type: "STRING" },
            topic: { type: "STRING" },
          },
          required: [
            "id",
            "type",
            "prompt",
            "options",
            "correctAnswer",
            "explanation",
            "topic",
          ],
        },
      },
    },
    required: ["title", "questions"],
  },
  challenges: {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      challenges: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "STRING" },
            title: { type: "STRING" },
            type: {
              type: "STRING",
              enum: ["logica", "programacao", "resolucao-de-problemas"],
            },
            prompt: { type: "STRING" },
            rubric: { type: "ARRAY", items: { type: "STRING" } },
            expectedAnswer: { type: "STRING" },
            topic: { type: "STRING" },
          },
          required: [
            "id",
            "title",
            "type",
            "prompt",
            "rubric",
            "expectedAnswer",
            "topic",
          ],
        },
      },
    },
    required: ["title", "challenges"],
  },
  challengeGrade: {
    type: "OBJECT",
    properties: {
      score: { type: "INTEGER", nullable: true },
      evaluation: { type: "STRING" },
      strengths: { type: "ARRAY", items: { type: "STRING" } },
      improvements: { type: "ARRAY", items: { type: "STRING" } },
      expectedAnswer: { type: "STRING" },
      topicsToReview: { type: "ARRAY", items: { type: "STRING" } },
    },
    required: [
      "score",
      "evaluation",
      "strengths",
      "improvements",
      "expectedAnswer",
      "topicsToReview",
    ],
  },
} satisfies Record<string, GeminiJsonSchema>;

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export function generateGeminiChat(systemInstruction: string, messages: ChatTurn[], source?: StudySource): Promise<string> {
  return withAiConcurrency(() => generateGeminiChatRequest(systemInstruction, messages, source));
}

async function generateGeminiChatRequest(
  systemInstruction: string,
  messages: ChatTurn[],
  source?: StudySource,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiNotConfiguredError();
  }

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  // O material (texto, PDF ou imagem) vai junto da primeira mensagem do estudante.
  const contents = messages.map((message, index) => {
    const parts: GeminiPart[] = [];
    if (index === 0 && source) parts.push(...sourceParts(source));
    parts.push({ text: message.content });
    return {
      role: message.role === "assistant" ? "model" : "user",
      parts,
    };
  });

  let response: Response;
  try {
    response = await guardedProviderFetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.4,
        },
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (error) {
    if (error instanceof AiUsageError) throw error;
    logger.warn(
      { errorName: error instanceof Error ? error.name : "unknown" },
      "Gemini chat request could not be completed",
    );
    throw new GeminiProviderError();
  }

  if (!response.ok) {
    logger.warn(
      { statusCode: response.status },
      "Gemini chat returned an unsuccessful response",
    );
    await response.body?.cancel();
    throw new GeminiProviderError();
  }

  let payload: GeminiResponse;
  try {
    payload = (await readProviderJson(response)) as GeminiResponse;
  } catch {
    throw new GeminiResponseError();
  }

  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new GeminiResponseError();
  }

  return text;
}

/** Bound provider response allocation even when the upstream is malformed. */
async function readProviderJson(response: Response): Promise<unknown> {
  const limit = 1024 * 1024;
  if (Number(response.headers.get('content-length')) > limit) { await response.body?.cancel(); throw new GeminiResponseError(); }
  const reader = response.body?.getReader();
  if (!reader) throw new GeminiResponseError();
  let bytes = 0; const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > limit) { await reader.cancel(); throw new GeminiResponseError(); }
      chunks.push(part.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } finally { reader.releaseLock(); }
}
