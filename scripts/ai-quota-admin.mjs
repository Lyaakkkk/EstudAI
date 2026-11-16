import { pathToFileURL } from 'node:url';
import path from 'node:path';

export function buildAdminCommand(action, key) {
  if (!/^[a-zA-Z0-9:_-]{1,80}$/.test(key)) throw Error('Invalid quota key.');
  const common = "local v=redis.call('HGET',KEYS[1],'version'); if v~='1' then return -1 end; ";
  let script;
  if (action === 'init') script = "if redis.call('EXISTS',KEYS[1])==1 then return 0 end; redis.call('HSET',KEYS[1],'version',1,'enabled',0,'day',0,'calls',0,'input',0,'output',0,'window',0,'used',0); return 1";
  else if (action === 'pause' || action === 'resume') script = common + "redis.call('HSET',KEYS[1],'enabled'," + (action === 'pause' ? '0' : '1') + "); return 1";
  else if (action === 'status') return ['HMGET', key, 'version','enabled','day','calls','input','output','window','used'];
  else throw Error('Use init, status, pause or resume.');
  return ['EVAL', script, '1', key];
}
async function main() {
  const key = process.env.AI_QUOTA_KEY || 'estudai:ai:quota:v1';
  const command = buildAdminCommand(process.argv[2], key);
  const url = new URL(process.env.UPSTASH_REDIS_REST_URL || '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url.protocol !== 'https:' || !/^[a-z0-9][a-z0-9-]*\.upstash\.io$/i.test(url.hostname) ||
      url.pathname !== '/' || url.search || url.hash || url.username || url.password || (url.port && url.port !== '443') || !token) throw Error('Configure the owned Upstash REST endpoint/token in environment variables.');
  const response = await fetch(url, { method:'POST', redirect:'error', signal:AbortSignal.timeout(3000),
    headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(command) });
  if (!response.ok) throw Error('Quota administration failed; check provider dashboard.');
  const body = await response.json();
  if (body.error) throw Error('Quota administration rejected; no automatic retry.');
  if (body.result === -1) throw Error('State missing/invalid. Review the database; do not reset existing daily counters.');
  console.log(JSON.stringify({action:process.argv[2],result:body.result}));
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch(() => { console.error('Quota operation failed. Check credentials, connectivity and existing state. No automatic retry or reset was performed.'); process.exitCode=1; });
}
