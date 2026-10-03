import type { ReactNode } from 'react';

import { useTextos } from './idioma';
import type { MarcaOrigem } from './origem-regra';

export function CalloutRegra({
  marca,
  children,
  tom = 'info',
}: {
  marca: MarcaOrigem;
  children: ReactNode;
  tom?: 'info' | 'aviso';
}) {
  const t = useTextos();
  const aviso = tom === 'aviso' || marca === 'pendente';
  return (
    <aside className={aviso ? 'callout callout--warn' : 'callout'} role="note">
      <span className="callout__src">{t.regras}</span>
      {children}
    </aside>
  );
}
