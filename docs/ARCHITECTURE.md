# Arquitetura — Top Eleven Lab

> Como o sistema é montado e por quê. O **porquê do produto** está em [`../PRD.md`](../PRD.md);
> as **regras do jogo**, em [`GAME-RULES.md`](GAME-RULES.md); a **referência técnica do
> repositório**, em [`../AGENTS.md`](../AGENTS.md); as **etapas**, em [`ROADMAP.md`](ROADMAP.md).
>
> O modelo C4 correspondente está em [`architecture/workspace.dsl`](architecture/workspace.dsl).
> As decisões caras de reverter estão uma por arquivo em [`adr/`](adr/), e este documento
> só resume cada uma com o link.

## 1. O problema, em três linhas

Quem joga Top Eleven sem gastar dinheiro precisa de duas contas por temporada: em qual jogador
gastar maleta verde e com qual exercício, e quem vender para baixar a média dos 14 mais fortes
do elenco. As duas hoje se resolvem com planilha de Excel, num jogo que é mobile. O Lab faz as
duas no navegador, com o elenco já cadastrado.

## 2. Requisitos apurados

O dimensionamento vem antes do desenho. Nenhum padrão entra aqui sem um número que o obrigue.

| Dimensão | O que apuramos | Fonte |
|---|---|---|
| Usuários totais | Ordem de **mil pessoas**, comunidade brasileira, público fechado | `PRD.md:21`, `PRD.md:91` |
| Perfil de uso | **Sazonal**, concentrado na virada de temporada. Retorno diário não é meta | `PRD.md:40` |
| Requisições por segundo | **Zero.** O produto não faz requisição de rede em runtime | `AGENTS.md:147` |
| Volume de escrita | Escrita local, disparada por ação de formulário. Ordem de dezenas por sessão de uso | Derivado do fluxo de cadastro, `PRD.md:49` |
| Tamanho do dado | Um documento de **~5 KB** por navegador (ver §5.3) | Derivado; tamanho de elenco é SUPOSIÇÃO |
| Consistência | Um usuário, um aparelho, um documento. **Não existe problema distribuído** | `AGENTS.md:191` |
| Domínios | Dois — Squad e Laboratório — sobre **um cadastro só** | `AGENTS.md:13` |
| Tempo real | Não. Nenhum push, nenhuma sessão compartilhada | `PRD.md:75` |
| Arquivos | Exportar e importar um JSON de poucos KB | `AGENTS.md:191` |
| Tarefas longas | A projeção iterativa é a única. Medida em §7: **muito abaixo de 1 ms** | `AGENTS.md:55`, GAME-RULES §11 |
| Orçamento | **Zero, e não negociável.** Nenhum serviço pago, nenhum plano free que vire cobrança | Restrição do dono do projeto |
| Compliance | **Fora de escopo.** Nenhum dado sai do aparelho, não há conta e não há dado pessoal | `AGENTS.md:191` |
| Time | Uma pessoa. Repositório público, aberto a contribuição | `PRD.md:97` |

**A leitura destes números é o desenho inteiro:** um site estático, sem servidor, sem banco,
sem cache, sem fila e sem worker. Tudo o que este documento decide daqui em diante é sobre
**fronteira e legibilidade**, não sobre escala. Qualquer componente proposto aqui que só se
justifique por volume está errado por construção.

## 3. As três camadas

A fronteira já estava decidida em `AGENTS.md:30`. O que este documento acrescenta é onde cada
coisa mora e o que atravessa cada linha.

```
interface  →  React, Next.js, formatação, layout paisagem
   ↓
aplicação  →  estado em memória, persistência, migração, exportar/importar
   ↓
domínio    →  cálculo puro, sem I/O e sem framework
   ↓
regras     →  as tabelas transcritas do GAME-RULES
```

Dependência aponta só para dentro. O domínio não importa React, não lê `window`, não toca em
`localStorage` e não formata número para exibição — ver [ADR 0004](adr/0004-framework-free-domain.md).

O que atravessa cada linha:

