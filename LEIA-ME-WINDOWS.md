Ajustes para rodar o EstudAI no Windows (extraia por cima do projeto):
- pnpm-workspace.yaml: libera os programas nativos do Windows
- api-server: comando "pnpm run dev:local" + arquivo .env (cole sua chave GEMINI_API_KEY)
- estudai-mobile: comando "pnpm run dev:local" + arquivo .env (endereço da API)
- estudai-web: porta padrão e proxy /api
