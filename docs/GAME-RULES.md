# Regras do Jogo — Top Eleven Lab

> Destilado de capturas de tela do jogo, de 15 vídeos da comunidade brasileira, do fórum oficial e da planilha `evolucao_facil.xlsx`, filtrado pelo escopo da V1 definida no [PRD](../PRD.md). As fontes originais não são versionadas; ver "Fontes", no fim do documento.
>
> Este documento é a **fonte única** das regras do jogo no projeto. O Top Eleven muda mecânicas sem aviso; quando isso acontecer, corrige-se aqui e o código segue.

## Como ler este documento

A Nordeus nunca publicou as fórmulas de treino e não se pronuncia sobre elas. O que existe de confiável é a observação sistemática de jogadores veteranos ao longo de muitas temporadas. **Este produto trata esse conhecimento como regra do jogo**, porque na prática é o que existe e é o que funciona.

A marca de origem continua em cada regra, mas serve para manutenção, não como hierarquia de confiança:

- **[OFICIAL]** — documentado pela Nordeus (Help Center, fórum oficial).
- **[COMUNIDADE]** — observado e validado repetidamente pela comunidade. Tratado como regra.
- **[PENDENTE]** — ainda não verificado por ninguém. Não vira código antes de ser resolvido.

Quando o jogo mudar, a marca diz onde procurar: uma regra [COMUNIDADE] que parar de bater precisa de nova observação, não de consulta a uma documentação que não existe.

Nota de terminologia: a comunidade brasileira chama o overall de **GLR** (também escrito GRL). Neste documento e no produto, usa-se **overall**.

---

## 1. Posições

Onze posições, na grade da tela de posições do jogo:

```
              ST
      AML     AMC     AMR
      ML      MC      MR
              DMC
      DL      DC      DR
              GK
```

| Sigla | Nome | Grupo |
|---|---|---|
| GK | Goleiro | Goleiro |
| DL / DR | Lateral esquerdo / direito | Defesa |
| DC | Zagueiro central | Defesa |
| DMC | Volante | Meio-campo |
| ML / MR | Meia pela ponta esquerda / direita | Meio-campo |
| MC | Meio-campista central | Meio-campo |
| AML / AMR | Ponta-atacante esquerda / direita | Ataque |
| AMC | Meia-atacante central | Ataque |
| ST | Atacante | Ataque |

**[OFICIAL]** Um jogador pode aprender até **3 posições**. Cada posição nova custa **50 pontos de habilidade**.

**[COMUNIDADE]** Posições múltiplas somam brancos: os atributos brancos de um jogador são a **união** dos brancos de todas as posições que ele domina. Exemplo do fórum oficial: um ML tem 7 brancos; ao aprender MC, Chute deixa de ser cinza e passa a branco. Consequência direta: **ST+AMR tem brancos diferentes de AMR+MR** — não dá para derivar a lista de brancos só da posição principal.

**[COMUNIDADE]** Mais brancos não é automaticamente melhor. Com muitos brancos o ganho se dilui entre eles; com alguns cinzas, o ganho se concentra nos poucos brancos. Quem quer um especialista com um atributo muito alto pode ser prejudicado por aprender posição nova.

---

## 2. Atributos do jogador

**[OFICIAL]** A tela do jogador mostra **15 atributos em 3 blocos**. Cada bloco tem sua própria média, exibida no cabeçalho.

| Bloco DEFESA | Bloco ATAQUE | Bloco ATRIBUTOS |
|---|---|---|
| Corte | Passe | Condicionamento |
| Marcação | Drible | Força |
| Posicionamento | Cruzamento | Agressividade |
| Cabeçada | Chute | Velocidade |
| Coragem | Finalização | Criatividade |

> Os 3 blocos são a tela **do jogador**. A tela **de treino** usa 4 categorias diferentes (seção 4). São grades distintas e não devem ser confundidas no código.

### Brancos vs cinzas

**[OFICIAL]** Cada posição tem um subconjunto de atributos que conta para a atuação em campo — os **brancos** (o jogo também os chama de "atributos-chave"). Os demais são **cinzas**: entram na conta do overall, mas têm pouco ou nenhum efeito prático.

Na tela do jogo, o branco aparece destacado (barra colorida ao lado do nome, valor em negrito).

**[COMUNIDADE]** **Cinza cresce na metade da velocidade do branco.**

### Tabela de brancos por posição

**[COMUNIDADE]** A planilha `evolucao_facil.xlsx` traz a matriz completa de posição × atributo. Ela resolve o que este documento tratava como indefinido:

| Posição | Atributos brancos | N |
|---|---|---|
| DL / DR | Corte, Marcação, Posicionamento, Coragem, Cruzamento, Condicionamento, Agressividade, Velocidade | 8 |
| DC | Corte, Marcação, Posicionamento, Cabeçada, Coragem, Condicionamento, Força, Agressividade | 8 |
| DMC | Corte, Marcação, Posicionamento, Cabeçada, Coragem, Passe, Condicionamento, Força, Agressividade, Criatividade | 10 |
| ML / MR | Posicionamento, Passe, Drible, Cruzamento, Condicionamento, Velocidade, Criatividade | 7 |
| MC | Corte, Marcação, Posicionamento, Coragem, Passe, Drible, Chute, Condicionamento, Velocidade, Criatividade | 10 |
| AML / AMR | Passe, Drible, Cruzamento, Chute, Finalização, Condicionamento, Velocidade, Criatividade | 8 |
| AMC | Cabeçada, Passe, Drible, Chute, Finalização, Condicionamento, Velocidade, Criatividade | 8 |
| ST | Posicionamento, Cabeçada, Passe, Drible, Chute, Finalização, Força, Velocidade, Criatividade | 9 |

Notas de leitura:

- **ST é a única posição de linha sem Condicionamento branco.** Não é erro de transcrição — é o que a matriz traz, e explica por que drills de Condicionamento raramente entram em cronograma de atacante.
- As variantes DCL/DCR, MCL/MCR e STL/STR têm exatamente os mesmos brancos de DC, MC e ST.
- O **goleiro fica de fora**: a matriz é montada sobre os 15 atributos de linha e não descreve os 10 atributos exclusivos de GK.

**Duas validações independentes.** ML sai com 7 brancos e sem Chute; MC tem Chute — que é precisamente o exemplo do fórum oficial citado na seção 1 ("um ML tem 7 brancos; ao aprender MC, Chute deixa de ser cinza"). E o ST da matriz reproduz item por item a lista de brancos do exemplo real da seção 4, extraída de captura de tela do jogo.

**Combinações de posições confirmam a regra da união.** A planilha lista 41 combinações (DC+DL, MC+AMC+ST, DL+ML+AML…), e cada uma é a união exata dos brancos individuais. Não há bônus nem penalidade de combinação — o Lab pode calcular a união em vez de guardar as 41 linhas.

