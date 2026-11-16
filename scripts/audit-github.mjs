import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

// rg honours nested .gitignore files even before a Git repository exists.
// Never print matched content: report only path, line and detector name.
const listing = spawnSync('rg', ['--files', '--hidden', '--no-require-git', '-g', '!.git/**'], { encoding: 'utf8' });
if (listing.status !== 0) throw new Error('Unable to list candidate files with rg');
const files = listing.stdout.trim().split(/\r?\n/).filter(Boolean);
const detectors = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/],
  ['google-api-key', /AIza[0-9A-Za-z_-]{35}/],
  ['github-token', /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})/],
  ['aws-access-key', /(?:AKIA|ASIA)[A-Z0-9]{16}/],
  ['slack-token', /xox[baprs]-[0-9A-Za-z-]{20,}/],
  ['jwt', /eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}/],
  ['credential-url', /\b(?:postgres(?:ql)?|redis|rediss|mongodb(?:\+srv)?):\/\/[^\s:/]+:[^\s@]+@/i],
];
const findings = [];
const assignments = [];
for (const file of files) {
  const buffer = fs.readFileSync(file);
  if (buffer.includes(0)) continue;
  const lines = buffer.toString('utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const [detector, regex] of detectors) if (regex.test(line)) findings.push({ file, line: index + 1, detector });
    // Broader candidates for manual review; placeholders and test doubles are expected.
    if (/(?:api[_-]?key|secret|password|token|authorization)\s*["']?\s*[:=]\s*["'`][^"'`]{8,}["'`]/i.test(line)) {
      assignments.push({ file, line: index + 1, detector: 'literal-credential-candidate' });
    }
  });
}
const normalized = files.map(file => file.replaceAll('\\', '/'));
for (const file of normalized) {
  assert.ok(!file.split('/').includes('node_modules'), 'Dependency included');
  assert.ok(!file.split('/').includes('.local'), 'Local ledger included');
  assert.ok(!file.split('/').some(part => part === '.env' || (part.startsWith('.env.') && part !== '.env.example')), 'Environment secret included');
  assert.ok(!/\.(?:pem|key|p12|pfx|jks|keystore|log|tmp|temp|bak|before|tsbuildinfo)$/.test(file), 'Private/generated file included');
}
const result = { candidateFiles: files.length, findings, assignments,
  scope: 'Untracked candidate files selected by rg and nested .gitignore. Pattern scan; no Git index/history exists. Matched values are never emitted.' };
fs.mkdirSync('validation-missao19', { recursive: true });
fs.writeFileSync('validation-missao19/secret-audit.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (findings.length) process.exitCode = 1;
