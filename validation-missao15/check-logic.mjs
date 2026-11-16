import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import assert from 'node:assert/strict';
const app=fs.readFileSync('artifacts/estudai-web/src/App.tsx','utf8');
const quiz=JSON.parse(fs.readFileSync('validation-missao05/results.json','utf8')).find(r=>r.name==='quiz real').data;
const finish=app.match(/const finishQuiz = \(\) => \{([\s\S]*?)\n  \};/)[1];
const performance=app.match(/function PerformancePage\([^\n]+\) \{([\s\S]*?)\n  return /)[1];
const normalized=app.match(/const normalized = [^\n]+/)[0];
const cases=[];
for(const [name,correct,expected] of [['todos corretos',5,5],['todos errados',0,0],['misto',3,3],['incompleto',-1,null]]) {
 const state={quizzes:[quiz],quizAttempts:[],challengeAttempts:[]};
 const answers=correct<0?{}:Object.fromEntries(quiz.questions.map((q,i)=>[q.id,i<correct?q.correctAnswer:q.options.find(o=>o!==q.correctAnswer)]));
 const ctx={activeQuiz:quiz,answers,state,newId:()=>name,setState:f=>Object.assign(state,f(state)),setLastAttempt:()=>{},Date};
 vm.createContext(ctx);
 vm.runInContext(ts.transpileModule(`${normalized}\n(()=>{${finish}})();\n(()=>{${performance}\nglobalThis.metrics={quizCount,questionCount,correctCount,average};})();`,{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,ctx);
 assert.equal(state.quizAttempts[0]?.score??null,expected);
 assert.equal(ctx.metrics.average,expected===null?null:expected*20);
 cases.push({name,score:state.quizAttempts[0]?.score??null,average:ctx.metrics.average,passed:true});
}
fs.writeFileSync('validation-missao15/logic-results.json',JSON.stringify({scope:'Trechos reais finishQuiz e PerformancePage executados em VM; sem navegador, sem localStorage real. Quiz gerado pelo Gemini; respostas de teste deliberadas.',cases},null,2));
console.log(JSON.stringify(cases));
