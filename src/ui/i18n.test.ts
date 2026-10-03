import { isValidElement } from 'react';
import { describe, expect, it } from 'vitest';

import { ALL_DRILLS } from '../domain/drills';
import { caminho, en, formatarDecimal, pt } from './i18n';

/** Caminho de cada folha do dicionário: `squad.ordem.name`, `lab.passos.0`... */
function folhas(valor: unknown, prefixo = ''): string[] {
  if (valor === null || typeof valor !== 'object' || isValidElement(valor)) return [prefixo];
  return Object.entries(valor).flatMap(([chave, filho]) =>
    folhas(filho, prefixo ? `${prefixo}.${chave}` : chave),
  );
}

function valorEm(raiz: unknown, caminhoDaFolha: string): unknown {
  return caminhoDaFolha
    .split('.')
    .reduce<unknown>((no, chave) => (no as Record<string, unknown>)[chave], raiz);
}

describe('dicionário de idiomas (THE-63)', () => {
  it('inglês tem exatamente as mesmas chaves do português', () => {
    expect(folhas(en).sort()).toEqual(folhas(pt).sort());
  });

  it('nenhuma tradução vazia, fora o índice 0 de dificuldade, que não existe', () => {
    for (const folha of folhas(en)) {
      if (folha === 'dificuldade.0') continue;
      const valor = valorEm(en, folha);
      expect(valor, folha).not.toBe('');
      expect(valor, folha).not.toBeUndefined();
      expect(typeof valor, folha).toBe(typeof valorEm(pt, folha));
    }
  });

  it('cobre os 29 drills nos dois idiomas', () => {
    for (const drill of ALL_DRILLS) {
      expect(pt.drills[drill.id]).toBeTruthy();
      expect(en.drills[drill.id]).toBeTruthy();
    }
  });

  it('formata número no padrão do idioma: vírgula em português, ponto em inglês', () => {
    expect(formatarDecimal(pt, 4.5)).toBe('4,5');
    expect(formatarDecimal(en, 4.5)).toBe('4.5');
    expect(formatarDecimal(pt, 1234.5)).toBe('1.234,5');
    expect(formatarDecimal(en, 1234.5)).toBe('1,234.5');
  });

  it('mantém / e /laboratorio no português e põe o inglês sob /en', () => {
    expect(caminho('pt', 'squad')).toBe('/');
    expect(caminho('pt', 'laboratorio')).toBe('/laboratorio');
    expect(caminho('en', 'squad')).toBe('/en');
    expect(caminho('en', 'laboratorio')).toBe('/en/laboratorio');
  });
});
