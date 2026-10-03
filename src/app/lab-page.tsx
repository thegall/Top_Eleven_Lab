'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

import {
  classificarDrillsDeLinha,
  preencherSlots,
  type Drill,
  type DrillClassificado,
} from '../domain/drills';
import {
  ATRIBUTOS_COMUNS,
  ATRIBUTOS_DO_GOL,
  ATRIBUTOS_GOLEIRO,
  atributosValidosGoleiro,
  brancosDoGoleiro,
  classificarDrillsDeGoleiro,
} from '../domain/goalkeeper';
import { brancosDaPosicao } from '../domain/positions';
import { applySeasonTurnover } from '../domain/season';
import {
  SPECIAL_ABILITY_PATTERNS,
  classificarTalentoPorHabilidadeEspecial,
  type SpecialAbilityRank,
} from '../domain/talent';
import { conditionCostPerSession } from '../domain/training';
import type { Atributo, AtributoGoleiro, Posicao } from '../domain/types';
import {
  ehGoleiro,
  type DadosLab,
  type DadosLabGoleiro,
  type DadosLabLinha,
  type Jogador,
  type TalentoLab,
} from '../state/schema';
import { useSquad } from '../state/store';
import { CalloutRegra } from '../ui/callout-regra';
import { classeBadgePosicao } from '../ui/posicao';
import { formatarDecimal, type Textos } from '../ui/i18n';
import { useTextos } from '../ui/idioma';
import { EscudoTalento } from '../ui/talento';
import { sortSquadPlayers } from './squad-order';

const GRUPOS = [
  {
    titulo: 'defesa',
    classe: 'g-def',
    icone: '/icone-defesa.png',
    atributos: ['corte', 'marcacao', 'posicionamento', 'cabecada', 'coragem'],
  },
  {
    titulo: 'ataque',
    classe: 'g-atk',
    icone: '/icone-ataque.png',
    atributos: ['passe', 'drible', 'cruzamento', 'chute', 'finalizacao'],
  },
  {
    titulo: 'atributos',
    classe: 'g-phy',
    icone: '/icone-atributos.png',
    atributos: ['condicionamento', 'forca', 'agressividade', 'velocidade', 'criatividade'],
  },
] as const satisfies readonly {
  titulo: GrupoAtributos;
  classe: string;
  icone: string;
  atributos: Atributo[];
}[];

/**
 * A tela do goleiro tem 2 blocos, e o de Defesa do gol vem em duas listas de 5
 * — ocupando a mesma largura dos 3 grupos do jogador de linha (GAME-RULES §2).
 */
const GRUPOS_GOLEIRO = [
  {
    titulo: 'defesaDoGol',
    classe: 'g-gk',
    icone: '/icone-defesa-do-gol.png',
    atributos: ATRIBUTOS_DO_GOL,
    largo: true,
  },
  {
    titulo: 'atributos',
    classe: 'g-phy',
    icone: '/icone-atributos.png',
    atributos: ATRIBUTOS_COMUNS,
  },
] as const satisfies readonly {
  titulo: GrupoAtributos;
  classe: string;
  icone: string;
  atributos: readonly AtributoGoleiro[];
  largo?: boolean;
}[];

/** Chave do título do grupo no dicionário (`grupos` em i18n.tsx). */
type GrupoAtributos = keyof Textos['grupos'];

/**
 * O que a interface precisa saber da ficha aberta, já resolvido para o tipo de
 * jogador. Os atributos viram `string` aqui porque o JSX é o mesmo para as duas
 * fichas — quem faz conta é o domínio, com os tipos estreitos.
 */
interface Ficha {
  grupos: readonly {
    titulo: GrupoAtributos;
    classe: string;
    icone: string;
    atributos: readonly string[];
    largo?: boolean;
  }[];
  atributos: Record<string, number>;
  brancos: Set<string>;
  /** Posições de onde vieram os brancos; `null` = tabela de goleiro. */
  origemDosBrancos: string | null;
  drills: DrillClassificado[];
  cronograma: DrillClassificado[];
  atributosDoDrill: (drill: Drill) => readonly string[];
}

