# EstudAI – Assistente de Estudos Inteligente

Aplicativo web e mobile para estudantes organizarem materiais e estudarem com resumos, quizzes, desafios e análise de desempenho.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

- Materiais e progresso são salvos localmente em cada plataforma; não há contas nem sincronização entre dispositivos na primeira versão.
- O provedor de IA futuro é a API Gemini direta, configurada por segredo do servidor; não usar a integração de IA paga do Replit.
- Sem a chave Gemini, os fluxos de IA devem indicar indisponibilidade claramente e nunca substituir resultados ausentes por conteúdo ou correções fictícias.

## Product

O EstudAI permite importar textos, PDFs e imagens, organizar materiais e, quando a API Gemini estiver configurada, gerar explicações, quizzes e desafios a partir deles. O desempenho deve refletir apenas respostas reais.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
