const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const baseline=fs.readFileSync('validation-render-free/artifacts_api-server_src_lib_ai-guard.ts.before','utf8');
const current=fs.readFileSync('artifacts/api-server/src/lib/ai-guard.ts','utf8');
assert.equal((baseline.match(/export async function withAiConcurrency/g)||[]).length,1);
const env=fs.readFileSync('artifacts/api-server/.env','utf8');const line=env.split(/\r?\n/).find(s=>/^\s*GEMINI_API_KEY\s*=/.test(s));
const key=line?.slice(line.indexOf('=')+1).trim().replace(/^['"]|['"]$/g,'');
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);}
const files=walk('artifacts/estudai-web/dist/public');assert.ok(!key||files.every(f=>!fs.readFileSync(f).includes(Buffer.from(key))));assert.ok(files.every(f=>!path.basename(f).startsWith('.env')));
fs.writeFileSync('validation-render-free/secret-check.json',JSON.stringify({keyAbsentFromWebBundle:true,noEnvFilesInPublic:true,secretPrinted:false},null,2));
console.log('Frontend bundle secret checks passed.');
