import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { carregar, salvar } from './storage.js';

/** `localStorage` de verdade só existe em ambiente de navegador (jsdom); um mapa basta aqui. */
function criarLocalStorageFalso(): Storage {
  const dados = new Map<string, string>();
  return {
    getItem: (chave) => dados.get(chave) ?? null,
    setItem: (chave, valor) => void dados.set(chave, valor),
    removeItem: (chave) => void dados.delete(chave),
    clear: () => dados.clear(),
    key: (i) => Array.from(dados.keys())[i] ?? null,
    get length() {
      return dados.size;
    },
  };
}

describe('carregar / salvar', () => {
  beforeEach(() => {
    globalThis.localStorage = criarLocalStorageFalso();
  });

  afterEach(() => {
    // @ts-expect-error -- limpa o stub entre testes
    delete globalThis.localStorage;
  });

  it('devolve documento vazio quando nada foi salvo ainda', () => {
    expect(carregar()).toEqual({ schemaVersion: 2, jogadores: [] });
  });

  it('faz ida e volta do documento salvo', () => {
    const documento = {
      schemaVersion: 2,
      jogadores: [
        { id: '1', nome: 'Ned Stark', idade: 18, overall: 78, posicoes: ['DC' as const], vendido: false, lab: null },
      ],
    };
    salvar(documento);
    expect(carregar()).toEqual(documento);
  });

  it('devolve documento vazio quando o dado salvo está corrompido', () => {
    localStorage.setItem('top-eleven-lab:documento', '{ isso não é JSON');
    expect(carregar()).toEqual({ schemaVersion: 2, jogadores: [] });
  });
});
