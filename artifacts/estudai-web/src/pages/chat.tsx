import { type CSSProperties, type FormEvent, type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowUp, FileText, MessageCircle, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { OfficialSparkle as Sparkles } from '@/components/brand';
import { useStudyChat } from '@workspace/api-client-react';
import type { StudyAiStatus, StudyChatMessage, StudySource } from '@workspace/api-client-react';

/** Estrutura mínima de um material (compatível com o tipo Material do App). */
export type ChatMaterial = {
  id: string;
  title: string;
  sourceType: 'texto' | 'pdf' | 'imagem';
  text?: string;
  fileName?: string;
  mimeType?: string;
  base64?: string;
};

type StatusQuery = {
  data: StudyAiStatus | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
};

type ChatEntry = StudyChatMessage & { id: string; createdAt: string };
type StoredChat = { messages: ChatEntry[]; materialId: string };

const CHAT_STORE_KEY = 'estudai-chat-v1';
const maxStoredMessages = 100;
const maxHistoryMessages = 20;
const maxMessageChars = 4000;
const freePrompts = ['Explique um assunto com um exemplo simples', 'Me ajude a montar um plano de estudos', 'Me faça perguntas para testar meu entendimento'];
const materialPrompts = ['Resuma os pontos principais do material', 'Explique o conceito mais difícil com um exemplo', 'Me faça 3 perguntas sobre o material'];

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function chatErrorMessage(error: unknown) {
  const body = (error as { data?: { message?: string; error?: string }; message?: string })?.data;
  if (body?.message) return body.message;
  if (body?.error) return body.error;
  return error instanceof Error && error.message ? error.message : 'Não foi possível obter a resposta da IA. Tente novamente.';
}

function sourceFromMaterial(material: ChatMaterial): StudySource {
  if (material.sourceType === 'texto') return { title: material.title, text: material.text || '' };
  return {
    title: material.title,
    file: {
      name: material.fileName || material.title,
      mimeType: material.mimeType as 'application/pdf' | 'image/jpeg' | 'image/png' | 'image/webp',
      base64: material.base64 || '',
    },
  };
}

function loadStoredChat(): StoredChat {
  try {
    const saved = localStorage.getItem(CHAT_STORE_KEY);
    if (!saved) return { messages: [], materialId: '' };
    const parsed = JSON.parse(saved) as Partial<StoredChat>;
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      materialId: typeof parsed.materialId === 'string' ? parsed.materialId : '',
    };
  } catch {
    return { messages: [], materialId: '' };
  }
}

/**
 * Estado da conversa. Fica no StudyApp (e não na página) para que uma resposta
 * em andamento não se perca se a pessoa trocar de página enquanto espera.
 */
export function useChatSession(materials: ChatMaterial[], configured: boolean) {
  const mutation = useStudyChat();
  const [initial] = useState(loadStoredChat);
  const [messages, setMessages] = useState<ChatEntry[]>(initial.messages);
  const [materialId, setMaterialId] = useState(initial.materialId);
  const [error, setError] = useState('');
  const [storageError, setStorageError] = useState('');
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const messagesRef = useRef(messages);
  const commitMessages = (next: ChatEntry[]) => { messagesRef.current = next; setMessages(next); };

  const material = materials.find((item) => item.id === materialId);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORE_KEY, JSON.stringify({ messages: messages.slice(-maxStoredMessages), materialId }));
      setStorageError('');
    } catch {
      setStorageError('A conversa continua nesta tela, mas não foi possível salvá-la neste navegador.');
    }
  }, [messages, materialId]);

  // Se o material escolhido foi removido, volta para conversa livre.
  useEffect(() => {
    if (materialId && !material) setMaterialId('');
  }, [material, materialId]);

  const ask = useCallback((history: ChatEntry[]) => {
    if (!configured || inFlight.current) return false;
    inFlight.current = true;
    setPending(true);
    setError('');
    const recent = history.slice(-maxHistoryMessages);
    while (recent.length > 0 && recent[0].role !== 'user') recent.shift();
    mutation.mutate(
      {
        data: {
          messages: recent.map(({ role, content }) => ({ role, content })),
          ...(material ? { material: sourceFromMaterial(material) } : {}),
        },
      },
      {
        onSuccess: (response) => commitMessages([...messagesRef.current, { id: newId(), role: 'assistant', content: response.reply, createdAt: new Date().toISOString() }]),
        onError: (reason) => setError(chatErrorMessage(reason)),
        onSettled: () => { inFlight.current = false; setPending(false); },
      },
    );
    return true;
  }, [configured, material, mutation.mutate]);

  const send = (text: string) => {
    const content = text.trim();
    if (!content || content.length > maxMessageChars || inFlight.current || !configured) return false;
    const next: ChatEntry[] = [...messagesRef.current, { id: newId(), role: 'user', content, createdAt: new Date().toISOString() }];
    commitMessages(next);
    ask(next);
    return true;
  };

  const retry = () => {
    if (inFlight.current || messagesRef.current[messagesRef.current.length - 1]?.role !== 'user') return;
    ask(messagesRef.current);
  };

  const clear = () => {
    if (inFlight.current) return;
    commitMessages([]);
    setError('');
  };

  return { messages, materialId, setMaterialId, error, storageError, pending, send, retry, clear };
}

