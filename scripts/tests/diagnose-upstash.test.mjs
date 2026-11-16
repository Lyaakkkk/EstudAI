import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeRequest,checkState,diagnose,normalizeConfig} from '../diagnose-upstash.mjs';
const config={url:'https://fake.upstash.io',token:'FAKE_PRIVATE_TOKEN',key:'estudai:ai:quota:v1'};
const reply=(result,status=200)=>async()=>new Response(JSON.stringify(result),{status});
const hasCode=code=>error=>error.code===code&&!error.message.includes(config.token);
test('invalid configuration makes no request',()=>assert.throws(()=>makeRequest({...config,url:'http://localhost'}),hasCode('CONFIG_URL')));
test('token boundary whitespace normalized',()=>assert.equal(normalizeConfig({...config,token:' token '}).token,'token'));
test('WRONGPASS is authentication, sanitized',async()=>assert.rejects(makeRequest(config,reply({error:'WRONGPASS '+config.token} ))(['PING']),hasCode('AUTHENTICATION')));
test('HTTP 401 is authentication',async()=>assert.rejects(makeRequest(config,reply({},401))(['PING']),hasCode('AUTHENTICATION')));
test('NOPERM is permission',async()=>assert.rejects(makeRequest(config,reply({error:'NOPERM'}))(['PING']),hasCode('PERMISSION')));
test('network exception is sanitized',async()=>assert.rejects(makeRequest(config,async()=>{throw Error(config.token)})(['PING']),hasCode('NETWORK')));
test('service quota categorized',async()=>assert.rejects(makeRequest(config,reply({},429))(['PING']),hasCode('SERVICE_LIMIT')));
test('oversized response is bounded',async()=>assert.rejects(makeRequest(config,reply({result:'x'.repeat(17000)}))(['PING']),hasCode('RESPONSE')));
test('missing state differs from invalid',()=>{assert.throws(()=>checkState(Array(8).fill(null)),hasCode('STATE_MISSING'));assert.throws(()=>checkState(['1','0','-1','0','0','0','0','0']),hasCode('STATE_INVALID'));});
test('active state never silently accepted',()=>assert.throws(()=>checkState(['1','1','0','0','0','0','0','0']),hasCode('STATE_ACTIVE')));
test('read-only diagnosis sends only PING and HMGET',async()=>{const commands=[];const transport=async(_url,init)=>{const c=JSON.parse(init.body);commands.push(c);return new Response(JSON.stringify({result:c[0]==='PING'?'PONG':['1','0','0','0','0','0','0','0']}));};assert.equal(await diagnose(config,{transport}),'CONNECTION_OK_PAUSED');assert.deepEqual(commands.map(c=>c[0]),['PING','HMGET']);});
test('isolated quota test deletes only its new key, never principal',async()=>{
 const commands=[];const statuses=['paused','ok','window','daily','unavailable'];
 const transport=async(_url,init)=>{const c=JSON.parse(init.body);commands.push(c);return new Response(JSON.stringify({result:c[0]==='PING'?'PONG':c[0]==='HMGET'?['1','0','9','8','7','6','5','4']:1}));};
 assert.equal(await diagnose(config,{transport,testQuotas:true,reserve:async cfg=>{assert.notEqual(cfg.key,config.key);return {status:statuses.shift(),retryAfter:1};}}),'CONNECTION_AND_QUOTAS_OK_PAUSED');
 const del=commands.find(c=>c[0]==='DEL');assert.ok(del[1].startsWith('estudai:diagnostic:'));assert.ok(commands.filter(c=>c[0]==='EVAL').every(c=>c[3]===del[1]));assert.equal(statuses.length,0);
});
test('failed test still cleans isolated key',async()=>{
 let cleaned=false;const transport=async(_url,init)=>{const c=JSON.parse(init.body);if(c[0]==='DEL')cleaned=true;return new Response(JSON.stringify({result:c[0]==='PING'?'PONG':c[0]==='HMGET'?['1','0','0','0','0','0','0','0']:1}));};
 await assert.rejects(diagnose(config,{transport,testQuotas:true,reserve:async()=>({status:'ok'})}),hasCode('QUOTA_TEST'));assert.ok(cleaned);
});

test('copy paste BOM and invisible boundaries normalized',()=>{const c=normalizeConfig({...config,url:'\uFEFF '+config.url+'\r\n',token:'\u200B '+config.token+'\u2060'});assert.equal(c.url,config.url);assert.equal(c.token,config.token);});
test('internal invisible characters rejected separately',()=>{for(const token of ['fake\u200Btoken','fake token','fake\r\ntoken'])assert.throws(()=>normalizeConfig({...config,token}),hasCode('CONFIG_TOKEN_CHARACTERS'));});
test('empty token classified',()=>assert.throws(()=>normalizeConfig({...config,token:' \uFEFF'}),hasCode('CONFIG_TOKEN_EMPTY')));
test('Bearer and quoted values classified',()=>{for(const token of ['Bearer fake','"fake"',"'fake'"])assert.throws(()=>normalizeConfig({...config,token}),hasCode('CONFIG_TOKEN_WRAPPER'));});
test('opaque token formats unchanged',()=>{for(const token of ['Aa_12-+/==.xyz','AXaFakeToken_123'])assert.equal(normalizeConfig({...config,token}).token,token);});
test('key validation distinct',()=>assert.throws(()=>normalizeConfig({...config,key:'invalid key'}),hasCode('CONFIG_KEY')));
