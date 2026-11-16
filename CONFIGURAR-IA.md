# Configuração privada da IA — Missão 17

Na raiz de EstudAI-Missao04, em PowerShell, execute o procedimento único:

    powershell.exe -NoProfile -File .\scripts\diagnose-upstash.ps1 -InitializePaused -TestQuotas

Requer Node 26.13.0 utilizado pelo projeto; sem novas dependências. Se a política impedir o script, revisar com o responsável; não alterar políticas globais automaticamente.

O comando pede URL REST e token REST com entrada oculta. Cole somente os valores do painel do MESMO banco, sem aspas, Bearer ou comando curl. Use token REST com escrita, não senha TCP nem token somente leitura. Não enviar credenciais ao chat. Um PONG no console do painel não comprova autenticação REST.

Os valores não são gravados em arquivo, histórico ou logs pelo script. Permanecem temporariamente na memória/ambiente dos processos; o ambiente anterior é restaurado ao sair. Não usar transcrição/gravação de terminal. A entrada oculta não é um cofre permanente.

AI_ENABLED=false no processo de diagnóstico; nenhuma chamada Gemini é realizada. Isso não altera uma API já aberta em outra sessão: pare qualquer API local ativa antes de começar. O estado principal deve estar pausado; se estiver ativo, o comando recusa continuar sem alterá-lo.

## O que o comando faz

1. PING pela REST autenticada.
2. InitializePaused: cria a chave principal somente se ausente, com enabled=0; nunca sobrescreve nem zera estado existente.
3. Confere versão, contadores e pausa.
4. TestQuotas: cria chave aleatória estudai:diagnostic:..., usa o adaptador REAL para testar pausa, reserva aceita, bloqueios de janela e diário e recusa de chave inexistente.
5. Relê o estado principal pausado e remove somente a chave isolada criada nesta execução.

Os limites reduzidos de teste ficam exclusivamente na chave isolada, sem gastar a cota principal ou chamar Gemini. O teste real confirma EVAL/TIME e decisões do adaptador no Redis. Não comprova por si só retenção do provedor, recuperação de desastre ou persistência após reinício da API.

A chave principal padrão é estudai:ai:quota:v1; AI_QUOTA_KEY no ambiente pode escolher a chave já usada. Nunca trocar a chave para contornar cotas. Não apagar a principal.

Para apenas diagnosticar, sem criar estado nem testar reservas:

    powershell.exe -NoProfile -File .\scripts\diagnose-upstash.ps1

## Resultados

| Código | Ação |
| --- | --- |
| AUTHENTICATION | WRONGPASS/401: recopiar URL e token REST do mesmo banco; verificar revogação. Não compartilhar os valores. |
| PERMISSION | Usar token REST com escrita; PING não comprova permissão de cotas. |
| CONFIGURATION | Corrigir URL HTTPS, aspas, espaços ou token incompatível. |
| NETWORK | Verificar DNS/rede/TLS/timeout. |
| SERVICE_LIMIT | Franquia Redis esgotada; manter IA desligada. |
| SERVICE / RESPONSE | Serviço recusou operação ou resposta inválida; consultar painel sem compartilhar segredos. |
| STATE_MISSING | REST autenticou, falta estado; repetir com InitializePaused. |
| STATE_INVALID | Investigar estado; não apagar nem reinicializar contadores. |
| STATE_ACTIVE | Estado já habilitado; pausar pelo procedimento administrativo privado antes de continuar. |
| TEST_CLEANUP | Limpeza da chave isolada não confirmada; revisar somente chaves estudai:diagnostic: no painel. |
| CONNECTION_AND_QUOTAS_OK_PAUSED | REST e cotas reais passaram; principal continua pausada, Gemini não foi chamado. |

Erros não imprimem corpo bruto, credenciais ou URL. Uma falha não identifica automaticamente token digitado incorretamente versus token revogado: ambos são autenticação recusada.

## Configurar no Render sem ativar

Depois de sucesso, preencher privadamente Environment do serviço:

