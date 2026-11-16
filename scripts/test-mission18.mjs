import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

// Parent-owned fake remote ledger survives API child restarts. No real Redis/Lua.
const key = 'estudai:mission18:' + randomUUID();
const source = { title: 'Teste', text: 'Material isolado', difficulty: 'iniciante' };
const requests = [
  ['summaries', source],
  ['quizzes', { ...source, questionCount: 5 }],
  ['challenges', { ...source, challengeType: 'logica' }],
  ['challenges/grade', { ...source, challenge: { id: '1', title: 'Teste', type: 'logica', prompt: 'Teste', rubric: ['Teste'], expectedAnswer: 'Teste', topic: 'Teste' }, answer: 'Teste' }],
  ['chat', { messages: [{ role: 'user', content: 'Teste' }] }],
];
const results = [];
let child, base, provider = 0, reservations = 0;
let mode = 'ok', ledger = { calls: 0, input: 0, output: 0, used: 0 };
let cap = { calls: 20, input: 8388608, output: 65536, used: 6 };
async function stop() {
  if (!child) return;
  const current = child; child = undefined;
  if (current.exitCode !== null || current.signalCode !== null) return;
  const exited = once(current, 'exit'); current.kill(); await exited;
}
async function start(enabled = true) {
  await stop();
  child = fork('artifacts/api-server/dist/index.mjs', [], {
    execArgv: ['--import', pathToFileURL(path.resolve('scripts/tests/mission18-preload.mjs')).href],
    env: { ...process.env, NODE_ENV: 'production', PORT: '19318', SERVE_WEB: 'false', TRUST_PROXY_HOPS: '0',
      AI_ENABLED: String(enabled), AI_ACCESS_MODE: 'public', AI_QUOTA_STORE: 'upstash', AI_QUOTA_KEY: key,
      UPSTASH_REDIS_REST_URL: 'https://mission18-test.upstash.io', UPSTASH_REDIS_REST_TOKEN: 'FAKE_TOKEN', GEMINI_API_KEY: 'FAKE_KEY',
      AI_DAILY_PROVIDER_LIMIT: '20', AI_DAILY_INPUT_BYTES: '8388608', AI_DAILY_OUTPUT_TOKENS: '65536', AI_PROVIDER_WINDOW_LIMIT: '6', AI_MAX_CONCURRENT: '1' },
    stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
  });
  child.on('message', message => {
    if (message.type === 'provider') { provider++; return; }
    assert.equal(message.type, 'reserve'); reservations++;
    const c = message.command;
    assert.equal(c[0], 'EVAL'); assert.equal(c[2], '1'); assert.equal(c[3], key);
    let result = [1, 0];
    if (mode === 'paused') result = [0, 15];
    else if (mode === 'missing' || mode === 'corrupt') result = [-1, 60];
    else if (ledger.used >= cap.used) result = [3, 300];
    else if (ledger.calls >= cap.calls || ledger.input + +c[8] > cap.input || ledger.output + +c[9] > cap.output) result = [2, 3600];
    if (mode === 'ok' && result[0] === 1) {
      ledger.calls++; ledger.used++; ledger.input += +c[8]; ledger.output += +c[9];
    }
    child.send({ id: message.id, networkError: mode === 'offline', status: mode === 'http429' ? 429 : 200,
      body: mode === 'malformed' ? { result: 'invalid' } : { result } });
  });
  child.stderr.on('data', data => process.stderr.write(data));
  base = 'http://127.0.0.1:19318';
  for (let i = 0; i < 80; i++) {
    assert.equal(child.exitCode, null, 'API exited before readiness');
    try { if ((await fetch(base + '/api/healthz')).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('API readiness timeout');
}
async function post(route, body) {
  return fetch(base + '/api/study/' + route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
try {
  for (const [scenario, code, status] of [
    ['paused', 'AI_DISABLED', 503], ['offline', 'AI_BUDGET_UNAVAILABLE', 503],
    ['http429', 'AI_BUDGET_UNAVAILABLE', 503], ['malformed', 'AI_BUDGET_UNAVAILABLE', 503],
    ['missing', 'AI_BUDGET_UNAVAILABLE', 503], ['corrupt', 'AI_BUDGET_UNAVAILABLE', 503],
    ['daily', 'AI_DAILY_LIMIT', 429], ['window', 'AI_WINDOW_LIMIT', 429],
  ]) {
    mode = ['daily', 'window'].includes(scenario) ? 'ok' : scenario;
    ledger = { calls: scenario === 'daily' ? 20 : 0, input: 0, output: 0, used: scenario === 'window' ? 6 : 0 };
    await start(); const before = provider;
    for (const [route, body] of requests) {
      const response = await post(route, body);
      assert.equal(response.status, status, scenario + ': ' + route);
      const error = await response.json(); assert.equal(error.code, code);
      assert.ok(error.message.length > 10); assert.ok(Number(response.headers.get('retry-after')) > 0);
      assert.ok(!JSON.stringify(error).includes('FAKE_'));
      results.push(scenario + ': ' + route);
    }
    assert.equal(provider, before, 'Denied request reached provider');
  }
  for (const dimension of ['calls', 'input', 'output', 'used']) {
    mode = 'ok'; ledger = { calls: 0, input: 0, output: 0, used: 0 };
    cap = { calls: 20, input: 8388608, output: 65536, used: 6 };
    await start();
    const response = await post('summaries', source); assert.equal(response.status, 200);
    assert.equal((await response.json()).title, 'Teste');
    assert.equal(ledger.calls, 1); assert.ok(ledger.input > 0); assert.equal(ledger.output, 8192); assert.equal(ledger.used, 1);
    cap[dimension] = ledger[dimension]; const saved = { ...ledger }; const before = provider;
    await start();
    const denied = await post('chat', requests[4][1]);
    assert.equal(denied.status, 429);
    assert.equal((await denied.json()).code, dimension === 'used' ? 'AI_WINDOW_LIMIT' : 'AI_DAILY_LIMIT');
    assert.deepEqual(ledger, saved); assert.equal(provider, before);
    results.push('Process restart preserves remote ' + dimension + ' limit');
  }
  await start(false); const before = reservations;
  for (const [route, body] of requests) {
    const response = await post(route, body); assert.equal(response.status, 503);
    assert.equal((await response.json()).code, 'AI_DISABLED');
  }
  assert.equal(reservations, before); results.push('Environment pause blocks all five routes before Redis');
  fs.mkdirSync('validation-missao18', { recursive: true });
  fs.writeFileSync('validation-missao18/integration-results.json', JSON.stringify({
    passed: results.length, scope: 'Real built Express API, isolated child processes, mocked REST ledger and Gemini. No live Redis/Lua or Gemini requests.',
    results, simulatedProviderCalls: provider, simulatedReservations: reservations,
  }, null, 2));
  console.log(results.length + ' mission18 integration checks passed');
} finally { await stop(); }
