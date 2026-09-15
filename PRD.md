# PRD — Top Eleven Lab

> O **porquê** do produto. A SPEC diz o que garantir; este documento diz por que vale a pena.
> As regras do jogo que sustentam tudo isso estão em [docs/GAME-RULES.md](docs/GAME-RULES.md).

## Problema

Quem joga Top Eleven toma duas decisões caras por temporada, e as duas exigem contas que ninguém quer fazer à mão.

**1. Em quem gastar maleta verde, e com qual treino.** Maleta é o único recurso de evolução acessível a quem não gasta dinheiro no jogo, e é limitado. A mecânica que decide o rendimento é conhecida pela comunidade e não é intuitiva: cada exercício tem uma média própria, calculada sobre os atributos daquele jogador, e trava aos 180%. O nome do exercício não diz nada — "Técnica de Chute" pode ser péssimo para subir Chute. Escolher certo exige recalcular 29 exercícios a cada sessão, porque subir um atributo empurra para o teto todo exercício que o contém.

Some-se o talento do jogador, que o jogo não mostra em lugar nenhum: entre o melhor e o pior rank, o retorno de cada maleta varia **mais de três vezes**. E a idade multiplica isso de novo — aos 26 anos um jogador rende dois terços do que renderia aos 20, e aos 30 pouco mais de um terço. Quem não sabe que essas duas variáveis existem distribui maleta pelo elenco inteiro e perde a temporada.

**2. Quem vender antes da virada de temporada.** O jogo emparelha o time da temporada seguinte pela média dos **14 jogadores mais fortes** do elenco. Média alta significa enfrentar quem paga — partida perdida antes de começar. Baixar essa média é uma decisão de elenco inteiro: vender medianos e manter reservas fracos ocupando as últimas vagas dos 14. Cada venda reordena a lista e faz outro jogador entrar na conta, então o efeito nunca é o óbvio. Testar um cenário em planilha é chato; testar cinco, ninguém faz.

**Como se resolve hoje:** planilhas de Excel passadas em grupos de Facebook e links do Mega, vídeos longos no YouTube explicando como usá-las, e pergunta em grupo de WhatsApp. As planilhas funcionam e são a prova de que a demanda existe — mas exigem redigitar os 15 atributos a cada atualização, rodam em Excel enquanto o jogo é mobile, e resolvem um dos dois problemas de cada vez.

## Público

- **Usuário primário:** jogador de Top Eleven que não gasta dinheiro (ou gasta pouco) e por isso precisa otimizar recurso escasso. Conhece o jogo, não necessariamente a mecânica por trás dele.
- **Comunidade-alvo inicial:** grupos brasileiros de Top Eleven — na casa de mil pessoas, parte ativa. Público pequeno e específico; o produto é feito para ele, não para escala.
- **Comprador/decisor:** não existe. Produto gratuito e open source.

## Proposta de valor

As duas decisões são a mesma estratégia vista de dois lados. Treinar só atributos brancos (o "mutante" da comunidade) deixa o jogador forte em campo e com overall baixo — e overall baixo é exatamente o que derruba a média dos 14. O Lab é uma ferramenta só porque o problema é um só.

Faz no navegador, com o elenco já cadastrado, as duas contas que hoje exigem planilha de Excel e paciência: **qual exercício rende mais neste jogador agora**, e **qual será a média dos 14 se eu vender estes jogadores**.

Contra a alternativa atual, três diferenças concretas:

- **O estado fica salvo.** A planilha exige redigitar os 15 atributos a cada rodada de treino; o Lab guarda o jogador e recalcula sozinho.
- **Resolve os dois problemas no mesmo lugar.** As planilhas atacam treino ou elenco, nunca os dois.
- **Funciona onde o jogo está.** Top Eleven é mobile; Excel não é.

## Métricas de sucesso

- Usuário cadastra o elenco inteiro sem abandonar no meio — o cadastro do Squad tem 4 campos por jogador exatamente por isso.
- Usuário testa mais de um cenário de venda na mesma sessão. Uma simulação só significa calculadora; várias significam ferramenta de decisão.
- Usuário volta na virada de temporada. O uso é sazonal por natureza — retorno diário não é meta, e perseguir isso distorce o produto.
- Alguém compartilha print do simulador no grupo da comunidade sem ter sido pedido.

## Escopo do produto (não do código)

### Dentro da V1

**Aba Squad — simulador da média dos 14**

- Cadastro rápido: nome, idade, overall, posição.
- Lista ordenável por overall, nome ou posição, com corte visível no 14º jogador quando ordenada por overall.
- Média dos 14 mais fortes, atualizada ao vivo, e contagem de jogadores por posição.
- Marcar jogador como **vendido** e ver a média recalcular, mostrando qual reserva sobe para a lista dos 14 no lugar dele.
- Faixas de referência do que aquela média significa na temporada seguinte.

