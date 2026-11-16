import {createRequire} from 'node:module';
const require=createRequire(new URL('../artifacts/api-server/package.json',import.meta.url));
for(const name of ['regression','chat-client'])await require('esbuild').build({entryPoints:['validation-missao14/'+name+'.ts'],bundle:true,platform:'node',format:'cjs',outfile:'validation-missao14/'+name+'.cjs',logLevel:'warning'});
