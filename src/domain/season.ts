/**
 * Regras aplicadas na virada de temporada (GAME-RULES §7).
 */
const SEASON_ATTRIBUTE_LOSS = 20;

/**
 * Retira 20 de cada atributo, com piso em zero. Genérico no conjunto de
 * atributos porque a virada atinge a ficha de linha e a de goleiro igual
 * (GAME-RULES §7).
 */
export function applySeasonTurnover<A extends string>(
  attributes: Readonly<Record<A, number>>,
): Record<A, number> {
  return Object.fromEntries(
    Object.entries(attributes).map(([attribute, value]) => [
      attribute,
      Math.max(0, (value as number) - SEASON_ATTRIBUTE_LOSS),
    ]),
  ) as Record<A, number>;
}
