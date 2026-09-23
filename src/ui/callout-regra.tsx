import type { ReactNode } from 'react';

import { rotuloOrigem, type MarcaOrigem } from './origem-regra';

export function CalloutRegra({
  marca,
  children,
  tom = 'info',
}: {
  marca: MarcaOrigem;
  children: ReactNode;
  tom?: 'info' | 'aviso';
}) {
  const aviso = tom === 'aviso' || marca === 'pendente';
  return (
    <aside className={aviso ? 'callout callout--warn' : 'callout'} role="note">
      <span className="callout__src">{rotuloOrigem()}</span>
      {children}
    </aside>
  );
}