| Fronteira | O que passa | O que **não** passa |
|---|---|---|
| interface → aplicação | Ações do usuário e leitura do documento | Objeto de evento do React, nó de DOM |
| aplicação → domínio | Números e listas puras | `Date.now()`, `window`, promessa, string formatada |
| domínio → regras | Nada — o domínio só lê | — |
| domínio → aplicação | Números e listas puras, com faixa quando estimado | String pronta para tela, `%`, `,` decimal |

O corolário prático: **o domínio nunca formata**. Ele devolve `0.344`, e a interface decide se
mostra `34,4%` ou `0,34`. Isso é o que permite testar o motor sem navegador e trocar a UI sem
tocar em regra de jogo.

### 3.1. Estrutura de pastas

```
src/
  domain/                    # cálculo puro — nenhum import de React, window ou localStorage
    types.ts                 # Atributo, Posicao, Drill, RankTalento, NivelTreinador, Dificuldade
    rules/                   # as tabelas do GAME-RULES, transcritas — ADR 0007
      drills.ts              # os 29 exercícios: categoria, dificuldade, atributos    §4, §6
      positions.ts           # matriz de brancos por posição                          §2
      talent-curve.ts        # fator por rank, curva de média, nível do treinador     §3.1
    attributes.ts            # brancosDaPosicao                                       §2
    drill.ts                 # mediaExercicio, classificarDrill                       §3, §4
    gain.ts                  # sigma, fatorIdade, ganhoSessao                         §3.1, §3.2
    training.ts              # desgaste por slot e custo em maletas  (já existe)      §4, §9
    schedule.ts              # montarCronograma                                       §6
    projection.ts            # projetarAteMeta                                        §11
    talent.ts                # classificarTalento                                     §5
    squad.ts                 # mediaDos14                                             §8
  state/                     # camada de aplicação — ADR 0009
    schema.ts                # o tipo do documento persistido e o schemaVersion atual
    migrations.ts            # a cadeia v1 → v2 → …, funções puras
    storage.ts               # a casca fina sobre localStorage
    transfer.ts              # exportar e importar o arquivo JSON
    store.tsx                # o Context e o reducer   (entra na etapa 6)
  ui/                        # componentes React, formatação, layout   (entra na etapa 6)
  app/                       # rotas do Next App Router — RESERVADO, não é a camada de aplicação
```

Três notas sobre a árvore, porque cada uma evita um erro concreto:

- **`src/app/` é do Next, não é a camada de aplicação.** Com `src/`, o App Router procura
  rotas em `src/app/`. A camada de aplicação se chama `state/` justamente para não disputar
  esse nome — e porque é o que ela de fato contém: estado, persistência e migração.
- **Cada teste mora ao lado do módulo**, como `training.test.ts` já faz. Sem pasta `tests/`
  espelhada: ela dobra o caminho de todo arquivo e some com a proximidade que faz alguém
  abrir o teste ao editar a função.
- **Um módulo por conceito, e nada além.** Se dois módulos passarem a mudar sempre juntos,
  são um só e devem ser fundidos. A lista acima é o ponto de partida da etapa 5, não um
  contrato a defender.

## 4. Um cadastro só para as duas abas

O Squad usa nome, overall e posição. O Laboratório usa a ficha completa. É o mesmo jogador em
dois níveis de detalhe, e o produto só faz sentido porque as duas abas são a mesma estratégia
vista de dois lados (GAME-RULES §8.1).

**Decisão: uma lista só de jogadores, e a ficha de Laboratório é um campo sempre presente e anulável (`lab: FichaLab | null`).**

```jsonc
{
  "schemaVersion": 1,
  "jogadores": [
    {
      "id": "…",
      "nome": "…",
      "overall": 78,
      "posicoes": ["DC"],
      "vendido": false,
      "lab": null                     // null = existe só no Squad
    },
    {
      "id": "…",
      "nome": "…",
      "overall": 84,
      "posicoes": ["MC", "AMC"],      // até 3 — GAME-RULES §1
      "vendido": false,
      "lab": {                        // preenchido = promovido ao Laboratório
        "idade": 19,
        "atributos": { "corte": 61, "marcacao": 63, "…": 0 },
        "brancosManuais": null,       // null = derivar da união das posições
        "talento": "otima",           // null enquanto não testado
        "nivelTreinador": "mundial",
        "testes": [
          { "data": "2026-09-07", "drill": "pressione-o-play",
            "mediaAntes": 55, "soma5Sessoes": 31 }
        ]
      }
    }
  ]
}
```