**Decisão de produto (revisada):** o Lab **deriva** os brancos da posição e das posições adicionais, mas **deixa o campo editável**. A derivação elimina o trabalho de marcação em 15 checkboxes; a edição mantém a saída correta quando a Nordeus mexer na tabela sem avisar, e cobre o goleiro, que a matriz não descreve.

### Atributos de goleiro

**[OFICIAL]** O goleiro tem **15 atributos em 2 blocos**, não 3:

| Bloco DEFESA DO GOL (10) | Bloco ATRIBUTOS (5) |
|---|---|
| Reflexos, Agilidade, Antecipação, Sair na bola, Comunicação | Condicionamento |
| Arremesso, Chutar, Espalmar, Jogo aéreo, Concentração | Força, Agressividade, Velocidade, Criatividade |

Os 5 do bloco ATRIBUTOS são os mesmos do jogador de linha. Os 10 do bloco DEFESA DO GOL são exclusivos do goleiro e, por isso, **não entram no cálculo da média de exercício de um jogador de linha**.

Cuidado com dois pares de nomes parecidos:

- **Desarmar** (tela de treino) = **Corte** (tela do jogador). Mesmo atributo, tradução diferente entre telas.
- **Chutar** (goleiro, tiro de meta) != **Chute** (jogador de linha). Atributos distintos.

---

## 3. A regra central: média do exercício e o teto de 180%

Esta é a mecânica que torna o Laboratório determinístico em vez de heurístico.

### Como funciona

**[COMUNIDADE]** Cada exercício tem uma **média**, calculada sobre os atributos **do jogador** que aquele exercício treina:

```
média_do_exercício = soma dos valores dos atributos válidos ÷ quantidade de atributos válidos
```

**Atributo válido** = atributo que existe na tela daquele jogador. Para jogador de linha, os atributos de goleiro que o drill oferece **não entram na conta** — nem no numerador, nem no denominador.

### O teto

**[COMUNIDADE]** **O limite é 180%.** Quanto mais perto a média do exercício chega de 180, menos aquele exercício rende. **Ao atingir 180, o exercício trava** — para de dar atributo. Para continuar evoluindo, é preciso trocar para outro exercício cuja média ainda esteja longe do teto.

Faixas de custo observadas:

| Média do exercício | Comportamento |
|---|---|
| até ~140% | Ganho eficiente, gasto de maleta razoável |
| 140% – 180% | Gasto de maleta **bem maior** por ponto ganho |
| 180% | Travado — não dá mais atributo |

**[COMUNIDADE]** Recomendação prática: quem tem poucos recursos deve parar por volta de **140%** e migrar para outro exercício. Só quem tem muita maleta leva um atributo até os 180%.

### Efeito cascata

**[COMUNIDADE]** Ao subir um atributo, a média de **todos** os exercícios que contêm aquele atributo sobe junto. Treinar Chute empurra para o teto todos os drills que treinam Chute. O planejamento precisa considerar isso: não existe evoluir um atributo isoladamente.

### Por que isso substitui a teoria antiga

Material antigo de comunidade (2017) descrevia um "teto de distância entre categorias" de ~20 pontos. A regra dos 180% por exercício explica o mesmo fenômeno observado — treino específico trava, trocar de exercício destrava — de forma calculável, e é o que a comunidade brasileira usa hoje. **A regra dos 180% é a que o Lab implementa.**

---

## 3.1. A curva de ganho

**[COMUNIDADE]** Esta é a função que transforma o Laboratório de estimador em calculadora. Fonte: aba `TabelasAux` da planilha `evolucao_facil.xlsx`, tabela "EVOLUÇÃO — Revisão 2".

### A unidade: sigma

```
sigma = pontos de atributo ganhos por 1% de condicionamento gasto
```

O condicionamento é a moeda real do treino — cada slot de cada drill consome uma quantidade fixa dele (seção 4), e maleta verde é só a forma de repor condicionamento (seção 9). Medir o ganho por condicionamento gasto, e não por sessão, torna a conta independente de qual drill foi usado.

```
ganho_da_sessão = condicionamento_gasto × sigma(talento, média_do_exercício) × fator_idade
```

### A tabela

Linhas = rank de talento. Colunas = **média do exercício**. Valores assumem **treino classe mundial**.

| Talento | Padrão | 20% | 40% | 60% | 80% | 100% | 120% | 140% | 160% | 180% |
|---|---|---|---|---|---|---|---|---|---|---|
| Fenômeno | `2222223` | 0,600 | 0,600 | 0,550 | 0,525 | 0,425 | 0,325 | 0,200 | 0,100 | — |
| Excelente | `1222222` | 0,390 | 0,390 | 0,358 | 0,341 | 0,276 | 0,211 | 0,130 | 0,065 | — |
| Ótima | `122212221` | 0,321 | 0,321 | 0,294 | 0,281 | 0,228 | 0,174 | 0,107 | 0,054 | — |
| Boa | `122122122` | 0,298 | 0,298 | 0,273 | 0,261 | 0,211 | 0,162 | 0,099 | 0,050 | — |
| Normal | `1212121` | 0,275 | 0,275 | 0,252 | 0,241 | 0,195 | 0,149 | 0,092 | 0,046 | — |
| Ruim | `1112112` | 0,229 | 0,229 | 0,210 | 0,201 | 0,163 | 0,124 | 0,076 | 0,038 | — |
| Terrível | `1111111` | 0,184 | 0,184 | 0,168 | 0,161 | 0,130 | 0,099 | 0,061 | 0,031 | — |

A coluna de 180% fica vazia de propósito: **aos 180% o exercício trava e o ganho é zero** (seção 3). A planilha original repete ali o valor de 160%, o que é erro dela — não modela a trava. Este documento corrige.

### O modelo é separável

Normalizando cada coluna pelo Fenômeno, a razão entre talentos é idêntica nas nove colunas. Ou seja, talento e média do exercício são fatores independentes, e a tabela pode ser guardada como dois vetores em vez de uma matriz:

**Fator de talento** (sigma na média de 100%):

| Fenômeno | Excelente | Ótima | Boa | Normal | Ruim | Terrível |
|---|---|---|---|---|---|---|
| 0,425 | 0,276 | 0,228 | 0,211 | 0,195 | 0,163 | 0,130 |

**Curva de média** (multiplicador, base 100% = 1,00):

| 20% | 40% | 60% | 80% | 100% | 120% | 140% | 160% | 180% |
|---|---|---|---|---|---|---|---|---|
| 1,41 | 1,41 | 1,29 | 1,24 | 1,00 | 0,76 | 0,47 | 0,24 | 0,00 |

