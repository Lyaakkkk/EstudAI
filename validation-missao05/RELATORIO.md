# Missão 05 — Validação funcional

Escopo: somente C:\Users\NegroGay123\Downloads\EstudAI-Missao04. Sem publicação e sem alteração de código-fonte da aplicação. Arquivos nesta pasta são evidências e materiais fictícios de teste.

API iniciada com pnpm.cmd --filter @workspace/api-server dev, porta 8080.
Web iniciada com pnpm.cmd --filter @workspace/estudai-web dev, porta 19006.
O atalho pnpm.ps1 foi bloqueado pela política do PowerShell; pnpm.cmd funcionou. O esbuild exigiu execução fora do sandbox por acesso negado a diretórios ancestrais. Não foi alterada a política do sistema.

| Funcionalidade | Resultado | Evidência e limite |
|---|---|---|
| API | PASSOU | GET /api/healthz, HTTP 200, status ok |
| Web HTTP e proxy | PASSOU | GET / e /api/study/ai-status na porta 19006, HTTP 200. Renderização visual não validada. |
| Resumo de texto real | PASSOU | POST /api/study/summaries, HTTP 200; resumo do jardim fictício. Tempo total do primeiro script: 10,6 s, incluindo verificações HTTP; log do servidor: 8,17 s para resumo. |
| Quiz real | PASSOU | HTTP 200, 13,10 s, cinco questões, IDs únicos, respostas corretas presentes nas alternativas, explicações e tópicos. results.json |
| Correção de quiz | PASSOU | Trecho real finishQuiz executado em VM sobre quiz real; acertos, erros e respostas mistas. Interação visual pendente. logic-results.json |
| Pontuação de quiz | PASSOU | 5/5, 0/5, 3/5; tentativa incompleta não registrada. Teste de lógica, sem navegador. |
| Desempenho | PASSOU | Trecho real PerformancePage: 100%, 0%, 60%; sem tentativa, média nula. Renderização visual pendente. |
| Desafios reais | PASSOU | HTTP 200, 12,75 s. results.json |
| Correção de desafio real | PASSOU | HTTP 200, 5,82 s, nota 100 para resposta de teste. results.json |
| PDF pela API | PASSOU | PDF fictício válido em base64, HTTP 200, 7,88 s; resumo com 12 vasos e 200 ml. Seletor de arquivos visual pendente. |
| Imagem pela API | FALHOU | Primeira tentativa: API 502 em 3,89 s; log do servidor registra HTTP 503 do Gemini. Resultado da repetição em image-retry.json, se presente. |
| Upload pela interface | NÃO TESTADO | FileReader e seletor não exercitados em navegador. |
| Persistência após recarregar | NÃO TESTADO | Código usa localStorage; isso não substitui teste real de recarga. |
| Responsividade | NÃO TESTADO | Controle do Chrome bloqueado. |
| Acessibilidade | NÃO TESTADO | Controle do Chrome bloqueado; sem auditoria de teclado, foco, contraste ou leitor de tela. |

Timeout: 60 s no servidor; 70 s nos testes da API. Somente conteúdo fictício enviado. Nenhuma chave gravada nas evidências.

Diagnóstico inicial da imagem: a API alcançou o provedor e recebeu HTTP 503. Não houve evidência de erro de autenticação (401/403), modelo ausente (404) ou quota (429). Mesma configuração gerou texto, quiz, desafios e PDF. O 503 indica falha de disponibilidade do provedor; o corpo original não estava registrado. Uma consulta diagnóstica direta adicional, fora do sandbox, terminou em TimeoutError após limite de 60 s; ela não gerou conteúdo utilizável. A tentativa diagnóstica dentro do sandbox foi bloqueada por EACCES e não representa falha da rede usada pela API.

Chrome: o controle do computador encerrou a tentativa por não conseguir determinar a URL atual com confiança suficiente para aplicar sua política. Não foram repetidas tentativas de controle do navegador. Nenhum erro crítico da aplicação foi comprovado que justificasse alteração do código-fonte.

Validação manual pendente em http://localhost:19006/:
1. Salvar texto, PDF e imagem pequenos; recarregar e conferir materiais.
2. Gerar resumo e quiz; responder com acertos e erros; conferir correção e Meu Desempenho.
3. Recarregar e conferir materiais, resultados e tentativas salvos.
4. Testar largura de 375 px e desktop; conferir menu, formulários, modais e rolagem.
5. Navegar com Tab, Shift+Tab, Enter e Escape; conferir foco visível, rótulos, fechamento dos modais e contraste.

Conclusão: integração real principal confirmada; aprovação completa do MVP depende da imagem e dos testes de navegador pendentes.

Resultado final da imagem: a segunda e última tentativa pela API retornou HTTP 502 em 60,18 s, sem conteúdo gerado. Evidência: image-retry.json. O limite de 60 s foi atingido; combinado com o HTTP 503 da primeira tentativa, mantém o bloqueio na disponibilidade/tempo de resposta do provedor. Não é possível atribuir o timeout isolado exclusivamente à rede ou ao serviço remoto. Não houve nova tentativa nem mudança de modelo.
