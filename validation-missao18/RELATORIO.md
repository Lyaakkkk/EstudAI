# Missão 18 — validação final do EstudAI

Data: 15/11/2026. Recomendação: **pronto para publicação de web/API com IA pausada; não pronto para liberar a IA como funcionalidade validada em produção**. Nenhuma publicação, push ou chamada real ao Gemini foi realizada.

O resultado real `CONNECTION_AND_QUOTAS_OK_PAUSED` foi fornecido como contexto confirmado pelo usuário; não foi reexecutado nesta missão. As credenciais não foram lidas nem impressas. Nenhum comando desta missão acessou ou alterou a chave principal do Upstash. `render.yaml` continua com `AI_ENABLED=false`. Os processos de teste usam variáveis próprias, chaves de teste e provedores simulados.

| Verificação executada | Resultado |
|---|---|
| `pnpm.cmd run test:security` | 19 verificações aprovadas, fetch simulado |
| `node --test scripts/tests/diagnose-upstash.test.mjs` | 19 testes aprovados |
| `node scripts/test-mission18.mjs` | 45 cenários aprovados na API compilada |
| `node scripts/tests/mission18-frontend.mjs` | 5 verificações aprovadas |
| `node validation-render-free/chat-flow-test.cjs` | 13 cenários aprovados |
| `node validation-render-free/guard-tests.cjs` | 11 cenários aprovados |
| `pnpm.cmd run verify:production` | 19 verificações aprovadas |
| `pnpm.cmd run build:web-api` | Aprovado, incluindo typecheck de bibliotecas, web e API |
| `pnpm.cmd run typecheck` | Reprovado por quatro erros no aplicativo mobile |

Total: 131 verificações automatizadas aprovadas; nenhum cenário comportamental reprovado nas suítes acima. O typecheck global permanece reprovado. As primeiras execuções do teste de segurança e do build foram bloqueadas pelo sandbox de leitura do esbuild; ambas passaram ao serem executadas com a permissão local apropriada. Isso não exigiu mudança no produto.

As cinco rotas auditadas são `POST /api/study/summaries`, `/quizzes`, `/challenges`, `/challenges/grade` e `/chat`. Todas passam por `generateGeminiJson` ou `generateGeminiChat`, pelo controle de concorrência e por `guardedProviderFetch`. A reserva persistente ocorre antes de cada tentativa efetiva de acesso ao provedor. A repetição única de HTTP 503 em geração JSON também exige uma nova reserva; chat não possui essa repetição automática.

O adaptador Upstash usa EVAL com Lua para verificar versão, pausa, integridade do estado, limites diários de chamadas/bytes/tokens e janela compartilhada de 15 minutos. O script usa o relógio do Redis, atualiza os contadores atomicamente e não cria uma chave ausente, não habilita o estado e não atribui TTL. Tokens de saída são reservados pelo máximo solicitado, de forma conservadora; falhas do provedor não devolvem essa reserva. A renovação diária segue UTC. Concorrência e limite por IP são locais ao processo; as cotas globais ficam no Upstash.

Os testes novos exercitaram a API Express compilada por HTTP local com pausa remota, falha de rede, HTTP 429 do Upstash, resposta malformada, estado ausente/inválido e esgotamento diário/por janela. Todos bloquearam o provedor, retornaram código estruturado, mensagem e `Retry-After`, sem conteúdo secreto. A pausa por variável bloqueou as cinco rotas antes do acesso ao contador remoto.

A persistência foi exercitada encerrando e iniciando processos distintos da API, mantendo o contador remoto simulado no processo supervisor. Foram preservados os bloqueios por chamadas, bytes de entrada, tokens reservados e uso da janela. Isso comprova que o processo Express não reinicializa nem substitui os limites remotos. **Esses testes não executam Lua nem comprovam durabilidade de um Redis real durante reinício.** O diagnóstico real informado anteriormente complementa essa evidência, mas um teste real de reinício com uma nova chave isolada continua pendente para validação completa da infraestrutura. Não se deve apagar, reinicializar ou habilitar a chave principal para realizá-lo.

O cliente `customFetch` preserva HTTP status, `data.code`, `data.message` e cabeçalhos no `ApiError`. As funções usadas pelas telas de geração e chat apresentam as mensagens de cota diária, janela, pausa, concorrência e indisponibilidade. Os testes do chat também confirmaram liberação do estado pendente após falha, reenvio sem duplicação e preservação da conversa. O frontend apresenta as mensagens enviadas pelo servidor; não possui contagem regressiva baseada no `Retry-After`. Não houve validação visual em navegador nesta missão.

