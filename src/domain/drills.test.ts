import { describe, expect, it } from 'vitest';

import { conditionCostPerSlot } from './training.js';
import {
  ALL_DRILLS,
  classificarDrill,
  drillsPrimarios,
  mediaExercicio,
  montarCronograma,
} from './drills.js';
import { brancosDaPosicao } from './positions.js';
import type { Atributo } from './types.js';

describe('ALL_DRILLS', () => {
  it('tem os 29 drills do jogo (GAME-RULES §4)', () => {
    expect(ALL_DRILLS.length).toBe(29);
  });

  it('reproduz dificuldade × 0,75% de desgaste para todos os 29 (GAME-RULES §4)', () => {
    for (const drill of ALL_DRILLS) {
      expect(conditionCostPerSlot(drill.dificuldade)).toBeCloseTo(drill.dificuldade * 0.75, 10);
    }
  });

  it('identifica cada drill por slug único, sem texto de tela no motor (THE-63)', () => {
    const ids = ALL_DRILLS.map((drill) => drill.id);
    expect(new Set(ids).size).toBe(29);
    for (const drill of ALL_DRILLS) {
      expect(drill.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(drill).not.toHaveProperty('nome');
    }
  });
});

describe('classificarDrill / drillsPrimarios', () => {
  it('cronograma de MC: com os 9 brancos do vídeo, os primários são exatamente os 8 do vídeo (GAME-RULES §6)', () => {
    // Brancos inferidos dos 8 drills do cronograma de MC ditado em vídeo — não é a
    // união completa da posição MC (10 brancos, inclui Corte), é o recorte do vídeo.
    const brancosDoVideo = new Set<Atributo>([
      'chute',
      'condicionamento',
      'coragem',
      'criatividade',
      'drible',
      'marcacao',
      'passe',
      'posicionamento',
      'velocidade',
    ]);

    const nomes = drillsPrimarios(brancosDoVideo)
      .map((drill) => drill.id)
      .sort();

    expect(nomes).toEqual(
      [
        'analise-do-video',
        'arrancada',
        'corrida-longa',
        'drible-de-slalom',
        'matada-de-bola',
        'passe-va-e-dispare',
        'posicionamento',
        'uma-linha-de-defesa',
      ].sort(),
    );
  });

  it('Treino de Goleiro nunca é válido para jogador de linha (GAME-RULES §6)', () => {
    const treinoDeGoleiro = ALL_DRILLS.find((drill) => drill.id === 'treino-de-goleiro')!;
    expect(classificarDrill(new Set<Atributo>(), treinoDeGoleiro)).toBe('invalido');
  });
});

describe('mediaExercicio', () => {
  it('recusa drill sem atributo de linha, para não dividir por zero (GAME-RULES §3)', () => {
    const treinoDeGoleiro = ALL_DRILLS.find((drill) => drill.id === 'treino-de-goleiro')!;
    expect(() => mediaExercicio({} as Record<Atributo, number>, treinoDeGoleiro)).toThrow();
  });
});

describe('montarCronograma', () => {
  const ATRIBUTOS_ZERO: Record<Atributo, number> = {
    corte: 0,
    marcacao: 0,
    posicionamento: 0,
    cabecada: 0,
    coragem: 0,
    passe: 0,
    drible: 0,
    cruzamento: 0,
    chute: 0,
    finalizacao: 0,
    condicionamento: 0,
    forca: 0,
    agressividade: 0,
    velocidade: 0,
    criatividade: 0,
  };

  it('preenche os 6 slots repetindo o(s) primário(s) quando há menos de 6 (GAME-RULES §6)', () => {
    // DL tem só 5 primários com estes brancos. Valores escolhidos para que a
    // ordem por média fique inequívoca: Uma Linha de Defesa (15) < Pressione
    // o Play (30) < Posicionamento (46,67) < Carioca com Escadas (55) < Corrida Longa (65).
    const atributos: Record<Atributo, number> = {
      ...ATRIBUTOS_ZERO,
      posicionamento: 10,
      marcacao: 20,
      coragem: 30,
      corte: 40,
      agressividade: 50,
      velocidade: 60,
      condicionamento: 70,
    };
    const brancos = brancosDaPosicao(['DL']);

    const nomes = montarCronograma(atributos, brancos).map((drill) => drill.id);

    expect(nomes).toEqual([
      'uma-linha-de-defesa',
      'pressione-o-play',
      'posicionamento',
      'carioca-com-escadas',
      'corrida-longa',
      'uma-linha-de-defesa', // repete o de menor média pra fechar o 6º slot
    ]);
  });

  it('com 6 primários, cada um entra uma vez, sem repetir (GAME-RULES §6)', () => {
    const brancos = brancosDaPosicao(['ML']);
    const atributos: Record<Atributo, number> = { ...ATRIBUTOS_ZERO };
    for (const atributo of brancos) atributos[atributo] = 50;

    const cronograma = montarCronograma(atributos, brancos);
    const nomes = cronograma.map((drill) => drill.id);

    expect(cronograma).toHaveLength(6);
    expect(new Set(nomes).size).toBe(6);
    expect(new Set(nomes)).toEqual(new Set(drillsPrimarios(brancos).map((d) => d.id)));
  });
});

describe('treino inflado (GAME-RULES §8.2)', () => {
  it('os 6 drills da combinação cobrem os 15 de 15 atributos de linha', () => {
    const nomesDaCombinacao = [
      'pressione-o-play',
      'contra-ataque-rapido',
      'drible-de-slalom',
      'jogo-na-ponta',
      'academia',
      'corrida-de-ir-e-vir',
    ];

    const cobertura = new Set<Atributo>();
    for (const nome of nomesDaCombinacao) {
      const drill = ALL_DRILLS.find((d) => d.id === nome)!;
      for (const atributo of drill.atributos) cobertura.add(atributo);
    }

    expect(cobertura.size).toBe(15);
  });
});
