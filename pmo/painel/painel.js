/**
 * Painel Geral do PMO - JavaScript
 * Interface centralizada para gerenciar múltiplos PMOs
 * @version 1.0.0
 * @author ANC - Sistema PMO
 */

const PainelPMO = {
    // Estado
    state: {
        pmos: [],
        pmosFiltrados: [],
        filtrosExpandidos: false,
        pmoParaDeletar: null
    },

    // Mapeamento de nomes de formulários
    formulariosLabels: {
        'cadastro-geral-pmo': 'Cadastro Geral',
        'anexo-vegetal': 'Anexo Vegetal',
        'anexo-animal': 'Anexo Animal',
        'anexo-cogumelo': 'Anexo Cogumelo',
        'anexo-apicultura': 'Anexo Apicultura',
        'anexo-processamento': 'Anexo Processamento',
        'anexo-processamentominimo': 'Proc. Mínimo',
        'relatorios': 'Relatórios'
    },

    /**
     * Inicializar painel
     */
    init() {
        console.log('✅ Inicializando Painel PMO...');

        // Verificar se PMOStorageManager está disponível
        if (!window.PMOStorageManager) {
            console.error('❌ PMOStorageManager não disponível!');
            this.showMessage('Erro: Sistema de armazenamento não disponível', 'error');
            return;
        }

        // Carregar PMOs
        this.carregarPMOs();

        // Popular filtros
        this.popularFiltros();

        // Configurar drag and drop
        this.setupDragAndDrop();

        console.log('✅ Painel PMO inicializado com sucesso!');
    },

    /**
     * Carregar todos os PMOs
     */
    carregarPMOs() {
        try {
            this.state.pmos = window.PMOStorageManager.listAllPMOs();
            console.log(`📋 ${this.state.pmos.length} PMO(s) carregado(s)`);

            // Aplicar filtros (na primeira vez, mostra todos)
            this.aplicarFiltros();
        } catch (error) {
            console.error('Erro ao carregar PMOs:', error);
            this.showMessage('Erro ao carregar PMOs', 'error');
        }
    },

    /**
     * Popular dropdowns de filtros
     */
    popularFiltros() {
        // Popular grupos SPG
        const grupos = [...new Set(this.state.pmos.map(p => p.grupo_spg).filter(Boolean))];
        const grupoSelect = document.getElementById('filtro-grupo');
        if (grupoSelect) {
            grupos.forEach(grupo => {
                const option = document.createElement('option');
                option.value = grupo;
                option.textContent = grupo;
                grupoSelect.appendChild(option);
            });
        }

        // Popular anos
        const anos = [...new Set(this.state.pmos.map(p => p.ano_vigente).filter(Boolean))];
        const anoSelect = document.getElementById('filtro-ano');
        if (anoSelect) {
            anos.sort((a, b) => b - a); // Ordem decrescente
            anos.forEach(ano => {
                const option = document.createElement('option');
                option.value = ano;
                option.textContent = ano;
                anoSelect.appendChild(option);
            });
        }
    },

    /**
     * Aplicar filtros e busca
     */
    aplicarFiltros() {
        let filtrados = [...this.state.pmos];

        // Busca por texto
        const busca = document.getElementById('busca-input')?.value.toLowerCase() || '';
        if (busca) {
            filtrados = filtrados.filter(pmo =>
                pmo.nome.toLowerCase().includes(busca) ||
                pmo.cpf_cnpj.toLowerCase().includes(busca) ||
                pmo.unidade.toLowerCase().includes(busca)
            );
        }

        // Filtro de status
        const status = document.querySelector('input[name="filtro-status"]:checked')?.value || 'todos';
        if (status === 'rascunho') {
            filtrados = filtrados.filter(pmo => pmo.progresso.total < 100);
        } else if (status === 'completo') {
            filtrados = filtrados.filter(pmo => pmo.progresso.total >= 100);
        }

        // Filtro de grupo
        const grupo = document.getElementById('filtro-grupo')?.value;
        if (grupo) {
            filtrados = filtrados.filter(pmo => pmo.grupo_spg === grupo);
        }

        // Filtro de ano
        const ano = document.getElementById('filtro-ano')?.value;
        if (ano) {
            filtrados = filtrados.filter(pmo => pmo.ano_vigente == ano);
        }

        // Ordenação
        const ordenar = document.getElementById('filtro-ordenar')?.value || 'recente';
        switch (ordenar) {
            case 'recente':
                filtrados.sort((a, b) => new Date(b.data_modificacao) - new Date(a.data_modificacao));
                break;
            case 'antigo':
                filtrados.sort((a, b) => new Date(a.data_modificacao) - new Date(b.data_modificacao));
                break;
            case 'progresso-desc':
                filtrados.sort((a, b) => b.progresso.total - a.progresso.total);
                break;
            case 'progresso-asc':
                filtrados.sort((a, b) => a.progresso.total - b.progresso.total);
                break;
            case 'nome-asc':
                filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'nome-desc':
                filtrados.sort((a, b) => b.nome.localeCompare(a.nome));
                break;
        }

        this.state.pmosFiltrados = filtrados;
        this.renderizarLista();
    },

    /**
     * Renderizar lista de PMOs
     */
    renderizarLista() {
        const container = document.getElementById('pmos-lista');
        const emptyState = document.getElementById('empty-state');

        if (!container) return;

        // Limpar container
        container.innerHTML = '';

        // Mostrar/ocultar estado vazio
        if (this.state.pmosFiltrados.length === 0) {
            container.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        container.classList.remove('hidden');
        if (emptyState) emptyState.classList.add('hidden');

        // Renderizar cards
        this.state.pmosFiltrados.forEach(pmo => {
            const card = this.criarCard(pmo);
            container.appendChild(card);
        });
    },

    /**
     * Criar card de PMO
     */
    criarCard(pmo) {
        const card = document.createElement('div');
        card.className = 'pmo-card fade-in';

        // Header do card
        const header = document.createElement('div');
        header.className = 'pmo-card-header';

        const progressoBadge = `<span class="progresso-badge">${pmo.progresso.total}%</span>`;
        const titulo = `<h3 class="pmo-card-title">${progressoBadge} ${pmo.nome} - ${pmo.unidade}</h3>`;

        const info = `
            <div class="pmo-card-info">
                <div class="info-item">
                    <strong>CPF/CNPJ:</strong> ${pmo.cpf_cnpj}
                </div>
                <div class="info-item">
                    <strong>Grupo:</strong> ${pmo.grupo_spg || 'Não informado'}
                </div>
            </div>
            <div class="pmo-card-info">
                <div class="info-item">
                    <strong>Ano Vigente:</strong> ${pmo.ano_vigente}
                </div>
                <div class="info-item">
                    <strong>Versão:</strong> ${pmo.versao}
                </div>
                <div class="info-item">
                    <strong>Criado:</strong> ${this.formatarData(pmo.data_criacao)}
                </div>
            </div>
        `;

        header.innerHTML = titulo + info;

        // Fluxo do PMO
        const flow = document.createElement('div');
        flow.className = 'pmo-card-flow';

        pmo.formularios_ativos.forEach(formularioKey => {
            const flowItem = document.createElement('div');
            flowItem.className = 'flow-item';
            flowItem.onclick = () => this.editarPMO(pmo.id, formularioKey);

            const nome = this.formulariosLabels[formularioKey] || formularioKey;
            const progresso = pmo.progresso[formularioKey] || 0;

            flowItem.innerHTML = `
                <div class="flow-item-name">${nome}</div>
                <div class="flow-item-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${progresso}%"></div>
                    </div>
                    <div class="progress-percentage">${progresso}%</div>
                </div>
            `;

            flow.appendChild(flowItem);
        });

        // Ações do card
        const actions = document.createElement('div');
        actions.className = 'pmo-card-actions';
        actions.innerHTML = `
            <button class="btn btn-primary btn-sm" onclick="PainelPMO.editarPMO('${pmo.id}', 'cadastro-geral-pmo')">
                📝 Editar
            </button>
            <button class="btn btn-secondary btn-sm" onclick="PainelPMO.exportarPMOCompleto('${pmo.id}')">
                📥 Exportar PMO Completo
            </button>
            <button class="btn btn-danger btn-sm" onclick="PainelPMO.abrirModalDelete('${pmo.id}')">
                🗑️ Deletar
            </button>
        `;

        // Montar card
        card.appendChild(header);
        card.appendChild(flow);
        card.appendChild(actions);

        return card;
    },

    /**
     * Toggle filtros
     */
    toggleFiltros() {
        this.state.filtrosExpandidos = !this.state.filtrosExpandidos;

        const filtros = document.getElementById('filtros-expandivel');
        const icon = document.getElementById('filtros-toggle-icon');
        const text = document.getElementById('filtros-toggle-text');

        if (this.state.filtrosExpandidos) {
            filtros.classList.add('expanded');
            icon.textContent = '🔼';
            text.textContent = 'Ocultar Filtros';
        } else {
            filtros.classList.remove('expanded');
            icon.textContent = '🔽';
            text.textContent = 'Mostrar Filtros';
        }
    },

    /**
     * Criar novo PMO
     */
    novoPMO() {
        // Redirecionar para cadastro geral
        window.location.href = '../cadastro-geral-pmo/index.html';
    },

    /**
     * Editar PMO
     */
    editarPMO(pmoId, formulario = 'cadastro-geral-pmo') {
        // Definir como PMO ativo
        window.PMOStorageManager.setActivePMO(pmoId);

        // Mapear formulário para URL
        const urls = {
            'cadastro-geral-pmo': '../cadastro-geral-pmo/index.html',
            'anexo-vegetal': '../anexo-vegetal/index.html',
            'anexo-animal': '../anexo-animal/index.html',
            'anexo-cogumelo': '../anexo-cogumelo/index.html',
            'anexo-apicultura': '../anexo-apicultura/index.html',
            'anexo-processamento': '../anexo-processamento/index.html',
            'anexo-processamentominimo': '../anexo-processamentominimo/index.html'
        };

        const url = urls[formulario] || urls['cadastro-geral-pmo'];
        window.location.href = url;
    },

    /**
     * Exportar PMO completo
     */
    async exportarPMOCompleto(pmoId) {
        try {
            this.showMessage('Gerando PDF completo...', 'info');

            const pmo = window.PMOStorageManager.getPMO(pmoId);
            if (!pmo) {
                throw new Error('PMO não encontrado');
            }

            // Criar novo PDF
            const pdfDoc = await PDFLib.PDFDocument.create();

            // TODO: Mesclar PDFs dos formulários e documentos
            // Por ora, criar PDF simples com informações
            const page = pdfDoc.addPage([595, 842]); // A4
            const { width, height } = page.getSize();

            page.drawText(`PMO - ${pmo.nome}`, {
                x: 50,
                y: height - 50,
                size: 20
            });

            page.drawText(`Unidade: ${pmo.unidade}`, {
                x: 50,
                y: height - 80,
                size: 12
            });

            page.drawText(`CPF/CNPJ: ${pmo.cpf_cnpj}`, {
                x: 50,
                y: height - 100,
                size: 12
            });

            page.drawText(`Grupo SPG: ${pmo.grupo_spg}`, {
                x: 50,
                y: height - 120,
                size: 12
            });

            page.drawText(`Ano Vigente: ${pmo.ano_vigente}`, {
                x: 50,
                y: height - 140,
                size: 12
            });

            page.drawText(`Progresso: ${pmo.progresso.total}%`, {
                x: 50,
                y: height - 160,
                size: 12
            });

            // Embeber metadata JSON
            const metadata = {
                pmo_schema: "1.0",
                id_produtor: pmo.cpf_cnpj,
                nome: pmo.nome,
                unidade: pmo.unidade,
                grupo_spg: pmo.grupo_spg,
                ano_vigente: pmo.ano_vigente,
                versao: pmo.versao,
                data_exportacao: new Date().toISOString(),
                formularios_ativos: pmo.formularios_ativos,
                progresso: pmo.progresso
            };

            // Salvar PDF
            const pdfBytes = await pdfDoc.save();

            // Download
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `PMO-Completo-${pmo.nome}-${pmo.ano_vigente}.pdf`;
            a.click();
            URL.revokeObjectURL(url);

            this.showMessage('PDF exportado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            this.showMessage('Erro ao exportar PDF: ' + error.message, 'error');
        }
    },

    /**
     * Abrir modal de upload
     */
    abrirModalUpload() {
        const modal = document.getElementById('modal-upload');
        if (modal) modal.classList.add('active');
    },

    /**
     * Fechar modal de upload
     */
    fecharModalUpload() {
        const modal = document.getElementById('modal-upload');
        if (modal) modal.classList.remove('active');

        // Limpar input
        const input = document.getElementById('upload-input');
        if (input) input.value = '';

        const status = document.getElementById('upload-status');
        if (status) {
            status.style.display = 'none';
            status.innerHTML = '';
        }
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
     * Processar arquivo PDF
     */
    async handleFile(file) {
        if (file.type !== 'application/pdf') {
            this.showMessage('Por favor, selecione um arquivo PDF', 'error');
            return;
        }

        const status = document.getElementById('upload-status');
        if (status) {
            status.style.display = 'block';
            status.innerHTML = '<p>⏳ Processando PDF...</p>';
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

            // TODO: Extrair metadata
            // Por ora, mostrar mensagem
            if (status) {
                status.innerHTML = '<p style="color: var(--warning-color);">⚠️ Extração de metadata em desenvolvimento. Use "Novo PMO" por enquanto.</p>';
            }

            setTimeout(() => {
                this.fecharModalUpload();
            }, 3000);

        } catch (error) {
            console.error('Erro ao processar PDF:', error);
            if (status) {
                status.innerHTML = `<p style="color: var(--danger-color);">❌ Erro: ${error.message}</p>`;
            }
        }
    },

    /**
     * Abrir modal de delete
     */
    abrirModalDelete(pmoId) {
        this.state.pmoParaDeletar = pmoId;

        const pmo = window.PMOStorageManager.getPMO(pmoId);
        if (!pmo) return;

        const modal = document.getElementById('modal-delete');
        const nomeEl = document.getElementById('delete-pmo-name');

        if (nomeEl) {
            nomeEl.textContent = `${pmo.nome} - ${pmo.unidade} (${pmo.ano_vigente})`;
        }

        if (modal) modal.classList.add('active');
    },

    /**
     * Fechar modal de delete
     */
    fecharModalDelete() {
        const modal = document.getElementById('modal-delete');
        if (modal) modal.classList.remove('active');
        this.state.pmoParaDeletar = null;
    },

    /**
     * Confirmar delete
     */
    confirmarDelete() {
        if (!this.state.pmoParaDeletar) return;

        const sucesso = window.PMOStorageManager.deletePMO(this.state.pmoParaDeletar);

        if (sucesso) {
            this.showMessage('PMO deletado com sucesso', 'success');
            this.fecharModalDelete();
            this.carregarPMOs();
        } else {
            this.showMessage('Erro ao deletar PMO', 'error');
        }
    },

    /**
     * Formatar data
     */
    formatarData(isoString) {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR');
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
window.PainelPMO = PainelPMO;
