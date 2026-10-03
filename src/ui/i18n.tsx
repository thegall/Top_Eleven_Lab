/**
 * Texto de tela, por idioma (THE-63). O motor só conhece identificadores; os
 * nomes exibidos de drills e de talento moram aqui. Nomes dos drills e das
 * classificações são os do jogo em português (GAME-RULES §4 e §5).
 */
import type { DrillId } from '../domain/drills';
import type { TalentoLab } from '../state/schema';

export const pt = {
  drills: {
    'marcar-homem-a-homem': 'Marcar Homem a Homem',
    'passe-va-e-dispare': 'Passe, Vá e Dispare!',
    'jogada-ensaiada': 'Jogada Ensaiada',
    'tecnica-de-chute': 'Técnica de Chute',
    'drible-de-slalom': 'Drible de Slalom',
    'jogo-na-ponta': 'Jogo na Ponta',
    'contra-ataque-rapido': 'Contra-Ataque Rápido',
    'analise-do-video': 'Análise do Vídeo',
    cabeceada: 'Cabeceada',
    'uma-linha-de-defesa': 'Uma Linha de Defesa',
    'parar-o-atacante': 'Parar o Atacante',
    'cruzamento-de-defesa': 'Cruzamento de Defesa',
    'pressione-o-play': 'Pressione o Play',
    'treino-de-goleiro': 'Treino de Goleiro',
    'controle-da-bola': 'Controle da Bola',
    'jogo-de-bobinho': 'Jogo de Bobinho',
    'matada-de-bola': 'Matada de Bola',
    'virada-de-jogo': 'Virada de Jogo',
    posicionamento: 'Posicionamento',
    entradas: 'Entradas',
    'passes-para-o-chute': 'Passes para o Chute',
    aquecimento: 'Aquecimento',
    alongamento: 'Alongamento',
    'carioca-com-escadas': 'Carioca com Escadas',
    'corrida-longa': 'Corrida Longa',
    'corrida-de-ir-e-vir': 'Corrida de Ir e Vir',
    'corrida-de-obstaculo': 'Corrida de Obstáculo',
    academia: 'Academia',
    arrancada: 'Arrancada',
  } satisfies Record<DrillId, string>,
  // Ruim e Terrível são a mesma coisa para o jogador: as duas chamam Bagre
  // (GAME-RULES §3.1, nomenclatura de 2026-09-18). A curva mantém os dois sigmas.
  talento: {
    terrivel: 'Bagre',
    ruim: 'Bagre',
    bagre: 'Bagre',
    normal: 'Normal',
    boa: 'Bom Jogador',
    otima: 'Craque',
    excelente: 'Gênio',
    fenomeno: 'Lenda',
  } satisfies Record<TalentoLab, string>,
};
