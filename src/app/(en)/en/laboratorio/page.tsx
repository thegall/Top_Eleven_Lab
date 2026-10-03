import type { Metadata } from 'next';

import LabPage from '../../../lab-page';
import { metadataDaPagina } from '../../../shell';

export const metadata: Metadata = metadataDaPagina('en', 'laboratorio');

export default function Page() {
  return <LabPage />;
}
