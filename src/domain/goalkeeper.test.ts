import { describe, expect, it } from 'vitest';

import { ALL_DRILLS, classificarDrill } from './drills.js';
import {
  ATRIBUTOS_GOLEIRO,
  GOALKEEPER_WHITES,
  atributosValidosGoleiro,
  brancosDoGoleiro,
  classificarDrillGoleiro,
  classificarDrillsDeGoleiro,
  mediaExercicioGoleiro,
  montarCronogramaGoleiro,
} from './goalkeeper.js';
import type { Atributo, AtributoGoleiro } from './types.js';

function atributos(valores: Partial<Record<AtributoGoleiro, number>>): Record<AtributoGoleiro, number> {
  const cheio = {} as Record<AtributoGoleiro, number>;
  for (const atributo of ATRIBUTOS_GOLEIRO) cheio[atributo] = valores[atributo] ?? 0;
  return cheio;
}

function drill(nome: string) {
  return ALL_DRILLS.find((d) => d.nome === nome)!;
}

describe('ficha do goleiro (GAME-RULES §2)', () => {
  it('tem 15 atributos em 2 blocos: 10 do gol e os 5 comuns', () => {
    expect(ATRIBUTOS_GOLEIRO).toHaveLength(15);
    expect(new Set(ATRIBUTOS_GOLEIRO).size).toBe(15);
  });

  it('tem 11 brancos, e os 4 cinzas são Força, Agressividade, Velocidade e Criatividade', () => {
    expect(GOALKEEPER_WHITES).toHaveLength(11);

    const cinzas = ATRIBUTOS_GOLEIRO.filter((a) => !brancosDoGoleiro().has(a));

    expect(cinzas).toEqual(['forca', 'agressividade', 'velocidade', 'criatividade']);
    expect(brancosDoGoleiro().has('condicionamento')).toBe(true);
  });
});

describe('atributosValidosGoleiro (GAME-RULES §4)', () => {
  it('pega o atributo de goleiro e o do bloco ATRIBUTOS, descartando os de linha', () => {
    // Passe, Vá e Dispare!: Velocidade, Antecipação°, Passe, Chute.
    expect(atributosValidosGoleiro(drill('Passe, Vá e Dispare!'))).toEqual([
      'antecipacao',
      'velocidade',
    ]);
  });

  it('nunca deixa atributo exclusivo de linha entrar na conta do goleiro', () => {
    const daFicha = new Set<string>(ATRIBUTOS_GOLEIRO);

    for (const item of ALL_DRILLS) {
      for (const atributo of atributosValidosGoleiro(item)) {
        expect(daFicha.has(atributo)).toBe(true);
      }
    }
  });

  it('classifica os 29 drills para o goleiro, nenhum inválido', () => {
    const classificados = classificarDrillsDeGoleiro(atributos({}), brancosDoGoleiro());

    expect(classificados).toHaveLength(29);
  });
});

describe('classificação para goleiro (GAME-RULES §4)', () => {
  it('Treino de Goleiro é primário para GK e inválido para jogador de linha', () => {
    const treino = drill('Treino de Goleiro');

    expect(classificarDrillGoleiro(brancosDoGoleiro(), treino)).toBe('primario');
    expect(classificarDrill(new Set<Atributo>(), treino)).toBe('invalido');
  });

  it('exercício que só oferece cinza ao goleiro é terciário', () => {
    // Cabeceada: Posicionamento, Passe, Cabeçada, Criatividade — sobra só o cinza.
    expect(classificarDrillGoleiro(brancosDoGoleiro(), drill('Cabeceada'))).toBe('terciario');
  });
});

describe('mediaExercicioGoleiro (GAME-RULES §3)', () => {
  it('divide apenas pelos atributos que valem para o goleiro', () => {
    const media = mediaExercicioGoleiro(
      atributos({ antecipacao: 120, velocidade: 60, passe: 999 } as Partial<
        Record<AtributoGoleiro, number>
      >),
      drill('Passe, Vá e Dispare!'),
    );

    expect(media).toBe(90);
  });
});

describe('montarCronogramaGoleiro (GAME-RULES §6)', () => {
  it('preenche os 6 slots com primários, do mais longe do teto para o mais perto', () => {
    const ficha = atributos({
      reflexos: 10,
      agilidade: 10,
      jogoAereo: 20,
      chutar: 10,
      arremesso: 10,
      antecipacao: 150,
      sairNaBola: 150,
      comunicacao: 150,
      espalmar: 150,
      concentracao: 150,
      condicionamento: 150,
    });
    const brancos = brancosDoGoleiro();

    const cronograma = montarCronogramaGoleiro(ficha, brancos);
    const medias = cronograma.map((item) => mediaExercicioGoleiro(ficha, item));

    expect(cronograma).toHaveLength(6);
    // Treino de Goleiro é o de menor média (12) entre os primários deste goleiro:
    // Cruzamento de Defesa, o outro candidato, fica em 20 por causa do Jogo aéreo.
    expect(cronograma[0]!.nome).toBe('Treino de Goleiro');
    for (const item of cronograma) {
      expect(classificarDrillGoleiro(brancos, item)).toBe('primario');
    }
    expect([...medias].sort((a, b) => a - b)).toEqual(medias);
  });
});
