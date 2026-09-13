/**
 * Cadeia de migração do documento persistido (ADR 0002). Roda no mesmo
 * caminho para `localStorage` e para import — dois caminhos seria um deles
 * sem manutenção.
 */
import {
  CURRENT_SCHEMA_VERSION,
  ehPosicoesValidas,
  repararPosicoesV1,
  type Documento,
  type Jogador,
} from './schema';

function repararJogadorV1(jogador: unknown): unknown {
  if (typeof jogador !== 'object' || jogador === null) return jogador;
  const bruto = jogador as Record<string, unknown>;
  return { ...bruto, idade: null, posicoes: repararPosicoesV1(bruto.posicoes) };
}

const ATRIBUTOS_VALIDOS = new Set([
  'corte',
  'marcacao',
  'posicionamento',
  'cabecada',
  'coragem',
  'passe',
  'drible',
  'cruzamento',
  'chute',
  'finalizacao',
  'condicionamento',
  'forca',
  'agressividade',
  'velocidade',
  'criatividade',
]);

const RANKS_TALENTO_VALIDOS = new Set([
  'terrivel',
  'ruim',
  'normal',
  'boa',
  'otima',
  'excelente',
  'fenomeno',
  'bagre',
]);

/**
 * `mediaExercicio` soma `atributosJogador[atributo]` sem checar `undefined` —
 * um `lab` com atributo faltando vira `NaN` silencioso na média do exercício
 * em vez de um erro na hora certa. Valida aqui, no limite de entrada do
 * documento (ADR 0002), em vez de no motor de domínio.
 */
function ehLabValido(valor: unknown): boolean {
  if (typeof valor !== 'object' || valor === null) return false;
  const lab = valor as Record<string, unknown>;

  if (typeof lab.atributos !== 'object' || lab.atributos === null) return false;
  const atributos = lab.atributos as Record<string, unknown>;
  for (const atributo of ATRIBUTOS_VALIDOS) {
    if (typeof atributos[atributo] !== 'number' || !Number.isFinite(atributos[atributo])) return false;
  }

  if (
    lab.brancosOverride !== null &&
    (!Array.isArray(lab.brancosOverride) ||
      !lab.brancosOverride.every((a) => ATRIBUTOS_VALIDOS.has(a as string)))
  ) {
    return false;
  }

  if (lab.talento !== null && !RANKS_TALENTO_VALIDOS.has(lab.talento as string)) return false;

  return true;
}

function ehJogadorValido(valor: unknown): valor is Jogador {
  if (typeof valor !== 'object' || valor === null) return false;
  const j = valor as Record<string, unknown>;
  return (
    typeof j.id === 'string' &&
    typeof j.nome === 'string' &&
    (j.idade === null ||
      (typeof j.idade === 'number' &&
        Number.isInteger(j.idade) &&
        j.idade >= 18 &&
        j.idade <= 35)) &&
    typeof j.overall === 'number' &&
    Number.isFinite(j.overall) &&
    ehPosicoesValidas(j.posicoes) &&
    typeof j.vendido === 'boolean' &&
    (j.lab === null || ehLabValido(j.lab))
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
  const jogadoresDesconhecidos: unknown[] = jogadores;
  const jogadoresAtuais: unknown[] =
    schemaVersion === 1
      ? jogadoresDesconhecidos.map((jogador) => repararJogadorV1(jogador))
      : jogadoresDesconhecidos;

  if (!jogadoresAtuais.every(ehJogadorValido)) {
    throw new Error('Documento inválido: um ou mais jogadores têm formato inválido.');
  }

  return { schemaVersion: CURRENT_SCHEMA_VERSION, jogadores: jogadoresAtuais };
}
