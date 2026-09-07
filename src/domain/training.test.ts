import { describe, expect, it } from 'vitest';

import {
  conditionCostPerSession,
  conditionCostPerSlot,
  greenPacksFor,
  type Difficulty,
} from './training.js';

describe('conditionCostPerSlot', () => {
  // Os cinco degraus conferidos contra os 29 exercícios do jogo (GAME-RULES §4).
  const expectedCost: Record<Difficulty, number> = {
    1: 0.75, // Muito Fácil — Análise do Vídeo, Aquecimento
    2: 1.5, //  Fácil        — Cabeceada, Alongamento
    3: 2.25, // Médio        — Parar o Atacante, Corrida Longa
    4: 3, //    Difícil      — Pressione o Play, Drible de Slalom
    5: 3.75, // Muito Difícil — Contra-Ataque Rápido, Academia
  };

  it.each(Object.entries(expectedCost))(
    'dificuldade %s custa %s%% por slot',
    (difficulty, cost) => {
      expect(conditionCostPerSlot(Number(difficulty) as Difficulty)).toBe(cost);
    },
  );
});

describe('conditionCostPerSession', () => {
  it('cobra os 6 slots da sessão completa', () => {
    // Pressione o Play, o exercício do teste de talento gravado em vídeo:
    // Difícil, 3% por slot, 18% na sessão (GAME-RULES §5).
    expect(conditionCostPerSession(4)).toBe(18);
  });
});

describe('greenPacksFor', () => {
  it('arredonda para cima, porque maleta é indivisível', () => {
    expect(greenPacksFor(18.8)).toBe(2);
    expect(greenPacksFor(30)).toBe(2);
    expect(greenPacksFor(30.1)).toBe(3);
  });

  it('reproduz o custo de subir 8 atributos num jogador Fenômeno', () => {
    // GAME-RULES §9: 2 maletas com o exercício em 100% de média,
    // 3 a 140% e 6 a 160%. O condicionamento vem de 8 ÷ sigma.
    expect(greenPacksFor(8 / 0.425)).toBe(2);
    expect(greenPacksFor(8 / 0.2)).toBe(3);
    expect(greenPacksFor(8 / 0.1)).toBe(6);
  });
});
