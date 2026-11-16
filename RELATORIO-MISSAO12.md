# Missão 12 — Validação final e preparação de publicação EstudAI Web

Data: 14/11/2026. Pasta de trabalho: EstudAI-Missao04. **Preparação concluída; publicação pública ainda depende das pendências abaixo.** Não houve deploy, criação de repositório, envio ao GitHub, instalação de dependências, alteração da original, PostAI, OpinAI ou Make. O mobile não foi editado.

## 1. Resultados funcionais e limites da evidência

A tentativa de listar navegadores retornou `The browser access host is unavailable`. Não foram executados cliques nem capturas; não há aprovação visual inventada. Foi validado um servidor Express local com NODE_ENV=production, SERVE_WEB=true e os builds reais web/API, em http://localhost:19006. Não havia Vite nem proxy de desenvolvimento nesse teste.

| Item solicitado | Resultado real |
| --- | --- |
| Inicial e navegação | As sete rotas responderam com o HTML de produção, inclusive acesso direto/recarga HTTP. Navegação por cliques não testada. |
| Texto | Resumo gerado por HTTP com texto fictício, usando mutationFn gerada + MutationObserver reais. Salvar texto no formulário não testado por cliques. |
| PDF | Função addFile real testada com PDF fictício (FileReader substituído em Node); resumo do PDF retornou 200 pelo Gemini real. Seletor, salvamento e visualizador no navegador não testados. |
| Resumo de texto Gemini | HTTP 200 em 7.076 ms. |
| Quiz de cinco questões | HTTP 200 em 10.076 ms, cinco questões completas aceitas pela validação da API. |
| Respostas e correção automática | Trechos reais finishQuiz e PerformancePage passaram nos quatro cenários existentes: 5/5 → 100%, 0/5 → 0%, 3/5 → 60%, incompleto sem registro. Executados em VM, sem DOM. |
| Desafios Gemini | HTTP 200 em 13.409 ms. |
| Avaliação de desafio Gemini | HTTP 200 em 5.782 ms, nota 67/100 para a resposta fictícia enviada. Isso valida o retorno e o contrato, não uma auditoria pedagógica da nota. |
| Persistência após recarga | Não testada no navegador. Código de localStorage preservado; regressão valida preservação de um histórico de teste após falhas, não persistência real do navegador. |
| Responsividade 320 px | Não testada em renderização. |
| Responsividade 390 px | Não testada em renderização. |
| Responsividade 768 px | Não testada em renderização. |
| Responsividade 1440 px | Não testada em renderização. |
| Logo e favicon | Quatro SVGs de produção retornaram 200, idênticos aos arquivos compilados. Paths da assinatura permanecem idênticos ao kit oficial. Aparência/legibilidade e favicon em 16/32 px não testados visualmente. |

O resumo PDF retornou HTTP 200 em 7.107 ms, com duas seções. Todos os dados enviados ao Gemini eram fictícios. Não foi usado nem alterado o localStorage do usuário. O modelo local configurado e usado foi gemini-3.5-flash. Nenhuma chave foi impressa no relatório ou logs de teste.

Evidências: `validation-missao12/real-results.json`, `functional-http-results.json`, `logic-results.json`, `upload-logic-results.json`, `production-http-results.json` e `production-server.log`.

## 2. Validação técnica executada

| Verificação | Resultado |
| --- | --- |
| `pnpm.cmd run build:web-api` | Passou; primeira execução e execução final após correções de texto. |
| Bibliotecas / typecheck web / typecheck API | Passaram, em sequência dentro de typecheck:web-api. |
| Build web Vite | Passou, 1767 módulos. |
| Build API esbuild | Passou, incluindo arquivos auxiliares de logging. |
| Regressão existente | 12 cenários passaram, em cópia local desta missão; provedor simulado nesses cenários de falha. |
| Correção e métricas do quiz | Quatro cenários existentes passaram. |
| Importação e limites | Cinco cenários passaram: PDF, PNG, HEIC recusado, >2 MiB recusado e total de arquivos excedido. |
| Configuração nova de produção | Sete testes HTTP/asserções passaram: CORS padrão de produção sem concessão a outra origem, origem autorizada, origem não autorizada, IP com/sem proxy e quatro valores inválidos de TRUST_PROXY_HOPS. |
| Servidor de produção | 18 verificações HTTP passaram: sete rotas SPA, quatro SVGs, health/status, JSON 404 para API desconhecida, 404 para asset inexistente e .env, JS/CSS compilados. |
| Gemini real | Cinco pedidos passaram: resumo texto, quiz, resumo PDF, desafios e avaliação. |
| Proteção da chave | A chave local não consta no bundle público; não há .env em dist/public. Resultado salvo apenas como booleanos. |
| Blueprint | YAML parseado localmente e campos críticos conferidos. Não foi validado pela API/painel do Render. |
| Lint / test de package.json | Não há scripts lint/test de pacote; executados os scripts de validação existentes das missões anteriores em cópias. |

