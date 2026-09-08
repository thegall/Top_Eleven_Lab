/**
 * Os 29 drills do jogo: categoria, dificuldade e atributos que treinam, já sem
 * os de goleiro (GAME-RULES §4 e tabela de entrada do algoritmo em §6).
 */
import type { Difficulty } from './training.js';
import type { Atributo } from './types.js';

export interface Drill {
  nome: string;
  categoria: 'ataque' | 'defesa' | 'posse' | 'fisico';
  dificuldade: Difficulty;
  atributos: Atributo[];
  soDeGoleiro: boolean;
}

export const ALL_DRILLS: Drill[] = [
  // Ataque
  { nome: 'Marcar Homem a Homem', categoria: 'ataque', dificuldade: 2, atributos: ['drible', 'corte', 'finalizacao'], soDeGoleiro: false },
  { nome: 'Passe, Vá e Dispare!', categoria: 'ataque', dificuldade: 2, atributos: ['velocidade', 'passe', 'chute'], soDeGoleiro: false },
  { nome: 'Jogada Ensaiada', categoria: 'ataque', dificuldade: 3, atributos: ['cruzamento', 'cabecada', 'chute', 'marcacao'], soDeGoleiro: false },
  { nome: 'Técnica de Chute', categoria: 'ataque', dificuldade: 3, atributos: ['forca', 'finalizacao', 'chute'], soDeGoleiro: false },
  { nome: 'Drible de Slalom', categoria: 'ataque', dificuldade: 4, atributos: ['velocidade', 'drible', 'passe', 'condicionamento'], soDeGoleiro: false },
  { nome: 'Jogo na Ponta', categoria: 'ataque', dificuldade: 4, atributos: ['cruzamento', 'cabecada', 'finalizacao', 'chute'], soDeGoleiro: false },
  { nome: 'Contra-Ataque Rápido', categoria: 'ataque', dificuldade: 5, atributos: ['criatividade', 'cruzamento', 'passe', 'finalizacao'], soDeGoleiro: false },

  // Defesa
  { nome: 'Análise do Vídeo', categoria: 'defesa', dificuldade: 1, atributos: ['posicionamento', 'coragem', 'criatividade'], soDeGoleiro: false },
  { nome: 'Cabeceada', categoria: 'defesa', dificuldade: 2, atributos: ['posicionamento', 'passe', 'cabecada', 'criatividade'], soDeGoleiro: false },
  { nome: 'Uma Linha de Defesa', categoria: 'defesa', dificuldade: 3, atributos: ['posicionamento', 'marcacao'], soDeGoleiro: false },
  { nome: 'Parar o Atacante', categoria: 'defesa', dificuldade: 3, atributos: ['coragem', 'corte', 'forca', 'drible', 'marcacao'], soDeGoleiro: false },
  { nome: 'Cruzamento de Defesa', categoria: 'defesa', dificuldade: 3, atributos: ['coragem', 'cruzamento', 'cabecada', 'marcacao'], soDeGoleiro: false },
  { nome: 'Pressione o Play', categoria: 'defesa', dificuldade: 4, atributos: ['coragem', 'posicionamento', 'corte', 'agressividade', 'marcacao'], soDeGoleiro: false },
  { nome: 'Treino de Goleiro', categoria: 'defesa', dificuldade: 4, atributos: [], soDeGoleiro: true },

  // Posse de Bola
  { nome: 'Controle da Bola', categoria: 'posse', dificuldade: 1, atributos: ['drible', 'cabecada', 'criatividade'], soDeGoleiro: false },
  { nome: 'Jogo de Bobinho', categoria: 'posse', dificuldade: 2, atributos: ['posicionamento', 'corte', 'condicionamento', 'passe', 'agressividade'], soDeGoleiro: false },
  { nome: 'Matada de Bola', categoria: 'posse', dificuldade: 2, atributos: ['drible', 'passe', 'condicionamento'], soDeGoleiro: false },
  { nome: 'Virada de Jogo', categoria: 'posse', dificuldade: 3, atributos: ['velocidade', 'criatividade', 'posicionamento', 'cruzamento', 'passe'], soDeGoleiro: false },
  { nome: 'Posicionamento', categoria: 'posse', dificuldade: 3, atributos: ['posicionamento', 'velocidade', 'condicionamento'], soDeGoleiro: false },
  { nome: 'Entradas', categoria: 'posse', dificuldade: 3, atributos: ['coragem', 'agressividade', 'forca', 'drible', 'marcacao'], soDeGoleiro: false },
  { nome: 'Passes para o Chute', categoria: 'posse', dificuldade: 4, atributos: ['criatividade', 'posicionamento', 'passe', 'finalizacao'], soDeGoleiro: false },

  // Físico e Mental
  { nome: 'Aquecimento', categoria: 'fisico', dificuldade: 1, atributos: ['agressividade', 'cabecada', 'condicionamento'], soDeGoleiro: false },
  { nome: 'Alongamento', categoria: 'fisico', dificuldade: 2, atributos: ['forca', 'velocidade', 'condicionamento'], soDeGoleiro: false },
  { nome: 'Carioca com Escadas', categoria: 'fisico', dificuldade: 2, atributos: ['velocidade', 'agressividade'], soDeGoleiro: false },
  { nome: 'Corrida Longa', categoria: 'fisico', dificuldade: 3, atributos: ['condicionamento', 'velocidade'], soDeGoleiro: false },
  { nome: 'Corrida de Ir e Vir', categoria: 'fisico', dificuldade: 4, atributos: ['velocidade', 'forca', 'coragem'], soDeGoleiro: false },
  { nome: 'Corrida de Obstáculo', categoria: 'fisico', dificuldade: 4, atributos: ['velocidade', 'coragem', 'agressividade', 'chute'], soDeGoleiro: false },
  { nome: 'Academia', categoria: 'fisico', dificuldade: 5, atributos: ['forca', 'condicionamento'], soDeGoleiro: false },
  { nome: 'Arrancada', categoria: 'fisico', dificuldade: 5, atributos: ['velocidade', 'drible', 'condicionamento'], soDeGoleiro: false },
];

