import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { SquadProvider } from '../state/store';
import { Nav } from './nav';
import { TopbarActions } from './topbar-actions';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Top Eleven Lab',
  description: 'Calculadora de treino e de elenco para o Top Eleven',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#181A1E',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${barlow.variable}`}>
      <body>
        <SquadProvider>
          <a className="skip" href="#conteudo">
            Pular para o conteúdo
          </a>
          <header className="topbar">
            <span className="brand">
              <img
                className="brand__logo"
                src="/logo-lab.png"
                alt="Top Eleven Lab"
                width={686}
                height={160}
              />
            </span>
            <Nav />
            <TopbarActions />
          </header>
          <div id="conteudo" tabIndex={-1}>
            {children}
          </div>
        </SquadProvider>
      </body>
    </html>
  );
}
