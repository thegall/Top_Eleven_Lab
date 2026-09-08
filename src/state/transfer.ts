/**
 * Exportar e importar o documento como arquivo JSON — a saída de troca de
 * aparelho e de backup manual (ADR 0002).
 */
import { migrar } from './migrations';
import type { Documento } from './schema';

export function exportarJSON(documento: Documento): string {
  return JSON.stringify(documento, null, 2);
}

/** Recusa versão mais nova que a suportada em vez de adivinhar (ADR 0002, regra 4). */
export function importarJSON(texto: string): Documento {
  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch {
    throw new Error('Arquivo inválido: não é JSON.');
  }
  return migrar(bruto);
}
