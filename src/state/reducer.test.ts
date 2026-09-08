import { describe, expect, it } from 'vitest';

import { reducer } from './reducer.js';
import { documentoVazio } from './schema.js';
import type { Jogador } from './schema.js';

function jogador(overrides: Partial<Jogador> = {}): Jogador {
  return {
    id: '1',
    nome: 'Ned Stark',
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
    const antes = { schemaVersion: 1, jogadores: [jogador({ id: '1' }), jogador({ id: '2' })] };
    const depois = reducer(antes, { type: 'jogador/vendaMarcada', id: '1' });
    expect(depois.jogadores.find((j) => j.id === '1')?.vendido).toBe(true);
    expect(depois.jogadores.find((j) => j.id === '2')?.vendido).toBe(false);
  });

  it('desfaz a venda', () => {
    const antes = { schemaVersion: 1, jogadores: [jogador({ vendido: true })] };
    const depois = reducer(antes, { type: 'jogador/vendaDesfeita', id: '1' });
    expect(depois.jogadores[0]?.vendido).toBe(false);
  });

  it('substitui o documento inteiro na importação/carga', () => {
    const novo = { schemaVersion: 1, jogadores: [jogador({ id: '9' })] };
    const depois = reducer(documentoVazio(), { type: 'documento/substituido', documento: novo });
    expect(depois).toEqual(novo);
  });
});
