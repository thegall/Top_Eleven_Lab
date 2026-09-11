/**
 * Curva de ganho por talento e média do exercício, e testes de talento
 * (GAME-RULES §3.1 e §5): método 1 (habilidade especial) e método 2 (atributos).
 */
import { classificarDrill, type Drill } from './drills';
import { conditionCostPerSlot } from './training';
import type { Atributo, RankTalento } from './types';

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
 * Recusa entrada fora das condições de validade do método — drill precisa
 * ser primário para os brancos do jogador, e a média do exercício precisa
 * estar abaixo de 80%, senão o teto de 180% já interfere e o teste dá falso
 * negativo.
 */
export function classificarTalento(
  somaDe5Sessoes: number,
  drill: Drill,
  brancos: Set<Atributo>,
  mediaDoExercicio: number,
): RankTalento {
  if (classificarDrill(brancos, drill) !== 'primario') {
    throw new Error('Teste de talento inválido: drill precisa ser primário para o jogador (GAME-RULES §5).');
  }
  if (mediaDoExercicio >= 80) {
    throw new Error('Teste de talento inválido: média do exercício precisa estar abaixo de 80% (GAME-RULES §5).');
  }

  const desgastePorSlot = conditionCostPerSlot(drill.dificuldade);
  const sigmaMedido = somaDe5Sessoes / (5 * 6 * desgastePorSlot);

  for (const rank of RANKS_DO_MELHOR_PARA_O_PIOR) {
    if (sigma(rank, mediaDoExercicio) <= sigmaMedido) return rank;
  }
  return 'terrivel';
}

export type ResultadoHabilidadeEspecial =
  | { rank: RankTalento }
  | { rank: null; motivo: 'ruim-terrivel' };

function casaComPadrao(pontos: readonly number[], padrao: readonly number[]): boolean {
  return pontos.every((ponto, i) => ponto === padrao[i % padrao.length]);
}

/**
 * Classifica o talento pelo método 1: pontos ganhos por sessão (1, 2 ou 3)
 * ao treinar habilidade especial ou posição nova (GAME-RULES §5).
 *
 * Predominantemente 1 não devolve Ruim nem Terrível — o método visual não
 * separa os dois (GAME-RULES §3.1 [PENDENTE], THE-37).
 */
export function classificarTalentoPorHabilidadeEspecial(
  pontosPorSessao: readonly number[],
): ResultadoHabilidadeEspecial {
  if (pontosPorSessao.length === 0) {
    throw new Error('Teste de talento inválido: informe os pontos de pelo menos uma sessão (GAME-RULES §5).');
  }
  for (const ponto of pontosPorSessao) {
    if (ponto !== 1 && ponto !== 2 && ponto !== 3) {
      throw new Error('Teste de talento inválido: cada sessão rende 1, 2 ou 3 pontos (GAME-RULES §5).');
    }
  }

  if (pontosPorSessao.includes(3)) return { rank: 'fenomeno' };
  if (pontosPorSessao.every((ponto) => ponto === 2)) return { rank: 'excelente' };

  const media = pontosPorSessao.reduce((soma, n) => soma + n, 0) / pontosPorSessao.length;
  if (media <= 1.29) return { rank: null, motivo: 'ruim-terrivel' };

  if (pontosPorSessao[0] === 1 && pontosPorSessao.slice(1).every((ponto) => ponto === 2)) {
    return { rank: 'otima' };
  }
  if (pontosPorSessao.every((ponto, i) => ponto === (i % 2 === 0 ? 1 : 2))) {
    return { rank: 'normal' };
  }
  if (casaComPadrao(pontosPorSessao, [1, 2, 2])) return { rank: 'boa' };

  throw new Error('Teste de talento inválido: sequência não casa com nenhum padrão da GAME-RULES §5.');
}
