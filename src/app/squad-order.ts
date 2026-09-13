import type { Jogador, PosicaoJogador } from '../state/schema';

export type SquadOrder = 'overall' | 'name' | 'age' | 'position';

/** Ordem tática do campo, de trás para frente — não é alfabética. */
export const POSITION_FIELD_ORDER: readonly PosicaoJogador[] = [
  'GK',
  'DL',
  'DC',
  'DR',
  'DMC',
  'ML',
  'MC',
  'MR',
  'AML',
  'AMC',
  'AMR',
  'ST',
];

const POSITION_RANK = new Map<PosicaoJogador, number>(
  POSITION_FIELD_ORDER.map((posicao, index) => [posicao, index]),
);

const collator = new Intl.Collator('pt-BR', {
  sensitivity: 'base',
  numeric: true,
});

function compareNames(a: Jogador, b: Jogador): number {
  return collator.compare(a.nome, b.nome);
}

function positionRank(jogador: Jogador): number {
  const primeira = jogador.posicoes[0];
  if (primeira === undefined) return POSITION_FIELD_ORDER.length;
  return POSITION_RANK.get(primeira) ?? POSITION_FIELD_ORDER.length;
}

export function sortSquadPlayers(
  players: readonly Jogador[],
  order: SquadOrder,
): Jogador[] {
  return [...players].sort((a, b) => {
    if (order === 'overall') {
      return b.overall - a.overall || compareNames(a, b);
    }

    if (order === 'age') {
      const ageA = a.idade ?? Number.POSITIVE_INFINITY;
      const ageB = b.idade ?? Number.POSITIVE_INFINITY;
      return ageA - ageB || compareNames(a, b);
    }

    if (order === 'position') {
      return positionRank(a) - positionRank(b) || compareNames(a, b);
    }

    return compareNames(a, b);
  });
}
