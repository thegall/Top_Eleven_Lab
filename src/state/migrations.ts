/**
 * Cadeia de migração do documento persistido (ADR 0002). Roda no mesmo
 * caminho para `localStorage` e para import — dois caminhos seria um deles
 * sem manutenção.
 */
import { CURRENT_SCHEMA_VERSION, type Documento, type Jogador } from './schema';

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

  if (typeof schemaVersion !== 'number') {
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

  // Única versão conhecida hoje é a 1 — nenhum passo de migração a aplicar ainda.
  return { schemaVersion: CURRENT_SCHEMA_VERSION, jogadores: jogadores as Jogador[] };
}
