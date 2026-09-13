'use client';

/**
 * Context alimentado por `useReducer` (ADR 0009). A leitura inicial do
 * `localStorage` acontece depois da montagem, nunca durante a renderização
 * — o HTML é gerado no build, quando `localStorage` não existe (ADR 0001).
 */
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';

import { reducer } from './reducer';
import {
  documentoVazio,
  type DadosLab,
  type Documento,
  type Jogador,
  type PosicaoJogador,
} from './schema';
import { carregar, salvar } from './storage';

interface SquadContextValue {
  documento: Documento;
  carregado: boolean;
  adicionarJogador: (nome: string, idade: number, overall: number, posicoes: PosicaoJogador[]) => void;
  atualizarJogador: (
    id: string,
    nome: string,
    idade: number,
    overall: number,
    posicoes: PosicaoJogador[],
  ) => void;
  excluirJogador: (id: string) => void;
  marcarVendido: (id: string) => void;
  desfazerVenda: (id: string) => void;
  atualizarLab: (id: string, lab: DadosLab) => void;
  substituirDocumento: (documento: Documento) => void;
}

const SquadContext = createContext<SquadContextValue | null>(null);

/** `crypto.randomUUID` pode faltar em contexto não seguro (ex.: HTTP na LAN). */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function SquadProvider({ children }: { children: ReactNode }) {
  const [documento, dispatch] = useReducer(reducer, documentoVazio());
  const [carregado, marcarCarregado] = useReducer(() => true, false);

  useEffect(() => {
    dispatch({ type: 'documento/substituido', documento: carregar() });
    marcarCarregado();
  }, []);

  useEffect(() => {
    if (carregado) salvar(documento);
  }, [documento, carregado]);

  const value: SquadContextValue = {
    documento,
    carregado,
    adicionarJogador: (nome, idade, overall, posicoes) => {
      const jogador: Jogador = {
        id: generateId(),
        nome,
        idade,
        overall,
        posicoes,
        vendido: false,
        lab: null,
      };
      dispatch({ type: 'jogador/adicionado', jogador });
    },
    atualizarJogador: (id, nome, idade, overall, posicoes) =>
      dispatch({ type: 'jogador/atualizado', id, nome, idade, overall, posicoes }),
    excluirJogador: (id) => dispatch({ type: 'jogador/excluido', id }),
    marcarVendido: (id) => dispatch({ type: 'jogador/vendaMarcada', id }),
    desfazerVenda: (id) => dispatch({ type: 'jogador/vendaDesfeita', id }),
    atualizarLab: (id, lab) => dispatch({ type: 'jogador/labAtualizado', id, lab }),
    substituirDocumento: (documento) => dispatch({ type: 'documento/substituido', documento }),
  };

  return <SquadContext.Provider value={value}>{children}</SquadContext.Provider>;
}

export function useSquad(): SquadContextValue {
  const value = useContext(SquadContext);
  if (value === null) throw new Error('useSquad precisa estar dentro de <SquadProvider>.');
  return value;
}
