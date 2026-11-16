const fs=require('fs');const f='artifacts/api-server/src/lib/ai-guard.ts';let s=fs.readFileSync(f,'utf8');s="import { reserveRemote, validRemote, type QuotaDecision } from './quota-upstash';\n"+s;s=s.replace("positive('AI_DAILY_PROVIDER_LIMIT', 100,","positive('AI_DAILY_PROVIDER_LIMIT', 20,").replace("positive('AI_DAILY_INPUT_BYTES', 20 *","positive('AI_DAILY_INPUT_BYTES', 8 *").replace("positive('AI_DAILY_OUTPUT_TOKENS', 100000,","positive('AI_DAILY_OUTPUT_TOKENS', 65536,").replace("positive('AI_PROVIDER_WINDOW_LIMIT', 20,","positive('AI_PROVIDER_WINDOW_LIMIT', 6,").replace("positive('AI_MAX_CONCURRENT', 2,","positive('AI_MAX_CONCURRENT', 1,");
s=s.replace("const configuredFile = process.env.AI_BUDGET_FILE;",[
"const production = process.env.NODE_ENV === 'production';",
"const store = process.env.AI_QUOTA_STORE || (production ? 'disabled' : 'file');",
"if (!['disabled','file','upstash'].includes(store)) throw new Error('Invalid AI_QUOTA_STORE');",
"const remote = { url: process.env.UPSTASH_REDIS_REST_URL || '', token: process.env.UPSTASH_REDIS_REST_TOKEN || '', key: process.env.AI_QUOTA_KEY || 'estudai:ai:quota:v1', daily: maxDaily, input: maxInput, output: maxOutput, window: maxWindow };",
"const configuredFile = process.env.AI_BUDGET_FILE;",
"export function getAiGuardStatus(): 'ready' | 'paused' | 'unavailable' {",
"  if ((process.env.AI_ENABLED ?? (production ? 'false' : 'true')) !== 'true' || store === 'disabled') return 'paused';",
"  if (store === 'upstash' && !validRemote(remote)) return 'unavailable';",
"  return 'ready';",
"}",
"function ensureEnabled() {",
"  const state = getAiGuardStatus();",
"  if (state === 'paused') throw new AiUsageError('AI_DISABLED', 503, 60, 'Os recursos de IA estão temporariamente pausados. Seus materiais e histórico continuam disponíveis.');",
"  if (state === 'unavailable') throw new AiUsageError('AI_BUDGET_UNAVAILABLE', 503, 60, 'O assistente está temporariamente indisponível. Tente novamente mais tarde.');",
"}",
].join('\n'));
s=s.replace("if (process.env.NODE_ENV === 'production' && !configuredFile)", "if (production && store === 'file' && !configuredFile)").replace("AI_BUDGET_FILE is required in production. Use a persistent disk and one API instance.","File quota mode needs an explicit AI_BUDGET_FILE in production; use Upstash for Render Free.");
s=s.replace("  if (active >= maxConcurrent)","  ensureEnabled();\n  if (active >= maxConcurrent)");
s=s.replace("export function reserveProviderAttempt(inputBytes = 0, outputTokens = 0) {","export function reserveProviderAttempt(inputBytes = 0, outputTokens = 0) {\n  ensureEnabled();\n  if (store !== 'file') throw new AiUsageError('AI_BUDGET_UNAVAILABLE', 503, 60, 'Contador local indisponível.');");
s=s.replace("  reserveProviderAttempt(Buffer.byteLength(body, 'utf8'), output);\n  return fetch(input, init);",[
"  ensureEnabled();",
"  if (store === 'file') {",
"    reserveProviderAttempt(Buffer.byteLength(body, 'utf8'), output);",
"    return fetch(input, init);",
"  }",
"  if (remoteDenial && remoteDenial.until > Date.now()) return Promise.reject(new AiUsageError(remoteDenial.error.code, remoteDenial.error.status, Math.max(1, Math.ceil((remoteDenial.until-Date.now())/1000)), remoteDenial.error.message));",
"  return reserveRemote(remote, Buffer.byteLength(body, 'utf8'), output).then(decision => {",
"    ensureEnabled();",
"    if (decision.status !== 'ok') {",
"      const error = remoteError(decision);",
"      remoteDenial = { until: Date.now() + Math.min(decision.retryAfter,15)*1000, error };",
"      throw error;",
"    }",
"    remoteDenial = undefined;",
"    return fetch(input, init);",
"  });",
].join('\n'));
s += [
"",
"let remoteDenial: { until: number; error: AiUsageError } | undefined;",
"function remoteError(decision: QuotaDecision) {",
"  if (decision.status === 'paused') return new AiUsageError('AI_DISABLED', 503, decision.retryAfter, 'Os recursos de IA estão temporariamente pausados. Seus dados continuam disponíveis.');",
"  if (decision.status === 'daily') return new AiUsageError('AI_DAILY_LIMIT', 429, decision.retryAfter, 'A cota diária do assistente foi utilizada. Tente novamente após a renovação da cota.');",
"  if (decision.status === 'window') return new AiUsageError('AI_WINDOW_LIMIT', 429, decision.retryAfter, 'O assistente recebeu muitos pedidos. Aguarde alguns minutos e tente novamente.');",
"  return new AiUsageError('AI_BUDGET_UNAVAILABLE', 503, decision.retryAfter, 'Não foi possível verificar a cota do assistente. Nenhuma chamada à IA foi iniciada. Tente novamente mais tarde.');",
"}",""
].join('\n');fs.writeFileSync(f,s);
const route='artifacts/api-server/src/routes/study.ts';s=fs.readFileSync(route,'utf8').replace("import { AiUsageError }","import { AiUsageError, getAiGuardStatus }");s=s.replace('  const configured = isGeminiConfigured();','  const guard = getAiGuardStatus();\n  const configured = isGeminiConfigured() && guard === \'ready\';');s=s.replace('      message: configured','      message: guard !== \'ready\' ? \'Os recursos de IA estão temporariamente pausados ou aguardando configuração. Materiais e histórico continuam disponíveis.\' : configured');fs.writeFileSync(route,s);
const app='artifacts/estudai-web/src/App.tsx';s=fs.readFileSync(app,'utf8');s=s.replace('O Gemini ainda não está configurado. Nenhum resultado será criado até que o serviço esteja disponível.',"{status?.message || 'Nenhum resultado será criado até que o serviço esteja disponível.'}");fs.writeFileSync(app,s);
const chat='artifacts/estudai-web/src/pages/chat.tsx';s=fs.readFileSync(chat,'utf8').replace('A IA ainda não está configurada. Nenhuma resposta será criada até que o serviço esteja disponível.',"{statusQuery.data?.message || 'Nenhuma resposta será criada até que o serviço esteja disponível.'}");fs.writeFileSync(chat,s);
