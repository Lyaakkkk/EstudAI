# EstudAI — Render Free com cotas externas

Atualizado em 14/11/2026. Configuração preparada; nenhum deploy, conta, banco ou conexão real foi criado. Escopo: somente EstudAI-Missao04.

## Configuração simplificada — Missão 17

Começar pelo [procedimento único de diagnóstico privado](CONFIGURAR-IA.md). Verifica REST e cotas em chave isolada, mantendo a principal pausada. Não ativar IA nesta missão.

## Situação e arquitetura

Web e API Node no MESMO Web Service Free, na raiz do monorepo. O Node serve o build estático e /api; cliente usa URLs relativas. Não há disco persistente, banco relacional obrigatório, proxy Vite em produção ou autenticação obrigatória para visitantes.

As cotas globais usam o adaptador Upstash Redis Free aprovado pela usuária, com fetch nativo e sem nova dependência. Somente contadores, versão do estado e chave de pausa são armazenados; nenhum material, conversa ou IP vai para Redis. Histórico, materiais e desempenho continuam no armazenamento local do navegador, sem sincronização entre dispositivos. Limpar os dados do navegador pode apagá-los.

O render.yaml usa plan free, uma instância, sem disk e sem AI_BUDGET_FILE. A IA começa DESLIGADA. O site inicia sem credenciais de Redis/Gemini ou arquivo de cotas. Não está liberado para publicação pública com IA: faltam os testes externos/Linux/manuais abaixo.

## Comandos exatos

Node 26.13.0; pnpm 12.18.0. Executar na raiz:

    npx --yes pnpm@12.18.0 install --frozen-lockfile --prod=false
    npx --yes pnpm@12.18.0 run build:web-api
    npx --yes pnpm@12.18.0 run test:security
    npx --yes pnpm@12.18.0 run verify:production

Build Command no Render:

    npx --yes pnpm@12.18.0 install --frozen-lockfile --prod=false && npx --yes pnpm@12.18.0 run build:web-api

Start Command:

    node --enable-source-maps artifacts/api-server/dist/index.mjs

Health Check: /api/healthz. Root Directory: raiz do monorepo. Render fornece PORT; servidor escuta 0.0.0.0. Não apontar para a pasta mobile. O build inclui typecheck das bibliotecas, web e API, sem exigir conserto do mobile.

Para instalação limpa Linux, em máquina com Docker:

    docker build --no-cache -f Dockerfile.verify -t estudai-verify .

Esse Dockerfile instala com lockfile congelado, compila, executa test:security e smoke test. NÃO foi executado aqui: Docker ausente e WSL sem distribuição executável. Não confundir o build Windows aprovado com instalação limpa Linux.

## Variáveis do serviço

| Variável | Valor/finalidade |
| --- | --- |
| NODE_VERSION | 26.13.0 |
| NODE_ENV | production |
| SERVE_WEB | true |
| TRUST_PROXY_HOPS | 1 no Render; 0 em execução local direta |
| AI_ENABLED | false inicialmente; true apenas após configuração e validação |
| AI_QUOTA_STORE | upstash |
| AI_QUOTA_KEY | estudai:ai:quota:v1; usar a mesma chave em todos os reinícios |
| UPSTASH_REDIS_REST_URL | Endpoint HTTPS do banco próprio, formato https://nome.upstash.io |
| UPSTASH_REDIS_REST_TOKEN | Segredo REST de escrita, somente servidor |
| GEMINI_API_KEY | Segredo, somente servidor |
| GEMINI_MODEL | gemini-2.5-flash, ou modelo disponível validado pelo responsável |
| AI_DAILY_PROVIDER_LIMIT | 20 tentativas globais/dia UTC |
| AI_DAILY_INPUT_BYTES | 8388608 bytes globais/dia |
| AI_DAILY_OUTPUT_TOKENS | 65536 tokens máximos reservados/dia |
| AI_PROVIDER_WINDOW_LIMIT | 6 tentativas globais/15 minutos |
| AI_MAX_CONCURRENT | 1 operação de IA ativa por processo |
| CORS_ORIGINS | Omitir para mesma origem; não liberar * em produção |

