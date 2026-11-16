# Missão 15 — Finalização do EstudAI

Data: 14/11/2026. Trabalho exclusivo em EstudAI-Missao04. Sem deploy, criação de repositório, envio ao GitHub, alteração de PostAI/OpinAI ou da original Claude.

**Veredito:** MVP web implementado e validado localmente. **Ainda não aprovado para deploy público**, pois a instalação limpa Linux e os testes manuais no navegador não puderam ser executados. A preparação de produção está entregue com comandos reproduzíveis; não foi declarada uma validação que não ocorreu.

## 1. SVGs localizados e integrados

O arquivo inicialmente indicado, Downloads/svg, é PNG de 1440 × 1080, não SVG. Foi inspecionado apenas como referência. Após esclarecimento da usuária, localizou-se Downloads/svg dark: um ZIP sem extensão com as variantes vetoriais. Somente os dois arquivos EstudAI foram extraídos; os arquivos PostAI/OpinAI do pacote não foram extraídos nem alterados.

- Logo claro: estudai-logo-light.svg, idêntico ao original estudai-logo.svg, preservado.
- Novo logo escuro: estudai-logo-dark.svg fornecido no ZIP, integrado diretamente sem recoloração/redesenho. Os mesmos 35 paths geométricos do original foram confirmados. O viewBox fornecido é 8 1 961 347.
- Novo ícone escuro: estudai-icon-dark.svg fornecido no ZIP, quatro paths, viewBox 8 1 386 302.
- Ícone claro: estudai-icon-light.svg copia o símbolo oficial já existente.
- Sparkle escuro: paths 29 e 30 e defs extraídos do novo SVG escuro, mantendo exatamente seus elementos.
- Favicon acompanha o tema resolvido Claro/Escuro/Sistema pelo bootstrap e store. O favicon legado foi preservado como arquivo, mas não é o recurso ativo no HTML.
- Logo e sparkle continuam trocados por CSS no componente existente. Nenhuma segunda logo foi gerada.

Os SVGs não têm rect/image de fundo, scripts ou recursos externos. A geometria original preserva E, capelo, sparkle, letras e slogan. Não existe cartão de fundo aplicado ao logo no componente atual. Isso confirma transparência/estrutura; a aparência final em navegador ainda é pendente.

Comparação local: [SVGs integrados](validation-missao15/svg-comparison.html). Evidências: attachment-audit.json, svg-integration.json, final-checks.json e preservation.json.

## 2. Segurança proporcional ao MVP

A auditoria confirmou que o limite anterior por IP não estabelecia consumo global persistente nem concorrência. Foi implementado:

| Proteção | Padrão |
| --- | --- |
| Tentativas ao provedor/dia UTC | 100 |
| Corpos enviados ao provedor/dia | 20 MiB |
| Máximo de saída reservado/dia | 100.000 tokens |
| Tentativas globais/janela fixa de 15 min | 20 |
| Operações simultâneas | 2 |
| Por IP: gerações/avaliações por 15 min | 12, preservado |
| Por IP: chat por 15 min | 60, preservado |
| Registro de IPs | Teto de 5000 entradas, limpeza de expiradas |
| Corpo JSON de entrada | Até 3 MiB |
| Arquivo enviado | Até 2 MiB decodificados |
| Resposta bruta do provedor | Até 1 MiB |

O limite que ocorrer primeiro prevalece. Cada tentativa reserva o máximo já existente na configuração Gemini: 8192 tokens de saída para geração estruturada, 4096 para chat. Assim, o padrão de tokens permite até 12 tentativas estruturadas/dia se não houver outros pedidos, apesar do teto de 100 chamadas. Falhas, timeouts e a repetição de HTTP 503 também consomem reserva. Os testes confirmaram que as 14 tentativas feitas pela regressão constam no contador, incluindo os retries.