function fichaDeLinha(lab: DadosLabLinha, posicoes: Posicao[]): Ficha {
  const brancos = lab.brancosOverride
    ? new Set(lab.brancosOverride)
    : brancosDaPosicao(posicoes);
  const drills = classificarDrillsDeLinha(lab.atributos, brancos);
  return {
    grupos: GRUPOS,
    atributos: lab.atributos,
    brancos,
    origemDosBrancos: posicoes.join('+'),
    drills,
    cronograma: preencherSlots(drills),
    atributosDoDrill: (drill) => drill.atributos,
  };
}

function fichaDeGoleiro(lab: DadosLabGoleiro): Ficha {
  const brancos = lab.brancosOverride ? new Set(lab.brancosOverride) : brancosDoGoleiro();
  const drills = classificarDrillsDeGoleiro(lab.atributos, brancos);
  return {
    grupos: GRUPOS_GOLEIRO,
    atributos: lab.atributos,
    brancos,
    origemDosBrancos: null,
    drills,
    cronograma: preencherSlots(drills),
    atributosDoDrill: atributosValidosGoleiro,
  };
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

const ATRIBUTOS_LINHA = GRUPOS.flatMap((grupo) => grupo.atributos);

/** Ficha nova começa com 50 em tudo, na lista de atributos do tipo do jogador. */
function labDoJogador(jogador: Jogador): DadosLab {
  if (jogador.lab) return jogador.lab;
  const chaves: readonly string[] = ehGoleiro(jogador) ? ATRIBUTOS_GOLEIRO : ATRIBUTOS_LINHA;
  return {
    atributos: Object.fromEntries(chaves.map((chave) => [chave, 50])),
    brancosOverride: null,
    talento: null,
  } as DadosLab;
}

/** `aria-valuenow` de role="meter" precisa ficar entre min e max. */
function valorMeter(media: number): number {
  return Math.min(180, Math.max(0, Math.round(media)));
}

export default function LaboratorioPage() {
  const { documento, atualizarLab } = useSquad();
  const textos = useTextos();
  const t = textos.lab;
  const formatarPct = (valor: number) => formatarDecimal(textos, valor);
  const rotulo = (atributo: string) => textos.atributos[atributo as Atributo | AtributoGoleiro];

  const elegiveis = useMemo(
    () => sortSquadPlayers(documento.jogadores.filter((j) => !j.vendido), 'name'),
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
  const resultLabel = talentoAtual ? textos.talento[talentoAtual] : null;

  const ficha = useMemo(() => {
    if (!selecionado || !lab) return null;
    if (ehGoleiro(selecionado)) return fichaDeGoleiro(lab as DadosLabGoleiro);
    const posicoes = selecionado.posicoes.filter((p): p is Posicao => p !== 'GK');
    return fichaDeLinha(lab as DadosLabLinha, posicoes);
  }, [selecionado, lab]);

  const primarios = ficha?.drills.filter((d) => d.classe === 'primario') ?? [];
  const secundarios = ficha?.drills.filter((d) => d.classe === 'secundario') ?? [];
  const terciarios = ficha?.drills.filter((d) => d.classe === 'terciario') ?? [];

  /**
   * As três escritas abaixo montam um `lab` do mesmo tipo do que entrou — o
   * TypeScript perde isso ao ver a união, então o `as DadosLab` reafirma o que a
   * posição do jogador já garante (schema.ts).
   */
  function handleAtributoChange(atributo: string, valor: string) {
    if (!selecionado || !lab) return;
    if (valor.trim() === '') return;
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return;
    atualizarLab(selecionado.id, {
      ...lab,
      atributos: { ...lab.atributos, [atributo]: numero },
    } as DadosLab);
  }

  function handleToggleBranco(atributo: string) {
    if (!selecionado || !lab || !ficha) return;
    const novoSet = new Set(ficha.brancos);
    if (novoSet.has(atributo)) novoSet.delete(atributo);
    else novoSet.add(atributo);
    atualizarLab(selecionado.id, { ...lab, brancosOverride: [...novoSet] } as DadosLab);
  }

  function handleSeasonTurnover() {
    if (!selecionado || !lab) return;
    const confirmed = window.confirm(t.viradaConfirm);
    if (!confirmed) return;
    atualizarLab(selecionado.id, {
      ...lab,
      atributos: applySeasonTurnover<string>(lab.atributos),
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
      setErroTeste(t.erroVazio);
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
    } catch {
      // A mensagem do motor é para quem desenvolve; a tela tem a sua (THE-63).
      setErroTeste(t.erroSequencia);
      setTestResult(null);
    }
  }

  return (
    <>
      <section className="stage">
        <div className="hero">
          <h1>{t.titulo}</h1>
          <p>{t.lead}</p>
        </div>
      </section>

      <main className="lab-page">
        {!selecionado || !lab || !ficha ? (
          <section className="panel">
            <p className="empty">{t.vazio}</p>
            <CalloutRegra marca="comunidade">{t.calloutGoleiro}</CalloutRegra>
          </section>
        ) : (
          <>
            <section className="ficha">
              <label htmlFor="jogador-lab" className="visually-hidden">
                {t.jogador}
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
                {selecionado.idade === null ? t.idadeNaoInformada : t.anos(selecionado.idade)}
              </span>
              <div className="ficha__talento">
                <span
                  className={`talento${resultLabel ? '' : ' talento--empty'}`}
                  data-rank={talentoAtual ?? undefined}
                >
                  {talentoAtual && <EscudoTalento rank={talentoAtual} />}
                  <span className="visually-hidden">{t.talentoSr}</span>
                  <b>{resultLabel ?? t.naoClassificado}</b>
                </span>
                <button className="btn btn--secondary" type="button" onClick={aoAbrirTesteTalento}>
                  {editandoTalento ? t.cancelar : lab.talento ? t.reclassificar : t.classificar}
                </button>
              </div>
            </section>

            <section className="panel">
              <div className="panel__head panel__head--season">
                <h2>{t.habilidades}</h2>
                <button
                  className="btn btn--season"
                  type="button"
                  aria-label={t.viradaAria}
                  onClick={handleSeasonTurnover}
                >
                  {t.virada}
                  <span className="btn__delta" aria-hidden="true">−20</span>
                </button>
              </div>
              <p className="panel__lede">
                {ficha.origemDosBrancos === null
                  ? t.origemGoleiro
                  : t.origemLinha(ficha.origemDosBrancos)}
              </p>
              <div className="grupos">
                {ficha.grupos.map((grupo) => {
                  const total = Math.round(
                    grupo.atributos.reduce((soma, a) => soma + ficha.atributos[a]!, 0) /
                      grupo.atributos.length,
                  );
                  return (
                    <div
                      className={`grupo ${grupo.classe}${grupo.largo ? ' grupo--wide' : ''}`}
                      key={grupo.titulo}
                    >
                      <div className="grupo__head">
                        <img className="gicon" src={grupo.icone} alt="" width={96} height={96} />
                        <h3>{textos.grupos[grupo.titulo]}</h3>
                        <span className="total num">{total}</span>
                      </div>
                      <div className="attrs">
                        {grupo.atributos.map((atributo) => {
                          const branco = ficha.brancos.has(atributo);
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
                                aria-label={t.atributoChaveAria(rotulo(atributo))}
                              />
                              <label className="attr__label" htmlFor={idValor}>
                                {rotulo(atributo)}
                              </label>
                              <input
                                id={idValor}
                                className="attr__input num"
                                type="number"
                                inputMode="numeric"
                                value={ficha.atributos[atributo]}
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
                  {t.legendaBranco}
                </span>
                <span>
                  <i className="legenda__gray" />
                  {t.legendaCinza}
                </span>
              </p>
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2>{t.sessaoTitulo}</h2>
                <span className="hint">{t.sessaoHint}</span>
              </div>
              <div className="lines">
                {ficha.cronograma.map(({ drill, media }, i) => {
                  return (
                    <div className="line" key={`${drill.id}-${i}`}>
                      <span className="line__name">
                        <i className={CATEGORIA_DOT[drill.categoria]} aria-hidden="true" />
                        {i + 1}. {textos.drills[drill.id]}
                      </span>
                      <span className="c-meter">
                        <span
                          className="meter meter--mini"
                          role="meter"
                          aria-valuemin={0}
                          aria-valuemax={180}
                          aria-valuenow={valorMeter(media)}
                          aria-label={t.mediaDe(textos.drills[drill.id])}
                        >
                          <span
                            className="meter__fill"
                            style={{ width: `${Math.min(100, (media / 180) * 100)}%` }}
                          />
                          <span className="meter__mark" style={{ left: 'calc(100% - 2px)' }} />
                        </span>
                      </span>
                      <span className="line__media num">{formatarPct(media)}%</span>
                      <span className="line__falta num">{t.faltam(formatarPct(Math.max(0, 180 - media)))}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="split">
              <section className="panel">
                <div className="panel__head">
                  <h2>{t.exercicios}</h2>
                  <span className="hint">{t.exerciciosHint(ficha.drills.length)}</span>
                </div>

                <div className="cats">
                  {(['ataque', 'defesa', 'posse', 'fisico'] as const).map((categoria) => (
                    <span key={categoria}>
                      <i className={CATEGORIA_DOT[categoria]} aria-hidden="true" />
                      {textos.categoria[categoria]}
                    </span>
                  ))}
                </div>

                <TituloGrupoExercicios
                  quantidade={primarios.length}
                  titulo={t.primarios}
                  explicacao={t.primariosExplicacao}
                />
                <div className="cards">
                  {primarios.map(({ drill, media }, i) => (
                    <div
                      className={['card', i === 0 && 'card--rec', CATEGORIA_CARD[drill.categoria]]
                        .filter(Boolean)
                        .join(' ')}
                      key={drill.id}
                    >
                      <div className="card__flag">
                        {textos.categoria[drill.categoria]}
                        {i === 0 && <span className="rec">{t.recomendado}</span>}
                      </div>
                      <div className="card__body">
                        <div className="card__name">{textos.drills[drill.id]}</div>
                        <div className="card__attrs">
                          {ficha.atributosDoDrill(drill).map(rotulo).join(' · ')}
                        </div>
                        <div className="card__nums">
                          <span className="card__media num">{formatarPct(media)}%</span>
                          <span className="card__falta num">{t.faltam(formatarPct(Math.max(0, 180 - media)))}</span>
                        </div>
                        <div
                          className="meter"
                          role="meter"
                          aria-valuemin={0}
                          aria-valuemax={180}
                          aria-valuenow={valorMeter(media)}
                          aria-label={t.mediaDe(textos.drills[drill.id])}
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
                          <span>140% {t.escalaTrocar}</span>
                          <span>180% {t.escalaTrava}</span>
                        </div>
                        <div className="card__foot">
                          <span>{textos.dificuldade[drill.dificuldade]}</span>
                          <b>
                            {formatarPct(conditionCostPerSession(drill.dificuldade))}% {t.porSessao}
                          </b>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {secundarios.length > 0 && (
                  <>
                    <TituloGrupoExercicios
                      quantidade={secundarios.length}
                      titulo={t.secundarios}
                      explicacao={t.secundariosExplicacao}
                    />
                    <div className="lhead">
                      <span>{t.colExercicio}</span>
                      <span className="c-meter">{t.colAteOTeto}</span>
                      <span className="r">{t.colMedia}</span>
                      <span className="r">{t.colFaltam}</span>
                    </div>
                    <div className="lines">
                      {secundarios.map(({ drill, media }) => (
                        <div className="line" key={drill.id}>
                          <span className="line__name">
                            <i className={CATEGORIA_DOT[drill.categoria]} aria-hidden="true" />
                            {textos.drills[drill.id]}
                          </span>
                          <span className="c-meter">
                            <span
                              className="meter meter--mini"
                              role="meter"
                              aria-valuemin={0}
                              aria-valuemax={180}
                              aria-valuenow={valorMeter(media)}
                              aria-label={t.mediaDe(textos.drills[drill.id])}
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
                      titulo={t.terciarios}
                      explicacao={t.terciariosExplicacao}
                    />
                    <div className="lines">
                      {terciarios.map(({ drill, media }) => (
                        <div className="line line--ter" key={drill.id}>
                          <span className="line__name">
                            <i className={CATEGORIA_DOT[drill.categoria]} aria-hidden="true" />
                            {textos.drills[drill.id]}
                          </span>
                          <span className="c-meter">
                            <span
                              className="meter meter--mini"
                              role="meter"
                              aria-valuemin={0}
                              aria-valuemax={180}
                              aria-valuenow={valorMeter(media)}
                              aria-label={t.mediaDe(textos.drills[drill.id])}
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
                    <h2>{t.testeTitulo}</h2>
                    <img className="estrelas" src="/estrelas.png" alt="" width={520} height={41} />
                  </div>

                  <p className="note">{t.testeNota}</p>

                  {!editandoTalento ? (
                    <p className="note">
                      {lab.talento
                        ? t.classificadoComo(textos.talento[lab.talento])
                        : t.aindaNaoClassificado}
                    </p>
                  ) : (
                    <>
                      <ol className="steps">
                        {t.passos.map((passo) => (
                          <li key={passo}>{passo}</li>
                        ))}
                      </ol>

                      <form onSubmit={aoClassificarEspecial}>
                        <div className="sessoes-especial">
                          {sessoes.map((valor, i) => (
                            <div className="field" key={i}>
                              <label htmlFor={`sessao-${i}`}>{t.sessaoCurta(i + 1)}</label>
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
                          {t.classificarPelaBarra}
                        </button>
                      </form>

                      <div className="field talento-manual">
                        <label htmlFor="talento-manual">{t.informarManual}</label>
                        <select
                          id="talento-manual"
                          value=""
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            aoEscolherTalento(e.target.value)
                          }
                        >
                          <option value="">{t.escolherTalento}</option>
                          {SPECIAL_ABILITY_PATTERNS.map((pattern) => (
                            <option key={pattern.rank} value={pattern.rank}>
                              {textos.talento[pattern.rank]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div className='tabela-talento-wrap'>
                    <table className='tabela-talento'>
                      <caption>{t.tabelaCaption}</caption>
                      <thead>
                        <tr>
                          <th scope='col'>{t.colResultado}</th>
                          <th scope='col'>{t.colSequencia}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SPECIAL_ABILITY_PATTERNS.map((pattern) => (
                          <tr key={pattern.rank}>
                            <th scope='row'>
                              <EscudoTalento rank={pattern.rank} />
                              {textos.talento[pattern.rank]}
                            </th>
                            <td className='num'>
                              {pattern.points?.join(' ') ?? t.qualquer3}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {erroTeste && (
                    <p className="callout callout--warn" role="alert">
                      <span className="callout__src">{t.atencao}</span>
                      {erroTeste}
                    </p>
                  )}

                  {testResult && resultLabel && (
                    <div className="resultado" data-rank={testResult}>
                      <div className="tile__label">{t.talento}</div>
                      <div className="resultado__nome">{resultLabel}</div>
                    </div>
                  )}

                  <CalloutRegra marca="comunidade">{t.calloutTeste}</CalloutRegra>
                </section>
              </aside>
            </div>
          </>
        )}
      </main>
    </>
  );
}
