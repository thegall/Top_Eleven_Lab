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

/** Liga/desliga uma posição respeitando o teto de 3 e o mínimo de 1 (GAME-RULES §1). */
export function alternarPosicao(
  atuais: readonly PosicaoJogador[],
  alvo: PosicaoJogador,
): PosicaoJogador[] {
  if (atuais.includes(alvo)) {
    if (atuais.length === 1) return [...atuais];
    return atuais.filter((posicao) => posicao !== alvo);
  }
  if (atuais.length >= 3) return [...atuais];
  return [...atuais, alvo];
}
