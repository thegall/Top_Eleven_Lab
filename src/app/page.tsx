'use client';

import { Fragment, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

import { mediaDos14 } from '../domain/squad';
import type { Jogador, PosicaoJogador } from '../state/schema';
import { useSquad } from '../state/store';
import { exportarJSON, importarJSON } from '../state/transfer';
import { classeBadgePosicao } from '../ui/posicao';

const POSICOES: PosicaoJogador[] = [
  'GK',
  'DL',
  'DC',
  'DR',
  'ML',
  'DMC',
  'MC',
  'MR',
  'AML',
  'AMC',
  'AMR',
  'ST',
];

const FAIXAS = [
  {
    min: 0,
    max: 85,
    faixa: 'até 85',
    texto: 'Liga confortável — adversários no seu nível ou abaixo',
  },
  {
    min: 86,
    max: 100,
    faixa: '86 – 100',
    texto: 'Liga equilibrada — dá para brigar pelo título montando bem',
  },
  {
    min: 101,
    max: 115,
    faixa: '101 – 115',
    texto: 'Liga puxada — encontra times de quem investe dinheiro',
  },
  {
    min: 116,
    max: Infinity,
    faixa: 'acima de 115',
    texto: 'Liga de pagantes — desvantagem estrutural na temporada inteira',
  },
] as const;

function formatarNumero(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

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
  URL.revokeObjectURL(url);
}

export default function SquadPage() {
  const { documento, adicionarJogador, marcarVendido, desfazerVenda, substituirDocumento } =
    useSquad();
  const [nome, setNome] = useState('');
  const [overall, setOverall] = useState('');
  const [posicao, setPosicao] = useState<PosicaoJogador>('DC');

  const jogadores = documento.jogadores;

  const { linhas, indiceDoCorte } = useMemo(() => montarLinhas(jogadores), [jogadores]);

  const mediaComVendas = useMemo(() => mediaDos14(jogadores), [jogadores]);
  const mediaSemVendas = useMemo(
    () => mediaDos14(jogadores.map((j) => ({ ...j, vendido: false }))),
    [jogadores],
  );
  const delta = mediaComVendas - mediaSemVendas;
  const promovido = linhas.find((l) => l.promovido)?.jogador;
  const vendidos = jogadores.filter((j) => j.vendido);

  const porPosicao = useMemo(() => {
    const contagem = new Map<PosicaoJogador, number>(POSICOES.map((p) => [p, 0]));
    for (const jogador of jogadores) {
      for (const p of jogador.posicoes) {
        contagem.set(p, (contagem.get(p) ?? 0) + 1);
      }
    }
    return contagem;
  }, [jogadores]);

  const faixaAtual = FAIXAS.find((f) => mediaComVendas >= f.min && mediaComVendas <= f.max);

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    const overallNumero = Number(overall);
    if (!nome.trim() || !Number.isFinite(overallNumero) || overallNumero <= 0) return;
    adicionarJogador(nome.trim(), overallNumero, posicao);
    setNome('');
    setOverall('');
  }

  async function aoImportar(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = '';
    if (!arquivo) return;
    try {
      substituirDocumento(importarJSON(await arquivo.text()));
    } catch {
      window.alert('Arquivo inválido — não foi possível importar.');
    }
  }

  return (
    <>
      <div className="hero">
        <h1>Squad</h1>
        <p>
          Simulador da média dos 14 mais fortes — o número que define contra quem você joga na
          próxima temporada.
        </p>
        <p style={{ marginTop: 'var(--s-xs)' }}>
          <button className="btn btn--ghost" type="button" onClick={() => exportar(documento)}>
            Exportar elenco
          </button>
          <label className="btn btn--ghost" style={{ cursor: 'pointer' }}>
            Importar elenco
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => void aoImportar(e)}
            />
          </label>
        </p>
      </div>

      <main className="page">
        <div>
          <section className="panel">
            <div className="panel__head">
              <span className="gicon">+</span>
              <h2>Adicionar jogador</h2>
              <span className="hint">3 campos — leva 5 segundos por jogador</span>
            </div>
            <form className="form" onSubmit={aoSubmeter}>
              <div className="field">
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Ex.: Grenn Aemon"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="ovr">Overall</label>
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
              <div className="field">
                <label htmlFor="pos">Posição</label>
                <select
                  id="pos"
                  value={posicao}
                  onChange={(e) => setPosicao(e.target.value as PosicaoJogador)}
                >
                  {POSICOES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn btn--primary" type="submit">
                Adicionar
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel__head">
              <span className="gicon" style={{ background: 'var(--gold)' }}>
                14
              </span>
              <h2>Elenco</h2>
              <span className="hint">Ordenado por overall — barra dourada marca quem entra na média</span>
            </div>

            {linhas.length === 0 ? (
              <p className="empty">Nenhum jogador cadastrado ainda.</p>
            ) : (
              <>
                <div className="thead">
                  <span>#</span>
                  <span>Jogador</span>
                  <span>Pos.</span>
                  <span className="r">Ovr</span>
                  <span className="r c-act">Simulação</span>
                </div>
                <div className="rows">
                  {linhas.map((linha, i) => (
                    <Fragment key={linha.jogador.id}>
                      <div
                        className={[
                          'row',
                          linha.top14 && 'row--top',
                          linha.jogador.vendido && 'row--sold',
                          linha.promovido && 'row--promoted',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <span className="row__rank num">{linha.rank}</span>
                        <span className="row__name">
                          <span>{linha.jogador.nome}</span>
                          {linha.jogador.vendido && <span className="tag tag--loss">Vendido</span>}
                          {linha.promovido && <span className="tag tag--gain">Subiu para os 14</span>}
                        </span>
                        <span className={classeBadgePosicao(linha.jogador.posicoes[0] ?? 'DC')}>
                          {linha.jogador.posicoes[0] ?? '—'}
                        </span>
                        <span className="row__ovr num">{linha.jogador.overall}</span>
                        <span className="row__act">
                          {linha.jogador.vendido ? (
                            <button
                              className="btn btn--undo"
                              type="button"
                              onClick={() => desfazerVenda(linha.jogador.id)}
                            >
                              Desfazer
                            </button>
                          ) : (
                            <button
                              className="btn btn--ghost"
                              type="button"
                              onClick={() => marcarVendido(linha.jogador.id)}
                            >
                              Marcar venda
                            </button>
                          )}
                        </span>
                      </div>
                      {indiceDoCorte === i && (
                        <div className="cut">
                          <span>Corte do 14º — daqui para baixo não entra na média</span>
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>

                <div className="callout" style={{ marginTop: 'var(--s-sm)' }}>
                  <span className="callout__src">Como ler</span>
                  Barra dourada = está dentro dos 14 que contam. Cada venda simulada tira um
                  jogador da conta e <b>puxa o próximo reserva para dentro</b> — por isso o efeito
                  quase nunca é o óbvio.
                </div>
              </>
            )}
          </section>
        </div>

        <aside>
          <div className="tile">
            <div className="tile__label">Média dos 14 — com as vendas simuladas</div>
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
              Sem vendas: <b className="num">{formatarNumero(mediaSemVendas)}</b> · elenco de{' '}
              <b className="num">{jogadores.length}</b> jogadores.
              {vendidos.length > 0 && promovido && (
                <>
                  <br />
                  <b>{vendidos[vendidos.length - 1]?.nome}</b> saiu dos 14 e{' '}
                  <b>{promovido.nome}</b> ({promovido.overall}) subiu no lugar dele.
                </>
              )}
            </p>
          </div>

          <section className="panel">
            <div className="panel__head">
              <h2>O que essa média significa</h2>
            </div>
            <div className="bands">
              {FAIXAS.map((faixa) => (
                <div
                  key={faixa.min}
                  className={`band${faixa === faixaAtual ? ' band--now' : ''}`}
                >
                  <span className="band__range num">
                    {faixa.faixa}
                    {faixa === faixaAtual && <span className="band__here">Você está aqui</span>}
                  </span>
                  <span className="band__text">{faixa.texto}</span>
                </div>
              ))}
            </div>
            <div className="callout" style={{ marginTop: 'var(--s-xs)' }}>
              <span className="callout__src">Comunidade</span>
              O jogo emparelha a temporada seguinte pela média dos <b>14 jogadores mais fortes</b>.
              As faixas acima são observação da comunidade brasileira, não número publicado pela
              Nordeus.
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>Por posição</h2>
              <span className="hint">{jogadores.length} jogadores</span>
            </div>
            <div className="posgrid">
              {POSICOES.map((p) => {
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
