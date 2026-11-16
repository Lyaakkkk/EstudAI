import fs from 'node:fs';
import assert from 'node:assert/strict';
import { generateGeminiJson, geminiSchemas } from '../../artifacts/api-server/src/lib/gemini';
import { reserveRemote, RESERVE_SCRIPT, validRemote } from '../../artifacts/api-server/src/lib/quota-upstash';
import { guardedProviderFetch, withAiConcurrency, getAiGuardStatus } from '../../artifacts/api-server/src/lib/ai-guard';
async function main(){
 const real=globalThis.fetch, results:string[]=[];let redis=0,gemini=0,providerMode=false,providerAttempt=0,result:any={result:[1,0]},status=200,reject=false;
 const config={url:'https://quota-test.upstash.io',token:'FAKE_REST_SECRET',key:'estudai:ai:quota:v1',daily:20,input:8388608,output:65536,window:6};
 globalThis.fetch=async(input:any,init:any)=>{
  if(String(input).includes('.upstash.io')){
   redis++;assert.equal(init.redirect,'error');assert.equal(init.headers.Authorization,'Bearer FAKE_REST_SECRET');
   const command=JSON.parse(init.body);assert.equal(command[0],'EVAL');assert.equal(command[2],'1');assert.equal(command[3],config.key);assert.ok(command[1].includes("redis.call('TIME')"));
   if(reject)throw Error('FAKE_SERVER_SECRET');
   return new Response(JSON.stringify(result),{status});
  }
  gemini++;
  if(providerMode){providerAttempt++;return new Response(JSON.stringify(providerAttempt===1?{error:'fictional'}:{candidates:[{content:{parts:[{text:JSON.stringify({title:'Quota retry',overview:'Ok',sections:[{heading:'H',explanation:'E'}],keyTerms:[],reviewTopics:[]})}]}}]}),{status:providerAttempt===1?503:200});}
  return new Response('{}');
 };
 try{
  assert.ok(validRemote(config));
  for(const url of ['http://quota-test.upstash.io','https://127.0.0.1','https://quota-test.upstash.io.evil.example','https://a:b@quota-test.upstash.io','https://quota-test.upstash.io/?x=1'])assert.equal(validRemote({...config,url}),false);
  results.push('REST destination validation prevents unexpected hosts, credentials and redirects');
  assert.equal((await reserveRemote(config,100,8192)).status,'ok');results.push('One EVAL atomically reserves call, bytes, output and shared window');
  for(const [reply,expected] of [[[0,15],'paused'],[[2,300],'daily'],[[3,30],'window'],[[-1,60],'unavailable']] as any[]){result={result:reply};assert.equal((await reserveRemote(config,10,10)).status,expected);results.push('Maps Redis decision '+expected);}
  result={error:'quota exhausted - FAKE_SERVER_SECRET'};assert.equal((await reserveRemote(config,1,1)).status,'unavailable');results.push('Provider quota/error is fail-closed and does not leak raw body');
  result={result:'invalid'};assert.equal((await reserveRemote(config,1,1)).status,'unavailable');results.push('Malformed success response blocks');
  result={result:[1,-1]};assert.equal((await reserveRemote(config,1,1)).status,'unavailable');results.push('Invalid TTL blocks');
  result={padding:'x'.repeat(17000),result:[1,0]};assert.equal((await reserveRemote(config,1,1)).status,'unavailable');results.push('Oversized REST response blocks');
  reject=true;assert.equal((await reserveRemote(config,1,1)).status,'unavailable');reject=false;results.push('Connection/timeout-style failure blocks without retry');
  status=429;assert.equal((await reserveRemote(config,1,1)).status,'unavailable');status=200;results.push('HTTP 429 from free service blocks');
  const before=redis;assert.equal((await reserveRemote({...config,token:''},1,1)).status,'unavailable');assert.equal(redis,before);results.push('Missing credentials cause no network request');
  result={result:[1,0]};assert.equal(getAiGuardStatus(),'ready');await guardedProviderFetch('https://generativelanguage.googleapis.com/fake',{body:JSON.stringify({generationConfig:{maxOutputTokens:32}})});
  assert.equal(gemini,1);results.push('Gemini is called only after confirmed remote reservation');
  const priorRetry=redis;providerMode=true;process.env.GEMINI_API_KEY='FAKE_GEMINI_SECRET';const answer:any=await generateGeminiJson('fictional',{title:'Test',text:'Test'},geminiSchemas.summary);providerMode=false;assert.equal(answer.title,'Quota retry');assert.equal(redis-priorRetry,2);const permittedCalls=gemini;results.push('Actual 503 retry reserves remotely for both provider attempts');
  result={result:[0,15]};await assert.rejects(guardedProviderFetch('https://generativelanguage.googleapis.com/fake',{body:'{"generationConfig":{"maxOutputTokens":32}}'}),(e:any)=>e.code==='AI_DISABLED');
  const saved=redis;result={result:[1,0]};await assert.rejects(guardedProviderFetch('https://generativelanguage.googleapis.com/fake',{body:'{"generationConfig":{"maxOutputTokens":32}}'}),(e:any)=>e.code==='AI_DISABLED');assert.equal(redis,saved);assert.equal(gemini,permittedCalls);results.push('Remote global stop blocks Gemini; short denial cache reduces free commands');
  let release:any;const pending=withAiConcurrency(()=>new Promise<void>(r=>release=r));await assert.rejects(withAiConcurrency(async()=>{}),(e:any)=>e.code==='AI_BUSY');release();await pending;results.push('Conservative default concurrency permits one operation');
  process.env.AI_ENABLED='false';const beforeOff=redis;assert.equal(getAiGuardStatus(),'paused');await assert.rejects(withAiConcurrency(async()=>{throw Error('should not run')}),(e:any)=>e.code==='AI_DISABLED');assert.equal(redis,beforeOff);results.push('Environment global stop blocks before Redis and before operation');
  assert.ok(!RESERVE_SCRIPT.includes('EXPIRE'));assert.ok(!RESERVE_SCRIPT.includes("'enabled',1"));assert.ok(RESERVE_SCRIPT.indexOf("s[1]~='1'")<RESERVE_SCRIPT.indexOf("redis.call('HSET'"));
  results.push('Missing key cannot initialize/reset/enable itself; persistent state has no TTL');
  fs.writeFileSync('.local/upstash-security-results.json',JSON.stringify({scope:'Actual REST adapter and guard with mocked fetch. No account/credentials connected; Lua was inspected but not executed on a live Redis.',passed:results.length,redisRequests:redis,geminiRequests:gemini,results},null,2));console.log(results.length+' Upstash/kill-switch checks passed.');
 }finally{globalThis.fetch=real;}
}
main().catch(e=>{console.error(e);process.exitCode=1});
