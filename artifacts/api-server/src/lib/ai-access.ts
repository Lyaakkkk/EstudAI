import { createHash, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

export const aiGenerationRoutes = [
  '/study/chat', '/study/summaries', '/study/quizzes', '/study/challenges', '/study/challenges/grade',
];

/** Free-tier friendly: environment config survives restarts; no quota or disk writes. */
export function createAiAccessGate(env: NodeJS.ProcessEnv = process.env): RequestHandler {
  const mode = env.AI_ACCESS_MODE ?? 'validation';
  const configuredHash = env.AI_VALIDATION_TOKEN_SHA256 ?? '';
  const hash = /^[a-f0-9]{64}$/i.test(configuredHash) ? Buffer.from(configuredHash, 'hex') : undefined;
  return (req, res, next) => {
    if (mode === 'public') { next(); return; }
    if (mode !== 'validation' || !hash) {
      res.status(503).json({ code: 'AI_VALIDATION_UNAVAILABLE',
        message: 'A IA está temporariamente bloqueada para validação. As páginas e seus materiais continuam disponíveis.' });
      return;
    }
    // Never accept credentials from query parameters, cookies or request bodies.
    const match = /^Bearer ([a-f0-9]{64})$/i.exec(req.get('authorization') || '');
    if (!match || !timingSafeEqual(hash, createHash('sha256').update(match[1]).digest())) {
      res.status(403).json({ code: 'AI_VALIDATION_REQUIRED',
        message: 'A IA está em validação controlada. As páginas e seus materiais continuam disponíveis.' });
      return;
    }
    next();
  };
}