Por que assim, e não com duas listas:

- **O núcleo do Squad é subconjunto exato do que o Laboratório precisa.** `nome`, `overall`
  e `posicoes` servem às duas abas. Duas listas com `id` próprio criariam dois registros do
  mesmo jogador e a pergunta insolúvel de qual deles está certo quando divergirem.
- **Aprofundar é preencher `lab`, não recadastrar.** O usuário cadastra os 25 do elenco em
  3 campos, e depois abre a ficha completa dos 3 ou 4 que vai treinar na temporada
  (`PRD.md:61`). O caminho é sempre do raso para o detalhado, nunca o contrário.
- **`posicoes` é sempre um array**, mesmo no Squad, onde o formulário grava `["DC"]`. Um
  campo, um tipo. O Laboratório precisa da união dos brancos das até 3 posições
  (GAME-RULES §1) e ler isso de um array de um elemento não custa nada.
- **A projeção nunca escreve de volta no cadastro.** Ela devolve uma faixa; o `overall` do
  jogador continua sendo o que o usuário leu na tela do jogo. Overall não é derivado dos
  atributos (`AGENTS.md:186`), e uma simulação que altera o cadastro transformaria a
  ferramenta de decisão em fonte de dado errado.

Ver [ADR 0006](adr/0006-single-player-registry.md). Isto **substitui** o schema de duas listas
descrito hoje em `AGENTS.md:153-176` — ver as pendências, §11.

## 5. Estado, persistência e migração

### 5.1. Onde mora o estado

O documento inteiro vive em memória, num Context de React alimentado por um `useReducer`.
Sem biblioteca de estado — ver [ADR 0009](adr/0009-react-context-state.md).

O número que decide isso: o documento tem **~5 KB** e muda **por clique de formulário**.
Zustand, Redux ou Jotai resolvem re-render de árvore grande e store compartilhada entre
rotas distantes; nenhum dos dois problemas existe num app de duas abas sobre um objeto.

O resultado de cálculo — a lista de drills classificados, a média dos 14, a projeção — **não
entra no estado**. É função dos dados de entrada, calculada na renderização. Guardar isso
criaria a possibilidade de o resultado exibido discordar do cadastro, que é o único bug
verdadeiramente caro num produto cuja proposta é acertar a conta.

### 5.2. Como o estado chega ao armazenamento

```
abertura     localStorage → migrações → documento em memória → primeira tela útil
alteração    ação → reducer → documento novo → gravação síncrona no localStorage
exportar     documento em memória → arquivo JSON no aparelho
importar     arquivo JSON → migrações → substitui o documento → grava
```

Gravação **write-through**, síncrona, a cada alteração. Sem debounce: `JSON.stringify` de
5 KB custa microssegundos, e um debounce introduz a janela em que o usuário fecha a aba e
perde o que digitou.

**A leitura acontece depois da montagem, nunca durante a renderização.** Isso é consequência
direta do export estático ([ADR 0001](adr/0001-static-export-on-vercel.md)): o HTML é gerado
no build, quando `localStorage` não existe. O primeiro render é sempre o estado vazio, e o
documento chega em seguida. A interface precisa ter um estado de carregamento honesto — não
um flash de "elenco vazio" para quem tem 25 jogadores cadastrados.

**Falha de gravação é visível.** Modo privado do Safari e quota estourada fazem `setItem`
lançar. Perder o elenco em silêncio é perda de dado, não cenário impossível: o erro é
capturado e vira aviso na tela, com o botão de exportar ao lado.

### 5.3. Quanto dado é isso

