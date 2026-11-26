import { describe, expect, it } from 'vitest';

import { migrar } from './migrations.js';

describe('migrar', () => {
  it('migra um documento v1 válido para v2 com idade desconhecida', () => {
    const bruto = {
      schemaVersion: 1,
      jogadores: [
        { id: '1', nome: 'Ned Stark', overall: 78, posicoes: ['DC'], vendido: false, lab: null },
      ],
    };
    expect(migrar(bruto)).toEqual({
      schemaVersion: 3,
      jogadores: [
        {
          id: '1',
          nome: 'Ned Stark',
          idade: null,
          overall: 78,
          posicoes: ['DC'],
          vendido: false,
          lab: null,
        },
      ],
      galeria: [],
    });
  });

  it('aceita idade válida na v2 e recusa valores fora de 18 a 35 anos', () => {
    const jogador = {
      id: '1',
      nome: 'Ned Stark',
      idade: 18,
      overall: 78,
      posicoes: ['DC'],
      vendido: false,
      lab: null,
    };

    expect(migrar({ schemaVersion: 2, jogadores: [jogador] })).toEqual({
      schemaVersion: 3,
      jogadores: [jogador],
      galeria: [],
    });

    for (const idade of [17, 36, 20.5, Number.NaN]) {
      expect(() =>
        migrar({ schemaVersion: 2, jogadores: [{ ...jogador, idade }] }),
      ).toThrow();
    }
  });

  it('recusa versão maior que a conhecida, em vez de adivinhar (ADR 0002)', () => {
    expect(() => migrar({ schemaVersion: 99, jogadores: [] })).toThrow();
  });

  it('recusa entrada que não é um documento', () => {
    expect(() => migrar(null)).toThrow();
    expect(() => migrar('texto')).toThrow();
    expect(() => migrar({})).toThrow();
    expect(() => migrar({ schemaVersion: 1, jogadores: 'não é lista' })).toThrow();
  });

  it('recusa schemaVersion numérico inválido', () => {
    expect(() => migrar({ schemaVersion: 0.5, jogadores: [] })).toThrow();
    expect(() => migrar({ schemaVersion: 0, jogadores: [] })).toThrow();
    expect(() => migrar({ schemaVersion: -1, jogadores: [] })).toThrow();
    expect(() =>
      migrar({ schemaVersion: Number.MAX_SAFE_INTEGER + 1, jogadores: [] }),
    ).toThrow();
  });

  const jogadorBase = { id: '1', nome: 'Ned Stark', overall: 78, posicoes: ['DC'], vendido: false };
  const atributosCompletos = {
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

  it('aceita um lab completo e válido', () => {
    const bruto = {
      schemaVersion: 1,
      jogadores: [{ ...jogadorBase, lab: { atributos: atributosCompletos, brancosOverride: null, talento: 'boa' } }],
    };
    expect(migrar(bruto)).toEqual({
      schemaVersion: 3,
      jogadores: [{ ...bruto.jogadores[0], idade: null }],
      galeria: [],
    });
  });

  it('aceita talento bagre do método visual (GAME-RULES §5)', () => {
    const bruto = {
      schemaVersion: 2,
      jogadores: [
        { ...jogadorBase, idade: 19, lab: { atributos: atributosCompletos, brancosOverride: null, talento: 'bagre' } },
      ],
    };
    expect(migrar(bruto)).toEqual({ ...bruto, schemaVersion: 3, galeria: [] });
  });

  const atributosGoleiro = {
    reflexos: 50,
    agilidade: 50,
    antecipacao: 50,
    sairNaBola: 50,
    comunicacao: 50,
    arremesso: 50,
    chutar: 50,
    espalmar: 50,
    jogoAereo: 50,
    concentracao: 50,
    condicionamento: 50,
    forca: 50,
    agressividade: 50,
    velocidade: 50,
    criatividade: 50,
  };

  it('aceita a ficha de goleiro no lab de um GK (GAME-RULES §2)', () => {
    const bruto = {
      schemaVersion: 2,
      jogadores: [
        {
          ...jogadorBase,
          idade: 21,
          posicoes: ['GK'],
          lab: { atributos: atributosGoleiro, brancosOverride: ['reflexos'], talento: 'otima' },
        },
      ],
    };
    expect(migrar(bruto)).toEqual({ ...bruto, schemaVersion: 3, galeria: [] });
  });

  it('limpa o lab legado com ficha trocada, em vez de recusar o elenco', () => {
    const goleiroComLabDeLinha = {
      ...jogadorBase,
      idade: 21,
      posicoes: ['GK'],
      lab: { atributos: atributosCompletos, brancosOverride: null, talento: 'boa' },
    };
    const linhaComLabDeGoleiro = {
      ...jogadorBase,
      idade: 21,
      lab: { atributos: atributosGoleiro, brancosOverride: null, talento: 'otima' },
    };

    expect(migrar({ schemaVersion: 2, jogadores: [goleiroComLabDeLinha] })).toEqual({
      schemaVersion: 3,
      jogadores: [{ ...goleiroComLabDeLinha, lab: null }],
      galeria: [],
    });
    expect(migrar({ schemaVersion: 2, jogadores: [linhaComLabDeGoleiro] })).toEqual({
      schemaVersion: 3,
      jogadores: [{ ...linhaComLabDeGoleiro, lab: null }],
      galeria: [],
    });
  });

  it('preserva o restante do elenco quando só um lab está trocado', () => {
    const dc = {
      ...jogadorBase,
      idade: 21,
      lab: { atributos: atributosCompletos, brancosOverride: null, talento: 'boa' },
    };
    const gk = {
      ...jogadorBase,
      id: '2',
      nome: 'Goleiro',
      idade: 21,
      posicoes: ['GK'],
      lab: { atributos: atributosCompletos, brancosOverride: null, talento: null },
    };

    expect(migrar({ schemaVersion: 2, jogadores: [dc, gk] })).toEqual({
      schemaVersion: 3,
      jogadores: [dc, { ...gk, lab: null }],
      galeria: [],
    });
  });

  it('recusa lab com atributos ausentes ou incompletos, pra não virar NaN na média do exercício', () => {
    expect(() =>
      migrar({ schemaVersion: 1, jogadores: [{ ...jogadorBase, lab: {} }] }),
    ).toThrow();
    expect(() =>
      migrar({
        schemaVersion: 1,
        jogadores: [{ ...jogadorBase, lab: { atributos: { corte: 50 }, brancosOverride: null, talento: null } }],
      }),
    ).toThrow();
  });

  it('na v1 repara posições repetidas e corta no teto de 3, em vez de apagar o elenco', () => {
    expect(
      migrar({
        schemaVersion: 1,
        jogadores: [{ ...jogadorBase, lab: null, posicoes: ['DC', 'DC', 'ML', 'ST', 'AMC'] }],
      }),
    ).toEqual({
      schemaVersion: 3,
      jogadores: [{ ...jogadorBase, idade: null, lab: null, posicoes: ['DC', 'ML', 'ST'] }],
      galeria: [],
    });
  });

  it('na v2 recusa mais de 3 posições ou posições repetidas (GAME-RULES §1)', () => {
    const jogadorV2 = { ...jogadorBase, idade: 18, lab: null };
    expect(() =>
      migrar({
        schemaVersion: 2,
        jogadores: [{ ...jogadorV2, posicoes: ['DC', 'ML', 'ST', 'AMC'] }],
      }),
    ).toThrow();
    expect(() =>
      migrar({
        schemaVersion: 2,
        jogadores: [{ ...jogadorV2, posicoes: ['DC', 'DC'] }],
      }),
    ).toThrow();
  });

  it('aceita até 3 posições distintas', () => {
    const bruto = {
      schemaVersion: 1,
      jogadores: [{ ...jogadorBase, lab: null, posicoes: ['DC', 'ML', 'ST'] }],
    };
    expect(migrar(bruto)).toEqual({
      schemaVersion: 3,
      jogadores: [{ ...bruto.jogadores[0], idade: null }],
      galeria: [],
    });
  });

  it('recusa brancosOverride ou talento fora dos valores válidos', () => {
    expect(() =>
      migrar({
        schemaVersion: 1,
        jogadores: [
          { ...jogadorBase, lab: { atributos: atributosCompletos, brancosOverride: ['inexistente'], talento: null } },
        ],
      }),
    ).toThrow();
    expect(() =>
      migrar({
        schemaVersion: 1,
        jogadores: [
          { ...jogadorBase, lab: { atributos: atributosCompletos, brancosOverride: null, talento: 'lendario' } },
        ],
      }),
    ).toThrow();
  });

  describe('Galeria do Clube (THE-90)', () => {
    it('preserva Squad e Laboratório de um backup v2 e inicia a Galeria vazia', () => {
      const jogador = {
        id: '1',
        nome: 'Ned Stark',
        idade: 20,
        overall: 78,
        posicoes: ['DC'],
        vendido: false,
        lab: null,
      };
      const migrado = migrar({ schemaVersion: 2, jogadores: [jogador] });
      expect(migrado.jogadores).toEqual([jogador]);
      expect(migrado.galeria).toEqual([]);
    });

    it('mantém a Galeria de um documento v3', () => {
      const galeria = [{ id: 'g1', nome: 'Arya Stark' }];
      expect(migrar({ schemaVersion: 3, jogadores: [], galeria }).galeria).toEqual(galeria);
    });

    it('recusa v3 sem galeria ou com jogador sem nome', () => {
      expect(() => migrar({ schemaVersion: 3, jogadores: [] })).toThrow();
      expect(() =>
        migrar({ schemaVersion: 3, jogadores: [], galeria: [{ id: 'g1', nome: '   ' }] }),
      ).toThrow();
    });
  });
});
