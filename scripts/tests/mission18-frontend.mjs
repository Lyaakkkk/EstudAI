import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import assert from 'node:assert/strict';

const results = [];
const context = { exports: {}, Headers, Response, Request, URL, Error, TypeError, Blob, FormData, URLSearchParams, ArrayBuffer, Uint8Array, TextDecoder, TextEncoder,
  fetch: async () => { throw Error('No external transport permitted'); } };
vm.createContext(context);
vm.runInContext(ts.transpileModule(fs.readFileSync('lib/api-client-react/src/custom-fetch.ts', 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText, context);
for (const [file, name] of [['artifacts/estudai-web/src/App.tsx', 'generationErrorMessage'], ['artifacts/estudai-web/src/pages/chat.tsx', 'chatErrorMessage']]) {
  const source = fs.readFileSync(file, 'utf8');
  const fn = source.match(new RegExp('function ' + name + '\\([\\s\\S]*?\\n\\}'))?.[0];
  assert.ok(fn);
  vm.runInContext(ts.transpileModule(fn, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, context);
}
for (const [code, status, message] of [
  ['AI_DAILY_LIMIT', 429, 'A cota diária do assistente foi utilizada.'],
  ['AI_WINDOW_LIMIT', 429, 'O assistente recebeu muitos pedidos.'],
  ['AI_BUDGET_UNAVAILABLE', 503, 'Não foi possível verificar a cota do assistente.'],
  ['AI_DISABLED', 503, 'Os recursos de IA estão temporariamente pausados.'],
  ['AI_BUSY', 503, 'O assistente está atendendo outras solicitações.'],
]) {
  context.fetch = async () => new Response(JSON.stringify({ code, message }), {
    status, headers: { 'content-type': 'application/json', 'retry-after': '60' },
  });
  let error;
  try { await context.exports.customFetch('http://127.0.0.1/test', { method: 'POST' }); } catch (caught) { error = caught; }
  assert.ok(error instanceof context.exports.ApiError);
  assert.equal(error.status, status); assert.equal(error.data.code, code); assert.equal(error.headers.get('retry-after'), '60');
  assert.equal(context.chatErrorMessage(error), message);
  assert.ok(context.generationErrorMessage(error).includes(message));
  results.push(code + ': ApiError retains code/status/retry; both UI formatters retain message');
}
fs.mkdirSync('validation-missao18', { recursive: true });
fs.writeFileSync('validation-missao18/frontend-results.json', JSON.stringify({ passed: results.length,
  scope: 'Actual customFetch and extracted actual UI error formatters in VM. No browser rendering.', results }, null, 2));
console.log(results.length + ' frontend error checks passed');
