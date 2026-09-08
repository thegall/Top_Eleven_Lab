import { describe, expect, it } from 'vitest';

import { brancosDaPosicao } from './positions.js';

describe('brancosDaPosicao', () => {
  it('ML tem 7 brancos, sem Chute (GAME-RULES §2)', () => {
    const brancos = brancosDaPosicao(['ML']);
    expect(brancos.size).toBe(7);
    expect(brancos.has('chute')).toBe(false);
  });

  it('ML+MC soma brancos e passa a ter Chute (GAME-RULES §2, fórum oficial)', () => {
    const brancos = brancosDaPosicao(['ML', 'MC']);
    expect(brancos.has('chute')).toBe(true);
  });
});
