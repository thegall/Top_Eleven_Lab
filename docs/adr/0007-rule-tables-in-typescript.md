# ADR 0007 — Tabelas de regra em TypeScript `as const`, não em JSON

- **Status:** aceita
- **Data:** 2026-09-07
- **Decide sobre:** onde vivem os 29 drills, a matriz de brancos, a curva de talento e o fator de idade

## Contexto

`docs/GAME-RULES.md` é a fonte única das regras do jogo. A regra de trabalho do repositório é
dura: **nenhuma constante de regra nasce no código, e toda uma delas cita a seção de origem**
(`AGENTS.md:226`).

O que precisa ser transcrito de lá:

| Tabela | Tamanho | Seção |
|---|---|---|
| Os 29 drills: categoria, dificuldade, atributos que contam | 29 linhas | §4, §6 |
| Matriz de brancos por posição | 8 linhas, 7 a 10 atributos cada | §2 |
| Fator de talento por rank | 7 valores | §3.1 |
| Curva de média do exercício | 9 âncoras, interpolação linear | §3.1 |
| Multiplicador de nível do treinador | 4 valores | §3.1 |

Isso é **dado**, não código, e o instinto é colocar em JSON.

O modo de falha mais provável deste projeto não é bug de lógica: é **erro de digitação ao
transcrever tabela de um documento markdown**. Um `"cabeceada"` no lugar de `"cabecada"` na
lista de um drill produz uma média de exercício silenciosamente errada, que é exatamente o
tipo de erro que destrói a confiança num produto cuja proposta é acertar a conta.

## Decisão

As tabelas ficam em **`src/domain/rules/`, em TypeScript com `as const`**, um arquivo por
tabela, cada entrada com comentário citando a seção do `GAME-RULES.md`.

**Fórmula vence tabela quando reproduz a tabela publicada**, e o teste reproduz a tabela:

| Regra | Forma |
|---|---|
| Desgaste por dificuldade (§4) | Fórmula `dificuldade × 0,75` — já implementada |
| Fator de idade (§3.2) | Fórmula com piso — reproduz as 18 linhas |
| Maleta ↔ condicionamento (§9) | Fórmula `teto(gasto ÷ 15)` — já implementada |
| Os 29 drills, brancos por posição, talento, treinador | Tabela — não há fórmula |

## Consequências

**Boas:**

- **O compilador vira o revisor da transcrição.** Com a lista de atributos de um drill tipada
  como `readonly Atributo[]`, escrever `"cabeceada"` é erro de compilação, pego pelo
  `typecheck` do CI antes de qualquer teste rodar. Em JSON, isso só seria pego por uma camada
  de validação em runtime.
- **Comentário por linha citando a seção**, que é o que a regra do repositório exige. JSON não
  aceita comentário: a alternativa seria um campo `"fonte"` por objeto, ou perder a citação.
- Zero dependência nova e zero validação em runtime. O dado é confiável por construção,
  porque veio do build.
- `as const` dá tipos literais, então `Dificuldade` sai como `1 | 2 | 3 | 4 | 5` de graça e o
  `switch` sobre categoria fica exaustivo.

**Custos aceitos:**

- **Quem não lê TypeScript não edita a tabela pelo GitHub.** Aceitável: quem corrige regra de
  jogo aqui é quem mexe no código, e a fonte que a comunidade lê continua sendo o
  `GAME-RULES.md`, que é markdown.
- A tabela não pode ser carregada em runtime nem substituída sem novo deploy. É o que se quer:
  regra do jogo mudando significa mudar o `GAME-RULES.md`, o código e o teste, no mesmo commit.
- Uma armadilha específica ficou registrada em `ARCHITECTURE.md` §6: o fator de idade decai a
  partir de **21**, não de 22. Contar de 22 dá `0,117` aos 35 onde a tabela publicada diz
  `0,050`. O teste que reproduz as 18 linhas existe para proteger contra esse "conserto".

## Alternativas descartadas

- **JSON com `resolveJsonModule`.** Sem comentário, sem tipo literal, e a validação da
  transcrição vira responsabilidade de runtime.
- **JSON mais Zod para validar.** Recupera a validação e adiciona uma dependência e um passo
  em runtime para resolver um problema que o compilador já resolve de graça.
- **Constantes espalhadas pelos módulos que as usam.** Viola a regra de fonte única e faz o
  conserto de um nerf da Nordeus virar caça ao número em vários arquivos.
- **Ler as tabelas direto do `GAME-RULES.md` em tempo de build**, com um script de parsing.
  Elimina a transcrição manual — e cria um parser de markdown para manter, que quebra na
  primeira vez que alguém reformatar uma tabela do documento. Custo maior que o problema.

## Sinal para revisitar

Necessidade de o usuário final editar tabela de regra sem deploy (não prevista); ou tabelas
crescendo a ponto de o arquivo TypeScript ficar impraticável de revisar.
