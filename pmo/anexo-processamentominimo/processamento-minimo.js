/**
 * Processamento Mínimo - Módulo JavaScript
 * Sistema PMO - ANC
 *
 * Seguindo o Prompt Universal para Formulários PMO
 */

const ProcessamentoMinimo = {
    // Configuração
    config: {
        moduleName: 'processamento-minimo',
        storageKey: 'pmo_processamento_minimo',
        autoSaveInterval: 30000, // 30 segundos
        version: '2.0'
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
        console.log('Inicializando Processamento Mínimo v' + this.config.version);

        // Definir data padrão
        this.setDefaultDate();

        // Carregar dados salvos
        this.loadSavedData();

        // Inicializar tabelas dinâmicas
        this.initDynamicTables();

        // Configurar auto-save
        this.setupAutoSave();

        // Event listeners
        this.setupEventListeners();

        // Aplicar máscaras
        this.applyMasks();

        // Carregar dados do PMO Principal
        this.loadFromPMOPrincipal();

        // Calcular progresso inicial
        this.calculateProgress();

        console.log('Processamento Mínimo inicializado com sucesso!');
    },

    /**
     * Definir data padrão
     */
    setDefaultDate() {
        const dataField = document.getElementById('data_preenchimento');
        if (dataField && !dataField.value) {
            dataField.value = new Date().toISOString().split('T')[0];
        }
    },

    /**
     * Inicializar tabelas dinâmicas
     */
    initDynamicTables() {
        const tables = [
            'tabela-responsaveis',
            'tabela-funcionarios',
            'tabela-produtos',
            'tabela-etapas-externas',
            'tabela-substancias-lavagem',
            'tabela-fornecedores'
        ];

        tables.forEach(tableId => {
            const tbody = document.querySelector(`#${tableId} tbody`);
            if (tbody && tbody.children.length === 0) {
                this.table.addRow(tableId);
            }
        });
    },

    /**
     * Sistema de tabelas dinâmicas - usa PMOTable
     */
    table: {
        addRow(tableId) {
            const table = document.getElementById(tableId);
            if (!table) return;

            const tbody = table.querySelector('tbody');
            const rowCount = tbody.children.length;
            const newRow = document.createElement('tr');

            // Templates específicos para cada tabela
            const templates = {
                'tabela-responsaveis': `
                    <td class="row-number">${rowCount + 1}</td>
                    <td><input type="text" name="responsavel_nome[]" class="full-width" required></td>
                    <td><input type="text" name="responsavel_cpf[]" class="full-width" data-mask="cpf" required></td>
                    <td><input type="date" name="responsavel_data_nasc[]" class="full-width"></td>
                    <td class="action-buttons">
                        <button type="button" class="btn-icon" onclick="ProcessamentoMinimo.table.duplicateRow(this)" title="Duplicar">📋</button>
                        <button type="button" class="btn-icon btn-danger" onclick="ProcessamentoMinimo.table.removeRow(this)" title="Remover">🗑️</button>
                    </td>
                `,
                'tabela-funcionarios': `
                    <td class="row-number">${rowCount + 1}</td>
                    <td>
                        <select name="func_tipo[]" class="full-width">
                            <option value="">Selecione...</option>
                            <option value="FAMILIAR">Familiar</option>
                            <option value="EMPREGADO">Empregado</option>
                            <option value="DIARISTA">Diarista</option>
                            <option value="PARCEIRO">Parceiro</option>
                            <option value="MEEIRO">Meeiro Rural</option>
                        </select>
                    </td>
                    <td><input type="number" name="func_quantidade[]" class="full-width" min="0" value="0"></td>
                    <td><input type="text" name="func_funcao[]" class="full-width"></td>
                    <td>
                        <select name="func_capacitacao[]" class="full-width">
                            <option value="NAO">Não</option>
                            <option value="SIM">Sim</option>
                        </select>
                    </td>
                    <td class="action-buttons">
                        <button type="button" class="btn-icon" onclick="ProcessamentoMinimo.table.duplicateRow(this)" title="Duplicar">📋</button>
                        <button type="button" class="btn-icon btn-danger" onclick="ProcessamentoMinimo.table.removeRow(this)" title="Remover">🗑️</button>
                    </td>
                `,
                'tabela-produtos': `
                    <td class="row-number">${rowCount + 1}</td>
                    <td><input type="text" name="produto_nome[]" class="full-width" required></td>
                    <td><input type="text" name="produto_conteudo[]" class="full-width"></td>
                    <td><input type="text" name="produto_descricao[]" class="full-width"></td>
                    <td><input type="number" name="produto_producao_mensal[]" class="full-width" min="0" step="0.1"></td>
                    <td><input type="text" name="produto_tipo[]" class="full-width"></td>
                    <td><input type="text" name="produto_embalagem[]" class="full-width"></td>
                    <td class="action-buttons">
                        <button type="button" class="btn-icon" onclick="ProcessamentoMinimo.table.duplicateRow(this)" title="Duplicar">📋</button>
                        <button type="button" class="btn-icon btn-danger" onclick="ProcessamentoMinimo.table.removeRow(this)" title="Remover">🗑️</button>
                    </td>
                `,
                'tabela-etapas-externas': `
                    <td class="row-number">${rowCount + 1}</td>
                    <td><input type="text" name="externa_etapa[]" class="full-width"></td>
                    <td><input type="text" name="externa_local[]" class="full-width"></td>
                    <td><input type="text" name="externa_endereco[]" class="full-width"></td>
                    <td><input type="text" name="externa_responsavel[]" class="full-width"></td>
                    <td>
                        <select name="externa_certificacao[]" class="full-width">
                            <option value="NAO">Não</option>
                            <option value="SIM">Sim</option>
                        </select>
                    </td>
                    <td class="action-buttons">
                        <button type="button" class="btn-icon" onclick="ProcessamentoMinimo.table.duplicateRow(this)" title="Duplicar">📋</button>
                        <button type="button" class="btn-icon btn-danger" onclick="ProcessamentoMinimo.table.removeRow(this)" title="Remover">🗑️</button>
                    </td>
                `,
                'tabela-substancias-lavagem': `
                    <td class="row-number">${rowCount + 1}</td>
                    <td><input type="text" name="lavagem_substancia[]" class="full-width"></td>
                    <td><input type="text" name="lavagem_marca[]" class="full-width"></td>
                    <td><input type="text" name="lavagem_concentracao[]" class="full-width"></td>
                    <td><input type="text" name="lavagem_tempo[]" class="full-width"></td>
                    <td>
                        <select name="lavagem_permitida[]" class="full-width">
                            <option value="NAO">Não</option>
                            <option value="SIM">Sim</option>
                        </select>
                    </td>
                    <td class="action-buttons">
                        <button type="button" class="btn-icon" onclick="ProcessamentoMinimo.table.duplicateRow(this)" title="Duplicar">📋</button>
                        <button type="button" class="btn-icon btn-danger" onclick="ProcessamentoMinimo.table.removeRow(this)" title="Remover">🗑️</button>
                    </td>
                `,
                'tabela-fornecedores': `
                    <td class="row-number">${rowCount + 1}</td>
                    <td><input type="text" name="forn_nome[]" class="full-width" required></td>
                    <td><input type="text" name="forn_cpf_cnpj[]" class="full-width" data-mask="cnpj"></td>
                    <td><input type="text" name="forn_cidade_uf[]" class="full-width"></td>
                    <td><input type="text" name="forn_produtos[]" class="full-width"></td>
                    <td><input type="number" name="forn_volume[]" class="full-width" min="0" step="0.1"></td>
                    <td>
                        <select name="forn_certificacao[]" class="full-width">
                            <option value="NAO">Não</option>
                            <option value="SIM">Sim</option>
                        </select>
                    </td>
                    <td class="action-buttons">
                        <button type="button" class="btn-icon" onclick="ProcessamentoMinimo.table.duplicateRow(this)" title="Duplicar">📋</button>
                        <button type="button" class="btn-icon btn-danger" onclick="ProcessamentoMinimo.table.removeRow(this)" title="Remover">🗑️</button>
                    </td>
                `
            };

            newRow.innerHTML = templates[tableId] || '';
            tbody.appendChild(newRow);

            // Aplicar máscaras nos novos campos
            ProcessamentoMinimo.applyMasks();
            ProcessamentoMinimo.markAsChanged();
        },

        removeRow(button) {
            const row = button.closest('tr');
            const tbody = row.parentElement;

            if (tbody.children.length <= 1) {
                PMONotify.warning('Deve haver pelo menos uma linha na tabela.');
                return;
            }

            row.remove();
            this.updateRowNumbers(tbody);
            ProcessamentoMinimo.markAsChanged();
        },

        duplicateRow(button) {
            const row = button.closest('tr');
            const newRow = row.cloneNode(true);

            // Limpar valores (exceto selects mantém a opção)
            newRow.querySelectorAll('input:not([type="hidden"])').forEach(input => {
                if (input.type !== 'checkbox' && input.type !== 'radio') {
                    input.value = '';
                }
            });

            row.parentElement.appendChild(newRow);
            this.updateRowNumbers(row.parentElement);
            ProcessamentoMinimo.markAsChanged();
        },

        updateRowNumbers(tbody) {
            Array.from(tbody.children).forEach((row, index) => {
                const numberCell = row.querySelector('.row-number');
                if (numberCell) {
                    numberCell.textContent = index + 1;
                }
            });
        }
    },

    /**
     * Toggle de seções condicionais
     */
    toggleEtapasExternas(checkbox) {
        const container = document.getElementById('etapas-externas-container');
        if (container) {
            container.style.display = checkbox.checked ? 'block' : 'none';
        }
        this.markAsChanged();
    },

    toggleEtapa(checkbox, etapaId) {
        const content = document.getElementById(`etapa-${etapaId}`);
        if (content) {
            content.style.display = checkbox.checked ? 'block' : 'none';
        }
        this.markAsChanged();
    },

    toggleProducaoParalela(checkbox) {
        const container = document.getElementById('producao-paralela-container');
        if (container) {
            container.style.display = checkbox.checked ? 'block' : 'none';
        }
        this.markAsChanged();
    },

    /**
     * Aplicar máscaras de entrada
     */
    applyMasks() {
        // CPF
        document.querySelectorAll('[data-mask="cpf"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value.substring(0, 14);
            });
        });

        // CNPJ/CPF híbrido
        document.querySelectorAll('[data-mask="cnpj"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');

                if (value.length <= 11) {
                    // CPF
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                } else {
                    // CNPJ
                    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                    value = value.replace(/(\d{4})(\d)/, '$1-$2');
                }

                e.target.value = value;
            });
        });

        // CEP
        document.querySelectorAll('[data-mask="cep"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                e.target.value = value.substring(0, 9);
            });
        });
    },

    /**
     * Event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('form-processamento-minimo');
        if (!form) return;

        // Marcar mudanças em todos os campos
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('change', () => {
                this.markAsChanged();
                this.calculateProgress();
            });
        });

        // Submit do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.gerarPDF();
        });

        // Configurar auto-save ao navegar
        if (window.AutoSaveNavigation) {
            window.AutoSaveNavigation.setup({
                state: { isModified: false },
                salvar: (isAutoSave) => this.salvar(isAutoSave),
                get state() {
                    return { isModified: ProcessamentoMinimo.state.hasChanges };
                }
            });
        }
    },

    /**
     * Marcar formulário como alterado
     */
    markAsChanged() {
        this.state.hasChanges = true;
        const status = document.getElementById('auto-save-status');
        if (status) {
            status.textContent = '⚠️ Alterações não salvas';
            status.style.color = 'var(--warning)';
        }
    },

    /**
     * Auto-save
     */
    setupAutoSave() {
        setInterval(() => {
            if (this.state.hasChanges) {
                this.salvar(true);
            }
        }, this.config.autoSaveInterval);
    },

    /**
     * Salvar dados
     */
    salvar(isAutoSave = false) {
        const form = document.getElementById('form-processamento-minimo');
        if (!form) return;

        const formData = new FormData(form);
        const data = {
            metadata: {
                tipo_documento: 'PROCESSAMENTO_MINIMO',
                versao_schema: '1.0',
                data_preenchimento: formData.get('data_preenchimento'),
                ultima_atualizacao: new Date().toISOString()
            },
            dados: {}
        };

        // Coletar todos os dados
        for (let [key, value] of formData.entries()) {
            if (key.includes('[]')) {
                const cleanKey = key.replace('[]', '');
                if (!data.dados[cleanKey]) {
                    data.dados[cleanKey] = [];
                }
                data.dados[cleanKey].push(value);
            } else {
                data.dados[key] = value;
            }
        }

        try {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (!pmo) { console.warn('Nenhum PMO ativo.'); PMONotify.warning('Crie o Cadastro Geral PMO primeiro!'); return; }
            window.PMOStorageManager.updateFormulario(pmo.id, 'anexo_processamento_minimo', data);
            this.state.lastSaved = new Date();
            this.state.hasChanges = false;

            const status = document.getElementById('auto-save-status');
            if (status) {
                const msg = isAutoSave
                    ? '💾 Auto-save: ' + this.formatDate(this.state.lastSaved)
                    : '✓ Salvo com sucesso!';
                status.textContent = msg;
                status.style.color = 'var(--success)';
            }

            if (!isAutoSave) {
                PMONotify.success('Dados salvos com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            PMONotify.error('Erro ao salvar dados. Verifique o espaço disponível.');
        }
    },

    /**
     * Carregar dados salvos
     */
    loadSavedData() {
        try {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (!pmo || !pmo.dados || !pmo.dados.anexo_processamento_minimo) { console.log('Nenhum dado salvo.'); return; }
            const data = pmo.dados.anexo_processamento_minimo;
            const form = document.getElementById('form-processamento-minimo');
            if (!form) return;
            console.log(`✅ Dados carregados do PMO: ${pmo.id}`);

            // Preencher campos
            for (let [key, value] of Object.entries(data.dados)) {
                if (Array.isArray(value)) {
                    const inputs = form.querySelectorAll(`[name="${key}[]"]`);
                    inputs.forEach((input, index) => {
                        if (value[index] !== undefined) {
                            if (input.type === 'checkbox') {
                                input.checked = value[index] === 'sim' || value[index] === true;
                            } else {
                                input.value = value[index];
                            }
                        }
                    });
                } else {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = value === 'sim' || value === true;
                        } else {
                            input.value = value;
                        }
                    }
                }
            }

            this.state.lastSaved = new Date(data.metadata.ultima_atualizacao);
            const status = document.getElementById('auto-save-status');
            if (status) {
                status.textContent = '💾 Último salvamento: ' + this.formatDate(this.state.lastSaved);
                status.style.color = 'var(--success)';
            }

            console.log('Dados carregados com sucesso!');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    },

    /**
     * Carregar do PMO Principal
     */
    loadFromPMOPrincipal() {
        try {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (!pmo || !pmo.dados || !pmo.dados.cadastro_geral_pmo) { console.log('Nenhum dado do PMO Principal.'); return; }
            const data = pmo.dados.cadastro_geral_pmo.dados;
            const form = document.getElementById('form-processamento-minimo');
            if (!form) return;

            // Preencher campos comuns
            const mapping = {
                'razao_social': data?.razao_social || data?.nome_completo,
                'cnpj_produtor': data?.cpf_cnpj,
                'telefone': data?.telefone,
                'email': data?.email
            };

            for (let [field, value] of Object.entries(mapping)) {
                const input = form.querySelector(`[name="${field}"]`);
                if (input && !input.value && value) {
                    input.value = value;
                }
            }

            PMONotify.info('Dados carregados do PMO Principal');
        } catch (error) {
            console.error('Erro ao carregar PMO Principal:', error);
        }
    },

    /**
     * Validar formulário
     */
    validar() {
        const form = document.getElementById('form-processamento-minimo');
        if (!form) return false;

        this.state.validationErrors = [];

        // Validação HTML5
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        const formData = new FormData(form);

        // Validações customizadas
        const produtos = formData.getAll('produto_nome[]').filter(p => p);
        if (produtos.length === 0) {
            this.state.validationErrors.push('É obrigatório cadastrar pelo menos um produto.');
        }

        // Declarações obrigatórias
        const declaracoes = [
            'decl_nao_radiacao',
            'decl_nao_microondas',
            'decl_nao_nanotecnologia',
            'decl_nao_duplicidade',
            'decl_nao_transgenicos',
            'decl_conhece_legislacao'
        ];

        declaracoes.forEach(decl => {
            if (!formData.get(decl)) {
                this.state.validationErrors.push(`Declaração obrigatória não marcada: ${decl.replace(/_/g, ' ').replace('decl ', '')}`);
            }
        });

        this.showValidationReport();
        return this.state.validationErrors.length === 0;
    },

    /**
     * Exibir relatório de validação
     */
    showValidationReport() {
        const container = document.getElementById('validation-results');
        if (!container) return;

        if (this.state.validationErrors.length === 0) {
            container.innerHTML = `
                <div class="alert alert-success">
                    <h3>✅ Formulário válido!</h3>
                    <p>Todos os campos obrigatórios foram preenchidos corretamente.</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="alert alert-error">
                    <h3>❌ Erros encontrados (${this.state.validationErrors.length})</h3>
                    <ul>${this.state.validationErrors.map(e => `<li>${e}</li>`).join('')}</ul>
                </div>
            `;
        }

        container.scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Exportar JSON
     */
    exportarJSON() {
        this.salvar();
        const data = localStorage.getItem(this.config.storageKey);
        if (!data) {
            PMONotify.warning('Nenhum dado para exportar.');
            return;
        }

        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `processamento-minimo-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        PMONotify.success('JSON exportado com sucesso!');
    },

    /**
     * Gerar PDF
     */
    gerarPDF() {
        if (!this.validar()) {
            PMONotify.error('Corrija os erros antes de gerar o PDF.');
            return;
        }

        PMONotify.info('Gerando PDF... Esta funcionalidade será implementada em breve.');
    },

    /**
     * Calcular progresso
     */
    calculateProgress() {
        const form = document.getElementById('form-processamento-minimo');
        if (!form) return;

        const requiredFields = form.querySelectorAll('[required]');
        let filled = 0;

        requiredFields.forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                const name = field.name;
                const checked = form.querySelector(`[name="${name}"]:checked`);
                if (checked) filled++;
            } else {
                if (field.value.trim() !== '') filled++;
            }
        });

        const progress = Math.round((filled / requiredFields.length) * 100) || 0;

        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (progressBar) progressBar.style.width = progress + '%';
        if (progressText) progressText.textContent = `${progress}% Completo`;

        const pmo = window.PMOStorageManager.getActivePMO();
        if (pmo) window.PMOStorageManager.updateProgresso(pmo.id, 'anexo_processamento_minimo', progress);
    },

    /**
     * Formatar data
     */
    formatDate(date) {
        return new Date(date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    ProcessamentoMinimo.init();
});
