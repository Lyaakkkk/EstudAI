# Missão 09 — Auditoria e plano de recuperação visual

Data: 13/11/2026. Nenhuma migração visual executada. Nenhum código-fonte da aplicação foi editado. A versão original e os outros projetos foram apenas consultados; nada foi publicado.

## 1. Fontes e limites da análise

- Original indicada pelo usuário: `C:\Users\NegroGay123\Downloads\EstudAI-Assistente-Inteligente (1)\EstudAI-Assistente-Inteligente` — encontrada, com fontes web, mobile e sandbox.
- Atual: `C:\Users\NegroGay123\Downloads\EstudAI-Missao04`.
- Método: inventário e comparação byte a byte dos arquivos dessas três aplicações, excluindo `node_modules`, `dist`, `.expo` e `*.tsbuildinfo`; leitura das estruturas JSX, CSS, rotas e diferenças funcionais; inspeção visual do kit de marca e do PNG usado na aplicação atual.
- A atribuição à versão Claude segue o caminho fornecido pelo usuário. Os arquivos locais não comprovam autoria nem aprovação de uma revisão específica.
- Não foram fornecidas capturas de tela da interface aprovada nesta conversa, nem localizadas capturas identificadas como tal nas fontes e referências inspecionadas. Não houve comparação de telas renderizadas em navegador; as conclusões de estrutura são baseadas no código. Portanto, esta auditoria não certifica igualdade pixel a pixel, que deverá integrar a futura recuperação.

## 2. Referências e mídia kits localizados

Referência indicada posteriormente pelo usuário: `C:\Users\NegroGay123\Pictures\kit EstudAI`. O caminho corresponde a um arquivo sem extensão, não a uma pasta. Ele é byte a byte idêntico ao `work\kit EstudAI.png` inspecionado nesta auditoria (1.533.366 bytes; SHA-256 `54F09B3C3C6C2F03DA8D7743A9E27A8D1880926CB8B82AB2B07DB4DFCC898868`). Assim, o kit agora tem indicação direta do usuário; a comparação de marca já realizada continua válida. Essa indicação não resolve, por si só, a aprovação do layout das telas nem fornece exportações individuais adicionais.

Diretório de referências encontrado:

`C:\Users\NegroGay123\Documents\Codex\2026-11-13\referenced-chatgpt-conversation-this-is-an`

| Arquivo relativo | Conteúdo e uso |
| --- | --- |
| `work\kit EstudAI.png` | Prancha de marca, 1536 × 1024; inspecionada visualmente. Logo horizontal, símbolo, ícone de app, favicon, cores, tipografia e variações. |
| `outputs\EstudAI.svg` | Prancha vetorial derivada, com viewBox 1536 × 1024; não deve ser confundida com um logo isolado. |
| `work\preview-EstudAI.png` e `work\vector-EstudAI.png` | Imagens auxiliares da referência/vetorização. |
| `work\kit OpinAI.png`, `work\kit PostAI.png` e respectivos SVGs/previews | Referências das outras marcas do portfólio. Localizadas, sem alteração e fora do escopo de recuperação. |

O kit EstudAI especifica **Outfit Semibold/Bold**, azul profundo `#1E40AF`, azul principal `#2563EB`, lilás `#8B5CF6`, lilás claro `#EDE9FE`, branco `#FFFFFF` e gradiente `#2563EB → #8B5CF6`. A marca usa um E com capelo e brilhos, e o lema “ORGANIZE • CONVERSE • APRENDA”. A procedência de aprovação oficial não pode ser autenticada apenas pelo arquivo local; ele é a referência de marca encontrada.

**Divergência a preservar no planejamento:** o layout original fornecido usa DM Sans/Fraunces, vermelho e tons neutros quentes, enquanto o kit encontrado define Outfit e azul/lilás. A versão atual corresponde à paleta e tipografia do kit, mas isso não comprova que seu layout tenha sido aprovado. Recuperar a estrutura original e aplicar a marca do kit são decisões distintas. Não substituir automaticamente a marca azul/lilás por vermelho, nem redesenhar a estrutura para combinar com o kit.

Ativos já presentes:

