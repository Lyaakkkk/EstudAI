import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAiValidation } from '../check-ai-validation.mjs';
const token = 'a'.repeat(64);

test('preflight checks all five endpoints using only invalid, non-generating payloads', async () => {
  const calls = [];
  const result = await checkAiValidation(token, async (url, init) => {
    assert.ok(url.startsWith('https://estudai-web-api.onrender.com/api/study/'));
    assert.equal(init.body, '{}'); assert.equal(init.redirect, 'error');
    calls.push({ url, init });
    return new Response('{}', { status: init.headers.Authorization ? 400 : 403 });
  });
  assert.equal(calls.length, 10); assert.equal(result.code, 'VALIDATION_ACCESS_CONFIRMED');
  assert.equal(result.generationAttempts, 0); assert.ok(!JSON.stringify(result).includes(token));
});
test('absent protection stops before any generation or authorization change', async () => {
  let calls = 0;
  await assert.rejects(checkAiValidation(token, async () => { calls++; return new Response('{}', { status: 400 }); }), /ACCESS_CHECK_FAILED/);
  assert.equal(calls, 1);
});
test('missing validation token blocks before any network request', async () => {
  let calls = 0;
  await assert.rejects(checkAiValidation('', async () => { calls++; }), /VALIDATION_TOKEN_REQUIRED/);
  assert.equal(calls, 0);
});
