import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { MessageChannel } from 'node:worker_threads';

const webRoot = path.resolve('artifacts/estudai-web');
const requireWeb = createRequire(path.join(webRoot, 'package.json'));
const { build } = await import(pathToFileURL(requireWeb.resolve('vite')).href);
const main = path.join(webRoot, 'src/main.tsx').replaceAll('\\', '/');
const app = path.join(webRoot, 'src/App.tsx').replaceAll('\\', '/');
const mountAdapter = '\0startup-render-adapter';

async function startup({ removeProvider = false } = {}) {
  let queryContexts = [];
  const output = await build({
    configFile: path.join(webRoot, 'vite.config.ts'),
    mode: 'production', envFile: false, logLevel: 'error',
    plugins: [{
      name: 'test-real-startup', enforce: 'pre',
      resolveId(source) { if (source === 'react-dom/client') return mountAdapter; },
      load(id) {
        if (id === mountAdapter) return `
          import { renderToString } from 'react-dom/server.browser';
          export function createRoot() {
            return { render(tree) { globalThis.__startupHtml = renderToString(tree); } };
          }
        `;
      },
      transform(code, id) {
        const file = id.replaceAll('\\', '/');
        // Substitute the DOM mount/CSS, keeping the exact tree passed by main.tsx.
        if (file === main) return code.replace("document.getElementById('root')!", 'null')
          .replace("import './index.css';", '');
        if (removeProvider && file === app) return code
          .replace('<QueryClientProvider client={queryClient}>', '')
          .replace('</QueryClientProvider>', '');
      },
      generateBundle() {
        queryContexts = [...this.getModuleIds()].filter(id => /@tanstack[/\\]react-query[/\\].*[/\\]QueryClientProvider\.js$/.test(id));
      },
    }],
    build: {
      write: false, minify: false,
      rollupOptions: { input: main, output: { format: 'iife', inlineDynamicImports: true } },
    },
  });
  const chunks = output.output.filter(item => item.type === 'chunk');
  assert.equal(chunks.length, 1);
  const pages = new Map();
  for (const pathname of ['/', '/chat', '/materiais', '/resumos', '/quizzes', '/desafios', '/desempenho']) {
    const channels = [];
    const context = vm.createContext({ console, TextEncoder, TextDecoder, ReadableStream, TransformStream,
      location: { pathname, search: '', hash: '' },
      AbortController, AbortSignal, URL, URLSearchParams, Headers, Request, Response, setTimeout, clearTimeout,
      MessageChannel: class extends MessageChannel { constructor() { super(); channels.push(this); } },
      fetch() { throw new Error('Network forbidden in startup regression'); },
    });
    try { vm.runInContext(chunks[0].code, context, { timeout: 15000 }); }
    finally { for (const channel of channels) { channel.port1.close(); channel.port2.close(); } }
    assert.ok(context.__startupHtml?.length > 0, 'No startup output for ' + pathname);
    assert.ok(!context.__startupHtml.includes('Something went wrong'), 'Fallback rendered for ' + pathname);
    pages.set(pathname, context.__startupHtml);
  }
  return { pages, queryContexts };
}

// Uses actual React, real workspace API hooks and production Vite resolution.
// Only DOM mounting is replaced by server rendering; effects/network do not run.
const actual = await startup();
assert.equal(actual.queryContexts.length, 1, 'Production startup must contain one shared QueryClient context');
assert.ok(actual.pages.get('/').includes('data-testid="button-open-chat"'), 'Home did not render through the real startup tree');
console.log('PASS: real main.tsx renders all seven routes with one QueryClient context');
await assert.rejects(startup({ removeProvider: true }), /No QueryClient set/);
console.log('PASS: missing provider in startup is detected by real API hooks');
