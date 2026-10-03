import type { Metadata } from 'next';

import { metadataDaPagina } from '../shell';
import SquadPage from '../squad-page';

export const metadata: Metadata = metadataDaPagina('pt', 'squad');

export default function Page() {
  return <SquadPage />;
}
