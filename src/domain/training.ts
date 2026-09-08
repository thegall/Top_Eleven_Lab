/**
 * Regras de treino. Toda constante aqui vem de docs/GAME-RULES.md, com a
 * seção de origem citada — nenhuma nasce no código.
 */

/** Dificuldade de um exercício, de Muito Fácil (1) a Muito Difícil (5). */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

/** Uma sessão de treino tem 6 slots (GAME-RULES §4). */
export const SLOTS_PER_SESSION = 6;

/** Uma maleta verde repõe 15 pontos percentuais de condicionamento (GAME-RULES §9). */
export const CONDITION_PER_GREEN_PACK = 15;

/**
 * Desgaste de condicionamento de um slot, em pontos percentuais.
 *
 * A dificuldade não é rótulo: ela é o custo, em cinco degraus de 0,75%
 * (GAME-RULES §4). Confirmado nos 29 exercícios do jogo.
 */
export function conditionCostPerSlot(difficulty: Difficulty): number {
  return difficulty * 0.75;
}

/** Desgaste de uma sessão inteira preenchida com o mesmo exercício. */
export function conditionCostPerSession(difficulty: Difficulty): number {
  return conditionCostPerSlot(difficulty) * SLOTS_PER_SESSION;
}

/**
 * Maletas verdes necessárias para repor um gasto de condicionamento.
 * Maleta é indivisível, então arredonda para cima (GAME-RULES §9).
 */
export function greenPacksFor(conditionCost: number): number {
  return Math.ceil(conditionCost / CONDITION_PER_GREEN_PACK);
}

/** Nome de contrato do AGENTS.md para {@link greenPacksFor} (GAME-RULES §9). */
export const custoEmMaletas = greenPacksFor;
