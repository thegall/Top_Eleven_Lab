/**
 * Rótulo e escudo da classificação de talento, compartilhados pelo Laboratório
 * e pela lista do Squad. Os nomes são os da GAME-RULES §5 (método 1); os ranks
 * internos continuam os da curva da §3.1.
 */
import type { TalentoLab } from '../state/schema';
import { pt } from './i18n';

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
  return pt.talento[rank];
}

/** Decorativo: o nome da classificação vem logo ao lado, então o alt fica vazio. */
export function EscudoTalento({ rank }: { rank: TalentoLab }) {
  return <img className="escudo" src={ICONE_TALENTO[rank]} alt="" width={160} height={160} />;
}
