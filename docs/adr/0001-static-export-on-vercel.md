# ADR 0001 — Next.js com App Router e export estático, hospedado na Vercel

- **Status:** aceita
- **Data:** 2026-09-07
- **Decide sobre:** como o produto é construído e entregue ao usuário

## Contexto

O Top Eleven Lab é uma calculadora que roda inteira no navegador. Não há backend, não há
conta de usuário, e o projeto não faz nenhuma requisição de rede em runtime.

Três restrições mandam aqui, e nenhuma é técnica:

- **Orçamento zero, não negociável.** Nenhum serviço pago e nenhum plano gratuito que possa
  virar cobrança se o uso crescer.
- **Escala máxima de ordem de mil pessoas**, em uso sazonal concentrado na virada de
  temporada (`PRD.md:21`). Não é um produto que vai escalar.
- **A distribuição depende de SEO.** O produto se espalha por alguém achar o Lab e
  compartilhar no grupo da comunidade. A landing precisa ser indexável.

## Decisão

Next.js com App Router, configurado em **export estático** (`output: 'export'`), hospedado
na **Vercel no plano gratuito**.

Sem SSR, sem Server Actions, sem rota de API, sem middleware. O build produz HTML, CSS e JS
estáticos, e o servidor só entrega arquivo.

## Consequências

**Boas:**

- Custo permanentemente zero. Site estático não tem execução de servidor para cobrar, o que
  elimina a possibilidade de o plano gratuito virar fatura.
- Deploy é `git push`. Sem esteira de infraestrutura para manter.
- SEO resolvido pelo HTML pré-renderizado no build.
- Sem servidor não há superfície de ataque de servidor, não há segredo para vazar e não há
  dado de usuário sob nossa guarda.

**Custos aceitos:**

- **Nenhuma leitura de `localStorage` pode acontecer durante a renderização.** O HTML é
  gerado no build, quando `localStorage` não existe. O documento do usuário só chega depois
  da montagem, então o primeiro render é sempre o estado vazio e a interface precisa de um
  estado de carregamento honesto — ver `ARCHITECTURE.md` §5.2.
- Next.js é framework grande para um app de duas telas. O peso se paga pelo deploy trivial e
  pelo SEO; se um dia não se pagar, a saída está registrada abaixo.
- A primeira rota dinâmica que alguém propuser quebra o export estático. Isso é intencional:
  é o ponto em que esta ADR precisa ser revisitada, não contornada.

## Alternativas descartadas

- **Vite + React, em GitHub Pages.** Mais leve e igualmente gratuito, e continua sendo a
  saída se a Vercel mudar de política ou se o peso do Next incomodar. Descartada agora por
  não entregar SEO de graça, que é o canal de distribuição do produto. **Reverter é barato
  enquanto não houver rota dinâmica** — o domínio e a camada de estado não mudam.
- **Next.js com SSR ou rota de API.** Exige execução de servidor, que é exatamente o que faz
  plano gratuito virar cobrança. E não há nada para o servidor fazer: todo dado é do usuário
  e mora no aparelho dele.
- **Netlify, Cloudflare Pages.** Equivalentes para este caso. A escolha da Vercel é por
  familiaridade com o Next, não por vantagem técnica.

## Sinal para revisitar

Comunidade financiando o custo de operação **e** um caso de uso real que exija servidor;
limite do plano gratuito sendo alcançado; ou proposta de rota dinâmica.
