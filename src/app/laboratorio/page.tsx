'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

import { ALL_DRILLS, classificarDrill, mediaExercicio, montarCronograma } from '../../domain/drills';
import { brancosDaPosicao } from '../../domain/positions';
import { sigma, classificarTalento } from '../../domain/talent';
import { conditionCostPerSession } from '../../domain/training';
import type { Atributo, Posicao, RankTalento } from '../../domain/types';
import type { DadosLab, Jogador } from '../../state/schema';
import { useSquad } from '../../state/store';
import { classeBadgePosicao } from '../../ui/posicao';

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

const CATEGORIA_DOT: Record<string, string> = {
  ataque: 'dot c-atk',
  defesa: 'dot c-def',
  posse: 'dot c-pos',
  fisico: 'dot c-fis',
};

const CATEGORIA_FLAG: Record<string, string> = {
  ataque: 'card__flag',
  defesa: 'card__flag card--f-def',
  posse: 'card__flag card--f-pos',
  fisico: 'card__flag',
};

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

export default function LaboratorioPage() {
  const { documento, atualizarLab } = useSquad();

  const elegiveis = useMemo(
    () => documento.jogadores.filter((j) => !j.vendido && !j.posicoes.includes('GK')),
    [documento.jogadores],
  );

  const [jogadorId, setJogadorId] = useState<string | null>(null);
  const selecionado = elegiveis.find((j) => j.id === jogadorId) ?? elegiveis[0] ?? null;

  const [soma, setSoma] = useState('');
  const [erroTeste, setErroTeste] = useState<string | null>(null);

  useEffect(() => {
    setSoma('');
    setErroTeste(null);
  }, [selecionado?.id]);

  const lab = selecionado ? labDoJogador(selecionado) : null;

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
  const testeDrill = primarios.find((p) => p.media < 80) ?? null;

  const cronograma = useMemo(
    () => (lab ? montarCronograma(lab.atributos, brancosEfetivos) : []),
    [lab, brancosEfetivos],
  );

  function handleAtributoChange(atributo: Atributo, valor: string) {
    if (!selecionado || !lab) return;
    const numero = Number(valor);
    atualizarLab(selecionado.id, {
      ...lab,
      atributos: { ...lab.atributos, [atributo]: Number.isFinite(numero) ? numero : 0 },
    });
  }

  function handleToggleBranco(atributo: Atributo) {
    if (!selecionado || !lab) return;
    const novoSet = new Set(brancosEfetivos);
    if (novoSet.has(atributo)) novoSet.delete(atributo);
    else novoSet.add(atributo);
    atualizarLab(selecionado.id, { ...lab, brancosOverride: [...novoSet] });
  }

  function aoClassificarTalento(evento: FormEvent) {
    evento.preventDefault();
    if (!selecionado || !lab || !testeDrill) return;
    const somaNumero = Number(soma);
    if (!Number.isFinite(somaNumero)) return;
    try {
      const rank = classificarTalento(somaNumero, testeDrill.drill, brancosEfetivos, testeDrill.media);
      atualizarLab(selecionado.id, { ...lab, talento: rank });
      setErroTeste(null);
    } catch (erro) {
      setErroTeste(erro instanceof Error ? erro.message : 'Teste inválido.');
    }
  }

  return (
    <>
      <div className="hero">
        <h1>Laboratório</h1>
        <p>Simulador de treino, um jogador por vez — qual exercício rende mais neste jogador agora.</p>
      </div>

      <main className="lab-page">
        {!selecionado || !lab ? (
          <section className="panel">
            <p className="empty">
              Cadastre um jogador de linha na aba Squad pra usar o Laboratório — o goleiro fica de
              fora (GAME-RULES §10).
            </p>
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
                    {j.nome} — {j.overall}
                  </option>
                ))}
              </select>
              <h1 className="ficha__nome">{selecionado.nome}</h1>
              <span className={classeBadgePosicao(selecionado.posicoes[0] ?? 'DC')}>
                {selecionado.posicoes[0]}
              </span>
              {lab.talento && (
                <span className="talento">
                  Talento: <b>{RANK_LABELS[lab.talento]}</b>
                </span>
              )}
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2>Habilidades</h2>
                <span className="hint">
                  Derivadas da posição {posicoesLinha.join('+')} — confira e ajuste se o jogo divergir
                </span>
              </div>

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
                          return (
                            <label
                              key={atributo}
                              className={`attr ${branco ? 'attr--key' : 'attr--gray'}`}
                            >
                              <input
                                type="checkbox"
                                checked={branco}
                                onChange={() => handleToggleBranco(atributo)}
                                title="Atributo-chave (branco)"
                              />
                              <span className="attr__label">{LABELS[atributo]}</span>
                              <input
                                className="attr__input num"
                                type="number"
                                inputMode="numeric"
                                value={lab.atributos[atributo]}
                                onChange={(e) => handleAtributoChange(atributo, e.target.value)}
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="legenda">
                <span>
                  <i style={{ background: 'var(--surface)', borderLeft: '3px solid var(--group-defense)' }} />
                  Atributo-chave (branco) — cresce ao dobro da velocidade
                </span>
                <span>
                  <i style={{ background: 'var(--surface-muted)' }} />
                  Atributo cinza — entra no overall, quase não muda o jogo
                </span>
              </p>
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2>Sessão recomendada</h2>
                <span className="hint">Os 6 slots, ordenados pela menor média (GAME-RULES §6)</span>
              </div>
              <div className="lines">
                {cronograma.map((drill, i) => {
                  const media = mediaExercicio(lab.atributos, drill);
                  return (
                    <div className="line" key={`${drill.nome}-${i}`}>
                      <span className="line__name">
                        <i className={CATEGORIA_DOT[drill.categoria]} />
                        {i + 1}. {drill.nome}
                      </span>
                      <span className="c-meter">
                        <span className="meter meter--mini">
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
                    <i className="dot c-atk" />
                    Ataque
                  </span>
                  <span>
                    <i className="dot c-def" />
                    Defesa
                  </span>
                  <span>
                    <i className="dot c-pos" />
                    Posse de bola
                  </span>
                  <span>
                    <i className="dot c-fis" />
                    Físico e mental
                  </span>
                </div>

                <div className="sub">
                  Primários · {primarios.length} <em>todos os atributos que contam são chave</em>
                </div>
                <div className="cards">
                  {primarios.map(({ drill, media }, i) => (
                    <div className={`card${i === 0 ? ' card--rec' : ''}`} key={drill.nome}>
                      <div className={CATEGORIA_FLAG[drill.categoria]}>
                        {drill.categoria}
                        {i === 0 && <span className="rec">Recomendado</span>}
                        {testeDrill?.drill.nome === drill.nome && <span className="rec">Teste de talento</span>}
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
                        <div className="meter">
                          <div className="meter__fill" style={{ width: `${Math.min(100, (media / 180) * 100)}%` }} />
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
                    <div className="sub">
                      Secundários · {secundarios.length} <em>um atributo cinza entra na conta</em>
                    </div>
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
                            <i className={CATEGORIA_DOT[drill.categoria]} />
                            {drill.nome}
                          </span>
                          <span className="c-meter">
                            <span className="meter meter--mini">
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
                    <div className="sub">
                      Terciários · {terciarios.length} <em>dois ou mais cinzas — sobem overall sem melhorar o jogador</em>
                    </div>
                    <div className="lines">
                      {terciarios.map(({ drill, media }) => (
                        <div className="line line--ter" key={drill.nome}>
                          <span className="line__name">
                            <i className={CATEGORIA_DOT[drill.categoria]} />
                            {drill.nome}
                          </span>
                          <span className="c-meter">
                            <span className="meter meter--mini">
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

                <div className="callout" style={{ marginTop: 'var(--s-sm)' }}>
                  <span className="callout__src">Comunidade</span>
                  O nome do exercício não diz nada. O que conta é a <b>média dos atributos que ele
                  treina neste jogador</b>, e ela trava aos 180%. Subir um atributo empurra <b>todos</b> os
                  exercícios que o contêm em direção ao teto.
                </div>
              </section>

              <aside>
                <section className="panel">
                  <div className="panel__head">
                    <h2>Teste de talento</h2>
                  </div>

                  {!testeDrill ? (
                    <div className="callout">
                      <span className="callout__src">Janela do teste</span>
                      O teste exige um primário com média abaixo de 80%. Nenhum dos primários deste
                      jogador está abaixo — o teste fica indisponível e o rank anterior é mantido.
                    </div>
                  ) : (
                    <>
                      <ol className="steps">
                        <li>
                          Rode <b>{testeDrill.drill.nome}</b> — primário, média{' '}
                          <b>{formatarPct(testeDrill.media)}%</b>, abaixo do limite de 80% que
                          invalidaria o teste.
                        </li>
                        <li>
                          Faça <b>5 sessões de 6 slots</b> ({formatarPct(conditionCostPerSession(testeDrill.drill.dificuldade))}%
                          de condicionamento cada).
                        </li>
                        <li>
                          Informe a <b>soma dos pontos ganhos</b> nas 5 sessões.
                        </li>
                      </ol>

                      <form onSubmit={aoClassificarTalento}>
                        <div className="duo">
                          <div className="field">
                            <label htmlFor="soma">Soma dos pontos</label>
                            <input
                              id="soma"
                              className="num"
                              type="number"
                              inputMode="numeric"
                              value={soma}
                              onChange={(e) => setSoma(e.target.value)}
                            />
                          </div>
                        </div>
                        <button className="btn btn--primary" type="submit">
                          Classificar talento
                        </button>
                      </form>

                      {erroTeste && (
                        <div className="callout callout--warn" style={{ marginTop: 'var(--s-xs)' }}>
                          <span className="callout__src">Atenção</span>
                          {erroTeste}
                        </div>
                      )}

                      {lab.talento && (
                        <div className="resultado">
                          <div className="tile__label">Resultado do teste</div>
                          <div className="resultado__nome">{RANK_LABELS[lab.talento]}</div>
                          <p>
                            Rende{' '}
                            <b>
                              {formatarPct(
                                sigma(lab.talento, testeDrill.media) / sigma('terrivel', testeDrill.media),
                              )}
                              ×
                            </b>{' '}
                            o que um jogador Terrível renderia por maleta gasta, neste exercício.
                          </p>
                        </div>
                      )}

                      <div className="callout callout--warn" style={{ marginTop: 'var(--s-sm)' }}>
                        <span className="callout__src">Atenção</span>
                        O corte usado aqui vale <b>só para este exercício e esta média</b>. Trocar de
                        drill muda o desgaste e move o resultado junto.
                      </div>
                    </>
                  )}
                </section>
              </aside>
            </div>
          </>
        )}
      </main>
    </>
  );
}