Um jogador do Squad ocupa ~80 bytes de JSON; uma ficha de Laboratório com 15 atributos e
histórico de testes, ~600 bytes. Um elenco de 25 jogadores com 4 fichas completas dá
**~4,4 KB**. A quota de `localStorage` é de ~5 MB por origem — margem de três ordens de
grandeza. O tamanho do elenco é suposição (§12); mesmo errando por 10x, a margem continua
confortável.

### 5.4. Migração de `schemaVersion`

Uma função pura por salto de versão, encadeadas na leitura:

```
migrate(bruto) : v1 → v2 → v3 → … → documento na versão atual
```

Quatro regras, cada uma existindo para evitar uma perda de dado concreta:

1. **A migração roda no mesmo caminho para o `localStorage` e para o import.** Um arquivo
   exportado há duas versões precisa abrir hoje; se houvesse dois caminhos, um deles ficaria
   sem manutenção.
2. **Só se grava por cima depois de o documento migrado estar válido.** Migração que lança
   deixa o bruto intacto no armazenamento, e a tela oferece exportar o bruto antes de
   qualquer coisa.
3. **Versão maior que a conhecida é recusada, não adivinhada.** Acontece de verdade: o
   usuário exporta no PC atualizado e importa no celular com a aba antiga em cache. Tentar
   ler dá corrupção silenciosa; recusar dá uma mensagem que o usuário entende.
4. **Cada migração é função pura de objeto em objeto**, e por isso é testada sem navegador,
   com o documento da versão antiga escrito à mão no teste.

`schemaVersion` começa em **1** no formato da §4. Não há migração `0 → 1` a escrever: o
schema de duas listas do `AGENTS.md` nunca chegou a ser gravado por ninguém, porque não
existe interface ainda.

### 5.5. Importar substitui, não mescla

Import troca o documento inteiro, com confirmação explícita antes. Mesclar dois elencos
exigiria decidir, jogador a jogador, qual versão vence — e não há relógio confiável nem
identidade estável entre aparelhos para decidir isso. O caso de uso real é "levar meu elenco
do celular para o PC" (`PRD.md:32`), que substituição resolve inteiro.

## 6. Onde vivem as tabelas de regra

Os 29 drills, a matriz de brancos por posição, a curva de talento e o fator de idade são
**dados**, não código. Ficam em `src/domain/rules/`, em TypeScript com `as const`, um arquivo
por tabela, cada entrada citando a seção do GAME-RULES em comentário —
[ADR 0007](adr/0007-rule-tables-in-typescript.md).

A alternativa óbvia era JSON, e ela foi descartada por dois motivos concretos:

- **JSON não aceita comentário.** A regra do repositório é que nenhuma constante de jogo
  nasça no código e que cada uma cite sua seção de origem (`AGENTS.md:226`). Em JSON isso
  vira um campo `"fonte"` por objeto, ou some.
- **TypeScript faz o compilador revisar a transcrição.** A tabela dos 29 drills declarada
  como `readonly Atributo[]` faz `"cabeceada"` no lugar de `"cabecada"` virar erro de
  compilação, pego pelo `typecheck` do CI. O modo de falha mais provável deste projeto não é
  bug de lógica — é erro de digitação ao transcrever tabela de documento. JSON só pegaria
  isso com uma camada de validação em runtime, ou seja, uma dependência nova para um
  problema que o compilador já resolve de graça.

Consequência aceita: quem não lê TypeScript não edita a tabela pelo GitHub. Aceitável — quem
corrige regra de jogo aqui é quem mexe no código, e o documento de origem continua sendo o
`GAME-RULES.md`, que é markdown.

### O que é tabela e o que é fórmula

Nem toda regra vira tabela. O critério: **se uma fórmula reproduz a tabela publicada, a
fórmula vence e o teste reproduz a tabela**.

