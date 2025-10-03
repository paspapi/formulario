/**
 * Painel de Conformidade Orgânica
 * Gerencia e exibe informações sobre conformidade e certificação orgânica
 * @version 1.0.0
 */

class ConformidadeOrganica {
    constructor() {
        this.storageKey = 'pmo_conformidade_organica';
        this.data = this.loadData();
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.checkAlertas();
    }

    /**
     * Carrega dados do localStorage
     */
    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            return JSON.parse(saved);
        }

        // Dados padrão se não houver dados salvos
        return this.getDefaultData();
    }

    /**
     * Dados padrão inicial
     */
    getDefaultData() {
        return {
            identificacao: {
                nomeProdutor: '',
                codigoInterno: '',
                numeroCadastroNacional: ''
            },
            visitaVerificacao: {
                dataUltimaVisita: null,
                status: 'pendente',
                proximaVisitaPrevista: null,
                observacoes: ''
            },
            equilibrioSistema: {
                visitasExternasRealizadas: 0,
                visitasExternasMinimas: 2,
                status: 'pendente',
                historico: []
            },
            aprovacaoDecisao: {
                dataAprovacao: null,
                status: 'pendente',
                numeroDecisao: '',
                observacoes: ''
            },
            apresentacaoOrganizacaoParticipativa: {
                dataApresentacao: null,
                status: 'nao_apresentada',
                parecer: '',
                proximaReuniao: null
            },
            certificadoConformidade: {
                status: 'pendente',
                numeroSelo: '',
                dataEmissao: null,
                dataValidade: null,
                escoposCertificados: [],
                observacoes: ''
            },
            cadastroNacional: {
                status: 'pendente',
                dataUltimaAtualizacao: null,
                linkCadastro: '',
                observacoes: ''
            },
            alertas: {
                visitaAtrasada: false,
                certificadoProximoVencimento: false,
                acoesPendentes: []
            }
        };
    }

    /**
     * Salva dados no localStorage
     */
    saveData(skipAlertas = false) {
        this.data.metadados = {
            dataUltimaModificacao: new Date().toISOString(),
            versao: '1.0.0'
        };
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        if (!skipAlertas) {
            this.checkAlertas();
        }
    }

    /**
     * Carrega dados do PMO Principal
     */
    loadFromPMO() {
        const pmoPrincipal = localStorage.getItem('pmo_principal');
        if (pmoPrincipal) {
            const pmoData = JSON.parse(pmoPrincipal);

            if (pmoData.nome_produtor) {
                this.data.identificacao.nomeProdutor = pmoData.nome_produtor;
            }
            if (pmoData.codigo_interno) {
                this.data.identificacao.codigoInterno = pmoData.codigo_interno;
            }
            if (pmoData.cnpo) {
                this.data.identificacao.numeroCadastroNacional = pmoData.cnpo;
            }

            this.saveData();
            this.render();
        }
    }

    /**
     * Verifica alertas automáticos
     */
    checkAlertas() {
        const acoesPendentes = [];

        // Alerta de visita atrasada (> 12 meses)
        if (this.data.visitaVerificacao.dataUltimaVisita) {
            const dataVisita = new Date(this.data.visitaVerificacao.dataUltimaVisita);
            const mesesDesdeVisita = this.monthsDiff(dataVisita, new Date());

            if (mesesDesdeVisita > 12) {
                this.data.alertas.visitaAtrasada = true;
                this.data.visitaVerificacao.status = 'atrasada';
                acoesPendentes.push({
                    tipo: 'visita_atrasada',
                    descricao: 'Visita de Verificação está atrasada (mais de 12 meses)',
                    prazo: null,
                    prioridade: 'alta'
                });
            } else {
                this.data.alertas.visitaAtrasada = false;
            }
        }

        // Alerta de certificado próximo ao vencimento (< 30 dias)
        if (this.data.certificadoConformidade.dataValidade) {
            const dataValidade = new Date(this.data.certificadoConformidade.dataValidade);
            const diasParaVencer = this.daysDiff(new Date(), dataValidade);

            if (diasParaVencer <= 30 && diasParaVencer >= 0) {
                this.data.alertas.certificadoProximoVencimento = true;
                acoesPendentes.push({
                    tipo: 'certificado_vencendo',
                    descricao: `Certificado de Conformidade Orgânica vence em ${diasParaVencer} dias`,
                    prazo: this.data.certificadoConformidade.dataValidade,
                    prioridade: diasParaVencer <= 15 ? 'alta' : 'media'
                });
            } else if (diasParaVencer < 0) {
                acoesPendentes.push({
                    tipo: 'certificado_vencido',
                    descricao: 'Certificado de Conformidade Orgânica está vencido',
                    prazo: this.data.certificadoConformidade.dataValidade,
                    prioridade: 'alta'
                });
            }
        }

        // Verificar equilíbrio do sistema
        if (this.data.equilibrioSistema.visitasExternasRealizadas < this.data.equilibrioSistema.visitasExternasMinimas) {
            const faltam = this.data.equilibrioSistema.visitasExternasMinimas - this.data.equilibrioSistema.visitasExternasRealizadas;
            acoesPendentes.push({
                tipo: 'visitas_externas_pendentes',
                descricao: `Faltam ${faltam} Visita(s) de Verificação Externa(s) para cumprir o equilíbrio do sistema`,
                prazo: null,
                prioridade: 'media'
            });
        }

        // Verificar apresentação à Organização Participativa
        if (this.data.apresentacaoOrganizacaoParticipativa.status === 'nao_apresentada') {
            acoesPendentes.push({
                tipo: 'apresentacao_pendente',
                descricao: 'Visita de Verificação ainda não apresentada à Comissão de Avaliação da Organização Participativa de Avaliação da Conformidade',
                prazo: this.data.apresentacaoOrganizacaoParticipativa.proximaReuniao,
                prioridade: 'media'
            });
        }

        // Verificar aprovação da decisão
        if (this.data.aprovacaoDecisao.status === 'pendente') {
            acoesPendentes.push({
                tipo: 'decisao_pendente',
                descricao: 'Aprovação da Decisão sobre conformidade orgânica está pendente',
                prazo: null,
                prioridade: 'media'
            });
        }

        this.data.alertas.acoesPendentes = acoesPendentes;
        this.saveData(true); // Skip checkAlertas para evitar loop infinito
    }

    /**
     * Calcula diferença em meses
     */
    monthsDiff(date1, date2) {
        return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24 * 30));
    }

    /**
     * Calcula diferença em dias
     */
    daysDiff(date1, date2) {
        return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    }

    /**
     * Formata data para exibição
     */
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    /**
     * Renderiza o painel completo
     */
    render() {
        const container = document.getElementById('conformidade-content');
        if (!container) return;

        // Verificar se há dados de identificação
        if (!this.data.identificacao.nomeProdutor) {
            container.innerHTML = this.renderEmpty();
            return;
        }

        container.innerHTML = `
            <div class="conformidade-container fade-in-up">
                ${this.renderHeader()}
                ${this.renderIndicadores()}
                ${this.renderEtapas()}
                ${this.renderTimeline()}
                ${this.renderAlertas()}
                ${this.renderAcoes()}
            </div>
        `;
    }

    /**
     * Renderiza estado vazio
     */
    renderEmpty() {
        return `
            <div class="conformidade-empty">
                <div class="conformidade-empty-icon">📋</div>
                <h2>Painel de Conformidade Orgânica</h2>
                <p>Para visualizar o painel de conformidade, primeiro preencha os dados do Plano de Manejo Orgânico Principal.</p>
                <button class="btn-conformidade primary" onclick="conformidadeOrganica.loadFromPMO()">
                    📥 Carregar Dados do Plano de Manejo Orgânico
                </button>
                <button class="btn-conformidade secondary" onclick="window.location.href='../pmo-principal/index.html'">
                    📋 Ir para Plano de Manejo Orgânico Principal
                </button>
            </div>
        `;
    }

    /**
     * Renderiza cabeçalho
     */
    renderHeader() {
        const statusGeral = this.getStatusGeral();

        return `
            <div class="conformidade-header">
                <h1>🏛️ Painel de Conformidade Orgânica</h1>

                <div class="conformidade-identificacao">
                    <div class="identificacao-item">
                        <div class="identificacao-label">Produtor/Unidade</div>
                        <div class="identificacao-value">${this.data.identificacao.nomeProdutor || '-'}</div>
                    </div>
                    <div class="identificacao-item">
                        <div class="identificacao-label">Código Interno</div>
                        <div class="identificacao-value">${this.data.identificacao.codigoInterno || '-'}</div>
                    </div>
                    <div class="identificacao-item">
                        <div class="identificacao-label">Cadastro Nacional de Produtores Orgânicos</div>
                        <div class="identificacao-value">${this.data.identificacao.numeroCadastroNacional || '-'}</div>
                    </div>
                </div>

                <div class="status-geral">
                    <div class="status-geral-badge">${statusGeral.icon}</div>
                    <div class="status-geral-info">
                        <h3>Status Geral</h3>
                        <p>${statusGeral.texto}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza indicadores
     */
    renderIndicadores() {
        const progresso = this.calcularProgresso();
        const visitasEmDia = this.data.visitaVerificacao.status === 'realizada' ? 100 : 0;
        const visitasExternas = this.data.equilibrioSistema.visitasExternasMinimas > 0
            ? Math.round((this.data.equilibrioSistema.visitasExternasRealizadas / this.data.equilibrioSistema.visitasExternasMinimas) * 100)
            : 0;
        const certificadosPendentes = this.data.certificadoConformidade.status === 'pendente' ? 1 : 0;

        return `
            <div class="indicadores-section">
                <div class="indicadores-grid">
                    <div class="indicador-card">
                        <div class="indicador-valor">${progresso}%</div>
                        <div class="indicador-label">Progresso Geral</div>
                        <div class="indicador-descricao">Conclusão das etapas obrigatórias</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-valor">${visitasEmDia}%</div>
                        <div class="indicador-label">Visitas em Dia</div>
                        <div class="indicador-descricao">Visitas de Verificação realizadas</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-valor">${visitasExternas}%</div>
                        <div class="indicador-label">Visitas Externas</div>
                        <div class="indicador-descricao">${this.data.equilibrioSistema.visitasExternasRealizadas} de ${this.data.equilibrioSistema.visitasExternasMinimas} realizadas</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-valor">${certificadosPendentes}</div>
                        <div class="indicador-label">Pendentes</div>
                        <div class="indicador-descricao">Certificados aguardando emissão</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza cards de etapas
     */
    renderEtapas() {
        return `
            <div class="etapas-grid">
                ${this.renderCardVisitaVerificacao()}
                ${this.renderCardEquilibrioSistema()}
                ${this.renderCardAprovacaoDecisao()}
                ${this.renderCardApresentacaoOrganizacaoParticipativa()}
                ${this.renderCardCertificado()}
                ${this.renderCardCadastroNacional()}
            </div>
        `;
    }

    /**
     * Renderiza card de Visita de Verificação
     */
    renderCardVisitaVerificacao() {
        const vv = this.data.visitaVerificacao;
        const statusClass = vv.status.replace('_', '-');
        const statusLabel = this.getStatusLabel(vv.status);

        return `
            <div class="etapa-card status-${statusClass}">
                <div class="etapa-card-header">
                    <h3>Visita de Verificação</h3>
                    <div class="etapa-icon">✓</div>
                </div>
                <div class="etapa-card-body">
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Última Visita</span>
                        <span class="etapa-info-value">${this.formatDate(vv.dataUltimaVisita)}</span>
                    </div>
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Status</span>
                        <span class="status-badge ${vv.status}">${statusLabel}</span>
                    </div>
                    ${vv.proximaVisitaPrevista ? `
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Próxima Prevista</span>
                        <span class="etapa-info-value">${this.formatDate(vv.proximaVisitaPrevista)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza card de Equilíbrio do Sistema
     */
    renderCardEquilibrioSistema() {
        const eq = this.data.equilibrioSistema;
        const percentual = eq.visitasExternasMinimas > 0
            ? Math.round((eq.visitasExternasRealizadas / eq.visitasExternasMinimas) * 100)
            : 0;
        const status = eq.visitasExternasRealizadas >= eq.visitasExternasMinimas ? 'cumprido' : 'nao-cumprido';
        const statusLabel = status === 'cumprido' ? 'Cumprido' : 'Não Cumprido';

        return `
            <div class="etapa-card status-${status}">
                <div class="etapa-card-header">
                    <h3>Equilíbrio do Sistema</h3>
                    <div class="etapa-icon">⚖️</div>
                </div>
                <div class="etapa-card-body">
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Visitas Externas</span>
                        <span class="etapa-info-value">${eq.visitasExternasRealizadas} / ${eq.visitasExternasMinimas}</span>
                    </div>
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar-info">
                            <span>Progresso</span>
                            <span>${percentual}%</span>
                        </div>
                        <div class="progress-bar-track">
                            <div class="progress-bar-fill" style="width: ${percentual}%"></div>
                        </div>
                    </div>
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Status</span>
                        <span class="status-badge ${status}">${statusLabel}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza card de Aprovação da Decisão
     */
    renderCardAprovacaoDecisao() {
        const ap = this.data.aprovacaoDecisao;
        const statusClass = ap.status.replace('_', '-');
        const statusLabel = this.getStatusLabel(ap.status);

        return `
            <div class="etapa-card status-${statusClass}">
                <div class="etapa-card-header">
                    <h3>Aprovação da Decisão</h3>
                    <div class="etapa-icon">📜</div>
                </div>
                <div class="etapa-card-body">
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Data de Aprovação</span>
                        <span class="etapa-info-value">${this.formatDate(ap.dataAprovacao)}</span>
                    </div>
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Status</span>
                        <span class="status-badge ${ap.status}">${statusLabel}</span>
                    </div>
                    ${ap.numeroDecisao ? `
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Número da Decisão</span>
                        <span class="etapa-info-value">${ap.numeroDecisao}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza card de Apresentação à Organização Participativa
     */
    renderCardApresentacaoOrganizacaoParticipativa() {
        const apr = this.data.apresentacaoOrganizacaoParticipativa;
        const statusClass = apr.status.replace('_', '-');
        const statusLabel = this.getStatusLabel(apr.status);

        return `
            <div class="etapa-card status-${statusClass}">
                <div class="etapa-card-header">
                    <h3>Apresentação à Organização Participativa de Avaliação da Conformidade</h3>
                    <div class="etapa-icon">🏛️</div>
                </div>
                <div class="etapa-card-body">
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Data de Apresentação</span>
                        <span class="etapa-info-value">${this.formatDate(apr.dataApresentacao)}</span>
                    </div>
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Status</span>
                        <span class="status-badge ${apr.status}">${statusLabel}</span>
                    </div>
                    ${apr.proximaReuniao ? `
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Próxima Reunião</span>
                        <span class="etapa-info-value">${this.formatDate(apr.proximaReuniao)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza card de Certificado
     */
    renderCardCertificado() {
        const cert = this.data.certificadoConformidade;
        const statusClass = cert.status.replace('_', '-');
        const statusLabel = this.getStatusLabel(cert.status);

        return `
            <div class="etapa-card status-${statusClass}">
                <div class="etapa-card-header">
                    <h3>Certificado de Conformidade Orgânica</h3>
                    <div class="etapa-icon">🏆</div>
                </div>
                <div class="etapa-card-body">
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Status</span>
                        <span class="status-badge ${cert.status}">${statusLabel}</span>
                    </div>
                    ${cert.dataValidade ? `
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Validade</span>
                        <span class="etapa-info-value">${this.formatDate(cert.dataValidade)}</span>
                    </div>
                    ` : ''}
                    ${cert.numeroSelo ? `
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Número do Selo</span>
                        <span class="etapa-info-value">${cert.numeroSelo}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza card do Cadastro Nacional
     */
    renderCardCadastroNacional() {
        const cn = this.data.cadastroNacional;
        const statusClass = cn.status.replace('_', '-');
        const statusLabel = this.getStatusLabel(cn.status);

        return `
            <div class="etapa-card status-${statusClass}">
                <div class="etapa-card-header">
                    <h3>Cadastro Nacional de Produtores Orgânicos</h3>
                    <div class="etapa-icon">📝</div>
                </div>
                <div class="etapa-card-body">
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Status</span>
                        <span class="status-badge ${cn.status}">${statusLabel}</span>
                    </div>
                    <div class="etapa-info-item">
                        <span class="etapa-info-label">Última Atualização</span>
                        <span class="etapa-info-value">${this.formatDate(cn.dataUltimaAtualizacao)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza timeline
     */
    renderTimeline() {
        const steps = [
            {
                id: 'visita',
                label: 'Visita de Verificação',
                status: this.data.visitaVerificacao.status === 'realizada' ? 'completed' :
                        this.data.visitaVerificacao.status === 'atrasada' ? 'current' : 'pending',
                date: this.data.visitaVerificacao.dataUltimaVisita,
                icon: '✓'
            },
            {
                id: 'equilibrio',
                label: 'Equilíbrio do Sistema',
                status: this.data.equilibrioSistema.visitasExternasRealizadas >= this.data.equilibrioSistema.visitasExternasMinimas ? 'completed' : 'pending',
                icon: '⚖️'
            },
            {
                id: 'decisao',
                label: 'Aprovação da Decisão',
                status: this.data.aprovacaoDecisao.status === 'aprovado' ? 'completed' :
                        this.data.aprovacaoDecisao.status === 'em_analise' ? 'current' : 'pending',
                date: this.data.aprovacaoDecisao.dataAprovacao,
                icon: '📜'
            },
            {
                id: 'apresentacao',
                label: 'Apresentação à Organização Participativa',
                status: this.data.apresentacaoOrganizacaoParticipativa.status === 'apresentada' ? 'completed' :
                        this.data.apresentacaoOrganizacaoParticipativa.status === 'agendada' ? 'current' : 'pending',
                date: this.data.apresentacaoOrganizacaoParticipativa.dataApresentacao,
                icon: '🏛️'
            },
            {
                id: 'certificado',
                label: 'Certificado de Conformidade Orgânica',
                status: this.data.certificadoConformidade.status === 'emitido' || this.data.certificadoConformidade.status === 'renovado' ? 'completed' : 'pending',
                date: this.data.certificadoConformidade.dataEmissao,
                icon: '🏆'
            }
        ];

        return `
            <div class="timeline-section">
                <h2>⏱️ Linha do Tempo</h2>
                <div id="conformidade-timeline"></div>
            </div>
            <script>
                if (typeof PMOTimeline !== 'undefined') {
                    PMOTimeline.createHorizontal({
                        steps: ${JSON.stringify(steps)},
                        containerId: 'conformidade-timeline'
                    });
                }
            </script>
        `;
    }

    /**
     * Renderiza alertas e ações pendentes
     */
    renderAlertas() {
        if (!this.data.alertas.acoesPendentes || this.data.alertas.acoesPendentes.length === 0) {
            return '';
        }

        const alertasHTML = this.data.alertas.acoesPendentes.map(alerta => `
            <div class="alerta-item prioridade-${alerta.prioridade}">
                <div class="alerta-icon">${this.getPrioridadeIcon(alerta.prioridade)}</div>
                <div class="alerta-content">
                    <div class="alerta-titulo">${alerta.descricao}</div>
                    ${alerta.prazo ? `<div class="alerta-prazo">Prazo: ${this.formatDate(alerta.prazo)}</div>` : ''}
                </div>
            </div>
        `).join('');

        return `
            <div class="alertas-section">
                <h2>⚠️ Alertas e Ações Pendentes</h2>
                ${alertasHTML}
            </div>
        `;
    }

    /**
     * Renderiza botões de ação
     */
    renderAcoes() {
        return `
            <div class="acoes-section">
                <button class="btn-conformidade primary" onclick="conformidadeOrganica.editarDados()">
                    ✏️ Editar Dados de Conformidade
                </button>
                <button class="btn-conformidade secondary" onclick="conformidadeOrganica.exportarRelatorio()">
                    📄 Exportar Relatório
                </button>
                <button class="btn-conformidade secondary" onclick="conformidadeOrganica.loadFromPMO()">
                    🔄 Atualizar do Plano de Manejo Orgânico
                </button>
            </div>
        `;
    }

    /**
     * Calcula progresso geral
     */
    calcularProgresso() {
        let etapas = 0;
        let completas = 0;

        // Visita de Verificação
        etapas++;
        if (this.data.visitaVerificacao.status === 'realizada') completas++;

        // Equilíbrio do Sistema
        etapas++;
        if (this.data.equilibrioSistema.visitasExternasRealizadas >= this.data.equilibrioSistema.visitasExternasMinimas) completas++;

        // Aprovação da Decisão
        etapas++;
        if (this.data.aprovacaoDecisao.status === 'aprovado') completas++;

        // Apresentação à Organização Participativa
        etapas++;
        if (this.data.apresentacaoOrganizacaoParticipativa.status === 'apresentada') completas++;

        // Certificado
        etapas++;
        if (this.data.certificadoConformidade.status === 'emitido' || this.data.certificadoConformidade.status === 'renovado') completas++;

        return Math.round((completas / etapas) * 100);
    }

    /**
     * Obtém status geral
     */
    getStatusGeral() {
        const progresso = this.calcularProgresso();

        if (progresso === 100) {
            return { icon: '✅', texto: 'Conformidade completa' };
        } else if (progresso >= 75) {
            return { icon: '🔵', texto: 'Próximo à conclusão' };
        } else if (progresso >= 50) {
            return { icon: '🟡', texto: 'Em andamento' };
        } else if (progresso > 0) {
            return { icon: '🟠', texto: 'Iniciado' };
        } else {
            return { icon: '⚪', texto: 'Não iniciado' };
        }
    }

    /**
     * Converte status em label legível
     */
    getStatusLabel(status) {
        const labels = {
            'realizada': 'Realizada',
            'atrasada': 'Atrasada',
            'pendente': 'Pendente',
            'aprovado': 'Aprovado',
            'reprovado': 'Reprovado',
            'em_analise': 'Em Análise',
            'apresentada': 'Apresentada',
            'nao_apresentada': 'Não Apresentada',
            'agendada': 'Agendada',
            'cumprido': 'Cumprido',
            'nao_cumprido': 'Não Cumprido',
            'em_andamento': 'Em Andamento',
            'emitido': 'Emitido',
            'renovado': 'Renovado',
            'suspenso': 'Suspenso',
            'cancelado': 'Cancelado',
            'inserido': 'Inserido',
            'atualizado': 'Atualizado',
            'desatualizado': 'Desatualizado'
        };
        return labels[status] || status;
    }

    /**
     * Ícone de prioridade
     */
    getPrioridadeIcon(prioridade) {
        const icons = {
            'alta': '🔴',
            'media': '🟡',
            'baixa': '🔵'
        };
        return icons[prioridade] || '⚪';
    }

    /**
     * Editar dados
     */
    editarDados() {
        alert('Funcionalidade de edição em desenvolvimento. Por enquanto, edite os dados diretamente no localStorage.');
    }

    /**
     * Exportar relatório
     */
    exportarRelatorio() {
        const relatorio = {
            titulo: 'Relatório de Conformidade Orgânica',
            data: new Date().toISOString(),
            dados: this.data,
            progresso: this.calcularProgresso()
        };

        const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conformidade-organica-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Setup de event listeners
     */
    setupEventListeners() {
        // Event listener para atualização de dados
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.data = this.loadData();
                this.render();
            }
        });
    }
}

// Inicializar quando o DOM estiver pronto
let conformidadeOrganica;
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            conformidadeOrganica = new ConformidadeOrganica();
        });
    } else {
        conformidadeOrganica = new ConformidadeOrganica();
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConformidadeOrganica;
}
if (typeof window !== 'undefined') {
    window.ConformidadeOrganica = ConformidadeOrganica;
}

export default ConformidadeOrganica;