Os totais diários são gravados com troca atômica em arquivo privado, para um processo/instância. Não contêm chaves, IPs, material ou conversa. Cota renova às 00:00 UTC. Contador corrompido, I/O indisponível ou configuração inválida não permitem seguir para o provedor. Em produção AI_BUDGET_FILE é obrigatório.

As reservas são conservadoras, não medição de tokens cobrados nem teto exato em dólares. O modelo e o tratamento de PDFs influenciam faturamento; configurar também os controles disponíveis do projeto Gemini e acompanhar uso. [Billing oficial](https://ai.google.dev/gemini-api/docs/billing).

Entradas: schemas existentes preservados e sincronizados com o limite de upload; base64 deve ser canônico, com tamanho decodificado limitado e assinatura coerente com PDF, JPEG, PNG ou WebP. Essa checagem básica não é antivírus nem parser completo de documentos.

Erros: JSON seguro para parser inválido, payload excessivo, limite ou indisponibilidade; limites informam Retry-After. Chaves, stack, corpo bruto do provedor e caminhos internos não são devolvidos. Resultados continuam validados antes do sucesso; estados de estudo só salvam no sucesso. Respostas de erro do chat liberam o corpo HTTP. Não houve alteração de prompts, modelo, URL Gemini ou criação de outra integração.

Contratos OpenAPI/cliente/Zod foram atualizados com os novos códigos de erro e tamanho base64 máximo, usando o codegen existente. Não houve instalação/atualização de dependências.

A API continua pública, sem login. Uma pessoa pode consumir a cota coletiva e deixar o assistente temporariamente indisponível. Os limites reduzem consumo e concorrência; não constituem autenticação ou proteção DDoS completa. Para escala ou tráfego maior, usar contador compartilhado/transacional, autenticação e proteção de ingresso.

## 3. Validação técnica e funcional

| Verificação | Resultado real |
| --- | --- |
| Typecheck libs/web/API | Passou no build:web-api; API conferida novamente após o último ajuste. |
| Build web/API | Passou; builds finais isolados também passaram. |
| Codegen existente | Passou, sem instalar pacotes; typecheck das bibliotecas passou. |
| Temas/favicons | 14 cenários passaram em VM com DOM/media/storage simulados. |
| Chat/home/navegação | 13 cenários passaram no harness existente, sem DOM real. |
| Regressões de estudos | 12 cenários passaram com provedor simulado. |
| Pontuação/desempenho de quizzes | Quatro cenários existentes passaram. |
| Importação/limites de materiais | Cinco cenários passaram. |
| Cotas/concorrência | 11 cenários passaram, com arquivos de contador reais e provedor simulado. |
| Segurança via HTTP Express | 26 verificações passaram, sem chave real. |
| Start / mesma origem | 19 verificações passaram no bundle de produção, processo local isolado, sem Vite. |
| Gemini real | Seis fluxos passaram em instância de produção local isolada. |
| Proteção da chave | Valor local ausente do bundle web, sem imprimir a chave. Nenhum .env em dist/public. |
| Blueprint | YAML parseado e campos críticos conferidos localmente; não aplicado ao Render. |
| Linux limpo | Não executado; runtime Linux utilizável indisponível. |
| Testes manuais/UI | Não executados; navegador automatizado indisponível. |

Total de cenários existentes/estendidos de interface lógica e estudos: 48 (14 + 13 + 12 + 4 + 5). Segurança: mais 37 (11 + 26). Smoke de produção: 19 verificações. Esses números não são aprovação de testes manuais.

Segurança HTTP cobriu: JSON inválido, payload acima de 3 MiB, texto excessivo, PDF falso, arquivo acima de 2 MiB, base64 inválido, papel de chat inválido, PDF/texto válidos, resposta excessiva do provedor, detalhe/chave não expostos, cota diária esgotada, arquivo de cota corrompido e bloqueio após 12 pedidos por IP. Requisições inválidas não chegam ao provedor.

### Gemini real — somente material fictício

| Fluxo | HTTP | Tempo aproximado |
| --- | --- | --- |
| Resumo de texto | 200 | 15,2 s |
| Quiz com cinco questões | 200 | 20,7 s |
| Resumo de PDF | 200 | 9,5 s |
| Desafios | 200 | 16,8 s |
| Avaliação de desafio | 200 | 15,9 s |
| Primeira mensagem da home → Chat IA | 200 | 5,1 s |

A avaliação retornou 100/100 para a resposta fictícia utilizada; isso verifica contrato/retorno, sem representar auditoria pedagógica da nota. A primeira mensagem acionou uma única chamada e resultou na rota /chat. O teste usou o código atual de home/hook em harness e o cliente sendStudyChat real, API real e Gemini real. Estado/navegação/localStorage eram simulados; não houve clique nem recarga manual.

A API isolada foi iniciada em 19316 e encerrada pelo próprio teste. Modelo local já configurado: gemini-3.5-flash. Nenhum dado pessoal ou histórico real do navegador foi enviado. Resultados: real-suite-results.json, real-results.json, functional-http-results.json, real-chat-results.json e real-server.log.

### Sete seções, histórico e responsividade

As sete rotas retornaram o documento de produção pela mesma origem; os seis SVGs ativos retornaram exatamente os recursos compilados. API desconhecida, .env e asset inexistente retornaram 404. Parser e falta de chave produziram erros JSON seguros.

O código da página inicial e funções de estudo permanece igual ao backup conferido; o arquivo de chat também permaneceu intacto. Histórico e desempenho continuam baseados no armazenamento existente. O harness confirma envio único, retry sem duplicação, troca simulada de seção e restauração em armazenamento simulado.

Navegação por cliques, envio pelo seletor do sistema, recarga/persistência real e responsividade em 320/390/768/1440 NÃO foram aprovados manualmente. A tentativa atual do navegador retornou “The browser access host is unavailable”.

## 4. Produção e instalação Linux

Host local: Windows, Node 26.13.0. Docker não foi encontrado. O wsl.exe disponível não conseguiu executar uname em Linux e retornou ajuda/instruções; não se instalou WSL/Docker nem se alterou o sistema. A limitação está registrada em linux-probe.json.

Foi entregue Dockerfile.verify com Node 26.13.0 Debian/glibc, instalação do lockfile sem node_modules local, build web/API e smoke test. .dockerignore exclui .env, credenciais, dependências locais, dist e evidências. A imagem não foi construída nesta máquina.

Em um ambiente com Docker:

    docker build --no-cache --progress=plain -f Dockerfile.verify -t estudai-verify .
    docker run --rm estudai-verify

Esses comandos são preparação reproduzível, não evidência de execução Linux. A imagem de validação executa o teste e termina; não é usada como serviço público.

### Render preparado

Um Web Service Node, raiz do monorepo, uma instância. Disco persistente de 1 GB em /var/data para o contador diário. Disco exige serviço pago; sem disco, o filesystem padrão é efêmero. Não contratar/provisionar nada sem a missão de publicação. [Discos Render](https://render.com/docs/disks).

Build:

    npx --yes pnpm@12.18.0 install --frozen-lockfile --prod=false && npx --yes pnpm@12.18.0 run build:web-api

Start:

    node --enable-source-maps artifacts/api-server/dist/index.mjs

Healthcheck: /api/healthz. Variáveis: GEMINI_API_KEY, GEMINI_MODEL, NODE_ENV=production, SERVE_WEB=true, NODE_VERSION=26.13.0, TRUST_PROXY_HOPS=1 proposto, AI_BUDGET_FILE=/var/data/ai-budget.json e os cinco limites AI_* descritos no README. PORT é fornecida pelo Render. CORS_ORIGINS e LOG_LEVEL opcionais. Sem VITE_* secreto ou banco de estudos.

Health/status não comprovam disponibilidade do Gemini ou saldo de cota. Confirmar a cadeia do proxy no ambiente real, as permissões do disco, o modelo, a quota e HTTPS antes da divulgação. CORS não autentica.

O blueprint mantém autoDeployTrigger off; sua criação/aplicação ainda pode iniciar a primeira publicação e não foi feita. [Blueprint oficial](https://render.com/docs/blueprint-spec). README-DEPLOY-RENDER.md e .env.example foram atualizados.

## 5. Arquivos modificados/adicionados

Frontend/marca:

- artifacts/estudai-web/index.html — favicon por tema no bootstrap.
- artifacts/estudai-web/src/lib/theme.ts — favicon acompanha o tema resolvido.
- artifacts/estudai-web/public/brand/estudai-logo-dark.svg — novo arquivo fornecido, integrado.
- artifacts/estudai-web/public/brand/estudai-sparkle-dark.svg — extração fiel do novo logo.
- artifacts/estudai-web/public/brand/estudai-icon-dark.svg — novo ícone fornecido.
- artifacts/estudai-web/public/brand/estudai-icon-light.svg — cópia do símbolo oficial claro.
- artifacts/estudai-web/public/brand/README.md — origem e integração atuais.

API/contratos:

- artifacts/api-server/src/lib/ai-guard.ts (novo).
- artifacts/api-server/src/lib/gemini.ts — aplicação de cotas/concorrência e limite de resposta, sem trocar a integração.
- artifacts/api-server/src/routes/study.ts — limite de entradas/arquivos, memória de IP e respostas seguras de cota.
- artifacts/api-server/src/app.ts — limite JSON e handler de erros seguro.
- lib/api-spec/openapi.yaml — códigos e limite de arquivo documentados.
- lib/api-client-react/src/generated/api.schemas.ts — regenerado.
- lib/api-zod/src/generated/api.ts — regenerado.
- lib/api-zod/src/generated/types/studyAiErrorCode.ts — regenerado.
- lib/api-zod/src/generated/types/studySourceFile.ts — regenerado.

Produção/documentação:

- render.yaml — uma instância, disco e variáveis de segurança.
- artifacts/api-server/.env.example — placeholders, sem chave.
- package.json — script verify:production.
- scripts/verify-production.mjs (novo).
- Dockerfile.verify e .dockerignore (novos).
- README-DEPLOY-RENDER.md — guia atual.
- RELATORIO-MISSAO15.md e validation-missao15/ — entrega, backups e evidências.

Saídas de build e metadados TypeScript foram regenerados normalmente. Não houve alteração manual em arquivos gerados: foi usado o codegen existente. Originais SVG, backups e projetos fora do escopo foram preservados.

## 6. Riscos restantes e aprovação para deploy

Pendências obrigatórias:

1. Executar instalação/build/start limpos em Linux e guardar o resultado.
2. Conferir manualmente as sete seções, logo/favicon, Claro/Escuro/Sistema, envio da home, respostas/erros, textos/PDFs, resumos/quizzes/desafios/correção, desempenho, reload e tamanhos mobile/desktop.
3. Confirmar plano/disco, segredo, modelo, limites e trust proxy no ambiente Render antes de divulgar; nenhuma configuração remota foi aplicada.

Riscos residuais: cota coletiva pode ser esgotada por terceiros; não há conta/autenticação/backup de estudos; a aplicação não é proteção DDoS completa; reservas de consumo não equivalem a faturamento exato; o provedor pode ficar indisponível. Para escala, rever autenticação e contador distribuído. Alteração de domínio não transporta o localStorage anterior.

**Resposta objetiva:** o MVP está concluído para validação final e apresentação local. **Ainda não está aprovado para deploy público**, por falta das duas evidências principais: Linux limpo e testes manuais reais. Nenhum deploy ou envio ao GitHub foi realizado.

