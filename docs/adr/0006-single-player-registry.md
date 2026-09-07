# ADR 0006 — Um cadastro só, com a ficha de Laboratório como campo opcional

- **Status:** aceita
- **Data:** 2026-09-07
- **Substitui:** o schema de duas listas descrito em `AGENTS.md:153-176`
- **Decide sobre:** como as duas abas compartilham o mesmo jogador

## Contexto

O produto tem duas abas sobre um cadastro só (`AGENTS.md:13`):

- **Squad** usa nome, overall e posição. Cadastro de 3 campos, de propósito: o maior risco de
  adoção é o cadastro manual cansar antes de o usuário ver valor (`PRD.md:89`).
- **Laboratório** usa a ficha completa: idade, até 3 posições, 15 atributos, brancos, talento,
  nível do treinador e histórico de testes. Dimensionado para 3 ou 4 jogadores por temporada,
  que é quanto de maleta verde existe na prática (`PRD.md:61`).

É o mesmo jogador em dois níveis de detalhe. E as duas abas não são ferramentas separadas que
dividem um cadastro: são a mesma estratégia vista de dois lados — treinar só os brancos deixa
o jogador forte em campo e com overall baixo, que é o que derruba a média dos 14
(GAME-RULES §8.1).

O schema descrito hoje no `AGENTS.md` tem **duas listas**, `squad[]` e `laboratorio[]`, cada
uma com `id` próprio. Isso duplica o jogador e não diz como os dois registros se relacionam.

## Decisão

**Uma lista só de jogadores.** A ficha de Laboratório é um campo **sempre presente e
anulável** do jogador: `lab: FichaLab | null`, com `null` para quem existe só no Squad.

Não é propriedade opcional (`lab?: FichaLab`). Com `exactOptionalPropertyTypes` ligado no
`tsconfig.json`, ausente e `null` são tipos diferentes, e a distinção vazaria para a
serialização: `JSON.stringify` omite a chave ausente e preserva o `null`. Um campo sempre
presente dá um formato só no arquivo exportado e uma checagem só no código.

```jsonc
{
  "schemaVersion": 1,
  "jogadores": [
    { "id": "…", "nome": "…", "overall": 78, "posicoes": ["DC"],
      "vendido": false, "lab": null },

    { "id": "…", "nome": "…", "overall": 84, "posicoes": ["MC", "AMC"],
      "vendido": false,
      "lab": { "idade": 19, "atributos": { "…": 0 }, "brancosManuais": null,
               "talento": "otima", "nivelTreinador": "mundial", "testes": [] } }
  ]
}
```

- `lab: null` — o jogador existe só no Squad.
- `lab` preenchido — o jogador foi promovido ao Laboratório.
- `posicoes` é **sempre um array**, mesmo no Squad, onde o formulário grava `["DC"]`.
- **A projeção nunca escreve de volta no cadastro.** Ela devolve uma faixa; o `overall`
  continua sendo o que o usuário leu na tela do jogo.

## Consequências

**Boas:**

- **Não há como os dois registros divergirem**, porque não há dois registros. A pergunta
  "qual dos dois nomes está certo?" deixa de existir.
- **Aprofundar é preencher, não recadastrar.** O usuário cadastra o elenco em 3 campos por
  jogador e depois abre a ficha completa dos 3 ou 4 que vai treinar. O caminho é sempre do
  raso para o detalhado.
- Marcar como vendido no Squad reflete no Laboratório de graça — é o mesmo objeto.
- Um campo, um tipo. O Laboratório precisa da união dos brancos de até 3 posições
  (GAME-RULES §1), e ler isso de um array de um elemento não custa nada.

**Custos aceitos:**

- **`lab` é anulável, e todo código do Laboratório precisa lidar com `null`.** Em troca, o
  tipo passa a dizer a verdade: "este jogador pode não ter ficha", que é o estado normal da
  maioria do elenco.
- A lista carrega dados que o Squad não usa. Com ~25 jogadores e ~5 KB, isso não é problema
  de memória — é só um objeto maior.
- Excluir um jogador do Squad apaga a ficha de Laboratório junto. A interface precisa avisar
  quando houver ficha, porque digitar 15 atributos de novo é caro.

## Alternativas descartadas

- **Duas listas, como no `AGENTS.md` atual.** Duplica o jogador e cria a pergunta insolúvel
  de qual registro vence quando divergirem.
- **Duas listas com o Laboratório referenciando o `id` do Squad.** Resolve a divergência de
  nome, e introduz referência órfã: apagar do Squad deixa ficha apontando para nada, e é
  preciso escrever e testar a integridade referencial à mão.
- **Todo jogador com a ficha completa, atributos zerados.** Elimina o `null`, e enche o
  documento de 15 zeros por jogador, tornando indistinguível "não cadastrei" de "atributo é
  zero de verdade" — e zero é valor legítimo depois da virada de temporada
  (GAME-RULES §7).

## Ação pendente

Atualizar a seção "Schemas de dados" do `AGENTS.md` para este formato. Não foi alterada aqui
porque mudar estrutura de dado é decisão do dono do projeto (`AGENTS.md:232`).