**Aba Laboratório — simulador de treino**

- Cadastro detalhado espelhando a tela do jogo: idade, posição, habilidade especial e os 15 atributos. Os brancos vêm **derivados da posição** e ficam editáveis — o usuário confere em vez de digitar.
- **Recomendação de exercício:** os 29 drills classificados em primário, secundário e terciário para aquele jogador, com a média de cada um e a distância até o teto de 180%. Esta é a entrega central, e é cálculo exato.
- **Teste de talento guiado:** o app pede os pontos da barra (1, 2 ou 3) em 6 sessões de habilidade especial ou posição nova, classifica pela sequência (método 1) e explica o que aquilo significa. A V1 **não** oferece o teste por ganho de pontos (método 2).
- **Estimativa de sessões e de maletas até a meta de overall**, apresentada como faixa. O custo em maletas é cálculo fechado; a conversão final para overall é o único trecho estimado (ver riscos).
- **Virada de temporada:** ação confirmada para retirar 20 pontos de cada atributo, com piso em zero.
- Dimensionado para 3–4 jogadores por temporada, que é quanto de maleta verde existe na prática.

**Transversal**

- Interface em português do Brasil.
- As regras aplicadas ficam visíveis ao usuário, com a origem declarada — o app ensina a mecânica enquanto calcula.

### Fora da V1

- Goleiro no Laboratório (continua normalmente no Squad).
- Treino em grupo por zona, entrosamento, Primor e livros táticos.
- Classes/Tiers e Gems, Player Academy como sistema de treino, Youth Academy, estilos de jogo.
- Conversão da estimativa em dias de temporada.
- Detecção de talento pelo valor de mercado no leilão — método conhecido e documentado, mas depende de dados que a V1 não guarda.
- Contas de usuário e sincronização entre dispositivos.
- Outros idiomas.
- Qualquer funcionalidade que dependa de dados agregados de muitos usuários.

## Riscos e premissas

**Premissa central:** a mecânica documentada em `docs/GAME-RULES.md` — média por exercício com teto em 180%, brancos crescendo ao dobro da velocidade dos cinzas, média do time pelos 14 mais fortes, e a curva de ganho por talento, média e idade — reflete o jogo atual. A Nordeus não publica fórmula nenhuma e não se pronuncia; o que existe é observação sistemática da comunidade, e é sobre ela que o produto é construído.

A parte quantitativa vem da planilha `evolucao_facil.xlsx`, que circula na comunidade e cujos números conferem em três pontos independentes: as dificuldades dos drills lidas das capturas de tela do jogo, o exemplo de brancos do fórum oficial, e o resultado de um teste de talento gravado em vídeo. **Risco associado:** a planilha traz duas gerações do modelo que divergem em até 30%. O Lab adota a mais recente, e o documento registra a escolha para quando alguém questionar.

**O que está resolvido e o que não está.** A escolha de exercício é determinística: dado o jogador e seus brancos, o melhor drill é calculável, sem estimativa. A **curva de ganho** — quanto se ganha em função de talento, média do exercício, idade e nível do treinador — também está resolvida, e com ela o custo em maletas. Sobra **um** elo estimado: a conversão de pontos de atributo em pontos de overall, apoiada hoje em duas observações de campo. O Lab acerta o "qual treino fazer" e o "quanto vai custar", e aproxima o "quantas sessões até o overall X".

**Mitigação, e uma oportunidade:** o teste de talento produz exatamente o dado que falta — pontos ganhos, média do exercício, idade, overall antes e depois. Guardando cada teste que o usuário rodar, a estimativa melhora com o uso sem pedir nada a mais de ninguém.

**Risco de adoção:** o cadastro manual é a única barreira real. Não há API do jogo nem forma de importar elenco. Se o cadastro cansar, o produto morre antes de mostrar valor. Daí Squad com 4 campos e Laboratório limitado a poucos jogadores.

**Risco de mercado:** público de ordem de mil pessoas, que já tem planilhas funcionando. O Lab precisa ser claramente melhor que um Excel, não apenas equivalente na web.

**Risco de nerf silencioso:** a Nordeus já ajustou mecânicas de treino sem aviso. As regras vivem em documento próprio justamente para serem revisáveis quando o jogo mudar.

## Notas de projeto

- **Open source.** O código é vitrine pública, o que eleva a régua de qualidade e torna a documentação parte da entrega.
- **Arquitetura e persistência ficam em aberto** neste documento por decisão deliberada — são discussão de system design, não de produto.
