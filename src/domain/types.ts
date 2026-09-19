/** Tipos compartilhados do motor de domínio. Ver AGENTS.md § Contratos internos. */

/**
 * Os 5 atributos do bloco ATRIBUTOS, iguais para jogador de linha e goleiro
 * (GAME-RULES §2).
 */
export type AtributoComum =
  | 'condicionamento'
  | 'forca'
  | 'agressividade'
  | 'velocidade'
  | 'criatividade';

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
  | AtributoComum;

/**
 * Os 10 atributos do bloco DEFESA DO GOL, exclusivos do goleiro (GAME-RULES §2).
 * `chutar` é o tiro de meta do goleiro e não se confunde com `chute`, do jogador
 * de linha.
 */
export type AtributoGoleiroExclusivo =
  | 'reflexos'
  | 'agilidade'
  | 'antecipacao'
  | 'sairNaBola'
  | 'comunicacao'
  | 'arremesso'
  | 'chutar'
  | 'espalmar'
  | 'jogoAereo'
  | 'concentracao';

/** Os 15 atributos de um goleiro: os 10 do gol mais os 5 comuns (GAME-RULES §2). */
export type AtributoGoleiro = AtributoGoleiroExclusivo | AtributoComum;

/** As onze posições de linha (GAME-RULES §1). Goleiro tem a ficha própria de GK. */
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
