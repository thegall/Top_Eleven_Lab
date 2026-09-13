import { describe, expect, it } from 'vitest';

import type { Jogador, PosicaoJogador } from '../state/schema';
import { sortSquadPlayers } from './squad-order';

function player(
  nome: string,
  overall: number,
  posicao: PosicaoJogador,
  idade: number | null = 18,
): Jogador {
  return {
    id: nome,
    nome,
    idade,
    overall,
    posicoes: [posicao],
    vendido: false,
    lab: null,
  };
}

describe('sortSquadPlayers', () => {
  const squad = [
    player('Carlos', 81, 'ST'),
    player('Álvaro', 74, 'GK'),
    player('bruno', 92, 'DC'),
  ];

  it('ordena por overall do maior para o menor sem alterar a lista original', () => {
    expect(sortSquadPlayers(squad, 'overall').map(({ nome }) => nome)).toEqual([
      'bruno',
      'Carlos',
      'Álvaro',
    ]);
    expect(squad.map(({ nome }) => nome)).toEqual(['Carlos', 'Álvaro', 'bruno']);
  });

  it('ordena nomes alfabeticamente em português, ignorando caixa e acentos', () => {
    expect(sortSquadPlayers(squad, 'name').map(({ nome }) => nome)).toEqual([
      'Álvaro',
      'bruno',
      'Carlos',
    ]);
  });

  it('ordena pela ordem tática do campo, não pela ordem alfabética, e usa o nome como desempate', () => {
    const players = [...squad, player('Amanda', 65, 'DC')];

    expect(sortSquadPlayers(players, 'position').map(({ nome }) => nome)).toEqual([
      'Álvaro',
      'Amanda',
      'bruno',
      'Carlos',
    ]);
  });

  it('coloca DMC antes de ML, mesmo com ML vindo antes no alfabeto', () => {
    const players = [
      player('Meia', 70, 'ML'),
      player('Volante', 70, 'DMC'),
      player('Atacante', 70, 'ST'),
      player('Goleiro', 70, 'GK'),
    ];

    expect(sortSquadPlayers(players, 'position').map((item) => item.posicoes[0])).toEqual([
      'GK',
      'DMC',
      'ML',
      'ST',
    ]);
  });

  it('ordena por idade do mais novo para o mais velho e deixa idade ausente por último', () => {
    const players = [
      player('Velho', 70, 'ST', 34),
      player('Novo', 70, 'ST', 18),
      player('Migrado', 70, 'ST', null),
      player('Meio', 70, 'ST', 22),
    ];

    expect(sortSquadPlayers(players, 'age').map(({ nome }) => nome)).toEqual([
      'Novo',
      'Meio',
      'Velho',
      'Migrado',
    ]);
  });

  it('usa o nome como desempate quando a idade é a mesma', () => {
    const players = [player('bruno', 70, 'ST', 20), player('Álvaro', 70, 'ST', 20)];

    expect(sortSquadPlayers(players, 'age').map(({ nome }) => nome)).toEqual(['Álvaro', 'bruno']);
  });
});
