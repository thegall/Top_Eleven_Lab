import { describe, expect, it } from 'vitest';

import { ALL_DRILLS } from './drills.js';
import { classificarTalento, sigma } from './talent.js';
import { custoEmMaletas } from './training.js';
import type { Atributo } from './types.js';

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
  const pressioneOPlay = ALL_DRILLS.find((drill) => drill.nome === 'Pressione o Play')!;
  // Brancos do jogador do caso real: cobrem todos os atributos de Pressione o
  // Play, tornando-o primário — condição de validade do método 2 (GAME-RULES §5).
  const brancosDoCasoReal = new Set<Atributo>(pressioneOPlay.atributos);

  it('31 pontos em Pressione o Play, média 55% classifica como ótima (GAME-RULES §5, caso real)', () => {
    expect(classificarTalento(31, pressioneOPlay, brancosDoCasoReal, 55)).toBe('otima');
  });

  it('recusa teste com média igual ou acima de 80% (GAME-RULES §5, condição de validade)', () => {
    expect(() => classificarTalento(31, pressioneOPlay, brancosDoCasoReal, 80)).toThrow();
  });

  it('recusa drill que não é primário para o jogador (GAME-RULES §5, passo 1 do método 2)', () => {
    // Falta 'agressividade' entre os brancos: Pressione o Play vira secundário/terciário, não primário.
    const brancosIncompletos = new Set<Atributo>(
      pressioneOPlay.atributos.filter((atributo) => atributo !== 'agressividade'),
    );
    expect(() => classificarTalento(31, pressioneOPlay, brancosIncompletos, 55)).toThrow();
  });
});

describe('custoEmMaletas (GAME-RULES §9)', () => {
  it('reproduz o custo de subir 8 atributos num Fenômeno em 100%, 140% e 160% de média', () => {
    expect(custoEmMaletas(8 / sigma('fenomeno', 100))).toBe(2);
    expect(custoEmMaletas(8 / sigma('fenomeno', 140))).toBe(3);
    expect(custoEmMaletas(8 / sigma('fenomeno', 160))).toBe(6);
  });
});
