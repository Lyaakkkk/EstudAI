import express, { type Express } from 'express';
import cors from 'cors';
import path from 'node:path';
import { existsSync } from 'node:fs';

/** Infrastructure only: no change to study endpoints or Gemini requests. */
export function configureDeployment(app: Express) {
  const hops = process.env.TRUST_PROXY_HOPS ?? '0';
  if (!/^\d+$/.test(hops) || Number(hops) > 10) {
    throw new Error('TRUST_PROXY_HOPS must be an integer between 0 and 10.');
  }
  app.set('trust proxy', Number(hops));
  app.disable('x-powered-by');
  const origins = process.env.CORS_ORIGINS?.split(',').map(value => value.trim()).filter(Boolean);
  // Same-origin production needs no CORS grants. Development keeps its existing behavior.
  app.use(cors({ origin: origins?.length ? origins : process.env.NODE_ENV !== 'production' }));
}

export function mountWeb(app: Express) {
  // API errors must never become the SPA's index.html.
  app.use('/api', (_req, res) => { res.status(404).json({ code: 'NOT_FOUND', message: 'Rota de API não encontrada.' }); });
  if (process.env.SERVE_WEB !== 'true') return;
  const webDir = path.resolve(import.meta.dirname, '../../estudai-web/dist/public');
  const index = path.join(webDir, 'index.html');
  if (!existsSync(index)) throw new Error('Web build missing. Run pnpm run build:web-api before starting with SERVE_WEB=true.');
  app.use(express.static(webDir, { index: false }));
  const routes = new Set(['/', '/chat', '/materiais', '/resumos', '/quizzes', '/desafios', '/desempenho']);
  app.use((req, res, next) => {
    if (req.method !== 'GET' || !routes.has(req.path) || !req.accepts('html')) { next(); return; }
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(index);
  });
}