- `artifacts/estudai-web/public/estudai-logo.png`: existe somente na atual; PNG 980 × 360 inspecionado, compatível visualmente com a assinatura horizontal do kit, com fundo claro.
- `artifacts/estudai-web/public/favicon.svg`: idêntico nas duas versões; contém somente um retângulo arredondado laranja `#FF3C00`, sem o símbolo do kit.
- `artifacts/estudai-mobile/assets/images/icon.svg`: idêntico nas duas versões; livro sobre fundo verde `#2F6557`, diferente do ícone E azul/lilás do kit. `icon.png` também está presente e é idêntico entre as versões.

**Ausências exatas:** a versão original não está ausente; o kit EstudAI também foi encontrado. Não foram localizados arquivos individuais identificados como exportações oficiais transparentes do símbolo E, do ícone de app, do favicon em 16/32 px ou das assinaturas monocromáticas. Essas variantes aparecem dentro da prancha, sem exportações separadas verificadas. Os nomes originais dessas exportações e das capturas aprovadas não foram informados, portanto não é possível declarar nomes de arquivos faltantes sem inventá-los. Não importar SVGs ou imagens dos outros produtos.

## 3. Diferenças visuais por área

O inventário web encontrou **71 arquivos idênticos, 4 alterados e 1 adicionado**. Mobile: **30 idênticos**, sem diferenças. Sandbox: **69 idênticos**, sem diferenças. A presença de uma biblioteca de componentes não significa que todos sejam usados: a maior parte da interface web está diretamente em `App.tsx`.

| Área | Original fornecida | Atual e impacto |
| --- | --- | --- |
| Menu desktop | Sidebar fixa de 252 px; marca composta por BookOpen em bloco de 40 px, nome em Fraunces 22 px e lema separado. Fundo cinza-escuro. | Mesma largura, itens, ícones e navegação; marca substituída por PNG sobre caixa branca com padding. Sidebar azul no tema claro. A proporção do PNG muda a ocupação vertical da marca. |
| Menu/cabeçalho mobile | Barra de 66 px, marca BookOpen + texto e menu expansível com duas colunas; alternância de tema. | JSX preservado. A marca PNG só foi aplicada no desktop: mobile mantém marca textual/ícone antigo, agora com Outfit/azul via CSS. |
| Cabeçalho desktop | Breadcrumb, texto sobre progresso local, controle de tema; conteúdo com máximo de 1160 px. | Estrutura, espaçamentos e posição preservados; tipografia e cores mudaram globalmente. |
| Dashboard `/` | Saudação, caixa de conversa, sugestões condicionais, três atalhos, indicadores e atividade recente. | Mesma composição e comportamento. Títulos perderam Fraunces; botões/ícones passaram de vermelho a azul; fundo passou de off-white a branco. |
| Materiais `/materiais` | Busca, tags, importação de texto/PDF/imagem, cartões e visualizador. | Estrutura visual preservada; cores e fonte globais alteradas. Diferença no visualizador é de retorno do efeito, não de layout. |
| Resumos `/resumos` | Escolha de material/dificuldade, geração, listagem e leitura. | Mesmos componentes/JSX; diferenças herdadas dos tokens e fontes. |
| Quizzes `/quizzes` | Formulário de geração, cartões, respostas, resultado e histórico. | Nenhuma diferença direta identificada no bloco da página. Recuperar aparência sem tocar em perguntas, pontuação, seleção ou persistência. |
| Desafios `/desafios` | Formulário, conjuntos, modal de resposta e avaliação. | Layout preservado, porém há diferenças funcionais na submissão e habilitação do botão; não devem ser revertidas. |
| Desempenho `/desempenho` | Métricas, histórico e tópicos de revisão. | JSX preservado; alterações globais de fonte/cor afetam métricas e destaques. |
| Chat `/chat` | Avatar, mensagens, sugestões, seletor de material e compositor. | `src/pages/chat.tsx` idêntico. Somente efeito dos estilos globais. |
| Cartões e formulários | Bordas arredondadas, `shadow-soft`, botões, modais, inputs e estados vazios. | Classes e dimensões preservadas. `--radius: 1.25rem`, sombras e animações permanecem iguais; tipografia muda métricas e quebras de linha. |
| Tema escuro | Primário vermelho, acento marrom e ring vermelho-claro. | Primário azul, acento lilás e ring lilás. Fundo e sidebar escuros permanecem iguais. |
| Viewport e navegação | Rotas e links atuais já presentes; viewport bloqueava ampliação com `maximum-scale=1`. | Rotas e navegação preservadas. Restrição de zoom removida: melhoria de acessibilidade a manter. |

### Alterações exatas de estilo

