# EstudAI — Missão 05.1

## Causa comprovada

A falha foi reproduzida com texto fictício, usando a função sourceFromMaterial da interface e o proxy Vite em localhost:19006. Resumo: HTTP 502 em 1,96 s. Quiz: HTTP 502 em 0,72 s. Em ambos, a API registrou HTTP 503 recebido do Gemini (modelo configurado gemini-3.5-flash). Mensagem anterior: “Não foi possível acessar o Gemini. Nenhum resultado foi salvo; tente novamente mais tarde.”

O log da sessão também continha uma chamada de resumo encerrada com TimeoutError em 60,02 s. Não é possível vincular esse registro com certeza à tentativa manual relatada pela usuária. A usuária confirmou que o Gemini não respondeu.

Não foi encontrada divergência entre endpoints, proxy, hooks ou payloads. Material é selecionado por ID local; o corpo enviado contém título, texto ou arquivo e difficulty, sem depender de um ID no servidor. Os níveis são iniciante/intermediario/avancado. O quiz envia questionCount numérico entre 5 e 10. A API recebeu e processou os pedidos até chamar o provedor.

503 comprova resposta de indisponibilidade do provedor, não erro de seleção do material ou de rota. Não houve 401/403, 404 ou 429 nos testes reais desta missão. Não há evidência para atribuir estas falhas a autenticação, modelo inexistente ou quota. Timeout isolado não distingue rede de lentidão remota.

## Correção aplicada

Somente dois arquivos de produção foram alterados:

- artifacts/api-server/src/lib/gemini.ts: uma única repetição automática de HTTP 503 após 1 s, reutilizando o mesmo AbortSignal de 60 s; sem repetição automática de quota/autenticação/modelo/timeout. Classificação de erros e logs de status, modelo e tempo, sem chave, material ou corpo bruto do provedor. Fluxo do chat não recebeu repetição automática.
- artifacts/api-server/src/routes/study.ts: mensagens específicas de indisponibilidade, timeout, conexão, quota, autenticação e modelo. Mantido HTTP 502 e código AI_PROVIDER_ERROR para compatibilidade. Resumos/quizzes são validados antes do envio ao cliente; resultados incompletos retornam INVALID_AI_RESPONSE.

Uma lacuna adicional foi demonstrada em regressão: o schema anterior aceitava resumo com sections vazio e quiz com correctAnswer fora das alternativas. Agora são recusados resumo sem título/visão geral/seções preenchidas e quiz sem gabarito utilizável, com IDs/opções duplicados ou quantidade diferente da solicitada. Falta de campos obrigatórios também recebe erro específico de resposta inválida.

A interface já libera o botão após a falha e salva somente no onSuccess. Não foi preciso alterar seus componentes nem limpar localStorage. O histórico real do navegador não foi acessado/modificado pelos testes. A chave continua lida pela API; a verificação do bundle web não encontrou a chave do servidor.

## Validação

| Verificação | Resultado | Evidência |
|---|---|---|
| API e web acessíveis | PASSOU | Healthcheck e documento HTML HTTP 200 antes e depois |
| Typecheck bibliotecas | PASSOU | pnpm.cmd run typecheck:libs, exit 0 |
| Typecheck API | PASSOU | pnpm.cmd --filter @workspace/api-server typecheck, exit 0 |
| Typecheck web | PASSOU | pnpm.cmd --filter @workspace/estudai-web typecheck, exit 0 |
| Build API | PASSOU | pnpm.cmd --filter @workspace/api-server build, exit 0 |
| Build web | PASSOU | pnpm.cmd --filter @workspace/estudai-web build, exit 0 |
| Regressão API e hooks | PASSOU | 12 cenários em regression-results.json |
| Integridade/histórico após erro | PASSOU | Sem alteração do histórico de teste; retry manual funcionou |
| Upload — lógica | PASSOU | PNG pequeno aceito; formato não aceito, >2 MB e limite total tratados |
| Resumo com Gemini real após correção | FALHOU | HTTP 502 em 2,38 s; Gemini 503 nas duas tentativas |
| Quiz com Gemini real após correção | FALHOU | HTTP 502 em 2,20 s; Gemini 503 nas duas tentativas |
| Chave ausente do bundle web | PASSOU | security-check.json |
| Interação visual automática | NÃO TESTADO | Bloqueio anterior do controle do Chrome, sem repetir tentativas |
| Imagem ausente no seletor — caso específico da usuária | NÃO TESTADO | Usuária informou que arquivo não aparece para anexar; extensão/tela ainda não identificadas |

