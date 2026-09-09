/**
 * O reducer é função pura (ADR 0009): recebe documento e ação, devolve
 * documento novo. Toda mutação passa por aqui — nenhum componente altera o
 * documento direto.
 */
import type { DadosLab, Documento, Jogador } from './schema';

export type Acao =
  | { type: 'jogador/adicionado'; jogador: Jogador }
  | { type: 'jogador/vendaMarcada'; id: string }
  | { type: 'jogador/vendaDesfeita'; id: string }
  | { type: 'jogador/labAtualizado'; id: string; lab: DadosLab }
  | { type: 'documento/substituido'; documento: Documento };

function definirVendido(documento: Documento, id: string, vendido: boolean): Documento {
  return {
    ...documento,
    jogadores: documento.jogadores.map((jogador) =>
      jogador.id === id ? { ...jogador, vendido } : jogador,
    ),
  };
}

export function reducer(documento: Documento, acao: Acao): Documento {
  switch (acao.type) {
    case 'jogador/adicionado':
      return { ...documento, jogadores: [...documento.jogadores, acao.jogador] };
    case 'jogador/vendaMarcada':
      return definirVendido(documento, acao.id, true);
    case 'jogador/vendaDesfeita':
      return definirVendido(documento, acao.id, false);
    case 'jogador/labAtualizado':
      return {
        ...documento,
        jogadores: documento.jogadores.map((jogador) =>
          jogador.id === acao.id ? { ...jogador, lab: acao.lab } : jogador,
        ),
      };
    case 'documento/substituido':
      return acao.documento;
  }
}
