# ADR 0005 — npm, TypeScript estrito, Vitest e ESLint; Next.js adiado para a etapa 6

- **Status:** aceita
- **Data:** 2026-09-07
- **Decide sobre:** as ferramentas do projeto e o momento em que cada uma entra

## Contexto

Projeto de uma pessoa, open source, exposto no perfil do dono. Quem chega pelo GitHub precisa
conseguir rodar `npm install && npm test` sem instalar nada exótico antes.

O motor da etapa 5 é TypeScript puro e não precisa de framework de interface. A primeira tela
só aparece na etapa 6.

## Decisão

**Instalado agora:**

| Ferramenta | Papel |
|---|---|
| **npm** | Gerenciador de pacotes. Vem com o Node, sem passo de instalação extra |
| **TypeScript em modo estrito** | Com `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes` ligados |
| **Vitest** | Testes. Sem DOM, porque o domínio não precisa |
| **ESLint** com `typescript-eslint` | Lint |
| **GitHub Actions** | `lint`, `typecheck` e `test` a cada push e pull request |
| **Dependabot** | Atualização de dependências e auditoria semanal |

**Adiado para a etapa 6:** Next.js, React e o passo de `build` no CI.

## Consequências

**Boas:**

- **`strict` mais `noUncheckedIndexedAccess` é o que faz a [ADR 0007](0007-rule-tables-in-typescript.md)
  funcionar.** Sem eles, a tabela dos 29 drills tipada como `readonly Atributo[]` não pegaria
  o erro de transcrição, que é o modo de falha mais provável do projeto.
- CI antes do motor, e não depois: o valor do TDD some se a bateria de testes só rodar em
  ambiente limpo no fim (`ROADMAP.md:34`).
- Nada de framework parado envelhecendo no `package.json` antes de existir tela para usá-lo.
  Dependência não usada é dívida de segurança e ruído no Dependabot.
- Vitest sem ambiente de DOM roda o motor em milissegundos.

**Custos aceitos:**

- Quando o Next entrar, o `tsconfig.json` vai precisar de `"lib": [..., "DOM"]` e de `jsx`,
  e o `lib` sem DOM deixa de proteger a fronteira do domínio — ver
  [ADR 0004](0004-framework-free-domain.md), "Como a fronteira é cobrada".
- npm é mais lento que pnpm em instalação. Irrelevante num projeto com meia dúzia de
  dependências de desenvolvimento.

## Alternativas descartadas

- **Jest.** Precisa de transpilação configurada para ESM e TypeScript. O Vitest lê o
  `tsconfig` e roda ESM nativo, sem configuração.
- **pnpm ou yarn.** Mais rápidos, e adicionam um passo de instalação para quem clona o
  repositório. Num projeto que é vitrine, `npm install` funcionando de primeira vale mais que
  segundos de instalação.
- **Biome no lugar de ESLint mais Prettier.** Mais rápido e mais simples, e com ecossistema
  de regras menor. O `typescript-eslint` é o que vai cobrar a fronteira de import da ADR 0004.
- **Instalar o Next agora, junto do resto.** Framework parado sem tela para servir.

## Sinal para revisitar

Instalação ou CI ficando lentos a ponto de incomodar (pnpm); tempo de lint incomodando
(Biome); necessidade de teste de interface (jsdom mais Testing Library — ver
`ARCHITECTURE.md` §8).
