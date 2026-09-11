import { describe, expect, it } from 'vitest';

import { alternarPosicao } from './posicao.js';

describe('alternarPosicao (GAME-RULES §1)', () => {
  it('adiciona uma posição nova até o máximo de 3', () => {
    expect(alternarPosicao(['DC'], 'ML')).toEqual(['DC', 'ML']);
    expect(alternarPosicao(['DC', 'ML'], 'ST')).toEqual(['DC', 'ML', 'ST']);
  });

  it('não passa de 3 posições', () => {
    expect(alternarPosicao(['DC', 'ML', 'ST'], 'AMC')).toEqual(['DC', 'ML', 'ST']);
  });

  it('remove uma posição já selecionada, mas nunca a última', () => {
    expect(alternarPosicao(['DC', 'ML'], 'DC')).toEqual(['ML']);
    expect(alternarPosicao(['DC'], 'DC')).toEqual(['DC']);
  });
});
