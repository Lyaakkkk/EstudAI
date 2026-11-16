import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';

test('GitHub candidate listing excludes secrets, dependencies and temporary files', () => {
  const root = path.resolve('validation-missao19', 'ignore-fixture-' + randomUUID());
  const excluded = ['.env', '.env.production', '.env.local', '.envrc', 'private.pem', 'private.p8', 'private.key', 'private.p12', 'private.pfx',
    'credentials.json', 'credentials.dev.json', 'service-account-test.json', 'client_secret_test.json', 'secrets.json', 'tokens.json',
    'debug.log', 'scratch.tmp', 'scratch.bak', 'scratch.before', 'cache.tsbuildinfo',
    'node_modules/test.js', 'dist/test.js', '.local/state.json', '.aws/credentials', '.codex/config.toml', '.agents/local.md'];
  const included = ['.env.example', 'source.ts', 'pnpm-lock.yaml'];
  const created = [];
  fs.mkdirSync(root, { recursive: true });
  try {
    for (const file of [...excluded, ...included]) {
      const target = path.join(root, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, 'placeholder-only'); created.push(target);
    }
    const listing = spawnSync('rg', ['--files', '--hidden', '--no-require-git', root], { encoding: 'utf8' });
    assert.equal(listing.status, 0);
    const listed = listing.stdout.trim().split(/\r?\n/).map(file => path.relative(root, file).replaceAll('\\', '/'));
    assert.deepEqual(listed.sort(), included.sort());
  } finally {
    // Delete only the exact files created by this test; never recursively remove paths.
    for (const file of created) fs.unlinkSync(file);
    const directories = [...new Set(created.map(file => path.dirname(file)))].sort((a, b) => b.length - a.length);
    for (const directory of directories) fs.rmdirSync(directory);
    if (fs.existsSync(root)) fs.rmdirSync(root);
  }
});
