import assert from 'node:assert/strict';
import fs from 'node:fs';
import app from '../artifacts/api-server/src/app';
async function main(){
process.env.GEMINI_API_KEY='fictional-security-key';
const native=globalThis.fetch;let providerCalls=0,providerStatus=200,oversized=false;
globalThis.fetch=async(input:any,init:any)=>{
 if(!String(input).startsWith('https://generativelanguage.googleapis.com/'))return native(input,init);
 providerCalls++;
 return new Response(JSON.stringify(providerStatus===200?{candidates:[{content:{parts:[{text:oversized?'X'.repeat(1100000):JSON.stringify({title:'Teste',overview:'Visao',sections:[{heading:'Tema',explanation:'Explicacao'}],keyTerms:[],reviewTopics:[]})}]}}]}:{error:{message:'SECRET_FAKE_PROVIDER_BODY'}}),{status:providerStatus});
};
const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));const base='http://127.0.0.1:'+(server.address() as any).port;const results:any[]=[];let id=20;
async function request(name:string,route:string,data:any,status:number,raw=false,ip?:string){const r=await native(base+'/api/study/'+route,{method:'POST',headers:{'Content-Type':'application/json','X-Forwarded-For':ip||'203.0.113.'+(id++)},body:raw?data:JSON.stringify(data)});const text=await r.text();assert.equal(r.status,status,name+': '+text);assert.ok(!text.includes('fictional-security-key')&&!text.includes('SECRET_FAKE_PROVIDER_BODY')&&!text.includes('node_modules'));if(status>=500||status===413)assert.ok(r.headers.get('content-type')?.includes('application/json'));results.push({name,status,code:JSON.parse(text).code});return r;}
try{
 const payload={title:'Teste',text:'Doze vasos.',difficulty:'iniciante'};
 await request('Malformed JSON','chat','{',400,true);
 await request('Payload above 3 MiB','summaries','{"text":"'+ 'x'.repeat(3*1024*1024)+'"}',413,true);
 await request('Text above schema limit','summaries',{...payload,text:'x'.repeat(100001)},400);
 await request('Spoofed PDF signature','summaries',{title:'PDF',difficulty:'iniciante',file:{name:'fake.pdf',mimeType:'application/pdf',base64:Buffer.from('not a pdf').toString('base64')}},400);
 await request('File above 2 MiB','summaries',{title:'PDF',difficulty:'iniciante',file:{name:'big.pdf',mimeType:'application/pdf',base64:Buffer.concat([Buffer.from('%PDF-'),Buffer.alloc(2*1024*1024)]).toString('base64')}},400);
 await request('Invalid base64','summaries',{title:'PDF',difficulty:'iniciante',file:{name:'fake.pdf',mimeType:'application/pdf',base64:'!!!!'}},400);
 await request('Invalid chat role','chat',{messages:[{role:'system',content:'test'}]},400);
 assert.equal(providerCalls,0);
 await request('Valid text uses unchanged success contract','summaries',payload,200);
 await request('Valid PDF accepted','summaries',{title:'PDF',difficulty:'iniciante',file:{name:'material.pdf',mimeType:'application/pdf',base64:fs.readFileSync('validation-missao05/material.pdf').toString('base64')}},200);
 providerStatus=403;await request('Provider detail and key not exposed','summaries',payload,502);providerStatus=200;
 oversized=true;await request('Oversized provider response rejected','summaries',payload,502);oversized=false;
 const ledgerPath=process.env.AI_BUDGET_FILE!;const previous=fs.readFileSync(ledgerPath,'utf8');fs.writeFileSync(ledgerPath,JSON.stringify({day:new Date().toISOString().slice(0,10),used:10000,inputBytes:0,outputTokens:0}));
 const quota=await request('Global daily quota response','summaries',payload,429);assert.ok(quota.headers.get('retry-after'));
 fs.writeFileSync(ledgerPath,'{');await request('Ledger failure is safe','summaries',payload,503);fs.writeFileSync(ledgerPath,previous);
 for(let i=0;i<12;i++)await request('Per-IP generation '+(i+1),'summaries',{},400,false,'198.51.100.200');
 const limited=await request('Generation request rate limit','summaries',{},429,false,'198.51.100.200');assert.ok(limited.headers.get('retry-after'));
 fs.writeFileSync('validation-missao15/api-security-results.json',JSON.stringify({scope:'Local Express and actual guards; provider simulated, no real key.',checks:results.length,providerCalls,results},null,2));console.log(results.length+' API security checks passed.');
}finally{globalThis.fetch=native;server.close();}
}main().catch(e=>{console.error(e);process.exitCode=1});
