import { describe, expect, it } from 'vitest';

import type { DadosLabLinha, Jogador, PosicaoJogador, TalentoLab } from '../state/schema';
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

/** A ordenação por talento só lê `lab.talento`; os atributos não entram na conta. */
function comTalento(nome: string, talento: TalentoLab | null): Jogador {
  const base = player(nome, 70, 'ST');
  if (talento === null) return base;
  return {
    ...base,
    lab: { atributos: {} as DadosLabLinha['atributos'], brancosOverride: null, talento },
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

  it('ordena por talento de Lenda a Bagre, com os sem classificação no fim', () => {
    const players = [
      comTalento('Bagre', 'bagre'),
      comTalento('Lenda', 'fenomeno'),
      comTalento('Sem teste', null),
      comTalento('Normal', 'normal'),
      comTalento('Craque', 'otima'),
      comTalento('Bom Jogador', 'boa'),
      comTalento('Gênio', 'excelente'),
    ];

    expect(sortSquadPlayers(players, 'talent').map(({ nome }) => nome)).toEqual([
      'Lenda',
      'Gênio',
      'Craque',
      'Bom Jogador',
      'Normal',
      'Bagre',
      'Sem teste',
    ]);
  });

  it('empata Ruim, Terrível e Bagre, que aparecem com o mesmo nome na tela', () => {
    const players = [
      comTalento('Zeca', 'ruim'),
      comTalento('Ana', 'terrivel'),
      comTalento('Bia', 'bagre'),
    ];

    expect(sortSquadPlayers(players, 'talent').map(({ nome }) => nome)).toEqual([
      'Ana',
      'Bia',
      'Zeca',
    ]);
  });

  it('usa o nome como desempate quando a idade é a mesma', () => {
    const players = [player('bruno', 70, 'ST', 20), player('Álvaro', 70, 'ST', 20)];

    expect(sortSquadPlayers(players, 'age').map(({ nome }) => nome)).toEqual(['Álvaro', 'bruno']);
  });
});
