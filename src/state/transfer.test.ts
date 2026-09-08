import { describe, expect, it } from 'vitest';

import { exportarJSON, importarJSON } from './transfer.js';
import type { Documento } from './schema.js';

describe('exportarJSON / importarJSON', () => {
  it('faz ida e volta do documento', () => {
    const documento: Documento = {
      schemaVersion: 1,
      jogadores: [
        { id: '1', nome: 'Ned Stark', overall: 78, posicoes: ['DC'], vendido: false, lab: null },
      ],
    };
    expect(importarJSON(exportarJSON(documento))).toEqual(documento);
  });

  it('recusa arquivo que não é JSON válido', () => {
    expect(() => importarJSON('isso não é JSON')).toThrow();
  });

  it('recusa arquivo de versão mais nova que a suportada', () => {
    expect(() => importarJSON(JSON.stringify({ schemaVersion: 99, jogadores: [] }))).toThrow();
  });
});
