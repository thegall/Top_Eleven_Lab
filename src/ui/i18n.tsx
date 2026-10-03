/**
 * Texto de tela, por idioma (THE-63). O motor só conhece identificadores; tudo
 * o que o usuário lê mora aqui. Português é o idioma principal; o inglês segue
 * o glossário em docs/GLOSSARY-EN.md, que diz de onde veio cada termo de jogo.
 *
 * `en` é tipado como `Textos`: chave faltando quebra o typecheck e o build. O
 * teste em i18n.test.ts confere também em tempo de execução.
 */
import type { ReactNode } from 'react';

import type { DrillId } from '../domain/drills';
import type { AtributoGoleiro, Atributo } from '../domain/types';
import type { TalentoLab } from '../state/schema';

export type Idioma = 'pt' | 'en';

type Categoria = 'ataque' | 'defesa' | 'posse' | 'fisico';
type OrdemElenco = 'overall' | 'name' | 'age' | 'position' | 'talent';

export const pt = {
  /** Formato de número (0,75 / 0.75) e atributo `lang` do documento. */
  locale: 'pt-BR',
  meta: {
    descricao: 'Calculadora de treino e de elenco para o Top Eleven',
  },
  shell: {
    pular: 'Pular para o conteúdo',
  },
  nav: {
    aria: 'Abas principais',
    squad: 'Squad',
    laboratorio: 'Laboratório',
    outroIdioma: 'English',
  },
  topbar: {
    fechar: 'Fechar',
    githubAria: 'Apoiar no GitHub',
    githubTitulo: 'Apoie o projeto',
    githubTexto: 'Apoie esse projeto no GitHub com uma estrela. É gratuito!',
    favoritar: 'Favoritar',
    pixAria: 'Contribuir via Pix',
    pixTitulo: 'Apoie com um Pix',
    pixTexto: 'Apoie esse projeto para ter um domínio oficial, com qualquer valor.',
    copiado: 'Copiado!',
    copiarChave: 'Copiar chave',
  },
  /** Rótulo fixo do callout, sem expor a seção do doc interno (decisão de 2026-09-23). */
  regras: 'REGRAS',
  seletorPosicao: {
    rotulo: 'Posição',
    campo: 'Campo de posições',
    ate3: 'Até 3.',
  },
  drills: {
    'marcar-homem-a-homem': 'Marcar Homem a Homem',
    'passe-va-e-dispare': 'Passe, Vá e Dispare!',
    'jogada-ensaiada': 'Jogada Ensaiada',
    'tecnica-de-chute': 'Técnica de Chute',
    'drible-de-slalom': 'Drible de Slalom',
    'jogo-na-ponta': 'Jogo na Ponta',
    'contra-ataque-rapido': 'Contra-Ataque Rápido',
    'analise-do-video': 'Análise do Vídeo',
    cabeceada: 'Cabeceada',
    'uma-linha-de-defesa': 'Uma Linha de Defesa',
    'parar-o-atacante': 'Parar o Atacante',
    'cruzamento-de-defesa': 'Cruzamento de Defesa',
    'pressione-o-play': 'Pressione o Play',
    'treino-de-goleiro': 'Treino de Goleiro',
    'controle-da-bola': 'Controle da Bola',
    'jogo-de-bobinho': 'Jogo de Bobinho',
    'matada-de-bola': 'Matada de Bola',
    'virada-de-jogo': 'Virada de Jogo',
    posicionamento: 'Posicionamento',
    entradas: 'Entradas',
    'passes-para-o-chute': 'Passes para o Chute',
    aquecimento: 'Aquecimento',
    alongamento: 'Alongamento',
    'carioca-com-escadas': 'Carioca com Escadas',
    'corrida-longa': 'Corrida Longa',
    'corrida-de-ir-e-vir': 'Corrida de Ir e Vir',
    'corrida-de-obstaculo': 'Corrida de Obstáculo',
    academia: 'Academia',
    arrancada: 'Arrancada',
  } as Record<DrillId, string>,
  // Ruim e Terrível são a mesma coisa para o jogador: as duas chamam Bagre
  // (GAME-RULES §3.1, nomenclatura de 2026-09-18). A curva mantém os dois sigmas.
  talento: {
    terrivel: 'Bagre',
    ruim: 'Bagre',
    bagre: 'Bagre',
    normal: 'Normal',
    boa: 'Bom Jogador',
    otima: 'Craque',
    excelente: 'Gênio',
    fenomeno: 'Lenda',
  } as Record<TalentoLab, string>,
  categoria: {
    ataque: 'Ataque',
    defesa: 'Defesa',
    posse: 'Posse de bola',
    fisico: 'Físico e mental',
  } as Record<Categoria, string>,
  /** Índice = dificuldade do drill (GAME-RULES §4). */
  dificuldade: ['', 'Muito Fácil', 'Fácil', 'Médio', 'Difícil', 'Muito Difícil'],
  atributos: {
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
    reflexos: 'Reflexos',
    agilidade: 'Agilidade',
    antecipacao: 'Antecipação',
    sairNaBola: 'Sair na bola',
    comunicacao: 'Comunicação',
    arremesso: 'Arremesso',
    chutar: 'Chutar',
    espalmar: 'Espalmar',
    jogoAereo: 'Jogo aéreo',
    concentracao: 'Concentração',
  } as Record<Atributo | AtributoGoleiro, string>,
  grupos: {
    defesa: 'Defesa',
    ataque: 'Ataque',
    atributos: 'Atributos',
    defesaDoGol: 'Defesa do gol',
  },
  squad: {
    titulo: 'Squad',
    lead: (
      <>
        Simulador da média dos 14 mais fortes, o número que define
        <br />
        contra quem você joga na próxima temporada.
      </>
    ) as ReactNode,
    exportar: 'Exportar elenco',
    importar: 'Importar elenco',
    erroImportacao: 'Arquivo inválido. Não deu para importar.',
    adicionarTitulo: 'Adicionar jogador',
    adicionarHint: '4 campos, poucos segundos por jogador',
    nome: 'Nome',
    nomePlaceholder: 'Ex.: Grenn Aemon',
    idade: 'Idade',
    overall: 'Overall',
    adicionar: 'Adicionar',
    elenco: 'Elenco',
    ordenarPor: 'Ordenar por',
    ordem: {
      overall: 'Overall',
      name: 'Nome',
      age: 'Idade',
      position: 'Posição',
      talent: 'Talento',
    } as Record<OrdemElenco, string>,
    ordemAria: (ordem: string) => `Elenco ordenado por ${ordem.toLowerCase()}`,
    vazio: 'Nenhum jogador cadastrado ainda.',
    colJogador: 'Jogador',
    colTalento: 'Talento',
    colIdade: 'Idade',
    colOvr: 'Ovr',
    colPos: 'Pos.',
    colSimulacao: 'Simulação',
    colAcoes: 'Ações',
    salvar: 'Salvar',
    cancelar: 'Cancelar',
    nos14: 'Nos 14 que contam. ',
    vendido: 'Vendido',
    subiu: 'Subiu para os 14',
    talentoSr: 'Talento: ',
    desfazer: 'Desfazer',
    desfazerAria: (nome: string) => `Desfazer venda de ${nome}`,
    marcarVenda: 'Marcar venda',
    marcarVendaAria: (nome: string) => `Marcar ${nome} como vendido`,
    editarAria: (nome: string) => `Editar ${nome}`,
    excluirAria: (nome: string) => `Excluir ${nome}`,
    excluirConfirm: (nome: string) => `Excluir ${nome} do elenco?`,
    corte: 'Corte do 14º. Daqui para baixo não entra na média.',
    calloutTop14: (
      <>
        Barra dourada marca quem está nos 14 que contam. Cada venda simulada tira um jogador da
        conta e <b>puxa o próximo reserva para dentro</b>, então o efeito quase nunca é o óbvio.
        A média da tela de escalação (os 11) é outra conta e induz ao erro.
      </>
    ) as ReactNode,
    tileLabel: 'Média dos 14, com as vendas simuladas',
    semVendas: (media: string, total: number): ReactNode => (
      <>
        Sem vendas: <b className="num">{media}</b> · elenco de <b className="num">{total}</b>{' '}
        jogadores.
      </>
    ),
    trocaNos14: (saiu: string, entrou: string, overall: number): ReactNode => (
      <>
        <b>{saiu}</b> saiu dos 14 e <b>{entrou}</b> ({overall}) subiu no lugar dele.
      </>
    ),
    faixasTitulo: 'O que essa média significa',
    voceAqui: 'Você está aqui',
    faixas: [
      { faixa: 'até 85', texto: 'Liga confortável. Adversários no seu nível ou abaixo.' },
      { faixa: '86 – 100', texto: 'Liga equilibrada. Dá para brigar pelo título montando bem.' },
      { faixa: '101 – 115', texto: 'Liga puxada. Encontra times de quem investe dinheiro.' },
      {
        faixa: 'acima de 115',
        texto: 'Liga de pagantes. Desvantagem estrutural na temporada inteira.',
      },
    ],
    calloutFaixas: (
      <>
        O jogo emparelha a temporada seguinte pela média dos <b>14 jogadores mais fortes</b>, não
        pela dos 11 escalados. As faixas acima são observação da comunidade brasileira, não número
        publicado pela Nordeus.
      </>
    ) as ReactNode,
    porPosicao: 'Por posição',
    jogadores: (total: number) => `${total} jogadores`,
  },
  lab: {
    titulo: 'Laboratório',
    lead: 'Simulador de treino, um jogador por vez. Qual exercício rende mais neste jogador agora.',
    vazio: 'Cadastre um jogador na aba Squad pra usar o Laboratório.',
    calloutGoleiro:
      'Goleiro também entra: a ficha de GK tem 15 atributos em 2 blocos, com brancos e exercícios próprios.',
    jogador: 'Jogador',
    idadeNaoInformada: 'Idade não informada',
    anos: (idade: number) => `${idade} anos`,
    talentoSr: 'Talento: ',
    naoClassificado: 'não classificado',
    cancelar: 'Cancelar',
    reclassificar: 'Reclassificar',
    classificar: 'Classificar',
    habilidades: 'Habilidades',
    viradaAria: 'Virada de temporada: reduzir 20 pontos de cada atributo',
    virada: 'Virada de temporada',
    viradaConfirm:
      'Esta ação simula a virada de temporada e irá abaixar 20 pontos de cada atributo. Confirmar?',
    origemLinha: (posicoes: string) =>
      `Derivadas da posição ${posicoes}. Confira e ajuste se o jogo divergir.`,
    origemGoleiro: 'Derivadas da tabela de goleiro. Confira e ajuste se o jogo divergir.',
    atributoChaveAria: (atributo: string) => `${atributo}: atributo-chave`,
    legendaBranco: 'Atributo-chave (branco). Cresce ao dobro da velocidade.',
    legendaCinza: 'Atributo cinza. Entra no overall, quase não muda o jogo.',
    sessaoTitulo: 'Sessão recomendada',
    sessaoHint: 'Os 6 slots, da menor média para a maior (GAME-RULES §6)',
    mediaDe: (drill: string) => `Média de ${drill}`,
    faltam: (valor: string) => `faltam ${valor}`,
    exercicios: 'Exercícios',
    exerciciosHint: (total: number) => `${total} drills classificados para este jogador`,
    primarios: 'Exercícios Primários',
    primariosExplicacao: 'Todos os atributos que contam são chave',
    secundarios: 'Exercícios Secundários',
    secundariosExplicacao: 'Um atributo cinza entra na conta',
    terciarios: 'Exercícios Terciários',
    terciariosExplicacao: 'Dois ou mais atributos cinzas',
    recomendado: 'Recomendado',
    escalaTrocar: 'trocar',
    escalaTrava: 'trava',
    porSessao: '/ sessão',
    colExercicio: 'Exercício',
    colAteOTeto: 'Até o teto',
    colMedia: 'Média',
    colFaltam: 'Faltam',
    testeTitulo: 'Teste de talento',
    testeNota: (
      <>
        Isolado do treino de atributos. No jogo, treine uma <b>habilidade especial</b> ou posição
        nova (40–50 pontos) e anote quanto a barra andou em cada uma das 6 sessões: 1, 2 ou 3.
      </>
    ) as ReactNode,
    classificadoComo: (rotulo: string): ReactNode => (
      <>
        Classificado como <b>{rotulo}</b>. Use Reclassificar na ficha para testar de novo ou
        informar outro talento.
      </>
    ),
    aindaNaoClassificado: (
      <>
        Ainda não classificado. Use <b>Classificar</b> na ficha para fazer o teste ou informar o
        talento manualmente.
      </>
    ) as ReactNode,
    passos: [
      'Comece uma habilidade especial. Não troque depois de iniciada.',
      'Rode exatamente 6 sessões e anote os pontos da barra (1, 2 ou 3).',
      'Informe a sequência, ou lance o talento manualmente se já souber.',
    ],
    sessaoCurta: (n: number) => `S${n}`,
    classificarPelaBarra: 'Classificar pela barra',
    informarManual: 'Informar manualmente',
    escolherTalento: 'Escolher talento',
    tabelaCaption: 'Classificação pelas 6 sessões',
    colResultado: 'Resultado',
    colSequencia: 'Sequência',
    qualquer3: 'Qualquer sequência com 3',
    atencao: 'Atenção',
    erroVazio: 'Teste de talento inválido: informe exatamente 6 sessões.',
    erroSequencia: 'Teste de talento inválido: a sequência não casa com nenhuma linha da tabela.',
    talento: 'Talento',
    calloutTeste:
      'A sequência precisa casar exatamente com a tabela. A única exceção é Lenda: basta aparecer um 3 em qualquer uma das 6 sessões.',
  },
};

