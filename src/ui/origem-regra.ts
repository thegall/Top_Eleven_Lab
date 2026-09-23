/**
 * Procedência visível ao usuário (PRD: regras aplicadas com origem declarada).
 * A marca e a seção continuam guiando o tom do callout (ver CalloutRegra),
 * mas o rótulo exibido é fixo — decisão de 2026-09-23 pra não expor jargão
 * de doc interno (GAME-RULES §n) na interface.
 */
export type MarcaOrigem = 'oficial' | 'comunidade' | 'pendente' | 'medicao';

/** Rótulo fixo exibido no callout. */
export function rotuloOrigem(): string {
  return 'REGRAS';
}