Os testes CJS emitiram aviso de import.meta no novo módulo deployment.ts. Nesses testes SERVE_WEB não é ativado e esse trecho não é executado. O caminho real de montagem da web foi validado separadamente usando o bundle ESM de produção, sem esse problema. Logs e JSONs distinguem os dois contextos.

Não foi reexecutado o build agregado mobile. O build preparado para publicação exclui o Expo, cujos quatro erros anteriores continuam fora do escopo. Não houve instalação nem teste de instalação limpa Linux nesta máquina Windows.

## 3. Problemas comprovados e correções

1. **O proxy Vite não existe no bundle estático de produção.** O cliente usa /api relativo, e a API anterior não servia o frontend. Preparado um único processo Express para servir dist/public e /api na mesma origem. O smoke test de produção confirmou que a web encontra a API sem Vite.
2. **.env não era ignorado pelo .gitignore.** Adicionados .env e .env.*, preservando .env.example como modelo sem segredo. Isso protege futuros arquivos não rastreados; não apaga eventual histórico remoto. Nada foi enviado ao Git.
3. **CORS era aberto em todos os ambientes.** Produção agora não concede acesso a outra origem por padrão; uma lista explícita via CORS_ORIGINS permite separar a hospedagem futuramente. Desenvolvimento preserva o comportamento anterior. CORS não é autenticação.
4. **Rate limiting usa req.ip e precisa refletir o ingresso da hospedagem.** Adicionado TRUST_PROXY_HOPS validado (0–10), padrão 0. Blueprint propõe 1; a cadeia real do Render deve ser confirmada antes de divulgação. Não foi aplicado trust proxy=true indiscriminado. Os testes verificaram IPs sintéticos, não o ingresso remoto.
5. **Textos de marca tinham caracteres substituídos por “?”.** Corrigidos alt do logo mobile, títulos dos SVGs e comentários/documentação de marca. O slogan visual em paths nunca foi redesenhado; todos os paths permanecem iguais.

Rotas API desconhecidas agora retornam JSON 404 antes da montagem da SPA, evitando falso sucesso HTML. SERVE_WEB=true exige o build web na inicialização. Não houve alteração nos endpoints de estudos, prompts, schemas, modelos, retries ou integração Gemini.

## 4. Auditoria de produção

- **Monorepo:** pnpm workspace com web, API, Expo, sandbox e bibliotecas. Catálogos, links workspace e lockfile exigem build na raiz. Scripts novos limitam a compilação a libs/web/API; instalação futura continua completa para manter compatibilidade com o workspace.
- **Dependências:** Node 26.13.0/pnpm 12.18.0 locais, fixados para a hospedagem. devDependencies são necessárias no build. Render Linux x64/glibc é o destino proposto; os overrides existentes excluem diversas variantes nativas, incluindo musl. Nenhuma dependência foi adicionada/atualizada.
- **Chave:** lida somente pela API em GEMINI_API_KEY, enviada ao provedor no header servidor-servidor. Bundle web verificado contra o valor local sem expô-lo. Os logs existentes registram status/tempo/modelo, sem chave ou corpo do material.
- **CORS/proxy:** web/API na mesma origem; proxy localhost:8080 somente no desenvolvimento. Política de produção e parâmetros de confiança descritos no README.
- **Uploads:** UI permite PDF/JPG/PNG/WebP, 2 MiB por arquivo e 3 MiB estimados de base64 acumulado. API aceita JSON até 12 MB e até 11.500.000 caracteres de base64 pelo schema; o limite direto da API é maior que o da UI. Conteúdo não é persistido em disco pelo servidor; arquivo é enviado em JSON/base64 ao Gemini. Não foi implantado antivírus, OCR ou conversor de PDF.
- **Erros/timeouts:** geração existente tem 60 s e uma repetição de 503 dentro do mesmo prazo; não houve mudança. Falhas do provedor são traduzidas e resultados inválidos não são salvos. Erros de parser JSON/413 ainda usam o tratamento padrão Express; o frontend tem fallback de erro genérico.
- **Persistência:** exclusivamente localStorage, sem conta, backup, sincronização ou recuperação central. Estado pode exceder a quota do navegador; a aplicação informa falha ao gravar. Mudar de origem/domínio não transporta o histórico local automaticamente.
- **Banco:** não é usado pelas rotas atuais; DATABASE_URL não é exigido por esse caminho em execução. Lib/db continua como pacote do workspace/typecheck. Não criar banco ou rodar migrações para esta publicação web.
- **Abuso/custo:** endpoints de IA sem autenticação. Limitador de 12 pedidos/15 min por IP/processo para geração/avaliação e 60 para chat, em memória, sem limpeza periódica de IPs, sem limite global de gastos, sem compartilhamento entre réplicas e reiniciado com o processo. Chave escondida e CORS restrito não impedem chamadas diretas. Essa política precisa ser avaliada antes de uma abertura ampla.

## 5. Arquivos modificados/adicionados

