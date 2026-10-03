import type { Metadata } from 'next';

import { metadataDaPagina } from '../../shell';
import SquadPage from '../../squad-page';

export const metadata: Metadata = metadataDaPagina('en', 'squad');

export default function Page() {
  return <SquadPage />;
}