Interpolar linearmente entre colunas. A curva é o que o produto precisa comunicar: **treinar de 20% a 100% rende cerca de três vezes mais por maleta do que treinar de 100% a 160%**.

### Nível do treinador

**[OFICIAL]** A tabela acima já assume treino de classe mundial. Para os outros níveis, multiplicar:

| Nível | Bônus | Multiplicador sobre a tabela |
|---|---|---|
| Amador | +0% | 0,769 |
| Semiprofissional | +10% | 0,846 |
| Profissional | +20% | 0,923 |
| Classe Mundial | +30% | 1,000 |

### Conciliação com os ranks da seção 5

A planilha usa sete ranks; o teste por habilidade especial descrito na seção 5 usa cinco rótulos, e os nomes não coincidem com os padrões. **A conciliação é feita pelo padrão de pontos por sessão, nunca pelo nome:**

| Padrão observado | Média de pontos/sessão | Rank da curva |
|---|---|---|
| chega a 3 | 2,14 | Fenômeno |
| `2 2 2 2 2` | 2,00 | Excelente |
| `1 2 2 2 2` | 1,80 | Ótima |
| `1 2 2 1 2 2` | 1,67 | Boa |
| `1 2 1 2 1 2` | 1,43 | Normal |
| predominantemente 1 | 1,00–1,29 | Ruim / Terrível **[PENDENTE]** |

**[PENDENTE]** O método 1 não separa Ruim de Terrível — os dois aparecem como "quase só 1" na barra. A curva da seção 3.1 os trata como valores distintos (0,163 contra 0,130 a 100%). Enquanto não houver corte definido, o produto oferece só o **método 2** para quem cair nessa faixa, porque ele devolve um sigma medido em vez de um padrão visual.

---

## 3.2. Efeito da idade

**[COMUNIDADE]** Multiplicador aplicado sobre o sigma da seção 3.1. Fonte: aba `constantes` da mesma planilha.

- **Até 21 anos: 1,00** — janela plena, sem penalidade.
- **Acima de 21:** decaimento linear, com piso em **0,05 aos 35**.

```
fatorIdade(idade) = idade <= 21 ? 1,00 : máx(0,05 ; 1,00 − 0,0679 × (idade − 21))
```

Atenção ao `− 21`: a contagem parte dos 21 anos, o último da janela plena, e não dos 22. Contando a partir de 22 o resultado aos 35 dá 0,117, e a tabela abaixo diz 0,050. Confira sempre pelas duas pontas — aos 22 a fórmula tem que dar 0,932, e aos 35, 0,050.

| Idade | 18–21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 |
|---|---|---|---|---|---|---|---|---|
| Fator | 1,000 | 0,932 | 0,864 | 0,796 | 0,729 | 0,661 | 0,593 | 0,525 |

| Idade | 29 | 30 | 31 | 32 | 33 | 34 | 35 |
|---|---|---|---|---|---|---|---|
| Fator | 0,457 | 0,389 | 0,321 | 0,254 | 0,186 | 0,118 | 0,050 |

Nota do autor da planilha, na célula que fixa o piso: *"5% significa 20x mais treinos pro mesmo +1"*.

O modelo combinado é explícito e foi validado pelo próprio autor: um jogador `122212221` (Ótima) de 22 anos rende 14% mais que um `12121212` (Normal) de 20 anos — `0,932 × Ótima` contra `1,000 × Normal`. **Talento compensa idade dentro de uma faixa estreita; a partir dos ~26 anos nenhum talento compensa.**

A planilha traz duas curvas alternativas — uma com piso 0 aos 35 e outra com bônus de juventude (1,15 / 1,10 / 1,05 aos 18 / 19 / 20). O exemplo trabalhado do próprio autor usa a curva adotada acima; as outras ficam registradas como variantes não escolhidas.

---

## 4. Drills de treino

**[OFICIAL]** A tela de treino divide os drills em **4 categorias**. Cada drill treina um conjunto fixo de atributos e tem uma dificuldade.

**[COMUNIDADE]** Uma sessão de treino tem **6 slots**. O padrão da comunidade é preencher todos os 6 para evoluir mais rápido, e é sobre a **sessão completa de 6 slots** que os cálculos deste documento são feitos.

**[COMUNIDADE]** O nome do drill não significa nada. "Técnica de Chute" não é necessariamente o melhor drill para subir Chute. **O que importa são os atributos que ele oferece e a média atual desses atributos no jogador.**

Dificuldades, em ordem: Muito Fácil, Fácil, Médio, Difícil, Muito Difícil.

### Dificuldade = custo de condicionamento

**[COMUNIDADE]** A dificuldade não é rótulo decorativo: ela **é** o custo de condicionamento do drill, em cinco degraus exatos de 0,75%.

| Dificuldade | Desgaste por slot | Sessão de 6 slots do mesmo drill |
|---|---|---|
| Muito Fácil | 0,75% | 4,5% |
| Fácil | 1,50% | 9,0% |
| Médio | 2,25% | 13,5% |
| Difícil | 3,00% | 18,0% |
| Muito Difícil | 3,75% | 22,5% |

```
desgaste_por_slot = nível_de_dificuldade × 0,75%
```

Como o ganho é proporcional ao condicionamento gasto (seção 3.1), **drill difícil não é pior — é mais caro e rende proporcionalmente mais**. A dificuldade não entra na escolha do drill; só a média do exercício entra. O que a dificuldade determina é quantas maletas a sessão vai custar.

Origem e conferência: a planilha `evolucao_facil.xlsx` traz o desgaste medido de 24 drills, e a lista completa dos **29 drills atuais**, com dificuldade e percentual, foi conferida contra o jogo. A fórmula acima reproduz os 29 sem exceção.

A planilha diverge em dois pontos, e nos dois ela é que está errada: dá Drible de Slalom como 2,25% (o jogo dá Difícil, 3%) e lista um "Treino de habilidade" que não existe mais. É material de uma versão anterior do jogo — usar para a curva de ganho, não para a lista de drills.

### Ataque

| Drill | Atributos treinados | Dificuldade |
|---|---|---|
| Marcar Homem a Homem | Drible, Corte, Sair na bola°, Antecipação°, Finalização | Fácil |
| Passe, Vá e Dispare! | Velocidade, Antecipação°, Passe, Chute | Fácil |
| Jogada Ensaiada | Sair na bola°, Cruzamento, Cabeçada, Chute, Marcação | Médio |
| Técnica de Chute | Agilidade°, Reflexos°, Força, Finalização, Chute | Médio |
| Drible de Slalom | Velocidade, Drible, Passe, Condicionamento | Difícil |
| Jogo na Ponta | Espalmar°, Cruzamento, Cabeçada, Finalização, Chute | Difícil |
| Contra-Ataque Rápido | Criatividade, Cruzamento, Comunicação°, Passe, Finalização | Muito Difícil |