| Regra | Forma | Por quê |
|---|---|---|
| Desgaste por dificuldade (§4) | Fórmula `dificuldade × 0,75` | Uma linha reproduz os 29 drills. Já implementada |
| Fator de idade (§3.2) | Fórmula com piso | Reproduz as 18 linhas da tabela; ver a armadilha abaixo |
| Maleta ↔ condicionamento (§9) | Fórmula `teto(gasto ÷ 15)` | Já implementada |
| Os 29 drills (§4, §6) | Tabela | Não há fórmula: é transcrição do jogo |
| Brancos por posição (§2) | Tabela | Idem. As 41 combinações são união, e **não** entram |
| Fator de talento por rank (§3.1) | Tabela de 7 entradas | Medição, não fórmula |
| Curva de média do exercício (§3.1) | Tabela de 9 âncoras + interpolação linear | O documento manda interpolar |
| Nível do treinador (§3.1) | Tabela de 4 entradas | Medição |

**A armadilha do fator de idade, registrada porque custa caro descobrir depois.** O
`AGENTS.md:116` descreve "1,00 até 21 anos; −0,0679/ano até 0,05 aos 35". Implementar isso
contando os anos a partir de 22 dá `0,117` aos 35, e a tabela publicada diz `0,050`. A
contagem correta parte de **21**:

```
fatorIdade(idade) = idade <= 21 ? 1,00 : max(0,05 ; 1,00 − 0,0679 × (idade − 21))
```

Conferido nas duas pontas: aos 22 dá `0,9321`, que arredonda para o `0,932` da tabela; aos
35 a parte linear dá `0,0494` e **o piso devolve `0,050`**, que é o valor da tabela. O teste
compara com `0,05` aos 35, não com `0,0494` — sem o `máx`, a função devolveria um número
abaixo do piso publicado. É esse teste, reproduzindo as 18 linhas da §3.2, que protege contra
alguém "consertar" o `− 21` para `− 22`.

Duas decisões menores de interpolação que o GAME-RULES não fecha e o código precisa fechar,
registradas aqui porque são escolha nossa e não do documento:

- **Média do exercício abaixo de 20%:** patamar `1,41`. A tabela repete o mesmo valor em 20%
  e 40%, o que indica platô à esquerda, não uma reta a extrapolar.
- **Média em 180% exatos:** ganho zero, sem interpolar. É a trava da §3, e a coluna vazia
  da tabela é deliberada.

## 7. Como o motor projeta iterativamente

O efeito cascata (GAME-RULES §3) é o que separa o produto de uma planilha: subir um atributo
empurra a média de **todo** drill que o contém, então a projeção não é multiplicação linear.

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

Quatro consequências de desenho, cada uma amarrada a um requisito:

**A entrada não é mutada.** O estado de simulação é uma cópia local dos 15 atributos. Sem
isso, "simular até 100" mudaria o cadastro do jogador, e o usuário compara a tela do Lab com
o jogo aberto do lado (`AGENTS.md:186`).

**Precisa existir um critério de parada além da meta.** Se todo drill viável travar em 180%,
o ganho da sessão é zero e o laço não converge. Isso não é cenário defensivo — é a regra
central do jogo. A saída nesse caso é `meta inalcançável`, dizendo qual foi a barreira, e
não um número grande.

**A faixa vem de um único parâmetro, não de duas simulações independentes.** A incerteza está
inteira na conversão de atributo em overall — 7 a 8 pontos de atributo por ponto de overall
(GAME-RULES §11). A faixa é a mesma simulação rodada nos dois extremos desse divisor. Inventar
uma segunda fonte de incerteza seria fingir precisão que o modelo não tem.

**O corte de 140% é recomendação de interface, não regra do motor.** O GAME-RULES é ambíguo
aqui: a §6 manda tirar da rotação o drill que passar de ~140%, e a §3 diz que acima de 140%
ainda rende, só custa mais. O motor usa o teto duro de **180%**, porque é o que é mecânica; o
corte de 140% aparece na tela como aviso de custo. Se o motor aplicasse os 140%, um jogador
sem primário abaixo desse valor receberia "inalcançável" para uma meta que o jogo permite
alcançar. Ver as pendências, §11.

### Quanto isso custa para rodar

Subir um overall de 82 para 100 são 18 pontos de overall, ou ~135 pontos de atributo pelo
divisor da §11. A 6,4 pontos por sessão no começo, caindo com a curva, dá algo entre 30 e 60
sessões. Cada sessão simulada custa ~200 operações aritméticas (29 drills × ~3,6 atributos,
mais a ordenação de uma dúzia de primários). Com os dois extremos da faixa:

```
60 sessões × 200 operações × 2 = ~24.000 operações aritméticas
```

Isso roda em muito menos de um milissegundo. **Portanto: síncrono, no clique, sem Web Worker,
sem memoização e sem debounce** — [ADR 0008](adr/0008-synchronous-iterative-projection.md).
O sinal para revisar é objetivo: uma projeção medida acima de 16 ms (um quadro a 60 Hz).
Antes disso, worker é complexidade sem causa.

## 8. Estratégia de teste por camada

O projeto é TDD (`AGENTS.md:218`). O esforço de teste é deliberadamente desigual, porque o
risco é.

| Camada | O que se testa | Ferramenta | Por quê |
|---|---|---|---|
| `domain/rules/` | Que a **transcrição** bate com o GAME-RULES: os 29 desgastes, as 18 linhas de idade, os 8 brancos de cada posição | Vitest | Erro de digitação em tabela é o modo de falha mais provável, e o mais silencioso |
| `domain/` | Que o **cálculo** reproduz as medições de campo | Vitest | É o que dá valor ao produto. Aqui a cobertura é alta de propósito |
| `state/` | Migração, serialização e validação de import, como funções puras sobre objetos | Vitest, sem DOM | Protege o dado do usuário, que é insubstituível |
| `state/storage.ts` | Nada automatizado | — | Casca de poucas linhas sobre `localStorage`. Ver abaixo |
| `ui/` | Nada automatizado na V1 | — | Ver abaixo |

**Os casos do domínio não são inventados.** Cada um sai de uma medição registrada no
GAME-RULES, com a seção citada no próprio teste — a tabela de `AGENTS.md:135-143` é a
primeira bateria. `training.test.ts` já mostra o formato: o teste diz `GAME-RULES §9` e
reproduz o exemplo das 2, 3 e 6 maletas.

**Por que a casca do `localStorage` não tem teste automatizado.** Testá-la exige jsdom ou
happy-dom, ou seja, uma dependência nova para verificar `setItem` e `getItem`. A troca é
manter essa casca com poucas linhas e nenhuma decisão: tudo o que decide alguma coisa —
migrar, validar, serializar — fica acima dela, em função pura, e é testado. Se a casca
crescer a ponto de ter um `if` que importe, ela ganha teste e o projeto ganha jsdom.

**Por que a UI não tem teste automatizado na V1.** Uma pessoa, um produto de duas telas, e
uma etapa inteira do roadmap dedicada a validar layout com jogadores reais (etapa 4). Testing
Library mais jsdom custaria manutenção contínua para cobrir o que a validação com usuário
cobre melhor. Os dois sinais que mudam isso: um segundo contribuidor regular, ou o mesmo bug
de interface escapando duas vezes.

**O que o CI roda** é o que já está no `ci.yml`: `lint`, `typecheck` e `test`, a cada push e
pull request. O passo de `build` entra junto com o Next, na etapa 6.

## 9. Riscos e gargalos

O que quebra primeiro, e com qual sinal:

| Risco | Quando aparece | O que fazer |
|---|---|---|
| **O usuário limpa o navegador e perde o elenco** | A qualquer momento, sem aviso | É o gargalo real do produto. Mitigação: o botão de exportar precisa ser óbvio e lembrado, não escondido em ajustes |
| **A Nordeus muda a mecânica de treino** | Sem aviso, já aconteceu (`PRD.md:93`) | O conserto tem um lugar só: `GAME-RULES.md` e as tabelas da §6. O teste que passar a falhar diz onde |
| **Erro de transcrição de tabela** | No primeiro usuário que conferir contra o jogo | Testes de transcrição (§8) e tipagem `as const` (§6). É por isso que as duas coisas existem |
| **A conversão atributo → overall está errada** | Quando um usuário comparar a estimativa com o resultado real | Único elo estimado do modelo (GAME-RULES §11). A saída é faixa justamente por isso, e o histórico de testes aperta a faixa com o uso |
| **O cadastro manual cansa antes de mostrar valor** | Na primeira sessão de um usuário novo | Maior risco de adoção do produto (`PRD.md:89`). É risco de UX, e a etapa 4 existe para medi-lo |
| **Quota de `localStorage`** | Ordem de 1.000 jogadores cadastrados | Três ordens de grandeza acima do uso real. Não é gargalo; está aqui para fechar a conta |
| **Limite do plano free da Vercel** | Não previsto para mil pessoas em uso sazonal de site estático | Se um dia chegar perto, o mesmo build estático sobe em GitHub Pages sem mudar uma linha — ver ADR 0001 |

