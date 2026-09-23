'use client';

import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';

const GITHUB_URL = 'https://github.com/thegall/Top_Eleven_Lab';

// Chave fictícia — THE-55 aguarda a chave Pix real do dono para substituir.
const PIX_KEY_PLACEHOLDER = 'pix@topelevenlab.exemplo';

const GITHUB_ICON_PATH =
  `M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56
   0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68
   -1.04-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96
   .1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1
   -.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0
   c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1
   0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18
   0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z`;

type PainelAberto = 'github' | 'pix' | null;

export function TopbarActions() {
  const [painelAberto, setPainelAberto] = useState<PainelAberto>(null);
  const [copiado, setCopiado] = useState(false);

  async function copiarChave() {
    try {
      await navigator.clipboard.writeText(PIX_KEY_PLACEHOLDER);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className="topbar__actions">
      <Popover.Root
        open={painelAberto === 'github'}
        onOpenChange={(aberto) => setPainelAberto(aberto ? 'github' : null)}
      >
        <Popover.Trigger asChild>
          <button type="button" className="topbar__icon-btn" aria-label="Apoiar no GitHub">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path fill="currentColor" d={GITHUB_ICON_PATH} />
            </svg>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="topbar__panel"
            align="end"
            sideOffset={10}
            aria-label="Apoiar no GitHub"
          >
            <Popover.Close asChild>
              <button type="button" className="topbar__panel-close" aria-label="Fechar">
                ×
              </button>
            </Popover.Close>
            <div className="topbar__panel-head">
              <span className="topbar__panel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" focusable="false">
                  <path fill="currentColor" d={GITHUB_ICON_PATH} />
                </svg>
              </span>
              <strong>Apoie o projeto</strong>
            </div>
            <p>Apoie esse projeto no GitHub com uma estrela. É gratuito!</p>
            <a className="btn btn--primary" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              Favoritar
            </a>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <Popover.Root
        open={painelAberto === 'pix'}
        onOpenChange={(aberto) => setPainelAberto(aberto ? 'pix' : null)}
      >
        <Popover.Trigger asChild>
          <button type="button" className="topbar__pix-badge" aria-label="Contribuir via Pix">
            Pix
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="topbar__panel topbar__panel--pix"
            align="end"
            sideOffset={10}
            aria-label="Contribuir via Pix"
          >
            <Popover.Close asChild>
              <button type="button" className="topbar__panel-close" aria-label="Fechar">
                ×
              </button>
            </Popover.Close>
            <div className="topbar__panel-head">
              <span className="topbar__panel-icon topbar__panel-icon--pix" aria-hidden="true">
                Pix
              </span>
              <strong>Apoie com um Pix</strong>
            </div>
            <p>Apoie esse projeto para ter um domínio oficial, com qualquer valor.</p>
            <code>{PIX_KEY_PLACEHOLDER}</code>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                void copiarChave();
              }}
            >
              {copiado ? 'Copiado!' : 'Copiar chave'}
            </button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
