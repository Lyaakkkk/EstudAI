# Missão 28 — validação pública controlada

**Recomendação:** um controle temporário no próprio Express, sem serviço adicional: as cinco rotas POST de IA exigem `Authorization: Bearer <token temporário>` no modo `validation`. O servidor recebe apenas o SHA-256 desse token. Comparação com `timingSafeEqual`, token aleatório de 256 bits, transporte HTTPS e nenhuma inclusão do token no frontend, URL, cookie ou armazenamento do navegador.

O modo padrão é `validation`. Hash ausente/inválido ou modo desconhecido bloqueiam gerações com HTTP 503; token ausente/incorreto retorna 403. O bloqueio ocorre antes do rate limiter, reserva Upstash e provedor. As sete páginas, assets, `/api/healthz` e `/api/study/ai-status` continuam públicos. O último endpoint indica configuração local, não autorização, saúde do Redis ou saldo remoto. Mensagens de bloqueio usam o formato de erro já apresentado pela interface.

Funciona arquiteturalmente no Render Free: é middleware Node/Express e configuração de ambiente, sem disco persistente, shell remoto ou produto pago. A configuração permanece nos reinícios; cotas continuam no Upstash. Ainda não foi publicado nem testado no Render. Fontes oficiais: [Render Free](https://render.com/docs/free), [variáveis de ambiente e aplicação de alterações](https://render.com/docs/configure-environment-variables).

Arquivos envolvidos:

- `artifacts/api-server/src/lib/ai-access.ts`: modo de acesso, validação do hash/token e relação das cinco rotas.
- `artifacts/api-server/src/routes/study.ts`: middleware registrado com o mesmo roteamento Express dos handlers, incluindo variantes de maiúsculas e barra final.
- `render.yaml` e `artifacts/api-server/.env.example`: `AI_ACCESS_MODE=validation`, hash vazio e `AI_ENABLED=false`. Hash vazio bloqueia, não autoriza. Nenhum `.env` ou segredo real foi alterado.
- `scripts/test-ai-access.mjs` e comando `pnpm run test:ai-access`: integração local com Upstash/Gemini simulados.
- `scripts/check-ai-validation.mjs` e `scripts/tests/check-ai-validation.test.mjs`: preflight que exige 403 sem token e 400 com token nas cinco rotas. Envia sempre `{}`, inválido para geração, sem possibilidade de chamar Gemini mesmo se a proteção estiver ausente.
- `scripts/test-mission18.mjs` e `scripts/verify-production.mjs`: os cenários anteriores declaram explicitamente modo `public` somente em seus processos de teste para continuar exercitando o bloqueio global. A configuração real permanece em validação.

Validações: **125 verificações aprovadas** — 53 do middleware, 3 do preflight, 45 de integração, 5 de erros do frontend e 19 do smoke de produção. Typecheck de bibliotecas/web/API e build aprovados. Testados: páginas públicas, ausência de token, token errado, variantes de rota, token em query/cookie/corpo recusado, hash ausente/inválido, modo inválido, pausa global, falha do Upstash, uma geração de chat simulada e ausência do token nos logs capturados. Todo acesso ao provedor/Redis nos testes foi interceptado; nenhuma chamada real ocorreu.

**Sequência futura — não executada nesta missão.** Qualquer publicação, configuração do Render ou consumo real dependerá de autorização posterior. A proteção precisa estar publicada e comprovada antes de retirar a pausa da principal.

1. Publicar a correção em missão autorizada mantendo `AI_ENABLED=false` e principal pausada. Não substituir os valores existentes de credenciais ou limites. Usar o modelo validado `gemini-3.5-flash-lite` quando a configuração de runtime for autorizada.

2. Em uma sessão PowerShell privada, sem transcrição, gerar um token novo somente em memória. O trecho abaixo mostra apenas o hash para copiar ao painel; não imprime o token:

   ```powershell
   $validationBytes = New-Object byte[] 32
   $validationRandom = [Security.Cryptography.RandomNumberGenerator]::Create()
   $validationRandom.GetBytes($validationBytes)
   $validationRandom.Dispose()
   $env:AI_VALIDATION_TOKEN = ([BitConverter]::ToString($validationBytes)).Replace('-','').ToLowerInvariant()
   $validationSha = [Security.Cryptography.SHA256]::Create()
   $validationDigest = $validationSha.ComputeHash([Text.Encoding]::UTF8.GetBytes($env:AI_VALIDATION_TOKEN))
   $validationSha.Dispose()
   $validationHash = ([BitConverter]::ToString($validationDigest)).Replace('-','').ToLowerInvariant()
   $validationHash
   ```

   Configurar no Render somente o hash em `AI_VALIDATION_TOKEN_SHA256`, `AI_ACCESS_MODE=validation` e manter `AI_ENABLED=false`. Não usar `VITE_`, não copiar o token para o painel/repositório e não colocá-lo em argumentos de comando. Aplicar a configuração no processo publicado. O Render oferece **Save and deploy** para reaplicar o build existente; **Save only** não atualiza o processo em execução. Esta operação não foi feita aqui.

3. Com a principal ainda pausada, confirmar páginas e health check e executar uma vez, na mesma sessão que conserva o token em memória:

   ```powershell
   node scripts/check-ai-validation.mjs
   ```

   Exigir `VALIDATION_ACCESS_CONFIRMED`, dez verificações e `generationAttempts=0`. São cinco POST anônimos negados e cinco POST autenticados com payload inválido. Se falhar, **não retirar a pausa**. A ausência do middleware causaria 400 no teste anônimo e interromperia o preflight, sem geração. Confirmar também a chave principal somente por leitura:

   Para essa leitura, usar uma sessão privada com URL/token REST do mesmo banco disponibilizados temporariamente no ambiente, por entrada oculta; não colocar valores no histórico nem editar arquivos de credenciais:

   ```powershell
   $env:AI_QUOTA_KEY = 'estudai:ai:quota:v1'
   node scripts/ai-quota-admin.mjs status
   ```

   O array `result` contém `version`, `enabled`, `day`, `calls`, `input`, `output`, `window`, `used`, nessa ordem. Exigir versão `1`, flag de pausa `0`, contadores íntegros e registrar a referência inicial. Não usar init, reset ou outra chave. Este procedimento usa o administrativo já existente no repositório e não depende dos scripts ainda pendentes de missões anteriores.

4. Após autorizar a etapa real, alterar `AI_ENABLED=true` e aplicar no Render **mantendo `AI_ACCESS_MODE=validation`, o hash e a principal pausada**. Aguardar o serviço saudável. Repetir o preflight sem geração se houver dúvida sobre a aplicação da configuração. Nenhum visitante tem o token; não mudar para `public`.

5. Para a chamada real e o retorno à pausa, usar sessão administrativa privada com URL/token REST do mesmo banco disponibilizados temporariamente no ambiente, por entrada oculta. Não escrever valores no histórico, em arquivos ou neste relatório. O trecho futuro abaixo pressupõe essas duas variáveis já carregadas privadamente:

   ```powershell
   $env:AI_QUOTA_KEY = 'estudai:ai:quota:v1'
   try {
     node scripts/ai-quota-admin.mjs resume
     if ($LASTEXITCODE -ne 0) { throw 'Retomada nao confirmada; nao gerar.' }
     # Aguarda eventual cache anterior de recusa; o acesso continua restrito.
     Start-Sleep -Seconds 16
     $validationReply = Invoke-RestMethod -Method Post -MaximumRedirection 0 -TimeoutSec 90 `
       -Uri 'https://estudai-web-api.onrender.com/api/study/chat' `
       -ContentType 'application/json' `
       -Headers @{ Authorization = ('Bearer ' + $env:AI_VALIDATION_TOKEN) } `
       -Body '{"messages":[{"role":"user","content":"Quanto e 2 mais 2?"}]}'
     if (!$validationReply.reply) { throw 'Resposta invalida; nao repetir.' }
   } finally {
     node scripts/ai-quota-admin.mjs pause
     if ($LASTEXITCODE -ne 0) { throw 'Pausa nao confirmada. Manter acesso restrito e bloquear AI_ENABLED no Render.' }
   }
   node scripts/ai-quota-admin.mjs status
   ```

   Esse trecho é **apenas plano futuro**, não autorização para executá-lo agora. Preferir chat porque não repete HTTP 503. Executar um único POST, sem reenvio automático. Em timeout, não repetir: a geração pode ter ocorrido. Reservas não são devolvidas. `finally` tenta pausar mesmo em falha; se o terminal for fechado ou a rede cair, confirmar o bloqueio manualmente, sem declarar sucesso.

6. Exigir `enabled=false` ao final e comparar os contadores. Partindo dos zeros confirmados e sem mudança de dia UTC, uma tentativa de chat reserva uma chamada, bytes de entrada positivos e até 4096 tokens máximos de saída; não são os 256 tokens do teste isolado. A janela deve refletir a tentativa conforme seu relógio/renovação. Retornar `AI_ENABLED=false` no Render e aplicar, mantendo o acesso em validação. Confirmar pausa principal novamente por leitura. Restaurar/remover as variáveis privadas locais e descartar o token após encerrar a validação; não remover a proteção em produção durante a janela.

Riscos e limites: o token de acesso não é um token de uso único; quem o possuir pode repetir chamadas enquanto ambas as travas estiverem abertas. A sequência faz um único POST; não cria novo contador persistente nem altera os limites existentes. Não compartilhar o token, não colocá-lo no navegador e não remover o middleware após a geração. A proteção não elimina indisponibilidade por tráfego volumoso. Uma pausa não cancela chamadas já iniciadas. O Render Free pode reiniciar ou iniciar lentamente; o modo de acesso e hash continuam configurados, e a cota permanece remota. A validação por terminal usa o endpoint público real, mas não testa a gravação do resultado no armazenamento do navegador.

Estado desta entrega: apenas preparação e testes locais. Nenhuma credencial/token real foi gerado, exibido ou modificado; os tokens dos testes são fictícios. Nenhum acesso real ao Upstash/Gemini, resume, push, deploy ou alteração de PostAI/OpinAI foi executado. A proteção ainda não está no serviço publicado e não deve ser presumida ativa antes do preflight.
