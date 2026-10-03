import type { Viewport } from 'next';
import type { ReactNode } from 'react';

import { Shell, VIEWPORT } from '../shell';

export const viewport: Viewport = VIEWPORT;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <Shell idioma="pt">{children}</Shell>;
}
