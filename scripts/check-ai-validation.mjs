import path from 'node:path';
import { pathToFileURL } from 'node:url';

const base = 'https://estudai-web-api.onrender.com';
const routes = ['chat', 'summaries', 'quizzes', 'challenges', 'challenges/grade'];

/** Invalid payloads intentionally cannot generate content, even without the gate. */
export async function checkAiValidation(token, transport = fetch) {
  if (!/^[a-f0-9]{64}$/i.test(token || '')) throw Error('VALIDATION_TOKEN_REQUIRED');
  const result = [];
  for (const route of routes) {
    for (const authorized of [false, true]) {
      const response = await transport(base + '/api/study/' + route, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000),
        headers: { 'Content-Type': 'application/json', ...(authorized ? { Authorization: 'Bearer ' + token } : {}) },
        body: '{}',
      });
      // Do not print response bodies or exceptions, which could echo request details.
      const expected = authorized ? 400 : 403;
      await response.body?.cancel();
      if (response.status !== expected) throw Error('ACCESS_CHECK_FAILED');
      result.push({ route, authorized, status: response.status });
    }
  }
  return { code: 'VALIDATION_ACCESS_CONFIRMED', checks: result.length, generationAttempts: 0, result };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try { console.log(JSON.stringify(await checkAiValidation(process.env.AI_VALIDATION_TOKEN))); }
  catch { console.error('ACCESS_CHECK_FAILED: confira a configuracao sem compartilhar token ou resposta bruta.'); process.exitCode = 1; }
}
