/**
 * Os 29 drills do jogo: categoria, dificuldade e atributos que treinam
 * (GAME-RULES §4 e tabela de entrada do algoritmo em §6).
 *
 * `atributos` traz só os de linha e `atributosGoleiro` só os marcados com ° na
 * §4. Quem calcula escolhe a lista da ficha do jogador — atributo de goleiro
 * não entra na conta de um jogador de linha, e o inverso também não (AGENTS.md
 * § Invariantes).
 */
import { SLOTS_PER_SESSION, type Difficulty } from './training';
import type { Atributo, AtributoGoleiroExclusivo } from './types';

export interface Drill {
  nome: string;
  categoria: 'ataque' | 'defesa' | 'posse' | 'fisico';
  dificuldade: Difficulty;
  atributos: Atributo[];
  atributosGoleiro: AtributoGoleiroExclusivo[];
  soDeGoleiro: boolean;
}

export const ALL_DRILLS: Drill[] = [
  // Ataque
  { nome: 'Marcar Homem a Homem', categoria: 'ataque', dificuldade: 2, atributos: ['drible', 'corte', 'finalizacao'], atributosGoleiro: ['sairNaBola', 'antecipacao'], soDeGoleiro: false },
  { nome: 'Passe, Vá e Dispare!', categoria: 'ataque', dificuldade: 2, atributos: ['velocidade', 'passe', 'chute'], atributosGoleiro: ['antecipacao'], soDeGoleiro: false },
  { nome: 'Jogada Ensaiada', categoria: 'ataque', dificuldade: 3, atributos: ['cruzamento', 'cabecada', 'chute', 'marcacao'], atributosGoleiro: ['sairNaBola'], soDeGoleiro: false },
  { nome: 'Técnica de Chute', categoria: 'ataque', dificuldade: 3, atributos: ['forca', 'finalizacao', 'chute'], atributosGoleiro: ['agilidade', 'reflexos'], soDeGoleiro: false },
  { nome: 'Drible de Slalom', categoria: 'ataque', dificuldade: 4, atributos: ['velocidade', 'drible', 'passe', 'condicionamento'], atributosGoleiro: [], soDeGoleiro: false },
  { nome: 'Jogo na Ponta', categoria: 'ataque', dificuldade: 4, atributos: ['cruzamento', 'cabecada', 'finalizacao', 'chute'], atributosGoleiro: ['espalmar'], soDeGoleiro: false },
  { nome: 'Contra-Ataque Rápido', categoria: 'ataque', dificuldade: 5, atributos: ['criatividade', 'cruzamento', 'passe', 'finalizacao'], atributosGoleiro: ['comunicacao'], soDeGoleiro: false },

  // Defesa
  { nome: 'Análise do Vídeo', categoria: 'defesa', dificuldade: 1, atributos: ['posicionamento', 'coragem', 'criatividade'], atributosGoleiro: ['comunicacao'], soDeGoleiro: false },
  { nome: 'Cabeceada', categoria: 'defesa', dificuldade: 2, atributos: ['posicionamento', 'passe', 'cabecada', 'criatividade'], atributosGoleiro: [], soDeGoleiro: false },
  { nome: 'Uma Linha de Defesa', categoria: 'defesa', dificuldade: 3, atributos: ['posicionamento', 'marcacao'], atributosGoleiro: ['concentracao', 'comunicacao'], soDeGoleiro: false },
  { nome: 'Parar o Atacante', categoria: 'defesa', dificuldade: 3, atributos: ['coragem', 'corte', 'forca', 'drible', 'marcacao'], atributosGoleiro: [], soDeGoleiro: false },
  { nome: 'Cruzamento de Defesa', categoria: 'defesa', dificuldade: 3, atributos: ['coragem', 'cruzamento', 'cabecada', 'marcacao'], atributosGoleiro: ['jogoAereo'], soDeGoleiro: false },
  { nome: 'Pressione o Play', categoria: 'defesa', dificuldade: 4, atributos: ['coragem', 'posicionamento', 'corte', 'agressividade', 'marcacao'], atributosGoleiro: [], soDeGoleiro: false },
  { nome: 'Treino de Goleiro', categoria: 'defesa', dificuldade: 4, atributos: [], atributosGoleiro: ['agilidade', 'reflexos', 'jogoAereo', 'chutar', 'arremesso'], soDeGoleiro: true },

  // Posse de Bola
  { nome: 'Controle da Bola', categoria: 'posse', dificuldade: 1, atributos: ['drible', 'cabecada', 'criatividade'], atributosGoleiro: ['concentracao'], soDeGoleiro: false },
  { nome: 'Jogo de Bobinho', categoria: 'posse', dificuldade: 2, atributos: ['posicionamento', 'corte', 'condicionamento', 'passe', 'agressividade'], atributosGoleiro: [], soDeGoleiro: false },
  { nome: 'Matada de Bola', categoria: 'posse', dificuldade: 2, atributos: ['drible', 'passe', 'condicionamento'], atributosGoleiro: ['arremesso'], soDeGoleiro: false },
  { nome: 'Virada de Jogo', categoria: 'posse', dificuldade: 3, atributos: ['velocidade', 'criatividade', 'posicionamento', 'cruzamento', 'passe'], atributosGoleiro: ['comunicacao'], soDeGoleiro: false },
  { nome: 'Posicionamento', categoria: 'posse', dificuldade: 3, atributos: ['posicionamento', 'velocidade', 'condicionamento'], atributosGoleiro: ['jogoAereo'], soDeGoleiro: false },
  { nome: 'Entradas', categoria: 'posse', dificuldade: 3, atributos: ['coragem', 'agressividade', 'forca', 'drible', 'marcacao'], atributosGoleiro: [], soDeGoleiro: false },
  { nome: 'Passes para o Chute', categoria: 'posse', dificuldade: 4, atributos: ['criatividade', 'posicionamento', 'passe', 'finalizacao'], atributosGoleiro: ['antecipacao'], soDeGoleiro: false },

  // Físico e Mental
  { nome: 'Aquecimento', categoria: 'fisico', dificuldade: 1, atributos: ['agressividade', 'cabecada', 'condicionamento'], atributosGoleiro: ['reflexos'], soDeGoleiro: false },
  { nome: 'Alongamento', categoria: 'fisico', dificuldade: 2, atributos: ['forca', 'velocidade', 'condicionamento'], atributosGoleiro: ['agilidade'], soDeGoleiro: false },
  { nome: 'Carioca com Escadas', categoria: 'fisico', dificuldade: 2, atributos: ['velocidade', 'agressividade'], atributosGoleiro: ['concentracao', 'agilidade'], soDeGoleiro: false },
  { nome: 'Corrida Longa', categoria: 'fisico', dificuldade: 3, atributos: ['condicionamento', 'velocidade'], atributosGoleiro: ['concentracao'], soDeGoleiro: false },
  { nome: 'Corrida de Ir e Vir', categoria: 'fisico', dificuldade: 4, atributos: ['velocidade', 'forca', 'coragem'], atributosGoleiro: ['agilidade'], soDeGoleiro: false },
  { nome: 'Corrida de Obstáculo', categoria: 'fisico', dificuldade: 4, atributos: ['velocidade', 'coragem', 'agressividade', 'chute'], atributosGoleiro: [], soDeGoleiro: false },
  { nome: 'Academia', categoria: 'fisico', dificuldade: 5, atributos: ['forca', 'condicionamento'], atributosGoleiro: ['arremesso', 'chutar'], soDeGoleiro: false },
  { nome: 'Arrancada', categoria: 'fisico', dificuldade: 5, atributos: ['velocidade', 'drible', 'condicionamento'], atributosGoleiro: ['sairNaBola'], soDeGoleiro: false },
];

