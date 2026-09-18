/**
 * Rótulo e escudo da classificação de talento, compartilhados pelo Laboratório
 * e pela lista do Squad. Os nomes são os da GAME-RULES §5 (método 1); os ranks
 * internos continuam os da curva da §3.1.
 */
import { SPECIAL_ABILITY_PATTERNS } from '../domain/talent';
import type { RankTalento } from '../domain/types';
import type { TalentoLab } from '../state/schema';

/** Só alcançado por `ruim` e `terrivel`: os demais ranks vêm da tabela do método 1. */
const RANK_LABELS: Record<RankTalento, string> = {
  // Ruim e Terrível são a mesma coisa para o jogador: as duas chamam Bagre
  // (GAME-RULES §3.1, nomenclatura de 2026-09-18). A curva mantém os dois sigmas.
  terrivel: 'Bagre',
  ruim: 'Bagre',
  normal: 'Normal',
  boa: 'Bom Jogador',
  otima: 'Craque',
  excelente: 'Gênio',
  fenomeno: 'Lenda',
};

/** Escudo de cada classificação: arte do jogo recortada do fundo (`public/talento-*.png`). */
const ICONE_TALENTO: Record<TalentoLab, string> = {
  terrivel: '/talento-bagre.png',
  ruim: '/talento-bagre.png',
  bagre: '/talento-bagre.png',
  normal: '/talento-normal.png',
  boa: '/talento-bom-jogador.png',
  otima: '/talento-craque.png',
  excelente: '/talento-genio.png',
  fenomeno: '/talento-lenda.png',
};

export function rotuloTalento(rank: TalentoLab): string {
  const especial = SPECIAL_ABILITY_PATTERNS.find((pattern) => pattern.rank === rank);
  if (especial) return especial.label;
  return RANK_LABELS[rank as RankTalento];
}

/** Decorativo: o nome da classificação vem logo ao lado, então o alt fica vazio. */
export function EscudoTalento({ rank }: { rank: TalentoLab }) {
  return <img className="escudo" src={ICONE_TALENTO[rank]} alt="" width={160} height={160} />;
}
