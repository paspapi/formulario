/**
 * Processamento - Módulo JavaScript
 * Sistema PMO - ANC
 *
 * Seguindo o Prompt Universal para Formulários PMO
 * Produtos Transformados de Origem Vegetal e/ou Animal
 */

const AnexoProcessamento = {
    // Configuração
    config: {
        moduleName: 'processamento',
        storageKey: 'pmo_processamento',
        autoSaveInterval: 30000,
        version: '2.0'
    },

    state: {
        lastSaved: null,
        hasChanges: false,
        validationErrors: []
    },

    init() {
        console.log('Inicializando Processamento v' + this.config.version);
        this.setDefaultDate();
        this.loadSavedData();
        this.initDynamicTables();
        this.setupAutoSave();
        this.setupEventListeners();
        this.applyMasks();
        this.loadFromPMOPrincipal();
        this.calculateProgress();
        console.log('Processamento inicializado!');
    },

    setDefaultDate() {
        const dataField = document.getElementById('data_preenchimento');
        if (dataField && !dataField.value) {
            dataField.value = new Date().toISOString().split('T')[0];
        }
    },

    initDynamicTables() {
        ['tabela-produtos', 'tabela-etapas', 'tabela-higienizacao', 'tabela-etapas-fora'].forEach(tableId => {
            const tbody = document.querySelector(`#${tableId} tbody`);
            if (tbody && tbody.children.length === 0) this.table.addRow(tableId);
        });
    },

    table: {
        addRow(tableId) {
            const table = document.getElementById(tableId);
            if (!table) return;
            const tbody = table.querySelector('tbody');
            const rowCount = tbody.children.length;
            const newRow = document.createElement('tr');
            const templates = {
                'tabela-produtos': `<td class="row-number">${rowCount + 1}</td><td><input type="text" name="produto[]" class="full-width"></td><td><input type="text" name="descricao_produto[]" class="full-width"></td><td><input type="number" name="quantidade_mensal_produto[]" min="0" step="0.1" class="full-width"></td><td class="action-buttons"><button type="button" class="btn-icon" onclick="AnexoProcessamento.table.duplicateRow(this)">📋</button><button type="button" class="btn-icon btn-danger" onclick="AnexoProcessamento.table.removeRow(this)">🗑️</button></td>`,
                'tabela-etapas': `<td class="row-number">${rowCount + 1}</td><td><input type="text" name="etapa_processo[]" class="full-width"></td><td><input type="text" name="descricao_etapa[]" class="full-width"></td><td><input type="text" name="substancias_etapa[]" class="full-width"></td><td><input type="text" name="equipamentos_etapa[]" class="full-width"></td><td class="action-buttons"><button type="button" class="btn-icon" onclick="AnexoProcessamento.table.duplicateRow(this)">📋</button><button type="button" class="btn-icon btn-danger" onclick="AnexoProcessamento.table.removeRow(this)">🗑️</button></td>`,
                'tabela-higienizacao': `<td class="row-number">${rowCount + 1}</td><td><input type="text" name="marca_higienizacao[]" class="full-width"></td><td><input type="text" name="substancia_ativa[]" class="full-width"></td><td><input type="text" name="fabricante_higienizacao[]" class="full-width"></td><td><input type="text" name="quando_usar[]" class="full-width"></td><td class="action-buttons"><button type="button" class="btn-icon" onclick="AnexoProcessamento.table.duplicateRow(this)">📋</button><button type="button" class="btn-icon btn-danger" onclick="AnexoProcessamento.table.removeRow(this)">🗑️</button></td>`,
                'tabela-etapas-fora': `<td class="row-number">${rowCount + 1}</td><td><input type="text" name="etapa_externa[]" class="full-width"></td><td><input type="text" name="local_empresa[]" class="full-width"></td><td><input type="text" name="alvara_licenca[]" class="full-width"></td><td class="action-buttons"><button type="button" class="btn-icon" onclick="AnexoProcessamento.table.duplicateRow(this)">📋</button><button type="button" class="btn-icon btn-danger" onclick="AnexoProcessamento.table.removeRow(this)">🗑️</button></td>`
            };
            newRow.innerHTML = templates[tableId] || '';
            tbody.appendChild(newRow);
            AnexoProcessamento.markAsChanged();
        },
        removeRow(button) {
            const row = button.closest('tr');
            const tbody = row.parentElement;
            if (tbody.children.length <= 1) { PMONotify.warning('Deve haver pelo menos uma linha.'); return; }
            row.remove();
            this.updateRowNumbers(tbody);
            AnexoProcessamento.markAsChanged();
        },
        duplicateRow(button) {
            const row = button.closest('tr');
            const newRow = row.cloneNode(true);
            newRow.querySelectorAll('input').forEach(input => { if (input.type !== 'checkbox') input.value = ''; });
            row.parentElement.appendChild(newRow);
            this.updateRowNumbers(row.parentElement);
            AnexoProcessamento.markAsChanged();
        },
        updateRowNumbers(tbody) {
            Array.from(tbody.children).forEach((row, index) => {
                const numberCell = row.querySelector('.row-number');
                if (numberCell) numberCell.textContent = index + 1;
            });
        }
    },

    applyMasks() {
        const cnpjField = document.getElementById('cnpj_empresa');
        if (cnpjField) {
            cnpjField.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
                e.target.value = value;
            });
        }
    },

    setupEventListeners() {
        const form = document.getElementById('form-anexo-processamento');
        if (!form) return;
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('change', () => { this.markAsChanged(); this.calculateProgress(); });
        });
        form.addEventListener('submit', (e) => { e.preventDefault(); this.gerarPDF(); });

        // Configurar auto-save ao navegar
        if (window.AutoSaveNavigation) {
            window.AutoSaveNavigation.setup({
                state: { isModified: false },
                salvar: (isAutoSave) => this.salvar(isAutoSave),
                get state() {
                    return { isModified: AnexoProcessamento.state.hasChanges };
                }
            });
        }
    },

    markAsChanged() {
        this.state.hasChanges = true;
        const status = document.getElementById('auto-save-status');
        if (status) { status.textContent = '⚠️ Alterações não salvas'; status.style.color = 'var(--warning)'; }
    },

    setupAutoSave() {
        setInterval(() => { if (this.state.hasChanges) this.salvar(true); }, this.config.autoSaveInterval);
    },

    salvar(isAutoSave = false) {
        const form = document.getElementById('form-anexo-processamento');
        if (!form) return;
        const formData = new FormData(form);
        const data = { metadata: { tipo_documento: 'PROCESSAMENTO', versao_schema: '1.0', data_preenchimento: formData.get('data_preenchimento'), ultima_atualizacao: new Date().toISOString() }, dados: {} };
        for (let [key, value] of formData.entries()) {
            if (key.includes('[]')) {
                const cleanKey = key.replace('[]', '');
                if (!data.dados[cleanKey]) data.dados[cleanKey] = [];
                data.dados[cleanKey].push(value);
            } else data.dados[key] = value;
        }
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(data));
            this.state.lastSaved = new Date();
            this.state.hasChanges = false;
            const status = document.getElementById('auto-save-status');
            if (status) { status.textContent = isAutoSave ? '💾 Auto-save: ' + this.formatDate(this.state.lastSaved) : '✓ Salvo!'; status.style.color = 'var(--success)'; }
            if (!isAutoSave) PMONotify.success('Dados salvos com sucesso!');
        } catch (error) { console.error('Erro ao salvar:', error); PMONotify.error('Erro ao salvar dados.'); }
    },

    loadSavedData() {
        try {
            const savedData = localStorage.getItem(this.config.storageKey);
            if (!savedData) return;
            const data = JSON.parse(savedData);
            const form = document.getElementById('form-anexo-processamento');
            if (!form) return;
            for (let [key, value] of Object.entries(data.dados)) {
                if (Array.isArray(value)) {
                    const inputs = form.querySelectorAll(`[name="${key}[]"]`);
                    inputs.forEach((input, index) => { if (value[index] !== undefined) { if (input.type === 'checkbox') input.checked = value[index] === 'sim'; else input.value = value[index]; } });
                } else {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) { if (input.type === 'checkbox') input.checked = value === 'sim'; else input.value = value; }
                }
            }
            this.state.lastSaved = new Date(data.metadata.ultima_atualizacao);
            const status = document.getElementById('auto-save-status');
            if (status) { status.textContent = '💾 Último salvamento: ' + this.formatDate(this.state.lastSaved); status.style.color = 'var(--success)'; }
        } catch (error) { console.error('Erro ao carregar:', error); }
    },

    loadFromPMOPrincipal() {
        try {
            const pmoPrincipal = localStorage.getItem('pmo_principal_data');
            if (!pmoPrincipal) return;
            const data = JSON.parse(pmoPrincipal);
            const form = document.getElementById('form-anexo-processamento');
            if (!form) return;
            const razaoSocialField = form.querySelector('[name="razao_social"]');
            if (razaoSocialField && !razaoSocialField.value) razaoSocialField.value = data.razao_social || data.nome_completo || '';
            const cnpjField = form.querySelector('[name="cnpj_empresa"]');
            if (cnpjField && !cnpjField.value) cnpjField.value = data.cpf_cnpj || '';
        } catch (error) { console.error('Erro ao carregar PMO Principal:', error); }
    },

    validar() {
        const form = document.getElementById('form-anexo-processamento');
        if (!form) return false;
        this.state.validationErrors = [];
        if (!form.checkValidity()) { form.reportValidity(); return false; }
        const formData = new FormData(form);
        const produtos = formData.getAll('produto[]').filter(p => p);
        if (produtos.length === 0) this.state.validationErrors.push('É obrigatório cadastrar pelo menos um produto.');
        ['decl_nao_radiacao', 'decl_nao_duplicidade', 'decl_nao_transgenico', 'decl_conhece_legislacao', 'decl_rastreabilidade', 'decl_separacao_produtos', 'decl_autoriza_visitas', 'decl_veracidade'].forEach(decl => {
            if (!formData.get(decl)) this.state.validationErrors.push(`Declaração não marcada: ${decl.replace(/_/g, ' ').replace('decl ', '')}`);
        });
        this.showValidationReport();
        return this.state.validationErrors.length === 0;
    },

    showValidationReport() {
        const container = document.getElementById('validation-results');
        if (!container) return;
        if (this.state.validationErrors.length === 0) {
            container.innerHTML = '<div class="alert alert-success"><h3>✅ Formulário válido!</h3><p>Todos os campos obrigatórios foram preenchidos.</p></div>';
        } else {
            container.innerHTML = `<div class="alert alert-error"><h3>❌ Erros encontrados (${this.state.validationErrors.length})</h3><ul>${this.state.validationErrors.map(e => `<li>${e}</li>`).join('')}</ul></div>`;
        }
        container.scrollIntoView({ behavior: 'smooth' });
    },

    exportarJSON() {
        this.salvar();
        const data = localStorage.getItem(this.config.storageKey);
        if (!data) { PMONotify.warning('Nenhum dado para exportar.'); return; }
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `processamento-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        PMONotify.success('JSON exportado!');
    },

    gerarPDF() {
        if (!this.validar()) { PMONotify.error('Corrija os erros antes de gerar o PDF.'); return; }
        PMONotify.info('Gerando PDF... Em breve.');
    },

    calculateProgress() {
        const form = document.getElementById('form-anexo-processamento');
        if (!form) return;
        const requiredFields = form.querySelectorAll('[required]');
        let filled = 0;
        requiredFields.forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                const checked = form.querySelector(`[name="${field.name}"]:checked`);
                if (checked) filled++;
            } else if (field.value.trim() !== '') filled++;
        });
        const progress = Math.round((filled / requiredFields.length) * 100) || 0;
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        if (progressBar) progressBar.style.width = progress + '%';
        if (progressText) progressText.textContent = `${progress}% Completo`;
    },

    formatDate(date) {
        return new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
};

document.addEventListener('DOMContentLoaded', () => { AnexoProcessamento.init(); });
