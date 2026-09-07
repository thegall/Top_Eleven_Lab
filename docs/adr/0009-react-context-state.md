# ADR 0009 — Estado em React Context com `useReducer`, sem biblioteca de estado

- **Status:** aceita
- **Data:** 2026-09-07
- **Decide sobre:** onde o documento do usuário vive em memória e como a interface o altera

## Contexto

O estado da aplicação é **um objeto só**: o documento descrito na
[ADR 0006](0006-single-player-registry.md) — a lista de jogadores, com a ficha de Laboratório
de alguns deles.

Os números que definem o problema:

- **~5 KB** de dado, com um elenco de ~25 jogadores e 3 ou 4 fichas completas.
- Mutações **por clique de formulário**, na ordem de dezenas por sessão de uso.
- **Duas abas** sobre o mesmo documento. Não há rota distante nem árvore profunda.
- Um usuário, um aparelho, um documento. Nenhum estado de servidor para sincronizar, nenhuma
  requisição para cachear.

O `ROADMAP.md:45` deixou de fora desta etapa a arquitetura de componentes, que depende do
formato de saída do motor. Esta ADR decide só a **fronteira**: onde o estado mora e como ele
chega ao armazenamento — não a árvore de componentes.

## Decisão

O documento vive em memória num **Context de React alimentado por `useReducer`**. Sem
Zustand, sem Redux, sem Jotai, sem TanStack Query.

**Entra em vigor na etapa 6**, junto com o Next.js e o React — ver
[ADR 0005](0005-toolchain-and-deferred-nextjs.md). Na etapa 5 não existe React no projeto, e o
motor de domínio é chamado direto pelos testes. Esta ADR é arquitetura-alvo, decidida agora
porque a fronteira entre estado e domínio precisa estar fechada antes de o motor ser escrito.

- **A interface despacha ações**; o reducer produz o documento novo.
- **Gravação write-through, síncrona**, a cada documento novo — ver
  [ADR 0002](0002-local-storage-persistence.md).
- **Resultado de cálculo não entra no estado.** A lista de drills classificados, a média dos
  14 e a projeção são função dos dados de entrada, calculadas na renderização.
- A leitura inicial acontece **depois da montagem**, nunca durante a renderização, porque o
  HTML é gerado no build sem `localStorage` — ver [ADR 0001](0001-static-export-on-vercel.md).

O código fica em `src/state/`, que é a camada de aplicação. Não se chama `application/` para
não disputar o nome com `src/app/`, que é onde o App Router procura as rotas.

## Consequências

**Boas:**

- Zero dependência nova. `useReducer` e `createContext` vêm com o React, que já vem com o
  Next.
- **O reducer é função pura**, testável em Vitest sem montar componente. As migrações e a
  serialização, que são o que protege o dado do usuário, também.
- Um caminho só para alterar o documento: despachar ação. Não há mutação direta espalhada
  pelos componentes.
- **Nenhum resultado derivado guardado** significa nenhuma possibilidade de o número na tela
  discordar do cadastro. Num produto de calculadora, esse é o único bug verdadeiramente caro.

**Custos aceitos:**

- **Toda alteração re-renderiza quem consome o Context.** Com uma lista de ~25 itens e
  mutação por clique, isso é imperceptível. Se um dia não for, o caminho barato é dividir o
  Context em dois (documento e ações), não trocar de biblioteca.
- Recalcular a classificação dos 29 drills a cada renderização é trabalho repetido. Custa
  microssegundos — ver [ADR 0008](0008-synchronous-iterative-projection.md).
- Sem ferramenta de time-travel debugging. Para um app de duas telas, o custo de não ter é
  próximo de zero.

## Alternativas descartadas

- **Zustand ou Jotai.** Existem para resolver re-render de árvore grande e estado compartilhado
  entre rotas distantes. Nenhum dos dois problemas existe aqui. É a dependência que se
  adiciona por hábito, não por medição.
- **Redux Toolkit.** Boilerplate e conceitos (slices, middleware, devtools) para um objeto de
  5 KB com meia dúzia de ações.
- **TanStack Query.** Resolve estado de servidor: cache, revalidação, estado de requisição.
  Não há servidor ([ADR 0001](0001-static-export-on-vercel.md)).
- **`useState` solto nos componentes, sem Context.** Menos código, e o documento é
  compartilhado pelas duas abas: acabaria virando prop drilling ou, pior, dois estados
  paralelos que divergem.
- **Guardar o resultado do cálculo no estado.** Poupa microssegundos e cria a classe de bug
  mais cara possível para este produto: número exibido desatualizado em relação ao cadastro.

## Sinal para revisitar

Re-render **medido** causando lentidão perceptível (primeiro dividir o Context, depois cogitar
biblioteca); ou estado compartilhado entre rotas distantes, que não existe hoje.
