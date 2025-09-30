/**
 * Anexo Animal - Módulo JavaScript
 * Sistema PMO - ANC
 *
 * Lógica específica para o Anexo III - Produção Animal
 */

const AnexoAnimal = {
    // Configuração
    config: {
        formId: 'form-anexo-animal',
        storageKey: 'pmo_anexo_animal',
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
        console.log('Inicializando Anexo Animal...');

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

        console.log('Anexo Animal inicializado com sucesso!');
    },

    /**
     * Inicializar tabelas dinâmicas
     */
    initTables() {
        const tables = [
            'tabela-especies',
            'tabela-plano-alimentar',
            'tabela-prevencao',
            'tabela-tratamentos',
            'tabela-vacinacao',
            'tabela-origem-animais',
            'tabela-instalacoes'
        ];

        tables.forEach(tableId => {
            this.table.addRow(tableId);
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
            if (!table) {
                console.error(`Tabela ${tableId} não encontrada`);
                return;
            }

            const tbody = table.querySelector('tbody');
            const template = document.getElementById(`row-template-${tableId}`);

            if (!template) {
                console.error(`Template da tabela ${tableId} não encontrado`);
                return;
            }

            // Clonar template
            const newRow = template.content.cloneNode(true);
            const tr = newRow.querySelector('tr');

            // Atualizar número da linha
            const rowNumber = tbody.querySelectorAll('tr').length + 1;
            newRow.querySelector('.row-number').textContent = rowNumber;

            // Adicionar à tabela
            tbody.appendChild(newRow);

            // Renumerar linhas
            this.renumberRows(tableId);

            // Marcar mudança
            AnexoAnimal.markAsChanged();
        },

        /**
         * Remover linha da tabela
         */
        removeRow(button) {
            const tr = button.closest('tr');
            const tbody = tr.closest('tbody');
            const table = tbody.closest('table');

            // Não permitir remover se for a única linha
            const rows = tbody.querySelectorAll('tr');
            if (rows.length <= 1) {
                alert('Não é possível remover a única linha da tabela.');
                return;
            }

            // Confirmar remoção
            if (confirm('Deseja realmente remover esta linha?')) {
                tr.remove();
                this.renumberRows(table.id);
                AnexoAnimal.markAsChanged();
            }
        },

        /**
         * Duplicar linha da tabela
         */
        duplicateRow(button) {
            const tr = button.closest('tr');
            const tbody = tr.closest('tbody');
            const table = tbody.closest('table');

            // Clonar linha
            const newRow = tr.cloneNode(true);

            // Inserir após a linha atual
            tr.after(newRow);

            // Renumerar linhas
            this.renumberRows(table.id);

            // Marcar mudança
            AnexoAnimal.markAsChanged();
        },

        /**
         * Renumerar linhas da tabela
         */
        renumberRows(tableId) {
            const table = document.getElementById(tableId);
            if (!table) return;

            const rows = table.querySelectorAll('tbody tr');
            rows.forEach((row, index) => {
                const numberCell = row.querySelector('.row-number');
                if (numberCell) {
                    numberCell.textContent = index + 1;
                }
            });
        }
    },

    /**
     * Toggle de campos condicionais
     */
    toggleInspecao(radio) {
        const detalhes = document.getElementById('detalhes-inspecao');
        if (radio.value === 'sim') {
            detalhes.style.display = 'block';
            // Marcar campos como required
            detalhes.querySelectorAll('select[name="tipo_inspecao"]').forEach(el => {
                el.setAttribute('required', 'required');
            });
        } else {
            detalhes.style.display = 'none';
            // Remover required
            detalhes.querySelectorAll('[required]').forEach(el => {
                el.removeAttribute('required');
            });
        }
        this.markAsChanged();
    },

    togglePastagem(radio) {
        const detalhes = document.getElementById('detalhes-pastagem');
        if (radio.value === 'sim') {
            detalhes.style.display = 'block';
        } else {
            detalhes.style.display = 'none';
        }
        this.markAsChanged();
    },

    toggleReproducaoArtificial(radio) {
        const detalhes = document.getElementById('detalhes-reproducao-artificial');
        if (radio.value === 'sim') {
            detalhes.style.display = 'block';
        } else {
            detalhes.style.display = 'none';
        }
        this.markAsChanged();
    },

    /**
     * Event listeners
     */
    initEventListeners() {
        const form = document.getElementById(this.config.formId);
        if (!form) return;

        // Marcar mudanças em todos os campos
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('change', () => {
                this.markAsChanged();
                this.updateProgress();
            });
        });

        // Submit do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.gerarPDF();
        });
    },

    /**
     * Máscaras de campos
     */
    initMasks() {
        // CPF
        document.querySelectorAll('[data-mask="cpf"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
        });
    },

    /**
     * Marcar formulário como alterado
     */
    markAsChanged() {
        this.state.hasChanges = true;
        const status = document.getElementById('auto-save-status');
        if (status) {
            status.textContent = '⚠️ Alterações não salvas';
            status.style.color = '#f59e0b';
        }
    },

    /**
     * Auto-save
     */
    initAutoSave() {
        setInterval(() => {
            if (this.state.hasChanges) {
                this.salvar(true);
            }
        }, this.config.autoSaveInterval);
    },

    /**
     * Salvar dados no localStorage
     */
    salvar(isAutoSave = false) {
        const form = document.getElementById(this.config.formId);
        if (!form) return;

        const formData = new FormData(form);
        const data = {
            metadata: {
                data_preenchimento: formData.get('data_preenchimento'),
                ultima_atualizacao: new Date().toISOString(),
                versao: '1.0'
            },
            dados: {}
        };

        // Coletar todos os dados do formulário
        for (let [key, value] of formData.entries()) {
            // Arrays (campos com [])
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

        // Salvar no localStorage
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(data));
            this.state.lastSaved = new Date();
            this.state.hasChanges = false;

            const status = document.getElementById('auto-save-status');
            if (status) {
                status.textContent = isAutoSave ? '💾 Auto-save: ' + this.formatDate(this.state.lastSaved) : '✓ Salvo com sucesso!';
                status.style.color = '#10b981';
            }

            if (!isAutoSave) {
                this.showMessage('Dados salvos com sucesso!', 'success');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            this.showMessage('Erro ao salvar dados. Verifique o espaço disponível.', 'error');
        }
    },

    /**
     * Carregar dados do localStorage
     */
    loadData() {
        try {
            const savedData = localStorage.getItem(this.config.storageKey);
            if (!savedData) return;

            const data = JSON.parse(savedData);
            const form = document.getElementById(this.config.formId);
            if (!form) return;

            // Preencher campos
            for (let [key, value] of Object.entries(data.dados)) {
                // Arrays
                if (Array.isArray(value)) {
                    const inputs = form.querySelectorAll(`[name="${key}[]"]`);
                    inputs.forEach((input, index) => {
                        if (value[index] !== undefined) {
                            if (input.type === 'checkbox' || input.type === 'radio') {
                                input.checked = input.value === value[index];
                            } else {
                                input.value = value[index];
                            }
                        }
                    });
                } else {
                    // Campos únicos
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = value === 'sim' || value === true;
                        } else if (input.type === 'radio') {
                            const radio = form.querySelector(`[name="${key}"][value="${value}"]`);
                            if (radio) radio.checked = true;
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
            }

            console.log('Dados carregados com sucesso!');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    },

    /**
     * Carregar dados do PMO Principal
     */
    loadPMOPrincipal() {
        try {
            // Chave correta do localStorage do PMO Principal
            const pmoPrincipal = localStorage.getItem('pmo_principal_data');
            if (!pmoPrincipal) {
                console.log('Nenhum dado do PMO Principal encontrado.');
                return;
            }

            const data = JSON.parse(pmoPrincipal);
            const form = document.getElementById(this.config.formId);

            if (!form) return;

            // Preencher campos de identificação
            // Nome do fornecedor (pode vir de nome_completo ou razão social)
            const nomeField = form.querySelector('[name="nome_fornecedor"]');
            if (nomeField && !nomeField.value) {
                nomeField.value = data.nome_completo || data.razao_social || '';
                console.log('Nome do fornecedor preenchido:', nomeField.value);
            }

            // Nome da unidade
            const unidadeField = form.querySelector('[name="nome_unidade_producao"]');
            if (unidadeField && !unidadeField.value) {
                unidadeField.value = data.nome_unidade_producao || '';
                console.log('Nome da unidade preenchido:', unidadeField.value);
            }

            // Data de preenchimento
            const dataField = form.querySelector('[name="data_preenchimento"]');
            if (dataField && !dataField.value) {
                const today = new Date().toISOString().split('T')[0];
                dataField.value = today;
            }

            // Grupo SPG (pode tentar preencher se disponível)
            const grupoField = form.querySelector('[name="grupo_spg"]');
            if (grupoField && !grupoField.value && data.grupo_spg) {
                grupoField.value = data.grupo_spg;
            }

            this.showMessage('Dados carregados do PMO Principal!', 'info');
        } catch (error) {
            console.error('Erro ao carregar dados do PMO Principal:', error);
            this.showMessage('Aviso: Não foi possível carregar dados do PMO Principal.', 'warning');
        }
    },

    /**
     * Validar formulário
     */
    validar() {
        const form = document.getElementById(this.config.formId);
        if (!form) return false;

        this.state.validationErrors = [];
        const warnings = [];

        // Validação nativa HTML5
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        // Validações customizadas
        const formData = new FormData(form);

        // 1. Verificar se pelo menos uma espécie foi cadastrada
        const especies = formData.getAll('especie[]').filter(e => e);
        if (especies.length === 0) {
            this.state.validationErrors.push('É obrigatório cadastrar pelo menos uma espécie animal.');
        }

        // 2. Verificar declarações obrigatórias
        const declaracoesObrigatorias = [
            'conhece_legislacao_organica',
            'cumpre_normas_bem_estar',
            'nao_usa_hormonios_crescimento',
            'nao_usa_antibioticos_preventivos',
            'nao_usa_urea_sintetica',
            'nao_usa_organismos_transgenicos',
            'respeita_periodo_carencia',
            'mantem_registros_atualizados',
            'autoriza_visitas_verificacao',
            'declara_veracidade_informacoes'
        ];

        declaracoesObrigatorias.forEach(decl => {
            if (!formData.get(decl)) {
                this.state.validationErrors.push(`Declaração obrigatória não marcada: ${decl.replace(/_/g, ' ')}`);
            }
        });

        // 3. Avisos (não bloqueantes)
        const possuiInspecao = formData.get('possui_inspecao_sanitaria');
        if (possuiInspecao === 'nao') {
            warnings.push('Atenção: Para comercializar produtos de origem animal, é obrigatória a inspeção sanitária.');
        }

        // Exibir resultados
        this.showValidationReport(this.state.validationErrors, warnings);

        return this.state.validationErrors.length === 0;
    },

    /**
     * Exibir relatório de validação
     */
    showValidationReport(errors, warnings) {
        const container = document.getElementById('validation-results');
        if (!container) return;

        container.innerHTML = '';

        if (errors.length === 0 && warnings.length === 0) {
            container.innerHTML = `
                <div class="alert alert-success">
                    <h3>✅ Formulário válido!</h3>
                    <p>Todos os campos obrigatórios foram preenchidos corretamente.</p>
                </div>
            `;
            return;
        }

        let html = '<div class="validation-report">';

        if (errors.length > 0) {
            html += `
                <div class="alert alert-danger">
                    <h3>❌ Erros encontrados (${errors.length})</h3>
                    <ul>
                        ${errors.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (warnings.length > 0) {
            html += `
                <div class="alert alert-warning">
                    <h3>⚠️ Avisos (${warnings.length})</h3>
                    <ul>
                        ${warnings.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;

        // Scroll para o topo
        container.scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Exportar para JSON
     */
    exportarJSON() {
        const form = document.getElementById(this.config.formId);
        if (!form) return;

        const formData = new FormData(form);
        const data = {
            metadata: {
                tipo_documento: 'ANEXO_III_ANIMAL',
                versao_schema: '1.0',
                data_exportacao: new Date().toISOString()
            },
            dados: {}
        };

        // Coletar dados
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

        // Download JSON
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anexo-animal-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showMessage('JSON exportado com sucesso!', 'success');
    },

    /**
     * Gerar PDF
     */
    gerarPDF() {
        // Validar antes de gerar
        if (!this.validar()) {
            this.showMessage('Corrija os erros antes de gerar o PDF.', 'error');
            return;
        }

        this.showMessage('Gerando PDF... Esta funcionalidade será implementada em breve.', 'info');

        // TODO: Implementar geração de PDF usando jsPDF
    },

    /**
     * Calcular e atualizar progresso
     */
    updateProgress() {
        const form = document.getElementById(this.config.formId);
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

        const progress = Math.round((filled / requiredFields.length) * 100);

        // Atualizar UI
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressFill) {
            progressFill.style.width = progress + '%';
        }

        if (progressText) {
            progressText.textContent = `Progresso: ${progress}%`;
        }
    },

    /**
     * Mostrar mensagem ao usuário
     */
    showMessage(message, type = 'info') {
        // Criar elemento de mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type}`;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.zIndex = '9999';
        messageDiv.style.minWidth = '300px';
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        // Remover após 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
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

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    AnexoAnimal.init();
});

// Alertar sobre mudanças não salvas ao sair
window.addEventListener('beforeunload', (e) => {
    if (AnexoAnimal.state.hasChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
        return e.returnValue;
    }
});
