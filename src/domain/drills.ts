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

/**
 * Identificador estável de cada drill. O nome exibido mora na interface, por
 * idioma (THE-63): o motor não carrega texto de tela.
 */
export type DrillId =
  | 'marcar-homem-a-homem'
  | 'passe-va-e-dispare'
  | 'jogada-ensaiada'
  | 'tecnica-de-chute'
  | 'drible-de-slalom'
  | 'jogo-na-ponta'
  | 'contra-ataque-rapido'
  | 'analise-do-video'
  | 'cabeceada'
  | 'uma-linha-de-defesa'
  | 'parar-o-atacante'
  | 'cruzamento-de-defesa'
  | 'pressione-o-play'
  | 'treino-de-goleiro'
  | 'controle-da-bola'
  | 'jogo-de-bobinho'
  | 'matada-de-bola'
  | 'virada-de-jogo'
  | 'posicionamento'
  | 'entradas'
  | 'passes-para-o-chute'
  | 'aquecimento'
  | 'alongamento'
  | 'carioca-com-escadas'
  | 'corrida-longa'
  | 'corrida-de-ir-e-vir'
  | 'corrida-de-obstaculo'
  | 'academia'
  | 'arrancada';

export interface Drill {
  id: DrillId;
  categoria: 'ataque' | 'defesa' | 'posse' | 'fisico';
  dificuldade: Difficulty;
  atributos: Atributo[];
  atributosGoleiro: AtributoGoleiroExclusivo[];
  soDeGoleiro: boolean;
}

