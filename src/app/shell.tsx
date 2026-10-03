import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { SquadProvider } from '../state/store';
import { caminho, TEXTOS, type Idioma, type Pagina } from '../ui/i18n';
import { IdiomaProvider } from '../ui/idioma';
import { Nav } from './nav';
import { TopbarActions } from './topbar-actions';
import './globals.css';

/**
 * Esqueleto comum aos dois idiomas. Cada idioma tem o próprio root layout
 * (`(pt)` e `(en)`), porque `<html lang>` só se define no root layout e o
 * export estático não tem como trocar isso por rota de outro jeito (THE-63).
 */

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

/** Endereço público do site: o hreflang precisa de URL absoluta. Não é segredo. */
const SITE_URL = 'https://top11lab.vercel.app';

/** Metadados de uma página, com hreflang ligando as duas versões dela. */
export function metadataDaPagina(idioma: Idioma, pagina: Pagina): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: 'Top Eleven Lab',
    description: TEXTOS[idioma].meta.descricao,
    alternates: {
      canonical: caminho(idioma, pagina),
      languages: {
        'pt-BR': caminho('pt', pagina),
        en: caminho('en', pagina),
        'x-default': caminho('pt', pagina),
      },
    },
  };
}

export const VIEWPORT: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#181A1E',
};

export function Shell({ idioma, children }: { idioma: Idioma; children: ReactNode }) {
  const t = TEXTOS[idioma];
  return (
    <html lang={t.locale} className={`${inter.variable} ${barlow.variable}`}>
      <body>
        <IdiomaProvider idioma={idioma}>
          <SquadProvider>
            <a className="skip" href="#conteudo">
              {t.shell.pular}
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
        </IdiomaProvider>
      </body>
    </html>
  );
}