Os testes reais após a correção executaram getGenerateStudySummaryMutationOptions/getGenerateStudyQuizMutationOptions e MutationObserver, usando o cliente gerado e o proxy Vite. Isso exercita a requisição usada pelos hooks, mas não substitui clique/renderização no navegador. real-results.json contém o resultado real; não foi gerado conteúdo fictício para substituir a resposta do Gemini.

Nos testes de regressão, somente o provedor foi simulado, com chave fictícia. A API Express, serialização do cliente gerado, MutationObserver e tradução da mensagem pela função da interface foram exercitados. O histórico usado era um objeto de teste; localStorage e o histórico da usuária não foram usados. O timeout foi reduzido somente no teste para verificar a mensagem sem esperar 60 s. Cenários: 503→200; 503 persistente; retry manual; 429; 403; 404; resumo incompleto; quiz com gabarito fora das alternativas; contagem incorreta; campo obrigatório ausente; IDs duplicados; timeout.

## Imagem que não aparece para anexar

O relato mais recente é anterior ao Gemini: o arquivo não aparece na escolha de anexos. O input em Meus Materiais aceita application/pdf,image/jpeg,image/png,image/webp. A validação limita cada arquivo a 2 MB e o total de base64 de arquivos a 3 MB. Não foram ampliados formatos nem removidos limites sem comprovação do problema.

No Chat, a aplicação seleciona materiais já cadastrados; ele não tem upload direto do disco. Nesse fluxo, salvar primeiro em Meus Materiais → Enviar PDF ou imagem → Salvar arquivo e depois selecionar o material no Chat.

## Validação manual específica

1. Abrir http://localhost:19006/resumos. Selecionar um texto salvo, nível Iniciante, clicar Gerar resumo. Em DevTools → Network, filtrar summaries. Em indisponibilidade, esperar mensagem clara e conferir que a lista anterior não mudou; o botão deve liberar nova tentativa.
2. Abrir /quizzes, selecionar o mesmo texto, Iniciante e 5 questões. Gerar e inspecionar quizzes. Se HTTP 200, conferir cinco questões completas; se 502, conferir mensagem e preservação da lista. Tentar novamente somente após aguardar um pouco.
3. Para confirmar recuperação real, repetir esses dois testes quando o Gemini estiver disponível. Não basta o status “configurado”: ele confirma presença da chave, não disponibilidade do provedor.
4. Para imagem, ir a /materiais e usar o PNG fictício validation-missao05/material.png, de cerca de 6 KB. Selecionar → Salvar arquivo → abrir material; depois selecionar esse material no Chat ou gerador. Se a imagem pessoal não aparecer, registrar a extensão e o filtro exibido no seletor. Não apagar dados existentes.
5. Recarregar e conferir o histórico existente e quaisquer novos resultados completos.

## Limites e escopo

O tratamento da aplicação foi corrigido e validado, mas a geração real continua bloqueada pelo HTTP 503 remoto. Não foi trocado o modelo nem modificada a chave. Não há como garantir a disponibilidade externa por alteração no frontend.

Trabalho restrito a EstudAI-Missao04. Nenhum arquivo do Expo foi alterado. Nada foi publicado. A API foi reiniciada para carregar o build validado; API 8080 e web 19006 permaneceram acessíveis. O esbuild precisou de execução fora do sandbox por acesso negado a diretórios ancestrais, conforme observado anteriormente.

Evidências: summaries-before.json, quizzes-before.json, payload.json, regression-results.json, real-results.json, upload-logic-results.json, security-check.json e logs-relevantes.json. Os scripts de testes e compilação estão nesta pasta; arquivos .cjs gerados podem ser reconstruídos com build-tests.mjs/build-real.mjs.