Em `artifacts/estudai-web/src/index.css`:

- Linha 1 e linhas 57–58: DM Sans/Fraunces → Outfit para corpo e títulos.
- Tema claro: fundo `60 6% 97%` → branco; primário/ring `2 69% 52%` → `221.2 83.2% 53.3%`; acentos quentes → lilás; sidebar `210 21% 19%` → `225.9 70.7% 40.2%`; sidebar-accent vermelho → lilás.
- Tema escuro: primário vermelho → azul; acento quente → lilás; ring e sidebar-accent vermelho-claro → lilás.
- Sem diferenças nas regras de grid, sombras, grain, skeleton, animação de entrada e view transitions.

Em `index.html`, linha 19, a folha Google Fonts secundária muda de Inter para Outfit; o CSS original efetivamente declara DM Sans e Fraunces. A futura escolha deve manter HTML/CSS coerentes e evitar importar fontes desnecessárias.

## 4. Arquivos de uma futura recuperação

| Arquivo | Ação planejada, sem executar nesta missão |
| --- | --- |
| `artifacts/estudai-web/src/index.css` | Principal ponto de recuperação: restaurar somente tokens/tipografia que forem definidos como parte da referência aprovada. Registrar separadamente a variante histórica e o kit; não misturar por suposição. |
| `artifacts/estudai-web/src/App.tsx`, `AppFrame`, linhas 96–137 | Ajuste localizado da assinatura desktop/mobile conforme referência, mantendo dimensões estruturais, links, estado e handlers. Não substituir o arquivo. |
| `artifacts/estudai-web/index.html` | Sincronizar carregamento das fontes com a decisão de marca; manter viewport acessível e inicialização do tema. |
| `artifacts/estudai-web/public/estudai-logo.png` | Reaproveitar se a assinatura do kit for mantida; não recriar a marca. Usar variante adequada ao fundo quando houver exportação oficial. |
| `artifacts/estudai-web/public/favicon.svg` | Candidato a atualização de marca após obter exportação isolada correta; não extrair/recriar arbitrariamente nesta missão. |

**Sem necessidade de alteração visual direta identificada:** `src/pages/chat.tsx`, `src/components/materials-ui.tsx`, componentes `ui/*`, páginas internas e navegação. Elas já podem ser reaproveitadas e receber o ajuste dos tokens globais. Ícones mobile ficam registrados como inconsistência, mas sua substituição não integra a recuperação web sem escopo específico.

## 5. Componentes reaproveitáveis e fronteiras funcionais

Reaproveitar os componentes atuais, cujas estruturas correspondem à referência original: `AppFrame`, `ThemeToggle`, `PageTitle`, `Button`, `EmptyState`, `AiNotice`, `MaterialChooser`, `DifficultySelect`, `Modal`, `Home`, `MetricCard`, páginas de materiais/resumos/quizzes/desafios/desempenho, `ChatPage`, `TagChip`, `TagField` e `MaterialViewer`.

Não copiar `App.tsx` integralmente da original. Além da marca, foram detectadas diferenças funcionais:

- Atual linha 395: avaliação de desafio usa `challengeMaterial` e a dificuldade salva em `currentSet`, com fallback `iniciante`; original usa material e dificuldade da seleção do formulário.
- Atual linha 404: botão de enviar depende de `challengeMaterial`; original depende de `material`. Uma cópia integral desfaria essa correção.
- `materials-ui.tsx`, linhas 72 e 79: atual explicita `return undefined` no efeito do PDF. Preservar esse ajuste e o ciclo de criação/liberação de URLs.

Preservar integralmente backend, Gemini, endpoints, clientes gerados, schemas, dependências, configuração de execução, `useLocalStudy`, `useChatSession`, `sourceFromMaterial`, lógica de quizzes, notas e históricos. Manter as chaves `estudai-local-v1`, `estudai-chat-v1` e `estudai-theme`. Não limpar armazenamento para obter telas de comparação.

## 6. Riscos e plano de recuperação