/** Média de um exercício: soma dos atributos válidos ÷ quantidade (GAME-RULES §3). */
export function mediaDeAtributos<A extends string>(
  valores: Record<A, number>,
  atributos: readonly A[],
): number {
  const soma = atributos.reduce((total, atributo) => total + valores[atributo], 0);
  return soma / atributos.length;
}

/**
 * Média do exercício para jogador de linha (GAME-RULES §3). O drill já vem sem
 * atributos de goleiro.
 */
export function mediaExercicio(atributosJogador: Record<Atributo, number>, drill: Drill): number {
  if (drill.soDeGoleiro || drill.atributos.length === 0) {
    throw new Error(`Drill inválido para jogador de linha: ${drill.nome}.`);
  }
  return mediaDeAtributos(atributosJogador, drill.atributos);
}

export type ClasseDrill = 'primario' | 'secundario' | 'terciario' | 'invalido';

/**
 * Classifica pela proporção de brancos entre os atributos que o exercício
 * oferece àquele jogador (GAME-RULES §4).
 *
 * ponytail: a regra descreve primário (100% branco) com precisão, mas só
 * qualifica secundário/terciário como "maioria branca" vs "proporção ruim",
 * sem cortes numéricos exatos na fonte. Aproxima secundário como maioria
 * branca e terciário como o resto — nenhum dos 7 casos do THE-32 depende
 * dessa distinção, só de primário/inválido. Ajustar quando a fonte trouxer
 * o corte exato ou um caso de teste exigir.
 */