## 10. O que ficou deliberadamente de fora

Cada item com o sinal que indica que chegou a hora de incluir.

| Fora | Sinal para incluir |
|---|---|
| **Backend, conta de usuário, sincronização** | Comunidade financiando o custo **e** pedido real de sincronização que exportar não resolva |
| **Biblioteca de estado (Zustand, Redux)** | Re-render medido causando lentidão perceptível, ou estado compartilhado entre rotas distantes |
| **Web Worker para a projeção** | Projeção medida acima de 16 ms |
| **Validação de schema em runtime (Zod)** | Um formato de import de terceiro, ou um bug real causado por arquivo malformado que a migração não pegou |
| **jsdom e testes de UI** | Segundo contribuidor regular, ou o mesmo bug de interface escapando duas vezes |
| **IndexedDB** | Documento passando de ~1 MB, ou necessidade de gravar imagem |
| **Service worker / uso offline** | Pedido de usuário. O site já é estático e cacheável; um service worker mal versionado serve build velha e é armadilha clássica |
| **Mesclar elencos no import** | Pedido de usuário com um caso concreto que substituição não resolva |
| **Modelar o CI e o GitHub no C4** | Nunca, provavelmente. São ferramentas de desenvolvimento, não runtime, e o diagrama fica mais honesto sem elas |

## 11. Contradições e pendências no material existente

Encontradas ao desenhar. Nenhuma foi corrigida por conta própria — `PRD.md` e `GAME-RULES.md`
não se alteram sem fonte nova (`AGENTS.md:232`).

As três primeiras dependem de observação da comunidade e não de decisão nossa.

1. **GAME-RULES §5 não isola a idade no teste de talento.** O procedimento exige treino
   classe mundial para padronizar aquele multiplicador, mas o sigma medido também carrega o
   fator da §3.2. Testar um jogador de 26 anos e ler a tabela direto o classifica um ou dois
   ranks abaixo do real. A leitura adotada é **dividir o sigma medido pelo fator de idade
   antes de consultar a tabela** — interpretação nossa, não do material da comunidade.
   Registrada como `[PENDENTE]` na §5 do GAME-RULES, com a recomendação de testar antes dos
   22 anos, onde o fator é 1,00 e não há correção a aplicar. **Ação:** validar com a
   comunidade.
2. **GAME-RULES §3.1, tabela de conciliação: "Ruim / Terrível" na mesma linha.** O método 1
   não separa os dois ranks, enquanto a curva os trata como valores distintos (0,163 contra
   0,130 a 100%). Registrada como `[PENDENTE]` na §3.1, com a decisão de oferecer só o
   método 2 nessa faixa. **Ação:** definir o corte, ou manter só o método 2.
3. **GAME-RULES §6 passo 5 versus §3 — o corte de 140%.** A §6 manda tirar da rotação o drill
   acima de ~140%; a §3 diz que acima disso ainda rende, só custa mais. Tratado na §7 acima:
   regra dura do motor é 180%, o corte de 140% é aviso de interface. **Ação:** confirmar a
   leitura, ou ajustar o motor.

**Resolvidas no mesmo pull request que trouxe este documento:** o schema de duas listas do
`AGENTS.md`, substituído pelo modelo da §4; a seção de arquitetura do `AGENTS.md`, que
apontava para a etapa 2 e agora aponta para cá; o `resolveJsonModule` do `tsconfig.json`,
removido por ficar sem uso depois da [ADR 0007](adr/0007-rule-tables-in-typescript.md); e o
`ROADMAP.md`, que agora distingue a fronteira de estado (resolvida aqui) da árvore de
componentes (que continua dependendo da etapa 5).

