---
version: v2
name: top-eleven-lab-design
description: Sistema de design do Top Eleven Lab. Reproduz a linguagem das telas de dados do Top Eleven — painéis claros sobre canvas azul royal, linhas de atributo em duas alturas de superfície, e barra de acento colorida por grupo (defesa verde, defesa do gol ciano, ataque vermelho, atributos azul) marcando o atributo-chave. A distinção entre atributo branco e cinza usa os três canais que o jogo usa ao mesmo tempo: fundo da linha, barra de acento e peso do valor. Números em fonte tabular porque o produto é uma calculadora antes de ser uma tela bonita.

colors:
  canvas: "#2658aa"
  canvas-deep: "#1e355a"
  canvas-hairline: "#263c60"
  panel: "#d1d6d9"
  surface: "#e5e9ea"
  surface-bright: "#ffffff"
  surface-muted: "#c4cbcf"
  hairline: "#b4bdc2"
  hairline-strong: "#9aa5ab"
  ink: "#1e1d1d"
  body: "#323232"
  muted: "#5a656b"
  disabled: "#8b949a"
  on-canvas: "#ffffff"
  on-canvas-muted: "#c9d7ee"
  on-primary: "#ffffff"
  primary: "#25761e"
  primary-hover: "#2f8f28"
  primary-active: "#1e6a17"
  primary-disabled: "#b4bdc2"
  focus-ring: "#1b6ba8"
  group-defense: "#1c8423"
  group-goalkeeping: "#1c76ac"
  group-attack: "#c4323f"
  group-physical: "#4553b8"
  gain: "#15701b"
  loss: "#b32c37"
  loss-deep: "#96222b"
  alert: "#95541f"
  info: "#1b6ba8"
  gold: "#806000"
  rank-terrivel: "#c4323f"
  rank-ruim: "#c26a00"
  rank-normal: "#6b7885"
  rank-boa: "#1c8423"
  rank-otima: "#1c76ac"
  rank-excelente: "#7b3fd4"
  rank-fenomeno: "#806000"

typography:
  display-lg:
    fontFamily: "Barlow Condensed, Oswald, Inter, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: 0.5px
    textTransform: uppercase
  display-md:
    fontFamily: "Barlow Condensed, Oswald, Inter, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.5px
    textTransform: uppercase
  group-header:
    fontFamily: "Inter, sans-serif"
    fontSize: 19px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.3px
    textTransform: uppercase
  title-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  title-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  drill-name:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0.4px
    textTransform: uppercase
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0
  label-uppercase:
    fontFamily: "Inter, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 1.2px
    textTransform: uppercase
  attr-label-key:
    fontFamily: "Inter, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
  attr-label-gray:
    fontFamily: "Inter, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  attr-value-key:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
    fontVariantNumeric: tabular-nums
  attr-value-gray:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0
    fontVariantNumeric: tabular-nums
  numeric-xl:
    fontFamily: "Barlow Condensed, Inter, sans-serif"
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0
    fontVariantNumeric: tabular-nums
  numeric-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
    fontVariantNumeric: tabular-nums
  numeric-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
    fontVariantNumeric: tabular-nums
  button:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.5px
    textTransform: uppercase
  tab:
    fontFamily: "Inter, sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.8px
    textTransform: uppercase

rounded:
  xs: 3px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  pill: 9999px
  full: 50%

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px

elevation:
  flat: none
  panel: "0 1px 3px rgba(19,38,70,0.28)"
  card: "0 2px 6px rgba(19,38,70,0.32)"
  overlay: "0 10px 32px rgba(19,38,70,0.45)"
  focus: "0 0 0 3px rgba(27,107,168,0.45)"

