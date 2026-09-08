/**
 * Casca fina sobre `localStorage` (ADR 0002). Gravação write-through e
 * síncrona a cada documento novo — o documento tem ~5 KB, então `stringify`
 * custa microssegundos e debounce só criaria janela de perda de dado.
 */
import { migrar } from './migrations';
import { documentoVazio, type Documento } from './schema';

const CHAVE = 'top-eleven-lab:documento';

/**
 * Lê o documento salvo. Sem entrada, ou entrada corrompida, devolve o
 * documento vazio em vez de lançar — a interface não trava no primeiro uso.
 */
export function carregar(): Documento {
  const bruto = localStorage.getItem(CHAVE);
  if (bruto === null) return documentoVazio();

  try {
    return migrar(JSON.parse(bruto));
  } catch {
    return documentoVazio();
  }
}

/** Grava o documento. Só recebe documento já migrado e válido (ADR 0002, regra 3). */
export function salvar(documento: Documento): void {
  localStorage.setItem(CHAVE, JSON.stringify(documento));
}
