# EstudAI — preparação para GitHub e Render com IA pausada

Missão 19, 15/11/2026. Projeto pronto para envio ao GitHub com as regras atuais de exclusão. Não foi criado repositório Git, remote ou repositório remoto; nenhum commit, push, deploy ou ativação de IA foi executado. Trabalho restrito a EstudAI-Missao04, sem alterações em PostAI ou OpinAI.

A pasta não possui `.git`: `git rev-parse --show-toplevel` e `git remote -v` retornaram que ela não é um repositório. Portanto, não há índice ou histórico local a auditar, nem remote configurado. A varredura considerou arquivos candidatos selecionados com `rg --files --hidden --no-require-git`, respeitando os `.gitignore` da raiz e das subpastas. Não encontrou padrões de segredos reais; os candidatos de atribuição de credenciais foram revisados como valores fictícios e cabeçalhos simulados de testes. A verificação por padrões não garante detectar todo formato possível de segredo.

Os `.env` locais existentes continuam no disco e excluídos do envio. `.env.example` permanece permitido e contém campos secretos vazios. O `.gitignore` já excluía dependências, builds e `.local`; foi ampliado para chaves privadas, arquivos comuns de credenciais/tokens, configurações locais de agentes/cloud, logs, temporários e backups. Bundles antigos de testes com fonte TypeScript correspondente também foram excluídos. Nenhum segredo foi removido ou alterado; nenhum conteúdo privado foi impresso. `.npmrc` contém apenas opções do gerenciador, sem autenticação.

Validações aprovadas nesta missão:

- `node --test scripts/tests/github-ignore.test.mjs`: fixture isolada confirma exclusão de 26 arquivos privados/gerados e inclusão de `.env.example`, fonte e lockfile. A fixture é removida ao terminar.
- `node scripts/audit-github.mjs`: varredura dos candidatos; resultado em `validation-missao19/secret-audit.json`, sem valores de credenciais.
- `pnpm.cmd run build:web-api`: typecheck de bibliotecas/web/API e compilação de frontend e Express aprovados.
- `pnpm.cmd run verify:production`: 19 verificações de produção aprovadas.
- `pnpm.cmd run test:mission18`: 45 cenários de integração e 5 verificações de erros do frontend aprovados, com Upstash/Gemini simulados.
- `node --test scripts/tests/diagnose-upstash.test.mjs`: 19 testes aprovados, sem conexão externa.

O Express serve `artifacts/estudai-web/dist/public` quando `SERVE_WEB=true`, com assets estáticos e fallback apenas para as sete rotas conhecidas da aplicação. `/api` desconhecida e `/.env` retornam 404. A API lê `PORT` do ambiente. Os testes confirmam que `AI_ENABLED=false` bloqueia as cinco rotas de IA com HTTP 503 e `AI_DISABLED`, antes de consultar Upstash ou chamar Gemini; o site continua disponível sem credenciais.

Comandos do Render, executados a partir da raiz do projeto, com Node 26.13.0:

```sh
# Instalação
npx --yes pnpm@12.18.0 install --frozen-lockfile --prod=false

# Build de bibliotecas, web e API
npx --yes pnpm@12.18.0 run build:web-api

# Inicialização
node --enable-source-maps artifacts/api-server/dist/index.mjs
```

O Build Command de `render.yaml` combina instalação e build:

```sh
npx --yes pnpm@12.18.0 install --frozen-lockfile --prod=false && npx --yes pnpm@12.18.0 run build:web-api
```

Manter `NODE_ENV=production`, `SERVE_WEB=true`, `AI_ENABLED=false`, `AI_QUOTA_STORE=upstash`, `TRUST_PROXY_HOPS=1`, uma instância Free, health check `/api/healthz` e deploy automático desligado. Root Directory: raiz do monorepo. Não definir segredos com prefixo `VITE_`. O serviço pausado inicia sem credenciais Gemini/Upstash; se forem configuradas, usar exclusivamente o painel privado do Render. Preservar a chave principal de cotas e seu estado pausado. O start não carrega `.env` automaticamente.

O build foi executado localmente no Windows com dependências já instaladas; instalação limpa Linux/Render permanece pendente. O typecheck global do monorepo tem os quatro erros mobile registrados na Missão 18; não foi repetido nem corrigido aqui. O comando correto do Render é `build:web-api`, que passou. A validação real do Gemini e a liberação da IA continuam fora desta missão.

Para enviar futuramente, quando o responsável decidir publicar, criar primeiro um repositório vazio no GitHub e então executar os comandos abaixo na pasta EstudAI-Missao04. São instruções, não ações executadas nesta missão:

```sh
git init -b main
git check-ignore artifacts/api-server/.env artifacts/estudai-mobile/.env node_modules
git status --short --untracked-files=all
git add .
git diff --cached --stat
git diff --cached --name-only
```

Conferir a lista preparada antes do commit: nenhum `.env` privado, credencial, dependência, build, log ou backup deve aparecer. Não usar `git add -f`. `.gitignore` não impede um envio forçado nem remove automaticamente arquivos já rastreados em outro repositório. Após revisar:

```sh
git commit -m "Prepara EstudAI web/API para Render com IA pausada"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git remote -v
git push -u origin main
```

Substituir o endereço pelo repositório vazio escolhido, sem inserir token na URL. A autenticação deve usar o mecanismo seguro do Git/GitHub. O último comando publica o código e deve ser executado somente pelo responsável quando decidir enviá-lo. Nenhum comando Git acima foi executado pelo agente nesta missão.