### Defesa

| Drill | Atributos treinados | Dificuldade |
|---|---|---|
| Análise do Vídeo | Posicionamento, Coragem, Comunicação°, Criatividade | Muito Fácil |
| Cabeceada | Posicionamento, Passe, Cabeçada, Criatividade | Fácil |
| Uma Linha de Defesa | Concentração°, Posicionamento, Comunicação°, Marcação | Médio |
| Parar o Atacante | Coragem, Corte, Força, Drible, Marcação | Médio |
| Cruzamento de Defesa | Coragem, Cruzamento, Jogo aéreo°, Cabeçada, Marcação | Médio |
| Pressione o Play | Coragem, Posicionamento, Corte, Agressividade, Marcação | Difícil |
| Treino de Goleiro | Agilidade°, Reflexos°, Jogo aéreo°, Chutar°, Arremesso° | Difícil |

### Posse de Bola

| Drill | Atributos treinados | Dificuldade |
|---|---|---|
| Controle da Bola | Concentração°, Drible, Cabeçada, Criatividade | Muito Fácil |
| Jogo de Bobinho | Posicionamento, Corte, Condicionamento, Passe, Agressividade | Fácil |
| Matada de Bola | Arremesso°, Drible, Passe, Condicionamento | Fácil |
| Virada de Jogo | Velocidade, Comunicação°, Criatividade, Posicionamento, Cruzamento, Passe | Médio |
| Posicionamento | Posicionamento, Jogo aéreo°, Velocidade, Condicionamento | Médio |
| Entradas | Coragem, Agressividade, Força, Drible, Marcação | Médio |
| Passes para o Chute | Criatividade, Posicionamento, Antecipação°, Passe, Finalização | Difícil |

### Físico e Mental

| Drill | Atributos treinados | Dificuldade |
|---|---|---|
| Aquecimento | Reflexos°, Agressividade, Cabeçada, Condicionamento | Muito Fácil |
| Alongamento | Agilidade°, Força, Velocidade, Condicionamento | Fácil |
| Carioca com Escadas | Concentração°, Agilidade°, Velocidade, Agressividade | Fácil |
| Corrida Longa | Condicionamento, Concentração°, Velocidade | Médio |
| Corrida de Ir e Vir | Agilidade°, Velocidade, Força, Coragem | Difícil |
| Corrida de Obstáculo | Velocidade, Coragem, Agressividade, Chute | Difícil |
| Academia | Arremesso°, Força, Chutar°, Condicionamento | Muito Difícil |
| Arrancada | Velocidade, Drible, Sair na bola°, Condicionamento | Muito Difícil |

° = atributo de goleiro. Para jogador de linha, **não entra no cálculo da média** do exercício.

### Classificação: primário, secundário, terciário

**[COMUNIDADE]** A classificação depende da proporção entre brancos e cinzas que o drill oferece **para aquele jogador específico** — muda conforme as posições que ele domina.

| Classe | Definição | Efeito |
|---|---|---|
| **Primário** (verde) | Todos os atributos válidos são brancos | Ganho proporcional em todos: ganhou 10 de Chute, ganhou 10 de Velocidade e 10 de Finalização |
| **Secundário** (amarelo) | Maioria branca, com cinzas | A cada N brancos ganhos, ganha 1 cinza (ex.: 3:1, 2:1) |
| **Terciário** (vermelho) | Proporção ruim ou invertida | Ex.: Pressione o Play para um jogador com 1 branco entre 5 atributos — 1 branco para cada 4 cinzas |

**Estratégia recomendada:** usar primeiro os **primários** até a média chegar em ~120–140%, depois migrar para secundários, e só então terciários.

Exemplo real (ST com brancos Passe, Chute, Velocidade, Finalização, Drible, Posicionamento, Cabeçada, Força, Criatividade): "Passe, Vá e Dispare" é primário — Antecipação é de goleiro e não conta, sobrando Velocidade, Passe e Chute, todos brancos.

---

## 5. Talento do jogador

Variável mais importante do Laboratório, e que o jogo **não mostra em lugar nenhum**. Existem dois métodos de medir, e o segundo é o que o Lab implementa.

### Método 1 — teste de habilidade especial ou posição nova

**[COMUNIDADE]** Durante o treino de uma habilidade especial ou posição nova (as que custam 40–50 pontos), a barra avança em casas e o jogador ganha 1, 2 ou 3 pontos por sessão. O padrão da sequência classifica o jogador:

| Rank | Rótulo exibido | Sequência observada |
|---|---|---|
| S | Fenômeno | Ganha 2 e em algum momento chega a 3 |
| A | Excelente | `2 2 2 2 2` — começa em 2 e nunca cai |
| B | Ótimo | `1 2 2 2 2` — cai para 1 só na primeira |
| C | Bom | `1 2 2 1 2 2` — alterna |
| F | Fraco | Predominantemente 1 |

**Custo do método:** consome o treino de uma habilidade especial ou posição, que não pode ser trocada depois de iniciada. Por isso existe o método 2.

### Método 2 — teste por ganho de atributos (o que o Lab usa)

**[COMUNIDADE]** Mede a mesma coisa sem gastar habilidade especial. Procedimento:

1. Escolher um drill em que **todos** os atributos válidos sejam brancos do jogador (primário).
2. Conferir que a **média desse exercício está abaixo de 80%** — acima disso o teto começa a interferir e o teste dá falso negativo.
3. Usar treino de **classe mundial** (barra de treinamento cheia, +30% de efeito) para padronizar.
4. Rodar **5 sessões** completas de 6 slots.
5. Somar todos os pontos de atributo ganhos nas 5 sessões.

**Como classificar.** Os cortes que circulam na comunidade — 33 para cima é rank alto, 28 para baixo é rank baixo — **não são universais**. Eles valem apenas para a configuração exata do vídeo em que foram medidos: 6 slots de Pressione o Play (Difícil, 18% de condicionamento por sessão), média do exercício em torno de 55%. Trocar o drill muda o desgaste e move os cortes junto.

A forma correta e geral é converter a soma em sigma e ler a tabela da seção 3.1:

```
sigma_medido = soma_das_5_sessões ÷ (5 × 6 × desgaste_por_slot_em_%)
```

Depois basta olhar a coluna da média do exercício e ver em que linha de talento o valor cai.

| Soma em 5 sessões | Rank | Equivale a |
|---|---|---|
| 33 ou mais | Excelente / Fenômeno | `2 2 2 2 2` ou melhor |
| 29 a 32 | Ótima | Entre os dois padrões |
| 28 ou menos | Boa ou pior | `1 2 2 1 2 2` ou pior |

> Cortes válidos **somente** para 6 slots de Pressione o Play com média perto de 55%. Fora disso, usar a fórmula.

