/**
 * Sistema de Avaliação de Conformidade PMO
 * @version 1.0.0
 * @author ANC - Sistema PMO
 */

const AvaliacaoPMO = {
    // Estado da avaliação
    state: {
        etapaAtual: 1,
        pmoImportado: null,
        avaliador: null,
        avaliacoes: {},
        conformidade: {},
        id_avaliacao: null
    },

    // Mapeamento de seções para avaliação
    secoes: {
        'identificacao': {
            titulo: 'Identificação do Produtor',
            campos: ['nome_fornecedor', 'cpf_cnpj', 'grupo_spg', 'unidade_producao']
        },
        'endereco': {
            titulo: 'Endereço e Localização',
            campos: ['endereco', 'municipio', 'uf', 'cep', 'coordenadas']
        },
        'historico': {
            titulo: 'Histórico da Área',
            campos: ['tempo_producao_organica', 'uso_anterior', 'transicao']
        },
        'apiarios': {
            titulo: 'Apiários',
            campos: ['tabela_apiarios', 'total_colmeias', 'colmeias_producao']
        },
        'colmeias': {
            titulo: 'Especificações das Colmeias',
            campos: ['tabela_especificacoes_colmeias', 'tipo_colmeia', 'material']
        },
        'origem_abelhas': {
            titulo: 'Origem das Abelhas',
            campos: ['tabela_origem_abelhas', 'metodo_origem', 'certificacao']
        },
        'ceras': {
            titulo: 'Ceras',
            campos: ['origem_ceras', 'producao_propria_cera', 'fornecedor_cera']
        },
        'forrageamento': {
            titulo: 'Área de Forrageamento',
            campos: ['raio_forrageamento_km', 'tipo_vegetacao', 'tabela_fontes_alimentacao']
        },
        'floradas': {
            titulo: 'Floradas',
            campos: ['tabela_floradas']
        },
        'areas_risco': {
            titulo: 'Áreas de Risco',
            campos: ['tabela_areas_risco', 'distancias', 'medidas_protecao']
        },
        'alimentacao': {
            titulo: 'Alimentação Artificial',
            campos: ['utiliza_alimentacao_artificial', 'periodo_alimentacao', 'tabela_alimentos']
        },
        'manejo': {
            titulo: 'Manejo de Colmeias',
            campos: ['frequencia_revisao', 'metodo_renovacao_rainhas', 'tabela_atividades_manejo']
        },
        'sanidade': {
            titulo: 'Sanidade Apícola',
            campos: ['tabela_problemas_sanitarios', 'tabela_tratamentos', 'medidas_preventivas']
        },
        'colheita': {
            titulo: 'Colheita do Mel',
            campos: ['numero_colheitas_ano', 'tabela_colheitas', 'equipamento_colheita']
        },
        'processamento': {
            titulo: 'Processamento',
            campos: ['local_processamento', 'tabela_equipamentos_processamento', 'licenca_sanitaria']
        },
        'outros_produtos': {
            titulo: 'Outros Produtos Apícolas',
            campos: ['produz_propolis', 'produz_polen', 'produz_geleia_real']
        },
        'producao_estimada': {
            titulo: 'Produção Estimada',
            campos: ['mel_kg_ano', 'propolis_kg_ano', 'polen_kg_ano']
        }
    },

    /**
     * Inicializar sistema
     */
    init() {
        console.log('✅ Inicializando Sistema de Avaliação PMO...');

        // Verificar se storage está disponível
        if (!window.AvaliacaoStorage) {
            console.error('❌ AvaliacaoStorage não disponível!');
            return;
        }

        // Gerar ID de avaliação
        this.state.id_avaliacao = this.gerarID();

        // Configurar drag and drop
        this.setupDragAndDrop();

        // Verificar se há avaliação em progresso
        this.verificarAvaliacaoEmProgresso();

        console.log('✅ Sistema de Avaliação inicializado!');
    },

    /**
     * Gerar ID único
     */
    gerarID() {
        return 'aval_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Configurar drag and drop
     */
    setupDragAndDrop() {
        const uploadArea = document.getElementById('upload-area');
        if (!uploadArea) return;

        uploadArea.addEventListener('click', () => {
            document.getElementById('upload-input')?.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
    },

    /**
     * Handle file select
     */
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    },

    /**
     * Processar arquivo
     */
    async handleFile(file) {
        const status = document.getElementById('upload-status');

        try {
            status.innerHTML = '<p class="status-loading">⏳ Processando arquivo...</p>';
            status.style.display = 'block';

            let dados = null;

            // JSON
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                const text = await file.text();
                dados = JSON.parse(text);
            }
            // PDF (extração de JSON embedado nos metadados)
            else if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

                // Tentar extrair JSON dos metadados do PDF
                try {
                    // Método 1: Extrair do campo Subject (onde embedamos o JSON em base64)
                    const subject = pdfDoc.getSubject();

                    if (subject && subject.startsWith('PMO-JSON-DATA:')) {
                        // Extrair JSON do Subject (limitado)
                        status.innerHTML = '<p class="status-warning">⚠️ PDF com JSON parcial detectado. Por favor, utilize o arquivo JSON de backup para dados completos.</p>';
                        return;
                    }

                    // Método 2: Verificar se é PDF gerado pelo sistema
                    const title = pdfDoc.getTitle();
                    const author = pdfDoc.getAuthor();
                    const creator = pdfDoc.getCreator();

                    if (creator && creator.includes('Sistema PMO ANC')) {
                        status.innerHTML = `
                            <p class="status-info">
                                ℹ️ PDF do Sistema PMO detectado.<br>
                                <strong>Importante:</strong> Este PDF foi exportado com um arquivo JSON de backup.<br>
                                Por favor, utilize o arquivo JSON correspondente para importar todos os dados:
                            </p>
                            <p class="status-info">
                                <strong>Arquivo JSON esperado:</strong> ${file.name.replace('.pdf', '.json')}
                            </p>
                        `;
                        return;
                    }

                    // PDF não reconhecido
                    status.innerHTML = '<p class="status-warning">⚠️ PDF não contém dados JSON embedados. Por favor, utilize o arquivo JSON exportado do PMO.</p>';
                    return;

                } catch (pdfError) {
                    console.error('Erro ao extrair metadados do PDF:', pdfError);
                    status.innerHTML = '<p class="status-warning">⚠️ Erro ao ler metadados do PDF. Por favor, utilize o arquivo JSON exportado.</p>';
                    return;
                }
            }
            else {
                throw new Error('Formato de arquivo não suportado');
            }

            // Validar dados
            if (!dados || !dados.dados) {
                throw new Error('Estrutura de dados inválida');
            }

            // Armazenar PMO importado
            this.state.pmoImportado = dados;

            status.innerHTML = '<p class="status-success">✅ PMO carregado com sucesso!</p>';

            // Avançar para próxima etapa
            setTimeout(() => {
                this.avancarEtapa();
            }, 1000);

        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            status.innerHTML = `<p class="status-error">❌ Erro: ${error.message}</p>`;
        }
    },

    /**
     * Avançar etapa
     */
    avancarEtapa() {
        // Esconder etapa atual
        const etapaAtual = document.querySelector('.etapa-section.active');
        if (etapaAtual) {
            etapaAtual.classList.remove('active');
        }

        // Avançar
        this.state.etapaAtual++;

        // Mostrar próxima etapa
        const proximaEtapa = document.querySelectorAll('.etapa-section')[this.state.etapaAtual - 1];
        if (proximaEtapa) {
            proximaEtapa.classList.add('active');
            proximaEtapa.scrollIntoView({ behavior: 'smooth' });
        }
    },

    /**
     * Voltar etapa
     */
    voltarEtapa() {
        // Esconder etapa atual
        const etapaAtual = document.querySelector('.etapa-section.active');
        if (etapaAtual) {
            etapaAtual.classList.remove('active');
        }

        // Voltar
        this.state.etapaAtual--;

        // Mostrar etapa anterior
        const etapaAnterior = document.querySelectorAll('.etapa-section')[this.state.etapaAtual - 1];
        if (etapaAnterior) {
            etapaAnterior.classList.add('active');
            etapaAnterior.scrollIntoView({ behavior: 'smooth' });
        }
    },

    /**
     * Iniciar avaliação
     */
    iniciarAvaliacao() {
        // Validar dados do avaliador
        const form = document.getElementById('form-avaliador');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Capturar dados do avaliador
        this.state.avaliador = {
            nome: document.getElementById('avaliador_nome').value,
            cpf: document.getElementById('avaliador_cpf').value,
            cargo: document.getElementById('avaliador_cargo').value,
            observacao_geral: document.getElementById('avaliador_observacao_geral').value
        };

        // Renderizar avaliação
        this.renderizarAvaliacao();

        // Avançar etapa
        this.avancarEtapa();
    },

    /**
     * Renderizar seções de avaliação
     */
    renderizarAvaliacao() {
        const container = document.getElementById('secoes-avaliacao');
        if (!container) return;

        container.innerHTML = '';

        // Renderizar resumo do PMO
        this.renderizarResumo();

        // Renderizar cada seção
        Object.keys(this.secoes).forEach((secaoKey, index) => {
            const secao = this.secoes[secaoKey];
            const card = this.criarCardSecao(secaoKey, secao, index + 1);
            container.appendChild(card);
        });

        // Inicializar conformidade
        this.atualizarConformidade();
    },

    /**
     * Renderizar resumo do PMO
     */
    renderizarResumo() {
        const container = document.getElementById('pmo-resumo-info');
        if (!container) return;

        const dados = this.state.pmoImportado.dados;

        container.innerHTML = `
            <div class="resumo-grid">
                <div class="resumo-item">
                    <strong>Produtor:</strong> ${dados.nome_fornecedor || dados.nome_completo || '-'}
                </div>
                <div class="resumo-item">
                    <strong>CPF/CNPJ:</strong> ${dados.cpf || dados.cnpj || '-'}
                </div>
                <div class="resumo-item">
                    <strong>Unidade:</strong> ${dados.nome_unidade_producao || '-'}
                </div>
                <div class="resumo-item">
                    <strong>Grupo SPG:</strong> ${dados.grupo_spg || '-'}
                </div>
                <div class="resumo-item">
                    <strong>Data Preenchimento:</strong> ${dados.data_preenchimento || '-'}
                </div>
            </div>
        `;
    },

    /**
     * Criar card de seção
     */
    criarCardSecao(secaoKey, secao, numero) {
        const card = document.createElement('div');
        card.className = 'secao-avaliacao-card';
        card.dataset.secao = secaoKey;

        const dados = this.state.pmoImportado.dados;

        // Header
        const header = document.createElement('div');
        header.className = 'secao-header';
        header.innerHTML = `
            <h3>${numero}. ${secao.titulo}</h3>
            <div class="secao-status">
                <span class="status-badge status-pendente">Pendente</span>
            </div>
        `;

        // Dados da seção
        const dadosSecao = document.createElement('div');
        dadosSecao.className = 'secao-dados';

        secao.campos.forEach(campo => {
            const valor = this.obterValorCampo(dados, campo);

            const campoDiv = document.createElement('div');
            campoDiv.className = 'campo-item';
            campoDiv.innerHTML = `
                <div class="campo-label">${this.formatarLabel(campo)}:</div>
                <div class="campo-valor">${this.formatarValor(valor)}</div>
            `;
            dadosSecao.appendChild(campoDiv);
        });

        // Avaliação
        const avaliacaoDiv = document.createElement('div');
        avaliacaoDiv.className = 'secao-avaliacao';
        avaliacaoDiv.innerHTML = `
            <div class="avaliacao-controls">
                <label>
                    <strong>Conformidade:</strong>
                </label>
                <div class="radio-group">
                    <label class="radio-option conforme">
                        <input type="radio" name="conformidade_${secaoKey}" value="conforme" onchange="AvaliacaoPMO.atualizarSecao('${secaoKey}')">
                        ✅ Conforme
                    </label>
                    <label class="radio-option nao-conforme">
                        <input type="radio" name="conformidade_${secaoKey}" value="nao_conforme" onchange="AvaliacaoPMO.atualizarSecao('${secaoKey}')">
                        ❌ Não Conforme
                    </label>
                    <label class="radio-option parcial">
                        <input type="radio" name="conformidade_${secaoKey}" value="parcial" onchange="AvaliacaoPMO.atualizarSecao('${secaoKey}')">
                        ⚠️ Parcialmente Conforme
                    </label>
                    <label class="radio-option nao-aplicavel">
                        <input type="radio" name="conformidade_${secaoKey}" value="nao_aplicavel" onchange="AvaliacaoPMO.atualizarSecao('${secaoKey}')">
                        ➖ Não Aplicável
                    </label>
                </div>

                <div class="observacao-wrapper">
                    <label for="obs_${secaoKey}"><strong>Observações:</strong></label>
                    <textarea
                        id="obs_${secaoKey}"
                        name="obs_${secaoKey}"
                        rows="3"
                        placeholder="Adicione observações, pendências ou recomendações..."
                        oninput="AvaliacaoPMO.salvarObservacao('${secaoKey}')"
                    ></textarea>
                </div>
            </div>
        `;

        card.appendChild(header);
        card.appendChild(dadosSecao);
        card.appendChild(avaliacaoDiv);

        return card;
    },

    /**
     * Obter valor do campo
     */
    obterValorCampo(dados, campo) {
        // Verificar se é tabela
        if (campo.startsWith('tabela_')) {
            const tabela = dados[campo];
            if (Array.isArray(tabela)) {
                return `${tabela.length} registro(s)`;
            }
            return 'Não informado';
        }

        return dados[campo] || 'Não informado';
    },

    /**
     * Formatar label
     */
    formatarLabel(campo) {
        return campo
            .replace(/tabela_/g, '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    },

    /**
     * Formatar valor
     */
    formatarValor(valor) {
        if (valor === null || valor === undefined || valor === '') {
            return '<span class="valor-vazio">Não informado</span>';
        }

        if (typeof valor === 'boolean') {
            return valor ? 'Sim' : 'Não';
        }

        if (Array.isArray(valor)) {
            return `<span class="valor-tabela">${valor.length} item(ns)</span>`;
        }

        if (typeof valor === 'object') {
            return '<span class="valor-objeto">Dados estruturados</span>';
        }

        return String(valor);
    },

    /**
     * Atualizar seção
     */
    atualizarSecao(secaoKey) {
        const conformidade = document.querySelector(`input[name="conformidade_${secaoKey}"]:checked`)?.value;

        if (conformidade) {
            this.state.conformidade[secaoKey] = conformidade;

            // Atualizar status visual
            const card = document.querySelector(`[data-secao="${secaoKey}"]`);
            const badge = card?.querySelector('.status-badge');

            if (badge) {
                badge.classList.remove('status-pendente', 'status-conforme', 'status-nao-conforme', 'status-parcial', 'status-nao-aplicavel');

                switch(conformidade) {
                    case 'conforme':
                        badge.textContent = '✅ Conforme';
                        badge.classList.add('status-conforme');
                        break;
                    case 'nao_conforme':
                        badge.textContent = '❌ Não Conforme';
                        badge.classList.add('status-nao-conforme');
                        break;
                    case 'parcial':
                        badge.textContent = '⚠️ Parcial';
                        badge.classList.add('status-parcial');
                        break;
                    case 'nao_aplicavel':
                        badge.textContent = '➖ N/A';
                        badge.classList.add('status-nao-aplicavel');
                        break;
                }
            }

            this.atualizarConformidade();
        }
    },

    /**
     * Salvar observação
     */
    salvarObservacao(secaoKey) {
        const textarea = document.getElementById(`obs_${secaoKey}`);
        if (textarea) {
            if (!this.state.avaliacoes[secaoKey]) {
                this.state.avaliacoes[secaoKey] = {};
            }
            this.state.avaliacoes[secaoKey].observacao = textarea.value;
        }
    },

    /**
     * Atualizar conformidade geral
     */
    atualizarConformidade() {
        const totalSecoes = Object.keys(this.secoes).length;
        const secoesAvaliadas = Object.keys(this.state.conformidade).length;

        // Calcular pontuação
        let pontos = 0;
        let secoesValidas = 0;

        Object.values(this.state.conformidade).forEach(conf => {
            if (conf === 'nao_aplicavel') return; // Não conta na pontuação

            secoesValidas++;

            if (conf === 'conforme') {
                pontos += 100;
            } else if (conf === 'parcial') {
                pontos += 50;
            }
            // nao_conforme = 0 pontos
        });

        const conformidadePercentual = secoesValidas > 0 ? Math.round(pontos / secoesValidas) : 0;

        // Atualizar UI
        const progressCount = document.getElementById('progresso-count');
        const conformidadeScore = document.getElementById('conformidade-score');
        const progressBar = document.getElementById('progress-bar-avaliacao');

        if (progressCount) {
            progressCount.textContent = `${secoesAvaliadas}/${totalSecoes}`;
        }

        if (conformidadeScore) {
            conformidadeScore.textContent = `${conformidadePercentual}%`;
        }

        if (progressBar) {
            const progressoPercentual = Math.round((secoesAvaliadas / totalSecoes) * 100);
            progressBar.style.width = `${progressoPercentual}%`;
        }

        return { conformidadePercentual, secoesAvaliadas, totalSecoes };
    },

    /**
     * Salvar progresso
     */
    salvarProgresso() {
        try {
            const dadosAvaliacao = {
                id_avaliacao: this.state.id_avaliacao,
                pmo_avaliado: this.state.pmoImportado,
                avaliador: this.state.avaliador,
                conformidade: this.state.conformidade,
                avaliacoes: this.state.avaliacoes,
                data_salvamento: new Date().toISOString(),
                status: 'em_andamento'
            };

            window.AvaliacaoStorage.salvarAvaliacao(dadosAvaliacao);
            this.showMessage('Progresso salvo com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            this.showMessage('Erro ao salvar progresso', 'error');
        }
    },

    /**
     * Finalizar avaliação
     */
    finalizarAvaliacao() {
        // Verificar se todas as seções foram avaliadas
        const { secoesAvaliadas, totalSecoes } = this.atualizarConformidade();

        if (secoesAvaliadas < totalSecoes) {
            if (!confirm(`Você avaliou ${secoesAvaliadas} de ${totalSecoes} seções. Deseja finalizar mesmo assim?`)) {
                return;
            }
        }

        // Salvar e marcar como concluída
        const dadosAvaliacao = {
            id_avaliacao: this.state.id_avaliacao,
            pmo_avaliado: this.state.pmoImportado,
            avaliador: this.state.avaliador,
            conformidade: this.state.conformidade,
            avaliacoes: this.state.avaliacoes,
            data_finalizacao: new Date().toISOString(),
            status: 'concluida'
        };

        window.AvaliacaoStorage.salvarAvaliacao(dadosAvaliacao);

        // Mostrar resultado
        this.mostrarResultado();

        // Avançar para etapa de resultado
        this.avancarEtapa();
    },

    /**
     * Mostrar resultado
     */
    mostrarResultado() {
        const { conformidadePercentual, secoesAvaliadas, totalSecoes } = this.atualizarConformidade();

        // Atualizar círculo de score
        const scoreCircle = document.getElementById('score-circle');
        const scoreText = document.getElementById('score-text');
        const tituloResultado = document.getElementById('resultado-titulo');
        const descricaoResultado = document.getElementById('resultado-descricao');

        if (scoreCircle && scoreText) {
            const circumference = 565.48;
            const offset = circumference - (conformidadePercentual / 100) * circumference;

            scoreCircle.style.strokeDashoffset = offset;
            scoreText.textContent = `${conformidadePercentual}%`;

            // Cor baseada na pontuação
            if (conformidadePercentual >= 80) {
                scoreCircle.style.stroke = '#48bb78'; // Verde
                tituloResultado.textContent = '✅ Conformidade Excelente';
                descricaoResultado.textContent = 'O PMO está em conformidade com os requisitos orgânicos.';
            } else if (conformidadePercentual >= 60) {
                scoreCircle.style.stroke = '#ed8936'; // Laranja
                tituloResultado.textContent = '⚠️ Conformidade Parcial';
                descricaoResultado.textContent = 'O PMO precisa de ajustes para estar em conformidade total.';
            } else {
                scoreCircle.style.stroke = '#f56565'; // Vermelho
                tituloResultado.textContent = '❌ Não Conforme';
                descricaoResultado.textContent = 'O PMO possui pendências significativas que precisam ser corrigidas.';
            }
        }

        // Renderizar detalhes
        this.renderizarDetalhesResultado();
    },

    /**
     * Renderizar detalhes do resultado
     */
    renderizarDetalhesResultado() {
        const container = document.getElementById('resultado-detalhes');
        if (!container) return;

        let html = '<h3>Detalhamento por Seção</h3><div class="detalhes-grid">';

        Object.keys(this.secoes).forEach(secaoKey => {
            const secao = this.secoes[secaoKey];
            const conformidade = this.state.conformidade[secaoKey] || 'pendente';
            const observacao = this.state.avaliacoes[secaoKey]?.observacao || '';

            let icone = '';
            let classe = '';

            switch(conformidade) {
                case 'conforme':
                    icone = '✅';
                    classe = 'conforme';
                    break;
                case 'nao_conforme':
                    icone = '❌';
                    classe = 'nao-conforme';
                    break;
                case 'parcial':
                    icone = '⚠️';
                    classe = 'parcial';
                    break;
                case 'nao_aplicavel':
                    icone = '➖';
                    classe = 'nao-aplicavel';
                    break;
                default:
                    icone = '⏳';
                    classe = 'pendente';
            }

            html += `
                <div class="detalhe-item ${classe}">
                    <div class="detalhe-header">
                        <span class="detalhe-icone">${icone}</span>
                        <span class="detalhe-titulo">${secao.titulo}</span>
                    </div>
                    ${observacao ? `<div class="detalhe-obs">${observacao}</div>` : ''}
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    /**
     * Exportar PDF de avaliação
     */
    async exportarPDFAvaliacao() {
        try {
            this.showMessage('Gerando PDF de avaliação...', 'info');

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            let currentY = margin;

            // Cabeçalho
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text('Relatório de Avaliação de Conformidade PMO', margin, currentY);
            currentY += 10;

            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text('Associação de Agricultura Natural de Campinas e Região', margin, currentY);
            currentY += 15;

            // Dados do PMO
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Dados do PMO Avaliado', margin, currentY);
            currentY += 7;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            const dados = this.state.pmoImportado.dados;
            doc.text(`Produtor: ${dados.nome_fornecedor || dados.nome_completo || '-'}`, margin, currentY);
            currentY += 5;
            doc.text(`CPF/CNPJ: ${dados.cpf || dados.cnpj || '-'}`, margin, currentY);
            currentY += 5;
            doc.text(`Unidade: ${dados.nome_unidade_producao || '-'}`, margin, currentY);
            currentY += 10;

            // Dados do avaliador
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Avaliador', margin, currentY);
            currentY += 7;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Nome: ${this.state.avaliador.nome}`, margin, currentY);
            currentY += 5;
            doc.text(`CPF: ${this.state.avaliador.cpf}`, margin, currentY);
            currentY += 5;
            doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, currentY);
            currentY += 10;

            // Score de conformidade
            const { conformidadePercentual } = this.atualizarConformidade();
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(`Conformidade Geral: ${conformidadePercentual}%`, margin, currentY);
            currentY += 15;

            // Avaliações por seção
            doc.setFontSize(14);
            doc.text('Avaliação por Seção', margin, currentY);
            currentY += 10;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');

            Object.keys(this.secoes).forEach(secaoKey => {
                if (currentY > pageHeight - 40) {
                    doc.addPage();
                    currentY = margin;
                }

                const secao = this.secoes[secaoKey];
                const conformidade = this.state.conformidade[secaoKey] || 'pendente';
                const observacao = this.state.avaliacoes[secaoKey]?.observacao || '';

                let statusTexto = '';
                switch(conformidade) {
                    case 'conforme': statusTexto = 'CONFORME'; break;
                    case 'nao_conforme': statusTexto = 'NAO CONFORME'; break;
                    case 'parcial': statusTexto = 'PARCIAL'; break;
                    case 'nao_aplicavel': statusTexto = 'N/A'; break;
                    default: statusTexto = 'PENDENTE';
                }

                doc.setFont(undefined, 'bold');
                doc.text(`${secao.titulo}:`, margin, currentY);
                doc.setFont(undefined, 'normal');
                doc.text(statusTexto, margin + 80, currentY);
                currentY += 5;

                if (observacao) {
                    const splitObs = doc.splitTextToSize(`Obs: ${observacao}`, pageWidth - 2 * margin);
                    doc.text(splitObs, margin + 5, currentY);
                    currentY += splitObs.length * 5;
                }

                currentY += 3;
            });

            // Rodapé
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }

            // Salvar
            const nomeArquivo = `Avaliacao_PMO_${dados.nome_fornecedor || 'PMO'}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(nomeArquivo);

            this.showMessage('PDF gerado com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            this.showMessage('Erro ao gerar PDF: ' + error.message, 'error');
        }
    },

    /**
     * Nova avaliação
     */
    novaAvaliacao() {
        if (confirm('Deseja iniciar uma nova avaliação? O progresso atual será perdido se não foi salvo.')) {
            window.location.reload();
        }
    },

    /**
     * Voltar ao painel
     */
    voltarPainel() {
        window.location.href = '../painel/index.html';
    },

    /**
     * Verificar avaliação em progresso
     */
    verificarAvaliacaoEmProgresso() {
        // TODO: Implementar recuperação de avaliação em progresso
    },

    /**
     * Mostrar mensagem
     */
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 4000);
    }
};

// Expor globalmente
window.AvaliacaoPMO = AvaliacaoPMO;
