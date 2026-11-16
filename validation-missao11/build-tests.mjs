import {createRequire} from 'node:module';
const require=createRequire(new URL('../artifacts/api-server/package.json',import.meta.url));
for(const name of ['regression','real']) await require('esbuild').build({entryPoints:['validation-missao11/'+name+'.ts'],bundle:true,platform:'node',format:'cjs',outfile:'validation-missao11/'+name+'.cjs',logLevel:'warning'});
