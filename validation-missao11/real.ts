import fs from 'node:fs';
import {getGenerateStudySummaryMutationOptions,getGenerateStudyQuizMutationOptions} from '../lib/api-client-react/src/generated/api';
import {setBaseUrl} from '../lib/api-client-react/src/custom-fetch';
import {MutationObserver,QueryClient} from '../artifacts/estudai-web/node_modules/@tanstack/react-query';
async function main(){
setBaseUrl('http://localhost:19006');const qc=new QueryClient({defaultOptions:{mutations:{retry:false}}});
const payload=JSON.parse(fs.readFileSync('validation-missao05-1/payload.json','utf8'));const results:any[]=[];
for(const [name,options,data] of [['resumo',getGenerateStudySummaryMutationOptions({request:{signal:AbortSignal.timeout(70000)}}),payload],['quiz',getGenerateStudyQuizMutationOptions({request:{signal:AbortSignal.timeout(70000)}}),{...payload,questionCount:5}]] as any[]) {
const start=Date.now();const mutation=new MutationObserver(qc,options);
try{const result:any=await mutation.mutate({data});results.push({name,status:200,elapsedMs:Date.now()-start,result});console.log(JSON.stringify({name,status:200,elapsedMs:Date.now()-start,title:result.title,questions:result.questions?.length}));}catch(e:any){results.push({name,status:e.status,errorName:e.name,message:e.data?.message??e.message,code:e.data?.code,elapsedMs:Date.now()-start});console.log(JSON.stringify(results.at(-1)));}
fs.writeFileSync('validation-missao11/real-results.json',JSON.stringify({scope:'Gemini real, mutationFn gerada e MutationObserver reais, via proxy Vite. Sem automação visual e sem histórico do navegador.',results},null,2));
}
qc.clear();}
main().catch(e=>{console.error(e.name);process.exitCode=1;});