export const ALL_DRILLS: Drill[] = [
  // Ataque
  { id: 'marcar-homem-a-homem', categoria: 'ataque', dificuldade: 2, atributos: ['drible', 'corte', 'finalizacao'], atributosGoleiro: ['sairNaBola', 'antecipacao'], soDeGoleiro: false },
  { id: 'passe-va-e-dispare', categoria: 'ataque', dificuldade: 2, atributos: ['velocidade', 'passe', 'chute'], atributosGoleiro: ['antecipacao'], soDeGoleiro: false },
  { id: 'jogada-ensaiada', categoria: 'ataque', dificuldade: 3, atributos: ['cruzamento', 'cabecada', 'chute', 'marcacao'], atributosGoleiro: ['sairNaBola'], soDeGoleiro: false },
  { id: 'tecnica-de-chute', categoria: 'ataque', dificuldade: 3, atributos: ['forca', 'finalizacao', 'chute'], atributosGoleiro: ['agilidade', 'reflexos'], soDeGoleiro: false },
  { id: 'drible-de-slalom', categoria: 'ataque', dificuldade: 4, atributos: ['velocidade', 'drible', 'passe', 'condicionamento'], atributosGoleiro: [], soDeGoleiro: false },
  { id: 'jogo-na-ponta', categoria: 'ataque', dificuldade: 4, atributos: ['cruzamento', 'cabecada', 'finalizacao', 'chute'], atributosGoleiro: ['espalmar'], soDeGoleiro: false },
  { id: 'contra-ataque-rapido', categoria: 'ataque', dificuldade: 5, atributos: ['criatividade', 'cruzamento', 'passe', 'finalizacao'], atributosGoleiro: ['comunicacao'], soDeGoleiro: false },

  // Defesa
  { id: 'analise-do-video', categoria: 'defesa', dificuldade: 1, atributos: ['posicionamento', 'coragem', 'criatividade'], atributosGoleiro: ['comunicacao'], soDeGoleiro: false },
  { id: 'cabeceada', categoria: 'defesa', dificuldade: 2, atributos: ['posicionamento', 'passe', 'cabecada', 'criatividade'], atributosGoleiro: [], soDeGoleiro: false },
  { id: 'uma-linha-de-defesa', categoria: 'defesa', dificuldade: 3, atributos: ['posicionamento', 'marcacao'], atributosGoleiro: ['concentracao', 'comunicacao'], soDeGoleiro: false },
  { id: 'parar-o-atacante', categoria: 'defesa', dificuldade: 3, atributos: ['coragem', 'corte', 'forca', 'drible', 'marcacao'], atributosGoleiro: [], soDeGoleiro: false },
  { id: 'cruzamento-de-defesa', categoria: 'defesa', dificuldade: 3, atributos: ['coragem', 'cruzamento', 'cabecada', 'marcacao'], atributosGoleiro: ['jogoAereo'], soDeGoleiro: false },
  { id: 'pressione-o-play', categoria: 'defesa', dificuldade: 4, atributos: ['coragem', 'posicionamento', 'corte', 'agressividade', 'marcacao'], atributosGoleiro: [], soDeGoleiro: false },
  { id: 'treino-de-goleiro', categoria: 'defesa', dificuldade: 4, atributos: [], atributosGoleiro: ['agilidade', 'reflexos', 'jogoAereo', 'chutar', 'arremesso'], soDeGoleiro: true },

  // Posse de Bola
  { id: 'controle-da-bola', categoria: 'posse', dificuldade: 1, atributos: ['drible', 'cabecada', 'criatividade'], atributosGoleiro: ['concentracao'], soDeGoleiro: false },
  { id: 'jogo-de-bobinho', categoria: 'posse', dificuldade: 2, atributos: ['posicionamento', 'corte', 'condicionamento', 'passe', 'agressividade'], atributosGoleiro: [], soDeGoleiro: false },
  { id: 'matada-de-bola', categoria: 'posse', dificuldade: 2, atributos: ['drible', 'passe', 'condicionamento'], atributosGoleiro: ['arremesso'], soDeGoleiro: false },
  { id: 'virada-de-jogo', categoria: 'posse', dificuldade: 3, atributos: ['velocidade', 'criatividade', 'posicionamento', 'cruzamento', 'passe'], atributosGoleiro: ['comunicacao'], soDeGoleiro: false },
  { id: 'posicionamento', categoria: 'posse', dificuldade: 3, atributos: ['posicionamento', 'velocidade', 'condicionamento'], atributosGoleiro: ['jogoAereo'], soDeGoleiro: false },
  { id: 'entradas', categoria: 'posse', dificuldade: 3, atributos: ['coragem', 'agressividade', 'forca', 'drible', 'marcacao'], atributosGoleiro: [], soDeGoleiro: false },
  { id: 'passes-para-o-chute', categoria: 'posse', dificuldade: 4, atributos: ['criatividade', 'posicionamento', 'passe', 'finalizacao'], atributosGoleiro: ['antecipacao'], soDeGoleiro: false },

  // Físico e Mental
  { id: 'aquecimento', categoria: 'fisico', dificuldade: 1, atributos: ['agressividade', 'cabecada', 'condicionamento'], atributosGoleiro: ['reflexos'], soDeGoleiro: false },
  { id: 'alongamento', categoria: 'fisico', dificuldade: 2, atributos: ['forca', 'velocidade', 'condicionamento'], atributosGoleiro: ['agilidade'], soDeGoleiro: false },
  { id: 'carioca-com-escadas', categoria: 'fisico', dificuldade: 2, atributos: ['velocidade', 'agressividade'], atributosGoleiro: ['concentracao', 'agilidade'], soDeGoleiro: false },
  { id: 'corrida-longa', categoria: 'fisico', dificuldade: 3, atributos: ['condicionamento', 'velocidade'], atributosGoleiro: ['concentracao'], soDeGoleiro: false },
  { id: 'corrida-de-ir-e-vir', categoria: 'fisico', dificuldade: 4, atributos: ['velocidade', 'forca', 'coragem'], atributosGoleiro: ['agilidade'], soDeGoleiro: false },
  { id: 'corrida-de-obstaculo', categoria: 'fisico', dificuldade: 4, atributos: ['velocidade', 'coragem', 'agressividade', 'chute'], atributosGoleiro: [], soDeGoleiro: false },
  { id: 'academia', categoria: 'fisico', dificuldade: 5, atributos: ['forca', 'condicionamento'], atributosGoleiro: ['arremesso', 'chutar'], soDeGoleiro: false },
  { id: 'arrancada', categoria: 'fisico', dificuldade: 5, atributos: ['velocidade', 'drible', 'condicionamento'], atributosGoleiro: ['sairNaBola'], soDeGoleiro: false },
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
    throw new Error(`Drill inválido para jogador de linha: ${drill.id}.`);
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
