import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { fork } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// All credentials and transports in this test are fictional. No external fetch.
const token = 'a'.repeat(64);
const hash = createHash('sha256').update(token).digest('hex');
const key = 'estudai:mission28:' + randomUUID();
const source = { title: 'Teste', text: 'Material ficticio', difficulty: 'iniciante' };
const requests = [
  ['summaries', source], ['quizzes', { ...source, questionCount: 5 }],
  ['challenges', { ...source, challengeType: 'logica' }],
  ['challenges/grade', { ...source, challenge: { id: '1', title: 'Teste', type: 'logica', prompt: 'Teste', rubric: ['Teste'], expectedAnswer: 'Teste', topic: 'Teste' }, answer: 'Teste' }],
  ['chat', { messages: [{ role: 'user', content: 'Teste' }] }],
];
const base = 'http://127.0.0.1:19328';
let child, logs = '', redis = 0, gemini = 0, checks = 0;
async function stop() {
  if (!child) return;
  const current = child; child = undefined;
  if (current.exitCode === null && current.signalCode === null) {
    const exited = once(current, 'exit'); current.kill(); await exited;
  }
  assert.ok(!logs.includes(token), 'Validation credential appeared in API logs');
}
async function start({ mode = 'validation', digest = hash, enabled = true, remote = 'ok' } = {}) {
  await stop(); logs = ''; redis = 0; gemini = 0;
  const env = { ...process.env, NODE_ENV: 'production', PORT: '19328', SERVE_WEB: 'true', TRUST_PROXY_HOPS: '0',
    AI_ACCESS_MODE: mode, AI_VALIDATION_TOKEN_SHA256: digest, AI_ENABLED: String(enabled), AI_QUOTA_STORE: 'upstash',
    AI_QUOTA_KEY: key, UPSTASH_REDIS_REST_URL: 'https://mission18-test.upstash.io', UPSTASH_REDIS_REST_TOKEN: 'FAKE_TOKEN', GEMINI_API_KEY: 'FAKE_KEY',
    AI_MAX_CONCURRENT: '1', AI_DAILY_PROVIDER_LIMIT: '20', AI_DAILY_INPUT_BYTES: '8388608', AI_DAILY_OUTPUT_TOKENS: '65536', AI_PROVIDER_WINDOW_LIMIT: '6' };
  if (mode === 'default') delete env.AI_ACCESS_MODE;
  child = fork('artifacts/api-server/dist/index.mjs', [], {
    execArgv: ['--import', pathToFileURL(path.resolve('scripts/tests/mission18-preload.mjs')).href],
    env, stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  });
  child.stdout.on('data', data => { logs += data; }); child.stderr.on('data', data => { logs += data; });
  child.on('message', message => {
    if (message.type === 'provider') { gemini++; return; }
    assert.equal(message.type, 'reserve'); redis++;
    assert.equal(message.command[0], 'EVAL'); assert.equal(message.command[3], key);
    child.send({ id: message.id, body: { result: remote === 'ok' ? [1, 0] : [-1, 60] } });
  });
  for (let i = 0; i < 80; i++) {
    assert.equal(child.exitCode, null, 'API exited before readiness');
    try { if ((await fetch(base + '/api/healthz')).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw Error('API startup timeout');
}
async function post(route, body, { authorization, cookie } = {}) {
  return fetch(base + '/api/' + route, { method: 'POST', headers: { 'Content-Type': 'application/json',
    ...(authorization ? { Authorization: authorization } : {}), ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) });
}
async function expectError(response, status, code) {
  assert.equal(response.status, status); const body = await response.json();
  assert.equal(body.code, code); assert.ok(body.message.length > 10); assert.ok(!JSON.stringify(body).includes(token)); checks++;
}
try {
  await start();
  for (const [route, body] of requests) {
    await expectError(await post('study/' + route, body), 403, 'AI_VALIDATION_REQUIRED');
    await expectError(await post('study/' + route, body, { authorization: 'Bearer ' + 'b'.repeat(64) }), 403, 'AI_VALIDATION_REQUIRED');
  }
  for (const route of ['STUDY/CHAT/', 'study/Summaries/', 'study/challenges/GRADE/']) {
    await expectError(await post(route, requests[4][1]), 403, 'AI_VALIDATION_REQUIRED');
  }
  await expectError(await post('study/chat?token=' + token, requests[4][1]), 403, 'AI_VALIDATION_REQUIRED');
  await expectError(await post('study/chat', { ...requests[4][1], token }), 403, 'AI_VALIDATION_REQUIRED');
  await expectError(await post('study/chat', requests[4][1], { cookie: 'token=' + token }), 403, 'AI_VALIDATION_REQUIRED');
  assert.equal(redis, 0); assert.equal(gemini, 0);
  for (const route of ['/', '/chat', '/materiais', '/resumos', '/quizzes', '/desafios', '/desempenho']) {
    const response = await fetch(base + route); assert.equal(response.status, 200);
    assert.ok((await response.text()).includes('<div id="root">')); checks++;
  }
  assert.equal((await fetch(base + '/api/healthz')).status, 200); checks++;
  assert.equal((await fetch(base + '/api/study/ai-status')).status, 200); checks++;
  for (const [route] of requests) {
    const response = await post('study/' + route, {}, { authorization: 'Bearer ' + token });
    assert.equal(response.status, 400); checks++;
  }
  assert.equal(redis, 0); assert.equal(gemini, 0);
  const response = await post('study/chat', requests[4][1], { authorization: 'Bearer ' + token });
  assert.equal(response.status, 200); assert.equal((await response.json()).reply, 'Resposta simulada');
  assert.equal(redis, 1); assert.equal(gemini, 1); checks++;

  await start({ enabled: false });
  for (const [route, body] of requests) await expectError(await post('study/' + route, body, { authorization: 'Bearer ' + token }), 503, 'AI_DISABLED');
  assert.equal(redis, 0); assert.equal(gemini, 0);
  for (const settings of [{ mode: 'default', digest: '' }, { digest: 'invalid' }, { mode: 'unknown' }]) {
    await start(settings);
    for (const [route, body] of requests) await expectError(await post('study/' + route, body, { authorization: 'Bearer ' + token }), 503, 'AI_VALIDATION_UNAVAILABLE');
    assert.equal(redis, 0); assert.equal(gemini, 0);
  }
  await start({ remote: 'unavailable' });
  await expectError(await post('study/chat', requests[4][1], { authorization: 'Bearer ' + token }), 503, 'AI_BUDGET_UNAVAILABLE');
  assert.equal(redis, 1); assert.equal(gemini, 0);
  await start({ mode: 'public', digest: '', enabled: false });
  await expectError(await post('study/chat', requests[4][1]), 503, 'AI_DISABLED');
  assert.equal(redis, 0); assert.equal(gemini, 0);
  console.log(checks + ' access-gate checks passed; all provider/quota requests simulated.');
} finally { await stop(); }
