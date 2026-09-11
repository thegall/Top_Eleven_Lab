'use client';

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
  return (
    <div className="field seletor-posicao">
      <span id={id} className="seletor-posicao__label">
        Posições
      </span>
      <div className="pitch" role="group" aria-labelledby={id} aria-describedby={`${id}-hint`}>
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
      <span id={`${id}-hint`} className="seletor-posicao__hint">
        Até 3. {valor.join(' + ') || 'Nenhuma'}
      </span>
    </div>
  );
}