Não usar prefixo VITE_ para segredos. Não guardar tokens no frontend, repositório, logs ou comando de shell. .env.example contém apenas placeholders. Em execução local o processo precisa receber as variáveis; o start não carrega .env automaticamente. AI_BUDGET_FILE não é necessário nem usado pelo modo upstash.

O modo file permanece explicitamente disponível para desenvolvimento/testes locais. Em produção exige caminho explícito; NÃO é fallback e NÃO deve ser selecionado no Render Free. Contadores locais nesse ambiente seriam perdidos ao dormir/reiniciar, renovando indevidamente cotas.

## Ativação futura pelo responsável

A aprovação abrangeu o adaptador, NÃO criação de recursos ou conexão real. Estes passos são instruções para depois da aprovação de publicação:

1. Verificar a elegibilidade a um banco próprio Upstash Free. Não criar outra conta para contornar limites; não reutilizar banco de PostAI/OpinAI. Se o único banco gratuito estiver ocupado, manter IA desativada e decidir outra solução.
2. Confirmar no painel o plano Free e ausência de upgrade automático. Não adicionar cartão nem aceitar Pay-as-you-go para esta proposta. Não usar banco temporário anônimo de três dias.
3. Configurar URL/token apenas no ambiente administrativo privado e no serviço Node. Usar a mesma AI_QUOTA_KEY.
4. Inicializar UMA vez; o comando cria estado pausado e não sobrescreve estado existente:

       node scripts/ai-quota-admin.mjs init
       node scripts/ai-quota-admin.mjs status

5. Executar teste real controlado em ambiente apropriado: EVAL/TIME, limites, preservação dos contadores após reinício, chave ausente, pausa e falha de acesso. Os testes desta entrega simularam o REST e NÃO executaram Lua em um Redis real.
6. Após verificar estado e credenciais, habilitar AI_ENABLED=true e retomar:

       node scripts/ai-quota-admin.mjs resume

Para interromper NOVAS chamadas, sem esperar um redeploy:

    node scripts/ai-quota-admin.mjs pause

Como segunda trava, AI_ENABLED=false no serviço bloqueia antes de consultar Redis, após a aplicação receber a nova configuração. status consulta somente contadores. pause/resume preservam as cotas. Nunca apagar/recriar a chave para resolver um erro: isso pode liberar novamente consumo já gasto. init recusa sobrescrever uma chave existente. Nenhum comando administrativo é endpoint público.

A pausa não cancela uma chamada Gemini que já esteja em andamento. Reservas não são devolvidas em falhas/timeouts. Após remover pausa, recusas podem permanecer em cache por até 15 segundos.

## Proteção e comportamento em falhas

Antes de CADA tentativa Gemini, inclusive a repetição de 503, uma operação Lua EVAL verifica pausa, dia UTC usando relógio Redis, janela e três orçamentos; só então incrementa todos os contadores atomicamente. A chave não expira e não é inicializada automaticamente. Estado ausente/inválido, Redis indisponível, timeout de 3 segundos, HTTP 429, plano esgotado ou resposta inválida BLOQUEIAM a IA. Não há fallback para memória, disco ou chamada Gemini direta. Uma resposta perdida pode consumir a reserva sem chegar ao Gemini: comportamento conservador.

Há mensagens amigáveis HTTP 429/503 e Retry-After. A página e os dados locais continuam disponíveis. O status de configuração não testa o Redis continuamente; uma pausa remota é percebida na próxima tentativa. O cache curto guarda somente recusas, nunca autorizações ou contadores.

Permanecem rate limits por IP (12 gerações e 60 mensagens/15 min, mapas de até 5000 clientes), validação de esquemas, uploads até 2 MiB com assinatura/base64, corpo HTTP até 3 MiB, respostas Gemini até 1 MiB, timeout de 60 s e no máximo uma repetição de 503 para JSON. CORS não substitui rate limiting. APIs públicas podem ser chamadas fora do navegador.

