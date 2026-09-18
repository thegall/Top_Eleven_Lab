# AGENTS.md — Top Eleven Lab (Referência Técnica)

> Referência técnica e regras de trabalho do repositório. Este projeto não usa `CLAUDE.md`: tudo o que um agente precisa saber está aqui.
>
> O **porquê** do produto: [`PRD.md`](PRD.md). As **regras do jogo**: [`docs/GAME-RULES.md`](docs/GAME-RULES.md). As **etapas**: [`docs/ROADMAP.md`](docs/ROADMAP.md). O **estado operacional** (fila, andamento, bloqueador, próximo passo) vive no [projeto Linear Top Eleven Lab](https://linear.app/thegal/project/top-eleven-lab-f4819f00d0c5) — os docs do git não espelham o board.
>
> Este arquivo descreve o sistema. Quando o código e este arquivo discordarem, um dos dois está errado. Resolva antes de seguir.

## Visão geral

Calculadora de treino e de elenco para o jogo mobile Top Eleven, feita para a comunidade brasileira. Site estático, sem backend e sem conta de usuário: tudo roda no navegador do jogador.

Duas abas sobre um cadastro só:

- **Squad** — simula a média dos 14 jogadores mais fortes, que é o número pelo qual o jogo emparelha a temporada seguinte. Marcar um jogador como vendido recalcula a média e mostra quem sobe para a lista.
- **Laboratório** — recomenda quais dos 29 exercícios treinar em cada um dos 6 slots da sessão, e estima ganho e custo em maletas verdes.

```
[Jogador digita elenco] → [localStorage] → [motor de domínio] → [recomendação + estimativa]
                              ↑                                          ↓
                        [import JSON]                            [export JSON]
```

O que faz o produto ter valor não é a interface — é o motor. Ele é determinístico e as fórmulas estão todas em `docs/GAME-RULES.md`, com as validações de campo que cada uma passou.

## Arquitetura dos arquivos

A árvore de diretórios e as decisões que a sustentam estão em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), com uma ADR por decisão cara de reverter em [`docs/adr/`](docs/adr/). O resumo da fronteira:

```
interface → React, Next.js, formatação, layout paisagem
aplicação → estado, persistência, migração, exportar/importar
domínio   → cálculo puro, sem I/O e sem framework
regras    → as tabelas transcritas do GAME-RULES
```

Dependência aponta só para dentro: interface conhece aplicação, aplicação conhece domínio, domínio não conhece ninguém.

**O motor de domínio é TypeScript puro.** Não importa React, não lê `window`, não conhece `localStorage`, não formata número para exibição. Recebe dados, devolve dados. É por isso que ele é testável sem navegador e é por isso que ele é a primeira coisa a ser construída.

## Fluxos principais

### Fluxo 1 — Recomendação de treino

```
1. Usuário cadastra jogador: idade, posições, 15 atributos
2. Brancos são derivados da matriz de posições (GAME-RULES §2) e ficam editáveis
3. Para cada um dos 29 drills: descartar atributos de goleiro, calcular a média
   do exercício sobre o que sobrou, classificar em primário/secundário/terciário
4. Ordenar os primários pela menor média (mais longe do teto de 180%)
5. Preencher os 6 slots, repetindo drill quando houver menos de 6 primários
6. Calcular ganho e custo da sessão (GAME-RULES §3.1, §3.2, §4, §9)
7. Recalcular todas as médias e repetir, até a meta de overall
```

O passo 7 é o que separa este produto de uma planilha: subir um atributo empurra a média de **todo** drill que o contém (efeito cascata), então a projeção precisa ser iterativa, nunca uma multiplicação linear.

### Fluxo 2 — Simulação de venda

```
1. Usuário cadastra o elenco: nome, overall, posição
2. Ordenar por overall, cortar no 14º
3. Média = soma dos 14 maiores ÷ 14
4. Usuário marca jogadores como vendidos → refazer 2 e 3
5. Exibir quem entrou na lista dos 14 no lugar do vendido
```

Elenco com menos de 14 jogadores completa a lista com o que tiver — inclusive overall baixíssimo. É exatamente isso que a estratégia explora, então não é caso de erro.

### Fluxo 3 — Teste de talento

