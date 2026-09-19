/**
 * O caminho do goleiro: ficha de 15 atributos em 2 blocos, brancos próprios e
 * classificação de exercício sobre os atributos que valem para GK.
 *
 * Fonte das constantes: GAME-RULES §2 ("Atributos de goleiro" e "Brancos do
 * goleiro"). Nenhuma nasce aqui.
 */
import {
  ALL_DRILLS,
  classificarPorAtributos,
  mediaDeAtributos,
  preencherSlots,
  type ClasseDrill,
  type Drill,
  type DrillClassificado,
} from './drills';
import type { AtributoComum, AtributoGoleiro, AtributoGoleiroExclusivo } from './types';

/** Bloco DEFESA DO GOL, os 10 exclusivos do goleiro (GAME-RULES §2). */
export const ATRIBUTOS_DO_GOL: readonly AtributoGoleiroExclusivo[] = [
  'reflexos',
  'agilidade',
  'antecipacao',
  'sairNaBola',
  'comunicacao',
  'arremesso',
  'chutar',
  'espalmar',
  'jogoAereo',
  'concentracao',
];

/** Bloco ATRIBUTOS, idêntico ao do jogador de linha (GAME-RULES §2). */
export const ATRIBUTOS_COMUNS: readonly AtributoComum[] = [
  'condicionamento',
  'forca',
  'agressividade',
  'velocidade',
  'criatividade',
];

/** Os 15 do goleiro, na ordem dos 2 blocos da tela do jogo (GAME-RULES §2). */
export const ATRIBUTOS_GOLEIRO: readonly AtributoGoleiro[] = [
  ...ATRIBUTOS_DO_GOL,
  ...ATRIBUTOS_COMUNS,
];

/**
 * Os 11 brancos do goleiro: os 10 do gol mais Condicionamento. Cinzas são
 * Força, Agressividade, Velocidade e Criatividade (GAME-RULES §2, "Brancos do
 * goleiro" — fonte: dono do repositório, 2026-09-17).
 */
export const GOALKEEPER_WHITES: readonly AtributoGoleiro[] = [
  ...ATRIBUTOS_DO_GOL,
  'condicionamento',
];

/** Contraparte de `brancosDaPosicao` para o goleiro: a posição é uma só. */
export function brancosDoGoleiro(): Set<AtributoGoleiro> {
  return new Set(GOALKEEPER_WHITES);
}

const COMUNS = new Set<string>(ATRIBUTOS_COMUNS);

/**
 * O que conta para um goleiro num exercício: os atributos marcados com ° na
 * §4 mais os do bloco ATRIBUTOS que o exercício ofereça. Os 10 exclusivos de
 * linha ficam fora, espelhando a regra do jogador de linha (GAME-RULES §2 e §4).
 */
export function atributosValidosGoleiro(drill: Drill): AtributoGoleiro[] {
  const comuns = drill.atributos.filter((atributo): atributo is AtributoComum =>
    COMUNS.has(atributo),
  );
  return [...drill.atributosGoleiro, ...comuns];
}

/** Média do exercício para goleiro (GAME-RULES §3). */
export function mediaExercicioGoleiro(
  atributosGoleiro: Record<AtributoGoleiro, number>,
  drill: Drill,
): number {
  const validos = atributosValidosGoleiro(drill);
  if (validos.length === 0) {
    throw new Error(`Drill inválido para goleiro: ${drill.nome}.`);
  }
  return mediaDeAtributos(atributosGoleiro, validos);
}

/** Classificação de um drill para goleiro (GAME-RULES §4). */
export function classificarDrillGoleiro(
  brancos: Set<AtributoGoleiro>,
  drill: Drill,
): ClasseDrill {
  return classificarPorAtributos(brancos, atributosValidosGoleiro(drill));
}

/**
 * Os drills válidos para um goleiro, da menor média para a maior. Inclui o
 * Treino de Goleiro, que só é inválido para jogador de linha (GAME-RULES §4).
 */
export function classificarDrillsDeGoleiro(
  atributosGoleiro: Record<AtributoGoleiro, number>,
  brancos: Set<AtributoGoleiro>,
): DrillClassificado[] {
  return ALL_DRILLS.map((drill) => {
    const validos = atributosValidosGoleiro(drill);
    return {
      drill,
      media: validos.length === 0 ? Number.NaN : mediaDeAtributos(atributosGoleiro, validos),
      classe: classificarPorAtributos(brancos, validos),
    };
  })
    .filter((item) => item.classe !== 'invalido')
    .sort((a, b) => a.media - b.media);
}

/** Os 6 slots recomendados para um goleiro (GAME-RULES §6). */
export function montarCronogramaGoleiro(
  atributosGoleiro: Record<AtributoGoleiro, number>,
  brancos: Set<AtributoGoleiro>,
): Drill[] {
  return preencherSlots(classificarDrillsDeGoleiro(atributosGoleiro, brancos)).map(
    (item) => item.drill,
  );
}
