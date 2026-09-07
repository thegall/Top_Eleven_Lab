# ADR 0008 — Projeção iterativa síncrona, sem Web Worker

- **Status:** aceita
- **Data:** 2026-09-07
- **Decide sobre:** como o motor calcula a estimativa de sessões e maletas até a meta

## Contexto

O efeito cascata é a mecânica que separa o produto de uma planilha: subir um atributo empurra
a média de **todo** exercício que o contém, e todo exercício trava aos 180%
(GAME-RULES §3). Por isso a projeção até uma meta de overall **não pode ser multiplicação
linear** — ela precisa recalcular as médias dos 29 drills depois de cada sessão simulada
(`AGENTS.md:55`).

Iteração dentro de uma interface acende o alerta habitual: trava a tela? precisa de worker?
de memoização? A resposta depende do número, e o número existe.

## Decisão

`projetarAteMeta` é uma **função pura, síncrona**, executada no clique, na mesma thread.

```
projetarAteMeta(jogador, overallAlvo) → faixa de sessões e de maletas

  copiar os 15 atributos para um estado de simulação local
  repetir:
    1. calcular a média dos 29 drills sobre o estado atual
    2. classificar e montar os 6 slots (menor média primeiro)   §6
    3. sigma(talento, média) × fatorIdade × nível do treinador  §3.1, §3.2
    4. aplicar o ganho aos atributos do estado de simulação
    5. somar o condicionamento gasto e converter em maletas     §4, §9
    6. converter atributo ganho em overall                      §11 — o elo estimado
  até atingir a meta, ou até nenhum drill viável render mais nada
```

**Sem Web Worker, sem memoização, sem debounce.**

Quatro invariantes que a implementação não pode violar:

1. **A entrada não é mutada.** O estado de simulação é uma cópia local. Sem isso, "simular
   até 100" alteraria o cadastro, e o usuário compara a tela do Lab com o jogo aberto do lado
   (`AGENTS.md:186`).
2. **Existe critério de parada além da meta.** Se todo drill viável travar em 180%, o ganho é
   zero e o laço não converge. A saída nesse caso é `meta inalcançável`, dizendo qual foi a
   barreira — e não um número grande. Isso não é defesa contra cenário improvável: o teto é a
   regra central do jogo.
3. **A faixa vem de um único parâmetro.** A incerteza está inteira na conversão de atributo em
   overall, de 7 a 8 pontos por ponto de overall (GAME-RULES §11). A faixa é a mesma simulação
   rodada nos dois extremos desse divisor. Inventar uma segunda fonte de incerteza seria
   fingir precisão que o modelo não tem.
4. **O corte de 140% não é regra do motor.** O motor usa o teto duro de 180%; o corte de ~140%
   da §6 é aviso de custo na interface. Ver a ambiguidade registrada em `ARCHITECTURE.md` §11.

## O número que sustenta a decisão

Subir um overall de 82 para 100 são 18 pontos de overall, ou ~135 pontos de atributo pelo
divisor da §11. A 6,4 pontos por sessão no começo, caindo com a curva, dá entre 30 e 60
sessões. Cada sessão custa ~200 operações aritméticas — 29 drills de ~3,6 atributos cada,
mais a ordenação de uma dúzia de primários. Com os dois extremos da faixa:

```
60 sessões × 200 operações × 2 = ~24.000 operações aritméticas
```

Isso roda em muito menos de um milissegundo. Web Worker aqui custaria serialização de
mensagem, um caminho assíncrono na camada de estado e um estado de carregamento na interface
— tudo para não bloquear uma thread por menos tempo do que ela leva para renderizar um
quadro.

## Consequências

**Boas:**

- O resultado é uma função pura dos dados de entrada, calculável na renderização e testável
  sem navegador ([ADR 0004](0004-framework-free-domain.md)).
- **O resultado não entra no estado.** Não existe a possibilidade de o número exibido
  discordar do cadastro, que é o único bug verdadeiramente caro num produto cuja proposta é
  acertar a conta.
- Sem código assíncrono não há corrida, cancelamento nem resultado obsoleto chegando fora de
  ordem.

**Custos aceitos:**

- Se um cenário imprevisto fizer o laço percorrer milhares de sessões, a interface trava.
  Mitigado pelo critério de parada por ganho zero, que limita o pior caso.
- Recalcular a cada renderização é trabalho repetido. A um custo de microssegundos, é mais
  barato que a complexidade de invalidar cache — e cache com invalidação errada é justamente
  como um número desatualizado apareceria na tela.

## Alternativas descartadas

- **Web Worker.** Complexidade assíncrona para um cálculo de microssegundos.
- **Fórmula fechada em vez de iteração.** Seria mais rápido, e a curva de ganho depende da
  média do exercício, que muda a cada sessão por causa da cascata, e a escolha do drill muda
  junto. Não há forma fechada: linearizar é exatamente o erro que as planilhas cometem.
- **Memoizar por jogador.** Cache para poupar microssegundos, com risco de servir número
  desatualizado. Troca ruim.

## Sinal para revisitar

Uma projeção **medida** acima de 16 ms — um quadro a 60 Hz. Antes disso, worker e memoização
são complexidade sem causa.
