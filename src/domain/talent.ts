/**
 * Curva de ganho por talento e média do exercício, e teste de talento pelo
 * método 2 (GAME-RULES §3.1 e §5).
 */
import type { Drill } from './drills.js';
import { conditionCostPerSlot } from './training.js';
import type { RankTalento } from './types.js';

/** Colunas de média do exercício da tabela da curva de ganho. */
const MEDIA_COLUMNS = [20, 40, 60, 80, 100, 120, 140, 160, 180] as const;

/**
 * sigma = pontos de atributo ganhos por 1% de condicionamento gasto, em
 * treino classe mundial. Aos 180% o exercício trava — a coluna original da
 * planilha repete o valor de 160%, o que a GAME-RULES corrige para zero.
 */
const SIGMA_TABLE: Record<RankTalento, number[]> = {
  fenomeno: [0.6, 0.6, 0.55, 0.525, 0.425, 0.325, 0.2, 0.1, 0],
  excelente: [0.39, 0.39, 0.358, 0.341, 0.276, 0.211, 0.13, 0.065, 0],
  otima: [0.321, 0.321, 0.294, 0.281, 0.228, 0.174, 0.107, 0.054, 0],
  boa: [0.298, 0.298, 0.273, 0.261, 0.211, 0.162, 0.099, 0.05, 0],
  normal: [0.275, 0.275, 0.252, 0.241, 0.195, 0.149, 0.092, 0.046, 0],
  ruim: [0.229, 0.229, 0.21, 0.201, 0.163, 0.124, 0.076, 0.038, 0],
  terrivel: [0.184, 0.184, 0.168, 0.161, 0.13, 0.099, 0.061, 0.031, 0],
};

/** Ranks do melhor para o pior — ordem que {@link classificarTalento} percorre. */
const RANKS_DO_MELHOR_PARA_O_PIOR: RankTalento[] = [
  'fenomeno',
  'excelente',
  'otima',
  'boa',
  'normal',
  'ruim',
  'terrivel',
];

/** sigma(talento, média do exercício), interpolando linearmente entre colunas. */
export function sigma(talento: RankTalento, mediaDoExercicio: number): number {
  const tabela = SIGMA_TABLE[talento];
  if (mediaDoExercicio >= 180) return 0;
  if (mediaDoExercicio <= MEDIA_COLUMNS[0]) return tabela[0]!;

  let i = 0;
  while (i < MEDIA_COLUMNS.length - 1 && MEDIA_COLUMNS[i + 1]! < mediaDoExercicio) i++;

  const colunaEsquerda = MEDIA_COLUMNS[i]!;
  const colunaDireita = MEDIA_COLUMNS[i + 1]!;
  const fracao = (mediaDoExercicio - colunaEsquerda) / (colunaDireita - colunaEsquerda);
  return tabela[i]! + fracao * (tabela[i + 1]! - tabela[i]!);
}

/**
 * Classifica o talento pelo método 2: soma de pontos em 5 sessões de um drill
 * primário, convertida em sigma e localizada na curva (GAME-RULES §5).
 *
 * Recusa entrada fora das condições de validade do método — média do
 * exercício precisa estar abaixo de 80%, senão o teto de 180% já interfere e
 * o teste dá falso negativo.
 */
export function classificarTalento(
  somaDe5Sessoes: number,
  drill: Drill,
  mediaDoExercicio: number,
): RankTalento {
  if (mediaDoExercicio >= 80) {
    throw new Error('Teste de talento inválido: média do exercício precisa estar abaixo de 80% (GAME-RULES §5).');
  }
  if (drill.soDeGoleiro) {
    throw new Error('Teste de talento inválido: drill precisa ser válido para jogador de linha (GAME-RULES §5).');
  }

  const desgastePorSlot = conditionCostPerSlot(drill.dificuldade);
  const sigmaMedido = somaDe5Sessoes / (5 * 6 * desgastePorSlot);

  for (const rank of RANKS_DO_MELHOR_PARA_O_PIOR) {
    if (sigma(rank, mediaDoExercicio) <= sigmaMedido) return rank;
  }
  return 'terrivel';
}
