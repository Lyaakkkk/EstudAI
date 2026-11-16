import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import app from '../artifacts/api-server/src/app';
import { GenerateStudySummaryResponse, GenerateStudyQuizResponse } from '../lib/api-zod/src';
import { getGenerateStudySummaryMutationOptions, getGenerateStudyQuizMutationOptions } from '../lib/api-client-react/src/generated/api';
import { setBaseUrl } from '../lib/api-client-react/src/custom-fetch';
import { MutationObserver, QueryClient } from '../artifacts/estudai-web/node_modules/@tanstack/react-query';
async function main() {
process.env.GEMINI_API_KEY='fictional-test-key';
const nativeFetch=globalThis.fetch;
const summary={title:'Jardim',overview:'Doze vasos.',sections:[{heading:'Rega',explanation:'200 ml por vaso.'}],keyTerms:[],reviewTopics:[]};
const quiz=JSON.parse(fs.readFileSync('validation-missao05/results.json','utf8')).find((r:any)=>r.name==='quiz real').data;
const payload=JSON.parse(fs.readFileSync('validation-missao05-1/payload.json','utf8'));
let statuses:number[]=[],generated:any=summary,calls=0,signals:any[]=[];
globalThis.fetch=async(input:any,init:any)=>{
if(!String(input).startsWith('https://generativelanguage.googleapis.com/')) return nativeFetch(input,init);
calls++;signals.push(init.signal);const status=statuses.shift()??200;
if(status===-1) return new Promise((_resolve,reject)=>init.signal.addEventListener('abort',()=>reject(init.signal.reason),{once:true}));
return new Response(JSON.stringify(status===200?{candidates:[{content:{parts:[{text:JSON.stringify(generated)}]}}]}:{error:{message:'fictional provider error'}}),{status,headers:{'content-type':'application/json'}});
};
const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));
setBaseUrl(`http://127.0.0.1:${(server.address() as any).port}`);
const qc=new QueryClient({defaultOptions:{mutations:{retry:false}}});
const results:any[]=[];let history:any={summaries:[{title:'existing-summary'}],quizzes:[{title:'existing-quiz'}]};
const source=fs.readFileSync('artifacts/estudai-web/src/App.tsx','utf8');const errorFunction=source.match(/function generationErrorMessage\([\s\S]*?\n\}/)![0];const ctx:any={Error};vm.createContext(ctx);vm.runInContext(ts.transpileModule(errorFunction,{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,ctx);
async function run(name:string,type:'summaries'|'quizzes',sequence:number[],output:any,expectedStatus:number|null) {
 statuses=[...sequence];generated=output;calls=0;signals=[];
 const prior=JSON.stringify(history);let error:any;
 const options:any=type==='summaries'?getGenerateStudySummaryMutationOptions():getGenerateStudyQuizMutationOptions();
 const observer=new MutationObserver(qc,{...options,onSuccess:(data:any)=>{history={...history,[type]:[data,...history[type]]};}});
 try{await observer.mutate({data:type==='summaries'?payload:{...payload,questionCount:5}});}catch(e){error=e;}
 assert.equal(error?.status??null,expectedStatus);
 if(expectedStatus) {assert.equal(JSON.stringify(history),prior);assert.equal(observer.getCurrentResult().isPending,false);}else assert.equal(history[type][0].title,output.title);
 if(sequence[0]===503){assert.equal(calls,2);assert.equal(signals[0],signals[1]);}else assert.equal(calls,1);
 results.push({name,status:error?.status??200,code:error?.data?.code,message:error?ctx.generationErrorMessage(error):undefined,calls,historyPreserved:expectedStatus?JSON.stringify(history)===prior:true,passed:true});
}
try {
 assert.equal(GenerateStudySummaryResponse.safeParse({...summary,sections:[]}).success,true);
 const brokenQuiz={...quiz,questions:quiz.questions.map((q:any)=>({...q,correctAnswer:'resposta ausente'}))};
 assert.equal(GenerateStudyQuizResponse.safeParse(brokenQuiz).success,true);
 await run('503 seguido de sucesso - resumo','summaries',[503,200],summary,null);
 await run('503 persistente - quiz','quizzes',[503,503],quiz,502);
 await run('reenvio manual apos falha - quiz','quizzes',[200],quiz,null);
 await run('quota sem repeticao automatica','summaries',[429],summary,502);
 await run('autenticacao sem repeticao automatica','summaries',[403],summary,502);
 await run('modelo ausente sem repeticao automatica','summaries',[404],summary,502);
 await run('resumo incompleto bloqueado','summaries',[200],{...summary,sections:[]},502);
 await run('quiz com gabarito ausente bloqueado','quizzes',[200],brokenQuiz,502);
 await run('quiz com quantidade incorreta bloqueado','quizzes',[200],{...quiz,questions:[...quiz.questions,{...quiz.questions[0],id:'extra'}]},502);
 await run('resumo sem campo obrigatorio bloqueado','summaries',[200],{title:'incompleto'},502);
 await run('quiz com ids duplicados bloqueado','quizzes',[200],{...quiz,questions:quiz.questions.map((q:any)=>({...q,id:'duplicado'}))},502);
 const originalTimeout=AbortSignal.timeout;
 try {AbortSignal.timeout=()=>originalTimeout(20);await run('timeout com mensagem especifica','summaries',[-1],summary,502);assert.ok(results.at(-1).message.includes('60 segundos'));}finally{AbortSignal.timeout=originalTimeout;}
 fs.writeFileSync('validation-render-free/regression-results.json',JSON.stringify({scope:'Provedor simulado apenas nestes testes de falha. API Express, mutationFn e MutationObserver reais; sem navegador ou localStorage. Nenhuma chave real utilizada.',results},null,2));
 console.log(JSON.stringify(results,null,2));
}finally {globalThis.fetch=nativeFetch;qc.clear();server.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
