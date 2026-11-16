export const MAX_TAGS = 8;
export const MAX_TAG_LENGTH = 24;

/** Chave de comparação: sem @, minúscula e sem acento ("Genética" = "genetica"). */
export function tagKey(value: string): string {
  return value
    .replace(/^@+/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

/**
 * Transforma "@prova @biologia, genética" em ["prova", "biologia", "genética"].
 * Aceita com ou sem @, separa por espaço, vírgula ou ponto e vírgula e ignora
 * repetidas. Se uma tag já existe (mesmo sem acento ou com outra caixa),
 * reaproveita a que já existe, para os materiais ficarem agrupados.
 */
export function parseTags(input: string, known: string[] = []): string[] {
  const knownByKey = new Map(known.map((tag) => [tagKey(tag), tag]));
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const raw of input.split(/[\s,;]+/)) {
    const cleaned = raw
      .replace(/^@+/, "")
      .toLocaleLowerCase("pt-BR")
      .replace(/[^\p{L}\p{N}_-]/gu, "")
      .slice(0, MAX_TAG_LENGTH);
    if (!cleaned) continue;
    const tag = knownByKey.get(tagKey(cleaned)) ?? cleaned;
    const key = tagKey(tag);
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length >= MAX_TAGS) break;
  }
  return tags;
}

/** ["prova", "biologia"] → "@prova @biologia" */
export function formatTags(tags?: string[]): string {
  return (tags ?? []).map((tag) => `@${tag}`).join(" ");
}

/** Separa o que já foi digitado do pedaço que está sendo digitado agora. */
export function splitFragment(input: string): { head: string; fragment: string } {
  const match = input.match(/^(.*?)([^\s,;]*)$/s);
  return { head: match?.[1] ?? "", fragment: match?.[2] ?? "" };
}

/**
 * Lista de seleção rápida: tags que já existem e ainda não foram escolhidas.
 * Enquanto a pessoa digita, mostra primeiro as que começam com o que foi digitado.
 */
export function suggestTags(input: string, known: string[], limit = 12): string[] {
  const chosen = new Set(parseTags(input, known).map(tagKey));
  const { fragment } = splitFragment(input);
  const typed = tagKey(fragment);
  const available = known.filter((tag) => !chosen.has(tagKey(tag)) || (typed && tagKey(tag).startsWith(typed) && tagKey(tag) !== typed));
  if (!typed) return available.slice(0, limit);
  const starts = available.filter((tag) => tagKey(tag).startsWith(typed));
  const contains = available.filter((tag) => !tagKey(tag).startsWith(typed) && tagKey(tag).includes(typed));
  return [...starts, ...contains].slice(0, limit);
}

/** Aplica a tag escolhida: troca o pedaço digitado pela tag completa. */
export function applySuggestion(input: string, tag: string): string {
  const { head } = splitFragment(input);
  return `${head}@${tag} `;
}