```
1. Usuário treina habilidade especial ou posição nova e anota 1, 2 ou 3 em cada uma das 6 sessões
2. App classifica só pela sequência (GAME-RULES §5, método 1) — idade não entra
3. Qualquer 3 → Fenômeno; `1 1 1 1 1 1` → Bagre; demais linhas da tabela
4. Sequência que não casa é recusada, em vez de devolver um rank errado
```

O Lab V1 **não** oferece o teste por ganho de pontos (método 2). `classificarTalento` (sigma) permanece no motor para a curva e para quem medir fora da UI; Ruim e Terrível continuam ranks distintos nessa curva. Bagre **não** mapeia para nenhum dos dois.

## Contratos internos

Os tipos abaixo são o contrato entre o domínio e o resto. Cada função corresponde a uma seção do GAME-RULES, que é onde está a fórmula e a validação de campo.

```ts
type Atributo =
  | 'corte' | 'marcacao' | 'posicionamento' | 'cabecada' | 'coragem'
  | 'passe' | 'drible' | 'cruzamento' | 'chute' | 'finalizacao'
  | 'condicionamento' | 'forca' | 'agressividade' | 'velocidade' | 'criatividade';

type Posicao = 'GK' | 'DL' | 'DC' | 'DR' | 'DMC' | 'ML' | 'MC' | 'MR'
             | 'AML' | 'AMC' | 'AMR' | 'ST';

type RankTalento = 'terrivel' | 'ruim' | 'normal' | 'boa'
                 | 'otima' | 'excelente' | 'fenomeno';

type NivelTreinador = 'amador' | 'semiprofissional' | 'profissional' | 'mundial';

type Dificuldade = 1 | 2 | 3 | 4 | 5;   // desgaste = Dificuldade × 0,75%

interface Drill {
  nome: string;
  categoria: 'ataque' | 'defesa' | 'posse' | 'fisico';
  dificuldade: Dificuldade;
  atributos: Atributo[];      // já sem os de goleiro — GAME-RULES §6
  soDeGoleiro: boolean;       // Treino de Goleiro: nunca válido para jogador de linha
}
```

| Função | Entrada → saída | Regra |
|---|---|---|
| `brancosDaPosicao` | `Posicao[]` → `Set<Atributo>` | União das posições. GAME-RULES §2 |
| `mediaExercicio` | jogador, drill → `number` | Soma ÷ quantidade, só atributos válidos. §3 |
| `classificarDrill` | jogador, drill → `'primario' \| 'secundario' \| 'terciario' \| 'invalido'` | §4 |
| `sigma` | rank, média → `number` | Tabela de ganho, interpolação linear. §3.1 |
| `fatorIdade` | `number` → `number` | 1,00 até 21 anos; −0,0679/ano até 0,05 aos 35. §3.2 |
| `ganhoSessao` | jogador, slots, nível → pontos por atributo | §3.1 × §3.2 × nível |
| `custoEmMaletas` | condicionamento `%` → `number` | `teto(gasto ÷ 15)`. §9 |
| `montarCronograma` | jogador → `Drill[6]` | Menor média primeiro. §6 |
| `projetarAteMeta` | jogador, overall alvo → faixa de sessões | Iterativo, recalcula cascata. §11 |
| `mediaDos14` | `Jogador[]` → `number` | Soma dos 14 maiores ÷ 14, ignorando os vendidos. §8 |
| `applySeasonTurnover` | atributos → atributos | Retira 20 de cada atributo, com piso em zero. §7 |
| `classificarTalentoPorHabilidadeEspecial` | 6 sessões 1/2/3 → rank visual (inclui `bagre`) | §5, método 1 — UI da V1 |
| `classificarTalento` | soma de 5 sessões, drill, média → `RankTalento` | §5, método 2 — motor, fora da UI |

**Invariantes que o motor não pode violar:**

- Atributo de goleiro nunca entra no cálculo de jogador de linha — nem no numerador, nem no denominador.
- Exercício com média em 180% rende **zero**. A planilha da comunidade erra nisso; nós não.
- `classificarTalentoPorHabilidadeEspecial` classifica só pela sequência; idade não entra; Bagre não mapeia para Ruim nem Terrível.
- `classificarTalento` recusa entrada quando as condições de validade não são atendidas, em vez de devolver um rank errado. Fica no motor; a UI da V1 não o chama.
- Toda projeção sai como **faixa**, nunca como número exato — a conversão de atributo em overall é o único elo estimado do modelo (GAME-RULES §11).

