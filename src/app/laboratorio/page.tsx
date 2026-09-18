'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

import { ALL_DRILLS, classificarDrill, mediaExercicio, montarCronograma } from '../../domain/drills';
import { brancosDaPosicao } from '../../domain/positions';
import { applySeasonTurnover } from '../../domain/season';
import {
  SPECIAL_ABILITY_PATTERNS,
  classificarTalentoPorHabilidadeEspecial,
  type SpecialAbilityRank,
} from '../../domain/talent';
import { conditionCostPerSession } from '../../domain/training';
import type { Atributo, Posicao, RankTalento } from '../../domain/types';
import type { DadosLab, Jogador, TalentoLab } from '../../state/schema';
import { useSquad } from '../../state/store';
import { CalloutRegra } from '../../ui/callout-regra';
import { classeBadgePosicao } from '../../ui/posicao';
import { sortSquadPlayers } from '../squad-order';

const LABELS: Record<Atributo, string> = {
  corte: 'Corte',
  marcacao: 'Marcação',
  posicionamento: 'Posicionamento',
  cabecada: 'Cabeçada',
  coragem: 'Coragem',
  passe: 'Passe',
  drible: 'Drible',
  cruzamento: 'Cruzamento',
  chute: 'Chute',
  finalizacao: 'Finalização',
  condicionamento: 'Condicionamento',
  forca: 'Força',
  agressividade: 'Agressividade',
  velocidade: 'Velocidade',
  criatividade: 'Criatividade',
};

const GRUPOS = [
  { titulo: 'Defesa', classe: 'g-def', atributos: ['corte', 'marcacao', 'posicionamento', 'cabecada', 'coragem'] },
  { titulo: 'Ataque', classe: 'g-atk', atributos: ['passe', 'drible', 'cruzamento', 'chute', 'finalizacao'] },
  {
    titulo: 'Atributos',
    classe: 'g-phy',
    atributos: ['condicionamento', 'forca', 'agressividade', 'velocidade', 'criatividade'],
  },
] as const satisfies readonly { titulo: string; classe: string; atributos: Atributo[] }[];

const RANK_LABELS: Record<RankTalento, string> = {
  terrivel: 'Terrível',
  ruim: 'Ruim',
  normal: 'Normal',
  boa: 'Boa',
  otima: 'Ótima',
  excelente: 'Excelente',
  fenomeno: 'Fenômeno',
};

function rotuloTalento(rank: TalentoLab): string {
  const especial = SPECIAL_ABILITY_PATTERNS.find((pattern) => pattern.rank === rank);
  if (especial) return especial.label;
  return RANK_LABELS[rank as RankTalento];
}

const CATEGORIA_DOT: Record<string, string> = {
  ataque: 'dot c-atk',
  defesa: 'dot c-def',
  posse: 'dot c-pos',
  fisico: 'dot c-fis',
};

const CATEGORIA_CARD: Record<string, string> = {
  ataque: 'card--f-atk',
  defesa: 'card--f-def',
  posse: 'card--f-pos',
  fisico: 'card--f-fis',
};

const CATEGORIA_LABEL: Record<string, string> = {
  ataque: 'Ataque',
  defesa: 'Defesa',
  posse: 'Posse de bola',
  fisico: 'Físico e mental',
};

function TituloGrupoExercicios({
  quantidade,
  titulo,
  explicacao,
}: {
  quantidade: number;
  titulo: string;
  explicacao: string;
}) {
  return (
    <h3 className="sub">
      <span>
        {quantidade} {titulo} · <em>{explicacao}</em>
      </span>
    </h3>
  );
}

const DIFICULDADE_LABEL = ['', 'Muito Fácil', 'Fácil', 'Médio', 'Difícil', 'Muito Difícil'];

function atributosPadrao(): Record<Atributo, number> {
  const atributos = {} as Record<Atributo, number>;
  for (const grupo of GRUPOS) for (const atributo of grupo.atributos) atributos[atributo] = 50;
  return atributos;
}