| Variável | Valor |
| --- | --- |
| UPSTASH_REDIS_REST_URL | URL REST do banco testado |
| UPSTASH_REDIS_REST_TOKEN | Token REST com escrita do mesmo banco |
| AI_QUOTA_STORE | upstash |
| AI_QUOTA_KEY | estudai:ai:quota:v1, ou a principal já utilizada |
| AI_ENABLED | false |
| AI_DAILY_PROVIDER_LIMIT | 20 |
| AI_PROVIDER_WINDOW_LIMIT | 6 |
| AI_MAX_CONCURRENT | 1 |
| AI_DAILY_INPUT_BYTES | 8388608 |
| AI_DAILY_OUTPUT_TOKENS | 65536 |

Não usar prefixo VITE_, REDIS_URL ou AI_BUDGET_FILE. GEMINI_API_KEY também é segredo somente do backend; não é necessária no diagnóstico.

Nesta missão, manter AI_ENABLED=false e a principal pausada. Uma ativação futura exige diagnóstico real aprovado, configuração privada Gemini, cotas conservadoras, retomada administrativa da chave principal e AI_ENABLED=true no serviço, seguida de reinício. Ambas as travas precisam permitir a chamada. Depois, uma solicitação controlada deve incrementar contadores, que precisam sobreviver ao reinício da API. Testar também pausa. Não publicar nesta missão.

## Auditoria e validação

Integração existente: REST HTTPS com fetch nativo, Lua EVAL, sem conexão TCP/SDK. O script administrativo anterior oculta a causa de falhas numa mensagem genérica; foi preservado para compatibilidade. O novo diagnóstico distingue categorias sem mostrar a resposta bruta.

Arquivos desta missão: scripts/diagnose-upstash.ps1, scripts/diagnose-upstash.mjs, scripts/tests/diagnose-upstash.test.mjs, CONFIGURAR-IA.md e README-DEPLOY-RENDER.md. Limites, integração Gemini, SVGs e demais projetos não foram alterados.

Testes locais: 13 testes do diagnóstico e 19 testes de segurança aprovados; build com typecheck e smoke de produção aprovados. Logs em validation-missao17. Testes locais usam respostas simuladas. Nenhuma conexão ao banco da usuária foi feita pelo agente; a validação REAL será executada localmente pelo comando acima. Instalação limpa Linux e testes manuais continuam pendentes.

Referência técnica: https://upstash.com/docs/redis/features/restapi

## Correção do diagnóstico CONFIGURATION

A conversão SecureString -> NetworkCredential.Password e o repasse/restauração do ambiente foram testados com valores fictícios e passaram. A falha anterior era local, antes de enviar HTTP: uma única condição agrupava validRemote (URL/token/chave), comparação token.trim e CR/LF. Sem credenciais reais não é possível afirmar qual campo falhou no caso da usuária.

Agora: CONFIG_URL, CONFIG_KEY, CONFIG_TOKEN_EMPTY, CONFIG_TOKEN_WRAPPER e CONFIG_TOKEN_CHARACTERS identificam a validação sem exibir valores. Espaços e caracteres invisíveis conhecidos somente nas bordas são removidos; no interior são recusados. Tokens opacos ASCII imprimíveis são aceitos, inclusive formatos base64 e base64url, sem impor formato JWT ou tamanho inventado. O adaptador de produção não foi alterado.

Para testar somente conexão e estado, sem escrever no banco existente, na raiz do projeto:

    powershell.exe -NoProfile -File .\scripts\diagnose-upstash.ps1

STATE_MISSING confirma conexão REST autenticada, mas ausência de estado; não é erro de senha. CONNECTION_OK_PAUSED confirma conexão e estado pausado. Nenhuma opção desse comando cria banco, apaga, inicializa ou altera cotas. Gemini não é chamado. A causa real permanece pendente até esse teste privado.

Testes: 19 cenários do diagnóstico, 19 de segurança do adaptador e teste PowerShell com entrada oculta simulada, conversão, ambiente filho e restauração. Nenhuma credencial real utilizada.
