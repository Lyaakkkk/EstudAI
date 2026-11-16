import { type CSSProperties, type Dispatch, type FormEvent, type ReactNode, type SetStateAction, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  AlertCircle, ArrowDownRight, ArrowRight, BookOpen, Check, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardList, Clock3, FileImage, FileText, Gauge,
  GraduationCap, Layers3, LoaderCircle, ArrowUp, Menu, MessageCircle, Plus, Trash2, Upload,
  X, type LucideIcon,
} from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import {
  useGenerateStudyChallenges, useGenerateStudyQuiz, useGenerateStudySummary,
  useGetStudyAiStatus, useGradeStudyChallenge, getGetStudyAiStatusQueryKey,
} from '@workspace/api-client-react';
import type {
  StudyChallenge, StudyChallengeGrade, StudyChallengeRequest, StudyChallengeSet,
  StudyAiStatus, StudyDifficulty, StudyGenerationRequest, StudyQuiz, StudyQuizRequest, StudySummary,
} from '@workspace/api-client-react';
import NotFound from '@/pages/not-found';
import { OfficialLogo, OfficialSparkle as Sparkles } from '@/components/brand';
import { ChatPage, useChatSession, type ChatSession } from '@/pages/chat';
import { flushSync } from 'react-dom';
import { useTheme } from '@/lib/theme';
import { parseTags } from '@/lib/tags';
import { MaterialViewer, TagChip, TagField } from '@/components/materials-ui';

type Material = {
  id: string;
  title: string;
  sourceType: 'texto' | 'pdf' | 'imagem';
  text?: string;
  fileName?: string;
  mimeType?: string;
  base64?: string;
  tags?: string[];
  createdAt: string;
};
type QuizAttempt = { id: string; quizId: string; quizTitle: string; answers: Record<string, string>; score: number; total: number; topicsToReview?: string[]; completedAt: string };
type ChallengeAttempt = { id: string; challengeSetTitle: string; challengeTitle: string; answer: string; grade: StudyChallengeGrade; completedAt: string };
type SavedChallengeSet = StudyChallengeSet & { localId?: string; materialId?: string; materialTitle?: string; difficulty?: StudyDifficulty; createdAt?: string };
type StoredState = { materials: Material[]; summaries: StudySummary[]; quizzes: StudyQuiz[]; challenges: SavedChallengeSet[]; quizAttempts: QuizAttempt[]; challengeAttempts: ChallengeAttempt[] };
const STORE_KEY = 'estudai-local-v1';
const emptyState: StoredState = { materials: [], summaries: [], quizzes: [], challenges: [], quizAttempts: [], challengeAttempts: [] };
const queryClient = new QueryClient();
type StudyAiStatusQuery = {
  data: StudyAiStatus | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
};

function useLocalStudy() {
  const [state, setState] = useState<StoredState>(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (!saved) return emptyState;
      const parsed = JSON.parse(saved) as Partial<StoredState>;
      return { ...emptyState, ...parsed };
    } catch { return emptyState; }
  });
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      setStorageError('');
    } catch {
      setStorageError('Não foi possível salvar no armazenamento deste navegador. Tente remover arquivos grandes ou liberar espaço.');
    }
  }, [state]);
  return { state, setState, storageError };
}

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Início', href: '/', icon: GraduationCap },
  { label: 'Chat IA', href: '/chat', icon: MessageCircle },
  { label: 'Meus materiais', href: '/materiais', icon: Layers3 },
  { label: 'Resumos', href: '/resumos', icon: BookOpen },
  { label: 'Quizzes', href: '/quizzes', icon: CircleHelp },
  { label: 'Desafios', href: '/desafios', icon: ClipboardList },
  { label: 'Meu desempenho', href: '/desempenho', icon: Gauge },
];
const difficultyOptions: { value: StudyDifficulty; label: string }[] = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
];
const classNames = (...values: (string | false | undefined)[]) => values.filter(Boolean).join(' ');
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const dateLabel = (value: string) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
const normalized = (value: string) => value.trim().toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ');

function ThemeSelector() {
  const { preference, setPreference, storageError } = useTheme();
  return <div className="flex max-w-full flex-col gap-1"><label className="inline-flex min-w-0 items-center"><span className="sr-only">Tema de aparência</span><select value={preference} onChange={(event) => setPreference(event.target.value as 'light' | 'dark' | 'system')} className="theme-selector h-10 w-[104px] min-w-0 rounded-xl border border-input bg-secondary px-2 text-xs font-semibold text-foreground sm:w-[120px]" data-testid="select-theme"><option value="light">Claro</option><option value="dark">Escuro</option><option value="system">Sistema</option></select></label>{storageError && <span role="status" className="max-w-[120px] text-[10px] text-muted-foreground">Tema aplicado apenas nesta aba.</span>}</div>;
}

function AppFrame({ children, statusQuery, storageError }: { children: ReactNode; statusQuery: StudyAiStatusQuery; storageError: string }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { setMobileOpen(false); }, [location]);
  const selected = navItems.find((item) => item.href === location);
  return (
    <div className="app-shell grain">
      <aside className="sidebar-surface hidden md:flex fixed inset-y-0 left-0 z-30 w-[252px] overflow-y-auto flex-col bg-sidebar px-5 py-6 text-sidebar-foreground">
        <Link href="/" className="sidebar-brand-link mb-6 block border-b border-sidebar-border px-2 pb-6 no-underline" data-testid="link-brand">
          <OfficialLogo className="mx-auto w-full" />
        </Link>
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] sidebar-muted">Seu espaço</div>
        <nav className="space-y-1" aria-label="Navegação principal">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className={classNames('sidebar-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold no-underline', location === href ? 'sidebar-item-active' : 'sidebar-item-idle')} aria-current={location === href ? 'page' : undefined} data-testid={`link-nav-${href.replace('/', '') || 'inicio'}`}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{location === href && <ChevronRight className="ml-auto" size={15} />}
            </Link>
          ))}
        </nav>
        {statusQuery.isLoading || statusQuery.isError || !statusQuery.data?.configured ? (
        <div className="sidebar-status mt-auto rounded-2xl p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold"><span className={classNames('h-2 w-2 rounded-full', statusQuery.isLoading ? 'bg-sidebar-accent' : statusQuery.data?.configured ? 'bg-primary' : 'bg-destructive')} />{statusQuery.isLoading ? 'Conferindo recursos' : statusQuery.data?.configured ? 'Assistente disponível' : 'Assistente indisponível'}</div>
          <p className="m-0 text-[11px] leading-relaxed">{statusQuery.isError ? 'Não foi possível verificar a configuração da IA.' : statusQuery.data?.message || 'Os recursos de IA dependem da configuração do Gemini.'}</p>
          {statusQuery.isError && <button className="mt-2 text-[11px] font-bold underline underline-offset-2" onClick={() => statusQuery.refetch()} data-testid="button-retry-status">Tentar novamente</button>}
        </div>
        ) : <div className="mt-auto" />}
        <p className="sidebar-muted mt-4 px-2 text-[10px] leading-relaxed">Seus materiais e atividades ficam salvos somente neste navegador.</p>
      </aside>
      <header className="sidebar-surface sticky top-0 z-20 flex h-[66px] items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur-sm md:hidden">
        <Link href="/" className="flex items-center gap-2 text-foreground no-underline" data-testid="link-brand-mobile"><OfficialLogo className="h-[54px] w-[128px] sm:w-[156px]" /></Link>
        <div className="flex items-center gap-2"><ThemeSelector /><button className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" data-testid="button-mobile-menu">{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
      </header>
      {mobileOpen && <div className="sidebar-surface fixed inset-x-0 top-[66px] z-30 max-h-[calc(100dvh-66px)] overflow-y-auto bg-sidebar p-4 shadow-lg md:hidden"><nav id="mobile-navigation" aria-label="Navegação principal no celular" className="grid min-w-0 grid-cols-2 gap-2" onKeyDown={(event) => { if (event.key === 'Escape') { setMobileOpen(false); document.querySelector<HTMLButtonElement>('[data-testid="button-mobile-menu"]')?.focus(); } }}>{navItems.map(({ label, href, icon: Icon }) => <Link onClick={() => setMobileOpen(false)} key={href} href={href} className={classNames('sidebar-link flex min-w-0 items-center gap-2 rounded-xl p-3 text-sm font-semibold no-underline', location === href ? 'sidebar-item-active' : 'sidebar-item-idle')} aria-current={location === href ? 'page' : undefined} data-testid={`link-mobile-${href.replace('/', '') || 'inicio'}`}><Icon size={17} className="shrink-0" /><span className="min-w-0 break-words">{label}</span></Link>)}</nav></div>}
      <main className="min-h-[calc(100dvh-66px)] md:ml-[252px] md:min-h-dvh">
        <div className="mx-auto max-w-[1160px] px-4 pb-12 pt-7 sm:px-7 md:px-10 md:pt-10">
          <div className="mb-8 hidden flex-wrap items-center justify-between gap-3 md:flex"><div className="text-xs text-muted-foreground">Seu espaço de estudo <span className="mx-2">/</span><span className="font-semibold text-foreground">{selected?.label ?? 'Estudo'}</span></div><div className="flex items-center gap-4"><span className="hidden text-xs text-muted-foreground xl:inline">Progresso guardado neste dispositivo</span><ThemeSelector /></div></div>
          {storageError && <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-border bg-accent px-4 py-3 text-sm text-accent-foreground"><AlertCircle size={17} className="mt-0.5 shrink-0" /><span>{storageError}</span></div>}
          {children}
        </div>
      </main>
    </div>
  );
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-display m-0 text-[26px] leading-tight sm:text-[30px]">{title}</h1><p className="mb-0 mt-1 max-w-[560px] text-[13px] leading-relaxed text-muted-foreground">{description}</p></div>{action && <div className="shrink-0">{action}</div>}</div>;
}