function labDoJogador(jogador: Jogador): DadosLab {
  return jogador.lab ?? { atributos: atributosPadrao(), brancosOverride: null, talento: null };
}

function formatarPct(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** `aria-valuenow` de role="meter" precisa ficar entre min e max. */
function valorMeter(media: number): number {
  return Math.min(180, Math.max(0, Math.round(media)));
}

export default function LaboratorioPage() {
  const { documento, atualizarLab } = useSquad();

  const elegiveis = useMemo(
    () =>
      sortSquadPlayers(
        documento.jogadores.filter((j) => !j.vendido && !j.posicoes.includes('GK')),
        'name',
      ),
    [documento.jogadores],
  );

  const [jogadorId, setJogadorId] = useState<string | null>(null);
  const selecionado = elegiveis.find((j) => j.id === jogadorId) ?? elegiveis[0] ?? null;

  const [sessoes, setSessoes] = useState(['', '', '', '', '', '']);
  const [erroTeste, setErroTeste] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<SpecialAbilityRank | null>(null);
  const [editandoTalento, setEditandoTalento] = useState(false);
  const testeTalentoRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setSessoes(['', '', '', '', '', '']);
    setErroTeste(null);
    setTestResult(null);
    setEditandoTalento(false);
  }, [selecionado?.id]);

  const lab = useMemo(() => (selecionado ? labDoJogador(selecionado) : null), [selecionado]);
  const talentoAtual: TalentoLab | null = testResult ?? lab?.talento ?? null;
  const resultLabel = talentoAtual ? rotuloTalento(talentoAtual) : null;

  const posicoesLinha = useMemo(
    () => (selecionado ? selecionado.posicoes.filter((p): p is Posicao => p !== 'GK') : []),
    [selecionado],
  );
  const brancosDerivados = useMemo(() => brancosDaPosicao(posicoesLinha), [posicoesLinha]);
  const brancosEfetivos = useMemo(
    () => (lab?.brancosOverride ? new Set(lab.brancosOverride) : brancosDerivados),
    [lab?.brancosOverride, brancosDerivados],
  );

  const drillsInfo = useMemo(() => {
    if (!lab) return [];
    return ALL_DRILLS.filter((drill) => !drill.soDeGoleiro)
      .map((drill) => ({
        drill,
        media: mediaExercicio(lab.atributos, drill),
        classe: classificarDrill(brancosEfetivos, drill),
      }))
      .sort((a, b) => a.media - b.media);
  }, [lab, brancosEfetivos]);

  const primarios = drillsInfo.filter((d) => d.classe === 'primario');
  const secundarios = drillsInfo.filter((d) => d.classe === 'secundario');
  const terciarios = drillsInfo.filter((d) => d.classe === 'terciario');

  const cronograma = useMemo(
    () => (lab ? montarCronograma(lab.atributos, brancosEfetivos) : []),
    [lab, brancosEfetivos],
  );

  function handleAtributoChange(atributo: Atributo, valor: string) {
    if (!selecionado || !lab) return;
    if (valor.trim() === '') return;
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return;
    atualizarLab(selecionado.id, {
      ...lab,
      atributos: { ...lab.atributos, [atributo]: numero },
    });
  }

  function handleToggleBranco(atributo: Atributo) {
    if (!selecionado || !lab) return;
    const novoSet = new Set(brancosEfetivos);
    if (novoSet.has(atributo)) novoSet.delete(atributo);
    else novoSet.add(atributo);
    atualizarLab(selecionado.id, { ...lab, brancosOverride: [...novoSet] });
  }
  function handleSeasonTurnover() {
    if (!selecionado || !lab) return;
    const confirmed = window.confirm(
      'Esta ação simula a virada de temporada e irá abaixar 20 pontos de cada atributo. Confirmar?',
    );
    if (!confirmed) return;
    atualizarLab(selecionado.id, {
      ...lab,
      atributos: applySeasonTurnover(lab.atributos),
    });
  }


  function aoAbrirTesteTalento() {
    const abrir = !editandoTalento;
    setTestResult(null);
    setErroTeste(null);
    setEditandoTalento(abrir);
    if (abrir) {
      testeTalentoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function aoEscolherTalento(valor: string) {
    if (!selecionado || !lab || valor === '') return;
    if (!SPECIAL_ABILITY_PATTERNS.some((pattern) => pattern.rank === valor)) return;
    atualizarLab(selecionado.id, { ...lab, talento: valor as SpecialAbilityRank });
    setTestResult(null);
    setErroTeste(null);
    setEditandoTalento(false);
  }

  function aoClassificarEspecial(evento: FormEvent) {
    evento.preventDefault();
    if (!selecionado || !lab) return;
    const preenchidas = sessoes.map((s) => s.trim());
    if (preenchidas.some((s) => s === '')) {
      setErroTeste('Teste de talento inválido: informe exatamente 6 sessões (GAME-RULES §5).');
      setTestResult(null);
      return;
    }
    const pontos = preenchidas.map(Number);
    try {
      const resultado = classificarTalentoPorHabilidadeEspecial(pontos);
      atualizarLab(selecionado.id, { ...lab, talento: resultado.rank });
      setTestResult(resultado.rank);
      setErroTeste(null);
      setEditandoTalento(false);
    } catch (erro) {
      setErroTeste(erro instanceof Error ? erro.message : 'Teste inválido.');
      setTestResult(null);
    }
  }

  return (
    <>
      <section className="stage">
        <div className="hero">
          <h1>Laboratório</h1>
          <p>
            Simulador de treino, um jogador por vez. Qual exercício rende mais neste jogador agora.
          </p>
        </div>
      </section>

      <main className="lab-page">
        {!selecionado || !lab ? (
          <section className="panel">
            <p className="empty">Cadastre um jogador de linha na aba Squad pra usar o Laboratório.</p>
            <CalloutRegra marca="comunidade" secao="§10">
              O goleiro continua no Squad, mas fica de fora do Laboratório nesta versão. Os
              atributos de GK são outro conjunto.
            </CalloutRegra>
          </section>
        ) : (
          <>
            <section className="ficha">
              <label htmlFor="jogador-lab" className="visually-hidden">
                Jogador
              </label>
              <select
                id="jogador-lab"
                value={selecionado.id}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setJogadorId(e.target.value)}
              >
                {elegiveis.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nome} ({j.overall})
                  </option>
                ))}
              </select>
              <p className="ficha__nome">{selecionado.nome}</p>
              {selecionado.posicoes.map((posicao) => (
                <span key={posicao} className={classeBadgePosicao(posicao)}>
                  {posicao}
                </span>
              ))}
              <span className="ficha__age">
                {selecionado.idade === null ? 'Idade não informada' : `${selecionado.idade} anos`}
              </span>
              <div className="ficha__talento">
                <span
                  className={`talento${resultLabel ? '' : ' talento--empty'}`}
                  data-rank={talentoAtual ?? undefined}
                >
                  Talento: <b>{resultLabel ?? 'não classificado'}</b>
                </span>
                <button className="btn btn--secondary" type="button" onClick={aoAbrirTesteTalento}>
                  {editandoTalento ? 'Cancelar' : lab.talento ? 'Reclassificar' : 'Classificar'}
                </button>
              </div>
            </section>

            <section className="panel">
              <div className="panel__head panel__head--season">
                <h2>Habilidades</h2>
                <button
                  className="btn btn--season"
                  type="button"
                  aria-label="Virada de temporada: reduzir 20 pontos de cada atributo"
                  onClick={handleSeasonTurnover}
                >
                  Virada de temporada
                  <span className="btn__delta" aria-hidden="true">−20</span>
                </button>
              </div>
              <p className="panel__lede">
                Derivadas da posição {posicoesLinha.join('+')}. Confira e ajuste se o jogo divergir.
              </p>
              <div className="grupos">
                {GRUPOS.map((grupo) => {
                  const total = Math.round(
                    grupo.atributos.reduce((soma, a) => soma + lab.atributos[a], 0) / grupo.atributos.length,
                  );
                  return (
                    <div className={`grupo ${grupo.classe}`} key={grupo.titulo}>
                      <div className="grupo__head">
                        <span className="gicon">{grupo.titulo[0]}</span>
                        <h3>{grupo.titulo}</h3>
                        <span className="total num">{total}</span>
                      </div>
                      <div className="attrs">
                        {grupo.atributos.map((atributo) => {
                          const branco = brancosEfetivos.has(atributo);
                          const idValor = `attr-${atributo}`;
                          return (
                            <div
                              key={atributo}
                              className={`attr ${branco ? 'attr--key' : 'attr--gray'}`}
                            >
                              <input
                                type="checkbox"
                                checked={branco}
                                onChange={() => handleToggleBranco(atributo)}
                                aria-label={`${LABELS[atributo]}: atributo-chave`}
                              />
                              <label className="attr__label" htmlFor={idValor}>
                                {LABELS[atributo]}
                              </label>
                              <input
                                id={idValor}
                                className="attr__input num"
                                type="number"
                                inputMode="numeric"
                                value={lab.atributos[atributo]}
                                onChange={(e) => handleAtributoChange(atributo, e.target.value)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="legenda">
                <span>
                  <i className="legenda__key" />
                  Atributo-chave (branco). Cresce ao dobro da velocidade.
                </span>
                <span>
                  <i className="legenda__gray" />
                  Atributo cinza. Entra no overall, quase não muda o jogo.
                </span>
              </p>
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2>Sessão recomendada</h2>
                <span className="hint">Os 6 slots, da menor média para a maior (GAME-RULES §6)</span>
              </div>
              <div className="lines">
                {cronograma.map((drill, i) => {
                  const media = mediaExercicio(lab.atributos, drill);
                  return (
                    <div className="line" key={`${drill.nome}-${i}`}>
                      <span className="line__name">
                        <i className={CATEGORIA_DOT[drill.categoria]} aria-hidden="true" />
                        {i + 1}. {drill.nome}
                      </span>
                      <span className="c-meter">
                        <span
                          className="meter meter--mini"
                          role="meter"
                          aria-valuemin={0}
                          aria-valuemax={180}
                          aria-valuenow={valorMeter(media)}
                          aria-label={`Média de ${drill.nome}`}
                        >
                          <span
                            className="meter__fill"
                            style={{ width: `${Math.min(100, (media / 180) * 100)}%` }}
                          />
                          <span className="meter__mark" style={{ left: 'calc(100% - 2px)' }} />
                        </span>
                      </span>
                      <span className="line__media num">{formatarPct(media)}%</span>
                      <span className="line__falta num">faltam {formatarPct(Math.max(0, 180 - media))}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="split">
              <section className="panel">
                <div className="panel__head">
                  <h2>Exercícios</h2>
                  <span className="hint">{drillsInfo.length} drills classificados para este jogador</span>
                </div>

                <div className="cats">
                  <span>
                    <i className="dot c-atk" aria-hidden="true" />
                    Ataque
                  </span>
                  <span>
                    <i className="dot c-def" aria-hidden="true" />
                    Defesa
                  </span>
                  <span>
                    <i className="dot c-pos" aria-hidden="true" />
                    Posse de bola
                  </span>
                  <span>
                    <i className="dot c-fis" aria-hidden="true" />
                    Físico e mental
                  </span>
                </div>

                <TituloGrupoExercicios
                  quantidade={primarios.length}
                  titulo="Exercícios Primários"
                  explicacao="Todos os atributos que contam são chave"
                />
                <div className="cards">
                  {primarios.map(({ drill, media }, i) => (
                    <div
                      className={['card', i === 0 && 'card--rec', CATEGORIA_CARD[drill.categoria]]
                        .filter(Boolean)
                        .join(' ')}
                      key={drill.nome}
                    >
                      <div className="card__flag">
                        {CATEGORIA_LABEL[drill.categoria]}
                        {i === 0 && <span className="rec">Recomendado</span>}
                      </div>
                      <div className="card__body">
                        <div className="card__name">{drill.nome}</div>
                        <div className="card__attrs">
                          {drill.atributos.map((a) => LABELS[a]).join(' · ')}
                        </div>
                        <div className="card__nums">
                          <span className="card__media num">{formatarPct(media)}%</span>
                          <span className="card__falta num">faltam {formatarPct(Math.max(0, 180 - media))}</span>
                        </div>
                        <div
                          className="meter"
                          role="meter"
                          aria-valuemin={0}
                          aria-valuemax={180}
                          aria-valuenow={valorMeter(media)}
                          aria-label={`Média de ${drill.nome}`}
                        >
                          <div
                            className="meter__fill"
                            style={{ width: `${Math.min(100, (media / 180) * 100)}%` }}
                          />
                          <div className="meter__mark meter__mark--troca" style={{ left: '77.8%' }} />
                          <div className="meter__mark" style={{ left: 'calc(100% - 2px)' }} />
                        </div>
                        <div className="escala">
                          <span>0%</span>
                          <span>140% trocar</span>
                          <span>180% trava</span>
                        </div>
                        <div className="card__foot">
                          <span>{DIFICULDADE_LABEL[drill.dificuldade]}</span>
                          <b>{formatarPct(conditionCostPerSession(drill.dificuldade))}% / sessão</b>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {secundarios.length > 0 && (
                  <>
                    <TituloGrupoExercicios
                      quantidade={secundarios.length}
                      titulo="Exercícios Secundários"
                      explicacao="Um atributo cinza entra na conta"
                    />
                    <div className="lhead">
                      <span>Exercício</span>
                      <span className="c-meter">Até o teto</span>
                      <span className="r">Média</span>
                      <span className="r">Faltam</span>
                    </div>
                    <div className="lines">
                      {secundarios.map(({ drill, media }) => (
                        <div className="line" key={drill.nome}>
                          <span className="line__name">
                            <i className={CATEGORIA_DOT[drill.categoria]} aria-hidden="true" />
                            {drill.nome}
                          </span>
                          <span className="c-meter">
                            <span
                              className="meter meter--mini"
                              role="meter"
                              aria-valuemin={0}
                              aria-valuemax={180}
                              aria-valuenow={valorMeter(media)}
                              aria-label={`Média de ${drill.nome}`}
                            >
                              <span
                                className="meter__fill"
                                style={{ width: `${Math.min(100, (media / 180) * 100)}%` }}
                              />
                              <span className="meter__mark" style={{ left: 'calc(100% - 2px)' }} />
                            </span>
                          </span>
                          <span className="line__media num">{formatarPct(media)}%</span>
                          <span className="line__falta num">{formatarPct(Math.max(0, 180 - media))}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {terciarios.length > 0 && (
                  <>
                    <TituloGrupoExercicios
                      quantidade={terciarios.length}
                      titulo="Exercícios Terciários"
                      explicacao="Dois ou mais atributos cinzas"
                    />
                    <div className="lines">
                      {terciarios.map(({ drill, media }) => (
                        <div className="line line--ter" key={drill.nome}>
                          <span className="line__name">
                            <i className={CATEGORIA_DOT[drill.categoria]} aria-hidden="true" />
                            {drill.nome}
                          </span>
                          <span className="c-meter">
                            <span
                              className="meter meter--mini"
                              role="meter"
                              aria-valuemin={0}
                              aria-valuemax={180}
                              aria-valuenow={valorMeter(media)}
                              aria-label={`Média de ${drill.nome}`}
                            >
                              <span
                                className="meter__fill"
                                style={{ width: `${Math.min(100, (media / 180) * 100)}%` }}
                              />
                              <span className="meter__mark" style={{ left: 'calc(100% - 2px)' }} />
                            </span>
                          </span>
                          <span className="line__media num">{formatarPct(media)}%</span>
                          <span className="line__falta num">{formatarPct(Math.max(0, 180 - media))}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>

              <aside>
                <section
                  className="panel"
                  id="teste-talento"
                  ref={(el) => {
                    testeTalentoRef.current = el;
                    return () => {
                      testeTalentoRef.current = null;
                    };
                  }}
                >
                  <div className="panel__head">
                    <h2>Teste de talento</h2>
                  </div>

                  <p className="note">
                    Isolado do treino de atributos. No jogo, treine uma{' '}
                    <b>habilidade especial</b> ou posição nova (40–50 pontos) e anote quanto a barra
                    andou em cada uma das 6 sessões: 1, 2 ou 3.
                  </p>

                  {!editandoTalento ? (
                    <p className="note">
                      {lab.talento ? (
                        <>
                          Classificado como <b>{rotuloTalento(lab.talento)}</b>. Use Reclassificar
                          na ficha para testar de novo ou informar outro talento.
                        </>
                      ) : (
                        <>
                          Ainda não classificado. Use <b>Classificar</b> na ficha para fazer o teste
                          ou informar o talento manualmente.
                        </>
                      )}
                    </p>
                  ) : (
                    <>
                      <ol className="steps">
                        <li>Comece uma habilidade especial. Não troque depois de iniciada.</li>
                        <li>Rode exatamente 6 sessões e anote os pontos da barra (1, 2 ou 3).</li>
                        <li>Informe a sequência, ou lance o talento manualmente se já souber.</li>
                      </ol>

                      <form onSubmit={aoClassificarEspecial}>
                        <div className="sessoes-especial">
                          {sessoes.map((valor, i) => (
                            <div className="field" key={i}>
                              <label htmlFor={`sessao-${i}`}>S{i + 1}</label>
                              <input
                                id={`sessao-${i}`}
                                className="num"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={3}
                                required
                                aria-invalid={erroTeste ? true : undefined}
                                value={valor}
                                onChange={(e) => {
                                  const proximo = [...sessoes];
                                  proximo[i] = e.target.value;
                                  setSessoes(proximo);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <button className="btn btn--primary" type="submit">
                          Classificar pela barra
                        </button>
                      </form>

                      <div className="field talento-manual">
                        <label htmlFor="talento-manual">Informar manualmente</label>
                        <select
                          id="talento-manual"
                          value=""
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            aoEscolherTalento(e.target.value)
                          }
                        >
                          <option value="">Escolher talento</option>
                          {SPECIAL_ABILITY_PATTERNS.map((pattern) => (
                            <option key={pattern.rank} value={pattern.rank}>
                              {pattern.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div className='tabela-talento-wrap'>
                    <table className='tabela-talento'>
                      <caption>Classificação pelas 6 sessões</caption>
                      <thead>
                        <tr>
                          <th scope='col'>Resultado</th>
                          <th scope='col'>Sequência</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SPECIAL_ABILITY_PATTERNS.map((pattern) => (
                          <tr key={pattern.rank}>
                            <th scope='row'>{pattern.label}</th>
                            <td className='num'>
                              {pattern.points?.join(' ') ?? 'Qualquer sequência com 3'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {erroTeste && (
                    <p className="callout callout--warn" role="alert">
                      <span className="callout__src">Atenção</span>
                      {erroTeste}
                    </p>
                  )}

                  {testResult && resultLabel && (
                    <div className="resultado" data-rank={testResult}>
                      <div className="tile__label">Talento</div>
                      <div className="resultado__nome">{resultLabel}</div>
                    </div>
                  )}

                  <CalloutRegra marca="comunidade" secao="§5">
                    A sequência precisa casar exatamente com a tabela. A única exceção é Fenômeno:
                    basta aparecer um 3 em qualquer uma das 6 sessões.
                  </CalloutRegra>
                </section>
              </aside>
            </div>
          </>
        )}
      </main>
    </>
  );
}
