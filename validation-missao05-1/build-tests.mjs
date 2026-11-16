import {createRequire} from 'node:module';
const require=createRequire(new URL('../artifacts/api-server/package.json',import.meta.url));
await require('esbuild').build({entryPoints:['validation-missao05-1/regression.ts'],bundle:true,platform:'node',format:'cjs',outfile:'validation-missao05-1/regression.cjs',logLevel:'warning'});
