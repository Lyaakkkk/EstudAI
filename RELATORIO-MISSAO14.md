# Missão 14 — Temas e variantes de logotipo do EstudAI

Data: 14/11/2026. Execução exclusiva em EstudAI-Missao04. PostAI, OpinAI, original Claude, backend, Gemini e banco não foram alterados. Não houve instalação de dependências, deploy ou envio ao GitHub.

## Auditoria

O modo anterior usava a chave local `estudai-theme`, com light/dark. Quando não havia preferência, consultava o sistema somente na inicialização. O hook observava a classe do documento; não havia opção explícita Sistema nem acompanhamento de mudanças do SO. Se o acesso ao armazenamento falhasse no bootstrap anterior, a consulta ao sistema podia ser ignorada.

A opção C da sidebar tinha cores fixas e `color-scheme: light` dentro de `.sidebar-surface`, sobrepondo o tema escuro. Fundo, textos, item ativo, hover, divisórias, aviso e controles não respondiam ao modo noturno. A divisória da marca também usava hex direto no JSX. Telas de erro e 404 usavam classes gray/white fixas. O overlay de modais derivava do foreground e ficava claro no tema escuro.

Os componentes de estudo e chat já usavam majoritariamente tokens CSS. Não foi preciso recriar páginas. As cores pretas dos overlays de componentes genéricos não usados e os seletores de atributos de gráficos não foram tratados como cores de conteúdo de uma página ativa. O conteúdo de PDFs/imagens do usuário não foi recolorido; o visualizador PDF nativo pode ter aparência própria do navegador.

O SVG oficial contém 35 paths e 34 definições de gradientes, sem rect nem image de fundo. A assinatura e o slogan são vetoriais. Seus azuis mais escuros precisam de maior luminosidade sobre a sidebar escura; os detalhes lilás também receberam ajuste de luminosidade na variante de contraste.

## Seletor Claro / Escuro / Sistema

Os controles desktop e mobile agora são seletores nativos com rótulo acessível, operáveis por teclado. Compartilham um único store, evitando escolhas divergentes entre os dois controles.

- **Claro:** aplica explicitamente o modo claro, independentemente do SO.
- **Escuro:** aplica explicitamente o modo escuro, independentemente do SO.
- **Sistema:** acompanha prefers-color-scheme na carga e em mudanças posteriores do sistema.

A preferência é salva na mesma chave `estudai-theme`, como light/dark/system. Valores light/dark antigos continuam válidos. Chave ausente ou valor inválido resulta em Sistema. Alterações de preferência em outra aba são acompanhadas pelo evento storage. O store registra uma única assinatura de eventos compartilhada pelos seletores e remove os listeners quando não há consumidores.

Se localStorage estiver bloqueado, o tema continua funcionando na aba e o seletor informa que a escolha vale apenas ali. Não é prometida persistência quando o navegador não permite gravar.

O script no head aplica classe, preferência e color-scheme antes da montagem do React; consulta o SO mesmo se a leitura de armazenamento falhar. O fundo inicial corresponde aos tokens de tema e é entregue ao CSS após inicialização. Bootstrap e store foram testados em conjunto, mas a ausência de flash visual em cold reload ainda exige navegador.

## Cores e superfícies

A sidebar clara mantém a opção C. A sidebar escura passa a usar superfícies coordenadas; não fica mais presa ao fundo claro.

| Elemento | Claro | Escuro |
| --- | --- | --- |
| Fundo da sidebar | #F8FAFC | #0F172A |
| Marca/texto principal da navegação | #1E40AF | #93C5FD |
| Texto secundário da navegação | #64748B | #A6B4C8 |
| Item ativo | #DBEAFE | #1E3A5F |
| Hover / controles | #EDE9FE | #263246 |
| Detalhe lilás | #8B5CF6 | #A78BFA |
| Divisórias | #E2E8F0 | #334155 |

Os componentes usam tokens semânticos de sidebar, card, background, foreground, input, primary, secondary, accent, ring e overlay. A aplicação desses tokens cobre início, Chat IA, materiais, resumos, quizzes, desafios, desempenho, modais, formulários, botões e estados vazios. O layout, os dados e os handlers de estudo permanecem preservados.

Foi identificado contraste 4,42:1 do azul anterior sobre o fundo secundário no modo claro. O token primary claro passou ao azul oficial #1E40AF para corrigir esse par. No modo escuro, o primary foi clareado e seu foreground ajustado, mantendo texto legível em botões e destaques.

Há foco visível para links, botões, inputs, textareas e selects, com cores próprias de cada tema. prefers-reduced-motion continua respeitado e desativa também a transição de fundo. O cabeçalho mobile foi dimensionado para acomodar o seletor sem remover a marca ou o menu. O slogan continua no SVG, sem texto duplicado nem cartão por trás.

## Variantes SVG e troca automática

Arquivos originais preservados: `public/brand/estudai-logo.svg` e `estudai-sparkle.svg`.

| Recurso | Comparação |
| --- | --- |
| estudai-logo-light.svg | Byte a byte idêntico ao logo original. |
| estudai-logo-dark.svg | Mesmos 35 paths e 34 gradientes; somente fill sólido e stop-color mudam. |
| estudai-sparkle-light.svg | Byte a byte idêntico ao sparkle original. |
| estudai-sparkle-dark.svg | Mesmos dois paths; somente as cores mudam. |

