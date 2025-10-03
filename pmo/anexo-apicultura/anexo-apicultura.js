/**
 * Anexo Apicultura - Módulo JavaScript
 * Sistema PMO - ANC
 *
 * Lógica específica para o Anexo IV - Apicultura/Meliponicultura
 */

const AnexoApicultura = {
    // Configuração
    config: {
        formId: 'form-anexo-apicultura',
        storageKey: 'pmo_anexo_apicultura',
        autoSaveInterval: 30000 // 30 segundos
    },

    // Estado do formulário
    state: {
        lastSaved: null,
        hasChanges: false,
        validationErrors: []
    },

    /**
     * Inicialização do módulo
     */
    init() {
        console.log('Inicializando Anexo Apicultura...');

        // Inicializar tabelas dinâmicas
        this.initTables();

        // Carregar dados salvos
        this.loadData();

        // Auto-save
        this.initAutoSave();

        // Event listeners
        this.initEventListeners();

        // Máscaras de campos
        this.initMasks();

        // Carregar dados do PMO Principal (se disponível)
        this.loadPMOPrincipal();

        // Calcular progresso inicial
        this.updateProgress();

        console.log('Anexo Apicultura inicializado com sucesso!');
    },

    /**
     * Inicializar tabelas dinâmicas
     */
    initTables() {
        const tables = [
            'tabela-apiarios',
            'tabela-especificacoes-colmeias',
            'tabela-origem-abelhas',
            'tabela-fontes-alimentacao',
            'tabela-floradas',
            'tabela-areas-risco',
            'tabela-alimentos',
            'tabela-atividades-manejo',
            'tabela-problemas-sanitarios',
            'tabela-tratamentos',
            'tabela-colheitas',
            'tabela-equipamentos-processamento'
        ];

        tables.forEach(tableId => {
            const table = document.getElementById(tableId);
            if (table) {
                const tbody = table.querySelector('tbody');
                if (tbody && tbody.children.length === 0) {
                    // Já há uma linha inicial no HTML
                }
            }
        });
    },

    /**
     * Sistema de tabelas dinâmicas
     */
    table: {
        /**
         * Adicionar linha à tabela
         */
        addRow(tableId) {
            const table = document.getElementById(tableId);
            if (!table) return;

            const tbody = table.querySelector('tbody');
            const lastRow = tbody.querySelector('tr:last-child');

            if (!lastRow) return;

            // Clonar última linha
            const newRow = lastRow.cloneNode(true);

            // Limpar valores dos inputs
            const inputs = newRow.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }

                // Atualizar name dos campos
                const name = input.getAttribute('name');
                if (name) {
                    const match = name.match(/\[(\d+)\]/);
                    if (match) {
                        const currentIndex = parseInt(match[1]);
                        const newIndex = currentIndex + 1;
                        input.setAttribute('name', name.replace(/\[\d+\]/, `[${newIndex}]`));
                    }
                }
            });

            // Atualizar número da linha
            const rowNumber = tbody.children.length + 1;
            const rowNumberCell = newRow.querySelector('.row-number');
            if (rowNumberCell) {
                rowNumberCell.textContent = rowNumber;
            }

            // Adicionar ao tbody
            tbody.appendChild(newRow);

            // Marcar como alterado
            AnexoApicultura.markAsChanged();

            // Atualizar progresso
            AnexoApicultura.updateProgress();
        },

        /**
         * Remover linha da tabela
         */
        removeRow(button) {
            const row = button.closest('tr');
            const tbody = row.parentElement;

            // Não permitir remover se for a única linha
            if (tbody.children.length <= 1) {
                alert('Não é possível remover a única linha da tabela.');
                return;
            }

            // Remover linha
            row.remove();

            // Renumerar linhas
            this.updateRowNumbers(tbody);

            // Marcar como alterado
            AnexoApicultura.markAsChanged();

            // Atualizar progresso
            AnexoApicultura.updateProgress();
        },

        /**
         * Duplicar linha da tabela
         */
        duplicateRow(button) {
            const row = button.closest('tr');
            const tbody = row.parentElement;

            // Clonar linha mantendo valores
            const newRow = row.cloneNode(true);

            // Atualizar name dos campos
            const inputs = newRow.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                if (name) {
                    const match = name.match(/\[(\d+)\]/);
                    if (match) {
                        const currentIndex = parseInt(match[1]);
                        const newIndex = tbody.children.length;
                        input.setAttribute('name', name.replace(/\[\d+\]/, `[${newIndex}]`));
                    }
                }
            });

            // Adicionar ao tbody
            tbody.appendChild(newRow);

            // Renumerar linhas
            this.updateRowNumbers(tbody);

            // Marcar como alterado
            AnexoApicultura.markAsChanged();

            // Atualizar progresso
            AnexoApicultura.updateProgress();
        },

        /**
         * Atualizar numeração das linhas
         */
        updateRowNumbers(tbody) {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach((row, index) => {
                const rowNumber = row.querySelector('.row-number');
                if (rowNumber) {
                    rowNumber.textContent = index + 1;
                }
            });
        }
    },

    /**
     * Toggles de campos condicionais
     */
    toggleTipoAbelhaEspecifico() {
        const tipoAbelha = document.getElementById('tipo_abelha').value;
        const fieldEspecifico = document.getElementById('field-tipo-abelha-especifico');

        if (tipoAbelha === 'meliponineos' || tipoAbelha === 'ambos') {
            fieldEspecifico.style.display = 'block';
        } else {
            fieldEspecifico.style.display = 'none';
        }
    },

    toggleOrigemCeras() {
        const origem = document.getElementById('origem_ceras').value;
        const fieldFornecedor = document.getElementById('field-fornecedor-cera');

        if (origem === 'comprada_organica' || origem === 'comprada_convencional' || origem === 'mista') {
            fieldFornecedor.style.display = 'block';
        } else {
            fieldFornecedor.style.display = 'none';
        }
    },

    toggleAlimentacao(radio) {
        const detalhes = document.getElementById('detalhes-alimentacao');

        if (radio.value === 'sim') {
            detalhes.style.display = 'block';
        } else {
            detalhes.style.display = 'none';
        }
    },

    toggleCombustivelFumaca(radio) {
        const field = document.getElementById('field-combustivel-fumaca');

        if (radio.value === 'sim') {
            field.style.display = 'block';
        } else {
            field.style.display = 'none';
        }
    },

    toggleCasaMel() {
        const local = document.getElementById('local_processamento').value;
        const fieldCasaMel = document.getElementById('field-casa-mel');

        if (local === 'casa_mel_propria') {
            fieldCasaMel.style.display = 'block';
        } else {
            fieldCasaMel.style.display = 'none';
        }
    },

    toggleProdutoPropolis() {
        const produz = document.querySelector('select[name="produz_propolis"]').value;
        const fields = [
            'field-tipo-coleta-propolis',
            'field-producao-propolis'
        ];

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.style.display = produz === 'sim' ? 'block' : 'none';
            }
        });
    },

    toggleProdutoPolen() {
        const produz = document.querySelector('select[name="produz_polen"]').value;
        const fields = [
            'field-tipo-coletador-polen',
            'field-producao-polen'
        ];

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.style.display = produz === 'sim' ? 'block' : 'none';
            }
        });
    },

    toggleProdutoGeleia() {
        const produz = document.querySelector('select[name="produz_geleia_real"]').value;
        const field = document.getElementById('field-producao-geleia');

        if (field) {
            field.style.display = produz === 'sim' ? 'block' : 'none';
        }
    },

    /**
     * Aplicar máscaras nos campos
     */
    initMasks() {
        // CPF
        const cpfField = document.getElementById('cpf_apicultor');
        if (cpfField) {
            cpfField.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
        }

        // Data atual no campo de preenchimento
        const dataPreenchimento = document.getElementById('data_preenchimento');
        if (dataPreenchimento && !dataPreenchimento.value) {
            const hoje = new Date().toISOString().split('T')[0];
            dataPreenchimento.value = hoje;
        }

        const dataElaboracao = document.getElementById('data_elaboracao_pmo');
        if (dataElaboracao && !dataElaboracao.value) {
            const hoje = new Date().toISOString().split('T')[0];
            dataElaboracao.value = hoje;
        }
    },

    /**
     * Event Listeners
     */
    initEventListeners() {
        const form = document.getElementById(this.config.formId);

        if (!form) return;

        // Submit do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Detectar mudanças
        form.addEventListener('change', () => {
            this.markAsChanged();
            this.updateProgress();
        });

        form.addEventListener('input', () => {
            this.markAsChanged();
        });

        // Configurar auto-save ao navegar
        if (window.AutoSaveNavigation) {
            window.AutoSaveNavigation.setup({
                state: { isModified: false },
                salvar: (isAutoSave) => this.saveData(isAutoSave),
                get state() {
                    return { isModified: AnexoApicultura.state.hasChanges };
                }
            });
        }
    },

    /**
     * Carregar dados do PMO Principal
     */
    loadPMOPrincipal() {
        try {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (!pmo || !pmo.dados || !pmo.dados.cadastro_geral_pmo) {
                console.log('Nenhum dado do PMO Principal encontrado.');
                return;
            }

            const data = pmo.dados.cadastro_geral_pmo;
            const form = document.getElementById(this.config.formId);

            if (!form) return;

            // Preencher campos de identificação
            const nomeField = form.querySelector('[name="nome_fornecedor"]');
            if (nomeField && !nomeField.value) {
                nomeField.value = data.dados?.nome_completo || data.dados?.razao_social || '';
            }

            const grupoField = form.querySelector('[name="grupo_spg"]');
            if (grupoField && !grupoField.value && data.dados?.grupo_spg) {
                grupoField.value = data.dados.grupo_spg;
            }

            console.log('Dados do PMO Principal carregados.');
        } catch (error) {
            console.error('Erro ao carregar dados do PMO Principal:', error);
        }
    },

    /**
     * Salvar dados no localStorage
     */
    saveData(isAutoSave = false) {
        try {
            const form = document.getElementById(this.config.formId);
            const formData = new FormData(form);
            const dados = {};

            // Converter FormData para objeto
            for (let [key, value] of formData.entries()) {
                // Tratar arrays (campos com [index])
                if (key.includes('[')) {
                    const match = key.match(/(.+?)\[(\d+)\]\[(.+?)\]/);
                    if (match) {
                        const arrayName = match[1];
                        const index = parseInt(match[2]);
                        const fieldName = match[3];

                        if (!dados[arrayName]) {
                            dados[arrayName] = [];
                        }

                        if (!dados[arrayName][index]) {
                            dados[arrayName][index] = {};
                        }

                        dados[arrayName][index][fieldName] = value;
                    }
                } else {
                    dados[key] = value;
                }
            }

            // Adicionar checkboxes não marcados
            const checkboxes = form.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (!formData.has(checkbox.name)) {
                    dados[checkbox.name] = false;
                }
            });

            const data = {
                metadata: {
                    data_preenchimento: formData.get('data_preenchimento'),
                    ultima_atualizacao: new Date().toISOString(),
                    versao: '1.0'
                },
                dados: dados
            };

            // Salvar usando PMOStorageManager
            const pmo = window.PMOStorageManager.getActivePMO();
            if (!pmo) {
                console.warn('Nenhum PMO ativo. Crie o Cadastro Geral primeiro.');
                this.showNotification('Crie o Cadastro Geral PMO primeiro!', 'warning');
                return;
            }

            window.PMOStorageManager.updateFormulario(pmo.id, 'anexo_apicultura', data);

            this.state.lastSaved = new Date();
            this.state.hasChanges = false;

            // Notificação
            if (!isAutoSave) {
                this.showNotification('Dados salvos com sucesso!', 'success');
            }

            console.log('Dados salvos:', data);
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            this.showNotification('Erro ao salvar dados.', 'error');
        }
    },

    /**
     * Carregar dados do localStorage
     */
    loadData() {
        try {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (!pmo || !pmo.dados || !pmo.dados.anexo_apicultura) {
                console.log('Nenhum dado salvo encontrado.');
                return;
            }

            const savedData = pmo.dados.anexo_apicultura;
            const data = savedData.dados;
            const form = document.getElementById(this.config.formId);

            console.log(`✅ Dados carregados do PMO: ${pmo.id}`);

            // Preencher campos simples
            Object.keys(data).forEach(key => {
                if (typeof data[key] !== 'object') {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key];
                        } else if (field.type === 'radio') {
                            const radio = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                            if (radio) radio.checked = true;
                        } else {
                            field.value = data[key];
                        }
                    }
                }
            });

            // Preencher tabelas (arrays)
            Object.keys(data).forEach(key => {
                if (Array.isArray(data[key]) && data[key].length > 0) {
                    const tableId = `tabela-${key.replace(/_/g, '-')}`;
                    const table = document.getElementById(tableId);

                    if (table) {
                        const tbody = table.querySelector('tbody');
                        tbody.innerHTML = ''; // Limpar linhas existentes

                        data[key].forEach((rowData, index) => {
                            // Adicionar linha
                            this.table.addRow(tableId);

                            // Preencher dados da linha
                            Object.keys(rowData).forEach(fieldName => {
                                const field = form.querySelector(`[name="${key}[${index}][${fieldName}]"]`);
                                if (field) {
                                    field.value = rowData[fieldName];
                                }
                            });
                        });
                    }
                }
            });

            this.state.lastSaved = new Date(savedData.metadata.ultima_atualizacao);
            this.state.hasChanges = false;

            console.log('Dados carregados do localStorage');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    },

    /**
     * Auto-save periódico
     */
    initAutoSave() {
        setInterval(() => {
            if (this.state.hasChanges) {
                this.saveData();
                console.log('Auto-save executado');
            }
        }, this.config.autoSaveInterval);
    },

    /**
     * Marcar formulário como alterado
     */
    markAsChanged() {
        this.state.hasChanges = true;
    },

    /**
     * Calcular e atualizar progresso
     */
    updateProgress() {
        const form = document.getElementById(this.config.formId);
        if (!form) return;

        // Campos obrigatórios
        const requiredFields = form.querySelectorAll('[required]');
        let filledCount = 0;

        requiredFields.forEach(field => {
            if (field.type === 'checkbox') {
                if (field.checked) filledCount++;
            } else if (field.type === 'radio') {
                const radioGroup = form.querySelectorAll(`[name="${field.name}"]`);
                const isChecked = Array.from(radioGroup).some(r => r.checked);
                if (isChecked) filledCount++;
            } else {
                if (field.value.trim() !== '') filledCount++;
            }
        });

        const progress = Math.round((filledCount / requiredFields.length) * 100);

        // Atualizar barra de progresso
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (progressText) {
            progressText.textContent = `${progress}% Completo`;
        }

        // Atualizar progresso no PMOStorageManager
        const pmo = window.PMOStorageManager.getActivePMO();
        if (pmo) {
            window.PMOStorageManager.updateProgresso(pmo.id, 'anexo_apicultura', progress);
        }
    },

    /**
     * Validar formulário
     */
    validate() {
        const form = document.getElementById(this.config.formId);
        this.state.validationErrors = [];

        // Validações customizadas

        // 1. CPF
        const cpf = document.getElementById('cpf_apicultor');
        if (cpf && cpf.value && !this.validateCPF(cpf.value)) {
            this.state.validationErrors.push('CPF inválido');
        }

        // 2. Total de colmeias deve ser consistente
        const totalColmeias = parseInt(document.getElementById('total_colmeias')?.value || 0);
        const producao = parseInt(document.getElementById('colmeias_producao')?.value || 0);
        const nucleos = parseInt(document.getElementById('colmeias_nucleos')?.value || 0);
        const transicao = parseInt(document.getElementById('colmeias_transicao')?.value || 0);

        if (totalColmeias > 0 && (producao + nucleos + transicao) > totalColmeias) {
            this.state.validationErrors.push('A soma das colmeias por categoria não pode exceder o total');
        }

        // 3. Validar declarações obrigatórias
        const declaracoes = form.querySelectorAll('input[type="checkbox"][required]');
        const todasMarcadas = Array.from(declaracoes).every(cb => cb.checked);

        if (!todasMarcadas) {
            this.state.validationErrors.push('Todas as declarações obrigatórias devem ser marcadas');
        }

        // Validação HTML5
        const isValid = form.checkValidity();

        return isValid && this.state.validationErrors.length === 0;
    },

    /**
     * Validar CPF
     */
    validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cpf.charAt(10))) return false;

        return true;
    },

    /**
     * Submit do formulário
     */
    handleSubmit() {
        // Validar
        if (!this.validate()) {
            this.showNotification('Corrija os erros antes de enviar', 'error');

            if (this.state.validationErrors.length > 0) {
                alert('Erros encontrados:\n' + this.state.validationErrors.join('\n'));
            }
            return;
        }

        // Salvar dados
        this.saveData();

        // Exportar JSON
        this.exportJSON();

        // Notificação
        this.showNotification('Formulário enviado com sucesso!', 'success');

        // Marcar como não alterado
        this.state.hasChanges = false;
    },

    /**
     * Exportar JSON
     */
    exportJSON() {
        try {
            const savedData = localStorage.getItem(this.config.storageKey);

            if (!savedData) {
                this.showNotification('Nenhum dado para exportar', 'warning');
                return;
            }

            const data = JSON.parse(savedData);

            // Adicionar metadata
            const exportData = {
                metadata: {
                    tipo_documento: 'ANEXO_IV_APICULTURA',
                    data_exportacao: new Date().toISOString(),
                    versao_schema: '1.0'
                },
                dados: data
            };

            // Criar blob e download
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            const nomeProdutor = data.nome_fornecedor || 'produtor';
            const dataAtual = new Date().toISOString().split('T')[0];
            const filename = `anexo-apicultura-${nomeProdutor.replace(/\s+/g, '-').toLowerCase()}-${dataAtual}.json`;

            link.href = url;
            link.download = filename;
            link.click();

            URL.revokeObjectURL(url);

            this.showNotification('Dados exportados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar JSON:', error);
            this.showNotification('Erro ao exportar dados', 'error');
        }
    },

    /**
     * Mostrar notificação
     */
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    AnexoApicultura.init();
});
