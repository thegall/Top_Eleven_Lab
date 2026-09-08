import { describe, expect, it } from 'vitest';

import { ALL_DRILLS } from './drills.js';
import { classificarTalento, sigma } from './talent.js';
import { custoEmMaletas } from './training.js';

describe('sigma', () => {
  it('bate com a tabela exata em 100%, 140% e 160% para Fenômeno (GAME-RULES §3.1)', () => {
    expect(sigma('fenomeno', 100)).toBeCloseTo(0.425, 10);
    expect(sigma('fenomeno', 140)).toBeCloseTo(0.2, 10);
    expect(sigma('fenomeno', 160)).toBeCloseTo(0.1, 10);
  });

  it('trava em zero aos 180% (GAME-RULES §3, correção da seção 3.1)', () => {
    expect(sigma('fenomeno', 180)).toBe(0);
  });
});

describe('classificarTalento', () => {
  it('31 pontos em Pressione o Play, média 55% classifica como ótima (GAME-RULES §5, caso real)', () => {
    const pressioneOPlay = ALL_DRILLS.find((drill) => drill.nome === 'Pressione o Play')!;
    expect(classificarTalento(31, pressioneOPlay, 55)).toBe('otima');
  });

  it('recusa teste com média igual ou acima de 80% (GAME-RULES §5, condição de validade)', () => {
    const pressioneOPlay = ALL_DRILLS.find((drill) => drill.nome === 'Pressione o Play')!;
    expect(() => classificarTalento(31, pressioneOPlay, 80)).toThrow();
  });
});

describe('custoEmMaletas (GAME-RULES §9)', () => {
  it('reproduz o custo de subir 8 atributos num Fenômeno em 100%, 140% e 160% de média', () => {
    expect(custoEmMaletas(8 / sigma('fenomeno', 100))).toBe(2);
    expect(custoEmMaletas(8 / sigma('fenomeno', 140))).toBe(3);
    expect(custoEmMaletas(8 / sigma('fenomeno', 160))).toBe(6);
  });
});
