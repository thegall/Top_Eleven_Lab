import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { SquadProvider } from '../state/store';
import { Nav } from './nav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Top Eleven Lab',
  description: 'Calculadora de treino e de elenco para o Top Eleven',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SquadProvider>
          <header className="topbar">
            <span className="brand">
              Top Eleven <b>Lab</b>
            </span>
          </header>
          <Nav />
          {children}
        </SquadProvider>
      </body>
    </html>
  );
}
