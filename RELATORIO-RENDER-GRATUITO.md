# Relatório — EstudAI no Render gratuito

14/11/2026. Trabalho restrito a EstudAI-Missao04. Não houve deploy, push, criação de conta/banco ou conexão de credenciais externas. PostAI, OpinAI, original Claude e SVGs preservados.

## Resultado

Adaptador Upstash Free implementado após aprovação explícita da usuária. Não há dependência obrigatória de disco persistente no perfil Render Free. O serviço web/API inicia sem arquivo de cotas ou credenciais, com IA pausada por padrão. Não afirmar prontidão pública completa: Linux limpo, integração Redis/Gemini real e testes manuais continuam pendentes.

Recomendação: uma instância Render Free e banco próprio Upstash Free para demonstração de portfólio. O plano é gratuito dentro das franquias; não há SLA nem promessa de custo Gemini zero. Preços, condições, riscos de inatividade e comandos completos estão em README-DEPLOY-RENDER.md.

## Auditoria e alterações

Antes: orçamento diário em arquivo, obrigatório em produção, e manifesto com disco persistente pago. Janela global e concorrência locais. Reiniciar uma instância gratuita perderia o arquivo e liberaria consumo novamente.

Agora: uma chave Redis persistente, sem TTL ou criação automática, contém versão, pausa, dia UTC, tentativas, bytes, reserva de tokens e janela compartilhada. Lua EVAL realiza a reserva atômica proposta antes de cada tentativa, inclusive retry 503. A atomicidade Lua depende do servidor Redis: o script NÃO foi executado em Redis real nesta sessão. Se o estado estiver ausente, corrompido ou inacessível, o Gemini não é chamado. Não há fallback para memória ou arquivo.

Os limites globais padrão são 20 tentativas/dia, 8 MiB/dia de entrada, 65536 tokens máximos reservados/dia, seis tentativas/15 min e uma operação ativa. Concorrrência e rate limits por IP continuam locais e são reiniciados com o processo; orçamento diário e janela global são externos. O limite de concorrência pressupõe uma instância. Rate limits de entrada, validação de arquivos, erros seguros, timeout e limites de resposta foram preservados.

Pausa via estado Redis é verificada antes de cada nova tentativa; AI_ENABLED=false interrompe antes do Redis. Chamadas já em andamento podem terminar. Ferramenta administrativa init/status/pause/resume preparada, mas NÃO executada contra serviço externo. init não sobrescreve contadores existentes. Pausar/retomar não zera contadores.

UI: somente os avisos de indisponibilidade foram ajustados para mostrar a mensagem retornada pela API. Fluxos de chat, navegação, histórico, geração e temas não foram reimplementados. Hashes das variantes oficiais dark conferem com a entrega da Missão 15; variante light permanece idêntica ao original.

## Arquivos de implementação/documentação

- artifacts/api-server/src/lib/quota-upstash.ts — adaptador REST/Lua com validação de destino, timeout, corpo limitado, sem retry/fallback.
- artifacts/api-server/src/lib/ai-guard.ts — seleção explícita de store, limites conservadores, duas travas globais e erro seguro.
- artifacts/api-server/src/routes/study.ts — status considera pausa/configuração da proteção.
- artifacts/api-server/.env.example — placeholders e perfil Free.
- artifacts/estudai-web/src/App.tsx e src/pages/chat.tsx — avisos amigáveis da API.
- lib/api-spec/openapi.yaml — código AI_DISABLED documentado.
- lib/api-client-react/src/generated/api.schemas.ts e lib/api-zod/src/generated/types/studyAiErrorCode.ts — enum regenerado por Orval; demais saídas do codegen foram regeneradas.
- scripts/ai-quota-admin.mjs — administração privada de estado.
- scripts/test-ai-security.mjs e scripts/tests/upstash-security.ts — testes de segurança reproduzíveis, REST/Gemini simulados.
- package.json — script test:security; nenhuma dependência adicionada.
- scripts/verify-production.mjs — smoke test sem arquivo de cotas/credenciais.
- render.yaml — Free, sem disk, IA desativada inicialmente.
- Dockerfile.verify — validação Linux preparada inclui testes de segurança.
- README-DEPLOY-RENDER.md — publicação gratuita, variáveis, ativação e riscos.
- RELATORIO-RENDER-GRATUITO.md e validation-render-free — relatório, backups, testes, logs e evidências. pnpm-lock.yaml não foi alterado.

