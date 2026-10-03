'use client';

/**
 * Idioma da página, decidido pela rota (`/` ou `/en`), nunca pelo navegador
 * (THE-63). O layout de cada idioma passa o código; os componentes leem o
 * dicionário daqui.
 */
import { createContext, useContext, type ReactNode } from 'react';

import { TEXTOS, type Idioma, type Textos } from './i18n';

const IdiomaContext = createContext<Idioma>('pt');

export function IdiomaProvider({ idioma, children }: { idioma: Idioma; children: ReactNode }) {
  return <IdiomaContext.Provider value={idioma}>{children}</IdiomaContext.Provider>;
}

export function useIdioma(): Idioma {
  return useContext(IdiomaContext);
}

export function useTextos(): Textos {
  return TEXTOS[useContext(IdiomaContext)];
}
