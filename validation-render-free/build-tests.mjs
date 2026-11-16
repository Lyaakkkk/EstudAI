import {createRequire} from 'node:module';
const require=createRequire(new URL('../artifacts/api-server/package.json',import.meta.url));
for(const name of ['api-security','regression','upstash-tests'])await require('esbuild').build({entryPoints:['validation-render-free/'+name+'.ts'],bundle:true,platform:'node',format:'cjs',outfile:'validation-render-free/'+name+'.cjs',logLevel:'warning'});
