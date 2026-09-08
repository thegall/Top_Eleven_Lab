/** Tipos compartilhados do motor de domínio. Ver AGENTS.md § Contratos internos. */

/** Os 15 atributos de um jogador de linha (GAME-RULES §2). */
export type Atributo =
  | 'corte'
  | 'marcacao'
  | 'posicionamento'
  | 'cabecada'
  | 'coragem'
  | 'passe'
  | 'drible'
  | 'cruzamento'
  | 'chute'
  | 'finalizacao'
  | 'condicionamento'
  | 'forca'
  | 'agressividade'
  | 'velocidade'
  | 'criatividade';

/** As onze posições de linha (GAME-RULES §1). Goleiro fora do escopo do Laboratório. */
export type Posicao =
  | 'DL'
  | 'DC'
  | 'DR'
  | 'DMC'
  | 'ML'
  | 'MC'
  | 'MR'
  | 'AML'
  | 'AMC'
  | 'AMR'
  | 'ST';

/** Ranks de talento, do pior para o melhor (GAME-RULES §3.1 e §5). */
export type RankTalento =
  | 'terrivel'
  | 'ruim'
  | 'normal'
  | 'boa'
  | 'otima'
  | 'excelente'
  | 'fenomeno';
