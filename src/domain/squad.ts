/**
 * Simulação de venda do elenco (GAME-RULES §8). O motor só enxerga overall e
 * o sinalizador de vendido — nome, posição e o resto ficam na camada de estado.
 */

export interface JogadorElenco {
  id: string;
  overall: number;
  vendido: boolean;
}

/**
 * Média dos 14 maiores overalls, ignorando vendidos (GAME-RULES §8). Com
 * menos de 14 jogadores no elenco, completa com o overall que tiver — é
 * exatamente essa lacuna que a estratégia de reservas fracos explora.
 */
export function mediaDos14(elenco: JogadorElenco[]): number {
  const ativos = elenco
    .filter((jogador) => !jogador.vendido)
    .map((jogador) => jogador.overall)
    .sort((a, b) => b - a);

  if (ativos.length === 0) return 0;

  const top14 = ativos.slice(0, 14);
  const soma = top14.reduce((total, overall) => total + overall, 0);
  return soma / 14;
}
