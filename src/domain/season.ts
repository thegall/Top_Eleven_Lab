/**
 * Regras aplicadas na virada de temporada (GAME-RULES §7).
 */
import type { Atributo } from './types';

const SEASON_ATTRIBUTE_LOSS = 20;

export function applySeasonTurnover(
  attributes: Readonly<Record<Atributo, number>>,
): Record<Atributo, number> {
  return Object.fromEntries(
    Object.entries(attributes).map(([attribute, value]) => [
      attribute,
      Math.max(0, value - SEASON_ATTRIBUTE_LOSS),
    ]),
  ) as Record<Atributo, number>;
}
