# Missão 12.1 — Navegação, acompanhamento e Chat IA pela página inicial

Data: 14/11/2026. Trabalho restrito a EstudAI-Missao04. Não houve deploy, envio ao GitHub, instalação de dependências ou alterações no backend, Gemini, API, banco, Expo, PostAI, OpinAI ou original Claude.

## Comparação e organização por seções

A comparação de fonte confirmou que a original Claude e a cópia atual já continham sete rotas independentes, AppFrame com sidebar, ChatPage e PerformancePage. A sidebar anterior aparecia somente a partir de 1024 px; em telas menores dependia do menu expansível. Não era necessário reconstruir páginas ou duplicar funcionalidades.

Foi mantida a estrutura original de seções e seus componentes, com estas melhorias:

- Sidebar fixa visível a partir de 768 px, com Início, Chat IA, Meus materiais, Resumos, Quizzes, Desafios e Meu desempenho. O conteúdo mantém deslocamento correspondente à sidebar.
- Abaixo de 768 px, menu expansível em duas colunas, com quebra de rótulos, ícones sem encolher e rolagem vertical quando necessário. O menu tem aria-label, aria-expanded, aria-controls, indicação aria-current, fecha ao navegar e permite Escape com retorno do foco ao botão.
- Header flexível e compositor com min-width:0 para reduzir risco de overflow em telas estreitas. O progresso do cabeçalho aparece somente em larguras com espaço suficiente.
- Início continua como dashboard, com atalhos, totais obtidos do estado local e atividade recente.
- Chat IA tem rota própria `/chat` e continua acessível pela sidebar/menu.
- Meu desempenho preserva as métricas e histórico derivados de quizAttempts e challengeAttempts, sem valores fictícios. O estado vazio existente é mantido quando não há tentativas concluídas. Materiais, resumos, quizzes, desafios e desempenho não tiveram sua lógica/JSX reimplementados.

A ausência de rolagem horizontal foi tratada no código do menu, mas ainda precisa de conferência em navegador; não foi declarada como visualmente aprovada.

## Chat integrado à página inicial

- Título, rótulo acessível e placeholder: **O que vamos aprender hoje?**
- O formulário da home chama `chat.send` da sessão existente. A mensagem do usuário é inserida no estado antes da navegação e enviada pelo mesmo useStudyChat/sendStudyChat que o ChatPage já utiliza.
- Após aceitar o envio, navega para `/chat` via Wouter, sem reload ou transporte da mensagem por querystring. Não há uma segunda implementação do Gemini.
- Novo botão **Abrir Chat IA** abre a seção sem iniciar pedido de IA e funciona mesmo quando a configuração da IA ainda está sendo verificada.
- A sessão permanece em StudyApp, acima do Switch de rotas. Navegar entre seções não desmonta o hook nem encerra uma resposta em andamento.
- Uma trava síncrona em useRef bloqueia envios/retries repetidos antes da atualização de estado do React. O estado pending controla botões e carregamento; a trava é liberada no onSettled. Limpar conversa fica indisponível durante a resposta, evitando anexar uma resposta órfã após limpeza.
- Referência atual das mensagens evita histórico obsoleto em callbacks. Retry reutiliza a última mensagem do usuário, sem adicioná-la novamente.
- Preservada a chave `estudai-chat-v1`, os campos messages/materialId, o limite de 100 mensagens salvas e o recorte de 20 mensagens enviadas à API. A persistência continua local; não há sincronização entre dispositivos.
- Erros de pedido continuam exibidos com **Tentar novamente**. Acrescentado aviso se a gravação em localStorage falhar, mantendo a conversa em memória.
- Transições ajustadas para 250 ms. View Transitions têm fallback quando não suportadas, quando falham ou quando prefers-reduced-motion está ativo. Com movimento reduzido, a entrada de página, rolagem suave e animação dos indicadores do chat são desativadas.
- Enter envia; Shift+Enter mantém quebra de linha; composição de texto via IME não dispara envio prematuro. O ChatPage recebe foco no compositor quando a IA está disponível. Mensagens têm região de log acessível e textos longos podem quebrar linha.

## Arquivos de produção modificados

1. `artifacts/estudai-web/src/App.tsx` — navegação, rótulos, menu mobile, dashboard/compositor, botão Abrir Chat IA e transição.
2. `artifacts/estudai-web/src/pages/chat.tsx` — trava de envio, referência do histórico, pending/retry, aviso de persistência, foco, teclado e acessibilidade.
3. `artifacts/estudai-web/src/index.css` — transições de 250 ms e regras de movimento reduzido.

