import { reserveRemote, validRemote, type QuotaDecision } from './quota-upstash';
﻿import fs from 'node:fs';
import path from 'node:path';

export class AiUsageError extends Error {
  constructor(readonly code: string, readonly status: number, readonly retryAfter: number, message: string) { super(message); }
}
function positive(name: string, fallback: number, ceiling: number) {
  const raw = process.env[name] ?? String(fallback);
  if (!/^\d+$/.test(raw) || +raw < 1 || +raw > ceiling) throw new Error('Invalid AI safety setting: ' + name);
  return +raw;
}
const maxDaily = positive('AI_DAILY_PROVIDER_LIMIT', 20, 10000);
const maxInput = positive('AI_DAILY_INPUT_BYTES', 8 * 1024 * 1024, 1024 * 1024 * 1024);
const maxOutput = positive('AI_DAILY_OUTPUT_TOKENS', 65536, 10000000);
const maxWindow = positive('AI_PROVIDER_WINDOW_LIMIT', 6, 1000);
const maxConcurrent = positive('AI_MAX_CONCURRENT', 1, 10);
const windowMs = 15 * 60 * 1000;
const production = process.env.NODE_ENV === 'production';
const store = process.env.AI_QUOTA_STORE || (production ? 'disabled' : 'file');
if (!['disabled','file','upstash'].includes(store)) throw new Error('Invalid AI_QUOTA_STORE');
const remote = { url: process.env.UPSTASH_REDIS_REST_URL || '', token: process.env.UPSTASH_REDIS_REST_TOKEN || '', key: process.env.AI_QUOTA_KEY || 'estudai:ai:quota:v1', daily: maxDaily, input: maxInput, output: maxOutput, window: maxWindow };
const configuredFile = process.env.AI_BUDGET_FILE;
export function getAiGuardStatus(): 'ready' | 'paused' | 'unavailable' {
  if ((process.env.AI_ENABLED ?? (production ? 'false' : 'true')) !== 'true' || store === 'disabled') return 'paused';
  if (store === 'upstash' && !validRemote(remote)) return 'unavailable';
  return 'ready';
}
function ensureEnabled() {
  const state = getAiGuardStatus();
  if (state === 'paused') throw new AiUsageError('AI_DISABLED', 503, 60, 'Os recursos de IA estão temporariamente pausados. Seus materiais e histórico continuam disponíveis.');
  if (state === 'unavailable') throw new AiUsageError('AI_BUDGET_UNAVAILABLE', 503, 60, 'O assistente está temporariamente indisponível. Tente novamente mais tarde.');
}
if (production && store === 'file' && !configuredFile) throw new Error('File quota mode needs an explicit AI_BUDGET_FILE in production; use Upstash for Render Free.');
const budgetFile = path.resolve(configuredFile || '.local/ai-budget.json');
let active = 0, windowStart = 0, windowUsed = 0;

export async function withAiConcurrency<T>(job: () => Promise<T>): Promise<T> {
  ensureEnabled();
  if (active >= maxConcurrent) throw new AiUsageError('AI_BUSY', 503, 5, 'O assistente está atendendo outras solicitações. Aguarde alguns segundos e tente novamente.');
  active++;
  try { return await job(); } finally { active--; }
}

