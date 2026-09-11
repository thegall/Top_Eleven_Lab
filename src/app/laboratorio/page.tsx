'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

import { ALL_DRILLS, classificarDrill, mediaExercicio, montarCronograma } from '../../domain/drills';
import { brancosDaPosicao } from '../../domain/positions';
import { sigma, classificarTalento } from '../../domain/talent';
import { conditionCostPerSession } from '../../domain/training';
import type { Atributo, Posicao, RankTalento } from '../../domain/types';
import type { DadosLab, Jogador } from '../../state/schema';
import { useSquad } from '../../state/store';
import { CalloutRegra } from '../../ui/callout-regra';
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

  const lab = useMemo(() => (selecionado ? labDoJogador(selecionado) : null), [selecionado]);

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

  function aoClassificarTalento(evento: FormEvent) {
    evento.preventDefault();
    if (!selecionado || !lab || !testeDrill) return;
    if (soma.trim() === '') return;
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
        <p>Simulador de treino, um jogador por vez. Qual exercício rende mais neste jogador agora.</p>
      </div>

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
                  Derivadas da posição {posicoesLinha.join('+')}. Confira e ajuste se o jogo divergir.
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
              <CalloutRegra marca="oficial" secao="§2">
                Cinza entra no overall, mas tem pouco efeito em campo.
              </CalloutRegra>
              <CalloutRegra marca="comunidade" secao="§2">
                Os brancos vêm da união das posições. Cinza cresce na metade da velocidade do
                branco.
              </CalloutRegra>
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
              <CalloutRegra marca="comunidade" secao="§6">
                Os 6 slots, menor média primeiro. Com menos de 6 primários, o drill se repete.
                Aos 180% o exercício rende zero. A planilha da comunidade erra nisso; o Lab não.
              </CalloutRegra>
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

                <CalloutRegra marca="comunidade" secao="§3">
                  O nome do exercício não diz nada. O que conta é a <b>média dos atributos que ele
                  treina neste jogador</b>, e ela trava aos 180%. Subir um atributo empurra{' '}
                  <b>todos</b> os exercícios que o contêm em direção ao teto. Quem tem pouca maleta
                  troca por volta de 140%. É recomendação prática, não teto do jogo.
                </CalloutRegra>
              </section>

              <aside>
                <section className="panel">
                  <div className="panel__head">
                    <h2>Teste de talento</h2>
                  </div>

                  {!testeDrill ? (
                    <CalloutRegra marca="comunidade" secao="§5">
                      O teste exige um primário com média abaixo de 80%. Nenhum dos primários deste
                      jogador está abaixo, então o teste fica indisponível e o rank anterior é
                      mantido. Acima disso o teto começa a interferir e o teste dá falso negativo.
                    </CalloutRegra>
                  ) : (
                    <>
                      <ol className="steps">
                        <li>
                          Rode <b>{testeDrill.drill.nome}</b>. É primário, média{' '}
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
                        <p className="callout callout--warn" role="alert">
                          <span className="callout__src">Atenção</span>
                          {erroTeste}
                        </p>
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

                      <CalloutRegra marca="comunidade" secao="§5">
                        O corte usado aqui vale <b>só para este exercício e esta média</b>. Trocar de
                        drill muda o desgaste e move o resultado junto. Os cortes 28/33 da comunidade
                        só valem para Pressione o Play a ~55%.
                      </CalloutRegra>
                      <CalloutRegra marca="medicao" secao="§5">
                        Caso real: 31 pontos em Pressione o Play a 55% classifica como Ótima. Os
                        dois métodos concordaram no vídeo da comunidade.
                      </CalloutRegra>
                      <CalloutRegra marca="pendente" secao="§5">
                        O teste <b>não isola a idade</b>. Não aplicamos correção, porque esse valor
                        ainda não foi validado. Faça o teste <b>antes dos 22 anos</b>, onde o fator
                        de idade é 1,00.
                      </CalloutRegra>
                      <CalloutRegra marca="pendente" secao="§3.1">
                        O método visual da barra (1/2) não separa Ruim de Terrível. O teste por soma
                        devolve um rank, inclusive nessa faixa; não inventamos um corte visual.
                      </CalloutRegra>
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
