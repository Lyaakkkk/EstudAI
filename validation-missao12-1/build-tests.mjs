import {createRequire} from 'node:module';
const require=createRequire(new URL('../artifacts/api-server/package.json',import.meta.url));
for(const name of ['regression','chat-client'])await require('esbuild').build({entryPoints:['validation-missao12-1/'+name+'.ts'],bundle:true,platform:'node',format:'cjs',outfile:'validation-missao12-1/'+name+'.cjs',logLevel:'warning'});
