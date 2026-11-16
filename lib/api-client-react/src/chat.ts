import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";
import type { ErrorType } from "./custom-fetch";
import type {
  StudyAiError,
  StudyDifficulty,
  StudySource,
} from "./generated/api.schemas";

/**
 * Chat com a IA (escrito à mão, não gerado pelo Orval).
 * Se você adicionar este endpoint ao openapi.yaml e rodar o codegen,
 * pode trocar este arquivo pelos hooks gerados.
 */
export type StudyChatRole = "user" | "assistant";

export type StudyChatMessage = {
  role: StudyChatRole;
  content: string;
};

export type StudyChatRequest = {
  /** Histórico da conversa. Deve começar e terminar com uma mensagem do usuário. */
  messages: StudyChatMessage[];
  /** Material opcional usado como base das respostas. */
  material?: StudySource;
  difficulty?: StudyDifficulty;
};

export type StudyChatResponse = {
  reply: string;
};

export const sendStudyChat = async (
  request: StudyChatRequest,
  options?: Parameters<typeof customFetch>[1],
): Promise<StudyChatResponse> => {
  return customFetch<StudyChatResponse>("/api/study/chat", {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
};

export const useStudyChat = <TError = ErrorType<StudyAiError>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      StudyChatResponse,
      TError,
      { data: StudyChatRequest },
      TContext
    >;
  },
) => {
  return useMutation<
    StudyChatResponse,
    TError,
    { data: StudyChatRequest },
    TContext
  >({
    mutationKey: ["studyChat"],
    ...options?.mutation,
    mutationFn: ({ data }) => sendStudyChat(data),
  });
};
