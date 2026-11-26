import type { Metadata } from 'next';

import GaleriaPage from '../../../galeria-page';
import { metadataDaPagina } from '../../../shell';

export const metadata: Metadata = metadataDaPagina('en', 'galeria');

export default function Page() {
  return <GaleriaPage />;
}
