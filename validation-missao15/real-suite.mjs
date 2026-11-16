import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const port=19316,base='http://127.0.0.1:'+port;
const api=spawn(process.execPath,['--env-file-if-exists=artifacts/api-server/.env','--enable-source-maps','artifacts/api-server/dist/index.mjs'],{env:{...process.env,NODE_ENV:'production',PORT:String(port),SERVE_WEB:'true',TRUST_PROXY_HOPS:'0',AI_BUDGET_FILE:path.resolve('validation-missao15/real-budget-'+process.pid+'.json')},stdio:['ignore','pipe','pipe']});
let log='',exited=false;api.stdout.on('data',d=>log+=d);api.stderr.on('data',d=>log+=d);api.on('exit',()=>exited=true);
const executions=[];
try{
 let ready=false;
 for(let i=0;i<40;i++){if(exited)throw Error('Isolated API did not start.');try{if((await fetch(base+'/api/healthz')).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,250));}
 if(!ready)throw Error('Isolated API startup timed out.');
 const state=await (await fetch(base+'/api/study/ai-status')).json();
 if(!state.configured)throw Error('Real Gemini is not configured.');
 for(const [file,out] of [['real.cjs','real.log'],['functional-http.mjs','functional-http.log'],['real-chat.cjs','real-chat.log']]){
  const child=spawn(process.execPath,['validation-missao15/'+file],{stdio:['ignore','pipe','pipe']});let text='';
  child.stdout.on('data',d=>text+=d);child.stderr.on('data',d=>text+=d);
  const code=await new Promise(r=>child.once('exit',r));fs.writeFileSync('validation-missao15/'+out,text);executions.push({file,exitCode:code});console.log(text.trim());
 }
 const generated=JSON.parse(fs.readFileSync('validation-missao15/real-results.json','utf8')).results;
 const other=JSON.parse(fs.readFileSync('validation-missao15/functional-http-results.json','utf8')).results;
 const chat=JSON.parse(fs.readFileSync('validation-missao15/real-chat-results.json','utf8'));
 const passed=generated.every(r=>r.status===200)&&other.length===3&&other.every(r=>r.status===200)&&chat.passed;
 fs.writeFileSync('validation-missao15/real-suite-results.json',JSON.stringify({passed,scope:'Six real Gemini requests on isolated production build. Browser unavailable; no manual UI claims.',executions,results:[...generated,...other].map(r=>({name:r.name,status:r.status,elapsedMs:r.elapsedMs})),chat:{passed:chat.passed,status:chat.passed?200:chat.status,elapsedMs:chat.elapsedMs,requestCount:chat.requestCount}},null,2));
 if(!passed)process.exitCode=1;
}finally{
 fs.writeFileSync('validation-missao15/real-server.log',log);api.kill('SIGTERM');
 await new Promise(r=>{if(exited)r();else{const t=setTimeout(r,3000);api.once('exit',()=>{clearTimeout(t);r()})}});
}
