import { describe, expect, it } from 'vitest';

import { mediaDos14, type JogadorElenco } from './squad.js';

function jogador(overall: number, vendido = false): JogadorElenco {
  return { id: `${overall}-${vendido}`, overall, vendido };
}

describe('mediaDos14', () => {
  it('soma os 14 maiores overalls e divide por 14 (GAME-RULES §8)', () => {
    // 20 jogadores, overall 60..117 de 3 em 3 — os 14 maiores vão de 78 a 117.
    const elenco = Array.from({ length: 20 }, (_, i) => jogador(60 + i * 3));
    expect(mediaDos14(elenco)).toBeCloseTo((78 + 117) / 2, 5);
  });

  it('ignora jogadores marcados como vendidos', () => {
    const elenco = [
      jogador(118),
      jogador(112),
      jogador(109),
      jogador(106, true), // Ned Stark, vendido — sai da conta
      jogador(104),
      jogador(101),
      jogador(99),
      jogador(97),
      jogador(95),
      jogador(93),
      jogador(91),
      jogador(89),
      jogador(87),
      jogador(85),
      jogador(78), // sobe para os 14 no lugar do vendido
    ];
    const semVenda = mediaDos14(elenco.filter((j) => !j.vendido).concat(jogador(106)));
    const comVenda = mediaDos14(elenco);
    expect(comVenda).toBeLessThan(semVenda);
    expect(comVenda).toBeCloseTo(
      (118 + 112 + 109 + 104 + 101 + 99 + 97 + 95 + 93 + 91 + 89 + 87 + 85 + 78) / 14,
      5,
    );
  });

  it('completa com o overall que tiver quando o elenco tem menos de 14 (GAME-RULES §8)', () => {
    const elenco = [jogador(80), jogador(60), jogador(1)];
    expect(mediaDos14(elenco)).toBeCloseTo((80 + 60 + 1) / 14, 5);
  });

  it('devolve zero para elenco vazio', () => {
    expect(mediaDos14([])).toBe(0);
  });
});
