import type { ReactNode } from 'react';

import { rotuloOrigem, type MarcaOrigem } from './origem-regra';

export function CalloutRegra({
  marca,
  secao,
  children,
  tom = 'info',
}: {
  marca: MarcaOrigem;
  secao: string;
  children: ReactNode;
  tom?: 'info' | 'aviso';
}) {
  const aviso = tom === 'aviso' || marca === 'pendente';
  return (
    <aside className={aviso ? 'callout callout--warn' : 'callout'} role="note">
      <span className="callout__src">{rotuloOrigem(marca, secao)}</span>
      {children}
    </aside>
  );
}
