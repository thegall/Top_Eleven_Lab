'use client';

/**
 * Context alimentado por `useReducer` (ADR 0009). A leitura inicial do
 * `localStorage` acontece depois da montagem, nunca durante a renderização
 * — o HTML é gerado no build, quando `localStorage` não existe (ADR 0001).
 */
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';

import { reducer } from './reducer';
import { documentoVazio, type Documento, type Jogador, type PosicaoJogador } from './schema';
import { carregar, salvar } from './storage';

interface SquadContextValue {
  documento: Documento;
  carregado: boolean;
  adicionarJogador: (nome: string, overall: number, posicao: PosicaoJogador) => void;
  marcarVendido: (id: string) => void;
  desfazerVenda: (id: string) => void;
  substituirDocumento: (documento: Documento) => void;
}

const SquadContext = createContext<SquadContextValue | null>(null);

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
    adicionarJogador: (nome, overall, posicao) => {
      const jogador: Jogador = {
        id: crypto.randomUUID(),
        nome,
        overall,
        posicoes: [posicao],
        vendido: false,
        lab: null,
      };
      dispatch({ type: 'jogador/adicionado', jogador });
    },
    marcarVendido: (id) => dispatch({ type: 'jogador/vendaMarcada', id }),
    desfazerVenda: (id) => dispatch({ type: 'jogador/vendaDesfeita', id }),
    substituirDocumento: (documento) => dispatch({ type: 'documento/substituido', documento }),
  };

  return <SquadContext.Provider value={value}>{children}</SquadContext.Provider>;
}

export function useSquad(): SquadContextValue {
  const value = useContext(SquadContext);
  if (value === null) throw new Error('useSquad precisa estar dentro de <SquadProvider>.');
  return value;
}