## Casos de teste que vêm prontos do GAME-RULES

Estes não são exemplos ilustrativos: são medições de campo que o motor tem que reproduzir. São a primeira bateria de testes, escrita antes do código.

| Caso | Entrada | Saída esperada | Fonte |
|---|---|---|---|
| Cronograma de MC | 9 brancos de MC | Exatamente 8 drills primários, os mesmos do vídeo | §6 |
| Teste de talento | 31 pontos, Pressione o Play, média 55% | Rank `otima` | §5 |
| Treino inflado | Os 6 drills da §8.2 | Cobertura de 15/15 atributos | §8.2 |
| Brancos de ML | `['ML']` | 7 brancos, sem Chute | §2 |
| Brancos de ML+MC | `['ML','MC']` | Chute presente | §2, fórum oficial |
| Desgaste | Os 29 drills | `dificuldade × 0,75%` para todos | §4 |
| Custo em maletas | Fenômeno, +8 atributos, média 100% | 2 maletas; 3 a 140%; 6 a 160% | §9 |

## Integrações externas

**Nenhuma, por decisão.** O Top Eleven não tem API pública e não existe forma de importar elenco. Todo dado é digitado pelo usuário e fica no navegador dele. O projeto não faz requisição de rede em runtime — se algum dia fizer, este é o parágrafo a reescrever primeiro.

## Schemas de dados

Um documento no `localStorage`, e o mesmo formato no arquivo de exportação. `schemaVersion` existe para permitir migração sem perder o elenco de quem já usa.

**Uma lista só de jogadores.** As duas abas são o mesmo jogador em dois níveis de detalhe, e a ficha de Laboratório é um campo opcional — ver [ADR 0006](docs/adr/0006-single-player-registry.md).

