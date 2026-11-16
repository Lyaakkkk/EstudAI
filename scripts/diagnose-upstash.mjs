import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { buildAdminCommand } from './ai-quota-admin.mjs';
import { validRemote, reserveRemote } from '../artifacts/api-server/src/lib/quota-upstash.ts';

export class DiagnosticError extends Error {
  constructor(code) { super(code); this.code = code; }
}
export function normalizeConfig(config) {
  const edge = /^[\s\u200B\u2060\uFEFF]+|[\s\u200B\u2060\uFEFF]+$/gu;
  const url = typeof config.url === 'string' ? config.url.replace(edge,'') : '';
  const token = typeof config.token === 'string' ? config.token.replace(edge,'') : '';
  if (!token) throw new DiagnosticError('CONFIG_TOKEN_EMPTY');
  if (/^Bearer\s/i.test(token) || /^['"]|['"]$/.test(token)) throw new DiagnosticError('CONFIG_TOKEN_WRAPPER');
  // Opaque REST tokens: no assumption of JWT, hex, base64 or base64url.
  if (!/^[\x21-\x7E]+$/.test(token)) throw new DiagnosticError('CONFIG_TOKEN_CHARACTERS');
  if (!config.key || !/^[a-zA-Z0-9:_-]{1,80}$/.test(config.key)) throw new DiagnosticError('CONFIG_KEY');
  if (!validRemote({url,token,key:config.key})) throw new DiagnosticError('CONFIG_URL');
  return {...config,url,token};
}
export function makeRequest(config, transport = fetch) {
  config = normalizeConfig(config);
  return async command => {
    let response;
    try {
      response = await transport(config.url, { method:'POST',redirect:'error',signal:AbortSignal.timeout(3000),
        headers:{Authorization:'Bearer '+config.token,'Content-Type':'application/json'},body:JSON.stringify(command) });
    } catch { throw new DiagnosticError('NETWORK'); }
    let body;
    try {
      const reader=response.body?.getReader(); if(!reader) throw Error();
      const chunks=[];let bytes=0;
      try { while(true) { const part=await reader.read();if(part.done)break;bytes+=part.value.length;
        if(bytes>16384){await reader.cancel();throw Error();}chunks.push(part.value); } }
      finally {reader.releaseLock();}
      body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch { throw new DiagnosticError(response.status===401 ? 'AUTHENTICATION' : 'RESPONSE'); }
    if(response.status===401 || /WRONGPASS|NOAUTH|invalid.*token|unauthorized/i.test(String(body?.error || ''))) throw new DiagnosticError('AUTHENTICATION');
    if(response.status===403 || /NOPERM|permission/i.test(String(body?.error || ''))) throw new DiagnosticError('PERMISSION');
    if(response.status===429)throw new DiagnosticError('SERVICE_LIMIT');
    if(!response.ok || body?.error || !Object.hasOwn(body || {},'result'))throw new DiagnosticError('SERVICE');
    return body.result;
  };
}
export function checkState(state) {
  if(!Array.isArray(state)||state.length!==8)throw new DiagnosticError('STATE_INVALID');
  if(state.every(x=>x===null))throw new DiagnosticError('STATE_MISSING');
  if(state[0]!=='1'||!['0','1'].includes(state[1])||state.slice(2).some(x=>typeof x!=='string'||!/^\d+$/.test(x)||!Number.isSafeInteger(Number(x))))throw new DiagnosticError('STATE_INVALID');
  if(state[1]!=='0')throw new DiagnosticError('STATE_ACTIVE');
}
export async function diagnose(config,{initialize=false,testQuotas=false,transport=fetch,reserve=reserveRemote}={}) {
  config=normalizeConfig(config); const request=makeRequest(config,transport);
  if(await request(['PING'])!=='PONG')throw new DiagnosticError('RESPONSE');
  if(initialize)await request(buildAdminCommand('init',config.key));
  checkState(await request(buildAdminCommand('status',config.key)));
  if(!testQuotas)return 'CONNECTION_OK_PAUSED';
  const key='estudai:diagnostic:'+randomUUID();
  // A fresh random test key only; never reset, delete or enable the real quota key.
  let created=false;
  try {
    if(await request(buildAdminCommand('init',key))!==1)throw new DiagnosticError('TEST_COLLISION');
    created=true;
    const cfg={...config,key,daily:1,input:100,output:10,window:1};
    if((await reserve(cfg,1,1)).status!=='paused')throw new DiagnosticError('QUOTA_TEST');
    if(await request(buildAdminCommand('resume',key))!==1)throw new DiagnosticError('QUOTA_TEST');
    if((await reserve(cfg,1,1)).status!=='ok')throw new DiagnosticError('QUOTA_TEST');
    if((await reserve(cfg,1,1)).status!=='window')throw new DiagnosticError('QUOTA_TEST');
    if((await reserve({...cfg,window:2},1,1)).status!=='daily')throw new DiagnosticError('QUOTA_TEST');
    if((await reserve({...cfg,key:key+':missing'},1,1)).status!=='unavailable')throw new DiagnosticError('QUOTA_TEST');
    checkState(await request(buildAdminCommand('status',config.key)));
    return 'CONNECTION_AND_QUOTAS_OK_PAUSED';
  } finally {
    if(created && await request(['DEL',key])!==1)throw new DiagnosticError('TEST_CLEANUP');
  }
}
const messages={
 CONFIG_TOKEN_EMPTY:'Token REST vazio. Repita a entrada privada.',
 CONFIG_TOKEN_WRAPPER:'Cole somente o token, sem Bearer ou aspas.',
 CONFIG_TOKEN_CHARACTERS:'Token com espaco ou caractere invisivel/invalido no interior. Recopie o token REST.',
 CONFIG_KEY:'AI_QUOTA_KEY invalida. Verifique a chave principal sem mudar para contornar cotas.',
 CONFIG_URL:'URL REST invalida: use HTTPS do endpoint *.upstash.io, sem caminho, aspas, consulta ou credenciais TCP.',
 CONFIGURATION:'URL/token REST invalidos. Use HTTPS do banco e token REST sem aspas, Bearer ou espacos adicionais.',
 AUTHENTICATION:'Autenticacao REST recusada (WRONGPASS/401). Copie URL e token REST do MESMO banco. Senha TCP e token REST nao sao intercambiaveis.',
 PERMISSION:'Token sem permissao suficiente. Use token REST de escrita; PING sozinho nao comprova permissao para cotas.',
 NETWORK:'Falha de rede, TLS ou timeout. Nenhum detalhe de credencial foi exibido.',
 RESPONSE:'Resposta REST invalida ou acima do limite.',
 SERVICE_LIMIT:'Limite do servico Redis atingido. IA deve permanecer pausada.',
 SERVICE:'Servico REST recusou a operacao. Consulte o painel sem compartilhar credenciais.',
 STATE_MISSING:'Conexao autenticada; estado de cotas ausente. Execute novamente com -InitializePaused.',
 STATE_INVALID:'Estado existente invalido. Nao apagar nem reinicializar; revisar contadores.',
 STATE_ACTIVE:'Estado existente esta ativo. Pause pelo procedimento administrativo antes de continuar; diagnostico nao altera estado existente.',
 TEST_COLLISION:'Chave de teste ja existente; nada sobrescrito.',
 QUOTA_TEST:'Teste de cotas nao passou. Mantenha a IA desligada.',
 TEST_CLEANUP:'Limpeza da chave isolada de teste nao confirmada. Cota principal preservada.',
 CONNECTION_OK_PAUSED:'Conexao REST e estado pausado confirmados. Falta testar cotas com -TestQuotas.',
 CONNECTION_AND_QUOTAS_OK_PAUSED:'REST e cotas reais verificadas em chave isolada. Estado principal permanece pausado; Gemini nao foi chamado.'
};
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
 process.env.AI_ENABLED='false';
 const config={url:process.env.UPSTASH_REDIS_REST_URL||'',token:process.env.UPSTASH_REDIS_REST_TOKEN||'',key:process.env.AI_QUOTA_KEY||'estudai:ai:quota:v1'};
 try {const code=await diagnose(config,{initialize:process.argv.includes('--init-paused'),testQuotas:process.argv.includes('--test-quotas')});console.log(code+': '+messages[code]);}
 catch(error){const code=error instanceof DiagnosticError?error.code:'SERVICE';console.error(code+': '+(messages[code]||messages.SERVICE));process.exitCode=1;}
}


