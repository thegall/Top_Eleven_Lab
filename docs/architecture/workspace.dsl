/*
 * Modelo C4 do Top Eleven Lab, em Structurizr DSL.
 *
 * Fonte da verdade dos diagramas. As decisões e os trade-offs ficam em
 * docs/ARCHITECTURE.md e em docs/adr/ — este arquivo descreve a estrutura,
 * não a justifica.
 *
 * Para ver os diagramas renderizados, sem instalar nada além do Docker:
 *
 *   docker run -it --rm -p 8080:8080 \
 *     -v "<caminho absoluto de docs/architecture>:/usr/local/structurizr" \
 *     structurizr/lite
 *
 * Identificadores e chaves de view em ASCII, porque são código.
 * Nomes, descrições e rótulos em português com acentuação, porque são texto.
 */
workspace "Top Eleven Lab" "Calculadora de treino e de elenco do Top Eleven, rodando inteira no navegador do jogador" {

    configuration {
        scope softwaresystem
    }

    model {
        jogador = person "Jogador de Top Eleven" "Joga sem gastar dinheiro no jogo e precisa decidir em quem investir maleta verde e quem vender antes da virada de temporada"

        lab = softwareSystem "Top Eleven Lab" "Recomenda qual exercício treinar em cada jogador e simula a média dos 14 mais fortes do elenco" {

            webApp = container "Aplicação Web" "Site estático que roda inteiro no navegador: as duas abas, o cadastro e o motor de cálculo. Não faz nenhuma requisição de rede em runtime" "Next.js (App Router, export estático) + TypeScript" {

                ui = component "Interface" "As duas abas, os formulários de cadastro, a formatação de número e o layout paisagem no celular. Não contém regra de jogo" "React"

                estado = component "Estado e Persistência" "Guarda o documento do usuário em memória, despacha as ações, grava no armazenamento local e cuida do exportar, do importar e da migração de schemaVersion" "TypeScript + React Context"

                motor = component "Motor de Domínio" "Funções puras: média do exercício, classificação dos drills, sigma, fator de idade, cronograma de 6 slots, projeção iterativa e média dos 14. Não conhece React, window nem localStorage" "TypeScript puro"

                tabelas = component "Tabelas de Regra" "Os 29 drills, a matriz de brancos por posição, a curva de talento e o fator de idade, transcritos de docs/GAME-RULES.md com a seção de origem citada" "TypeScript (as const)"
            }

            armazenamento = container "Armazenamento Local" "Um documento JSON por navegador, com o elenco, as fichas do Laboratório e o histórico de testes de talento" "localStorage do navegador" {
                tags "Database"
            }
        }

        arquivo = softwareSystem "Arquivo de Backup JSON" "O mesmo documento do armazenamento local, salvo no aparelho do jogador. É o que cobre troca de celular e limpeza de navegador" {
            tags "External"
        }

        hospedagem = softwareSystem "Hospedagem Estática" "Serve os arquivos gerados pelo export estático. Plano gratuito, sem backend e sem função de servidor" {
            tags "External"
        }

        jogador -> ui "Cadastra o elenco, simula vendas e pede a recomendação de treino" "Navegador, em paisagem no celular"
        jogador -> arquivo "Guarda o arquivo exportado e o transporta entre o celular e o PC" "Sistema de arquivos do aparelho"

        hospedagem -> webApp "Entrega os arquivos estáticos que formam a aplicação" "HTTPS"

        ui -> estado "Lê o documento e despacha as ações de cadastro, de venda e de simulação" "Chamada de função (React Context)"
        estado -> motor "Pede os cálculos, passando dados puros e recebendo dados puros" "Chamada de função síncrona"
        estado -> estado "Migra o documento entre versões de schema na leitura" "Função pura, sem I/O"
        estado -> armazenamento "Grava o documento inteiro a cada alteração e o lê uma vez na abertura" "API localStorage (JSON)"
        estado -> arquivo "Exporta o documento e importa o de outro aparelho" "Download e upload de arquivo JSON"
        motor -> tabelas "Lê as constantes de regra do jogo" "Import de módulo"
        motor -> motor "Repete a simulação sessão a sessão por causa do efeito cascata" "Laço síncrono"
    }

    views {
        systemContext lab "contexto" "O Lab visto de fora: um jogador, o navegador dele e o arquivo que ele leva de um aparelho para o outro" {
            include *
            autoLayout lr
        }

        container lab "containers" "Onde o código roda e onde o dado fica" {
            include *
            autoLayout lr
        }

        component webApp "componentes" "As três camadas e a direção da dependência: interface conhece aplicação, aplicação conhece domínio, domínio não conhece ninguém" {
            include *
            autoLayout lr
        }

        dynamic webApp "fluxoProjecao" "Projeção até a meta de overall. O efeito cascata obriga a recalcular sessão a sessão, e o teto de 180% obriga a existir um caminho de meta inalcançável" {
            jogador -> ui "Pede quantas sessões e quantas maletas faltam até o overall alvo"
            ui -> estado "Entrega o jogador já cadastrado, sem formatação"
            estado -> motor "Chama a projeção com os 15 atributos, o talento, a idade e o alvo"
            motor -> tabelas "Lê os 29 drills, a matriz de brancos e a curva de ganho"
            motor -> motor "Monta os 6 slots, aplica o ganho e recalcula a média dos 29 drills — uma sessão por vez"
            motor -> estado "Devolve a faixa de sessões e de maletas, ou avisa que a meta é inalcançável porque todo drill viável travou em 180%"
            ui -> jogador "Mostra a faixa e a regra aplicada, com a seção do GAME-RULES"
            autoLayout lr
        }

        dynamic webApp "fluxoImportacao" "Importar o arquivo do outro aparelho, com migração de schemaVersion e o caminho de falha que não apaga o elenco existente" {
            jogador -> ui "Escolhe o arquivo JSON e confirma que o elenco atual será substituído"
            ui -> estado "Entrega o conteúdo lido do arquivo"
            estado -> estado "Roda a cadeia de migração até a versão atual. Versão mais nova que a conhecida é recusada, sem gravar nada"
            estado -> armazenamento "Grava por cima só depois de o documento migrado estar válido"
            autoLayout lr
        }

        styles {
            element "Person" {
                shape person
            }
            element "Database" {
                shape cylinder
            }
            element "External" {
                background #999999
                color #ffffff
            }
        }
    }
}