## 12. Suposições

Cada uma com o que acontece se estiver errada.

| Suposição | Se estiver errada |
|---|---|
| Elenco típico de ~25 jogadores, com 3 a 4 fichas completas de Laboratório por temporada | O cálculo de ~5 KB da §5.3 muda. Só importaria com erro de ~1.000x, que estouraria a quota do `localStorage` |
| A projeção percorre de 30 a 60 sessões no caso comum | Se percorrer milhares, a conta de custo da §7 muda e o Web Worker volta à mesa. O critério de parada por ganho zero limita o pior caso |
| Uma pessoa usa o Lab num aparelho por vez, e exportar/importar cobre a troca | Se houver edição simultânea em dois aparelhos, "importar substitui" (§5.5) faz o usuário perder um lado. É o caso que só backend resolve |
| Mil usuários em uso sazonal cabem folgadamente no plano free da Vercel para um site estático | Se estourar, o mesmo build sobe em GitHub Pages. Custo da troca: baixo, e por isso a ADR 0001 registra a saída |
| O divisor de atributo para overall fica entre 7 e 8 (GAME-RULES §11, duas observações) | A faixa da projeção sai errada. É o risco assumido do produto, já declarado no PRD, e o histórico de testes o reduz com o uso |
| O usuário do Squad cadastra uma posição por jogador, e as até 3 posições só interessam ao Laboratório | Se o Squad também precisar de múltiplas posições, o modelo da §4 já suporta: o array não muda, só o formulário |

## 13. Índice das decisões

| ADR | Decisão | Status |
|---|---|---|
| [0001](adr/0001-static-export-on-vercel.md) | Next.js App Router com export estático, hospedado na Vercel | Aceita |
| [0002](adr/0002-local-storage-persistence.md) | Persistência em `localStorage`, com exportar e importar JSON | Aceita |
| [0003](adr/0003-single-codebase-landscape-mobile.md) | Um codebase, layout paisagem no mobile, sem app nativo | Aceita |
| [0004](adr/0004-framework-free-domain.md) | Domínio isolado de framework | Aceita |
| [0005](adr/0005-toolchain-and-deferred-nextjs.md) | npm, TypeScript estrito, Vitest e ESLint; Next.js adiado para a etapa 6 | Aceita |
| [0006](adr/0006-single-player-registry.md) | Um cadastro só, com a ficha de Laboratório como campo opcional | Aceita |
| [0007](adr/0007-rule-tables-in-typescript.md) | Tabelas de regra em TypeScript `as const`, não em JSON | Aceita |
| [0008](adr/0008-synchronous-iterative-projection.md) | Projeção iterativa síncrona, sem Web Worker | Aceita |
| [0009](adr/0009-react-context-state.md) | Estado em React Context com `useReducer`, sem biblioteca | Aceita |

## 14. Como ver os diagramas

O modelo C4 vive em [`architecture/workspace.dsl`](architecture/workspace.dsl) e é a fonte
única dos diagramas. Ele não foi exportado para imagem nem para Mermaid de propósito: modelo
duplicado sai de sincronia na primeira alteração, e o exportador Mermaid do Structurizr
injeta HTML nos rótulos, que o GitHub não renderiza de forma confiável.

Para ver renderizado, sem instalar nada além do Docker:

```
docker run -it --rm -p 8080:8080 \
  -v "<caminho absoluto de docs/architecture>:/usr/local/structurizr" \
  structurizr/lite
```

| Chave da view | Tipo | O que mostra |
|---|---|---|
| `contexto` | System Context | O jogador, o Lab e o arquivo que ele leva de um aparelho para o outro |
| `containers` | Container | Onde o código roda e onde o dado fica |
| `componentes` | Component | As três camadas e a direção da dependência |
| `fluxoProjecao` | Dynamic | A projeção sessão a sessão, com o caminho de meta inalcançável |
| `fluxoImportacao` | Dynamic | O import com migração, e a falha que não apaga o elenco existente |