Configuração e infraestrutura:

- `package.json`: packageManager fixado; scripts typecheck:web-api, build:web-api e start:web-api.
- `.gitignore`: proteção de .env e variantes.
- `render.yaml` (novo): um Web Service Node, segredo solicitado, modelo solicitado, healthcheck, comandos e deploy automático desligado.
- `README-DEPLOY-RENDER.md` (novo): guia operacional com comandos, variáveis, arquitetura, limites e pendências.
- `artifacts/api-server/.env.example` (novo): placeholders, sem chave real.
- `artifacts/api-server/src/app.ts`: conecta configuração de produção e montagem web.
- `artifacts/api-server/src/deployment.ts` (novo): CORS, confiança de proxy, arquivos estáticos e fallback das rotas.

Correções de codificação de texto, sem alteração dos vetores ou lógica:

- `artifacts/estudai-web/src/App.tsx` (somente alt mobile).
- `artifacts/estudai-web/src/components/brand.tsx` (comentário).
- `artifacts/estudai-web/src/index.css` (comentário).
- `artifacts/estudai-web/public/favicon.svg` (title).
- `artifacts/estudai-web/public/brand/estudai-logo.svg`, `estudai-symbol.svg`, `estudai-sparkle.svg` (titles).
- `artifacts/estudai-web/public/brand/README.md` (acentos).

`RELATORIO-MISSAO12.md` e `validation-missao12/` contêm esta entrega, backups, cópias dos testes, scripts, logs e resultados. Dist e metadados de compilação foram regenerados normalmente. Os backups das missões 11/11.1 foram preservados.

`preservation.json` confirma funções de estudo iguais ao backup da Missão 11, assinatura com paths idênticos e arquivos mobile iguais à original. Nenhuma alteração de layout, navegação, pontuação ou persistência foi feita.

## 6. Publicação preparada: comandos e variáveis

Recomendação: **um Render Web Service Node para web + API**, sem serviço estático separado nesta primeira publicação. É uma escolha baseada na estrutura atual: o cliente relativo funciona sem alteração e o Express compilado já foi testado servindo ambos. Escolher plano/região e revisar custos na missão de publicação; nenhum recurso foi contratado.

Build (na raiz):

```sh
npx --yes pnpm@12.18.0 install --frozen-lockfile --prod=false && npx --yes pnpm@12.18.0 run build:web-api
```

Start (na raiz):

```sh
node --enable-source-maps artifacts/api-server/dist/index.mjs
```

Healthcheck: `/api/healthz`. O install do comando futuro não foi executado nesta missão; o build foi validado com as dependências locais existentes. Não confundir isso com um build limpo bem-sucedido na hospedagem.

Variáveis: GEMINI_API_KEY (segredo), GEMINI_MODEL (informar o modelo escolhido/disponível; teste local usou gemini-3.5-flash), NODE_ENV=production, SERVE_WEB=true, NODE_VERSION=26.13.0, TRUST_PROXY_HOPS=1 proposto para Render. PORT fornecida pela plataforma. CORS_ORIGINS e LOG_LEVEL opcionais. Sem VITE_* secreto, DATABASE_URL ou variáveis Expo/Replit.

O blueprint pede chave e modelo via sync:false, sem copiar a chave local ou impor mudança no modelo. O default do código, se GEMINI_MODEL vazio, continua gemini-2.5-flash. O healthcheck não comprova disponibilidade Gemini.

Referências oficiais usadas na preparação: [Express no Render](https://render.com/docs/deploy-node-express-app), [Blueprint](https://render.com/docs/blueprint-spec), [Node](https://render.com/docs/node-version), [Express atrás de proxies](https://expressjs.com/en/guide/behind-proxies/). A recomendação arquitetural é uma inferência a partir do código local e dessas capacidades. O YAML foi verificado localmente; nenhuma ação foi feita no serviço Render.

## 7. Pendências antes de publicação

- Validação manual dos nove itens da etapa funcional, com especial atenção a cliques, seleção/salvamento PDF, persistência após recarga, teclado, temas e viewports 320/390/768/1440. HTTP 200 não prova renderização correta.
- Definir proteção e orçamento de uso da IA para público amplo; verificar confiança do proxy no ingresso real e limites por usuário/globais conforme a exposição desejada.
- Validar instalação limpa no Linux, plano/região, domínio/HTTPS, segredo e disponibilidade do modelo no ambiente futuro. Nenhum teste de tráfego/carga ou da infraestrutura remota foi realizado.
- Informar ao usuário final que o material selecionado é transmitido ao Gemini e que o armazenamento é somente no dispositivo/origem.
- Obter autorização específica para publicação e eventual envio ao GitHub. Criar/aplicar um Blueprint pode iniciar a primeira publicação mesmo com deploy automático desligado; isso não foi feito.

O encerramento do serviço temporário local foi solicitado ao final. A preparação de infraestrutura está concluída; aprovação visual e decisão de proteção para abertura pública permanecem pendentes.
