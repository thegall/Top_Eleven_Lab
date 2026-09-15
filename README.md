# Top Eleven Lab

Calculadora de treino e de elenco para o Top Eleven, feita para a comunidade brasileira do jogo.

O Top Eleven esconde as contas que decidem a temporada. Cada exercício tem uma média própria que trava aos 180%, o talento do jogador nunca aparece na tela e muda o rendimento de cada maleta em mais de três vezes, e a liga do ano seguinte é sorteada pela média dos 14 jogadores mais fortes do elenco, não pelos 11 que entram em campo. Hoje isso se resolve com planilha de Excel passada em grupo de Facebook.

## O que o Lab faz

**Aba Squad.** Você cadastra o elenco com nome, overall e posição. O Lab ordena, corta no 14º e mostra a média que o jogo vai usar. Marcar um jogador como vendido recalcula na hora e mostra qual reserva subiu para a lista no lugar dele. Testar cinco cenários de venda leva menos tempo que abrir a planilha.

**Aba Laboratório.** Você replica a tela do jogador, com idade, posições e os 15 atributos. O Lab calcula a média dos 29 exercícios para aquele jogador, classifica cada um em primário, secundário e terciário, e monta os 6 slots da sessão começando pelo que está mais longe do teto. Depois estima quantas sessões e quantas maletas verdes faltam até o overall que você quer.

A conta de maleta é exata. Subir 8 pontos de atributo num jogador de talento máximo custa 2 maletas enquanto o exercício está em 100% de média, e 6 maletas quando ele chega a 160%. É por isso que a comunidade troca de exercício por volta dos 140%, e é o tipo de coisa que o Lab mostra antes de você gastar.

## De onde vêm as regras

A Nordeus não publica fórmula de treino e não responde quando perguntam. O que existe é observação de jogadores veteranos ao longo de muitas temporadas, e este projeto trata esse conhecimento como regra do jogo, porque é o que existe e é o que funciona.

As regras estão em [`docs/GAME-RULES.md`](docs/GAME-RULES.md), levantadas de capturas de tela do jogo, de 15 vídeos da comunidade brasileira, do fórum oficial e de uma planilha que circula em grupo de WhatsApp. Cada regra traz a origem.

Três delas foram conferidas por script antes de virarem documento:

- O algoritmo de cronograma reproduz exatamente os 8 exercícios que um vídeo dita para meio-campista central, a partir dos brancos inferidos dessa mesma lista.
- A combinação de 6 exercícios que a comunidade chama de treino inflado cobre os 15 atributos de linha, sem sobrar nenhum.
- A curva de ganho da planilha, aplicada ao teste de talento gravado em vídeo, devolve o mesmo rank que o método alternativo tinha dado para aquele jogador.

## Estado do projeto

O estado operacional (o que está em andamento, o que bloqueia, o que vem a seguir) vive no [projeto Linear Top Eleven Lab](https://linear.app/thegal/project/top-eleven-lab-f4819f00d0c5). Os documentos neste repositório são contratos, regras e o plano de produto — não um segundo kanban.

As etapas planejadas da V1 estão em [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Stack

TypeScript, Next.js com App Router e export estático, hospedado na Vercel. Sem backend, sem conta de usuário e sem banco de dados: o elenco fica no `localStorage` do navegador, com botão de exportar e importar JSON para trocar de aparelho.

O motor de cálculo é TypeScript puro, isolado de framework. Ele não importa React, não lê `window` e não formata número para exibição, o que permite testá-lo sem navegador e trocar a interface sem tocar em regra de jogo.

## Documentação

| Arquivo | O que tem |
|---|---|
| [`PRD.md`](PRD.md) | Por que o produto existe, para quem, e o que ficou fora da V1 |
| [`docs/GAME-RULES.md`](docs/GAME-RULES.md) | As regras do jogo, com fórmulas, origem e validação |
| [`AGENTS.md`](AGENTS.md) | Referência técnica: fluxos, tipos, schemas e decisões |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Plano de produto: as etapas da V1 (não é o board) |

## Contribuindo

Correção de regra do jogo é a contribuição mais valiosa. Se alguma coisa em `docs/GAME-RULES.md` não bate com o que você vê jogando, abra uma issue dizendo o que observou e em que temporada. O jogo muda mecânica sem aviso, e as regras vivem em documento separado justamente para serem corrigidas quando isso acontecer.

Para código, os testes vêm antes da implementação e os commits seguem o padrão semântico (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`).

## Licença

[MIT](LICENSE).

## Aviso

Projeto independente, sem qualquer vínculo com a Nordeus. Top Eleven é marca registrada da Nordeus d.o.o. O Lab não acessa sua conta, não pede login do jogo e não se conecta a nenhum servidor: tudo o que você digita fica no seu navegador.