export function classificarPorAtributos<A extends string>(
  brancos: Set<A>,
  atributos: readonly A[],
): ClasseDrill {
  if (atributos.length === 0) return 'invalido';

  const brancosNoDrill = atributos.filter((atributo) => brancos.has(atributo)).length;
  if (brancosNoDrill === atributos.length) return 'primario';
  if (brancosNoDrill > atributos.length / 2) return 'secundario';
  return 'terciario';
}

/** Classificação de um drill para jogador de linha (GAME-RULES §4). */
export function classificarDrill(brancos: Set<Atributo>, drill: Drill): ClasseDrill {
  return classificarPorAtributos(brancos, drill.atributos);
}

/** Todos os drills primários para um conjunto de brancos (GAME-RULES §6, passo 2). */
export function drillsPrimarios(brancos: Set<Atributo>): Drill[] {
  return ALL_DRILLS.filter((drill) => classificarDrill(brancos, drill) === 'primario');
}

export interface DrillClassificado {
  drill: Drill;
  media: number;
  classe: ClasseDrill;
}

/**
 * Os drills válidos para um jogador de linha, da menor média para a maior — a
 * ordem que o cronograma e a lista da interface consomem (GAME-RULES §6).
 */
export function classificarDrillsDeLinha(
  atributosJogador: Record<Atributo, number>,
  brancos: Set<Atributo>,
): DrillClassificado[] {
  return ALL_DRILLS.filter((drill) => !drill.soDeGoleiro)
    .map((drill) => ({
      drill,
      media: mediaExercicio(atributosJogador, drill),
      classe: classificarDrill(brancos, drill),
    }))
    .sort((a, b) => a.media - b.media);
}

/**
 * Preenche os 6 slots da sessão com a melhor classe que existir, da menor média
 * para a maior (mais longe do teto de 180%), repetindo em ciclo quando houver
 * menos de 6. Só desce para secundário quando não sobrar primário nenhum
 * (GAME-RULES §6).
 */
export function preencherSlots(
  classificados: readonly DrillClassificado[],
): DrillClassificado[] {
  const melhorClasse = (['primario', 'secundario', 'terciario'] as const)
    .map((classe) => classificados.filter((item) => item.classe === classe))
    .find((lista) => lista.length > 0);

  if (!melhorClasse) {
    throw new Error('Nenhum drill válido para este jogador — nem sequer terciário.');
  }

  return Array.from(
    { length: SLOTS_PER_SESSION },
    (_, i) => melhorClasse[i % melhorClasse.length]!,
  );
}

/** Os 6 slots recomendados para um jogador de linha (GAME-RULES §6). */
export function montarCronograma(
  atributosJogador: Record<Atributo, number>,
  brancos: Set<Atributo>,
): Drill[] {
  return preencherSlots(classificarDrillsDeLinha(atributosJogador, brancos)).map(
    (item) => item.drill,
  );
}