Rate limit por IP e concorrência são locais e reiniciam com o processo. NÃO representam a cota diária persistente. A janela global e os orçamentos ficam no Redis e sobrevivem ao reinício do Node. A configuração é para uma instância; revisar concorrência e proxy se mudar a topologia.

Os limites de saída são reservas conservadoras, não medição/fatura de tokens reais: JSON reserva até 8192 e chat até 4096 por tentativa. Só resumos/quizzes podem esgotar 65536 em oito tentativas; repetição também conta. Bytes de entrada não são tokens e não garantem teto financeiro exato. Manter também cotas/restrições do projeto Gemini no provedor. Não aumentar limites para contornar erros.

## Custos e limitações verificadas

Condições consultadas em 14/11/2026:

- [Upstash Redis](https://upstash.com/pricing/redis): Free US$0, um banco, 500 mil comandos/mês, 250 MB e 10 GB de banda. A tabela comparativa menciona 256 MB; considerar 250 MB conservadoramente. A FAQ de preços informa upgrade para Pay-as-you-go ao inserir cartão. Nenhum plano pago foi configurado.
- [Termos Upstash](https://upstash.com/trust/terms): permitem excluir recursos Free após uma semana de inatividade e conta Free após duas semanas. A [FAQ](https://upstash.com/docs/redis/help/faq) menciona arquivamento após pelo menos 30 dias: há divergência; não assumir retenção garantida. Free não oferece garantia operacional/SLA para este MVP. Se a chave desaparecer, a IA permanece bloqueada até revisão manual.
- [Render Free](https://render.com/docs/free): suspende após 15 minutos sem tráfego; retomada demora cerca de um minuto; sistema de arquivos efêmero, sem disco persistente, uma instância e 750 horas gratuitas/mês por workspace. Banda e minutos de build têm franquias compartilhadas. Com pagamento habilitado pode haver cobrança de excedentes; sem ele pode haver suspensão. O próprio Render desaconselha Free para produção.
- Gemini tem cotas, disponibilidade e custos próprios; hospedagem gratuita não implica Gemini gratuito. Nenhum gasto foi autorizado.

O tamanho dos contadores é pequeno. Entretanto uma chamada REST EVAL pode contabilizar comandos internos; não assumir 1 HTTP = 1 comando faturado. Monitorar o painel. Mesmo com 20 tentativas aceitas/dia, ataques ou requisições recusadas podem gastar a franquia Redis. A interrupção segura preserva custos Gemini, mas causa indisponibilidade compartilhada. Todos os visitantes compartilham a cota; sem login não há garantia de distribuição justa.

Recomendação: Render Free + banco próprio Upstash Free para demonstração de portfólio com uso limitado e IA inicialmente desativada. É persistência externa adequada com falha segura, não serviço de produção com disponibilidade garantida. Alternativas: deixar IA pausada sem banco; migrar a outro armazenamento persistente após aprovação; hospedagem paga com disco/Redis somente em missão autorizada. Memória temporária não é alternativa equivalente a cotas persistentes.

## Pendências antes da publicação

- Instalação limpa Linux e validação dos comandos no ambiente de hospedagem.
- Banco Free elegível sob responsabilidade da usuária, configuração privada e teste REAL de Lua/REST/reinício/pausa. Nenhuma credencial foi conectada nesta execução.
- Teste real Gemini e conferência manual da interface: sete seções, primeira mensagem, PDFs, resumos, quizzes, desafios, histórico, desempenho, temas e responsividade. Testes simulados não substituem esses testes.
- Confirmar limites do projeto Gemini, custos no painel e disponibilidade do modelo.
- Revisar política de privacidade: conteúdo enviado para IA vai ao provedor Gemini; dados locais não são backup em nuvem.
- Autorizar separadamente publicação/envio ao GitHub. Esta entrega não executou nenhum deles.

Resultados locais e relação de arquivos: RELATORIO-RENDER-GRATUITO.md e validation-render-free.