components:
  app-shell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-canvas}"
    typography: "{typography.body-md}"
  top-bar:
    backgroundColor: "{colors.canvas-deep}"
    textColor: "{colors.on-canvas}"
    typography: "{typography.label-uppercase}"
    height: 52px
    padding: 0 16px
  resource-chip:
    backgroundColor: "{colors.canvas-hairline}"
    textColor: "{colors.on-canvas}"
    typography: "{typography.numeric-sm}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
    height: 28px
  tab-bar:
    backgroundColor: "{colors.canvas-deep}"
    textColor: "{colors.on-canvas-muted}"
    typography: "{typography.tab}"
    height: 44px
  tab:
    backgroundColor: transparent
    textColor: "{colors.on-canvas-muted}"
    typography: "{typography.tab}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  tab-active:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.tab}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm}"
    elevation: "{elevation.panel}"
  group-header:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.group-header}"
    height: 40px
  group-icon:
    backgroundColor: "{colors.group-physical}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    width: 26px
    height: 26px
  attribute-row-key:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.attr-label-key}"
    rounded: "{rounded.sm}"
    padding: 10px 14px
    height: 43px
    borderLeft: "3px solid {colors.group-physical}"
  attribute-row-gray:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.body}"
    typography: "{typography.attr-label-gray}"
    rounded: "{rounded.sm}"
    padding: 10px 14px
    height: 43px
  attribute-value-key:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.attr-value-key}"
  attribute-value-gray:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.attr-value-gray}"
  player-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    elevation: "{elevation.card}"
  player-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.numeric-md}"
    rounded: "{rounded.sm}"
    padding: 10px 12px
    height: 44px
  player-row-in-top14:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.ink}"
    typography: "{typography.numeric-md}"
    rounded: "{rounded.sm}"
    borderLeft: "3px solid {colors.gold}"
  player-row-marked-for-sale:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.muted}"
    typography: "{typography.numeric-md}"
    rounded: "{rounded.sm}"
    borderLeft: "3px solid {colors.loss}"
  position-badge:
    backgroundColor: "{colors.group-physical}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-uppercase}"
    rounded: "{rounded.sm}"
    padding: 4px 8px
  talent-badge:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.ink}"
    typography: "{typography.label-uppercase}"
    rounded: "{rounded.sm}"
    padding: 4px 10px
    borderLeft: "3px solid {colors.rank-normal}"
  drill-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.drill-name}"
    rounded: "{rounded.lg}"
    padding: 0
    elevation: "{elevation.card}"
  drill-card-recommended:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.ink}"
    typography: "{typography.drill-name}"
    rounded: "{rounded.lg}"
    padding: 0
    border: "2px solid {colors.primary}"
    elevation: "{elevation.card}"
  drill-card-capped:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.muted}"
    typography: "{typography.drill-name}"
    rounded: "{rounded.lg}"
    padding: 0
  drill-category-flag:
    backgroundColor: "{colors.group-attack}"
    textColor: "{colors.on-primary}"
    width: 34px
    height: 34px
  drill-difficulty-footer:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.body}"
    typography: "{typography.label-uppercase}"
    height: 34px
  meter-track:
    backgroundColor: "{colors.surface-muted}"
    rounded: "{rounded.pill}"
    height: 10px
  meter-fill:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    height: 10px
  meter-cap-marker:
    backgroundColor: "{colors.gold}"
    width: 2px
  stat-tile:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.ink}"
    typography: "{typography.numeric-xl}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    elevation: "{elevation.panel}"
  delta-gain:
    backgroundColor: transparent
    textColor: "{colors.gain}"
    typography: "{typography.numeric-sm}"
  delta-loss:
    backgroundColor: transparent
    textColor: "{colors.loss}"
    typography: "{typography.numeric-sm}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 0 24px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.disabled}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 0 24px
    height: 44px
    border: "1px solid {colors.hairline-strong}"
  button-danger:
    backgroundColor: "{colors.loss-deep}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 0 24px
    height: 44px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 0 12px
    height: 36px
  text-input:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.ink}"
    typography: "{typography.numeric-md}"
    rounded: "{rounded.md}"
    padding: 0 12px
    height: 44px
    border: "1px solid {colors.hairline-strong}"
  text-input-focused:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.focus-ring}"
    elevation: "{elevation.focus}"
  text-input-invalid:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.loss}"
  select:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 0 12px
    height: 44px
    border: "1px solid {colors.hairline-strong}"
  table-header:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    typography: "{typography.label-uppercase}"
    height: 36px
  callout-info:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
    borderLeft: "3px solid {colors.info}"
  callout-warning:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
    borderLeft: "3px solid {colors.alert}"
  empty-state:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
---

## Visão geral