/** Reserve before EVERY actual provider attempt, including a 503 retry. One process/disk. */
export function reserveProviderAttempt(inputBytes = 0, outputTokens = 0) {
  ensureEnabled();
  if (store !== 'file') throw new AiUsageError('AI_BUDGET_UNAVAILABLE', 503, 60, 'Contador local indisponível.');
  const now = Date.now();
  if (now - windowStart >= windowMs) { windowStart = now; windowUsed = 0; }
  if (windowUsed >= maxWindow) throw new AiUsageError('AI_WINDOW_LIMIT', 429, Math.max(1, Math.ceil((windowStart + windowMs - now) / 1000)), 'O limite temporário do assistente foi atingido. Tente novamente mais tarde.');
  const day = new Date(now).toISOString().slice(0, 10);
  try {
    let used = 0, inputUsed = 0, outputUsed = 0;
    if (fs.existsSync(budgetFile)) {
      const saved = JSON.parse(fs.readFileSync(budgetFile, 'utf8')) as { day?: unknown; used?: unknown; inputBytes?: unknown; outputTokens?: unknown };
      if (typeof saved.day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(saved.day) || !Number.isSafeInteger(saved.used) || Number(saved.used) < 0) throw new Error('Invalid budget ledger');
      if (!Number.isSafeInteger(saved.inputBytes) || Number(saved.inputBytes) < 0 || !Number.isSafeInteger(saved.outputTokens) || Number(saved.outputTokens) < 0) throw new Error('Invalid budget ledger');
      if (saved.day === day) { used = Number(saved.used); inputUsed = Number(saved.inputBytes); outputUsed = Number(saved.outputTokens); }
    }
    if (used >= maxDaily || inputUsed + inputBytes > maxInput || outputUsed + outputTokens > maxOutput) {
      const reset = Date.parse(day + 'T00:00:00Z') + 86400000;
      throw new AiUsageError('AI_DAILY_LIMIT', 429, Math.max(1, Math.ceil((reset - now) / 1000)), 'O limite diário do assistente foi atingido. Tente novamente após a renovação da cota.');
    }
    fs.mkdirSync(path.dirname(budgetFile), { recursive: true });
    fs.writeFileSync(budgetFile + '.tmp', JSON.stringify({ day, used: used + 1, inputBytes: inputUsed + inputBytes, outputTokens: outputUsed + outputTokens }), { mode: 0o600 });
    fs.renameSync(budgetFile + '.tmp', budgetFile);
    windowUsed++;
  } catch (error) {
    if (error instanceof AiUsageError) throw error;
    // Never continue with an unreadable/corrupt ledger or expose filesystem details.
    throw new AiUsageError('AI_BUDGET_UNAVAILABLE', 503, 60, 'Não foi possível verificar a cota do assistente. Tente novamente mais tarde.');
  }
}

export function guardedProviderFetch(input: string, init: RequestInit) {
  const body = typeof init.body === 'string' ? init.body : '';
  const output = JSON.parse(body || '{}').generationConfig?.maxOutputTokens;
  if (!Number.isInteger(output) || output < 1 || output > 8192) throw new AiUsageError('AI_BUDGET_UNAVAILABLE', 503, 60, 'Configuração de consumo indisponível.');
  ensureEnabled();
  if (store === 'file') {
    reserveProviderAttempt(Buffer.byteLength(body, 'utf8'), output);
    return fetch(input, init);
  }
  if (remoteDenial && remoteDenial.until > Date.now()) return Promise.reject(new AiUsageError(remoteDenial.error.code, remoteDenial.error.status, Math.max(1, Math.ceil((remoteDenial.until-Date.now())/1000)), remoteDenial.error.message));
  return reserveRemote(remote, Buffer.byteLength(body, 'utf8'), output).then(decision => {
    ensureEnabled();
    if (decision.status !== 'ok') {
      const error = remoteError(decision);
      remoteDenial = { until: Date.now() + Math.min(decision.retryAfter,15)*1000, error };
      throw error;
    }
    remoteDenial = undefined;
    return fetch(input, init);
  });
}

let remoteDenial: { until: number; error: AiUsageError } | undefined;
function remoteError(decision: QuotaDecision) {
  if (decision.status === 'paused') return new AiUsageError('AI_DISABLED', 503, decision.retryAfter, 'Os recursos de IA estão temporariamente pausados. Seus dados continuam disponíveis.');
  if (decision.status === 'daily') return new AiUsageError('AI_DAILY_LIMIT', 429, decision.retryAfter, 'A cota diária do assistente foi utilizada. Tente novamente após a renovação da cota.');
  if (decision.status === 'window') return new AiUsageError('AI_WINDOW_LIMIT', 429, decision.retryAfter, 'O assistente recebeu muitos pedidos. Aguarde alguns minutos e tente novamente.');
  return new AiUsageError('AI_BUDGET_UNAVAILABLE', 503, decision.retryAfter, 'Não foi possível verificar a cota do assistente. Nenhuma chamada à IA foi iniciada. Tente novamente mais tarde.');
}
