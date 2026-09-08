# Roadmap — Top Eleven Lab

> As etapas do projeto e onde ele está. Uma etapa por commit, salvo onde indicado.
>
> Contexto de produto: [`PRD.md`](../PRD.md). Regras do jogo: [`GAME-RULES.md`](GAME-RULES.md). Referência técnica: [`AGENTS.md`](../AGENTS.md).

## Etapa 1 — Documentação

**Em andamento.**

Fechar o repositório como documento antes de escrever a primeira linha de código. O projeto é open source e vai ficar exposto; quem chegar pelo GitHub precisa entender o que é, por que existe e como as regras foram levantadas.

- [x] `PRD.md` — por que o produto existe, para quem, o que ficou fora da V1
- [x] `docs/GAME-RULES.md` — as regras do jogo, com fórmulas, origem e validação
- [x] `AGENTS.md` — referência técnica e regras de trabalho
- [x] `LICENSE` — MIT
- [x] `README.md`
- [x] `docs/ROADMAP.md`
- [ ] `.gitignore`

## Etapa 2 — Setup, CI e Dependabot

**Concluída.** PR #1.

Setup mínimo do projeto e a esteira que vai validar tudo daqui pra frente. O setup entra junto porque CI sem nada para rodar não prova nada.

- [x] `package.json` com npm, `tsconfig.json` em modo estrito, Vitest e ESLint
- [x] Primeira peça do domínio, com teste: custo de condicionamento por dificuldade
- [x] `.github/workflows/ci.yml` — lint, typecheck e testes a cada push e pull request
- [x] `.github/workflows/dependency-audit.yml` — auditoria semanal de vulnerabilidades
- [x] `.github/dependabot.yml` — atualização de dependências npm e de GitHub Actions
- [ ] Proteção da `main` — adiada até o repositório abrir. Enquanto for privado e de uma pessoa só, o CI reporta sem bloquear

CI antes do motor, e não depois, porque o valor do TDD some se a bateria de testes só rodar em ambiente limpo no fim. Também é o que permite aceitar contribuição de fora sem revisar tudo na mão.

O Next.js fica de fora desta etapa. O motor da etapa 5 é TypeScript puro e não precisa dele; instalar framework antes de usar deixa dependência parada envelhecendo no `package.json`. O step de build entra no CI junto com o Next, na etapa 6.

## Etapa 3 — Arquitetura

**Em andamento.** Branch `docs/architecture`.

- [x] `docs/ARCHITECTURE.md` — requisitos apurados, camadas, estrutura de pastas, estado, tabelas de regra, projeção, testes, riscos e suposições
- [x] `docs/adr/` — nove decisões, uma por arquivo
- [x] `docs/architecture/workspace.dsl` — modelo C4 com cinco views, validado no Structurizr

As cinco decisões que já estavam tomadas viraram ADR 0001 a 0005. As quatro novas: um cadastro só para as duas abas (0006), tabelas de regra em TypeScript `as const` (0007), projeção síncrona sem Web Worker (0008), e estado em React Context com `useReducer` (0009).

A **fronteira** de estado ficou resolvida — onde ele mora, como chega ao `localStorage`, como o import e a migração se encaixam. A **árvore de componentes** continua fora: ela depende do formato de saída do motor, que só existe depois da etapa 5.

## Etapa 4 — Mockups de validação visual

Telas navegáveis antes da implementação real, para validar layout e fluxo com jogadores da comunidade. HTML solto, sem framework e sem build.

Os mockups ficam em `Mockups/`, **fora do repositório**, junto com as referências visuais do jogo. São rascunho de tela: não fazem parte da entrega, não precisam de histórico e não devem ser confundidos com a implementação por quem chegar no projeto depois.

- [ ] Squad, no desktop e em paisagem no mobile
- [ ] Laboratório, replicando a tela do jogador
- [ ] Fluxo do teste de talento guiado
- [ ] Validar com três ou quatro jogadores antes de codar

O maior risco de adoção do produto é o cadastro manual cansar antes de o usuário ver valor. Descobrir isso num mockup custa uma tarde; descobrir depois da implementação custa o projeto.

## Etapa 5 — Motor de domínio, via TDD

TypeScript puro, sem framework e sem interface. Os casos de teste já estão escritos em `AGENTS.md`, na seção "Casos de teste que vêm prontos do GAME-RULES", e cada um é uma medição de campo registrada nas regras.

- [ ] Tipos e a tabela dos 29 drills
- [ ] `brancosDaPosicao` — validar contra ML com 7 brancos e ML+MC com Chute
- [ ] `mediaExercicio` e `classificarDrill`
- [ ] `sigma` e `fatorIdade`
- [ ] `montarCronograma` — validar contra os 8 drills do cronograma de meio-campista
- [ ] `classificarTalento` — validar contra o teste de 31 pontos
- [ ] `ganhoSessao`, `custoEmMaletas` e `projetarAteMeta`
- [x] `mediaDos14`

## Etapa 6 — Aba Squad

Primeira tela real, e a mais simples: três campos por jogador. Também é a que testa o risco de adoção com o menor custo.

- [x] Cadastro, lista ordenada e corte visível no 14º
- [x] Média dos 14, ao vivo, e contagem por posição
- [x] Marcar como vendido, com recálculo e indicação de quem subiu
- [x] Faixas de referência do que aquela média significa na temporada seguinte
- [x] Persistência em `localStorage`, com exportar e importar JSON

## Etapa 7 — Aba Laboratório

- [ ] Cadastro detalhado, com brancos derivados da posição e editáveis
- [ ] Recomendação dos 6 slots, com a média e a distância até o teto de cada drill
- [ ] Teste de talento guiado, com verificação das condições de validade
- [ ] Estimativa de sessões e de maletas, sempre como faixa

## Etapa 8 — Mobile e acabamento

- [ ] Layout paisagem no mobile
- [ ] Acessibilidade básica: contraste, foco visível, navegação por teclado
- [ ] As regras aplicadas visíveis ao usuário, com a origem declarada

## Depois da V1

Fora do escopo por decisão, registrado para não voltar como ideia nova: goleiro no Laboratório, treino em grupo, detecção de talento pelo valor de mercado no leilão, contas de usuário e sincronização, outros idiomas, e qualquer coisa que dependa de dados agregados de muitos usuários. Os motivos estão no `PRD.md` e na seção 10 de `GAME-RULES.md`.
