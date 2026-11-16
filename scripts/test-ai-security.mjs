import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const require = createRequire(new URL('../artifacts/api-server/package.json', import.meta.url));
fs.mkdirSync('.local', { recursive:true });
const out = path.resolve('.local/upstash-security.cjs');
await require('esbuild').build({ entryPoints:['scripts/tests/upstash-security.ts'],bundle:true,platform:'node',format:'cjs',outfile:out,logLevel:'warning' });
const result = spawnSync(process.execPath,[out],{stdio:'inherit',env:{
  ...process.env,NODE_ENV:'production',AI_ENABLED:'true',AI_QUOTA_STORE:'upstash',
  AI_QUOTA_KEY:'estudai:ai:quota:v1',AI_MAX_CONCURRENT:'1',AI_DAILY_PROVIDER_LIMIT:'20',
  AI_DAILY_INPUT_BYTES:'8388608',AI_DAILY_OUTPUT_TOKENS:'65536',AI_PROVIDER_WINDOW_LIMIT:'6',
  UPSTASH_REDIS_REST_URL:'https://quota-test.upstash.io',UPSTASH_REDIS_REST_TOKEN:'FAKE_REST_SECRET',GEMINI_API_KEY:'FAKE_GEMINI_SECRET'
}});
process.exitCode=result.status ?? 1;
