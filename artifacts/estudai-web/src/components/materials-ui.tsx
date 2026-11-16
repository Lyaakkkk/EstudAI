import { useEffect, useState } from 'react';
import { Download, ExternalLink, X } from 'lucide-react';
import { applySuggestion, formatTags, parseTags, splitFragment, suggestTags, tagKey } from '@/lib/tags';

export type ViewerMaterial = {
  id: string;
  title: string;
  sourceType: 'texto' | 'pdf' | 'imagem';
  text?: string;
  fileName?: string;
  mimeType?: string;
  base64?: string;
  tags?: string[];
};

/** Etiqueta @ (clicável quando recebe onClick). */
export function TagChip({ tag, active, count, onClick }: { tag: string; active?: boolean; count?: number; onClick?: () => void }) {
  const base = 'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold';
  const tone = active ? 'bg-primary text-primary-foreground' : 'bg-accent/50 text-accent-foreground';
  if (!onClick) return <span className={`${base} ${tone}`}>@{tag}</span>;
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`${base} ${tone} transition-colors ${active ? '' : 'hover:bg-accent'}`} data-testid={`tag-filter-${tag}`}>
      @{tag}
      {count !== undefined && <span className="opacity-70">{count}</span>}
    </button>
  );
}

/** Campo de tags: digite @prova @biologia ou toque nas tags que já existem. */
export function TagField({ value, onChange, suggestions, testId }: { value: string; onChange: (value: string) => void; suggestions: string[]; testId?: string }) {
  const options = suggestTags(value, suggestions);
  const typed = splitFragment(value).fragment;
  const known = new Set(suggestions.map(tagKey));
  const fresh = parseTags(value, suggestions).filter((tag) => !known.has(tagKey(tag)));
  return (
    <div>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="@prova @biologia" autoCapitalize="none" autoCorrect="off" className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" data-testid={testId} />
      {options.length > 0 && (
        <div className="mt-2.5">
          <div className="mb-1.5 text-[11px] font-semibold text-muted-foreground">{typed ? 'Tags parecidas' : 'Tags que você já usa — toque para adicionar'}</div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Seleção rápida de tags">
            {options.map((tag) => <TagChip key={tag} tag={tag} onClick={() => onChange(applySuggestion(value, tag))} />)}
          </div>
        </div>
      )}
      {fresh.length > 0 && <p className="mb-0 mt-2 text-[11px] text-muted-foreground">Nova{fresh.length > 1 ? 's' : ''}: {fresh.map((tag) => `@${tag}`).join(' ')}. Vai aparecer na lista da próxima vez.</p>}
      {options.length === 0 && suggestions.length === 0 && <p className="mb-0 mt-1.5 text-[11px] text-muted-foreground">Separe com espaço. Ex.: @prova @biologia</p>}
    </div>
  );
}

function base64ToBlobUrl(base64: string, type: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return URL.createObjectURL(new Blob([bytes], { type }));
}

/** Abre o material na própria página: texto, imagem ou PDF. Também permite editar as tags. */
export function MaterialViewer({ material, allTags, onClose, onSaveTags }: { material: ViewerMaterial; allTags: string[]; onClose: () => void; onSaveTags: (id: string, tags: string[]) => void }) {
  const [tagsText, setTagsText] = useState(formatTags(material.tags));
  const [saved, setSaved] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (material.sourceType !== 'pdf' || !material.base64) { setPdfUrl(''); return undefined; }
    try {
      const url = base64ToBlobUrl(material.base64, 'application/pdf');
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    } catch {
      setPdfUrl('');
      return undefined;
    }
  }, [material.sourceType, material.base64]);

  const saveTags = () => {
    const tags = parseTags(tagsText, allTags);
    onSaveTags(material.id, tags);
    setTagsText(formatTags(tags));
    setSaved(true);
  };

  const imageSrc = material.sourceType === 'imagem' && material.base64 ? `data:${material.mimeType || 'image/png'};base64,${material.base64}` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay/45 backdrop-blur-[2px] sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={material.title} className="flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-border bg-background shadow-2xl sm:max-w-[920px] sm:rounded-[28px]">
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-5 sm:px-7">
          <div className="min-w-0">
            <h2 className="font-display m-0 truncate text-xl">{material.title}</h2>
            <p className="mb-0 mt-0.5 text-xs text-muted-foreground">{material.fileName || (material.text ? `${material.text.length.toLocaleString('pt-BR')} caracteres` : 'Texto')}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {pdfUrl && <a href={pdfUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-secondary px-3 text-xs font-semibold text-primary no-underline hover:bg-accent" data-testid="link-open-pdf"><ExternalLink size={14} />Nova aba</a>}
            {pdfUrl && <a href={pdfUrl} download={material.fileName || `${material.title}.pdf`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-secondary px-3 text-xs font-semibold text-primary no-underline hover:bg-accent" data-testid="link-download-pdf"><Download size={14} />Baixar</a>}
            {imageSrc && <a href={imageSrc} download={material.fileName || material.title} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-secondary px-3 text-xs font-semibold text-primary no-underline hover:bg-accent"><Download size={14} />Baixar</a>}
            <button type="button" onClick={onClose} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary hover:bg-accent" data-testid="button-close-viewer"><X size={17} /></button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-7">
          {material.sourceType === 'texto' && <div className="max-h-[56dvh] overflow-y-auto whitespace-pre-wrap rounded-2xl bg-card p-5 text-[15px] leading-relaxed">{material.text}</div>}
          {imageSrc && <div className="rounded-2xl bg-card p-3"><img src={imageSrc} alt={material.title} className="mx-auto max-h-[60dvh] rounded-xl object-contain" /></div>}
          {material.sourceType === 'pdf' && (pdfUrl ? <iframe src={pdfUrl} title={material.title} className="h-[62dvh] w-full rounded-2xl border border-border bg-card" /> : <p className="rounded-2xl bg-card p-5 text-sm text-muted-foreground">Não foi possível exibir este PDF.</p>)}

          <div className="mt-5">
            <span className="mb-1.5 block text-xs font-bold">Tags</span>
            <TagField value={tagsText} onChange={(value) => { setTagsText(value); setSaved(false); }} suggestions={allTags} testId="input-viewer-tags" />
            <button type="button" onClick={saveTags} className="mt-3 inline-flex h-10 items-center rounded-xl bg-secondary px-4 text-[13px] font-bold text-foreground hover:bg-accent" data-testid="button-save-tags">{saved ? 'Salvo ✓' : 'Salvar tags'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
