'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { caminho, TEXTOS, type Pagina } from '../ui/i18n';
import { useIdioma } from '../ui/idioma';

const PAGINAS: Pagina[] = ['squad', 'laboratorio'];

export function Nav() {
  const pathname = usePathname();
  const idioma = useIdioma();
  const t = TEXTOS[idioma];
  const outro = idioma === 'pt' ? 'en' : 'pt';
  const atual = PAGINAS.find((p) => caminho(idioma, p) === pathname) ?? 'squad';

  return (
    <nav className="tabs" aria-label={t.nav.aria}>
      {PAGINAS.map((pagina) => {
        const href = caminho(idioma, pagina);
        return (
          <Link
            key={pagina}
            className="tab"
            href={href}
            aria-current={pathname === href ? 'page' : undefined}
          >
            {t.nav[pagina]}
          </Link>
        );
      })}
      <Link
        className="tab"
        href={caminho(outro, atual)}
        hrefLang={TEXTOS[outro].locale}
        lang={TEXTOS[outro].locale}
      >
        {t.nav.outroIdioma}
      </Link>
    </nav>
  );
}
