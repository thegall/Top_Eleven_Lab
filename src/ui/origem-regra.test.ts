import { describe, expect, it } from 'vitest';

import { rotuloOrigem } from './origem-regra';

describe('rotuloOrigem', () => {
  it('exibe rótulo fixo, sem expor a seção do doc interno (decisão de 2026-09-23)', () => {
    expect(rotuloOrigem()).toBe('REGRAS');
  });
});
