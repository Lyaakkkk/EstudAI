const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('node:assert/strict'),path=require('path');
const source=ts.transpileModule(fs.readFileSync('artifacts/api-server/src/lib/ai-guard.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const results=[];let serial=0,fetchCalls=0;
function setup(overrides={},file){file=file||path.resolve('validation-render-free/guard-'+process.pid+'-'+serial+++'.json');const ctx={exports:{},require:name=>name==='./quota-upstash'?{}:require(name),process:{env:{AI_ENABLED:'true',AI_QUOTA_STORE:'file',NODE_ENV:'production',AI_BUDGET_FILE:file,AI_DAILY_PROVIDER_LIMIT:'10',AI_PROVIDER_WINDOW_LIMIT:'10',AI_MAX_CONCURRENT:'2',...overrides}},Date,Buffer,fetch:async()=>{fetchCalls++;return new Response('{}')},Number,Math,JSON,Error,Promise};vm.createContext(ctx);vm.runInContext(source,ctx);return {api:ctx.exports,file};}
const body=JSON.stringify({generationConfig:{maxOutputTokens:32}});
const call=s=>s.api.guardedProviderFetch('https://fictional.invalid',{body,method:'POST'});
const fail=(fn,code)=>assert.throws(fn,error=>error.code===code);
async function main(){
 const first=setup({AI_DAILY_PROVIDER_LIMIT:'2'});await call(first);await call(first);const count=fetchCalls;const restarted=setup({AI_DAILY_PROVIDER_LIMIT:'2'},first.file);fail(()=>call(restarted),'AI_DAILY_LIMIT');assert.equal(fetchCalls,count);results.push('Daily counter survives module/process-style restart and denies before fetch');
 const out=setup({AI_DAILY_OUTPUT_TOKENS:'32'});await call(out);fail(()=>call(out),'AI_DAILY_LIMIT');results.push('Reserved maximum output tokens have a daily cap');
 const input=setup({AI_DAILY_INPUT_BYTES:'1'});fail(()=>call(input),'AI_DAILY_LIMIT');results.push('Daily request-byte cap denies before fetch');
 const window=setup({AI_PROVIDER_WINDOW_LIMIT:'1'});await call(window);fail(()=>call(window),'AI_WINDOW_LIMIT');results.push('Global fixed window blocks further provider attempts');
 const renewed=setup({AI_DAILY_PROVIDER_LIMIT:'1'});fs.writeFileSync(renewed.file,JSON.stringify({day:new Date(Date.now()-86400000).toISOString().slice(0,10),used:10000,inputBytes:1000000000,outputTokens:10000000}));await call(renewed);assert.equal(JSON.parse(fs.readFileSync(renewed.file,'utf8')).used,1);results.push('New UTC day renews the persistent quota');
 const corrupt=setup();fs.writeFileSync(corrupt.file,'{');fail(()=>call(corrupt),'AI_BUDGET_UNAVAILABLE');results.push('Corrupt ledger fails closed');
 const directory=setup({},path.resolve('validation-missao15'));try{call(directory);throw Error('expected denial')}catch(e){assert.equal(e.code,'AI_BUDGET_UNAVAILABLE');assert.ok(!e.message.includes(directory.file));}results.push('I/O failure returns a safe message without paths');
 const busy=setup();let releaseA,releaseB;const a=busy.api.withAiConcurrency(()=>new Promise(r=>releaseA=r)),b=busy.api.withAiConcurrency(()=>new Promise(r=>releaseB=r));await assert.rejects(busy.api.withAiConcurrency(async()=>{}),e=>e.code==='AI_BUSY');releaseA();releaseB();await Promise.all([a,b]);assert.equal(await busy.api.withAiConcurrency(async()=>42),42);results.push('Concurrency cap and release on success');
 await assert.rejects(busy.api.withAiConcurrency(async()=>{throw Error('fictional')}));assert.equal(await busy.api.withAiConcurrency(async()=>7),7);results.push('Concurrency slot releases after error');
 const fresh=setup();fail(()=>fresh.api.guardedProviderFetch('x',{body:'{"generationConfig":{"maxOutputTokens":99999}}'}),'AI_BUDGET_UNAVAILABLE');results.push('Invalid output-token configuration is rejected before spending');
 assert.throws(()=>setup({AI_MAX_CONCURRENT:'-1'}));results.push('Invalid safety configuration fails startup');
 fs.writeFileSync('validation-render-free/guard-results.json',JSON.stringify({scope:'Actual guard source; real filesystem ledgers, simulated provider, no real key.',passed:results.length,results},null,2));console.log(results.length+' guard scenarios passed.');
}main().catch(e=>{console.error(e);process.exitCode=1});
