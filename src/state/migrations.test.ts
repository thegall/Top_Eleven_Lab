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
});
