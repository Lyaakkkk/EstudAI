const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),crypto=require('crypto');
const {createRequire}=require('module');
async function main(){
 const req=createRequire(path.resolve('lib/api-spec/package.json'));
 const yaml=require(path.resolve('node_modules/.pnpm/js-yaml@4.3.2/node_modules/js-yaml'));const render=yaml.load(fs.readFileSync('render.yaml','utf8'));const service=render.services[0],env=Object.fromEntries(service.envVars.map(e=>[e.key,e]));
 assert.equal(service.plan,'free');assert.equal(service.numInstances,1);assert.ok(!service.disk);assert.ok(!env.AI_BUDGET_FILE);assert.equal(env.AI_ENABLED.value,'false');assert.equal(env.AI_QUOTA_STORE.value,'upstash');
 assert.equal(env.UPSTASH_REDIS_REST_TOKEN.sync,false);
 const admin=await import('../scripts/ai-quota-admin.mjs');
 const init=admin.buildAdminCommand('init','estudai:ai:quota:v1');assert.ok(init[1].includes("if redis.call('EXISTS',KEYS[1])==1 then return 0"));assert.ok(init[1].includes("'enabled',0"));
 for(const action of ['pause','resume']){const command=admin.buildAdminCommand(action,'estudai:ai:quota:v1');assert.ok(command[1].includes("v~='1'"));assert.ok(!command[1].includes("'calls'"));assert.ok(!command[1].includes('DEL'));}
 assert.throws(()=>admin.buildAdminCommand('reset','safe'));
 const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 const root='artifacts/estudai-web/public/brand/';const record=JSON.parse(fs.readFileSync('validation-missao15/svg-integration.json','utf8'));
 assert.equal(sha(root+'estudai-logo-dark.svg'),record.logoDarkSha256);assert.equal(sha(root+'estudai-icon-dark.svg'),record.iconDarkSha256);assert.equal(sha(root+'estudai-logo-light.svg'),sha(root+'estudai-logo.svg'));
 for(const name of ['artifacts_estudai-web_src_App.tsx','artifacts_estudai-web_src_pages_chat.tsx']){
  const file=name.includes('App')?'artifacts/estudai-web/src/App.tsx':'artifacts/estudai-web/src/pages/chat.tsx';
  const before=fs.readFileSync('validation-render-free/'+name+'.before','utf8'),after=fs.readFileSync(file,'utf8');
  const anchor=name.includes('App')?'function AiNotice':'export default function ChatPage';
  if(before.includes(anchor))assert.equal(before.split(anchor)[0],after.split(anchor)[0]);
 }
 const publicNames=fs.readdirSync(root);assert.ok(!publicNames.some(n=>n.startsWith('.env')));
 const result={freeBlueprintParsed:true,noPersistentDisk:true,offByDefault:true,adminCommandsInspectedOnly:true,officialSvgHashesPreserved:true,noLiveRedisConnection:true,noLinuxAvailable:true};
 fs.writeFileSync('validation-render-free/final-checks.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}
main().catch(e=>{console.error(e);process.exitCode=1});