O Top Eleven Lab é uma calculadora que vive ao lado do jogo. O sistema visual existe para que o jogador reconheça o ambiente sem reaprender nada: **canvas azul royal** (`{colors.canvas}` — #2658aa) com **painéis claros** por cima (`{colors.panel}` — #d1d6d9), exatamente como as telas de dados do Top Eleven.

Esse é o ponto que define o sistema. O jogo tem duas caras: o HUD 3D da partida é escuro, mas **toda tela de dado — atributos, elenco, treinamentos — é clara sobre azul**. O Lab é uma ferramenta de dado, então segue a segunda.

### Procedência das cores

Os valores vieram de amostragem de pixel em capturas do próprio jogo (`Mockups/Referencias/`), não de estimativa:

| Origem | O que foi medido |
|---|---|
| `exemplo atributos brancos AMR.png` | Fundo do painel #d1d6d9, linha-chave #e5e9ea, linha cinza #c4cbcf, barra de ataque #f2524d, barra de atributos #6972cb, ícones #07a50d / #ce3a46 / #4f6dd1 |
| `GK.png` | Grupo Defesa do Gol #4dc8ff (ícone) e #62aeeb (barra), botão de ação verde #5bcc51 |
| `treinamentos ataque 1.png` | Canvas #2658aa, moldura #1e355a, corpo do card #f2f7fa, rodapé #ffffff, fita de categoria #db4756 |

Os tokens são essas amostras **escurecidas o necessário para passar contraste AA** em texto. Onde houve ajuste, a tabela de acessibilidade registra o valor final. Não são o arquivo de marca da Nordeus.

**Características principais:**
- Painéis claros sobre canvas azul. Não existe tema escuro na V1.
- A distinção **atributo-chave (branco) × atributo cinza** usa os três canais que o jogo usa ao mesmo tempo — está detalhada na seção seguinte.
- Barra de acento colorida **por grupo**, não uma cor única: defesa verde, defesa do gol ciano, ataque vermelho, atributos azul.
- Verde é a cor de ação primária, como o `NOVA CLASSE` do jogo. Azul é estrutura, não botão.
- Raio contido: `{rounded.md}` (6px) em botões e inputs, `{rounded.lg}` (8px) em painéis. O jogo é anguloso.
- Todo número comparável usa `font-variant-numeric: tabular-nums`.
- Sem magenta/violeta de campanha. As cores berrantes das capturas de loja são moldura de marketing, não UI.

## O padrão branco × cinza

É a decisão de interface mais importante do produto, e o jogo já a resolveu. Medido na referência do AMR, o jogo marca o atributo-chave com **três canais simultâneos**:

| Canal | Atributo-chave (branco) | Atributo cinza |
|---|---|---|
| Fundo da linha | `{colors.surface}` — #e5e9ea | `{colors.surface-muted}` — #c4cbcf |
| Barra de acento à esquerda | 3px na cor do grupo | ausente |
| Peso do valor | 700 (`{typography.attr-value-key}`) | 400 (`{typography.attr-value-gray}`) |

A verificação que confirma que isso é semântico e não listra alternada: na coluna ATRIBUTOS do AMR, as linhas 1, 4 e 5 (Condicionamento, Velocidade, Criatividade) vêm claras com barra; as linhas 2 e 3 (Força, Agressividade) vêm escuras sem barra. Não alterna — segue a matriz de brancos da posição. Na coluna ATAQUE as cinco linhas são claras com barra; na coluna DEFESA as cinco são escuras sem barra. Bate item por item com os brancos de AMR em `docs/GAME-RULES.md`.

Três canais redundantes é o que faz o padrão sobreviver a daltonismo, a tela ruim e a print em preto e branco. **Replicar os três é obrigatório** — usar só a cor quebra a paridade com o jogo e a acessibilidade junto.

Detalhe que evita um erro fácil: o rótulo da linha cinza **não** é cinza-claro. Ele é `{colors.body}` escuro em peso 400. O que muda é peso e fundo, não a cor do texto. Texto apagado sobre fundo apagado reprova contraste e o jogo não faz isso.

## Cores

### Canvas e estrutura
- **Canvas** (`{colors.canvas}` — #2658aa): piso do app, azul royal do jogo.
- **Canvas Deep** (`{colors.canvas-deep}` — #1e355a): barra superior, barra de abas, moldura entre painéis.
- **Canvas Hairline** (`{colors.canvas-hairline}` — #263c60): divisória dentro das áreas azuis, chip de recurso.

### Superfícies claras
- **Panel** (`{colors.panel}` — #d1d6d9): corpo do painel, o cinza-azulado que segura as linhas.
- **Surface** (`{colors.surface}` — #e5e9ea): linha de atributo-chave, card padrão, callout.
- **Surface Bright** (`{colors.surface-bright}` — #ffffff): campo de entrada, rodapé de card, linha dos 14 mais fortes, stat tile.
- **Surface Muted** (`{colors.surface-muted}` — #c4cbcf): linha de atributo cinza, exercício travado no teto.
- **Hairline / Hairline Strong** (#b4bdc2 / #9aa5ab): divisórias e bordas de campo.

### Texto
- **Ink** (`{colors.ink}` — #1e1d1d): títulos, valores-chave, cabeçalho de grupo.
- **Body** (`{colors.body}` — #323232): texto corrido, rótulo e valor de atributo cinza.
- **Muted** (`{colors.muted}` — #5a656b): rótulo secundário, cabeçalho de tabela. Só sobre `{colors.surface}` ou `{colors.surface-bright}`.
- **Disabled** (`{colors.disabled}` — #8b949a): apenas controle desabilitado. Não passa AA e não deve carregar informação.
- **On Canvas** (`{colors.on-canvas}` — #ffffff) e **On Canvas Muted** (`{colors.on-canvas-muted}` — #c9d7ee): texto sobre as áreas azuis.

### Grupos de atributo

A cor da barra de acento sai do grupo, seguindo os ícones do jogo:

| Grupo | Token | Hex | Ícone medido |
|---|---|---|---|
| Defesa | `{colors.group-defense}` | #1c8423 | #07a50d |
| Defesa do Gol | `{colors.group-goalkeeping}` | #1c76ac | #4dc8ff |
| Ataque | `{colors.group-attack}` | #c4323f | #ce3a46 |
| Atributos (físico/mental) | `{colors.group-physical}` | #4553b8 | #4f6dd1 |

Goleiro usa Defesa do Gol no lugar de Defesa — são conjuntos de atributos diferentes, não a mesma lista recolorida.

### Ação e semântica
- **Primary** (`{colors.primary}` — #25761e): botão principal. O jogo usa #5bcc51 no `NOVA CLASSE`; escurecido aqui porque texto branco sobre #5bcc51 dá 2,1:1 e reprova AA.
- **Primary Hover / Active / Disabled**: #2f8f28 / #1e6a17 / #b4bdc2.
- **Focus Ring** (`{colors.focus-ring}` — #1b6ba8): anel de foco de 3px. Nunca remover o foco visível.
- **Gain** (`{colors.gain}` — #15701b): delta positivo (`+3,2` de overall).
- **Loss** (`{colors.loss}` — #b32c37): delta negativo, venda, virada de temporada, erro de validação.
- **Loss Deep** (`{colors.loss-deep}` — #96222b): preenchimento do `{component.button-danger}`. Nunca como texto.
- **Alert** (`{colors.alert}` — #95541f): exercício perto do teto de 180%, idade acima da faixa útil.
- **Info** (`{colors.info}` — #1b6ba8): callout explicativo, nota de procedência.
- **Gold** (`{colors.gold}` — #806000): marcador do teto de 180%, barra dos 14 mais fortes e texto dourado. Escurecido bem abaixo do dourado do jogo porque dourado claro sobre superfície clara some — o do jogo aparece sobre o azul, não sobre o painel.

### Ranks de talento

Sete ranks, na ordem de `docs/GAME-RULES.md`, em rampa de raridade de jogo:

| Rank | Token | Hex |
|---|---|---|
| Terrível | `{colors.rank-terrivel}` | #c4323f |
| Ruim | `{colors.rank-ruim}` | #c26a00 |
| Normal | `{colors.rank-normal}` | #6b7885 |
| Boa | `{colors.rank-boa}` | #1c8423 |
| Ótima | `{colors.rank-otima}` | #1c76ac |
| Excelente | `{colors.rank-excelente}` | #7b3fd4 |
| Fenômeno | `{colors.rank-fenomeno}` | #806000 |

A cor nunca carrega a informação sozinha — o `{component.talent-badge}` sempre mostra o nome do rank ao lado. Vale para daltônicos e para o caso `[PENDENTE]` em que Ruim e Terrível não são separáveis: aí o badge mostra "Ruim / Terrível" com a cor de Ruim e um ícone de incerteza.

O badge vive sobre `{colors.surface-bright}` ou `{colors.surface}`. Sobre `{colors.surface-muted}` as cores mais claras da rampa perdem separação.

## Tipografia

### Famílias

**Barlow Condensed** para display e números grandes; **Inter** para todo o resto. O jogo usa uma condensada pesada nos títulos e uma humanista nas listas de atributo — a dupla reproduz isso com fontes OFL.

Stack: `"Barlow Condensed", Oswald, "Saira Condensed", Inter, system-ui, sans-serif` para display; `Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` para o resto.

### Hierarquia

| Token | Fonte | Tamanho | Peso | Uso |
|---|---|---|---|---|
| `{typography.display-lg}` | Barlow Cond. | 40px | 700 | Título de tela ("SQUAD", "LABORATÓRIO") |
| `{typography.display-md}` | Barlow Cond. | 28px | 700 | Título de painel |
| `{typography.group-header}` | Inter | 19px | 700 | Cabeçalho de grupo ("DEFESA", "ATAQUE") |
| `{typography.title-md}` | Inter | 16px | 600 | Nome de jogador, título de card |
| `{typography.title-sm}` | Inter | 14px | 600 | Rótulo de campo |
| `{typography.drill-name}` | Inter | 14px | 700 | Nome do exercício, em caixa alta |
| `{typography.attr-label-key}` | Inter | 15px | 500 | Rótulo de atributo-chave |
| `{typography.attr-label-gray}` | Inter | 15px | 400 | Rótulo de atributo cinza |
| `{typography.attr-value-key}` | Inter | 16px | 700 | Valor de atributo-chave |
| `{typography.attr-value-gray}` | Inter | 16px | 400 | Valor de atributo cinza |
| `{typography.body-md}` | Inter | 15px | 400 | Texto corrido |
| `{typography.body-sm}` | Inter | 13px | 400 | Callout, ajuda |
| `{typography.caption}` | Inter | 12px | 500 | Legenda |
| `{typography.label-uppercase}` | Inter | 11px | 600 | Cabeçalho de tabela, badge |
| `{typography.numeric-xl}` | Barlow Cond. | 34px | 700 | Média dos 14, overall em destaque |
| `{typography.numeric-md}` | Inter | 15px | 600 | Célula de tabela |
| `{typography.numeric-sm}` | Inter | 13px | 500 | Delta, percentual |
| `{typography.button}` | Inter | 14px | 700 | Botão, em caixa alta |
| `{typography.tab}` | Inter | 13px | 600 | Aba, em caixa alta |

### Princípios

O par `attr-value-key` / `attr-value-gray` existe só para carregar o canal de peso do padrão branco × cinza. São o mesmo tamanho de propósito: se o tamanho mudasse junto, a coluna de valores perderia o alinhamento óptico que o jogo mantém.

Botão e aba em caixa alta; display em caixa alta. Texto corrido e rótulo de atributo em caixa normal — o jogo escreve "Condicionamento", não "CONDICIONAMENTO".

## Layout

### Espaçamento
Base 4px. `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 32 · `{spacing.xxl}` 48.

Painel usa `{spacing.sm}` interno — o jogo é denso e a lista de atributos encosta na borda do painel. Entre painéis, `{spacing.md}`. Linha de atributo: 43px de altura com 5px de gap, medido na referência.

### Grade e contêiner
- Largura máxima ~1200px centralizada.
- **Painel de atributos**: 3 colunas de grupo lado a lado (Defesa / Ataque / Atributos), como o jogo. Goleiro troca Defesa por Defesa do Gol e usa 2 colunas mais largas.
- **Squad**: tabela full-width, coluna de nome fixa à esquerda, colunas numéricas à direita.
- **Laboratório**: split 5/7 — jogador e atributos à esquerda, exercícios ranqueados à direita.
- Grade de cards de exercício: 4-up em desktop (como a tela de treinamentos), 2-up em tablet, 1-up em mobile.

## Elevação e profundidade

| Nível | Token | Uso |
|---|---|---|
| Plano | `{elevation.flat}` | Linhas de atributo, linhas de tabela, abas |
| Painel | `{elevation.panel}` | Painéis e stat tiles sobre o canvas azul |
| Card | `{elevation.card}` | Carta de jogador, card de exercício |
| Sobreposto | `{elevation.overlay}` | Modal, dropdown |
| Foco | `{elevation.focus}` | Anel de foco de teclado |

A sombra é azulada (`rgba(19,38,70,…)`), não preta — sombra neutra sobre canvas azul suja. As linhas dentro do painel não têm sombra: a separação vem da diferença de superfície, como no jogo.

## Formas

| Token | Valor | Uso |
|---|---|---|
| `{rounded.xs}` | 3px | Barra de acento, tag mínima |
| `{rounded.sm}` | 4px | Linha de atributo, badge, ícone de grupo |
| `{rounded.md}` | 6px | Botão, input, select, aba |
| `{rounded.lg}` | 8px | Painel, card de exercício, stat tile |
| `{rounded.xl}` | 12px | Modal |
| `{rounded.pill}` | 9999px | Chip de recurso, trilho de barra |
| `{rounded.full}` | 50% | Avatar, botão de ícone |

## Componentes

### Estrutura

**`app-shell`** — Piso `{colors.canvas}`.

**`top-bar`** — Barra `{colors.canvas-deep}` de 52px. Marca à esquerda, `{component.resource-chip}` à direita com os recursos informados (maletas, condicionamento).

**`tab-bar`** + **`tab`** / **`tab-active`** — `SQUAD / LABORATÓRIO` em caixa alta. Inativa é texto `{colors.on-canvas-muted}` sobre o azul; ativa vira uma aba clara `{colors.panel}` com texto `{colors.ink}`, como se puxasse o painel para cima.

**`panel`** — Contêiner claro sobre o azul. `{colors.panel}`, raio `{rounded.lg}`, sombra `{elevation.panel}`.

### Atributos

**`group-header`** — Linha de cabeçalho do grupo: `{component.group-icon}` + nome em `{typography.group-header}` à esquerda, média do grupo à direita. Fundo transparente sobre o painel.

**`group-icon`** — Quadrado de 26px, raio `{rounded.sm}`, preenchido com a cor do grupo e um glifo branco.

**`attribute-row-key`** — Linha do atributo-chave. Fundo `{colors.surface}`, barra de 3px à esquerda na cor do grupo, rótulo em `{typography.attr-label-key}`, valor em `{typography.attr-value-key}`. Altura 43px.

**`attribute-row-gray`** — Linha do atributo cinza. Fundo `{colors.surface-muted}`, **sem barra**, rótulo em `{typography.attr-label-gray}`, valor em `{typography.attr-value-gray}`. Mesma altura.

**`attribute-value-key`** / **`attribute-value-gray`** — Valor alinhado à direita. Os dois usam `tabular-nums`.

### Jogador

**`player-card`** — Cabeçalho do jogador: nome, `{component.position-badge}`, idade, overall e `{component.talent-badge}`.

**`player-row`** — Linha da tabela do Squad, 44px.

**`player-row-in-top14`** — Jogador dentro da média dos 14 mais fortes: fundo `{colors.surface-bright}` e barra `{colors.gold}` de 3px à esquerda. É o destaque mais importante do Squad — a média dos 14 é a decisão que o produto existe para resolver.

**`player-row-marked-for-sale`** — Marcado para venda no simulador: fundo `{colors.surface-muted}`, texto `{colors.muted}`, barra `{colors.loss}`. Continua visível porque a comparação antes/depois é o ponto.

**`position-badge`** — Sigla da posição em pílula `{colors.group-physical}` com texto branco, como o badge `GK` do jogo.

**`talent-badge`** — Nome do rank com barra de 3px na cor do rank. Cor nunca sozinha.

### Laboratório

**`drill-card`** — Card do exercício, na estrutura da tela de treinamentos: `{component.drill-category-flag}` no canto superior esquerdo, faixa de imagem no topo, nome em `{typography.drill-name}`, lista de atributos afetados em `{typography.body-sm}`, e `{component.drill-difficulty-footer}` embaixo. Padding zero no card — cada faixa controla o próprio.

**`drill-card-recommended`** — O exercício de maior retorno da sessão. Borda de 2px `{colors.primary}` e fundo `{colors.surface-bright}`. Só um por sessão — recomendar três é não recomendar nada.

**`drill-card-capped`** — Exercício travado no teto de 180%. Fundo `{colors.surface-muted}`, texto `{colors.muted}`. Continua listado, porque saber que travou é informação.

**`drill-category-flag`** — Triângulo de canto de 34px na cor do grupo do exercício, com glifo branco. É a fita vermelha que o jogo usa nos treinos de ataque.

**`drill-difficulty-footer`** — Faixa `{colors.surface-bright}` com `FÁCIL` / `MÉDIO` / `DIFÍCIL` em `{typography.label-uppercase}` centralizado.

**`meter-track`** / **`meter-fill`** / **`meter-cap-marker`** — Barra da média do exercício, preenchimento `{colors.primary}`, com marcador `{colors.gold}` de 2px na posição do teto de 180%.

**`stat-tile`** — Número grande com rótulo: média dos 14, overall projetado, ganho estimado.

**`delta-gain`** / **`delta-loss`** — Variação ao lado de um número, sempre com sinal explícito (`+2,4` / `−1,8`).

### Ações e formulários

**`button-primary`** — Verde `{colors.primary}`, texto branco em caixa alta, 44px. É o `NOVA CLASSE` do jogo.

**`button-secondary`** — Branco com borda `{colors.hairline-strong}`.

**`button-danger`** — `{colors.loss-deep}`. Só para ação destrutiva de verdade (remover jogador do elenco), não para "marcar para venda", que é simulação reversível.

**`button-ghost`** — Sem fundo, 36px, ações terciárias em linha de tabela.

**`text-input`** — Branco, borda `{colors.hairline-strong}`, 44px. Os 15 campos de atributo são o formulário mais usado do produto: entrada numérica, `inputmode="numeric"`, editável sem abrir modal.

**`text-input-focused`** / **`text-input-invalid`** — Foco troca a borda para `{colors.focus-ring}` e adiciona `{elevation.focus}`. Inválido usa borda `{colors.loss}` e mensagem em texto — nunca só a cor.

**`select`** — Mesma caixa, para posição e rank de talento.

**`table-header`** — `{colors.panel}`, texto `{typography.label-uppercase}` em `{colors.muted}`, 36px. Colunas numéricas à direita.

### Comunicação

**`callout-info`** / **`callout-warning`** — Bloco com barra de 3px à esquerda em `{colors.info}` ou `{colors.alert}`. O `callout-info` é onde vive a nota de procedência (`[OFICIAL]`, `[COMUNIDADE]`, `[PENDENTE]`) que `docs/GAME-RULES.md` exige que o produto mostre.

**`empty-state`** — Elenco vazio, sem exercício elegível. Texto `{colors.muted}` com a ação que resolve o vazio logo abaixo.

## Variáveis CSS

Os mockups da etapa 4 são HTML solto, sem build. Este bloco é a implementação canônica dos tokens — cole no `<style>` e use as variáveis, nunca hex inline.

```css
:root {
  color-scheme: light;

  --canvas: #2658aa;
  --canvas-deep: #1e355a;
  --canvas-hairline: #263c60;

  --panel: #d1d6d9;
  --surface: #e5e9ea;
  --surface-bright: #ffffff;
  --surface-muted: #c4cbcf;
  --hairline: #b4bdc2;
  --hairline-strong: #9aa5ab;

  --ink: #1e1d1d;
  --body: #323232;
  --muted: #5a656b;
  --disabled: #8b949a;
  --on-canvas: #ffffff;
  --on-canvas-muted: #c9d7ee;
  --on-primary: #ffffff;

  --primary: #25761e;
  --primary-hover: #2f8f28;
  --primary-active: #1e6a17;
  --primary-disabled: #b4bdc2;
  --focus-ring: #1b6ba8;

  --group-defense: #1c8423;
  --group-goalkeeping: #1c76ac;
  --group-attack: #c4323f;
  --group-physical: #4553b8;

  --gain: #15701b;
  --loss: #b32c37;
  --loss-deep: #96222b;
  --alert: #95541f;
  --info: #1b6ba8;
  --gold: #806000;

  --rank-terrivel: #c4323f;
  --rank-ruim: #c26a00;
  --rank-normal: #6b7885;
  --rank-boa: #1c8423;
  --rank-otima: #1c76ac;
  --rank-excelente: #7b3fd4;
  --rank-fenomeno: #806000;

  --font-display: "Barlow Condensed", Oswald, "Saira Condensed", Inter, system-ui, sans-serif;
  --font-ui: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  --r-xs: 3px;  --r-sm: 4px;  --r-md: 6px;
  --r-lg: 8px;  --r-xl: 12px; --r-pill: 9999px;

  --s-xxs: 4px; --s-xs: 8px;  --s-sm: 12px; --s-md: 16px;
  --s-lg: 24px; --s-xl: 32px; --s-xxl: 48px;

  --e-panel: 0 1px 3px rgba(19,38,70,0.28);
  --e-card: 0 2px 6px rgba(19,38,70,0.32);
  --e-overlay: 0 10px 32px rgba(19,38,70,0.45);
  --e-focus: 0 0 0 3px rgba(27,107,168,0.45);
}

body {
  background: var(--canvas);
  color: var(--body);
  font-family: var(--font-ui);
  font-size: 15px;
  line-height: 1.55;
}

.num { font-variant-numeric: tabular-nums; }

/* padrao branco x cinza — os tres canais juntos */
.attr {
  display: flex; align-items: center; justify-content: space-between;
  height: 43px; padding: 0 14px; border-radius: var(--r-sm);
}
.attr--key  { background: var(--surface); color: var(--ink); border-left: 3px solid var(--group); }
.attr--gray { background: var(--surface-muted); color: var(--body); }
.attr--key  .attr__value { font-weight: 700; }
.attr--gray .attr__value { font-weight: 400; }
.attr__value { font-variant-numeric: tabular-nums; font-size: 16px; }

/* a cor do grupo entra por variavel no container da coluna */
.group--defense     { --group: var(--group-defense); }
.group--goalkeeping { --group: var(--group-goalkeeping); }
.group--attack      { --group: var(--group-attack); }
.group--physical    { --group: var(--group-physical); }
```

## Faça e não faça

### Faça
- Ancore o app no azul `{colors.canvas}` e coloque todo dado em painel claro por cima.
- Replique os **três** canais do padrão branco × cinza. Um só não basta.
- Tire a cor da barra de acento do grupo do atributo, não de uma cor única.
- Use verde `{colors.primary}` na ação principal. É o que o jogo faz.
- Aplique `tabular-nums` em todo número comparável.
- Destaque os 14 mais fortes com a barra dourada. É a resposta que o usuário veio buscar.
- Acompanhe toda cor semântica de um rótulo em texto (rank, delta, erro de validação).
- Marque a procedência com `{component.callout-info}` quando a regra for `[COMUNIDADE]` ou `[PENDENTE]`.
- Mantenha o anel de foco `{elevation.focus}` em tudo que recebe teclado.

### Não faça
- Não faça tema escuro. A tela escura do jogo é o HUD da partida, não a tela de dado.
- Não use azul em botão. Azul é estrutura aqui; botão azul compete com o canvas e sai do idioma do jogo.
- Não pinte o rótulo do atributo cinza de cinza-claro. O canal é peso e fundo, não cor de texto.
- Não use magenta/violeta de campanha. É moldura de anúncio da loja, não UI.
- Não use `{colors.disabled}` como texto — não passa AA e só marca controle desabilitado.
- Não coloque `{component.talent-badge}` sobre `{colors.surface-muted}`.
- Não aumente o raio além de `{rounded.lg}`. Raio de landing page tira o peso de jogo.
- Não codifique nada só por cor.
- Não crie um oitavo rank nem um quinto grupo de atributo.
- Não reproduza logo, escudo, fonte proprietária ou arte da Nordeus. O sistema é *inspirado no ambiente do jogo*, não uma cópia da marca.

## Responsivo

| Nome | Largura | Mudanças |
|---|---|---|
| Mobile | < 768px | Abas viram barra inferior fixa; grupos de atributo empilham em 1 coluna; tabela do Squad reduz a nome + posição + overall com expansão por linha; exercícios 1-up |
| Tablet / paisagem | 768–1024px | Grupos 2-up; tabela mostra as colunas numéricas principais; exercícios 2-up |
| Desktop | > 1024px | Grupos 3-up como no jogo; tabela completa; exercícios 4-up; split 5/7 no Laboratório |

### Alvos de toque
- `{component.button-primary}` e `{component.text-input}` a 44px.
- `{component.player-row}` a 44px — a linha inteira é tocável.
- `{component.attribute-row-key}` a 43px, que é a medida do jogo; quando a linha for editável, sobe para 44px.

### Estratégia de colapso
- Os grupos de atributo reduzem colunas, nunca encolhem a linha.
- A tabela do Squad esconde colunas por prioridade: overall e posição ficam até o fim.
- A `{component.top-bar}` mantém os chips de recurso em todos os breakpoints; a marca vira só o símbolo abaixo de 768px.

## Acessibilidade

Razões medidas (WCAG 2.1). Texto sobre as superfícies claras:

| Token | surface #e5e9ea | bright #ffffff | muted #c4cbcf |
|---|---|---|---|
| `{colors.ink}` | 13,75 | 16,82 | 10,24 |
| `{colors.body}` | 10,49 | 12,82 | 7,81 |
| `{colors.muted}` | 4,90 | 5,99 | — |
| `{colors.gain}` | 5,10 | 6,24 | — |
| `{colors.loss}` | 5,15 | 6,30 | — |
| `{colors.alert}` | 4,82 | 5,89 | — |
| `{colors.info}` | 4,62 | 5,65 | — |
| `{colors.primary}` | 4,66 | 5,69 | — |
| `{colors.gold}` | 4,78 | 5,85 | — |

Preenchimentos com texto branco: `{colors.primary}` 5,69 · `{colors.loss-deep}` 8,20 · `{colors.canvas}` 6,87 · `{colors.canvas-deep}` 12,27 · e os quatro `group-*` entre 4,80 e 6,60, para o glifo do `{component.group-icon}`. Todos passam AA.

- A linha de atributo cinza usa `{colors.body}` (7,81 sobre #c4cbcf), não `{colors.muted}`. Por isso o canal é peso, não cor.
- Barras de grupo e de rank são elemento gráfico sobre `{colors.surface}`: entre 3,21 e 5,40, acima do piso de 3:1 para componente de UI. O texto do badge é sempre `{colors.ink}`.
- `{colors.disabled}` não passa AA e não carrega informação — marca apenas controle desabilitado.
- Foco visível obrigatório; a tabela do Squad é navegável por teclado.
- `prefers-reduced-motion` desliga qualquer transição além do fade de foco.

## Lacunas conhecidas

- A fonte do jogo é proprietária. Barlow Condensed é a substituição OFL mais próxima; Oswald e Saira Condensed são alternativas.
- O canvas do jogo tem textura de estádio por trás do azul. Aqui é cor chapada — textura de fundo atrás de tabela é ruído, e o custo de recriá-la não se paga.
- Não há tema escuro. Se aparecer demanda, o trabalho é remapear as superfícies claras; os tokens semânticos (grupos, ranks, gain/loss) não mudam.
- Ícones não estão definidos. O jogo usa um glifo por grupo dentro do `{component.group-icon}`; a escolha do conjunto fica para a etapa 6.
- Animação e transição não estão em escopo além da regra de `prefers-reduced-motion`.
- O corte entre Ruim e Terrível é `[PENDENTE]` em `docs/GAME-RULES.md`; o `{component.talent-badge}` já prevê o estado combinado.
- Não há referência amostrada da barra verde de Defesa em jogador de linha — `{colors.group-defense}` veio do ícone (#07a50d) seguindo o mesmo ajuste de contraste dos outros grupos. Uma captura de zagueiro fecharia isso.