| Risco | Controle |
| --- | --- |
| Restaurar a versão inteira e perder correções | Patch restrito a tokens e marca; revisar diff sem alterações em lógica. |
| Confundir identidade do kit com layout aprovado | Usar estrutura original como referência de layout e registrar a decisão de cores/fontes antes da implementação. Não inferir aprovação a partir da atual. |
| Fontes mudarem alturas e truncamento | Conferir desktop/mobile, títulos longos, cartões, botões e modais após carregamento de fontes. |
| PNG claro prejudicar tema escuro ou ficar ilegível | Conferir contraste e assinatura nos dois temas; usar exportações do kit quando disponíveis. |
| CSS global afetar todas as páginas | Validar as sete rotas, estados vazios, preenchidos, carregamento e erro. |
| Falhas anteriores confundirem a validação | Usar os resultados abaixo como linha de base; separar problemas de compilação já encontrados de futuros efeitos visuais. |

Sequência para uma missão futura de implementação:

1. Fixar a referência de aprovação: estrutura da original fornecida; esclarecer qual tratamento de marca deve prevalecer diante da divergência documentada. Obter capturas aprovadas e exportações faltantes, se existirem. Isso não bloqueou a auditoria.
2. Registrar capturas da original e atual com os mesmos dados sintéticos, viewport e tema, sem executar ou gravar dentro da original. Isolar o armazenamento de comparação do uso real.
3. Aplicar ajustes mínimos nos arquivos listados; manter grid, hierarquia, cartões, navegação e formulários existentes. Não introduzir novo layout nem refatorar lógica.
4. Comparar `/`, `/chat`, `/materiais`, `/resumos`, `/quizzes`, `/desafios` e `/desempenho` em desktop e mobile, claro e escuro. Conferir menu aberto/fechado, foco, zoom, modal e carregamento das fontes. Verificar também a largura próxima do breakpoint `lg`.
5. Validar funcionalidades com dados de teste: navegação, importação, tags, conversa, geração, resposta de quiz, avaliação de desafio e histórico. Confirmar persistência após recarga sem mudar contratos de API. Não enviar dados reais para Gemini só para testar aparência.
6. Executar typecheck/build e comparar falhas com esta linha de base. Revisar diff final para garantir que apenas apresentação foi alterada. Publicação não faz parte deste plano autorizado.

## 7. Compilação — resultados reais

Logs salvos na raiz deste projeto. O PowerShell bloqueia `pnpm.ps1`; os testes efetivos usaram `pnpm.cmd`, sem alterar a política de execução.

| Comando | Resultado |
| --- | --- |
| `pnpm.cmd run build` | **Falhou**, código 1, na etapa de typecheck. Bibliotecas, API, scripts e web passaram; mobile falhou. O build recursivo posterior não foi executado. Log: `missao09-build.log`. |
| `pnpm.cmd --filter @workspace/estudai-web run build` | **Falhou**, código 1: esbuild não resolveu o caminho absoluto Windows de `vite.config.ts` no carregador padrão. Log: `missao09-build-web.log`. |
| `pnpm.cmd --filter @workspace/estudai-web exec vite build --config vite.config.ts --configLoader runner` | **Passou**, usando alternativa de carregamento sem editar configuração. Vite 7.3.7, 1766 módulos; gerou HTML, CSS e JS em `artifacts/estudai-web/dist/public`. Log: `missao09-build-web-runner.log`. |
| `pnpm.cmd --filter @workspace/mockup-sandbox run typecheck` | **Passou**, código 0, na execução isolada. O comando recursivo havia marcado esse pacote como falho junto à interrupção pelo mobile, sem diagnóstico próprio. Log: `missao09-typecheck-sandbox.log`. |

Erros mobile encontrados:

- `components/ChatScreen.tsx:296` — TS2322, referência incompatível com `ScrollViewInstance`.
- `components/ChatScreen.tsx:303` — TS2339, `scrollToEnd` inexistente no tipo da referência.
- `components/ChatScreen.tsx:473` — TS2304, `maxMessageChars` não definido.
- `components/MaterialViewer.tsx:82` — TS2322, `Uint8Array<ArrayBufferLike>` incompatível com `BlobPart`.

Esses arquivos mobile são byte a byte iguais aos da original. Os erros foram observados antes de qualquer migração, não corrigidos nesta missão. A compilação integral **não está aprovada**; a web passou no typecheck e pôde gerar bundle com o carregador alternativo. Não equiparar esse sucesso ao funcionamento completo da aplicação ou a uma validação visual em navegador.

O build produziu somente saídas e metadados habituais no projeto atual (`dist`, emissões de bibliotecas e caches TypeScript), além deste relatório e logs. Não houve instalação de dependências, mudança de fontes/configurações, migração visual, chamada de IA ou publicação.
