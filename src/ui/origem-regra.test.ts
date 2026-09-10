import { describe, expect, it } from 'vitest';

import { rotuloOrigem } from './origem-regra';

describe('rotuloOrigem', () => {
  it('declara origem oficial com a seção do GAME-RULES', () => {
    expect(rotuloOrigem('oficial', '§2')).toBe('[OFICIAL] GAME-RULES §2');
  });

  it('declara origem da comunidade com a seção do GAME-RULES', () => {
    expect(rotuloOrigem('comunidade', '§8')).toBe('[COMUNIDADE] GAME-RULES §8');
  });

  it('declara medição de campo com a seção do GAME-RULES', () => {
    expect(rotuloOrigem('medicao', '§5')).toBe('[MEDIÇÃO] GAME-RULES §5');
  });

  it('marca PENDENTE de forma explícita, sem inventar valor (THE-37)', () => {
    expect(rotuloOrigem('pendente', '§5')).toBe('[PENDENTE] GAME-RULES §5');
    expect(rotuloOrigem('pendente', '§3.1')).toBe('[PENDENTE] GAME-RULES §3.1');
  });
});