Caso real documentado: 6 + 7 + 7 + 5 + 6 = 31 pontos, com Pressione o Play e média de 55%. Pela fórmula, `31 ÷ (5 × 18) = 0,344` — que a 55% de média cai entre Ótima (0,301) e Excelente (0,366). O mesmo jogador confirmou `1 2 2 2` no método 1, que a tabela de conciliação da seção 3.1 mapeia como Ótima. **Os dois métodos concordam**, e a curva reproduz a medição de campo.

**Por que este é o método do produto:** não queima a habilidade especial, dá um número em vez de um padrão subjetivo, e as três condições de validade (drill primário, média abaixo de 80%, treino classe mundial) são coisas que o Lab já sabe calcular e pode verificar antes de aceitar o teste.

**[COMUNIDADE]** Vale fazer o teste cedo, com o jogador ainda cru. Jogador já desenvolvido rende menos por sessão e o resultado sai distorcido.

**[PENDENTE] O teste não isola a idade.** O procedimento exige treino classe mundial para padronizar aquele multiplicador, mas o sigma medido também carrega o fator da seção 3.2. Testar um jogador de 26 anos e ler a tabela direto o classifica um ou dois ranks abaixo do real. A leitura adotada pelo produto é **dividir o sigma medido pelo fator de idade antes de consultar a tabela** — decisão nossa, não do material da comunidade, e ainda não validada com ela.

Enquanto isso não se resolve, a saída barata é fazer o teste **antes dos 22 anos**, onde o fator é 1,00 e não há correção a aplicar. É o que a recomendação acima já diz por outro motivo, e é o que o Lab deve sugerir ao usuário.

**[COMUNIDADE]** Para treinar habilidade especial ou posição nova, os drills mais citados são Contra-Ataque Rápido, Academia e Arrancada.

### Método 3 — pelo valor de mercado, antes de comprar (fora da V1)

**[COMUNIDADE]** Os dois métodos acima exigem já ter o jogador e gastar sessões nele. A planilha `evolucao_facil.xlsx` traz um terceiro que classifica o talento **no leilão**, comparando o valor de mercado pedido com o valor esperado para aquela idade e qualidade.

1. Normalizar a qualidade geral pelo nível da conta: `média_ajustada = média_geral − (5 − nível_da_conta) × 20%`.
2. Calcular o valor esperado com o polinômio cúbico da idade do jogador.
3. Dividir o valor de mercado real pelo esperado. A razão cai numa faixa de 0,62 a 1,03 que devolve o rank — abaixo de 0,65 é Ruim, acima de 0,96 é Fenômeno.

| Idade | cúbico | quadrático | linear | constante |
|---|---|---|---|---|
| 18 | 2,6660 | 1,1204 | 6,7015 | 1,3991 |
| 19 | 2,5239 | 0,8451 | 5,5620 | 1,0013 |
| 20 | 2,4771 | 0,1773 | 5,0878 | 0,5207 |

Só há coeficientes para 18, 19 e 20 anos — é um método de scout de jovem, não serve para elenco formado. **Fora da V1** (o Squad não guarda valor de mercado nem nível de conta), mas é a feature natural de uma V2: detectar talento sem gastar uma maleta.

### Como o produto usa

1. **Já sei o rank** — escolhe direto.
2. **Não sei** — o app indica qual drill usar (primário com média abaixo de 80%), o usuário roda 5 sessões e informa a soma, o app converte em sigma pela fórmula acima e classifica.

A extrapolação do rank para condições diferentes das do teste — um drill com média em 130%, um jogador de 26 anos, treino profissional em vez de classe mundial — **está resolvida** pelas seções 3.1 e 3.2. O rank é um ponto na tabela; a curva faz o resto.

## 6. Cronogramas de treino por posição

**[COMUNIDADE]** O cronograma ideal não é tabela fixa — é derivado do jogador. Dois jogadores na mesma posição com atributos diferentes têm cronogramas diferentes, porque a média de cada exercício depende dos valores atuais.

### O algoritmo

1. Derivar os atributos brancos pela matriz da seção 2 — união das posições que o jogador domina — e deixar o usuário ajustar.
2. Para cada um dos 29 drills, descartar os atributos de goleiro e verificar se os restantes são todos brancos → **primário**.
3. Calcular a média de cada primário e ordenar pela **menor** (mais longe dos 180%).
4. Preencher os 6 slots com os de menor média, repetindo drills quando houver menos de 6.
5. Tirar da rotação o drill que passar de ~140% e pegar o próximo.
6. Só quando não houver mais primário viável, descer para secundários.

O custo da sessão sai da seção 4 (dificuldade de cada drill escolhido) e o ganho da seção 3.1, recalculando as médias depois de cada sessão por causa do efeito cascata.

### Tabela de entrada do algoritmo

Atributos de cada drill **já sem os de goleiro** — é sobre esta lista que a média é calculada para jogador de linha. Fixa, independe da posição.

| Drill | Categoria | Atributos que contam | N |
|---|---|---|---|
| Contra-Ataque Rápido | Ataque | Criatividade, Cruzamento, Passe, Finalização | 4 |
| Drible de Slalom | Ataque | Velocidade, Drible, Passe, Condicionamento | 4 |
| Jogada Ensaiada | Ataque | Cruzamento, Cabeçada, Chute, Marcação | 4 |
| Jogo na Ponta | Ataque | Cruzamento, Cabeçada, Finalização, Chute | 4 |
| Marcar Homem a Homem | Ataque | Drible, Corte, Finalização | 3 |
| Passe, Vá e Dispare! | Ataque | Velocidade, Passe, Chute | 3 |
| Técnica de Chute | Ataque | Força, Finalização, Chute | 3 |
| Análise do Vídeo | Defesa | Posicionamento, Coragem, Criatividade | 3 |
| Cabeceada | Defesa | Posicionamento, Passe, Cabeçada, Criatividade | 4 |
| Cruzamento de Defesa | Defesa | Coragem, Cruzamento, Cabeçada, Marcação | 4 |
| Parar o Atacante | Defesa | Coragem, Corte, Força, Drible, Marcação | 5 |
| Pressione o Play | Defesa | Coragem, Posicionamento, Corte, Agressividade, Marcação | 5 |
| Uma Linha de Defesa | Defesa | Posicionamento, Marcação | 2 |
| Treino de Goleiro | Defesa | — só goleiro | 0 |
| Controle da Bola | Posse | Drible, Cabeçada, Criatividade | 3 |
| Entradas | Posse | Coragem, Agressividade, Força, Drible, Marcação | 5 |
| Jogo de Bobinho | Posse | Posicionamento, Corte, Condicionamento, Passe, Agressividade | 5 |
| Matada de Bola | Posse | Drible, Passe, Condicionamento | 3 |
| Passes para o Chute | Posse | Criatividade, Posicionamento, Passe, Finalização | 4 |
| Posicionamento | Posse | Posicionamento, Velocidade, Condicionamento | 3 |
| Virada de Jogo | Posse | Velocidade, Criatividade, Posicionamento, Cruzamento, Passe | 5 |
| Academia | Físico | Força, Condicionamento | 2 |
| Alongamento | Físico | Força, Velocidade, Condicionamento | 3 |
| Aquecimento | Físico | Agressividade, Cabeçada, Condicionamento | 3 |
| Arrancada | Físico | Velocidade, Drible, Condicionamento | 3 |
| Carioca com Escadas | Físico | Velocidade, Agressividade | 2 |
| Corrida Longa | Físico | Condicionamento, Velocidade | 2 |
| Corrida de Ir e Vir | Físico | Velocidade, Força, Coragem | 3 |
| Corrida de Obstáculo | Físico | Velocidade, Coragem, Agressividade, Chute | 4 |

