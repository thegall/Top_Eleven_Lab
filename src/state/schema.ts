/**
 * O documento persistido: mesmo formato no `localStorage` e no arquivo de
 * exportação (AGENTS.md § Schemas de dados, ADR 0002, ADR 0006).
 */
import type { Atributo, Posicao, RankTalento } from '../domain/types';

export const CURRENT_SCHEMA_VERSION = 2;

/**
 * `Posicao` do domínio cobre só as 11 posições de linha — goleiro está fora
 * do escopo do Laboratório (types.ts). O Squad cadastra os 12 jogadores do
 * elenco, GK incluso, então soma `'GK'` aqui em vez de alargar o tipo do
 * domínio.
 */
export type PosicaoJogador = Posicao | 'GK';

const POSICOES_JOGADOR = new Set<string>([
  'GK',
  'DL',
  'DC',
  'DR',
  'DMC',
  'ML',
  'MC',
  'MR',
  'AML',
  'AMC',
  'AMR',
  'ST',
]);

/** 1 a 3 posições distintas do elenco (GAME-RULES §1). */
export function ehPosicoesValidas(posicoes: unknown): posicoes is PosicaoJogador[] {
  return (
    Array.isArray(posicoes) &&
    posicoes.length > 0 &&
    posicoes.length <= 3 &&
    posicoes.every((p) => typeof p === 'string' && POSICOES_JOGADOR.has(p)) &&
    new Set(posicoes).size === posicoes.length
  );
}

/** v1 aceitava repetidas e mais de 3; a v2 corta no teto sem perder o jogador. */
export function repararPosicoesV1(posicoes: unknown): unknown {
  if (!Array.isArray(posicoes)) return posicoes;
  const unicas: string[] = [];
  for (const p of posicoes) {
    if (typeof p !== 'string' || !POSICOES_JOGADOR.has(p) || unicas.includes(p)) continue;
    unicas.push(p);
    if (unicas.length === 3) break;
  }
  return unicas;
}

/**
 * Dados do Laboratório para um jogador (etapa 7). `brancosOverride: null`
 * significa "deriva da posição" — o Lab deriva os brancos, mas deixa o campo
 * editável (GAME-RULES §2, "Decisão de produto").
 */
/**
 * Talento persistido no Lab. `bagre` é o rank visual do método 1
 * (GAME-RULES §5) e não entra na curva de ganho (THE-37).
 */
export type TalentoLab = RankTalento | 'bagre';

export interface DadosLab {
  atributos: Record<Atributo, number>;
  brancosOverride: Atributo[] | null;
  talento: TalentoLab | null;
}

export interface Jogador {
  id: string;
  nome: string;
  /** Nulo apenas em cadastros migrados da versão 1. */
  idade: number | null;
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
