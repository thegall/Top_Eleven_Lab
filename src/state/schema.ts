/**
 * O documento persistido: mesmo formato no `localStorage` e no arquivo de
 * exportação (AGENTS.md § Schemas de dados, ADR 0002, ADR 0006).
 */
import type { Atributo, Posicao, RankTalento } from '../domain/types';

export const CURRENT_SCHEMA_VERSION = 1;

/**
 * `Posicao` do domínio cobre só as 11 posições de linha — goleiro está fora
 * do escopo do Laboratório (types.ts). O Squad cadastra os 12 jogadores do
 * elenco, GK incluso, então soma `'GK'` aqui em vez de alargar o tipo do
 * domínio.
 */
export type PosicaoJogador = Posicao | 'GK';

/**
 * Dados do Laboratório para um jogador (etapa 7). `brancosOverride: null`
 * significa "deriva da posição" — o Lab deriva os brancos, mas deixa o campo
 * editável (GAME-RULES §2, "Decisão de produto").
 */
export interface DadosLab {
  atributos: Record<Atributo, number>;
  brancosOverride: Atributo[] | null;
  talento: RankTalento | null;
}

export interface Jogador {
  id: string;
  nome: string;
  overall: number;
  posicoes: PosicaoJogador[];
  vendido: boolean;
  /** Preenchido = promovido ao Laboratório. */
  lab: DadosLab | null;
}

export interface Documento {
  schemaVersion: number;
  jogadores: Jogador[];
}

/** Documento vazio, usado antes da primeira leitura do `localStorage`. */
export function documentoVazio(): Documento {
  return { schemaVersion: CURRENT_SCHEMA_VERSION, jogadores: [] };
}