`RELATORIO-MISSAO12-1.md` e `validation-missao12-1/` contêm a entrega, backups anteriores às alterações, comparação, testes, logs e resultados. Dist e metadados de compilação foram regenerados pelos builds normais. Identidade oficial e recursos da marca permanecem preservados.

## Validação executada

| Verificação | Resultado e limite |
| --- | --- |
| `pnpm.cmd run build:web-api` | Passou, incluindo typecheck das libs, web e API e ambos os builds. Log final: build-final.log. |
| Cenários de chat/home/navegação | 13 passaram, executando o código atual do hook e das ações da home em harness de estado/hooks. React scheduling, provider callbacks e localStorage são simulados; não é teste DOM. |
| Chat Gemini real | Passou: HTTP 200, uma chamada, 4.148 ms, resposta com 201 caracteres. Ações atuais da home + hook atual em harness + cliente sendStudyChat real + API/Gemini real. Rota resultante `/chat`; uma mensagem de usuário e uma de assistente; restauração de ambas em armazenamento simulado. |
| Regressões existentes de estudos | 12 passaram, com provedor simulado para respostas/erros; inclui validação de resumos/quizzes e preservação do histórico de teste. |
| Pontuação/desempenho de quiz | Quatro cenários existentes passaram: todos corretos, todos errados, misto e incompleto sem registro. |
| Importação/limites | Cinco cenários existentes passaram: PDF, PNG, HEIC recusado, arquivo acima do limite e armazenamento de arquivos excedido. |
| Preservação | Código de MaterialsPage até MetricCard igual ao backup: materiais, resumos, quizzes, desafios e desempenho preservados. Sete rotas e sessão fora do Switch conferidas. |
| Lint | Não há script lint configurado. Não foram instaladas ferramentas. |
| Interação no navegador | Não realizada: listBrowsers retornou `The browser access host is unavailable`. |

Os 13 cenários novos cobrem: envio único da home/navegação/transição, mensagem imediata, bloqueio de limpeza durante pedido, recebimento na mesma sessão após troca simulada de rota, restauração da chave existente, erro seguido de retry sem duplicação, bloqueio de texto vazio/longo ou IA indisponível, abertura sem envio, quatro fallbacks de transição e aviso de falha de armazenamento. Um desses cenários confirma também a preservação textual dos componentes de estudos.

A pergunta real enviada foi fictícia, sobre 12 vasos recebendo 200 ml de água cada. A chamada reutilizou o cliente existente `sendStudyChat`; não houve alteração de modelo, segredo, prompt ou endpoint. O teste usou a API local já acessível em localhost:19006; não publicou ou iniciou infraestrutura remota.

Evidências principais:

- `validation-missao12-1/navigation-comparison.json`
- `validation-missao12-1/chat-flow-test.cjs` e `chat-flow-results.json`
- `validation-missao12-1/real-chat.cjs` e `real-chat-results.json`
- `validation-missao12-1/regression-results.json`
- `validation-missao12-1/logic-results.json`
- `validation-missao12-1/upload-logic-results.json`
- `validation-missao12-1/preservation.json`

## Limitações e pendências para deploy

- Fazer teste por cliques e teclado nas sete seções, em 320, 390, 768 e 1440 px, incluindo menu aberto, respostas longas, tema claro/escuro e movimento reduzido. O código foi adaptado, mas não há comprovação visual de responsividade nesta execução.
- Conferir a primeira mensagem saindo da home, aparência da transição, indicadores/erro/retry, navegação durante uma resposta e reload real do navegador. O harness valida a lógica, não substitui essa conferência.
- O limite de 100 mensagens salvas já existia; conversas maiores mantêm somente as últimas 100 após reload. Armazenamento depende da quota e da origem do navegador.
- Permanecem as pendências da Missão 12: política de uso/custo da API pública, confirmação do proxy na hospedagem e instalação limpa Linux antes da abertura pública. Os quatro erros mobile anteriores continuam fora do build web.
- Reutilizar `README-DEPLOY-RENDER.md` e `render.yaml` já preparados. O comando de build web/API continua válido. Esta missão não autoriza aplicar o blueprint, publicar ou enviar arquivos ao GitHub.