function Button({ children, onClick, type = 'button', disabled, variant = 'primary', className, testId }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; className?: string; testId?: string }) {
  return <button type={type} onClick={onClick} disabled={disabled} data-testid={testId} className={classNames('inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition-transform duration-150 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50', variant === 'primary' && 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90', variant === 'secondary' && 'border border-border bg-card text-foreground hover:bg-muted', variant === 'ghost' && 'text-muted-foreground hover:bg-muted hover:text-foreground', variant === 'danger' && 'border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10', className)}>{children}</button>;
}

function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-border bg-card/65 px-6 py-12 text-center"><span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary"><Icon size={21} /></span><h3 className="font-display m-0 text-lg font-bold tracking-tight">{title}</h3><p className="mx-auto mb-0 mt-2 max-w-[390px] text-sm leading-relaxed text-muted-foreground">{text}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

function AiNotice({ status, isLoading, isError, retry }: { status?: { configured: boolean; message: string }; isLoading: boolean; isError: boolean; retry: () => void }) {
  if (isLoading) return <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"><span className="skeleton h-2.5 w-2.5 rounded-full" /><span className="text-muted-foreground">Verificando a disponibilidade do assistente…</span></div>;
  if (isError) return <div role="alert" className="mb-5 flex flex-col gap-2 rounded-xl border border-border bg-accent p-4 text-sm text-accent-foreground sm:flex-row sm:items-center sm:justify-between"><span className="flex items-start gap-2"><AlertCircle size={17} className="mt-0.5 shrink-0" />Não foi possível consultar a disponibilidade da IA. As ações de geração ficam indisponíveis até a confirmação.</span><Button variant="secondary" onClick={retry} testId="button-ai-status-retry">Tentar novamente</Button></div>;
  if (status?.configured) return null;
  return <div role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-border bg-accent px-4 py-3 text-sm leading-relaxed text-accent-foreground"><AlertCircle size={17} className="mt-0.5 shrink-0" /><span><strong>Geração indisponível por enquanto.</strong> {status?.message || 'Nenhum resultado será criado até que o serviço esteja disponível.'}</span></div>;
}

function MaterialChooser({ materials, value, onChange }: { materials: Material[]; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold">Material de estudo</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" data-testid="select-material"><option value="">Escolha um material</option>{materials.map((material) => <option key={material.id} value={material.id}>{material.title}</option>)}</select></label>;
}

function DifficultySelect({ value, onChange }: { value: StudyDifficulty; onChange: (value: StudyDifficulty) => void }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold">Nível</span><select value={value} onChange={(event) => onChange(event.target.value as StudyDifficulty)} className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" data-testid="select-difficulty">{difficultyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-label={title} className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[24px] border border-border bg-background p-5 shadow-2xl sm:max-w-[620px] sm:rounded-[24px] sm:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="font-display m-0 text-xl font-extrabold tracking-tight">{title}</h2><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-muted" aria-label="Fechar" data-testid="button-modal-close"><X size={18} /></button></div>{children}</div></div>;
}

function Home({ state, statusQuery, chat }: { state: StoredState; statusQuery: StudyAiStatusQuery; chat: ChatSession }) {
  const [, navigate] = useLocation();
  const [draft, setDraft] = useState('');
  const configured = statusQuery.data?.configured === true;
  const completed = state.quizAttempts.length + state.challengeAttempts.length;
  const topicsToReview = new Set([...state.quizAttempts.flatMap((item) => item.topicsToReview ?? []), ...state.challengeAttempts.flatMap((item) => item.grade.topicsToReview)]).size;
  const latest = [...state.quizAttempts.map((item) => ({ date: item.completedAt, title: item.quizTitle, kind: 'Quiz concluído' })), ...state.challengeAttempts.map((item) => ({ date: item.completedAt, title: item.challengeTitle, kind: 'Desafio avaliado' }))].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const actions = [
    { href: '/materiais', label: 'Meus materiais', hint: 'Anotações, PDFs e imagens', icon: Layers3 },
    { href: '/resumos', label: 'Resumos', hint: 'Leituras organizadas', icon: BookOpen },
    { href: '/quizzes', label: 'Quizzes', hint: 'Teste o que você sabe', icon: CircleHelp },
  ];
  const starters = ['Explique um assunto com um exemplo simples', 'Me ajude a montar um plano de estudos'];

  const openChat = () => {
    let navigated = false;
    const go = () => { if (!navigated) { navigated = true; navigate('/chat'); } };
    const doc = document as Document & { startViewTransition?: (callback: () => void) => { updateCallbackDone?: Promise<unknown> } };
    if (doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try {
        const transition = doc.startViewTransition(() => flushSync(go));
        transition?.updateCallbackDone?.catch(go);
      } catch { go(); }
    } else go();
  };
  const ask = (text: string) => {
    if (!chat.send(text)) return false;
    openChat();
    return true;
  };
  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (ask(draft)) setDraft('');
  };

  return <div className="page-enter">
    <header className="mb-5">
      <h1 className="font-display m-0 text-[28px] leading-tight sm:text-[34px]">O que vamos aprender hoje?</h1>
      <p className="mb-0 mt-1 text-[13px] text-muted-foreground">Pergunte algo à IA ou escolha por onde começar.</p>
    </header>
    <AiNotice status={statusQuery.data} isLoading={statusQuery.isLoading} isError={statusQuery.isError} retry={() => statusQuery.refetch()} />
    <form onSubmit={submit} className="mb-3" style={{ viewTransitionName: 'chat-composer' } as CSSProperties}>
      <div className="flex items-end gap-2 rounded-[26px] border border-input bg-card py-1.5 pl-5 pr-1.5 shadow-soft transition-shadow focus-within:ring-2 focus-within:ring-ring/40">
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }} disabled={!configured} rows={1} maxLength={4000} aria-label="O que vamos aprender hoje?" placeholder={configured ? 'O que vamos aprender hoje?' : 'IA indisponível no momento'} className="max-h-40 min-h-[44px] min-w-0 flex-1 resize-none bg-transparent py-3 text-[15px] outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60" data-testid="home-chat-input" />
        <button type="submit" disabled={!configured || chat.pending || !draft.trim()} aria-label="Enviar para o Chat IA" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40" data-testid="home-chat-send"><ArrowUp size={20} /></button>
      </div>
    </form>
    <div className="mb-4 flex flex-wrap items-center gap-3"><Button onClick={openChat} variant="secondary" testId="button-open-chat"><MessageCircle size={16} />Abrir Chat IA</Button>{chat.pending && <span role="status" className="text-xs text-muted-foreground">A IA está respondendo na conversa.</span>}</div>
    {configured && <div className="mb-6 flex flex-wrap gap-2">{starters.map((prompt) => <button key={prompt} type="button" onClick={() => ask(prompt)} className="rounded-full bg-secondary px-3.5 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent" disabled={chat.pending} data-testid="home-chat-starter">{prompt}</button>)}</div>}
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      {actions.map(({ href, label, hint, icon: Icon }) => <Link key={href} href={href} className="group flex items-center gap-3 rounded-3xl bg-card p-4 text-foreground no-underline shadow-soft transition-transform duration-150 hover:-translate-y-0.5" data-testid={`link-home-${label.toLowerCase().replace(/\s+/g, '-')}`}><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary"><Icon size={20} /></span><span className="min-w-0 flex-1"><span className="font-display block text-[16px] leading-tight">{label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span></span><ChevronRight size={17} className="shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5" /></Link>)}
    </div>
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 rounded-2xl bg-secondary px-5 py-4 text-sm text-secondary-foreground">
      <span><strong className="font-display text-lg">{state.materials.length}</strong> <span className="text-muted-foreground">{state.materials.length === 1 ? 'material' : 'materiais'}</span></span>
      <span><strong className="font-display text-lg">{completed}</strong> <span className="text-muted-foreground">{completed === 1 ? 'atividade concluída' : 'atividades concluídas'}</span></span>
      <span><strong className="font-display text-lg">{topicsToReview}</strong> <span className="text-muted-foreground">para revisar</span></span>
      <Link href="/desempenho" className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-primary no-underline" data-testid="link-home-performance">Ver desempenho <ArrowRight size={13} /></Link>
    </div>
    {latest.length > 0 && <section className="mt-6"><h2 className="font-display mb-3 mt-0 text-lg">Atividade recente</h2><div className="space-y-2">{latest.map((entry, index) => <div key={`${entry.date}-${index}`} className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-primary"><Check size={15} /></span><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{entry.title}</div><div className="text-xs text-muted-foreground">{entry.kind} · {dateLabel(entry.date)}</div></div></div>)}</div></section>}
  </div>;
}

function MaterialsPage({ state, setState }: { state: StoredState; setState: Dispatch<SetStateAction<StoredState>> }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [fileBusy, setFileBusy] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [pending, setPending] = useState<Omit<Material, 'id' | 'createdAt' | 'tags'> | null>(null);
  const tagCounts = state.materials.reduce<Record<string, number>>((acc, item) => { (item.tags ?? []).forEach((tag) => { acc[tag] = (acc[tag] ?? 0) + 1; }); return acc; }, {});
  const allTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a] || a.localeCompare(b, 'pt-BR'));
  const viewing = state.materials.find((item) => item.id === viewingId);
  const updateTags = (id: string, tags: string[]) => setState((current) => ({ ...current, materials: current.materials.map((item) => (item.id === id ? { ...item, tags } : item)) }));
  const addText = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !text.trim()) { setError('Preencha o título e o conteúdo para salvar este material.'); return; }
    if (text.length > 100000) { setError('O texto deve ter no máximo 100.000 caracteres.'); return; }
    const material: Material = { id: newId(), title: title.trim(), sourceType: 'texto', text: text.trim(), tags: parseTags(tagsInput, allTags), createdAt: new Date().toISOString() };
    setState((current) => ({ ...current, materials: [material, ...current.materials] }));
    setTitle(''); setText(''); setTagsInput(''); setError(''); setShowForm(false);
  };
  const addFile = async (file?: File) => {
    if (!file) return;
    setError('');
    const supported = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!supported.includes(file.type)) { setError('Formato não aceito. Use PDF, JPG, PNG ou WebP.'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('O arquivo deve ter até 2 MB para caber no armazenamento local.'); return; }
    const storedBytes = state.materials.reduce((total, material) => total + (material.base64?.length ?? 0), 0);
    if (storedBytes + Math.ceil((file.size * 4) / 3) > 3 * 1024 * 1024) { setError('Remova um arquivo antigo antes de adicionar outro para manter espaço no armazenamento local.'); return; }
    setFileBusy(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
        reader.onerror = () => reject(new Error('Falha na leitura do arquivo.'));
        reader.readAsDataURL(file);
      });
      const type: Material['sourceType'] = file.type === 'application/pdf' ? 'pdf' : 'imagem';
      setTagsInput('');
      setPending({ title: file.name.replace(/\.[^.]+$/, ''), sourceType: type, fileName: file.name, mimeType: file.type, base64 });
    } catch { setError('Não foi possível ler este arquivo. Tente novamente.'); }
    finally { setFileBusy(false); }
  };
  const savePending = (event: FormEvent) => {
    event.preventDefault();
    if (!pending) return;
    const material: Material = { ...pending, id: newId(), title: pending.title.trim() || 'Material', tags: parseTags(tagsInput, allTags), createdAt: new Date().toISOString() };
    setState((current) => ({ ...current, materials: [material, ...current.materials] }));
    setPending(null); setTagsInput('');
  };
  const removeMaterial = (id: string) => {
    if (!window.confirm('Remover apenas este material? Resumos, quizzes e tentativas salvos serão mantidos.')) return;
    setState((current) => ({ ...current, materials: current.materials.filter((item) => item.id !== id) }));
  };
  const term = search.trim().toLocaleLowerCase('pt-BR').replace(/^@/, '');
  const filtered = state.materials.filter((item) => (!activeTag || (item.tags ?? []).includes(activeTag)) && (!term || item.title.toLocaleLowerCase('pt-BR').includes(term) || (item.tags ?? []).some((tag) => tag.includes(term))));
  return <div className="page-enter">
    <PageTitle eyebrow="Sua biblioteca" title="Meus materiais" description="Suas anotações, PDFs e imagens, guardados só neste navegador." action={<Button onClick={() => setShowForm(true)} testId="button-add-text"><Plus size={16} />Adicionar texto</Button>} />
    {error && <div role="alert" className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle size={16} />{error}</div>}
    <div className="mb-7 grid gap-3 sm:grid-cols-2">
      <label className="group flex min-h-[142px] cursor-pointer flex-col justify-between rounded-2xl border border-dashed border-primary/35 bg-secondary p-5 transition-colors hover:bg-accent/40"><input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { void addFile(event.target.files?.[0]); event.currentTarget.value = ''; }} data-testid="input-upload-file" /><span className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-primary"><Upload size={18} /></span>{fileBusy && <LoaderCircle className="animate-spin text-primary" size={18} />}</span><span><span className="block text-sm font-bold">Enviar PDF ou imagem</span><span className="mt-1 block text-xs text-muted-foreground">PDF, JPG, PNG ou WebP · até 2 MB</span></span></label>
      <button onClick={() => setShowForm(true)} className="flex min-h-[142px] flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 text-left transition-colors hover:bg-muted/40" data-testid="button-open-text-form"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary"><FileText size={18} /></span><span><span className="block text-sm font-bold">Colar anotações</span><span className="mt-1 block text-xs text-muted-foreground">Adicione um texto seu para organizar depois.</span></span></button>
    </div>
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display m-0 text-xl font-extrabold tracking-tight">Seus materiais <span className="ml-1 text-sm font-semibold text-muted-foreground">({state.materials.length})</span></h2></div>{state.materials.length > 0 && <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou @tag" className="h-10 rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-64" data-testid="input-search-materials" />}</div>
    {allTags.length > 0 && <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por tag"><button type="button" onClick={() => setActiveTag('')} aria-pressed={activeTag === ''} className={classNames('rounded-full px-3 py-1 text-[11px] font-semibold transition-colors', activeTag === '' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent')} data-testid="tag-filter-todas">Todas</button>{allTags.map((tag) => <TagChip key={tag} tag={tag} count={tagCounts[tag]} active={activeTag === tag} onClick={() => setActiveTag(activeTag === tag ? '' : tag)} />)}</div>}
    {filtered.length ? <div className="space-y-2">{filtered.map((material) => { const Icon = material.sourceType === 'texto' ? FileText : material.sourceType === 'pdf' ? BookOpen : FileImage; return <article key={material.id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:bg-secondary/50"><button type="button" onClick={() => setViewingId(material.id)} className="flex min-w-0 flex-1 items-center gap-3 bg-transparent p-0 text-left" aria-label={`Abrir ${material.title}`} data-testid={`button-open-material-${material.id}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Icon size={18} /></span><div className="min-w-0 flex-1"><h3 className="m-0 truncate text-sm font-bold">{material.title}</h3><p className="mb-0 mt-1 text-xs text-muted-foreground">{material.fileName || (material.text ? `${material.text.length.toLocaleString('pt-BR')} caracteres` : 'Texto')} · {dateLabel(material.createdAt)}</p>{(material.tags?.length ?? 0) > 0 && <div className="mt-2 flex flex-wrap gap-1">{material.tags!.map((tag) => <TagChip key={tag} tag={tag} />)}</div>}</div></button><span className="hidden rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:inline-flex">{material.sourceType}</span><Button variant="ghost" onClick={() => removeMaterial(material.id)} className="h-9 min-h-9 w-9 px-0" testId={`button-remove-material-${material.id}`}><Trash2 size={16} /><span className="sr-only">Remover {material.title}</span></Button></article>; })}</div> : state.materials.length ? <EmptyState icon={Layers3} title="Nada encontrado" text="Tente outro termo de busca." /> : <EmptyState icon={Layers3} title="Sua biblioteca começa com você" text="Ainda não há materiais salvos. Adicione um texto, PDF ou imagem para começar." action={<Button onClick={() => setShowForm(true)} testId="button-empty-add-material"><Plus size={16} />Adicionar primeiro material</Button>} />}
    {showForm && <Modal title="Adicionar anotações" onClose={() => setShowForm(false)}><form onSubmit={addText} className="space-y-4"><label className="block"><span className="mb-1.5 block text-xs font-bold">Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Dê um nome às suas anotações" data-testid="input-material-title" /></label><label className="block"><span className="mb-1.5 block text-xs font-bold">Conteúdo</span><textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={100000} required rows={8} className="w-full resize-y rounded-xl border border-input bg-card p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring" placeholder="Cole aqui o conteúdo que você quer estudar…" data-testid="input-material-text" /><span className="mt-1 block text-right text-[11px] text-muted-foreground">{text.length.toLocaleString('pt-BR')} / 100.000</span></label><div><span className="mb-1.5 block text-xs font-bold">Tags <span className="font-normal text-muted-foreground">(opcional)</span></span><TagField value={tagsInput} onChange={setTagsInput} suggestions={allTags} testId="input-material-tags" /></div>{error && <p role="alert" className="m-0 text-sm text-destructive">{error}</p>}<div className="flex justify-end gap-2 pt-2"><Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button><Button type="submit" testId="button-save-material">Salvar material</Button></div></form></Modal>}
    {pending && <Modal title="Organizar arquivo" onClose={() => { setPending(null); setTagsInput(''); }}><form onSubmit={savePending} className="space-y-4"><label className="block"><span className="mb-1.5 block text-xs font-bold">Nome</span><input value={pending.title} onChange={(event) => setPending({ ...pending, title: event.target.value })} maxLength={200} className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" data-testid="input-pending-title" /></label><div><span className="mb-1.5 block text-xs font-bold">Tags <span className="font-normal text-muted-foreground">(opcional)</span></span><TagField value={tagsInput} onChange={setTagsInput} suggestions={allTags} testId="input-pending-tags" /></div><p className="m-0 text-xs text-muted-foreground">Arquivo: {pending.fileName}</p><div className="flex justify-end gap-2 pt-2"><Button variant="secondary" onClick={() => { setPending(null); setTagsInput(''); }}>Cancelar</Button><Button type="submit" testId="button-save-pending">Salvar arquivo</Button></div></form></Modal>}
    {viewing && <MaterialViewer key={viewing.id} material={viewing} allTags={allTags} onClose={() => setViewingId(null)} onSaveTags={updateTags} />}
  </div>;
}

function sourceFromMaterial(material: Material, difficulty: StudyDifficulty) {
  return { title: material.title, ...(material.sourceType === 'texto' ? { text: material.text || '' } : { file: { name: material.fileName || material.title, mimeType: material.mimeType as 'application/pdf' | 'image/jpeg' | 'image/png' | 'image/webp', base64: material.base64 || '' } }), difficulty };
}
function generationErrorMessage(error: unknown) {
  const body = (error as { data?: { message?: string; code?: string }; message?: string })?.data;
  if (body?.code === 'AI_NOT_CONFIGURED') return 'O Gemini não está configurado. Nenhum resultado foi criado.';
  if (body?.message) return `A geração falhou: ${body.message}`;
  return `A geração falhou. Nenhum resultado foi criado. ${error instanceof Error ? error.message : 'Tente novamente mais tarde.'}`;
}
function LocalOnlyNote() { return <div className="mt-5 text-[11px] leading-relaxed text-muted-foreground">As respostas geradas são guardadas localmente neste navegador.</div>; }

function SummariesPage({ state, setState, statusQuery }: { state: StoredState; setState: Dispatch<SetStateAction<StoredState>>; statusQuery: StudyAiStatusQuery }) {
  const mutation = useGenerateStudySummary();
  const [materialId, setMaterialId] = useState('');
  const [difficulty, setDifficulty] = useState<StudyDifficulty>('iniciante');
  const [error, setError] = useState('');
  const [open, setOpen] = useState<StudySummary | null>(null);
  const material = state.materials.find((item) => item.id === materialId);
  const canGenerate = Boolean(statusQuery.data?.configured && material && !mutation.isPending);
  const generate = () => {
    if (!material || !statusQuery.data?.configured) return;
    setError('');
    mutation.mutate({ data: sourceFromMaterial(material, difficulty) as StudyGenerationRequest }, { onSuccess: (summary) => { setState((current) => ({ ...current, summaries: [summary, ...current.summaries] })); }, onError: (reason) => setError(generationErrorMessage(reason)) });
  };
  const remove = (summary: StudySummary) => { if (!window.confirm('Remover este resumo do armazenamento local?')) return; setState((current) => ({ ...current, summaries: current.summaries.filter((item) => item !== summary) })); };
  return <div className="page-enter"><PageTitle eyebrow="Aprenda com suas fontes" title="Resumos" description="Transforme um material seu em uma leitura organizada." />
    <AiNotice status={statusQuery.data} isLoading={statusQuery.isLoading} isError={statusQuery.isError} retry={() => statusQuery.refetch()} />
    <section className="mb-8 rounded-2xl border border-border/70 bg-card p-5 sm:p-6"><div className="mb-4 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary"><Sparkles size={19} /></span><div><h2 className="m-0 text-base font-bold">Criar resumo</h2><p className="m-0 mt-0.5 text-xs text-muted-foreground">Use um material que já está na sua biblioteca.</p></div></div>{state.materials.length ? <div className="grid gap-3 sm:grid-cols-[1fr_190px_auto] sm:items-end"><MaterialChooser materials={state.materials} value={materialId} onChange={setMaterialId} /><DifficultySelect value={difficulty} onChange={setDifficulty} /><Button onClick={generate} disabled={!canGenerate} testId="button-generate-summary">{mutation.isPending ? <><LoaderCircle className="animate-spin" size={16} />Gerando…</> : <><Sparkles size={15} />Gerar resumo</>}</Button></div> : <div className="rounded-xl bg-muted/70 px-4 py-3 text-sm text-muted-foreground">Adicione um material antes de criar um resumo. <Link href="/materiais" className="font-bold text-primary underline underline-offset-2" data-testid="link-summary-materials">Ir para materiais</Link></div>}{error && <p role="alert" className="mb-0 mt-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}<LocalOnlyNote /></section>
    <div className="mb-4 flex items-end justify-between"><div><div className="text-[10px] font-bold uppercase tracking-[.17em] text-primary">Sua estante</div><h2 className="font-display mb-0 mt-1 text-xl font-extrabold tracking-tight">Resumos salvos <span className="text-sm font-semibold text-muted-foreground">({state.summaries.length})</span></h2></div></div>
    {mutation.isPending && <div className="mb-4 rounded-2xl border border-border bg-card p-5"><div className="skeleton mb-3 h-4 w-1/3 rounded" /><div className="skeleton mb-2 h-3 w-full rounded" /><div className="skeleton h-3 w-4/5 rounded" /><p className="mb-0 mt-4 text-xs text-muted-foreground">Aguardando o resultado da API. Nenhum resumo é exibido antes da resposta.</p></div>}
    {state.summaries.length ? <div className="grid gap-3 md:grid-cols-2">{state.summaries.map((summary, index) => <article key={`${summary.title}-${index}`} className="flex min-h-[170px] flex-col rounded-2xl border border-border/70 bg-card p-5"><div className="flex items-start justify-between gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary"><BookOpen size={17} /></span><Button variant="ghost" className="h-8 min-h-8 w-8 px-0" onClick={() => remove(summary)} testId={`button-delete-summary-${index}`}><Trash2 size={15} /><span className="sr-only">Remover resumo</span></Button></div><h3 className="font-display mb-0 mt-4 text-lg font-extrabold tracking-tight">{summary.title}</h3><p className="mb-0 mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{summary.overview}</p><button className="mt-auto flex items-center gap-1 pt-4 text-left text-xs font-bold text-primary" onClick={() => setOpen(summary)} data-testid={`button-read-summary-${index}`}>Ler resumo <ArrowRight size={14} /></button></article>)}</div> : !mutation.isPending && <EmptyState icon={BookOpen} title="Nenhum resumo por aqui" text="Quando a IA estiver configurada, você poderá gerar um resumo a partir dos seus materiais. Sem geração concluída, nenhum conteúdo aparece." />}
    {open && <Modal title={open.title} onClose={() => setOpen(null)}><div className="space-y-5"><section><div className="mb-2 text-[10px] font-bold uppercase tracking-[.17em] text-primary">Visão geral</div><p className="m-0 text-sm leading-relaxed">{open.overview}</p></section><div className="space-y-4">{open.sections.map((section, index) => <section key={`${section.heading}-${index}`} className="border-t border-border pt-4"><h3 className="font-display m-0 text-base font-bold">{section.heading}</h3><p className="mb-0 mt-2 text-sm leading-relaxed text-muted-foreground">{section.explanation}</p></section>)}</div>{open.keyTerms.length > 0 && <section className="border-t border-border pt-4"><h3 className="font-display m-0 text-base font-bold">Termos-chave</h3><dl className="mt-3 space-y-3">{open.keyTerms.map((term, index) => <div key={`${term.term}-${index}`}><dt className="text-sm font-bold">{term.term}</dt><dd className="mb-0 mt-1 text-sm leading-relaxed text-muted-foreground">{term.definition}</dd></div>)}</dl></section>}{open.reviewTopics.length > 0 && <section className="border-t border-border pt-4"><h3 className="font-display m-0 text-base font-bold">Para revisar</h3><ul className="mb-0 mt-2 space-y-1 pl-5 text-sm text-muted-foreground">{open.reviewTopics.map((topic, index) => <li key={`${topic}-${index}`}>{topic}</li>)}</ul></section>}</div></Modal>}
  </div>;
}

function QuizzesPage({ state, setState, statusQuery }: { state: StoredState; setState: Dispatch<SetStateAction<StoredState>>; statusQuery: StudyAiStatusQuery }) {
  const mutation = useGenerateStudyQuiz();
  const [materialId, setMaterialId] = useState('');
  const [difficulty, setDifficulty] = useState<StudyDifficulty>('iniciante');
  const [count, setCount] = useState(5);
  const [error, setError] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<StudyQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);
  const material = state.materials.find((item) => item.id === materialId);
  const canGenerate = Boolean(statusQuery.data?.configured && material && !mutation.isPending);
  const generate = () => {
    if (!material || !statusQuery.data?.configured) return;
    setError('');
    const request = { ...sourceFromMaterial(material, difficulty), questionCount: count } as StudyQuizRequest;
    mutation.mutate({ data: request }, { onSuccess: (quiz) => setState((current) => ({ ...current, quizzes: [quiz, ...current.quizzes] })), onError: (reason) => setError(generationErrorMessage(reason)) });
  };
  const finishQuiz = () => {
    if (!activeQuiz || activeQuiz.questions.some((question) => !answers[question.id])) return;
    const incorrectQuestions = activeQuiz.questions.filter((question) => normalized(answers[question.id] || '') !== normalized(question.correctAnswer));
    const score = activeQuiz.questions.length - incorrectQuestions.length;
    const attempt: QuizAttempt = { id: newId(), quizId: `${activeQuiz.title}-${state.quizzes.indexOf(activeQuiz)}`, quizTitle: activeQuiz.title, answers: { ...answers }, score, total: activeQuiz.questions.length, topicsToReview: [...new Set(incorrectQuestions.map((question) => question.topic))], completedAt: new Date().toISOString() };
    setState((current) => ({ ...current, quizAttempts: [attempt, ...current.quizAttempts] }));
    setLastAttempt(attempt);
  };
  const closeQuiz = () => { setActiveQuiz(null); setAnswers({}); setLastAttempt(null); };
  return <div className="page-enter"><PageTitle eyebrow="Pratique ativa" title="Quizzes" description="Questões criadas a partir dos seus materiais." />
    <AiNotice status={statusQuery.data} isLoading={statusQuery.isLoading} isError={statusQuery.isError} retry={() => statusQuery.refetch()} />
    <section className="mb-8 rounded-2xl border border-border/70 bg-card p-5 sm:p-6"><div className="mb-4 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary"><CircleHelp size={19} /></span><div><h2 className="m-0 text-base font-bold">Montar um quiz</h2><p className="m-0 mt-0.5 text-xs text-muted-foreground">As questões vêm da resposta real do serviço.</p></div></div>{state.materials.length ? <div className="grid gap-3 sm:grid-cols-[1fr_170px_140px_auto] sm:items-end"><MaterialChooser materials={state.materials} value={materialId} onChange={setMaterialId} /><DifficultySelect value={difficulty} onChange={setDifficulty} /><label className="block"><span className="mb-1.5 block text-xs font-bold">Questões</span><select value={count} onChange={(event) => setCount(Number(event.target.value))} className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" data-testid="select-question-count">{[5, 6, 7, 8, 9, 10].map((number) => <option key={number} value={number}>{number} questões</option>)}</select></label><Button onClick={generate} disabled={!canGenerate} testId="button-generate-quiz">{mutation.isPending ? <><LoaderCircle size={16} className="animate-spin" />Criando…</> : <><Sparkles size={15} />Gerar quiz</>}</Button></div> : <div className="rounded-xl bg-muted/70 px-4 py-3 text-sm text-muted-foreground">Adicione um material antes de criar um quiz. <Link href="/materiais" className="font-bold text-primary underline underline-offset-2" data-testid="link-quiz-materials">Ir para materiais</Link></div>}{error && <p role="alert" className="mb-0 mt-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}<LocalOnlyNote /></section>
    <div className="mb-4"><div className="text-[10px] font-bold uppercase tracking-[.17em] text-primary">Prontos para praticar</div><h2 className="font-display mb-0 mt-1 text-xl font-extrabold tracking-tight">Quizzes salvos <span className="text-sm font-semibold text-muted-foreground">({state.quizzes.length})</span></h2></div>
    {mutation.isPending && <div className="mb-4 rounded-2xl border border-border bg-card p-5"><div className="skeleton mb-3 h-4 w-1/3 rounded" /><div className="skeleton mb-2 h-3 w-full rounded" /><p className="mb-0 mt-4 text-xs text-muted-foreground">Aguardando questões reais da API.</p></div>}
    {state.quizzes.length ? <div className="grid gap-3 md:grid-cols-2">{state.quizzes.map((quiz, index) => <article key={`${quiz.title}-${index}`} className="rounded-2xl border border-border/70 bg-card p-5"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary"><CircleHelp size={17} /></span><span className="text-xs text-muted-foreground">{quiz.questions.length} questões</span></div><h3 className="font-display mb-0 mt-4 text-lg font-extrabold tracking-tight">{quiz.title}</h3><p className="mb-4 mt-1 text-xs text-muted-foreground">Questões geradas com base no material selecionado.</p><div className="flex items-center justify-between"><Button onClick={() => { setActiveQuiz(quiz); setAnswers({}); setLastAttempt(null); }} testId={`button-start-quiz-${index}`}>Começar quiz <ArrowRight size={15} /></Button><Button variant="ghost" onClick={() => { if (window.confirm('Remover este quiz salvo?')) setState((current) => ({ ...current, quizzes: current.quizzes.filter((item) => item !== quiz) })); }} testId={`button-delete-quiz-${index}`}><Trash2 size={15} /><span className="sr-only">Remover quiz</span></Button></div></article>)}</div> : !mutation.isPending && <EmptyState icon={CircleHelp} title="Ainda não há quizzes" text="Quando a IA estiver configurada, gere questões usando um material seu. Nenhuma questão de exemplo é exibida." />}
    {activeQuiz && <Modal title={lastAttempt ? 'Tentativa concluída' : activeQuiz.title} onClose={closeQuiz}>{lastAttempt ? <div><div className="rounded-2xl bg-secondary p-5"><div className="text-xs font-bold uppercase tracking-widest text-primary">Resultado desta tentativa</div><div className="font-display mt-2 text-4xl font-extrabold tracking-tight">{lastAttempt.score}<span className="text-xl text-muted-foreground"> / {lastAttempt.total}</span></div><p className="mb-0 mt-1 text-sm text-muted-foreground">Respostas corretas</p></div><div className="mt-5 space-y-4">{activeQuiz.questions.map((question, index) => { const correct = normalized(lastAttempt.answers[question.id] || '') === normalized(question.correctAnswer); return <div key={question.id} className="rounded-xl border border-border p-4"><div className="mb-2 flex items-start gap-2"><span className={classNames('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full', correct ? 'bg-success/15 text-success' : 'bg-destructive/10 text-destructive')}>{correct ? <Check size={13} /> : <X size={13} />}</span><p className="m-0 text-sm font-semibold">{index + 1}. {question.prompt}</p></div><p className="mb-1 ml-7 text-xs text-muted-foreground">Sua resposta: {lastAttempt.answers[question.id]}</p><p className="mb-1 ml-7 text-xs font-bold text-primary">Resposta correta: {question.correctAnswer}</p><p className="mb-0 ml-7 text-xs leading-relaxed text-muted-foreground">{question.explanation}</p></div>; })}</div><Button onClick={closeQuiz} className="mt-5 w-full" testId="button-close-quiz-results">Concluir</Button></div> : <div className="space-y-5">{activeQuiz.questions.map((question, index) => <fieldset key={question.id} className="m-0 rounded-xl border border-border p-4"><legend className="px-1 text-sm font-bold">{index + 1}. {question.prompt}</legend><div className="mt-2 space-y-2">{question.options.map((option, optionIndex) => <label key={`${question.id}-${optionIndex}`} className={classNames('flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors', answers[question.id] === option ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/60')}><input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} className="mt-0.5 accent-[hsl(var(--primary))]" data-testid={`input-answer-${index}-${optionIndex}`} /><span>{option}</span></label>)}</div></fieldset>)}<div className="flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{Object.keys(answers).length} de {activeQuiz.questions.length} respondidas</span><Button onClick={finishQuiz} disabled={Object.keys(answers).length !== activeQuiz.questions.length} testId="button-finish-quiz">Finalizar tentativa <Check size={15} /></Button></div></div>}</Modal>}
  </div>;
}

function ChallengesPage({ state, setState, statusQuery }: { state: StoredState; setState: Dispatch<SetStateAction<StoredState>>; statusQuery: StudyAiStatusQuery }) {
  const createMutation = useGenerateStudyChallenges();
  const gradeMutation = useGradeStudyChallenge();
  const [materialId, setMaterialId] = useState('');
  const [difficulty, setDifficulty] = useState<StudyDifficulty>('iniciante');
  const [challengeType, setChallengeType] = useState<StudyChallengeRequest['challengeType']>('resolucao-de-problemas');
  const [error, setError] = useState('');
  const [currentSet, setCurrentSet] = useState<SavedChallengeSet | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<StudyChallenge | null>(null);
  const [answer, setAnswer] = useState('');
  const [grade, setGrade] = useState<StudyChallengeGrade | null>(null);
  const material = state.materials.find((item) => item.id === materialId);
  const challengeMaterial = currentSet?.materialId
    ? state.materials.find((item) => item.id === currentSet.materialId)
    : undefined;
  const generate = () => {
    if (!material || !statusQuery.data?.configured) return;
    setError('');
    createMutation.mutate({ data: { ...sourceFromMaterial(material, difficulty), challengeType } as StudyChallengeRequest }, { onSuccess: (challengeSet) => {
      const savedSet: SavedChallengeSet = { ...challengeSet, localId: newId(), materialId: material.id, materialTitle: material.title, difficulty, createdAt: new Date().toISOString() };
      setState((current) => ({ ...current, challenges: [savedSet, ...current.challenges] }));
    }, onError: (reason) => setError(generationErrorMessage(reason)) });
  };
  const openChallenge = (challengeSet: SavedChallengeSet, challenge: StudyChallenge) => { setCurrentSet(challengeSet); setCurrentChallenge(challenge); setAnswer(''); setGrade(null); setError(''); };
  const submitAnswer = () => {
    if (!challengeMaterial || !currentChallenge || !currentSet || !statusQuery.data?.configured || !answer.trim()) return;
    gradeMutation.mutate({ data: { ...sourceFromMaterial(challengeMaterial, currentSet.difficulty ?? 'iniciante'), challenge: currentChallenge, answer: answer.trim() } }, { onSuccess: (result) => { setGrade(result); const attempt: ChallengeAttempt = { id: newId(), challengeSetTitle: currentSet?.title || '', challengeTitle: currentChallenge.title, answer: answer.trim(), grade: result, completedAt: new Date().toISOString() }; setState((current) => ({ ...current, challengeAttempts: [attempt, ...current.challengeAttempts] })); }, onError: (reason) => setError(generationErrorMessage(reason)) });
  };
  const closeChallenge = () => { setCurrentSet(null); setCurrentChallenge(null); setAnswer(''); setGrade(null); setError(''); };
  return <div className="page-enter"><PageTitle eyebrow="Aprender fazendo" title="Desafios" description="Aplique o que você estudou e receba uma correção." />
    <AiNotice status={statusQuery.data} isLoading={statusQuery.isLoading} isError={statusQuery.isError} retry={() => statusQuery.refetch()} />
    <section className="mb-8 rounded-2xl border border-border/70 bg-card p-5 sm:p-6"><div className="mb-4 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary"><ClipboardList size={19} /></span><div><h2 className="m-0 text-base font-bold">Criar desafio prático</h2><p className="m-0 mt-0.5 text-xs text-muted-foreground">O serviço gera os desafios usando sua fonte de estudo.</p></div></div>{state.materials.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_150px_190px_auto] lg:items-end"><MaterialChooser materials={state.materials} value={materialId} onChange={setMaterialId} /><DifficultySelect value={difficulty} onChange={setDifficulty} /><label className="block"><span className="mb-1.5 block text-xs font-bold">Tipo</span><select value={challengeType} onChange={(event) => setChallengeType(event.target.value as StudyChallengeRequest['challengeType'])} className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" data-testid="select-challenge-type"><option value="logica">Lógica</option><option value="programacao">Programação</option><option value="resolucao-de-problemas">Resolução de problemas</option></select></label><Button onClick={generate} disabled={!statusQuery.data?.configured || !material || createMutation.isPending} testId="button-generate-challenge">{createMutation.isPending ? <><LoaderCircle size={16} className="animate-spin" />Criando…</> : <><Sparkles size={15} />Gerar desafios</>}</Button></div> : <div className="rounded-xl bg-muted/70 px-4 py-3 text-sm text-muted-foreground">Adicione um material antes de criar desafios. <Link href="/materiais" className="font-bold text-primary underline underline-offset-2" data-testid="link-challenge-materials">Ir para materiais</Link></div>}{error && !currentChallenge && <p role="alert" className="mb-0 mt-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}<LocalOnlyNote /></section>
    <div className="mb-4"><div className="text-[10px] font-bold uppercase tracking-[.17em] text-primary">Percursos práticos</div><h2 className="font-display mb-0 mt-1 text-xl font-extrabold tracking-tight">Conjuntos salvos <span className="text-sm font-semibold text-muted-foreground">({state.challenges.length})</span></h2></div>
    {createMutation.isPending && <div className="mb-4 rounded-2xl border border-border bg-card p-5"><div className="skeleton mb-3 h-4 w-1/3 rounded" /><div className="skeleton h-3 w-4/5 rounded" /><p className="mb-0 mt-4 text-xs text-muted-foreground">Aguardando desafios reais da API.</p></div>}
    {state.challenges.length ? <div className="space-y-3">{state.challenges.map((set, setIndex) => <article key={`${set.title}-${setIndex}`} className="rounded-2xl border border-border/70 bg-card p-5"><div className="flex items-start justify-between"><div><div className="text-[10px] font-bold uppercase tracking-[.14em] text-primary">Conjunto · {set.challenges.length} desafios</div><h3 className="font-display mb-0 mt-1 text-lg font-extrabold tracking-tight">{set.title}</h3></div><Button variant="ghost" onClick={() => { if (window.confirm('Remover este conjunto de desafios salvo?')) setState((current) => ({ ...current, challenges: current.challenges.filter((item) => item !== set) })); }} testId={`button-delete-challenge-set-${setIndex}`}><Trash2 size={15} /><span className="sr-only">Remover conjunto</span></Button></div><div className="mt-4 divide-y divide-border">{set.challenges.map((challenge, challengeIndex) => <div key={challenge.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center"><div className="flex-1"><div className="text-sm font-bold">{challenge.title}</div><p className="mb-0 mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{challenge.prompt}</p></div><Button variant="secondary" onClick={() => openChallenge(set, challenge)} testId={`button-open-challenge-${setIndex}-${challengeIndex}`}>Responder <ArrowRight size={14} /></Button></div>)}</div></article>)}</div> : !createMutation.isPending && <EmptyState icon={ClipboardList} title="Nenhum desafio salvo" text="Com o Gemini configurado, você poderá gerar desafios reais a partir das suas fontes." />}
    {currentChallenge && <Modal title={grade ? 'Avaliação recebida' : currentChallenge.title} onClose={closeChallenge}>{grade ? <div><div className="rounded-2xl bg-secondary p-5"><div className="text-xs font-bold uppercase tracking-widest text-primary">Avaliação da API</div><div className="font-display mt-2 text-4xl font-extrabold tracking-tight">{grade.score}<span className="text-xl text-muted-foreground"> / 100</span></div><p className="mb-0 mt-2 text-sm leading-relaxed">{grade.evaluation}</p></div><section className="mt-5"><h3 className="font-display m-0 text-base font-bold">Pontos fortes</h3>{grade.strengths.length ? <ul className="mt-2 space-y-1 pl-5 text-sm text-muted-foreground">{grade.strengths.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : <p className="text-sm text-muted-foreground">A API não retornou pontos fortes.</p>}</section><section className="mt-4"><h3 className="font-display m-0 text-base font-bold">O que melhorar</h3>{grade.improvements.length ? <ul className="mt-2 space-y-1 pl-5 text-sm text-muted-foreground">{grade.improvements.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : <p className="text-sm text-muted-foreground">A API não retornou sugestões de melhoria.</p>}</section>{grade.topicsToReview.length > 0 && <section className="mt-4"><h3 className="font-display m-0 text-base font-bold">Tópicos para rever</h3><div className="mt-2 flex flex-wrap gap-2">{grade.topicsToReview.map((topic, index) => <span key={`${topic}-${index}`} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{topic}</span>)}</div></section>}<section className="mt-4 rounded-xl border border-border p-4"><h3 className="m-0 text-sm font-bold">Resposta esperada pela API</h3><p className="mb-0 mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{grade.expectedAnswer}</p></section><Button onClick={closeChallenge} className="mt-5 w-full" testId="button-close-challenge-grade">Concluir</Button></div> : <div><div className="mb-2 text-[10px] font-bold uppercase tracking-[.17em] text-primary">{currentChallenge.topic}</div><p className="text-sm leading-relaxed">{currentChallenge.prompt}</p><div className="rounded-xl bg-muted/65 p-4"><h3 className="m-0 text-xs font-bold uppercase tracking-wide">Critérios da atividade</h3><ul className="mb-0 mt-2 space-y-1 pl-5 text-sm text-muted-foreground">{currentChallenge.rubric.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div><label className="mt-4 block"><span className="mb-1.5 block text-xs font-bold">Sua resposta</span><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} maxLength={12000} rows={7} className="w-full resize-y rounded-xl border border-input bg-card p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring" placeholder="Escreva sua tentativa. A resposta esperada não é exibida antes da avaliação." data-testid="input-challenge-answer" /><span className="mt-1 block text-right text-[11px] text-muted-foreground">{answer.length.toLocaleString('pt-BR')} / 12.000</span></label>{error && <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}<div className="mt-4 flex items-center justify-between gap-3"><span className="text-[11px] text-muted-foreground">Sua resposta será enviada para avaliação.</span><Button onClick={submitAnswer} disabled={!answer.trim() || gradeMutation.isPending || !statusQuery.data?.configured || !challengeMaterial} testId="button-submit-challenge">{gradeMutation.isPending ? <><LoaderCircle size={16} className="animate-spin" />Avaliando…</> : <>Enviar resposta <ArrowRight size={15} /></>}</Button></div></div>}</Modal>}
  </div>;
}

function PerformancePage({ state }: { state: StoredState }) {
  const quizCount = state.quizAttempts.length;
  const questionCount = state.quizAttempts.reduce((total, attempt) => total + attempt.total, 0);
  const correctCount = state.quizAttempts.reduce((total, attempt) => total + attempt.score, 0);
  const average = questionCount ? Math.round((correctCount / questionCount) * 100) : null;
  const grades = state.challengeAttempts.map((attempt) => attempt.grade.score);
  const challengeAverage = grades.length ? Math.round(grades.reduce((sum, score) => sum + score, 0) / grades.length) : null;
  const topics = [...new Set(state.challengeAttempts.flatMap((attempt) => attempt.grade.topicsToReview))];
  const allAttempts = [...state.quizAttempts.map((attempt) => ({ title: attempt.quizTitle, type: 'Quiz', detail: `${attempt.score} de ${attempt.total} respostas corretas`, date: attempt.completedAt })), ...state.challengeAttempts.map((attempt) => ({ title: attempt.challengeTitle, type: 'Desafio', detail: `${attempt.grade.score} / 100 · avaliação recebida`, date: attempt.completedAt }))].sort((a, b) => b.date.localeCompare(a.date));
  return <div className="page-enter"><PageTitle eyebrow="Seu percurso real" title="Desempenho" description="Seu progresso, com base no que você já concluiu." />
    {allAttempts.length ? <>
      <div className="mb-6 grid gap-3 sm:grid-cols-3"><MetricCard label="Tentativas concluídas" value={allAttempts.length.toString()} note="Quizzes e desafios avaliados" icon={CheckCircle2} /><MetricCard label="Acerto em quizzes" value={average === null ? '—' : `${average}%`} note={quizCount ? `${correctCount} acertos em ${questionCount} questões` : 'Ainda sem quizzes concluídos'} icon={CircleHelp} /><MetricCard label="Média dos desafios" value={challengeAverage === null ? '—' : `${challengeAverage}`} note={challengeAverage === null ? 'Ainda sem desafios avaliados' : `${grades.length} avaliações reais`} icon={ClipboardList} /></div>
      <div className="grid gap-5 lg:grid-cols-[1fr_.85fr]"><section className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6"><div className="mb-5"><div className="text-[10px] font-bold uppercase tracking-[.17em] text-primary">Histórico</div><h2 className="font-display mb-0 mt-1 text-xl font-extrabold tracking-tight">Atividades concluídas</h2></div><div className="divide-y divide-border">{allAttempts.map((attempt, index) => <div key={`${attempt.date}-${index}`} className="flex items-center gap-3 py-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">{attempt.type === 'Quiz' ? <CircleHelp size={17} /> : <ClipboardList size={17} />}</span><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{attempt.title}</div><div className="mt-0.5 text-xs text-muted-foreground">{attempt.type} · {attempt.detail}</div></div><span className="hidden text-[11px] text-muted-foreground sm:block">{dateLabel(attempt.date)}</span></div>)}</div></section><section className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6"><div className="text-[10px] font-bold uppercase tracking-[.17em] text-primary">Revisão sugerida</div><h2 className="font-display mb-0 mt-1 text-xl font-extrabold tracking-tight">Tópicos para retomar</h2>{topics.length ? <><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Derivados das avaliações reais dos seus desafios.</p><div className="mt-4 flex flex-wrap gap-2">{topics.map((topic) => <span key={topic} className="rounded-full border border-border bg-muted/70 px-3 py-1.5 text-xs font-semibold">{topic}</span>)}</div></> : <div className="mt-5 rounded-xl border border-dashed border-border p-5"><p className="m-0 text-sm font-semibold">Sem tópicos de revisão registrados.</p><p className="mb-0 mt-1 text-xs text-muted-foreground">Quando uma avaliação real indicar tópicos, eles aparecem aqui.</p></div>}<div className="mt-5 border-t border-border pt-4"><div className="mb-1 flex items-center justify-between text-xs"><span className="text-muted-foreground">Questões respondidas</span><span className="font-bold">{questionCount}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: average === null ? '0%' : `${average}%` }} /></div><p className="mb-0 mt-2 text-[11px] text-muted-foreground">{average === null ? 'Conclua um quiz para registrar seu desempenho.' : `Baseado em ${quizCount} ${quizCount === 1 ? 'tentativa' : 'tentativas'} concluídas.`}</p></div></section></div>
    </> : <EmptyState icon={Gauge} title="Seu desempenho começa com uma tentativa" text="Depois que você concluir um quiz ou receber uma avaliação de desafio, seus dados reais aparecem aqui. Nada é preenchido antes disso." action={<Link href="/quizzes" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground no-underline" data-testid="link-performance-quizzes">Ver quizzes <ArrowRight size={15} /></Link>} />}
    <p className="mt-6 text-[11px] text-muted-foreground">Seus dados de desempenho ficam salvos localmente neste navegador.</p>
  </div>;
}
function MetricCard({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
  return <div className="rounded-2xl border border-border/70 bg-card p-4"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-semibold text-muted-foreground">{label}</span><Icon size={17} className="text-primary" /></div><div className="font-display text-3xl font-extrabold tracking-tight">{value}</div><p className="mb-0 mt-1 text-[11px] text-muted-foreground">{note}</p></div>;
}

function StudyApp() {
  const { state, setState, storageError } = useLocalStudy();
  const statusQuery = useGetStudyAiStatus({ query: { queryKey: getGetStudyAiStatusQueryKey(), retry: 1 } });
  const chat = useChatSession(state.materials, statusQuery.data?.configured === true);
  return <AppFrame statusQuery={statusQuery} storageError={storageError}><Switch>
    <Route path="/"><Home state={state} statusQuery={statusQuery} chat={chat} /></Route>
    <Route path="/chat"><ChatPage materials={state.materials} statusQuery={statusQuery} chat={chat} /></Route>
    <Route path="/materiais"><MaterialsPage state={state} setState={setState} /></Route>
    <Route path="/resumos"><SummariesPage state={state} setState={setState} statusQuery={statusQuery} /></Route>
    <Route path="/quizzes"><QuizzesPage state={state} setState={setState} statusQuery={statusQuery} /></Route>
    <Route path="/desafios"><ChallengesPage state={state} setState={setState} statusQuery={statusQuery} /></Route>
    <Route path="/desempenho"><PerformancePage state={state} /></Route>
    <Route><NotFound /></Route>
  </Switch></AppFrame>;
}

function App() {
  return <QueryClientProvider client={queryClient}><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><StudyApp /></WouterRouter></QueryClientProvider>;
}

export default App;