Na variante escura, matiz e saturação são preservadas; a luminosidade HSL passa a `0,70 + 0,20 × luminosidade original`. Não há deslocamento, redesenho, remoção de símbolo, alteração de letras, slogan, curvas, offsets ou fundo incorporado. É uma variante de contraste derivada dos recursos oficiais, conforme autorizado, sem alegação de que se trata de uma exportação prévia adicional do kit.

`OfficialLogo` é usado na sidebar e no cabeçalho mobile. `OfficialSparkle` mantém os usos existentes. CSS mostra uma única variante conforme `.dark`; a seleção acompanha o tema resolvido, inclusive em Sistema. A troca independe de esperar um efeito React após a primeira renderização. As imagens ocultas não ocupam espaço e não duplicam o nome acessível. O favicon original foi preservado nesta execução.

Comparação local: [logo-comparison.html](validation-missao14/logo-comparison.html). O arquivo fornece uma prancha para inspeção, sem publicar nada. Ele não foi aberto automaticamente devido à indisponibilidade do navegador.

## Arquivos modificados/adicionados

Relativos a `artifacts/estudai-web/`:

- `src/lib/theme.ts`: store de preferência, resolução do sistema, persistência, sincronização entre abas e hook.
- `index.html`: bootstrap anterior à montagem da aplicação.
- `src/App.tsx`: seletores, componente de logo e divisória sem cor fixa; ajuste de espaço no header mobile e token do overlay.
- `src/index.css`: paletas e variáveis semânticas, sidebar nos dois temas, contraste, foco e seleção dos SVGs.
- `src/components/brand.tsx`: logo/sparkle com variantes transparentes.
- `src/components/error-boundary.tsx`: cores semânticas na tela de erro, mantendo a lógica existente.
- `src/pages/not-found.tsx`: cores semânticas na tela 404.
- `src/components/materials-ui.tsx`: somente token do overlay do modal; lógica intacta.
- `public/brand/estudai-logo-light.svg` e `estudai-logo-dark.svg` (novos).
- `public/brand/estudai-sparkle-light.svg` e `estudai-sparkle-dark.svg` (novos).
- `public/brand/README.md`: origem e regra de adaptação das variantes.

Também foram criados este relatório e `validation-missao14/`, com backups, testes, resultados e comparação. Builds regeneraram dist e caches habituais. O SVG original não foi substituído. Arquivos de chat, Gemini e rotas de estudo foram conferidos por SHA-256 contra a linha de base. O código de Home até o final de App.tsx permaneceu idêntico, preservando envio da primeira mensagem, transições, navegação e desempenho.

## Testes executados

| Verificação | Resultado |
| --- | --- |
| Typecheck libs, web e API | Passaram no comando build:web-api. |
| Build web/API | Passaram no comando build:web-api. |
| Build web após correção final do contraste | Passou; 1767 módulos. |
| Temas e bootstrap | 13 cenários passaram. |
| Chat/navegação existentes | 13 cenários passaram. |
| Regressões existentes de estudos | 12 cenários passaram. |
| Pontuação/métricas de quizzes | Quatro cenários passaram. |
| Importação/limites de materiais | Cinco cenários passaram. |
| Comparação dos SVGs | Clara idêntica; escura muda somente atributos de cor; originais intactos. |
| Contrastes calculados | Pares representativos de texto conferidos; detalhes abaixo. |
| Lint | Não há script lint configurado; nenhuma ferramenta foi instalada. |

Total: **47 cenários automatizados passaram**, além das verificações de assets e contraste. Os testes de tema executam o script e o store reais em VM com DOM, storage e eventos simulados. Cobrem: SO claro/escuro, preferência antiga, Sistema explícito, valor inválido, mudança do SO ao vivo, escolha manual persistida, restauração, evento entre abas, remoção da preferência, listeners compartilhados/limpeza e armazenamento bloqueado. Não são testes de renderização no navegador.

Contrastes calculados:

- Sidebar clara: texto principal 8,34:1; secundário 4,55:1.
- Sidebar escura: texto principal 9,90:1; secundário 8,49:1; texto do ativo 6,38:1; controle 7,16:1.
- Cores da variante escura do logo sobre #0F172A: mínimo calculado 6,17:1.
- Os 16 pares semânticos representativos de superfícies/texto conferidos atingem pelo menos 4,5:1 após a correção do primary claro.

Isso não constitui certificação de acessibilidade de todos os estados, opacidades ou conteúdo externo; medições e testes interativos ainda devem ser conferidos no navegador.

Evidências: `theme-results.json`, `asset-comparison.json`, `surface-contrast.json`, `logo-color-map.json`, `chat-flow-results.json`, `regression-results.json`, `logic-results.json`, `upload-logic-results.json`, `build.log` e `build-web-final.log`, em validation-missao14.

## Limitações e pendências

A tentativa atual de listar navegadores retornou **The browser access host is unavailable**. Portanto, não foram executados cliques, capturas, avaliação visual de logos ou medição de flash no carregamento. Não foram inventados resultados visuais.

Antes da publicação, conferir manualmente Claro/Escuro/Sistema nas sete seções, reload, mudança do SO, outra aba, foco por teclado, logo/slogan, modais e tamanhos 320/390/768/1440. PDFs e imagens devem preservar suas cores próprias. Os testes de chat/estudos e a comparação de hashes indicam que a funcionalidade existente foi preservada; não houve necessidade de repetir chamadas reais ao Gemini para uma mudança de tema.

As pendências anteriores de política de uso/custo da API pública, ingresso da hospedagem e build limpo Linux continuam válidas. Esta missão não autoriza deploy ou envio ao GitHub e não iniciou trabalho em PostAI/OpinAI.
