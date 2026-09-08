import { describe, expect, it } from 'vitest';

import { conditionCostPerSlot } from './training.js';
import { ALL_DRILLS, classificarDrill, drillsPrimarios } from './drills.js';
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
      .map((drill) => drill.nome)
      .sort();

    expect(nomes).toEqual(
      [
        'Análise do Vídeo',
        'Arrancada',
        'Corrida Longa',
        'Drible de Slalom',
        'Matada de Bola',
        'Passe, Vá e Dispare!',
        'Posicionamento',
        'Uma Linha de Defesa',
      ].sort(),
    );
  });

  it('Treino de Goleiro nunca é válido para jogador de linha (GAME-RULES §6)', () => {
    const treinoDeGoleiro = ALL_DRILLS.find((drill) => drill.nome === 'Treino de Goleiro')!;
    expect(classificarDrill(new Set<Atributo>(), treinoDeGoleiro)).toBe('invalido');
  });
});

describe('treino inflado (GAME-RULES §8.2)', () => {
  it('os 6 drills da combinação cobrem os 15 de 15 atributos de linha', () => {
    const nomesDaCombinacao = [
      'Pressione o Play',
      'Contra-Ataque Rápido',
      'Drible de Slalom',
      'Jogo na Ponta',
      'Academia',
      'Corrida de Ir e Vir',
    ];

    const cobertura = new Set<Atributo>();
    for (const nome of nomesDaCombinacao) {
      const drill = ALL_DRILLS.find((d) => d.nome === nome)!;
      for (const atributo of drill.atributos) cobertura.add(atributo);
    }

    expect(cobertura.size).toBe(15);
  });
});
