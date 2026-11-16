export type QuotaDecision = { status: 'ok' | 'paused' | 'daily' | 'window' | 'unavailable'; retryAfter: number };
export type RemoteQuota = { url: string; token: string; key: string; daily: number; input: number; output: number; window: number };

/** Single persistent hash. Missing/invalid state NEVER initializes itself or enables AI. */
export const RESERVE_SCRIPT = [
  "local s=redis.call('HMGET',KEYS[1],'version','enabled','day','calls','input','output','window','used')",
  "if s[1]~='1' then return {-1,60} end",
  "if s[2]=='0' then return {0,15} end",
  "if s[2]~='1' then return {-1,60} end",
  "for i=3,8 do local n=tonumber(s[i]); if not n or n<0 or n~=math.floor(n) then return {-1,60} end end",
  "local now=tonumber(redis.call('TIME')[1]); local day=math.floor(now/86400)",
  "local old=tonumber(s[3]); local calls=tonumber(s[4]); local input=tonumber(s[5]); local output=tonumber(s[6])",
  "local win=tonumber(s[7]); local used=tonumber(s[8])",
  "if old>day or win>now then return {-1,60} end",
  "if old<day then calls=0; input=0; output=0 end",
  "if now-win>=900 then win=now; used=0 end",
  "local dc=tonumber(ARGV[1]); local di=tonumber(ARGV[2]); local dout=tonumber(ARGV[3]); local wc=tonumber(ARGV[4])",
  "local charge=tonumber(ARGV[5]); local tokens=tonumber(ARGV[6])",
  "if used>=wc then return {3,math.max(1,900-(now-win))} end",
  "if calls>=dc or input+charge>di or output+tokens>dout then return {2,86400-(now%86400)} end",
  "redis.call('HSET',KEYS[1],'day',day,'calls',calls+1,'input',input+charge,'output',output+tokens,'window',win,'used',used+1)",
  "return {1,0}",
].join('\n');

export function validRemote(config: { url?: string; token?: string; key?: string }): config is { url: string; token: string; key: string } {
  if (!config.token || !config.key || !/^[a-zA-Z0-9:_-]{1,80}$/.test(config.key)) return false;
  try {
    const url = new URL(config.url || '');
    return url.protocol === 'https:' && /^[a-z0-9][a-z0-9-]*\.upstash\.io$/i.test(url.hostname) &&
      !url.username && !url.password && (!url.port || url.port === '443') &&
      url.pathname === '/' && !url.search && !url.hash;
  } catch { return false; }
}

export async function reserveRemote(config: RemoteQuota, input: number, output: number): Promise<QuotaDecision> {
  if (!validRemote(config)) return { status: 'unavailable', retryAfter: 60 };
  try {
    const response = await fetch(config.url, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(3000),
      headers: { Authorization: 'Bearer ' + config.token, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', RESERVE_SCRIPT, '1', config.key,
        String(config.daily), String(config.input), String(config.output), String(config.window), String(input), String(output)]),
    });
    if (!response.ok || Number(response.headers.get('content-length')) > 16384) {
      await response.body?.cancel(); return { status: 'unavailable', retryAfter: 60 };
    }
    const reader = response.body?.getReader();
    if (!reader) return { status: 'unavailable', retryAfter: 60 };
    const chunks: Uint8Array[] = []; let size = 0;
    try {
      while (true) {
        const part = await reader.read(); if (part.done) break;
        size += part.value.byteLength;
        if (size > 16384) { await reader.cancel(); return { status: 'unavailable', retryAfter: 60 }; }
        chunks.push(part.value);
      }
    } finally { reader.releaseLock(); }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const result = body?.result;
    if (body?.error || !Array.isArray(result) || result.length !== 2 ||
        !Number.isInteger(result[0]) || !Number.isInteger(result[1]) || result[1] < 0 || result[1] > 86400) return { status: 'unavailable', retryAfter: 60 };
    const status = ({1:'ok',0:'paused',2:'daily',3:'window'} as Record<number, QuotaDecision['status']>)[result[0]] || 'unavailable';
    return { status, retryAfter: status === 'ok' ? 0 : Math.max(1, result[1]) };
  } catch { return { status: 'unavailable', retryAfter: 60 }; }
}
