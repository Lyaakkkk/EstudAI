# Chat com a IA no EstudAI

Extraia este zip POR CIMA da pasta do projeto (aceite substituir os arquivos).
Nenhuma dependência nova é necessária.

## Arquivos novos
- lib/api-client-react/src/chat.ts
- artifacts/estudai-mobile/components/ChatScreen.tsx
- artifacts/estudai-web/src/pages/chat.tsx

## Arquivos alterados
- lib/api-client-react/src/index.ts (1 linha: export do chat)
- artifacts/api-server/src/lib/gemini.ts (função generateGeminiChat no final)
- artifacts/api-server/src/routes/study.ts (limite de requisições separado + rota POST /api/study/chat)
- artifacts/estudai-mobile/app/(tabs)/index.tsx (nova seção "Conversar com a IA")
- artifacts/estudai-mobile/components/StudySections.tsx (1 linha: atalho na tela inicial)
- artifacts/estudai-web/src/App.tsx (menu, rota /chat e atalho na página inicial)

## Depois de extrair
1. pnpm install (se ainda não rodou)
2. pnpm run typecheck
3. Reinicie o servidor da API e o app (a chave GEMINI_API_KEY precisa estar configurada)
