# ADR 0003 — Um codebase, layout paisagem no mobile, sem app nativo

- **Status:** aceita
- **Data:** 2026-09-07
- **Decide sobre:** em quantas bases de código o produto vive e como ele se apresenta no celular

## Contexto

O Top Eleven é um jogo mobile, jogado **em paisagem**. O usuário abre o Lab com o jogo aberto
do lado, ou alternando entre os dois, e compara número com número.

A tela do Laboratório espelha a tela do jogador no jogo: 15 atributos em blocos. Isso não
cabe em retrato num celular sem virar rolagem infinita, e rolagem é exatamente o que faz o
cadastro cansar — que é o maior risco de adoção do produto (`PRD.md:89`).

Do outro lado, o Lab não usa câmera, notificação, GPS, biometria nem nada que só exista
nativamente. E o time é de uma pessoa.

## Decisão

**Um codebase**, servindo desktop e mobile pelo mesmo build, com o layout do mobile desenhado
em **paisagem** para acompanhar o jogo.

**Sem app nativo** e sem React Native. Sem base de código separada por plataforma.

## Consequências

**Boas:**

- Uma implementação, um conjunto de testes, um deploy. Com uma pessoa, é a diferença entre o
  projeto andar e não andar.
- Distribuição por link, que é como a comunidade compartilha coisa (grupo de WhatsApp e de
  Facebook). Sem loja, sem revisão de app, sem versão travada no aparelho de ninguém.
- Correção de regra do jogo chega a todo mundo no próximo carregamento. Importa porque a
  Nordeus muda mecânica sem avisar.

**Custos aceitos:**

- **Paisagem no mobile é decisão de UX contra a corrente.** A maioria dos sites assume
  retrato, e o usuário precisa girar o aparelho. Aceito porque ele já está com o celular
  virado para jogar.
- Layout precisa funcionar em duas orientações bem diferentes, o que é mais trabalho de CSS
  que um app só de retrato. Concentrado na etapa 8 do roadmap.
- Sem ícone na tela inicial e sem uso offline por padrão. Se isso incomodar, o caminho barato
  é um manifest de PWA — não um app nativo.

## Alternativas descartadas

- **App nativo, ou React Native.** Loja, assinatura de desenvolvedor (custo recorrente, e o
  orçamento é zero), build por plataforma e ciclo de revisão. Tudo isso para acessar zero
  recurso de hardware. Custo puro.
- **Codebase separado para mobile e desktop.** Duplica a manutenção do que é a mesma
  calculadora, com uma pessoa para manter as duas.
- **Só desktop.** Contradiz o produto: a diferença central contra a planilha de Excel é
  "funciona onde o jogo está" (`PRD.md:34`).

## Sinal para revisitar

Necessidade real de recurso de hardware (nenhuma prevista); pedido recorrente de uso offline
(resolve-se com PWA antes de cogitar nativo).
