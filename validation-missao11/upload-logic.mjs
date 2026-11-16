import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';import assert from 'node:assert/strict';
const app=fs.readFileSync('artifacts/estudai-web/src/App.tsx','utf8');
const addFile=app.match(/const addFile = async \(file\?: File\) => \{([\s\S]*?)\n  \};/)[1];
let error='',pending=null;
class Reader {readAsDataURL(file){this.result='data:'+file.type+';base64,'+file.bytes.toString('base64');this.onload();}}
const ctx={state:{materials:[]},setError:v=>error=v,setFileBusy:()=>{},setTagsInput:()=>{},setPending:v=>pending=v,FileReader:Reader,Promise,Math,Error};vm.createContext(ctx);
vm.runInContext(ts.transpileModule(`globalThis.addFile = async (file?: File)=>{${addFile}};`,{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,ctx);
const results=[];
for(const [name,type,size,expected] of [['PNG ficticio','image/png',6432,null],['formato HEIC','image/heic',100,'Formato'],['arquivo acima de 2 MB','image/png',2*1024*1024+1,'2 MB']]) {
error='';pending=null;await ctx.addFile({name:'material.png',type,size,bytes:fs.readFileSync('validation-missao05/material.png')});if(expected)assert.ok(error.includes(expected));else {assert.equal(error,'');assert.equal(pending.sourceType,'imagem');assert.ok(pending.base64.length>0);}results.push({name,passed:true,message:error||'Arquivo lido e material pendente criado'});
}
ctx.state.materials=[{base64:'A'.repeat(3*1024*1024)}];error='';await ctx.addFile({name:'material.png',type:'image/png',size:6432});assert.ok(error.includes('Remova'));results.push({name:'limite total de armazenamento',passed:true,message:error});
fs.writeFileSync('validation-missao11/upload-logic-results.json',JSON.stringify({scope:'Funcao addFile real, FileReader substituido apenas para leitura em Node; nao comprova seletor/armazenamento do navegador.',results},null,2));console.log(JSON.stringify(results));