export type Textos = typeof pt;

/** Termos de jogo conforme docs/GLOSSARY-EN.md; nada aqui é confirmado no jogo ainda. */
export const en: Textos = {
  locale: 'en',
  meta: {
    descricao: 'Training and squad calculator for Top Eleven',
  },
  shell: {
    pular: 'Skip to content',
  },
  nav: {
    aria: 'Main tabs',
    squad: 'Squad',
    laboratorio: 'Lab',
    outroIdioma: 'Português',
  },
  topbar: {
    fechar: 'Close',
    githubAria: 'Support on GitHub',
    githubTitulo: 'Support the project',
    githubTexto: 'Support this project on GitHub with a star. It’s free!',
    favoritar: 'Star it',
    pixAria: 'Contribute via Pix',
    pixTitulo: 'Support with Pix',
    pixTexto: 'Help this project get an official domain, any amount. Pix is a Brazilian payment method.',
    copiado: 'Copied!',
    copiarChave: 'Copy key',
  },
  regras: 'RULES',
  seletorPosicao: {
    rotulo: 'Position',
    campo: 'Positions on the pitch',
    ate3: 'Up to 3.',
  },
  drills: {
    'marcar-homem-a-homem': '1-On-1 Finishing',
    'passe-va-e-dispare': 'Pass Go & Shoot',
    'jogada-ensaiada': 'Set-Piece Delivery',
    'tecnica-de-chute': 'Shooting Technique',
    'drible-de-slalom': 'Slalom Dribble',
    'jogo-na-ponta': 'Wing Play',
    'contra-ataque-rapido': 'Fast Counter-Attack',
    'analise-do-video': 'Video Analysis',
    cabeceada: 'Use Your Head',
    'uma-linha-de-defesa': 'Hold The Line',
    'parar-o-atacante': 'Stop The Attacker',
    'cruzamento-de-defesa': 'Defending Crosses',
    'pressione-o-play': 'Press The Play',
    'treino-de-goleiro': 'Goalkeeper Training',
    'controle-da-bola': 'Ball Control',
    'jogo-de-bobinho': 'Piggy In The Middle',
    'matada-de-bola': 'First Touch Play',
    'virada-de-jogo': 'Rapid Side Watch',
    posicionamento: 'Stay In Lane',
    entradas: 'Contact Play',
    'passes-para-o-chute': 'Passes Before Shot',
    aquecimento: 'Warm-Up',
    alongamento: 'Stretch',
    'carioca-com-escadas': 'Carioca With Ladders',
    'corrida-longa': 'Long Run',
    'corrida-de-ir-e-vir': 'Shuttle Runs',
    'corrida-de-obstaculo': 'Hurdle Jumps',
    academia: 'Gym',
    arrancada: 'Sprint',
  },
  talento: {
    terrivel: 'Low Talent',
    ruim: 'Low Talent',
    bagre: 'Low Talent',
    normal: 'Normal',
    boa: 'Good Player',
    otima: 'Star',
    excelente: 'Genius',
    fenomeno: 'Legend',
  },
  categoria: {
    ataque: 'Attack',
    defesa: 'Defence',
    posse: 'Possession',
    fisico: 'Physical & Mental',
  },
  dificuldade: ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'],
  atributos: {
    corte: 'Tackling',
    marcacao: 'Marking',
    posicionamento: 'Positioning',
    cabecada: 'Heading',
    coragem: 'Bravery',
    passe: 'Passing',
    drible: 'Dribbling',
    cruzamento: 'Crossing',
    chute: 'Shooting',
    finalizacao: 'Finishing',
    condicionamento: 'Fitness',
    forca: 'Strength',
    agressividade: 'Aggression',
    velocidade: 'Speed',
    criatividade: 'Creativity',
    reflexos: 'Reflexes',
    agilidade: 'Agility',
    antecipacao: 'Anticipation',
    sairNaBola: 'Rushing Out',
    comunicacao: 'Communication',
    arremesso: 'Throwing',
    chutar: 'Kicking',
    espalmar: 'Punching',
    jogoAereo: 'Aerial Ability',
    concentracao: 'Concentration',
  },
  grupos: {
    defesa: 'Defence',
    ataque: 'Attack',
    atributos: 'Physical',
    defesaDoGol: 'Goalkeeping',
  },
  squad: {
    titulo: 'Squad',
    lead: (
      <>
        Simulates the average of your 14 strongest players, the number that decides who you
        face next season.
      </>
    ),
    exportar: 'Export squad',
    importar: 'Import squad',
    erroImportacao: 'Invalid file. Could not import it.',
    adicionarTitulo: 'Add player',
    adicionarHint: '4 fields, a few seconds per player',
    nome: 'Name',
    nomePlaceholder: 'e.g. Grenn Aemon',
    idade: 'Age',
    overall: 'Overall',
    adicionar: 'Add',
    elenco: 'Squad list',
    ordenarPor: 'Sort by',
    ordem: {
      overall: 'Overall',
      name: 'Name',
      age: 'Age',
      position: 'Position',
      talent: 'Talent',
    },
    ordemAria: (ordem: string) => `Squad sorted by ${ordem.toLowerCase()}`,
    vazio: 'No players added yet.',
    colJogador: 'Player',
    colTalento: 'Talent',
    colIdade: 'Age',
    colOvr: 'Ovr',
    colPos: 'Pos.',
    colSimulacao: 'Simulation',
    colAcoes: 'Actions',
    salvar: 'Save',
    cancelar: 'Cancel',
    nos14: 'In the 14 that count. ',
    vendido: 'Sold',
    subiu: 'Moved into the 14',
    talentoSr: 'Talent: ',
    desfazer: 'Undo',
    desfazerAria: (nome: string) => `Undo sale of ${nome}`,
    marcarVenda: 'Mark as sold',
    marcarVendaAria: (nome: string) => `Mark ${nome} as sold`,
    editarAria: (nome: string) => `Edit ${nome}`,
    excluirAria: (nome: string) => `Delete ${nome}`,
    excluirConfirm: (nome: string) => `Delete ${nome} from the squad?`,
    corte: '14th-place cut. Players below this line don’t count toward the average.',
    calloutTop14: (
      <>
        The gold bar marks the 14 players that count. Each simulated sale takes a player out of
        the count and <b>pulls the next reserve in</b>, so the effect is rarely the obvious one.
        The average on the line-up screen (the 11 starters) is a different number and misleads.
      </>
    ),
    tileLabel: 'Top-14 average, with simulated sales',
    semVendas: (media: string, total: number) => (
      <>
        Without sales: <b className="num">{media}</b> · squad of <b className="num">{total}</b>{' '}
        players.
      </>
    ),
    trocaNos14: (saiu: string, entrou: string, overall: number) => (
      <>
        <b>{saiu}</b> left the 14 and <b>{entrou}</b> ({overall}) moved in.
      </>
    ),
    faixasTitulo: 'What this average means',
    voceAqui: 'You are here',
    faixas: [
      { faixa: 'up to 85', texto: 'Comfortable league. Opponents at your level or below.' },
      { faixa: '86 – 100', texto: 'Balanced league. A well-built squad can fight for the title.' },
      { faixa: '101 – 115', texto: 'Tough league. You meet teams from players who spend money.' },
      { faixa: 'above 115', texto: 'Paying players’ league. A structural disadvantage all season.' },
    ],
    calloutFaixas: (
      <>
        The game matches next season by the average of the <b>14 strongest players</b>, not the 11
        in the line-up. The bands above are observations from the Brazilian community, not numbers
        published by Nordeus.
      </>
    ),
    porPosicao: 'By position',
    jogadores: (total: number) => `${total} players`,
  },
  lab: {
    titulo: 'Lab',
    lead: 'Training simulator, one player at a time. Which drill pays off most for this player right now.',
    vazio: 'Add a player in the Squad tab to use the Lab.',
    calloutGoleiro:
      'Goalkeepers work too: the GK sheet has 15 attributes in 2 blocks, with its own key attributes and drills.',
    jogador: 'Player',
    idadeNaoInformada: 'Age not set',
    anos: (idade: number) => `${idade} years old`,
    talentoSr: 'Talent: ',
    naoClassificado: 'not rated',
    cancelar: 'Cancel',
    reclassificar: 'Re-rate',
    classificar: 'Rate',
    habilidades: 'Attributes',
    viradaAria: 'Season turnover: take 20 points off every attribute',
    virada: 'Season turnover',
    viradaConfirm:
      'This simulates the season turnover and will take 20 points off every attribute. Continue?',
    origemLinha: (posicoes: string) =>
      `Derived from position ${posicoes}. Check them and adjust if the game differs.`,
    origemGoleiro: 'Derived from the goalkeeper table. Check them and adjust if the game differs.',
    atributoChaveAria: (atributo: string) => `${atributo}: key attribute`,
    legendaBranco: 'Key attribute (white). Grows twice as fast.',
    legendaCinza: 'Grey attribute. Counts toward overall, barely changes the match.',
    sessaoTitulo: 'Recommended session',
    sessaoHint: 'The 6 slots, lowest average first (GAME-RULES §6)',
    mediaDe: (drill: string) => `${drill} average`,
    faltam: (valor: string) => `${valor} left`,
    exercicios: 'Drills',
    exerciciosHint: (total: number) => `${total} drills rated for this player`,
    primarios: 'Primary Drills',
    primariosExplicacao: 'Every attribute that counts is a key attribute',
    secundarios: 'Secondary Drills',
    secundariosExplicacao: 'One grey attribute in the mix',
    terciarios: 'Tertiary Drills',
    terciariosExplicacao: 'Two or more grey attributes',
    recomendado: 'Recommended',
    escalaTrocar: 'switch',
    escalaTrava: 'cap',
    porSessao: '/ session',
    colExercicio: 'Drill',
    colAteOTeto: 'To the cap',
    colMedia: 'Average',
    colFaltam: 'Left',
    testeTitulo: 'Talent test',
    testeNota: (
      <>
        Separate from attribute training. In the game, train a <b>special ability</b> or a new
        position (40–50 points) and note how far the bar moved in each of the 6 sessions: 1, 2 or
        3.
      </>
    ),
    classificadoComo: (rotulo: string) => (
      <>
        Rated as <b>{rotulo}</b>. Use Re-rate on the player sheet to test again or set another
        talent.
      </>
    ),
    aindaNaoClassificado: (
      <>
        Not rated yet. Use <b>Rate</b> on the player sheet to run the test or set the talent by
        hand.
      </>
    ),
    passos: [
      'Start a special ability. Don’t switch once it has started.',
      'Run exactly 6 sessions and note the bar points (1, 2 or 3).',
      'Enter the sequence, or set the talent by hand if you already know it.',
    ],
    sessaoCurta: (n: number) => `S${n}`,
    classificarPelaBarra: 'Rate by the bar',
    informarManual: 'Set by hand',
    escolherTalento: 'Choose talent',
    tabelaCaption: 'Rating by the 6 sessions',
    colResultado: 'Result',
    colSequencia: 'Sequence',
    qualquer3: 'Any sequence with a 3',
    atencao: 'Warning',
    erroVazio: 'Invalid talent test: enter exactly 6 sessions.',
    erroSequencia: 'Invalid talent test: the sequence doesn’t match any row of the table.',
    talento: 'Talent',
    calloutTeste:
      'The sequence has to match the table exactly. The only exception is Legend: a single 3 in any of the 6 sessions is enough.',
  },
};

export const TEXTOS: Record<Idioma, Textos> = { pt, en };

/** Mesmo endereço no outro idioma. `/laboratorio` não muda de nome em inglês. */
export const PREFIXO: Record<Idioma, string> = { pt: '', en: '/en' };

export type Pagina = 'squad' | 'laboratorio';

export function caminho(idioma: Idioma, pagina: Pagina): string {
  const resto = pagina === 'squad' ? '' : '/laboratorio';
  return PREFIXO[idioma] + resto || '/';
}

export function formatarDecimal(textos: Textos, valor: number): string {
  return valor.toLocaleString(textos.locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
