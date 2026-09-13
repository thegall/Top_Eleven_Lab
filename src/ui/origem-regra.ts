/**
 * Procedência visível ao usuário (PRD: regras aplicadas com origem declarada).
 * As marcas seguem docs/GAME-RULES.md, "Como ler este documento".
 * Não inventa valor de regra — só rotula o que já está documentado.
 */
export type MarcaOrigem = 'oficial' | 'comunidade' | 'pendente' | 'medicao';

const MARCAS: Record<MarcaOrigem, string> = {
  oficial: 'OFICIAL',
  comunidade: 'COMUNIDADE',
  pendente: 'PENDENTE',
  medicao: 'MEDIÇÃO',
};

/** Rótulo no formato `[MARCA] GAME-RULES §n`. */
export function rotuloOrigem(marca: MarcaOrigem, secao: string): string {
  return `[${MARCAS[marca]}] GAME-RULES ${secao}`;
}
