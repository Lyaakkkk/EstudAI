import assert from 'node:assert/strict';
import express from '../artifacts/api-server/node_modules/express';
import { configureDeployment } from '../artifacts/api-server/src/deployment';
import fs from 'node:fs';
async function main(){
const results=[];process.env.NODE_ENV='production';
for(const [name,hops,origins,origin,allowed,expectedIp] of [
 ['same-origin default','0','', 'https://other.example',false,'127.0.0.1'],
 ['allowed origin and one trusted hop','1','https://web.example','https://web.example',true,'203.0.113.5'],
 ['disallowed origin','1','https://web.example','https://other.example',false,'203.0.113.5'],
] as const){process.env.TRUST_PROXY_HOPS=hops;process.env.CORS_ORIGINS=origins;const app=express();configureDeployment(app);app.get('/client',(req,res)=>res.json({ip:req.ip}));const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));try{const port=(server.address() as any).port;const response=await fetch('http://127.0.0.1:'+port+'/client',{headers:{Origin:origin,'X-Forwarded-For':'198.51.100.4, 203.0.113.5'}});assert.equal(response.headers.get('access-control-allow-origin'),allowed?origin:null);assert.equal(response.headers.get('x-powered-by'),null);assert.equal((await response.json()).ip,expectedIp);results.push({name,passed:true});}finally{server.close();}}
for(const value of ['true','-1','11','1.5']){process.env.TRUST_PROXY_HOPS=value;assert.throws(()=>configureDeployment(express()));results.push({name:'reject invalid TRUST_PROXY_HOPS '+value,passed:true});}
fs.writeFileSync('validation-missao12/production-config-results.json',JSON.stringify({scope:'Local HTTP tests of deployment configuration. Not a Render ingress test; CORS is not authentication.',results},null,2));console.log('Production config: '+results.length+' passed.');}
main().catch(e=>{console.error(e);process.exitCode=1;});