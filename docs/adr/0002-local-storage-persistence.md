# ADR 0002 — Persistência em `localStorage`, com exportar e importar JSON

- **Status:** aceita
- **Data:** 2026-09-07
- **Decide sobre:** onde o dado do usuário fica e como ele se move entre aparelhos

## Contexto

O usuário cadastra o elenco à mão — não existe API do Top Eleven nem forma de importar
jogadores (`AGENTS.md:147`). Esse cadastro é o ativo do produto: se ele se perde, o usuário
recomeça do zero e provavelmente não volta.

O que restringe:

- **Orçamento zero.** Banco gerenciado gratuito hoje é banco cobrado amanhã.
- **Sem conta de usuário.** Backend implicaria autenticação, que é a decisão cara: senha,
  recuperação, sessão, e dado pessoal sob nossa guarda.
- **Portabilidade importa pouco, mas importa.** O jogo é mobile; o usuário às vezes cadastra
  no PC. O dono do projeto já validou que exportar um arquivo resolve o caso dele.

## Decisão

Um único documento JSON no `localStorage` do navegador, e **o mesmo formato** no arquivo de
exportação. Botões de exportar e importar cobrem troca de aparelho e limpeza de navegador.

Quatro regras de manipulação, cada uma existindo para evitar uma perda de dado concreta:

1. **Gravação write-through, síncrona, a cada alteração.** O documento tem ~5 KB; `stringify`
   custa microssegundos. Debounce só criaria a janela em que o usuário fecha a aba e perde o
   que digitou.
2. **A migração de `schemaVersion` roda no mesmo caminho** para o `localStorage` e para o
   import. Dois caminhos significam um deles sem manutenção.
3. **Só se grava por cima depois de o documento migrado estar válido.** Migração que lança
   deixa o bruto intacto, e a interface oferece exportá-lo antes de qualquer coisa.
4. **Versão maior que a conhecida é recusada, não adivinhada.** É um caso real: exportar no
   PC atualizado e importar no celular com a aba antiga em cache.

**Importar substitui, não mescla.** Mesclar exigiria decidir jogador a jogador qual versão
vence, sem relógio confiável nem identidade estável entre aparelhos. O caso de uso real —
levar o elenco de um aparelho para o outro — a substituição resolve inteiro.

## Consequências

**Boas:**

- Custo zero e nenhum dado pessoal saindo do aparelho, o que tira LGPD do escopo.
- Zero latência: toda leitura é síncrona e local.
- O usuário é dono do arquivo. Ele pode versionar, mandar por WhatsApp, guardar no Drive.

**Custos aceitos:**

- **Limpar os dados do navegador apaga o elenco.** É o gargalo real do produto. A mitigação
  não é técnica: o botão de exportar precisa ser óbvio e lembrado, não escondido em ajustes.
- Sem sincronização automática. Editar em dois aparelhos e importar um por cima do outro
  perde um dos lados.
- Um navegador diferente no mesmo aparelho é outro `localStorage`, e o usuário pode estranhar.
- `localStorage` é síncrono e bloqueia a thread. Com ~5 KB isso é irrelevante; com megabytes
  não seria — ver o sinal abaixo.

## Alternativas descartadas

- **Backend com banco e conta de usuário.** Resolve sincronização de verdade, e custa
  autenticação, servidor, dado pessoal e dinheiro. Explicitamente fora da V1 (`PRD.md:75`).
- **IndexedDB.** Assíncrono, sem limite prático de tamanho, e API muito mais pesada para um
  documento de 5 KB. Volta à mesa se o documento passar de ~1 MB ou se for preciso guardar
  imagem.
- **Sincronização por serviço de terceiro** (Drive, Dropbox, Gist). Exige OAuth, chave de
  aplicação e um provedor que pode mudar de política. Complexidade de conta sem ter conta.

## Sinal para revisitar

Documento passando de ~1 MB (IndexedDB); pedido real de sincronização que exportar não
resolva, com alguém financiando o custo (backend); relato de perda de elenco por limpeza de
navegador acontecendo com frequência (reforçar o exportar, não trocar a persistência).