Nota: drills com N baixo tendem a virar primário com mais facilidade (menos atributos para serem todos brancos), mas concentram o ganho em poucos atributos. **Treino de Goleiro** nunca é válido para jogador de linha.

### Validação do algoritmo

O cronograma de MC ditado em vídeo é: Drible de Slalom, Passe Vá e Dispare, Análise do Vídeo, Uma Linha de Defesa, Matada de Bola, Posicionamento, Corrida Longa e Arrancada.

Inferindo os brancos a partir desses 8 drills, chega-se a: **Chute, Condicionamento, Coragem, Criatividade, Drible, Marcação, Passe, Posicionamento, Velocidade**. Rodando o algoritmo com esses brancos sobre a tabela acima, o resultado são exatamente os mesmos 8 drills — nenhum a mais, nenhum a menos.

Isso é o teste de aceitação do motor: dado um MC com esses brancos, a lista de primários tem que sair idêntica.

**ML** — rotação de 3 drills confirmada em vídeo, preenchendo os 6 slots: Matada de Bola, Corrida Longa, Drible de Slalom. Cobre Drible, Passe, Condicionamento e Velocidade. O jogador de ML provavelmente tem mais brancos que esses quatro; o cronograma do vídeo é um recorte, não a lista completa de primários.

### Nota sobre treino em grupo

**[COMUNIDADE]** Ao treinar vários jogadores juntos sem goleiro, evitar drills que carregam atributo de goleiro (Marcar Homem a Homem, Técnica de Chute, Jogada Ensaiada, Jogo na Ponta, Arrancada, Matada de Bola, Academia) — parte da sessão é desperdiçada. Com goleiro no grupo, esses drills passam a valer. Treino em grupo está fora da V1, mas a regra afeta quem seguir a recomendação do Lab jogando em grupo.

## 7. Virada de temporada

**[COMUNIDADE]** Na virada de temporada, **cada atributo do jogador perde 20 pontos**. Um atributo em 74 volta em 54.

**[COMUNIDADE]** A perda é uniforme: **todo atributo perde 20 pontos, branco ou cinza**, e o overall cai 20 junto. Não há evento separado — a perda de estrela por promoção e a queda de 20 no overall são a mesma coisa vista de dois ângulos.

Consequências para o planejamento:

- Um atributo abaixo de 20 simplesmente zera. Cinza deixado em 5 volta em 0.
- Um jogador de 19 anos que será usado aos 21 atravessa duas viradas: **-40** no overall e em cada atributo. É por isso que a comunidade trata a faixa 18–21 como janela de investimento e não de uso.
- Planejar overall alvo significa planejar o valor **depois** da virada, não antes.

---

## 8. Overall e média do elenco

**[OFICIAL]** O overall tem dois componentes: **estrelas** (qualidade-base) e **classes/tiers** (aumento permanente dos atributos-chave, sobrevive à virada de temporada):

| Classe | Aumento permanente nos brancos |
|---|---|
| Rara | +10 |
| Elite | +30 |
| Craque | +50 |
| Mestre | +80 |
| Épica | +120 |
| Lendária | +160 |

### A média que importa: os 14 mais fortes

**[COMUNIDADE]** O sistema não usa a média do elenco inteiro nem a dos 11 escalados. Na virada de temporada ele calcula:

```
média_do_time = soma do overall dos 14 jogadores mais fortes ÷ 14
```

É essa média que define liga, copa e confederação da temporada seguinte. A média exibida na tela de escalação é outra coisa — é a dos 11 escalados — e induz ao erro.

Se o elenco tem menos de 14 jogadores, os últimos entram com o overall que tiverem, inclusive 1%. É exatamente isso que a estratégia explora.

| Média dos 14 | Temporada seguinte |
|---|---|
| abaixo de 80–85% | Competições muito fáceis |
| 92–95% | Confortável |
| ~105% | Adversários entre 110 e 120 |
| 116%+ | Adversários de 120–125, temporada dura |

### Como baixar a média antes da virada

**[COMUNIDADE]** Duas alavancas:

1. **Vender jogadores medianos.** Os intocáveis ficam; laterais e meio-campistas reponíveis saem. Depois da virada, repõe-se com jogadores de 3 estrelas / ~40% do leilão. Tira o jogador da lista dos 14 e faz entrar um reserva fraco no lugar.
2. **Manter reservas de 1 estrela.** Eles ocupam as últimas vagas dos 14 e puxam a média para baixo sem custo nenhum.

Há uma terceira, mencionada na comunidade — ocultar jogadores na Academia durante a virada — deliberadamente **fora do escopo** deste produto. O efeito não é comprovado e as duas alavancas acima são suficientes e determinísticas.

**Consequência para a aba Squad:** o cálculo não é a média do elenco. É a média dos 14 maiores overalls. O simulador precisa ordenar por overall, cortar no 14º, e permitir marcar jogadores como vendidos para ver a média recalcular — mostrando qual reserva sobe para a lista no lugar.

---

## 8.1. A estratégia mutante

**[COMUNIDADE]** "Mutante" é o nome que a comunidade dá ao jogador treinado **só nos atributos brancos**, com os cinzas deixados o mais baixo possível — relatos de atacantes com cinzas em 1% e carreira de mais de mil gols.

O ponto não é só desempenho. É que **os cinzas contam para o overall, mas não para a atuação em campo**. Um mutante joga como um jogador de 8 estrelas enquanto pesa como um de 5 na conta do overall.

### Por que isso une as duas abas do produto

O mutante é a mesma jogada da média dos 14, vista do outro lado:

- Cinza baixo → overall do jogador baixo → **média dos 14 mais baixa** → liga e confederação mais fáceis.
- Cinza baixo → atributos brancos altos → **time forte em campo**.

