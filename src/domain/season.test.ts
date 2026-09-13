import { describe, expect, it } from 'vitest';

import { applySeasonTurnover } from './season.js';
import type { Atributo } from './types.js';

function attributes(): Record<Atributo, number> {
  return {
    corte: 74,
    marcacao: 20,
    posicionamento: 5,
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
}

describe('applySeasonTurnover (GAME-RULES §7)', () => {
  it('retira 20 pontos de cada atributo e limita o resultado em zero', () => {
    const before = attributes();
    const after = applySeasonTurnover(before);

    expect(after.corte).toBe(54);
    expect(after.marcacao).toBe(0);
    expect(after.posicionamento).toBe(0);
    expect(after.criatividade).toBe(30);
  });

  it('não altera o objeto de atributos recebido', () => {
    const before = attributes();

    applySeasonTurnover(before);

    expect(before.corte).toBe(74);
  });
});
