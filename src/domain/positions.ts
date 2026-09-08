/**
 * Matriz de atributos brancos por posição. Vem da planilha `evolucao_facil.xlsx`,
 * transcrita em GAME-RULES §2.
 */
import type { Atributo, Posicao } from './types';

export const POSITION_WHITES: Record<Posicao, Atributo[]> = {
  DL: ['corte', 'marcacao', 'posicionamento', 'coragem', 'cruzamento', 'condicionamento', 'agressividade', 'velocidade'],
  DR: ['corte', 'marcacao', 'posicionamento', 'coragem', 'cruzamento', 'condicionamento', 'agressividade', 'velocidade'],
  DC: ['corte', 'marcacao', 'posicionamento', 'cabecada', 'coragem', 'condicionamento', 'forca', 'agressividade'],
  DMC: ['corte', 'marcacao', 'posicionamento', 'cabecada', 'coragem', 'passe', 'condicionamento', 'forca', 'agressividade', 'criatividade'],
  ML: ['posicionamento', 'passe', 'drible', 'cruzamento', 'condicionamento', 'velocidade', 'criatividade'],
  MR: ['posicionamento', 'passe', 'drible', 'cruzamento', 'condicionamento', 'velocidade', 'criatividade'],
  MC: ['corte', 'marcacao', 'posicionamento', 'coragem', 'passe', 'drible', 'chute', 'condicionamento', 'velocidade', 'criatividade'],
  AML: ['passe', 'drible', 'cruzamento', 'chute', 'finalizacao', 'condicionamento', 'velocidade', 'criatividade'],
  AMR: ['passe', 'drible', 'cruzamento', 'chute', 'finalizacao', 'condicionamento', 'velocidade', 'criatividade'],
  AMC: ['cabecada', 'passe', 'drible', 'chute', 'finalizacao', 'condicionamento', 'velocidade', 'criatividade'],
  ST: ['posicionamento', 'cabecada', 'passe', 'drible', 'chute', 'finalizacao', 'forca', 'velocidade', 'criatividade'],
};

/**
 * Brancos de um jogador são a união dos brancos de todas as posições que ele
 * domina (GAME-RULES §1, exemplo do fórum oficial: ML ganha Chute ao aprender MC).
 */
export function brancosDaPosicao(posicoes: Posicao[]): Set<Atributo> {
  const brancos = new Set<Atributo>();
  for (const posicao of posicoes) {
    for (const atributo of POSITION_WHITES[posicao]) {
      brancos.add(atributo);
    }
  }
  return brancos;
}