Não há repositório .git nesta cópia: git status não oferece comparação. As alterações centrais foram comparadas com backups de validation-render-free, sem modificar o original. Não interpretar arquivos históricos de missões anteriores como resultado desta execução.

## Testes executados

| Verificação | Resultado / alcance |
| --- | --- |
| typecheck:web-api | Aprovado; também incluído em build:web-api |
| build:web-api | Aprovado: build web Vite e API Node |
| verify:production | 19 verificações aprovadas; sete rotas SPA, assets oficiais, API, bloqueios e início sem disco/credenciais |
| test:security | 19 verificações aprovadas; adaptador real e fetch simulado, pausa, falha segura, destino, cota, retry e concorrência |
| API de segurança | 26 verificações HTTP aprovadas; Express real, provider simulado, limites de upload/JSON, rate limit e erros seguros |
| Guarda em modo file local | 11 cenários aprovados; retenção do comportamento local, falhas e concorrência |
| Regressão de geração | 12 cenários aprovados; Express/client mutation reais com respostas Gemini simuladas |
| Chat/navegação | 13 cenários aprovados; harness simulado, não teste manual de navegador |
| Temas | 14 cenários aprovados; harness simulado |
| Correção de quiz | Quatro cenários aprovados |
| Upload local | Cinco cenários aprovados; leitura/formato/espaço simulados |
| Manifesto/admin/SVGs | Free e ausência de disk confirmados; comandos administrativos inspecionados sem conexão; hashes SVG preservados |
| Segredo no build | Chave local não encontrada nos artefatos públicos; nenhum .env no frontend |
| Instalação limpa Linux | NÃO executada: Docker ausente e WSL não executa distribuição |
| Redis/Gemini reais e interface manual | NÃO executados nesta entrega |

Os dois testes HTTP inicialmente falharam por execução do harness fora de NODE_ENV=production, ao tentar resolver pino-pretty no bundle de teste. Foram repetidos com o ambiente correto e passaram. O build de produção ESM passou separadamente; avisos sobre import.meta no bundle CJS dos testes não afetaram as rotas testadas, com SERVE_WEB=false. Não houve mudança da aplicação para contornar esse problema do harness.

Não foi instalada dependência nova. O Dockerfile preparado permite verificar instalação limpa com lockfile congelado em Linux, mas a ausência de Docker não permite declarar essa instalação aprovada.

## Custos e riscos restantes

Upstash Free: US$0, um banco, 500 mil comandos/mês, 250 MB e 10 GB de banda; adicionar cartão pode promover a plano pago. Termos permitem exclusão por inatividade (uma semana para recursos Free), apesar de FAQ mencionar outro prazo. A perda da chave bloqueia a IA em vez de renovar silenciosamente cotas. Não usar banco anônimo temporário. Nenhum plano foi contratado.

Render Free: hiberna após 15 minutos, pode demorar aproximadamente um minuto para voltar, arquivos locais são efêmeros. Franquias de horas/banda/build são compartilhadas e podem suspender o serviço ou gerar cobranças conforme a configuração da conta. O provedor não recomenda Free para produção. Gemini não está incluído nesses US$0.

Público sem login pode esgotar a cota compartilhada. Tentativas recusadas também podem consumir a franquia Redis; número de HTTPs não equivale necessariamente a comandos cobrados. Limites de bytes/tokens reservados não constituem teto monetário garantido. Monitorar os painéis e aplicar cotas do projeto Gemini. Não há recuperação automática de chave perdida nem sincronização dos dados locais entre dispositivos.

## Pendências para publicação

1. Rodar Dockerfile.verify em Linux com instalação limpa.
2. Usuária confirmar elegibilidade/criar banco próprio Free e configurar segredos em ambiente privado em etapa autorizada.
3. Testar de verdade EVAL/TIME, concorrência/reservas, pausa, falha fechada, reinício do Node e perda da chave; testar Gemini real controladamente.
4. Conferir interface manualmente, upload PDF, chat inicial, geração, persistência, temas e responsividade.
5. Revisar políticas/cotas/custos e autorizar publicação separadamente.

Comandos de build/start e administração constam integralmente no README. A configuração gratuita está preparada; a IA permanece pausada até a conclusão dessas pendências. Nenhum deploy ou envio ao GitHub foi realizado.
