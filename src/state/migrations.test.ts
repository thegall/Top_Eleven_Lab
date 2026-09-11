import { describe, expect, it } from 'vitest';

import { migrar } from './migrations.js';

describe('migrar', () => {
  it('aceita um documento v1 válido', () => {
    const bruto = {
      schemaVersion: 1,
      jogadores: [
        { id: '1', nome: 'Ned Stark', overall: 78, posicoes: ['DC'], vendido: false, lab: null },
      ],
    };
    expect(migrar(bruto)).toEqual(bruto);
  });

  it('recusa versão maior que a conhecida, em vez de adivinhar (ADR 0002)', () => {
    expect(() => migrar({ schemaVersion: 99, jogadores: [] })).toThrow();
  });

  it('recusa entrada que não é um documento', () => {
    expect(() => migrar(null)).toThrow();
    expect(() => migrar('texto')).toThrow();
    expect(() => migrar({})).toThrow();
    expect(() => migrar({ schemaVersion: 1, jogadores: 'não é lista' })).toThrow();
  });

  it('recusa schemaVersion numérico inválido', () => {
    expect(() => migrar({ schemaVersion: 0.5, jogadores: [] })).toThrow();
    expect(() => migrar({ schemaVersion: 0, jogadores: [] })).toThrow();
    expect(() => migrar({ schemaVersion: -1, jogadores: [] })).toThrow();
    expect(() =>
      migrar({ schemaVersion: Number.MAX_SAFE_INTEGER + 1, jogadores: [] }),
    ).toThrow();
  });

  const jogadorBase = { id: '1', nome: 'Ned Stark', overall: 78, posicoes: ['DC'], vendido: false };
  const atributosCompletos = {
    corte: 50,
    marcacao: 50,
    posicionamento: 50,
    cabecada: 50,
    coragem: 50,
    passe: 50,
    drible: 50,
    cruzamento: 50,
    chute: 50,
    finalizacao: 50,
    condicionamento: 50,
    forca: 50,
    agressividade: 50,
    velocidade: 50,
    criatividade: 50,
  };

  it('aceita um lab completo e válido', () => {
    const bruto = {
      schemaVersion: 1,
      jogadores: [{ ...jogadorBase, lab: { atributos: atributosCompletos, brancosOverride: null, talento: 'boa' } }],
    };
    expect(migrar(bruto)).toEqual(bruto);
  });

  it('recusa lab com atributos ausentes ou incompletos, pra não virar NaN na média do exercício', () => {
    expect(() =>
      migrar({ schemaVersion: 1, jogadores: [{ ...jogadorBase, lab: {} }] }),
    ).toThrow();
    expect(() =>
      migrar({
        schemaVersion: 1,
        jogadores: [{ ...jogadorBase, lab: { atributos: { corte: 50 }, brancosOverride: null, talento: null } }],
      }),
    ).toThrow();
  });

  it('recusa mais de 3 posições ou posições repetidas (GAME-RULES §1)', () => {
    expect(() =>
      migrar({
        schemaVersion: 1,
        jogadores: [{ ...jogadorBase, lab: null, posicoes: ['DC', 'ML', 'ST', 'AMC'] }],
      }),
    ).toThrow();
    expect(() =>
      migrar({
        schemaVersion: 1,
        jogadores: [{ ...jogadorBase, lab: null, posicoes: ['DC', 'DC'] }],
      }),
    ).toThrow();
  });

  it('aceita até 3 posições distintas', () => {
    const bruto = {
      schemaVersion: 1,
      jogadores: [{ ...jogadorBase, lab: null, posicoes: ['DC', 'ML', 'ST'] }],
    };
    expect(migrar(bruto)).toEqual(bruto);
  });

  it('recusa brancosOverride ou talento fora dos valores válidos', () => {
    expect(() =>
      migrar({
        schemaVersion: 1,
        jogadores: [
          { ...jogadorBase, lab: { atributos: atributosCompletos, brancosOverride: ['inexistente'], talento: null } },
        ],
      }),
    ).toThrow();
    expect(() =>
      migrar({
        schemaVersion: 1,
        jogadores: [
          { ...jogadorBase, lab: { atributos: atributosCompletos, brancosOverride: null, talento: 'lendario' } },
        ],
      }),
    ).toThrow();
  });
});
