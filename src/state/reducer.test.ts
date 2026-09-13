import { describe, expect, it } from 'vitest';

import { reducer } from './reducer.js';
import { documentoVazio } from './schema.js';
import type { Jogador } from './schema.js';

function jogador(overrides: Partial<Jogador> = {}): Jogador {
  return {
    id: '1',
    nome: 'Ned Stark',
    idade: 18,
    overall: 78,
    posicoes: ['DC'],
    vendido: false,
    lab: null,
    ...overrides,
  };
}

describe('reducer', () => {
  it('adiciona um jogador ao documento', () => {
    const depois = reducer(documentoVazio(), { type: 'jogador/adicionado', jogador: jogador() });
    expect(depois.jogadores).toEqual([jogador()]);
  });

  it('marca um jogador como vendido sem alterar os outros', () => {
    const antes = { schemaVersion: 2, jogadores: [jogador({ id: '1' }), jogador({ id: '2' })] };
    const depois = reducer(antes, { type: 'jogador/vendaMarcada', id: '1' });
    expect(depois.jogadores.find((j) => j.id === '1')?.vendido).toBe(true);
    expect(depois.jogadores.find((j) => j.id === '2')?.vendido).toBe(false);
  });

  it('desfaz a venda', () => {
    const antes = { schemaVersion: 2, jogadores: [jogador({ vendido: true })] };
    const depois = reducer(antes, { type: 'jogador/vendaDesfeita', id: '1' });
    expect(depois.jogadores[0]?.vendido).toBe(false);
  });

  it('substitui o documento inteiro na importação/carga', () => {
    const novo = { schemaVersion: 2, jogadores: [jogador({ id: '9' })] };
    const depois = reducer(documentoVazio(), { type: 'documento/substituido', documento: novo });
    expect(depois).toEqual(novo);
  });

  it('atualiza o lab de um jogador sem alterar os outros', () => {
    const lab = { atributos: {} as Record<string, number>, brancosOverride: null, talento: null };
    const antes = { schemaVersion: 2, jogadores: [jogador({ id: '1' }), jogador({ id: '2' })] };
    const depois = reducer(antes, { type: 'jogador/labAtualizado', id: '1', lab });
    expect(depois.jogadores.find((j) => j.id === '1')?.lab).toEqual(lab);
    expect(depois.jogadores.find((j) => j.id === '2')?.lab).toBeNull();
  });

  it('atualiza nome, idade, overall e posições de um jogador', () => {
    const antes = { schemaVersion: 2, jogadores: [jogador({ id: '1' }), jogador({ id: '2' })] };
    const depois = reducer(antes, {
      type: 'jogador/atualizado',
      id: '1',
      nome: 'Jon Snow',
      idade: 21,
      overall: 84,
      posicoes: ['DC', 'ML'],
    });
    expect(depois.jogadores.find((j) => j.id === '1')).toMatchObject({
      nome: 'Jon Snow',
      idade: 21,
      overall: 84,
      posicoes: ['DC', 'ML'],
    });
    expect(depois.jogadores.find((j) => j.id === '2')?.nome).toBe('Ned Stark');
  });

  it('exclui um jogador sem alterar os outros', () => {
    const antes = { schemaVersion: 2, jogadores: [jogador({ id: '1' }), jogador({ id: '2' })] };
    const depois = reducer(antes, { type: 'jogador/excluido', id: '1' });
    expect(depois.jogadores.map((j) => j.id)).toEqual(['2']);
  });
});
