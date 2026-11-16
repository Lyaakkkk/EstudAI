import {createRequire} from 'node:module';
const require=createRequire(new URL('../artifacts/api-server/package.json',import.meta.url));
for(const name of ['api-security'])await require('esbuild').build({entryPoints:['validation-missao15/'+name+'.ts'],bundle:true,platform:'node',format:'cjs',outfile:'validation-missao15/'+name+'.cjs',logLevel:'warning'});