Ou seja: o Laboratório e o Squad não são duas ferramentas separadas que dividem um cadastro. São duas metades da mesma estratégia. Treinar certo no Laboratório **melhora** o resultado do Squad, em vez de piorar — o que não seria verdade se o treino subisse os cinzas junto.

### Como fazer, dado o resto do documento

1. Marcar os brancos do jogador.
2. Usar apenas drills **primários** — por definição, não tocam em cinza nenhum.
3. Trocar de drill quando a média dele passar de ~140%.
4. Nunca usar treino aleatório ou drill terciário só para "equilibrar" — isso sobe cinza, que sobe overall, que sobe a média dos 14.

Reforço da mecânica já documentada: cinza cresce na metade da velocidade do branco (seção 2), então cada maleta gasta em cinza rende metade.

**Não existe piso de cinza a respeitar.** Cinza baixo não penaliza o jogador em campo — há relatos de artilheiro de todas as competições com cinzas em nível normal e de atacantes com cinza em 1% e carreira longa. O produto não precisa avisar o usuário sobre um mínimo, porque não há um.

### Contradição entre fontes, e como foi resolvida

Material de comunidade de 2019–2022 recomendava **não** fazer mutante puro, citando um suposto nerf da Nordeus e times equilibrados vencendo mutantes em jogos de Associação.

Este documento adota a posição oposta, por três razões:

- A comunidade ativa hoje ensina mutante em série, com tutorial dedicado por posição.
- A regra dos 180% explica onde o mutante realmente encontra limite — os drills primários travam, e a saída é trocar de drill, não subir cinza.
- A mecânica dos 14 mais fortes dá ao mutante um benefício que independe de o desempenho em campo ter sido nerfado ou não: overall baixo é vantagem por si só.

---

## 8.2. O oposto: treino inflado

**[COMUNIDADE]** O contrário do mutante é a sessão que sobe **todos os atributos de uma vez**, inflando o overall. Combinação documentada pela comunidade, que preenche os 6 slots e cobre os 15 atributos de linha sem sobrar nenhum:

| Slot | Drill | Atributos |
|---|---|---|
| 1 | Pressione o Play | Coragem, Posicionamento, Corte, Agressividade, Marcação |
| 2 | Contra-Ataque Rápido | Criatividade, Cruzamento, Passe, Finalização |
| 3 | Drible de Slalom | Velocidade, Drible, Passe, Condicionamento |
| 4 | Jogo na Ponta | Cruzamento, Cabeçada, Finalização, Chute |
| 5 | Academia | Força, Condicionamento |
| 6 | Corrida de Ir e Vir | Velocidade, Força, Coragem |

Cobertura: **15 de 15**. Sete atributos são tocados duas vezes na mesma sessão (Coragem, Passe, Cruzamento, Finalização, Condicionamento, Força, Velocidade), o que concentra ganho neles.

**Quando serve:** subir overall depressa e de propósito — preparar um jogador para venda, ou atingir um patamar de qualidade exigido por evento ou competição.

**Quando atrapalha:** é exatamente o que **não** fazer se o objetivo é manter a média dos 14 baixa. Infla o overall sem melhorar proporcionalmente o desempenho em campo, já que boa parte do ganho vai para cinza.

**Como o Lab trata:** as duas estratégias são opostas e legítimas, então o Laboratório precisa saber **qual o objetivo do usuário naquele jogador** antes de recomendar. Mutante e inflado não são certo e errado — são respostas a perguntas diferentes.

## 9. Recursos de treino

**[COMUNIDADE]** A **maleta verde** é o recurso que limita a evolução de quem não gasta dinheiro:

- 25 maletas grátis por dia assistindo 25 vídeos, acumuláveis entre dias.
- Maletas extras por assistir partida e fazer substituição.

### Maleta, condicionamento e a conta fechada

**[COMUNIDADE]** **Uma maleta verde repõe 15% de condicionamento.** Com isso a cadeia de custo fecha inteira, sem estimativa:

```
maletas = ARREDONDA.PARA.CIMA( (ganho_desejado ÷ sigma) ÷ 15 )
```

onde `sigma` vem da seção 3.1, já multiplicado pelo fator de idade (3.2) e pelo nível do treinador.

Exemplo: subir 8 pontos de atributo num jogador Fenômeno de 19 anos, num drill com média de 100%. `sigma = 0,425`, logo `8 ÷ 0,425 = 18,8%` de condicionamento, ou **2 maletas**. O mesmo ganho no mesmo jogador quando o drill chegar a 140% custa `8 ÷ 0,200 = 40%`, ou **3 maletas** — e a 160%, **6 maletas**.

Isto é o que a estratégia de trocar de drill aos ~140% (seção 3) significa em dinheiro.

A referência antiga de **~2 pontos de overall a cada 5 maletas** continua registrada como ordem de grandeza observada em campo, útil para conferir a saída do cálculo, mas não é mais a base da conta.

**[COMUNIDADE]** O patrocinador pago acelera a recuperação de condicionamento (20–30%), o que aumenta quantas sessões cabem por dia sem gastar maleta. Bônus de 2x por assistir vídeo dobra o rendimento da sessão.

---

## 10. Fora do escopo da V1

Regras conhecidas e deliberadamente não implementadas.

- **Classes/Tiers e Gems** — progressão paralela, gira em torno de compra. A tabela da seção 8 fica documentada porque afeta o overall, mas o Lab não simula a compra.
- **Player Academy** — técnicos renovam a cada 2 dias, não sustenta ritmo real para quem não paga. Fora da V1 tanto como sistema de treino quanto como suposto mecanismo de ocultação (seção 8).
- **Detecção de talento pelo valor de mercado** (seção 5, método 3) — depende de dados que o Squad não guarda.
- **Entrosamento, Primor e livros táticos** — sistema separado, não melhora atributo. Importa para resultado de partida, não para evolução de jogador.
- **Treino em grupo** — treinar 3 a 5 jogadores da mesma zona numa sessão. Relevante e bem documentado, mas o Laboratório da V1 raciocina por jogador individual.
- **Youth Academy** e Centro de Talentos.
- **Goleiro no Laboratório** — depende dos atributos de GK (seção 2). O goleiro continua no Squad normalmente, que só usa overall e posição.
- **Estilos de jogo (playstyles)**.

---

## 11. Estimativa de sessões e sua incerteza

A cadeia de conversão que sustenta a estimativa do Lab:

```
talento + média do exercício + idade → pontos de atributo → overall
```

O primeiro trecho é **cálculo**, não estimativa: as seções 3.1 e 3.2 dão sigma em função de talento, média do exercício, idade e nível do treinador, e a seção 9 converte condicionamento em maletas. Sobra um único elo incerto.