export type ChatSession = ReturnType<typeof useChatSession>;

function AssistantAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return <span className={size === 'md' ? 'grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground' : 'grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground'}><Sparkles size={size === 'md' ? 18 : 13} /></span>;
}

export function ChatPage({ materials, statusQuery, chat }: { materials: ChatMaterial[]; statusQuery: StatusQuery; chat: ChatSession }) {
  const configured = statusQuery.data?.configured === true;
  const [draft, setDraft] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (configured) inputRef.current?.focus({ preventScroll: true }); }, [configured]);
  const lastIsUser = chat.messages[chat.messages.length - 1]?.role === 'user';
  const activeMaterial = materials.find((item) => item.id === chat.materialId);
  const prompts = activeMaterial ? materialPrompts : freePrompts;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'end' });
  }, [chat.messages.length, chat.pending]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (chat.send(draft)) setDraft('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const clear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      window.setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    chat.clear();
    setConfirmClear(false);
  };

  const chipBase = 'inline-flex max-w-[220px] shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors';

  return (
    <div className="page-enter mx-auto max-w-[860px]">
      <header className="mb-5">
        <h1 className="font-display m-0 text-[26px] leading-tight sm:text-[30px]">Chat IA</h1>
        <p className="mb-0 mt-1 max-w-[560px] text-[13px] leading-relaxed text-muted-foreground">Tire dúvidas e treine com a IA. Escolha um material para ela se basear nele.</p>
      </header>

      {statusQuery.isError ? (
        <div role="alert" className="mb-5 flex flex-col gap-2 rounded-2xl bg-accent p-4 text-sm text-accent-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-start gap-2"><AlertCircle size={17} className="mt-0.5 shrink-0" />Não foi possível consultar a disponibilidade da IA. O chat fica indisponível até a confirmação.</span>
          <button type="button" onClick={() => statusQuery.refetch()} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-card px-4 py-2 text-[13px] font-bold text-foreground hover:bg-secondary" data-testid="button-chat-status-retry">Tentar novamente</button>
        </div>
      ) : !statusQuery.isLoading && !configured ? (
        <div role="status" className="mb-5 flex items-start gap-2 rounded-2xl bg-accent px-4 py-3 text-sm leading-relaxed text-accent-foreground"><AlertCircle size={17} className="mt-0.5 shrink-0" /><span><strong>Chat indisponível por enquanto.</strong> {statusQuery.data?.message || 'Nenhuma resposta será criada até que o serviço esteja disponível.'}</span></div>
      ) : null}

      <section className="overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-soft">
        <div className="flex items-center gap-3 px-5 pb-3 pt-5 sm:px-6">
          <AssistantAvatar />
          <div className="min-w-0 flex-1">
            <div className="font-display text-[17px] leading-tight">Assistente EstudAI</div>
            <div className="truncate text-xs font-medium text-muted-foreground">{activeMaterial ? `Sobre: ${activeMaterial.title}` : 'Conversa livre'}</div>
          </div>
          {chat.messages.length > 0 && <button type="button" onClick={clear} disabled={chat.pending} aria-label={confirmClear ? 'Confirmar: apagar a conversa' : 'Limpar conversa'} className={confirmClear ? 'inline-flex h-9 items-center gap-1.5 rounded-full bg-destructive/15 px-3 text-xs font-bold text-destructive' : 'grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary hover:bg-accent'} data-testid="button-chat-clear"><Trash2 size={15} />{confirmClear && 'Apagar?'}</button>}
        </div>

        <div className="flex gap-2 overflow-x-auto px-5 pb-4 sm:px-6" role="group" aria-label="Base da conversa">
          <button type="button" onClick={() => chat.setMaterialId('')} className={chipBase + (chat.materialId === '' ? ' bg-primary text-primary-foreground' : ' bg-secondary text-secondary-foreground hover:bg-accent')} data-testid="button-chat-material-livre"><MessageCircle size={13} />Conversa livre</button>
          {materials.map((material) => <button key={material.id} type="button" onClick={() => chat.setMaterialId(material.id)} className={chipBase + (chat.materialId === material.id ? ' bg-primary text-primary-foreground' : ' bg-secondary text-secondary-foreground hover:bg-accent')} data-testid={`button-chat-material-${material.id}`}><FileText size={13} /><span className="truncate">{material.title}</span></button>)}
        </div>
        {materials.length === 0 && <p className="m-0 px-5 pb-4 text-xs text-muted-foreground sm:px-6">Dica: adicione um material em <Link href="/materiais" className="font-bold text-primary underline underline-offset-2" data-testid="link-chat-materials">Meus materiais</Link> para a IA responder com base nele.</p>}

        <div role="log" aria-label="Conversa com o Chat IA" aria-relevant="additions text" className="flex h-[min(56dvh,540px)] min-h-[340px] flex-col gap-4 overflow-y-auto border-t border-border/50 px-4 py-5 sm:px-6" data-testid="chat-messages" aria-live="polite" aria-busy={chat.pending}>
          {chat.messages.length === 0 && !chat.pending ? (
            <div className="m-auto flex max-w-[460px] flex-col items-center py-6 text-center">
              <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground"><Sparkles size={27} /></span>
              <h2 className="font-display m-0 text-[22px] leading-snug">Olá! O que vamos estudar hoje?</h2>
              <p className="mb-0 mt-2 text-sm leading-relaxed text-muted-foreground">{configured ? 'Escolha uma sugestão ou escreva sua dúvida.' : 'A conversa fica disponível quando a IA estiver configurada.'}</p>
              {configured && <div className="mt-5 flex flex-wrap justify-center gap-2">{prompts.map((prompt) => <button key={prompt} type="button" onClick={() => setDraft(prompt)} className="rounded-full bg-secondary px-4 py-2.5 text-[13px] font-medium text-secondary-foreground transition-colors hover:bg-accent" data-testid="button-chat-starter">{prompt}</button>)}</div>}
            </div>
          ) : (
            chat.messages.map((message) => (
              <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex items-end gap-2'}>
                {message.role === 'assistant' && <AssistantAvatar size="sm" />}
                <div className={message.role === 'user' ? 'max-w-[84%] break-words whitespace-pre-wrap rounded-3xl rounded-tr-md bg-primary px-4 py-3 text-[15px] leading-relaxed text-primary-foreground' : 'max-w-[84%] whitespace-pre-wrap rounded-3xl rounded-tl-md bg-secondary px-4 py-3 text-[15px] leading-relaxed text-secondary-foreground'} data-testid={`chat-message-${message.role}`}>{message.content}</div>
              </div>
            ))
          )}
          {chat.pending && <div className="flex items-end gap-2" aria-label="A IA está escrevendo"><AssistantAvatar size="sm" /><div className="flex items-center gap-1.5 rounded-3xl rounded-tl-md bg-secondary px-4 py-4">{[0, 1, 2].map((dot) => <span key={dot} className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${dot * 140}ms` }} />)}</div></div>}
          <div ref={bottomRef} />
        </div>

        {chat.storageError && <p role="status" className="mx-4 text-xs text-muted-foreground sm:mx-6">{chat.storageError}</p>}
        {chat.error && (
          <div role="alert" className="mx-4 mb-3 flex items-start gap-2 rounded-2xl bg-destructive/10 p-3 text-sm text-destructive sm:mx-6">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div><p className="m-0">{chat.error}</p>{lastIsUser && !chat.pending && configured && <button type="button" onClick={chat.retry} className="mt-1.5 text-xs font-bold underline underline-offset-2" data-testid="button-chat-retry">Tentar novamente</button>}</div>
          </div>
        )}

        <form onSubmit={submit} className="px-4 pb-4 pt-1 sm:px-6 sm:pb-5" style={{ viewTransitionName: 'chat-composer' } as CSSProperties}>
          <div className="flex items-end gap-2 rounded-[26px] border border-input bg-background py-1.5 pl-4 pr-1.5 transition-shadow focus-within:ring-2 focus-within:ring-ring/40">
            <textarea ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} disabled={!configured} maxLength={maxMessageChars} rows={1} aria-label="Mensagem para a IA" placeholder={configured ? 'Escreva sua dúvida…' : 'IA indisponível no momento'} className="max-h-40 min-h-[40px] min-w-0 flex-1 resize-none bg-transparent py-2.5 text-[15px] outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60" data-testid="chat-input" />
            <button type="submit" disabled={!configured || chat.pending || !draft.trim()} aria-label="Enviar mensagem" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-chat-send"><ArrowUp size={19} /></button>
          </div>
          <p className="mb-0 mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">Enter envia, Shift+Enter quebra a linha. A conversa fica salva somente neste navegador. A IA pode errar: confira informações importantes.</p>
        </form>
      </section>
    </div>
  );
}