```jsonc
{
  "schemaVersion": 2,
  "jogadores": [
    {
      "id": "…",
      "nome": "…",
      "idade": null,                  // null = cadastro migrado da versão 1
      "overall": 78,
      "posicoes": ["DC"],
      "vendido": false,
      "lab": null                     // null = existe só no Squad
    },
    {
      "id": "…",
      "nome": "…",
      "idade": 19,
      "overall": 84,
      "posicoes": ["MC", "AMC"],      // até 3 — GAME-RULES §1
      "vendido": false,
      "lab": {                        // preenchido = promovido ao Laboratório
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

| Campo | Tipo | Significado |
|---|---|---|
| `schemaVersion` | `number` | Versão do formato. Migração roda na leitura |
| `idade` | `number \| null` | Inteiro de 18 a 35; `null` apenas após migração da versão 1 |
| `posicoes` | `Posicao[]` | Sempre array, mesmo com uma posição só. Até 3 |
| `vendido` | `boolean` | Estado de simulação, não é exclusão. Reversível |
| `lab` | `FichaLab \| null` | `null` = o jogador existe só no Squad |
| `brancosManuais` | `Atributo[] \| null` | `null` = derivar da união das posições. Preenchido = usuário corrigiu |
| `talento` | `RankTalento \| 'bagre' \| null` | `null` = não classificado; `bagre` é rank visual do método 1 (GAME-RULES §5), fora da curva |
| `testes[]` | `Teste[]` | Histórico. É o que vai apertar a estimativa com o uso (PRD, riscos) |

Overall **não** é derivado dos atributos: o usuário digita o que o jogo mostra. A fórmula real da Nordeus não é conhecida, e inventá-la produziria número errado numa tela em que o usuário compara com o jogo aberto do lado.

## Decisões de infraestrutura

- **Next.js App Router com export estático, na Vercel.** Não há backend nem necessidade de SSR — o Next entra pelo deploy trivial e pelo SEO da landing, que importa porque a distribuição do produto é alguém achar e compartilhar no grupo da comunidade. Reverter para Vite é barato enquanto não houver rota dinâmica.
- **Persistência em `localStorage`, com exportar e importar JSON.** Sem conta, sem servidor, sem custo, sem dado pessoal e sem LGPD. O botão de exportar é o que cobre troca de aparelho e limpeza de navegador. Reverter para backend significa introduzir autenticação — decisão cara, fica para uma V2 que tenha motivo.
- **Um codebase, layout paisagem no mobile.** O jogo é mobile e horizontal; o Lab acompanha. Sem app nativo: não usa câmera, notificação nem nada de hardware, então loja e build nativo seriam custo puro.
- **Domínio isolado de framework.** É o que torna o motor testável sem navegador e o que permite trocar a camada de UI sem tocar em regra de jogo. Também é o que deixa o projeto legível para quem chegar pelo GitHub.
- **`docs/GAME-RULES.md` é fonte única de regra de jogo.** Nenhuma constante de jogo é inventada no código: toda uma delas aponta para uma seção do documento. A Nordeus muda mecânica sem avisar, e quando isso acontecer o conserto tem que ter um lugar só.

## Como trabalhar neste repositório

Regras de trabalho válidas para qualquer pessoa ou agente que mexer no projeto.

### Linear e documentação

- **Linear** (projeto [Top Eleven Lab](https://linear.app/thegal/project/top-eleven-lab-f4819f00d0c5), time Thegal) é a fonte de verdade do estado operacional: o que está na fila, o que está em andamento, o que bloqueia, o que vem a seguir.
- Os documentos no git são contratos, regras, roadmap estável e, se um dia existir, ledger de evidência — **não** um segundo kanban.
- Não criar `PROGRESS.md` nem qualquer arquivo que espelhe colunas do board (In Progress, próximo passo, bloqueador atual).
- Não sincronizar Linear ↔ markdown. Se um ledger de evidência for criado, o cabeçalho aponta ao Linear e o corpo fica histórico; o estado vivo não mora nele.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) é o plano de produto (etapas da V1). Não apagar. Não tratar como board.

### Idioma

- Documentação, comentários, interface e **mensagens de commit** em português do Brasil, com acentuação correta. Nunca substituir caractere acentuado por equivalente ASCII.
- Código, identificadores e nomes de arquivo em inglês.
- No commit, só o prefixo de tipo fica em inglês (`feat:`, `fix:`, `docs:`…), porque é palavra-chave do padrão Conventional Commits. O resto da mensagem é português.
- Termos de domínio ficam como a comunidade fala, mesmo dentro de código em inglês: `maleta`, `drill`, `branco`, `cinza`, `mutante`. Traduzir isso afasta quem for ler.
- A licença fica em inglês, que é o texto canônico da MIT. A tradução no mesmo arquivo é informativa.

### Git

- Commits semânticos: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`, `style:`.
- **Commitar só quando pedido.** Nunca commitar por iniciativa própria.
- Trabalhar em branch, nunca direto na `main`. Uma branch por etapa do roadmap, nomeada `<tipo>/<descrição-curta>` em inglês, com o tipo casando com o prefixo do commit: `chore/setup-ci`, `feat/squad-tab`, `docs/architecture`.
- A `main` tem branch protection exigindo status checks do CI (job Qualidade) verdes antes do merge. Sem check verde, o merge não passa.
- **Merge é sempre humano.** Agente abre pull request e para. Não mergeia, não fecha PR alheio, não faz push direto na `main`. A revisão antes do merge é o último ponto em que alguém olha o que entrou no projeto, e ele não é automatizável.

### Testes

- TDD: o teste vem antes da implementação. A tabela de casos acima é o ponto de partida do motor.
- Nenhum caso de teste do motor é inventado. Cada um sai de uma medição registrada em `docs/GAME-RULES.md`, com a seção citada no próprio teste.
- Teste que passou a falhar depois de uma mudança de regra do jogo é sinal de que `docs/GAME-RULES.md` mudou e o motor não acompanhou, ou o contrário. Descobrir qual antes de ajustar o número esperado.

### Código

- Sem `console.log` em código final.
- Sem credencial, token ou URL sensível no código. Se algum dia houver, vai para variável de ambiente.
- Nenhuma constante de regra de jogo nasce no código. Toda uma delas vem de `docs/GAME-RULES.md` e cita a seção de origem em comentário.
- O domínio não importa React, não lê `window`, não toca em `localStorage` e não formata número para exibição.
- Sem abstração para uso único, sem camada de configuração para valor que nunca muda, sem tratamento de erro para cenário impossível.

### Perguntar antes de

Deletar arquivo, sobrescrever dado, mudar estrutura de pastas, mudar persistência, e alterar qualquer regra em `docs/GAME-RULES.md` sem fonte nova que sustente a mudança.
