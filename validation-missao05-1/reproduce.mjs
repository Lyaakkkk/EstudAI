import fs from 'node:fs';import ts from 'typescript';import vm from 'node:vm';
const app=fs.readFileSync('artifacts/estudai-web/src/App.tsx','utf8');
const source=app.match(/function sourceFromMaterial\([\s\S]*?\n\}/)[0];
const ctx={};vm.createContext(ctx);vm.runInContext(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,ctx);
const material={id:'fictional-05-1',title:'Jardim ficticio Aurora',sourceType:'texto',text:'O jardim Aurora possui 12 vasos. Cada vaso recebe 200 ml de agua por dia, totalizando 2400 ml. Recebem luz pela manha. Uma tabela registra a rega diaria.'};
const payload=ctx.sourceFromMaterial(material,'iniciante');
fs.writeFileSync('validation-missao05-1/payload.json',JSON.stringify(payload,null,2));
for(const [name,body] of [['summaries',payload],['quizzes',{...payload,questionCount:5}]]) {
const start=Date.now();try{const r=await fetch('http://localhost:19006/api/study/'+name,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(70000)});const data=await r.json();const result={endpoint:name,status:r.status,elapsedMs:Date.now()-start,data};fs.writeFileSync('validation-missao05-1/'+name+'-before.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));}catch(e){console.log(JSON.stringify({endpoint:name,error:e.name}));}}
