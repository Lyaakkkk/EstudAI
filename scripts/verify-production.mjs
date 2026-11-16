import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const port = 19315;
const base = 'http://127.0.0.1:' + port;
const child = spawn(process.execPath, ['artifacts/api-server/dist/index.mjs'], {
  env: { ...process.env, NODE_ENV: 'production', PORT: String(port), SERVE_WEB: 'true', TRUST_PROXY_HOPS: '0',
    GEMINI_API_KEY: '', AI_ENABLED: 'false', AI_QUOTA_STORE: 'upstash', AI_BUDGET_FILE: '', UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = ''; child.stdout.on('data', data => { output += data; }); child.stderr.on('data', data => { output += data; });
let exited = false; child.on('exit', () => { exited = true; });
const results = [];
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    if (exited) throw new Error('Production start failed: ' + output.slice(-1200));
    try { const r = await fetch(base + '/api/healthz'); if (r.status === 200) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, 'Production service did not start');
  for (const route of ['/', '/chat', '/materiais', '/resumos', '/quizzes', '/desafios', '/desempenho']) {
    const r = await fetch(base + route, { headers: { Accept: 'text/html' } });
    const body = await r.text(); assert.equal(r.status, 200); assert.ok(body.includes('<div id="root">'));
    assert.ok(body.includes('estudai-icon-dark.svg')); results.push({ route, status: 200 });
  }
  for (const asset of ['estudai-logo-light.svg','estudai-logo-dark.svg','estudai-sparkle-light.svg','estudai-sparkle-dark.svg','estudai-icon-light.svg','estudai-icon-dark.svg']) {
    const r = await fetch(base + '/brand/' + asset); assert.equal(r.status, 200);
    assert.equal(await r.text(), fs.readFileSync('artifacts/estudai-web/public/brand/' + asset, 'utf8'));
    results.push({ asset, status: 200 });
  }
  for (const route of ['/api/missing', '/.env', '/assets/missing.js']) {
    const r = await fetch(base + route); assert.equal(r.status, 404); results.push({ route, status: 404 });
  }
  const status = await fetch(base + '/api/study/ai-status'); assert.equal((await status.json()).configured, false);
  const bad = await fetch(base + '/api/study/chat', {method:'POST',headers:{'Content-Type':'application/json'},body:'{'});
  assert.equal(bad.status, 400); assert.equal((await bad.json()).code, 'INVALID_JSON');
  const withoutKey = await fetch(base + '/api/study/chat', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'Teste sem chave.'}]})});
  assert.equal(withoutKey.status, 503); assert.equal((await withoutKey.json()).code, 'AI_DISABLED');
  console.log(JSON.stringify({passed:true,platform:process.platform,node:process.version,scope:'Built web/API on same origin. No Gemini calls and no browser rendering.',checks:results.length+3,results}));
} finally {
  child.kill('SIGTERM');
  await new Promise(resolve => { if (exited) resolve(); else { const timer=setTimeout(resolve,3000); child.once('exit',()=>{clearTimeout(timer);resolve();}); } });
}
