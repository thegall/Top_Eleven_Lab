/**
 * Escudo da classificação de talento, compartilhado pelo Laboratório e pela
 * lista do Squad. O rótulo de cada rank vem do dicionário (`talento` em
 * i18n.tsx); os ranks internos continuam os da curva da GAME-RULES §3.1.
 */
import type { TalentoLab } from '../state/schema';

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

/** Decorativo: o nome da classificação vem logo ao lado, então o alt fica vazio. */
export function EscudoTalento({ rank }: { rank: TalentoLab }) {
  return <img className="escudo" src={ICONE_TALENTO[rank]} alt="" width={160} height={160} />;
}
