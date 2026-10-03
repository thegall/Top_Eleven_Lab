'use client';

import { Fragment, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

import { mediaDos14 } from '../domain/squad';
import type { Jogador, PosicaoJogador } from '../state/schema';
import { useSquad } from '../state/store';
import { exportarJSON, importarJSON } from '../state/transfer';
import { CalloutRegra } from '../ui/callout-regra';
import { classeBadgePosicao } from '../ui/posicao';
import { SeletorPosicao } from '../ui/seletor-posicao';
import { formatarDecimal } from '../ui/i18n';
import { useTextos } from '../ui/idioma';
import { EscudoTalento } from '../ui/talento';
import { POSITION_FIELD_ORDER, sortSquadPlayers, type SquadOrder } from './squad-order';

/** Faixa de idade coberta pela curva de treino (GAME-RULES §3.2). */
const PLAYER_AGE_MIN = 18;
const PLAYER_AGE_MAX = 35;

function isValidPlayerAge(age: number): boolean {
  return Number.isInteger(age) && age >= PLAYER_AGE_MIN && age <= PLAYER_AGE_MAX;
}

/** Piso de cada faixa de média; o texto de cada uma fica no dicionário, na mesma ordem. */
const FAIXAS_MIN = [0, 86, 101, 116] as const;

interface LinhaElenco {
  jogador: Jogador;
  rank: number;
  top14: boolean;
  promovido: boolean;
}

/** Ordena o elenco inteiro por overall e marca quem está nos 14 que contam (GAME-RULES §8). */
function montarLinhas(jogadores: Jogador[]): { linhas: LinhaElenco[]; indiceDoCorte: number | null } {
  const ordenado = [...jogadores].sort((a, b) => b.overall - a.overall);
  const linhas: LinhaElenco[] = [];
  let ativosVistos = 0;
  let vendidosAcima = 0;
  let indiceDoCorte: number | null = null;

  ordenado.forEach((jogador, i) => {
    if (jogador.vendido) {
      linhas.push({ jogador, rank: i + 1, top14: false, promovido: false });
      vendidosAcima += 1;
      return;
    }
    ativosVistos += 1;
    const top14 = ativosVistos <= 14;
    const promovido = ativosVistos === 14 && vendidosAcima > 0;
    linhas.push({ jogador, rank: i + 1, top14, promovido });
    if (ativosVistos === 14) indiceDoCorte = linhas.length - 1;
  });

  return { linhas, indiceDoCorte };
}

function exportar(documento: { schemaVersion: number; jogadores: Jogador[] }) {
  const blob = new Blob([exportarJSON(documento)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'top-eleven-lab.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function IconeLapis() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.7 1.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4L6 13H3v-3l8.7-8.7zM3 14h10v1H3z"
      />
    </svg>
  );
}

function IconeLixeira() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 1h4l1 1h3v1H2V2h3l1-1zm1 4h1v7H7V5zm3 0h1v7h-1V5zM4 4h8l-.7 10.1A1 1 0 0 1 10.3 15H5.7a1 1 0 0 1-1-.9L4 4z"
      />
    </svg>
  );
}

