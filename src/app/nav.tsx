'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ABAS = [
  { href: '/', label: 'Squad' },
  { href: '/laboratorio', label: 'Laboratório' },
] as const;

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="tabs" aria-label="Abas principais">
      {ABAS.map((aba) => (
        <Link
          key={aba.href}
          className="tab"
          href={aba.href}
          aria-current={pathname === aba.href ? 'page' : undefined}
        >
          {aba.label}
        </Link>
      ))}
    </nav>
  );
}
