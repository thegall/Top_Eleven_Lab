import type { PosicaoJogador } from '../state/schema';

const DEFESA = new Set<PosicaoJogador>(['DL', 'DC', 'DR']);
const ATAQUE = new Set<PosicaoJogador>(['ST', 'AMC', 'AML', 'AMR']);

/** Classe CSS do badge de posição — agrupamento visual, não regra de jogo. */
export function classeBadgePosicao(posicao: PosicaoJogador): string {
  if (posicao === 'GK') return 'pos pos--gk';
  if (DEFESA.has(posicao)) return 'pos pos--def';
  if (ATAQUE.has(posicao)) return 'pos pos--atk';
  return 'pos';
}