`GET /api/study/ai-status` verifica configuração local, sem consultar a saúde ou o estado remoto do Upstash. Portanto, quando as variáveis locais permitirem IA, `configured=true` não garante disponibilidade remota ou saldo. A tentativa de geração continua protegida e apresenta o erro correspondente. Isso limita o significado do indicador, sem permitir chamadas sem reserva.

Não foi comprovada falha funcional no fluxo web/API que exigisse alteração de produção. Foram adicionados apenas os testes da missão e o comando `pnpm run test:mission18` (executar depois de `pnpm run build:web-api`). Os ajustes feitos durante o desenvolvimento dos novos testes trataram caminhos de importação no Windows e encerramento de processos. Visual, funcionalidades e estrutura do produto foram preservados; PostAI e OpinAI não foram modificados.

O typecheck global acusa problemas preexistentes no alvo mobile: tipo da referência e chamada `scrollToEnd` em `artifacts/estudai-mobile/components/ChatScreen.tsx:296` e `:303`; símbolo `maxMessageChars` ausente em `:473`; incompatibilidade entre `Uint8Array<ArrayBufferLike>` e `BlobPart` em `components/MaterialViewer.tsx:82`. Não foram corrigidos por não integrarem o alvo web/API desta publicação. Impedem declarar o monorepo inteiro aprovado. O Render usa `build:web-api`, que passou; não trocar esse comando por `build` sem resolver o mobile.

Para o Render, manter o serviço Node Free, uma instância, deploy automático desligado, e as configurações já declaradas em `render.yaml`:

- Build: `npx --yes pnpm@12.18.0 install --frozen-lockfile --prod=false && npx --yes pnpm@12.18.0 run build:web-api`.
- Start: `node --enable-source-maps artifacts/api-server/dist/index.mjs`.
- Health check: `/api/healthz`. O servidor lê `PORT` fornecido pela plataforma.
- `NODE_VERSION=26.13.0`, `NODE_ENV=production`, `SERVE_WEB=true`, `TRUST_PROXY_HOPS=1`.
- `AI_ENABLED=false`, `AI_QUOTA_STORE=upstash`, `AI_QUOTA_KEY` apontando para o estado principal existente, mantido pausado.
- Limites: `AI_DAILY_PROVIDER_LIMIT=20`, `AI_DAILY_INPUT_BYTES=8388608`, `AI_DAILY_OUTPUT_TOKENS=65536`, `AI_PROVIDER_WINDOW_LIMIT=6`, `AI_MAX_CONCURRENT=1`.
- Configurar privadamente `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `GEMINI_API_KEY` e `GEMINI_MODEL`. Conferir ausência de espaços/caracteres invisíveis nas credenciais. Nenhum valor secreto consta neste relatório. O modelo padrão do código é `gemini-2.5-flash`; sua disponibilidade real não foi testada.
- Web e API são servidos na mesma origem. Não é necessário liberar CORS para origens externas nesse cenário. Não usar arquivo local como armazenamento de cotas no Render Free.

O Render Free suspende serviços após 15 minutos sem tráfego e usa filesystem efêmero; arquivos locais não oferecem persistência após reinícios/redeploys. Por isso, o Upstash é necessário para as cotas; materiais e histórico continuam no armazenamento do navegador, conforme o comportamento existente. Fontes oficiais consultadas: [Render Free](https://render.com/docs/free), [versão do Node](https://render.com/docs/node-version) e [discos persistentes](https://render.com/docs/disks). O build Linux e a disponibilidade efetiva das dependências durante instalação no Render ainda não foram observados, pois não houve deploy.

Antes de liberar IA para uso real, obter autorização específica para chamadas ao Gemini e validar credencial/modelo, resumo, quiz, desafios, avaliação e chat com texto e anexos suportados; verificar qualidade/formato, tempos de resposta, tratamento de erros reais e consumo de cotas. Usar uma chave de cotas nova e isolada para os testes controlados e confirmar persistência após reiniciar a API, preservando o estado principal pausado. A eventual ativação global exige uma decisão posterior; não foi realizada nem proposta como etapa automática desta missão.

Evidências novas: `integration-results.json` e `frontend-results.json` neste diretório. Os contadores de chamadas presentes nesses arquivos são exclusivamente de provedores simulados.