export default function SquadPage() {
  const {
    documento,
    adicionarJogador,
    atualizarJogador,
    excluirJogador,
    marcarVendido,
    desfazerVenda,
    substituirDocumento,
  } = useSquad();
  const textos = useTextos();
  const t = textos.squad;
  const formatarNumero = (valor: number) => formatarDecimal(textos, valor);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [overall, setOverall] = useState('');
  const [posicoes, setPosicoes] = useState<PosicaoJogador[]>([]);
  const [erroImportacao, setErroImportacao] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editIdade, setEditIdade] = useState('');
  const [editOverall, setEditOverall] = useState('');
  const [squadOrder, setSquadOrder] = useState<SquadOrder>('overall');
  const [editPosicoes, setEditPosicoes] = useState<PosicaoJogador[]>([]);

  const jogadores = documento.jogadores;

  const { linhas: overallLines, indiceDoCorte: overallCutIndex } = useMemo(
    () => montarLinhas(jogadores),
    [jogadores],
  );
  const linhas = useMemo(() => {
    if (squadOrder === 'overall') return overallLines;

    const metadataById = new Map(
      overallLines.map(({ jogador, top14, promovido }) => [
        jogador.id,
        { top14, promovido },
      ]),
    );
    return sortSquadPlayers(jogadores, squadOrder).map((jogador, index) => ({
      jogador,
      rank: index + 1,
      ...(metadataById.get(jogador.id) ?? { top14: false, promovido: false }),
    }));
  }, [jogadores, overallLines, squadOrder]);
  const indiceDoCorte = squadOrder === 'overall' ? overallCutIndex : null;

  const mediaComVendas = useMemo(() => mediaDos14(jogadores), [jogadores]);
  const mediaSemVendas = useMemo(
    () => mediaDos14(jogadores.map((j) => ({ ...j, vendido: false }))),
    [jogadores],
  );
  const delta = mediaComVendas - mediaSemVendas;
  const promovido = linhas.find((l) => l.promovido)?.jogador;
  const vendidos = jogadores.filter((j) => j.vendido);

  const porPosicao = useMemo(() => {
    const contagem = new Map<PosicaoJogador, number>(POSITION_FIELD_ORDER.map((p) => [p, 0]));
    for (const jogador of jogadores) {
      for (const p of jogador.posicoes) {
        contagem.set(p, (contagem.get(p) ?? 0) + 1);
      }
    }
    return contagem;
  }, [jogadores]);

  const faixaAtual = FAIXAS_MIN.filter((min) => mediaComVendas >= min).length - 1;

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    const idadeNumero = Number(idade);
    const overallNumero = Number(overall);
    if (!nome.trim() || !isValidPlayerAge(idadeNumero)) return;
    if (!Number.isFinite(overallNumero) || overallNumero <= 0) return;
    if (posicoes.length < 1 || posicoes.length > 3) {
      document.getElementById('pos-novo')?.focus();
      return;
    }
    adicionarJogador(nome.trim(), idadeNumero, overallNumero, posicoes);
    setNome('');
    setOverall('');
    setIdade('');
    setPosicoes([]);
  }

  function comecarEdicao(jogador: Jogador) {
    setEditandoId(jogador.id);
    setEditNome(jogador.nome);
    setEditOverall(String(jogador.overall));
    setEditIdade(jogador.idade === null ? '' : String(jogador.idade));
    setEditPosicoes([...jogador.posicoes]);
  }

  function aoSalvarEdicao(evento: FormEvent) {
    evento.preventDefault();
    if (!editandoId) return;
    const overallNumero = Number(editOverall);
    const idadeNumero = Number(editIdade);
    if (!editNome.trim() || !isValidPlayerAge(idadeNumero)) return;
    if (!Number.isFinite(overallNumero) || overallNumero <= 0) return;
    if (editPosicoes.length < 1 || editPosicoes.length > 3) return;
    atualizarJogador(editandoId, editNome.trim(), idadeNumero, overallNumero, editPosicoes);
    setEditandoId(null);
  }

  function aoExcluir(jogador: Jogador) {
    if (!window.confirm(t.excluirConfirm(jogador.nome))) return;
    if (editandoId === jogador.id) setEditandoId(null);
    excluirJogador(jogador.id);
  }

  async function aoImportar(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = '';
    if (!arquivo) return;
    try {
      substituirDocumento(importarJSON(await arquivo.text()));
      setErroImportacao(null);
    } catch {
      setErroImportacao(t.erroImportacao);
    }
  }

  return (
    <>
      <section className="stage">
        <div className="hero">
          <h1>{t.titulo}</h1>
          <p className="hero__lead">{t.lead}</p>
          <p className="hero__actions">
            <button className="btn btn--secondary" type="button" onClick={() => exportar(documento)}>
              {t.exportar}
            </button>
            <label className="btn btn--secondary hero__import">
              {t.importar}
              <input
                type="file"
                accept="application/json"
                className="visually-hidden"
                onChange={(e) => void aoImportar(e)}
              />
            </label>
          </p>
          {erroImportacao && (
            <p className="hero__erro" role="alert">
              {erroImportacao}
            </p>
          )}
        </div>
      </section>

      <main className="page">
        <div>
          <section className="panel">
            <div className="panel__head">
              <h2>{t.adicionarTitulo}</h2>
              <span className="hint">{t.adicionarHint}</span>
            </div>
            <form className="form" onSubmit={aoSubmeter}>
              <div className="field">
                <label htmlFor="nome">{t.nome}</label>
                <input
                  id="nome"
                  type="text"
                  placeholder={t.nomePlaceholder}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="idade">{t.idade}</label>
                <input
                  id="idade"
                  className="num"
                  type="number"
                  inputMode="numeric"
                  min={PLAYER_AGE_MIN}
                  max={PLAYER_AGE_MAX}
                  step={1}
                  required
                  placeholder="18"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="ovr">{t.overall}</label>
                <input
                  id="ovr"
                  className="num"
                  type="number"
                  inputMode="numeric"
                  placeholder="78"
                  value={overall}
                  onChange={(e) => setOverall(e.target.value)}
                />
              </div>
              <SeletorPosicao id="pos-novo" valor={posicoes} onChange={setPosicoes} />
              <button className="btn btn--primary" type="submit">
                {t.adicionar}
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>{t.elenco}</h2>
              <div className="squad-order">
                <label htmlFor="squad-order">{t.ordenarPor}</label>
                <select
                  id="squad-order"
                  value={squadOrder}
                  onChange={(event) => setSquadOrder(event.target.value as SquadOrder)}
                >
                  {(Object.keys(t.ordem) as SquadOrder[]).map((ordem) => (
                    <option key={ordem} value={ordem}>
                      {t.ordem[ordem]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {linhas.length === 0 ? (
              <p className="empty">{t.vazio}</p>
            ) : (
              <>
                <div className="elenco" role="table" aria-label={t.ordemAria(t.ordem[squadOrder])}>
                  <div className="thead" role="row">
                    <span role="columnheader" className="row__rank">
                      #
                    </span>
                    <span role="columnheader" className="row__name">
                      {t.colJogador}
                    </span>
                    <span role="columnheader" className="row__tal">
                      {t.colTalento}
                    </span>
                    <span role="columnheader" className="row__age">
                      {t.colIdade}
                    </span>
                    <span role="columnheader" className="row__ovr">
                      {t.colOvr}
                    </span>
                    <span role="columnheader" className="row__pos">
                      {t.colPos}
                    </span>
                    <span role="columnheader" className="row__sale">
                      {t.colSimulacao}
                    </span>
                    <span role="columnheader" className="row__act c-act">
                      <span className="visually-hidden">{t.colAcoes}</span>
                    </span>
                  </div>
                  <div className="rows">
                    {linhas.map((linha, i) => (
                      <Fragment key={linha.jogador.id}>
                        {editandoId === linha.jogador.id ? (
                          <form className="row-edit" role="row" onSubmit={aoSalvarEdicao}>
                            <div className="row-edit__fields" role="cell" aria-colspan={8}>
                              <div className="field">
                                <label htmlFor={`edit-nome-${linha.jogador.id}`}>{t.nome}</label>
                                <input
                                  id={`edit-nome-${linha.jogador.id}`}
                                  type="text"
                                  value={editNome}
                                  onChange={(e) => setEditNome(e.target.value)}
                                />
                              </div>
                              <div className="field">
                                <label htmlFor={`edit-idade-${linha.jogador.id}`}>{t.idade}</label>
                                <input
                                  id={`edit-idade-${linha.jogador.id}`}
                                  className="num"
                                  type="number"
                                  inputMode="numeric"
                                  min={PLAYER_AGE_MIN}
                                  max={PLAYER_AGE_MAX}
                                  step={1}
                                  required
                                  value={editIdade}
                                  onChange={(e) => setEditIdade(e.target.value)}
                                />
                              </div>
                              <div className="field">
                                <label htmlFor={`edit-ovr-${linha.jogador.id}`}>{t.overall}</label>
                                <input
                                  id={`edit-ovr-${linha.jogador.id}`}
                                  className="num"
                                  type="number"
                                  inputMode="numeric"
                                  value={editOverall}
                                  onChange={(e) => setEditOverall(e.target.value)}
                                />
                              </div>
                              <SeletorPosicao
                                id={`pos-edit-${linha.jogador.id}`}
                                valor={editPosicoes}
                                onChange={setEditPosicoes}
                              />
                              <div className="row-edit__btns">
                                <button
                                  className="btn btn--primary"
                                  type="submit"
                                  disabled={editPosicoes.length === 0}
                                >
                                  {t.salvar}
                                </button>
                                <button
                                  className="btn btn--ghost"
                                  type="button"
                                  onClick={() => setEditandoId(null)}
                                >
                                  {t.cancelar}
                                </button>
                              </div>
                            </div>
                          </form>
                        ) : (
                        <div
                          role="row"
                          className={[
                            'row',
                            linha.top14 && 'row--top',
                            linha.jogador.vendido && 'row--sold',
                            linha.promovido && 'row--promoted',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <span role="cell" className="row__rank num">
                            {linha.rank}
                          </span>
                          <span role="cell" className="row__name">
                            {linha.top14 && (
                              <span className="visually-hidden">{t.nos14}</span>
                            )}
                            <span>{linha.jogador.nome}</span>
                            {linha.jogador.vendido && <span className="tag tag--loss">{t.vendido}</span>}
                            {linha.promovido && (
                              <span className="tag tag--gain">{t.subiu}</span>
                            )}
                          </span>
                          <span role="cell" className="row__tal">
                            {linha.jogador.lab?.talento ? (
                              <span
                                className="talento talento--sm"
                                data-rank={linha.jogador.lab.talento}
                              >
                                <EscudoTalento rank={linha.jogador.lab.talento} />
                                <span className="visually-hidden">{t.talentoSr}</span>
                                <b>{textos.talento[linha.jogador.lab.talento]}</b>
                              </span>
                            ) : (
                              '—'
                            )}
                          </span>
                          <span role="cell" className="row__age num">
                            {linha.jogador.idade ?? '—'}
                          </span>
                          <span role="cell" className="row__ovr num">
                            {linha.jogador.overall}
                          </span>
                          <span role="cell" className="row__pos">
                            {linha.jogador.posicoes.map((posicao) => (
                              <span key={posicao} className={classeBadgePosicao(posicao)}>
                                {posicao}
                              </span>
                            ))}
                          </span>
                          <span role="cell" className="row__sale">
                            {linha.jogador.vendido ? (
                              <button
                                className="btn btn--undo"
                                type="button"
                                onClick={() => desfazerVenda(linha.jogador.id)}
                                aria-label={t.desfazerAria(linha.jogador.nome)}
                              >
                                {t.desfazer}
                              </button>
                            ) : (
                              <button
                                className="btn btn--ghost"
                                type="button"
                                onClick={() => marcarVendido(linha.jogador.id)}
                                aria-label={t.marcarVendaAria(linha.jogador.nome)}
                              >
                                {t.marcarVenda}
                              </button>
                            )}
                          </span>
                          <span role="cell" className="row__act">
                            <button
                              className="btn btn--icon"
                              type="button"
                              onClick={() => comecarEdicao(linha.jogador)}
                              aria-label={t.editarAria(linha.jogador.nome)}
                            >
                              <IconeLapis />
                            </button>
                            <button
                              className="btn btn--icon btn--icon-danger"
                              type="button"
                              onClick={() => aoExcluir(linha.jogador)}
                              aria-label={t.excluirAria(linha.jogador.nome)}
                            >
                              <IconeLixeira />
                            </button>
                          </span>
                        </div>
                        )}
                        {indiceDoCorte === i && (
                          <div className="cut" role="row">
                            <span role="cell">{t.corte}</span>
                          </div>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>

                <CalloutRegra marca="comunidade">{t.calloutTop14}</CalloutRegra>
              </>
            )}
          </section>
        </div>

        <aside>
          <div className="tile" aria-live="polite" aria-atomic="true">
            <div className="tile__label">{t.tileLabel}</div>
            <div className="tile__row">
              <div className="tile__value num">{formatarNumero(mediaComVendas)}</div>
              {delta !== 0 && (
                <span className={`delta num ${delta < 0 ? 'delta--loss' : 'delta--gain'}`}>
                  {delta > 0 ? '+' : '−'}
                  {formatarNumero(Math.abs(delta))}
                </span>
              )}
            </div>
            <p className="note">
              {t.semVendas(formatarNumero(mediaSemVendas), jogadores.length)}
              {vendidos.length > 0 && promovido && (
                <>
                  <br />
                  {t.trocaNos14(
                    vendidos[vendidos.length - 1]?.nome ?? '',
                    promovido.nome,
                    promovido.overall,
                  )}
                </>
              )}
            </p>
          </div>

          <section className="panel">
            <div className="panel__head">
              <h2>{t.faixasTitulo}</h2>
            </div>
            <div className="bands">
              {t.faixas.map((faixa, i) => (
                <div
                  key={FAIXAS_MIN[i]}
                  className={`band${i === faixaAtual ? ' band--now' : ''}`}
                >
                  <span className="band__range num">
                    {faixa.faixa}
                    {i === faixaAtual && <span className="band__here">{t.voceAqui}</span>}
                  </span>
                  <span className="band__text">{faixa.texto}</span>
                </div>
              ))}
            </div>
            <CalloutRegra marca="comunidade">{t.calloutFaixas}</CalloutRegra>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>{t.porPosicao}</h2>
              <span className="hint">{t.jogadores(jogadores.length)}</span>
            </div>
            <div className="posgrid">
              {POSITION_FIELD_ORDER.map((p) => {
                const quantidade = porPosicao.get(p) ?? 0;
                return (
                  <div key={p} className={`poscell${quantidade === 0 ? ' is-empty' : ''}`}>
                    <b className="num">{quantidade}</b>
                    <span>{p}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </main>
    </>
  );
}
