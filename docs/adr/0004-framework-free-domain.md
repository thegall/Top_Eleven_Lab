# ADR 0004 — Domínio isolado de framework

- **Status:** aceita
- **Data:** 2026-09-07
- **Decide sobre:** a fronteira entre a regra do jogo e o resto do sistema

## Contexto

O que dá valor ao produto não é a interface — é o motor. Ele é determinístico, e as fórmulas
vêm todas de `docs/GAME-RULES.md`, cada uma com a medição de campo que a valida
(`AGENTS.md:24`).

Três forças empurram para o isolamento:

- **O projeto é TDD** e a primeira bateria de testes já está escrita, em `AGENTS.md:135-143`.
  Testes de cálculo que precisam de navegador para rodar são lentos, frágeis e desestimulam
  o ciclo curto.
- **A Nordeus muda mecânica sem avisar** (`PRD.md:93`). Quando isso acontecer, o conserto
  precisa ter um lugar só, e esse lugar não pode estar espalhado dentro de componentes.
- **O código é vitrine pública.** Quem chega pelo GitHub tem que conseguir ler a regra do
  jogo sem entender React.

## Decisão

`src/domain/` é TypeScript puro. Não importa React, não lê `window`, não toca em
`localStorage`, não usa `Date.now()` e **não formata número para exibição**.

Dependência aponta só para dentro:

```
interface  →  aplicação  →  domínio  →  tabelas de regra
```

O domínio recebe dados e devolve dados. Devolve `0.344`; a interface decide se mostra
`34,4%` ou `0,34`.

## Consequências

**Boas:**

- O motor roda em Vitest sem DOM e sem dependência de navegador. O ciclo de TDD é de
  milissegundos, que é o que faz TDD acontecer de verdade em vez de virar intenção.
- Trocar a camada de interface — ou reverter Next para Vite, como a [ADR 0001](0001-static-export-on-vercel.md)
  prevê — não toca em regra de jogo.
- Cada função do domínio corresponde a uma seção do `GAME-RULES.md`, o que torna
  auditável o caminho de "o vídeo diz X" até "o código faz X".
- Bug de cálculo e bug de exibição ficam em lugares diferentes, e a mensagem do teste que
  falha já diz qual dos dois é.

**Custos aceitos:**

- **Existe uma camada a mais.** Num app de duas telas, "só chamar a função no componente"
  seria menos código. A troca se paga porque o cálculo é o produto, não um detalhe dele.
- Formatar em português (vírgula decimal, sinal de porcentagem) vira responsabilidade
  explícita da interface, com algum código repetido entre telas.
- É uma regra que só se sustenta se for cobrada. Um `import { useState }` dentro de
  `src/domain/` derruba tudo em silêncio — ver abaixo.

## Como a fronteira é cobrada

Hoje, por revisão e pelo `typecheck` do CI: o `tsconfig.json` declara `"lib": ["ES2022"]`,
sem `DOM`, então `window` e `localStorage` **não compilam** dentro de `src/`. Isso já pega o
caso mais provável de graça.

Quando a camada de interface entrar (etapa 6), o `lib` vai precisar de `DOM`, e essa proteção
some. Nesse momento, a regra passa a ser cobrada por uma regra de ESLint de import proibido
(`no-restricted-imports` com padrão de caminho), que é a forma mais barata de manter a
fronteira sem cerimônia.

## Alternativas descartadas

- **Regra de jogo direto nos componentes.** Menos arquivos, e o motor deixaria de ser
  testável sem navegador. Perde o que faz o produto ser confiável.
- **Hooks de React encapsulando o cálculo** (`useTrainingSchedule`). Amarra a regra ao ciclo
  de vida do React e à árvore de componentes, e torna impossível testar a função sem montar
  uma árvore.
- **Pacote npm separado para o domínio.** Isolamento mais forte, e custa versionamento,
  publicação e um monorepo, para uma pessoa e um consumidor só.

## Sinal para revisitar

Nenhum previsto. Esta é a decisão estrutural do projeto — se ela cair, o que sobra é uma
planilha em HTML.
