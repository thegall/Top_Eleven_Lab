import type { Jogador, PosicaoJogador, TalentoLab } from '../state/schema';

export type SquadOrder = 'overall' | 'name' | 'age' | 'position' | 'talent';

/**
 * Do melhor para o pior, na ordem da tabela do método 1 (GAME-RULES §5):
 * Lenda, Gênio, Craque, Bom Jogador, Normal e Bagre. `bagre`, `ruim` e
 * `terrivel` empatam porque as três aparecem como Bagre na tela (§3.1).
 */
const TALENT_RANK: Record<TalentoLab, number> = {
  fenomeno: 0,
  excelente: 1,
  otima: 2,
  boa: 3,
  normal: 4,
  bagre: 5,
  ruim: 5,
  terrivel: 5,
};

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

/** Sem classificação vai para o fim da lista, como a idade ausente. */
function talentRank(jogador: Jogador): number {
  const talento = jogador.lab?.talento;
  if (!talento) return Number.POSITIVE_INFINITY;
  return TALENT_RANK[talento];
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

    if (order === 'talent') {
      return talentRank(a) - talentRank(b) || compareNames(a, b);
    }

    return compareNames(a, b);
  });
}
