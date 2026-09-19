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

  it('carrega elenco com lab legado trocado sem apagar o documento', () => {
    const atributosDeLinha = {
      corte: 50,
      marcacao: 50,
      posicionamento: 50,
      cabecada: 50,
      coragem: 50,
      passe: 50,
      drible: 50,
      cruzamento: 50,
      chute: 50,
      finalizacao: 50,
      condicionamento: 50,
      forca: 50,
      agressividade: 50,
      velocidade: 50,
      criatividade: 50,
    };
    const dc = {
      id: '1',
      nome: 'Ned Stark',
      idade: 21,
      overall: 78,
      posicoes: ['DC' as const],
      vendido: false,
      lab: { atributos: atributosDeLinha, brancosOverride: null, talento: 'boa' as const },
    };
    const gk = {
      id: '2',
      nome: 'Goleiro',
      idade: 21,
      overall: 70,
      posicoes: ['GK' as const],
      vendido: false,
      lab: { atributos: atributosDeLinha, brancosOverride: null, talento: null },
    };
    localStorage.setItem(
      'top-eleven-lab:documento',
      JSON.stringify({ schemaVersion: 2, jogadores: [dc, gk] }),
    );

    expect(carregar()).toEqual({
      schemaVersion: 2,
      jogadores: [dc, { ...gk, lab: null }],
    });
  });
});
