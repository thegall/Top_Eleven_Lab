/**
 * Cadeia de migração do documento persistido (ADR 0002). Roda no mesmo
 * caminho para `localStorage` e para import — dois caminhos seria um deles
 * sem manutenção.
 */
import { CURRENT_SCHEMA_VERSION, type Documento, type Jogador } from './schema';

const POSICOES_VALIDAS = new Set([
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

function ehJogadorValido(valor: unknown): valor is Jogador {
  if (typeof valor !== 'object' || valor === null) return false;
  const j = valor as Record<string, unknown>;
  return (
    typeof j.id === 'string' &&
    typeof j.nome === 'string' &&
    typeof j.overall === 'number' &&
    Number.isFinite(j.overall) &&
    Array.isArray(j.posicoes) &&
    j.posicoes.length > 0 &&
    j.posicoes.every((p) => POSICOES_VALIDAS.has(p as string)) &&
    typeof j.vendido === 'boolean' &&
    (j.lab === null || typeof j.lab === 'object')
  );
}

/**
 * Valida e migra um documento bruto (de `localStorage` ou de um arquivo
 * importado) para o formato atual. Versão maior que a conhecida é recusada,
 * não adivinhada — regra 4 da ADR 0002.
 */
export function migrar(bruto: unknown): Documento {
  if (typeof bruto !== 'object' || bruto === null) {
    throw new Error('Documento inválido: esperado um objeto.');
  }

  const documento = bruto as Record<string, unknown>;
  const { schemaVersion, jogadores } = documento;

  if (typeof schemaVersion !== 'number' || !Number.isSafeInteger(schemaVersion) || schemaVersion < 1) {
    throw new Error('Documento inválido: schemaVersion ausente ou não numérico.');
  }
  if (schemaVersion > CURRENT_SCHEMA_VERSION) {
    throw new Error(
      `Documento de versão ${schemaVersion} é mais novo que o suportado (${CURRENT_SCHEMA_VERSION}).`,
    );
  }
  if (!Array.isArray(jogadores)) {
    throw new Error('Documento inválido: jogadores deve ser uma lista.');
  }
  if (!jogadores.every(ehJogadorValido)) {
    throw new Error('Documento inválido: um ou mais jogadores têm formato inválido.');
  }

  // Única versão conhecida hoje é a 1 — nenhum passo de migração a aplicar ainda.
  return { schemaVersion: CURRENT_SCHEMA_VERSION, jogadores };
}