### O único elo estimado: atributo para overall

**[ESTIMADO]** Ninguém na comunidade mediu isso diretamente. Duas observações:

- Um MC de 18 anos fez 5 sessões, ganhou +5 em Drible, +5 em Velocidade e +5 em Passe — 15 pontos de atributo — e o overall subiu de 82 para 84. Cerca de **7 a 8 pontos de atributo por ponto de overall**.
- Um ML de 19 anos: "sobe 2 de overall a cada 5 maletas".

O overall é média sobre 15 atributos, mas a soma observada não bate com uma média simples, o que sugere peso maior nos brancos. Com duas observações, a razão fica como estimativa e é a razão pela qual a saída do Lab é **faixa, nunca número exato**.

### O que a estimativa produz hoje

Jogador Excelente de 19 anos, drill primário a 60% de média, treino classe mundial, sessão de 6 slots de um drill Difícil (18% de condicionamento):

- `sigma = 0,358` × idade `1,000` → **6,4 pontos de atributo por sessão**
- ÷ ~7,5 → **~0,85 ponto de overall por sessão**
- 18% de condicionamento por sessão → **~1,2 maleta por sessão**

O mesmo jogador com o mesmo drill em 140% rende `0,130 × 18 = 2,3` pontos por sessão — **um terço**. E aos 26 anos, `× 0,661`, cai para 1,5.

Essa degradação é o que o produto precisa comunicar melhor que qualquer planilha: a estimativa tem que integrar a curva sessão a sessão, recalculando a média do exercício depois de cada ganho (efeito cascata, seção 3), em vez de multiplicar linearmente.

### Como a estimativa melhora com o uso

Cada teste de talento que o usuário rodar produz exatamente o dado que falta — pontos ganhos, média do exercício, idade, e o overall antes e depois. Guardando esses registros, o elo estimado sai de duas observações para dezenas e a faixa aperta sozinha. Não exige nada além do que o usuário já faz para usar o app.

### Ainda em aberto

**A conversão de atributo em overall**, acima. Único item.

### Resolvidas

Brancos por posição (matriz da seção 2, derivada e editável), atributos do goleiro (seção 2), slots por sessão (6), teto de treino (180% por exercício), **curva de ganho por talento e média do exercício (seção 3.1)**, **efeito quantitativo da idade (seção 3.2)**, **custo de condicionamento por drill (seção 4)**, **conversão de condicionamento em maletas (seção 9)**, nível do treinador (seção 3.1), média do time (14 mais fortes), teste de talento (fórmula de sigma, seção 5), perda de virada (20 em todo atributo e no overall, evento único — seção 7), piso de cinza (não existe — seção 8.1), e o algoritmo de cronograma por posição, validado contra o cronograma de MC ditado em vídeo (seção 6).

---

## Fontes

**Ponto de partida:** compilados de comunidade que serviram de ponto de partida (guia de treinamento e dossiê de jovens), hoje absorvidos por este documento

**Capturas de tela:** drills das 4 categorias, grade de posições, tela de atributos do jogador de linha e do goleiro. Ficam em `Mockups/Referencias/` na máquina de quem levantou as regras e **não são versionadas** — são imagens do jogo, propriedade da Nordeus. Tudo o que foi extraído delas está transcrito neste documento; quem quiser conferir tira as mesmas capturas no próprio jogo.

**Fórum oficial:** [Multi position players - pro and cons](https://forum.topeleven.com/tutorials-guides/79440-multi-position-players-pro-cons.html) · [Top-Eleven Wiki — Player](https://top-eleven.fandom.com/wiki/Player)

**Vídeos da comunidade brasileira:**

| Tema | Vídeo |
|---|---|
| Média de exercício e teto de 180% | [MÉDIA DE TREINO — VOCÊ SABE COMO FUNCIONA?](https://www.youtube.com/watch?v=y8aI540Eiqo) |
| Classificação primário/secundário/terciário | [A TAL PLANILHA DE TREINO!](https://www.youtube.com/watch?v=62vDgksoj7M) |
| Média dos 14 mais fortes e ocultação | [OCULTANDO JOGADORES NA CONTA DOS 14 MAIS FORTES](https://www.youtube.com/watch?v=yzX3o_VthDs) |
| Teste de talento por atributos (5 sessões) | [TESTE DE EVOLUÇÃO ATRAVÉS DE ATRIBUTOS](https://www.youtube.com/watch?v=k4dsrf0A2FE) |
| Teste de talento por habilidade especial | [COMO ACHAR BONS JOGADORES E FAZER TESTE DE EVOLUÇÃO](https://www.youtube.com/watch?v=gDUpvMPgIb4) |
| Ocultação na virada de temporada | [O SEGREDO QUE NINGUÉM TE CONTA](https://www.youtube.com/watch?v=dCTn4baF1jg) |
| Cronograma MC e perda de 20 por atributo | [TREINAMENTO PARA MC](https://www.youtube.com/watch?v=jttQx4BVGS4) |
| Cronograma ML e custo em maletas | [O TREINO SECRETO](https://www.youtube.com/watch?v=B4IuwSA4Hjo) |
| Treino em grupo por zona | [TREINO PERFEITO NO TOP ELEVEN](https://www.youtube.com/watch?v=pUBGvTI0pr8) |
| Classes e entrosamento | [MELHOR TREINAMENTO DO TOP ELEVEN 2026](https://www.youtube.com/watch?v=8xl5yzX3_HI) |
| Explicação da planilha simuladora | [EXPLICANDO O SIMULADOR COM UMA LINGUAGEM BÁSICA](https://www.youtube.com/watch?v=2fxkY7dClGs) |

**Planilhas da comunidade:**

- **`evolucao_facil.xlsx`** — obtida pela descrição de [TESTE DE EVOLUÇÃO ATRAVÉS DE ATRIBUTOS](https://www.youtube.com/watch?v=k4dsrf0A2FE). É a fonte das seções 3.1 (curva de ganho), 3.2 (idade), 4 (desgaste por dificuldade), 5 (método 3), 9 (maleta = 15% de condicionamento) e da matriz de brancos da seção 2. Aviso de leitura: ela contém **duas gerações do modelo** — a aba `evolução fácil` usa sigma fixo por rank, a aba `TabelasAux` traz a "Revisão 2" dependente da média do exercício, e as duas divergem em até 30%. **Este documento adota a Revisão 2.**
- Simulador de treino, canal Paiva Top Eleven: link na descrição de [EXPLICANDO O SIMULADOR](https://www.youtube.com/watch?v=2fxkY7dClGs) — encurtador expirado, arquivo não recuperado. Pelo que o vídeo mostra, o conteúdo é coberto pela planilha acima.
- Planilha original de Marcos e Anderson, distribuída no grupo do Facebook — ancestral das duas.
