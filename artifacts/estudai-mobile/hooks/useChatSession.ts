import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStudyChat } from "@workspace/api-client-react";
import type { StudyChatMessage, StudySource } from "@workspace/api-client-react";
import { useStudy, type StudyMaterial } from "@/context/StudyContext";

export type ChatEntry = StudyChatMessage & { id: string; createdAt: string };

type StoredChat = { messages: ChatEntry[]; materialId: string };

const CHAT_STORAGE_KEY = "estudai-chat-v1";
const maxStoredMessages = 100;
const maxHistoryMessages = 20;

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function errorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const data = (error as { data?: { message?: unknown; error?: unknown } }).data;
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "Não foi possível obter a resposta da IA. Tente novamente.";
}

function sourceFromMaterial(material: StudyMaterial): StudySource {
  return {
    title: material.title,
    ...(material.text ? { text: material.text } : {}),
    ...(material.file ? { file: material.file } : {}),
  };
}

function isStoredChat(value: unknown): value is StoredChat {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return Array.isArray(record.messages) && typeof record.materialId === "string";
}

/**
 * A conversa com a IA. Fica no topo do app (e não dentro da tela do Chat)
 * para a primeira mensagem poder sair da tela inicial e continuar no Chat.
 */
export function useChatSession(configured: boolean) {
  const { state } = useStudy();
  const mutation = useStudyChat();
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [materialId, setMaterialId] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const material = state.materials.find((item) => item.id === materialId);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (isStoredChat(parsed) && active) {
            setMessages(parsed.messages);
            setMaterialId(parsed.materialId);
          }
        }
      } catch {
        // Se não for possível ler, a conversa começa vazia.
      } finally {
        if (active) setLoaded(true);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const payload: StoredChat = {
      messages: messages.slice(-maxStoredMessages),
      materialId,
    };
    AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(payload)).catch(
      () => undefined,
    );
  }, [loaded, messages, materialId]);

  useEffect(() => {
    if (loaded && materialId && !material) setMaterialId("");
  }, [loaded, material, materialId]);

  const ask = useCallback(
    (history: ChatEntry[]) => {
      if (!configured) return;
      setError("");
      const recent = history.slice(-maxHistoryMessages);
      while (recent.length > 0 && recent[0].role !== "user") recent.shift();

      mutation.mutate(
        {
          data: {
            messages: recent.map(({ role, content }) => ({ role, content })),
            ...(material ? { material: sourceFromMaterial(material) } : {}),
          },
        },
        {
          onSuccess: (response) => {
            setMessages((current) => [
              ...current,
              {
                id: createId(),
                role: "assistant",
                content: response.reply,
                createdAt: new Date().toISOString(),
              },
            ]);
          },
          onError: (reason) => setError(errorMessage(reason)),
        },
      );
    },
    [configured, material, mutation],
  );

  /** Envia uma mensagem. Devolve false se não puder enviar agora. */
  const send = (text: string): boolean => {
    const content = text.trim();
    if (!content || mutation.isPending || !configured || !loaded) return false;
    const next: ChatEntry[] = [
      ...messages,
      {
        id: createId(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      },
    ];
    setMessages(next);
    ask(next);
    return true;
  };

  const retry = () => {
    if (mutation.isPending || messages[messages.length - 1]?.role !== "user") return;
    ask(messages);
  };

  const clear = () => {
    setMessages([]);
    setError("");
  };

  return {
    messages,
    materialId,
    setMaterialId,
    material,
    error,
    pending: mutation.isPending,
    send,
    retry,
    clear,
  };
}

export type ChatSession = ReturnType<typeof useChatSession>;
