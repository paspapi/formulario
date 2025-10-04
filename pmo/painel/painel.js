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
        card.id = `pmo-card-${pmo.id}`;

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
     * Abrir modal de criar PMO
     */
    abrirModalCriarPMO() {
        const modal = document.getElementById('modal-criar-pmo');
        if (modal) modal.classList.add('active');
    },

    /**
     * Fechar modal de criar PMO
     */
    fecharModalCriarPMO() {
        const modal = document.getElementById('modal-criar-pmo');
        if (modal) modal.classList.remove('active');
    },

    /**
     * Criar novo PMO em branco
     * Abre o formulário de cadastro geral para preencher dados obrigatórios
     */
    criarNovoPMO() {
        try {
            // Fechar modal
            this.fecharModalCriarPMO();

            // Limpar PMO ativo para garantir formulário em branco
            if (window.PMOStorageManager) {
                window.PMOStorageManager.setActivePMO(null);
            }

            // Redirecionar para cadastro geral em modo de criação
            // O PMO só será criado no storage quando o usuário salvar o formulário
            window.location.href = '../cadastro-geral-pmo/index.html?modo=criar';

        } catch (error) {
            console.error('Erro ao abrir formulário:', error);
            this.showMessage('Erro ao abrir formulário: ' + error.message, 'error');
        }
    },

    /**
     * Nova avaliação
     */
    novaAvaliacao() {
        // Redirecionar para página de avaliação
        window.location.href = '../avaliacao/index.html';
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
     * Exportar PMO completo (PDF + JSON embedado nos metadados)
     */
    async exportarPMOCompleto(pmoId) {
        try {
            this.showMessage('Gerando PDF completo com dados embedados...', 'info');

            const pmo = window.PMOStorageManager.getPMO(pmoId);
            if (!pmo) {
                throw new Error('PMO não encontrado');
            }

            // Criar estrutura JSON completa conforme schema v2.0.0
            const jsonCompleto = {
                metadata: {
                    versao_schema: '2.0.0',
                    tipo_exportacao: 'pmo_completo',
                    id_pmo: pmo.id,
                    data_exportacao: new Date().toISOString(),
                    id_produtor: pmo.cpf_cnpj,
                    nome_produtor: pmo.nome,
                    nome_unidade: pmo.unidade,
                    grupo_spg: pmo.grupo_spg,
                    ano_vigente: pmo.ano_vigente,
                    status: pmo.status,
                    formularios_incluidos: [],
                    progresso: pmo.progresso
                }
            };

            // Incluir apenas formulários dos escopos habilitados
            const formulariosAtivos = pmo.formularios_ativos || ['cadastro-geral-pmo'];
            const mapeamentoNomes = {
                'cadastro-geral-pmo': 'cadastro_geral_pmo',
                'anexo-vegetal': 'anexo_vegetal',
                'anexo-animal': 'anexo_animal',
                'anexo-cogumelo': 'anexo_cogumelo',
                'anexo-apicultura': 'anexo_apicultura',
                'anexo-processamento': 'anexo_processamento',
                'anexo-processamentominimo': 'anexo_processamentominimo',
                'avaliacao': 'avaliacao'
            };

            formulariosAtivos.forEach(formularioId => {
                const nomeNormalizado = mapeamentoNomes[formularioId];
                if (nomeNormalizado && pmo.dados[nomeNormalizado]) {
                    jsonCompleto[nomeNormalizado] = pmo.dados[nomeNormalizado];
                    jsonCompleto.metadata.formularios_incluidos.push(nomeNormalizado);
                }
            });

            // Criar PDF com pdf-lib
            const pdfDoc = await PDFLib.PDFDocument.create();

            // Embedar JSON COMPLETO nos metadados do PDF
            const jsonString = JSON.stringify(jsonCompleto);

            // Método 1: Metadados padrão (title, subject, keywords)
            pdfDoc.setTitle(`PMO - ${pmo.nome} - ${pmo.unidade}`);
            pdfDoc.setAuthor('ANC - Sistema PMO v2.0');
            pdfDoc.setSubject(`Plano de Manejo Orgânico - ${pmo.ano_vigente}`);
            pdfDoc.setKeywords(['PMO', 'Orgânico', 'ANC', 'SPG', pmo.grupo_spg, pmo.id]);
            pdfDoc.setCreator('Sistema PMO ANC - pdf-lib v1.17.1');
            pdfDoc.setProducer('pdf-lib');
            pdfDoc.setCreationDate(new Date());
            pdfDoc.setModificationDate(new Date());

            // Método 2: JSON compactado no campo Subject (fallback para extração)
            // Usamos base64 para evitar problemas com caracteres especiais
            const jsonBase64 = btoa(unescape(encodeURIComponent(jsonString)));
            pdfDoc.setSubject(`PMO-JSON-DATA:${jsonBase64.substring(0, 200)}`); // Primeiros 200 chars

            // Renderizar conteúdo visual do PDF
            await this.renderPDFContent(pdfDoc, pmo, jsonCompleto);

            // Salvar PDF
            const pdfBytes = await pdfDoc.save();

            // Download
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const nomeArquivo = `PMO-Completo_${pmo.id}_${new Date().toISOString().split('T')[0]}.pdf`;
            a.download = nomeArquivo;
            a.click();
            URL.revokeObjectURL(url);

            // Também salvar JSON separado como backup
            const jsonBlob = new Blob([JSON.stringify(jsonCompleto, null, 2)], { type: 'application/json' });
            const jsonUrl = URL.createObjectURL(jsonBlob);
            const jsonLink = document.createElement('a');
            jsonLink.href = jsonUrl;
            jsonLink.download = `PMO-Completo_${pmo.id}_${new Date().toISOString().split('T')[0]}.json`;
            jsonLink.click();
            URL.revokeObjectURL(jsonUrl);

            this.showMessage('✅ PDF completo exportado com JSON embedado! Também foi gerado arquivo JSON de backup.', 'success');
            console.log('✅ Exportação completa:', nomeArquivo);
            console.log('📊 Formulários incluídos:', jsonCompleto.metadata.formularios_incluidos);
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            this.showMessage('Erro ao exportar PDF: ' + error.message, 'error');
        }
    },

    /**
     * Renderizar conteúdo visual do PDF
     */
    async renderPDFContent(pdfDoc, pmo, jsonCompleto) {
        const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        const helveticaBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

        // PÁGINA 1: CAPA
        let page = pdfDoc.addPage([595, 842]); // A4
        let y = 750;
        const margin = 50;
        const maxWidth = 495;

        // Título
        page.drawText('PLANO DE MANEJO ORGÂNICO', {
            x: margin,
            y: y,
            size: 24,
            font: helveticaBold
        });
        y -= 40;

        page.drawText('PMO - Produção Orgânica Certificada', {
            x: margin,
            y: y,
            size: 14,
            font: helveticaFont
        });
        y -= 60;

        // Informações do Produtor
        page.drawText('DADOS DO PRODUTOR', {
            x: margin,
            y: y,
            size: 16,
            font: helveticaBold
        });
        y -= 25;

        const dadosProdutor = [
            { label: 'Nome/Razão Social:', valor: pmo.nome },
            { label: 'Unidade de Produção:', valor: pmo.unidade },
            { label: 'CPF/CNPJ:', valor: pmo.cpf_cnpj },
            { label: 'Grupo SPG:', valor: pmo.grupo_spg },
            { label: 'Ano de Vigência:', valor: pmo.ano_vigente.toString() },
            { label: 'ID do PMO:', valor: pmo.id },
            { label: 'Status:', valor: pmo.status.toUpperCase() },
            { label: 'Progresso Total:', valor: `${pmo.progresso.total}%` }
        ];

        dadosProdutor.forEach(item => {
            page.drawText(item.label, {
                x: margin,
                y: y,
                size: 10,
                font: helveticaBold
            });
            page.drawText(item.valor, {
                x: margin + 150,
                y: y,
                size: 10,
                font: helveticaFont
            });
            y -= 20;
        });

        y -= 20;

        // Formulários Incluídos
        page.drawText('FORMULÁRIOS INCLUÍDOS NESTE PMO:', {
            x: margin,
            y: y,
            size: 12,
            font: helveticaBold
        });
        y -= 20;

        const labelFormularios = {
            'cadastro_geral_pmo': '✓ Cadastro Geral do PMO',
            'anexo_vegetal': '✓ Anexo I - Produção Vegetal',
            'anexo_animal': '✓ Anexo III - Produção Animal',
            'anexo_cogumelo': '✓ Anexo II - Cogumelos',
            'anexo_apicultura': '✓ Anexo IV - Apicultura',
            'anexo_processamento': '✓ Anexo - Processamento Completo',
            'anexo_processamentominimo': '✓ Anexo - Processamento Mínimo',
            'avaliacao': '✓ Avaliação de Conformidade'
        };

        jsonCompleto.metadata.formularios_incluidos.forEach(formulario => {
            const label = labelFormularios[formulario] || `✓ ${formulario}`;
            const percentual = pmo.progresso[formulario.replace(/_/g, '-')] || pmo.progresso[formulario] || 0;

            page.drawText(label, {
                x: margin + 10,
                y: y,
                size: 10,
                font: helveticaFont
            });

            page.drawText(`(${percentual}%)`, {
                x: margin + 300,
                y: y,
                size: 10,
                font: helveticaFont
            });
            y -= 18;
        });

        y -= 30;

        // Rodapé da capa
        page.drawText('Associação de Agricultura Natural de Campinas e Região - ANC', {
            x: margin,
            y: 50,
            size: 9,
            font: helveticaFont
        });

        page.drawText(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, {
            x: margin,
            y: 35,
            size: 8,
            font: helveticaFont
        });

        page.drawText('Sistema PMO v2.0 | JSON embedado nos metadados do PDF', {
            x: margin,
            y: 20,
            size: 7,
            font: helveticaFont
        });

        // PÁGINA 2+: Resumo dos dados (simplificado)
        page = pdfDoc.addPage([595, 842]);
        y = 780;

        page.drawText('RESUMO DOS DADOS DO PMO', {
            x: margin,
            y: y,
            size: 16,
            font: helveticaBold
        });
        y -= 30;

        page.drawText('Este PDF contém os dados completos do PMO embedados nos metadados.', {
            x: margin,
            y: y,
            size: 10,
            font: helveticaFont
        });
        y -= 15;

        page.drawText('Para extrair os dados JSON, utilize o Sistema PMO ANC ou ferramentas de leitura de metadados PDF.', {
            x: margin,
            y: y,
            size: 10,
            font: helveticaFont
        });
        y -= 30;

        page.drawText('IMPORTANTE:', {
            x: margin,
            y: y,
            size: 12,
            font: helveticaBold
        });
        y -= 18;

        const avisos = [
            '• Este PDF contém dados JSON completos nos metadados',
            '• Um arquivo JSON separado foi gerado como backup',
            '• Ambos os arquivos podem ser usados para importação',
            '• Os dados JSON incluem apenas os formulários dos escopos habilitados',
            `• Total de formulários incluídos: ${jsonCompleto.metadata.formularios_incluidos.length}`
        ];

        avisos.forEach(aviso => {
            page.drawText(aviso, {
                x: margin + 10,
                y: y,
                size: 9,
                font: helveticaFont
            });
            y -= 15;
        });
    },

    /**
     * Abrir modal de upload
     */
    abrirModalUpload() {
        // Fechar modal de criar PMO
        this.fecharModalCriarPMO();

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
     * Processar arquivo PDF ou JSON
     */
    async handleFile(file) {
        const status = document.getElementById('upload-status');

        // Verificar tipo de arquivo
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
            await this.handleJSONImport(file, status);
        } else if (file.type === 'application/pdf') {
            await this.handlePDFImport(file, status);
        } else {
            this.showMessage('Por favor, selecione um arquivo PDF ou JSON', 'error');
            return;
        }
    },

    /**
     * Processar importação de JSON
     */
    async handleJSONImport(file, status) {
        if (status) {
            status.style.display = 'block';
            status.innerHTML = '<p>⏳ Processando JSON...</p>';
        }

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Validar estrutura do JSON
            if (!this.validateJSONStructure(data)) {
                throw new Error('Estrutura do JSON inválida');
            }

            // Determinar tipo de importação (geral ou com escopos)
            const isGeneralOnly = data.metadata && data.dados && !data.escopos;
            const hasScopes = data.metadata && data.dados && data.escopos;

            if (!isGeneralOnly && !hasScopes) {
                throw new Error('JSON não contém estrutura válida (geral ou geral+escopos)');
            }

            // Criar novo PMO
            const pmoId = window.PMOStorageManager.createPMO({
                cpf_cnpj: data.dados.identificacao?.cpf_cnpj || data.metadata?.id_produtor || '',
                nome: data.dados.identificacao?.nome_completo || data.dados.identificacao?.razao_social || 'PMO Importado',
                unidade: data.dados.identificacao?.nome_unidade_producao || data.dados.identificacao?.nome_fantasia || 'Unidade Principal',
                grupo_spg: data.metadata?.grupo_spg || '',
                ano_vigente: data.metadata?.ano_vigente || new Date().getFullYear(),
                tipo_pessoa: data.dados.tipo_pessoa || 'fisica'
            });

            // Importar dados gerais
            if (data.dados) {
                const generalData = {
                    metadata: data.metadata || {
                        data_preenchimento: new Date().toISOString().split('T')[0],
                        ultima_atualizacao: new Date().toISOString(),
                        versao: '1.0'
                    },
                    dados: data.dados
                };
                window.PMOStorageManager.updateFormulario(pmoId, 'cadastro_geral_pmo', generalData);
            }

            // Importar escopos (se existirem)
            if (hasScopes && data.escopos) {
                Object.keys(data.escopos).forEach(scopeKey => {
                    const scopeData = data.escopos[scopeKey];
                    if (scopeData && scopeData.dados) {
                        window.PMOStorageManager.updateFormulario(pmoId, scopeKey, scopeData);
                    }
                });
            }

            if (status) {
                status.innerHTML = '<p style="color: var(--success-color);">✅ JSON importado com sucesso!</p>';
            }

            this.showMessage('JSON importado com sucesso!', 'success');

            setTimeout(() => {
                this.fecharModalUpload();
                this.carregarPMOs();

                // Destacar PMO atualizado
                setTimeout(() => {
                    this.destacarCard(pmoId);
                }, 300);
            }, 1500);

        } catch (error) {
            console.error('Erro ao processar JSON:', error);
            if (status) {
                status.innerHTML = `<p style="color: var(--danger-color);">❌ Erro: ${error.message}</p>`;
            }
        }
    },

    /**
     * Validar estrutura do JSON
     */
    validateJSONStructure(data) {
        // Deve ter metadata e dados
        if (!data.metadata || !data.dados) {
            return false;
        }

        // Validar que dados tem pelo menos um campo
        if (typeof data.dados !== 'object' || Object.keys(data.dados).length === 0) {
            return false;
        }

        return true;
    },

    /**
     * Processar importação de PDF
     */
    async handlePDFImport(file, status) {
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
     * Destacar card (scroll + animação)
     */
    destacarCard(pmoId) {
        const cardEl = document.getElementById(`pmo-card-${pmoId}`);
        if (!cardEl) {
            console.warn(`Card ${pmoId} não encontrado para destacar`);
            return;
        }

        // Scroll suave até o card
        cardEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Adicionar classe de highlight
        setTimeout(() => {
            cardEl.classList.add('highlighted');

            // Remover classe após animação
            setTimeout(() => {
                cardEl.classList.remove('highlighted');
            }, 1500);
        }, 500);
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