/**
 * Média do exercício: soma dos atributos válidos do jogador ÷ quantidade
 * (GAME-RULES §3). O drill já vem sem atributos de goleiro.
 */
export function mediaExercicio(atributosJogador: Record<Atributo, number>, drill: Drill): number {
  const soma = drill.atributos.reduce((total, atributo) => total + atributosJogador[atributo], 0);
  return soma / drill.atributos.length;
}

export type ClasseDrill = 'primario' | 'secundario' | 'terciario' | 'invalido';

/**
 * Classifica um drill para um jogador pela proporção de atributos brancos
 * entre os que o exercício treina (GAME-RULES §4).
 *
 * ponytail: a regra descreve primário (100% branco) com precisão, mas só
 * qualifica secundário/terciário como "maioria branca" vs "proporção ruim",
 * sem cortes numéricos exatos na fonte. Aproxima secundário como maioria
 * branca e terciário como o resto — nenhum dos 7 casos do THE-32 depende
 * dessa distinção, só de primário/inválido. Ajustar quando a fonte trouxer
 * o corte exato ou um caso de teste exigir.
 */
export function classificarDrill(brancos: Set<Atributo>, drill: Drill): ClasseDrill {
  if (drill.atributos.length === 0) return 'invalido';

  const brancosNoDrill = drill.atributos.filter((atributo) => brancos.has(atributo)).length;
  if (brancosNoDrill === drill.atributos.length) return 'primario';
  if (brancosNoDrill > drill.atributos.length / 2) return 'secundario';
  return 'terciario';
}

/** Todos os drills primários para um conjunto de brancos (GAME-RULES §6, passo 2). */
export function drillsPrimarios(brancos: Set<Atributo>): Drill[] {
  return ALL_DRILLS.filter((drill) => classificarDrill(brancos, drill) === 'primario');
}
