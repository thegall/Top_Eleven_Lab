/**
 * O reducer é função pura (ADR 0009): recebe documento e ação, devolve
 * documento novo. Toda mutação passa por aqui — nenhum componente altera o
 * documento direto.
 */
import {
  ehGoleiro,
  ehPosicoesValidas,
  type DadosLab,
  type Documento,
  type Jogador,
} from './schema';

function exigirPosicoes(posicoes: Jogador['posicoes']): void {
  if (!ehPosicoesValidas(posicoes)) {
    throw new Error('Jogador inválido: informe de 1 a 3 posições distintas.');
  }
}

export type Acao =
  | { type: 'jogador/adicionado'; jogador: Jogador }
  | {
      type: 'jogador/atualizado';
      id: string;
      nome: string;
      idade: number;
      overall: number;
      posicoes: Jogador['posicoes'];
    }
  | { type: 'jogador/excluido'; id: string }
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
      exigirPosicoes(acao.jogador.posicoes);
      return { ...documento, jogadores: [...documento.jogadores, acao.jogador] };
    case 'jogador/atualizado':
      exigirPosicoes(acao.posicoes);
      return {
        ...documento,
        jogadores: documento.jogadores.map((jogador) =>
          jogador.id === acao.id
            ? {
                ...jogador,
                nome: acao.nome,
                idade: acao.idade,
                overall: acao.overall,
                posicoes: acao.posicoes,
                lab:
                  ehGoleiro(jogador) === ehGoleiro({ posicoes: acao.posicoes })
                    ? jogador.lab
                    : null,
              }
            : jogador,
        ),
      };
    case 'jogador/excluido':
      return {
        ...documento,
        jogadores: documento.jogadores.filter((jogador) => jogador.id !== acao.id),
      };
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
