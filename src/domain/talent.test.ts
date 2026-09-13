import { describe, expect, it } from 'vitest';

import { ALL_DRILLS } from './drills.js';
import { classificarTalento, classificarTalentoPorHabilidadeEspecial, sigma } from './talent.js';
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

describe('classificarTalentoPorHabilidadeEspecial (GAME-RULES §5, método 1)', () => {
  it('qualquer sessão com 3 entre as seis classifica como fenômeno', () => {
    expect(classificarTalentoPorHabilidadeEspecial([1, 2, 3, 1, 1, 2])).toEqual({ rank: 'fenomeno' });
  });

  it('2 2 2 2 2 2 classifica como excelente', () => {
    expect(classificarTalentoPorHabilidadeEspecial([2, 2, 2, 2, 2, 2])).toEqual({ rank: 'excelente' });
  });

  it('1 2 2 2 2 2 classifica como ótima', () => {
    expect(classificarTalentoPorHabilidadeEspecial([1, 2, 2, 2, 2, 2])).toEqual({ rank: 'otima' });
  });

  it('1 2 2 1 2 2 classifica como boa', () => {
    expect(classificarTalentoPorHabilidadeEspecial([1, 2, 2, 1, 2, 2])).toEqual({ rank: 'boa' });
  });

  it('1 2 1 2 1 2 classifica como normal (GAME-RULES §3.1, conciliação)', () => {
    expect(classificarTalentoPorHabilidadeEspecial([1, 2, 1, 2, 1, 2])).toEqual({ rank: 'normal' });
  });

  it('1 1 1 1 1 1 classifica como bagre sem inventar corte Ruim/Terrível', () => {
    expect(classificarTalentoPorHabilidadeEspecial([1, 1, 1, 1, 1, 1])).toEqual({ rank: 'bagre' });
  });

  it('recusa uma sequência de seis sessões que não casa exatamente com a tabela', () => {
    expect(() => classificarTalentoPorHabilidadeEspecial([1, 2, 1, 2, 2, 2])).toThrow(
      /não casa com nenhum padrão/,
    );
  });

  it('recusa sequência com menos ou mais de seis sessões', () => {
    expect(() => classificarTalentoPorHabilidadeEspecial([2, 2, 2, 2, 2])).toThrow(/exatamente 6 sessões/);
    expect(() => classificarTalentoPorHabilidadeEspecial([2, 2, 2, 2, 2, 2, 2])).toThrow(
      /exatamente 6 sessões/,
    );
  });

  it('recusa ponto fora de 1, 2 ou 3', () => {
    expect(() => classificarTalentoPorHabilidadeEspecial([2, 2, 2, 4, 2, 2])).toThrow(/1, 2 ou 3/);
  });
});

describe('custoEmMaletas (GAME-RULES §9)', () => {
  it('reproduz o custo de subir 8 atributos num Fenômeno em 100%, 140% e 160% de média', () => {
    expect(custoEmMaletas(8 / sigma('fenomeno', 100))).toBe(2);
    expect(custoEmMaletas(8 / sigma('fenomeno', 140))).toBe(3);
    expect(custoEmMaletas(8 / sigma('fenomeno', 160))).toBe(6);
  });
});
