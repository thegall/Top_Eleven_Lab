'use client';

import { useEffect, useRef, useState } from 'react';

import type { PosicaoJogador } from '../state/schema';
import { alternarPosicao } from './posicao';

const LINHAS: (PosicaoJogador | null)[][] = [
  [null, 'ST', null],
  ['AML', 'AMC', 'AMR'],
  ['ML', 'MC', 'MR'],
  [null, 'DMC', null],
  ['DL', 'DC', 'DR'],
  [null, 'GK', null],
];

export function SeletorPosicao({
  id,
  valor,
  onChange,
}: {
  id: string;
  valor: PosicaoJogador[];
  onChange: (posicoes: PosicaoJogador[]) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const gatilho = useRef<HTMLButtonElement>(null);
  const rotuloId = `${id}-label`;
  const popId = `${id}-pop`;
  const hintId = `${id}-hint`;

  useEffect(() => {
    if (!aberto) return;

    function fora(evento: PointerEvent) {
      if (raiz.current && !raiz.current.contains(evento.target as Node)) {
        setAberto(false);
      }
    }
    function tecla(evento: KeyboardEvent) {
      if (evento.key !== 'Escape') return;
      setAberto(false);
      gatilho.current?.focus();
    }

    document.addEventListener('pointerdown', fora);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointerdown', fora);
      document.removeEventListener('keydown', tecla);
    };
  }, [aberto]);

  return (
    <div className="field seletor-posicao" ref={raiz}>
      <label id={rotuloId} className="seletor-posicao__label" htmlFor={id}>
        Posição
      </label>
      <button
        ref={gatilho}
        id={id}
        type="button"
        className="seletor-posicao__trigger"
        aria-labelledby={rotuloId}
        aria-expanded={aberto}
        aria-haspopup="dialog"
        aria-controls={popId}
        onClick={() => setAberto((v) => !v)}
      >
        <span data-empty={valor.length === 0 ? '' : undefined}>
          {valor.length === 0 ? '—' : valor.join('+')}
        </span>
      </button>
      {aberto ? (
        <div
          id={popId}
          className="seletor-posicao__pop"
          role="dialog"
          aria-labelledby={rotuloId}
          aria-describedby={hintId}
        >
          <div className="pitch" role="group" aria-label="Campo de posições">
            {LINHAS.flatMap((linha, i) =>
              linha.map((posicao, j) =>
                posicao === null ? (
                  <span className="pitch__hole" aria-hidden="true" key={`${i}-${j}`} />
                ) : (
                  <button
                    key={posicao}
                    type="button"
                    className={`pitch__cell${valor.includes(posicao) ? ' is-on' : ''}`}
                    aria-pressed={valor.includes(posicao)}
                    onClick={() => onChange(alternarPosicao(valor, posicao))}
                  >
                    {posicao}
                  </button>
                ),
              ),
            )}
          </div>
          <span id={hintId} className="seletor-posicao__hint">
            Até 3.{valor.length > 0 ? ` ${valor.join(' + ')}` : ''}
          </span>
        </div>
      ) : null}
    </div>
  );
}
