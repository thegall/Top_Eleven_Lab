import { describe, expect, it } from 'vitest';

import { en, pt } from './i18n';

describe('rótulo de origem do callout', () => {
  it('exibe rótulo fixo, sem expor a seção do doc interno (decisão de 2026-09-23)', () => {
    expect(pt.regras).toBe('REGRAS');
    expect(en.regras).toBe('RULES');
  });
});
