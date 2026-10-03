/**
 * Procedência visível ao usuário (PRD: regras aplicadas com origem declarada).
 * A marca guia o tom do callout (ver CalloutRegra), mas o rótulo exibido é fixo
 * e vem do dicionário (`regras` em i18n.tsx) — decisão de 2026-09-23 pra não
 * expor jargão de doc interno (GAME-RULES §n) na interface.
 */
export type MarcaOrigem = 'oficial' | 'comunidade' | 'pendente' | 'medicao';
