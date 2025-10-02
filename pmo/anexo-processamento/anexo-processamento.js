/**
 * Anexo Processamento Mínimo - Módulo JavaScript
 * Sistema PMO - ANC
 *
 * Lógica específica para o Anexo VI - Processamento Mínimo
 */

const AnexoProcessamento = {
    // Configuração
    config: {
        formId: 'form-anexo-processamento',
        storageKey: 'pmo_anexo_processamento',
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
        console.log('Inicializando Anexo Processamento Mínimo...');

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

        // Definir data atual
        this.setDefaultDate();

        console.log('Anexo Processamento Mínimo inicializado com sucesso!');
    },

    /**
     * Definir data padrão
     */
    setDefaultDate() {
        const dataField = document.getElementById('data_preenchimento');
        if (dataField && !dataField.value) {
            const today = new Date().toISOString().split('T')[0];
            dataField.value = today;
        }
    },

    /**
     * Inicializar tabelas dinâmicas
     */
    initTables() {
        const tables = [
            'tabela-produtos',
            'tabela-etapas',
            'tabela-higienizacao',
            'tabela-etapas-fora'
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
        /**
         * Adicionar linha à tabela
         */
        addRow(tableId) {
            const table = document.getElementById(tableId);
            if (!table) return;

            const tbody = table.querySelector('tbody');
            const rowCount = tbody.children.length;
            const newRow = document.createElement('tr');

            // Templates para cada tabela
            const templates = {
                'tabela-produtos': `
                    <td class="row-number">${rowCount + 1}</td>
                    <td><input type="text" name="produto[]" class="full-width"></td>
                    <td><input type="text" name="descricao_produto[]" class="full-width"></td>
                    <td><input type="number" name="quantidade_mensal_produto[]" min="0" step="0.1" class="full-width"></td>
                    <td class="action-buttons">
                        <button type="button" class="btn-icon" onclick="AnexoProcessamento.table.duplicateRow(this)" title="Duplicar">📋</button>
                        <button type="button" class="btn-icon btn-danger" onclick="AnexoProcessamento.table.removeRow(this)" title="Remover">🗑️</button>
                    </td>
                `,
                'tabela-etapas': `
                    <td class="row-number">${rowCount + 1}</td>
                    <td><input type="text" name="etapa_processo[]" class="full-width"></td>
                    <td><input type="text" name="descricao_etapa[]" class="full-width"></td>
                    <td><input type="text" name="substancias_etapa[]" class="full-width"></td>
                    <td><input type="text" name="equipamentos_etapa[]" class="full-width"></td>
                    <td class="action-buttons">
                        <button type="button" class="btn-icon" onclick="AnexoProcessamento.table.duplicateRow(this)" title="Duplicar">📋</button>
                        <button type="button" class="btn-icon btn-danger" onclick="AnexoProcessamento.table.removeRow(this)" title="Remover">🗑️</button>
                    </td>
                `,
                'tabela-higienizacao': `
                    <td class="row-number">${rowCount + 1}</td>
                    <td><input type="text" name="marca_higienizacao[]" class="full-width"></td>
                    <td><input type="text" name="substancia_ativa[]" class="full-width"></td>
                    <td><input type="text" name="fabricante_higienizacao[]" class="full-width"></td>
                    <td><input type="text" name="quando_usar[]" class="full-width"></td>
                    <td class="action-buttons">
                        <button type="button" class="btn-icon" onclick="AnexoProcessamento.table.duplicateRow(this)" title="Duplicar">📋</button>
                        <button type="button" class="btn-icon btn-danger" onclick="AnexoProcessamento.table.removeRow(this)" title="Remover">🗑️</button>
                    </td>
                `,
                'tabela-etapas-fora': `
                    <td class="row-number">${rowCount + 1}</td>
                    <td><input type="text" name="etapa_externa[]" class="full-width"></td>
                    <td><input type="text" name="local_empresa[]" class="full-width"></td>
                    <td><input type="text" name="alvara_licenca[]" class="full-width"></td>
                    <td class="action-buttons">
                        <button type="button" class="btn-icon" onclick="AnexoProcessamento.table.duplicateRow(this)" title="Duplicar">📋</button>
                        <button type="button" class="btn-icon btn-danger" onclick="AnexoProcessamento.table.removeRow(this)" title="Remover">🗑️</button>
                    </td>
                `
            };

            newRow.innerHTML = templates[tableId] || '';
            tbody.appendChild(newRow);

            AnexoProcessamento.markAsChanged();
        },

        /**
         * Remover linha da tabela
         */
        removeRow(button) {
            const row = button.closest('tr');
            const tbody = row.parentElement;

            if (tbody.children.length <= 1) {
                alert('Deve haver pelo menos uma linha na tabela.');
                return;
            }

            row.remove();
            this.updateRowNumbers(tbody);
            AnexoProcessamento.markAsChanged();
        },

        /**
         * Duplicar linha da tabela
         */
        duplicateRow(button) {
            const row = button.closest('tr');
            const newRow = row.cloneNode(true);

            // Limpar valores dos inputs clonados (exceto se for select)
            newRow.querySelectorAll('input').forEach(input => {
                if (input.type !== 'checkbox' && input.type !== 'radio') {
                    input.value = '';
                }
            });

            row.parentElement.appendChild(newRow);
            this.updateRowNumbers(row.parentElement);
            AnexoProcessamento.markAsChanged();
        },

        /**
         * Renumerar linhas da tabela
         */
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
        // CNPJ
        const cnpjField = document.getElementById('cnpj_empresa');
        if (cnpjField) {
            cnpjField.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
                e.target.value = value;
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
                tipo_documento: 'ANEXO_VI_PROCESSAMENTO_MINIMO',
                versao_schema: '1.0',
                data_preenchimento: formData.get('data_preenchimento'),
                ultima_atualizacao: new Date().toISOString()
            },
            processamento_minimo: {
                geral: {},
                situacao_legal: [],
                produtos: [],
                etapas_realizadas: [],
                higienizacao: [],
                controles: [],
                mao_obra: [],
                etapas_fora_unidade: [],
                declaracoes: {}
            }
        };

        // Dados gerais
        data.processamento_minimo.geral = {
            razao_social: formData.get('razao_social'),
            cnpj_empresa: formData.get('cnpj_empresa'),
            inscricao_estadual: formData.get('inscricao_estadual'),
            inscricao_municipal: formData.get('inscricao_municipal'),
            endereco_processamento: formData.get('endereco_processamento'),
            local_proprio_arrendado: formData.get('local_proprio_arrendado'),
            numero_funcionarios: parseInt(formData.get('numero_funcionarios')) || 0,
            coordenadas: {
                latitude: parseFloat(formData.get('latitude')) || 0,
                longitude: parseFloat(formData.get('longitude')) || 0
            }
        };

        // Situação legal (checkboxes)
        const docsLegais = [
            'doc_ciencia_obrigacoes',
            'doc_alvara_funcionamento',
            'doc_processo_vigilancia',
            'doc_licenca_sanitaria_sp',
            'doc_licenca_sanitaria_outro',
            'doc_cnae_dispensado',
            'doc_analise_agua',
            'doc_manual_boas_praticas'
        ];

        docsLegais.forEach(doc => {
            if (formData.get(doc)) {
                data.processamento_minimo.situacao_legal.push({
                    documento: doc,
                    possui: true
                });
            }
        });

        // Produtos
        const produtos = formData.getAll('produto[]');
        produtos.forEach((produto, index) => {
            if (produto) {
                data.processamento_minimo.produtos.push({
                    produto: produto,
                    descricao: formData.getAll('descricao_produto[]')[index],
                    quantidade_mensal_kg: parseFloat(formData.getAll('quantidade_mensal_produto[]')[index]) || 0
                });
            }
        });

        // Etapas do processamento
        const etapas = formData.getAll('etapa_processo[]');
        etapas.forEach((etapa, index) => {
            if (etapa) {
                data.processamento_minimo.etapas_realizadas.push({
                    etapa_processo: etapa,
                    descricao_etapa: formData.getAll('descricao_etapa[]')[index],
                    substancias_utilizadas: formData.getAll('substancias_etapa[]')[index],
                    equipamentos_utilizados: formData.getAll('equipamentos_etapa[]')[index]
                });
            }
        });

        // Produtos de higienização
        const marcas = formData.getAll('marca_higienizacao[]');
        marcas.forEach((marca, index) => {
            if (marca) {
                data.processamento_minimo.higienizacao.push({
                    marca_nome_comercial: marca,
                    substancia_ativa: formData.getAll('substancia_ativa[]')[index],
                    fabricante: formData.getAll('fabricante_higienizacao[]')[index],
                    quando_usar: formData.getAll('quando_usar[]')[index]
                });
            }
        });

        // Controles
        data.processamento_minimo.controles = [
            {
                atividade: 'ENTRADA DE INGREDIENTES / COMPRAS',
                metodo_controle: formData.get('controle_entrada_ingredientes')
            },
            {
                atividade: 'CONTROLE DE ESTOQUE DOS INGREDIENTES/MATÉRIAS PRIMAS',
                metodo_controle: formData.get('controle_estoque_ingredientes')
            },
            {
                atividade: 'PROCESSAMENTO',
                metodo_controle: formData.get('controle_processamento')
            },
            {
                atividade: 'CONTROLE DE ESTOQUE DO PRODUTO FINAL PARA VENDA',
                metodo_controle: formData.get('controle_estoque_final')
            },
            {
                atividade: 'VENDA DE PRODUTOS',
                metodo_controle: formData.get('controle_venda_produtos')
            },
            {
                atividade: 'COMPRA DE INSUMOS / PRODUTOS HIGIENIZAÇÃO',
                metodo_controle: formData.get('controle_compra_insumos')
            }
        ];

        // Mão de obra
        data.processamento_minimo.mao_obra = [
            {
                tipo_funcionario: 'FAMILIAR',
                quantidade_funcionarios: parseInt(formData.get('func_familiar')) || 0
            },
            {
                tipo_funcionario: 'EMPREGADOS',
                quantidade_funcionarios: parseInt(formData.get('func_empregados')) || 0
            },
            {
                tipo_funcionario: 'DIARISTAS',
                quantidade_funcionarios: parseInt(formData.get('func_diaristas')) || 0
            },
            {
                tipo_funcionario: 'PARCEIROS',
                quantidade_funcionarios: parseInt(formData.get('func_parceiros')) || 0
            },
            {
                tipo_funcionario: 'MEEIRO RURAL',
                quantidade_funcionarios: parseInt(formData.get('func_meeiro')) || 0
            }
        ];

        // Etapas fora da unidade
        const etapasExternas = formData.getAll('etapa_externa[]');
        etapasExternas.forEach((etapa, index) => {
            if (etapa) {
                data.processamento_minimo.etapas_fora_unidade.push({
                    etapa: etapa,
                    local_fora_unidade: formData.getAll('local_empresa[]')[index],
                    alvara_funcionamento: formData.getAll('alvara_licenca[]')[index]
                });
            }
        });

        // Declarações
        data.processamento_minimo.declaracoes = {
            nao_usa_radiacao: formData.get('decl_nao_radiacao') === 'sim',
            nao_duplicidade_ingredientes: formData.get('decl_nao_duplicidade') === 'sim',
            nao_usa_transgenicos: formData.get('decl_nao_transgenico') === 'sim',
            conhece_legislacao: formData.get('decl_conhece_legislacao') === 'sim',
            mantem_rastreabilidade: formData.get('decl_rastreabilidade') === 'sim',
            separacao_produtos: formData.get('decl_separacao_produtos') === 'sim',
            autoriza_visitas: formData.get('decl_autoriza_visitas') === 'sim',
            declara_veracidade: formData.get('decl_veracidade') === 'sim'
        };

        // Observações
        data.observacoes = formData.get('observacoes');

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

            // Carregar dados gerais
            const geral = data.processamento_minimo?.geral || {};
            Object.keys(geral).forEach(key => {
                if (key === 'coordenadas') {
                    if (geral.coordenadas.latitude) {
                        form.querySelector('[name="latitude"]').value = geral.coordenadas.latitude;
                    }
                    if (geral.coordenadas.longitude) {
                        form.querySelector('[name="longitude"]').value = geral.coordenadas.longitude;
                    }
                } else {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) field.value = geral[key];
                }
            });

            // Carregar situação legal
            if (data.processamento_minimo?.situacao_legal) {
                data.processamento_minimo.situacao_legal.forEach(doc => {
                    const checkbox = form.querySelector(`[name="${doc.documento}"]`);
                    if (checkbox && doc.possui) {
                        checkbox.checked = true;
                    }
                });
            }

            // Carregar declarações
            if (data.processamento_minimo?.declaracoes) {
                const decl = data.processamento_minimo.declaracoes;
                if (decl.nao_usa_radiacao) form.querySelector('[name="decl_nao_radiacao"]').checked = true;
                if (decl.nao_duplicidade_ingredientes) form.querySelector('[name="decl_nao_duplicidade"]').checked = true;
                if (decl.nao_usa_transgenicos) form.querySelector('[name="decl_nao_transgenico"]').checked = true;
                if (decl.conhece_legislacao) form.querySelector('[name="decl_conhece_legislacao"]').checked = true;
                if (decl.mantem_rastreabilidade) form.querySelector('[name="decl_rastreabilidade"]').checked = true;
                if (decl.separacao_produtos) form.querySelector('[name="decl_separacao_produtos"]').checked = true;
                if (decl.autoriza_visitas) form.querySelector('[name="decl_autoriza_visitas"]').checked = true;
                if (decl.declara_veracidade) form.querySelector('[name="decl_veracidade"]').checked = true;
            }

            // Observações
            if (data.observacoes) {
                form.querySelector('[name="observacoes"]').value = data.observacoes;
            }

            // Atualizar status
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
            const pmoPrincipal = localStorage.getItem('pmo_principal_data');
            if (!pmoPrincipal) {
                console.log('Nenhum dado do PMO Principal encontrado.');
                return;
            }

            const data = JSON.parse(pmoPrincipal);
            const form = document.getElementById(this.config.formId);
            if (!form) return;

            // Preencher razão social se disponível
            const razaoSocialField = form.querySelector('[name="razao_social"]');
            if (razaoSocialField && !razaoSocialField.value) {
                razaoSocialField.value = data.razao_social || data.nome_completo || '';
            }

            // Preencher CNPJ se disponível
            const cnpjField = form.querySelector('[name="cnpj_empresa"]');
            if (cnpjField && !cnpjField.value) {
                cnpjField.value = data.cpf_cnpj || '';
            }

            console.log('Dados do PMO Principal carregados!');
        } catch (error) {
            console.error('Erro ao carregar dados do PMO Principal:', error);
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

        const formData = new FormData(form);

        // 1. Verificar se pelo menos um produto foi cadastrado
        const produtos = formData.getAll('produto[]').filter(p => p);
        if (produtos.length === 0) {
            this.state.validationErrors.push('É obrigatório cadastrar pelo menos um produto processado.');
        }

        // 2. Verificar declarações obrigatórias
        const declaracoesObrigatorias = [
            'decl_nao_radiacao',
            'decl_nao_duplicidade',
            'decl_nao_transgenico',
            'decl_conhece_legislacao',
            'decl_rastreabilidade',
            'decl_separacao_produtos',
            'decl_autoriza_visitas',
            'decl_veracidade'
        ];

        declaracoesObrigatorias.forEach(decl => {
            if (!formData.get(decl)) {
                this.state.validationErrors.push(`Declaração obrigatória não marcada: ${decl.replace(/_/g, ' ').replace('decl ', '')}`);
            }
        });

        // 3. Avisos (não bloqueantes)
        if (!formData.get('doc_manual_boas_praticas')) {
            warnings.push('Recomenda-se possuir o Manual de Boas Práticas de Fabricação.');
        }

        if (!formData.get('doc_analise_agua')) {
            warnings.push('É importante ter análise atualizada da qualidade da água.');
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
                <div class="alert alert-error">
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

        // Scroll para o resultado
        container.scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Exportar para JSON
     */
    exportarJSON() {
        // Salvar antes de exportar
        this.salvar();

        const savedData = localStorage.getItem(this.config.storageKey);
        if (!savedData) {
            this.showMessage('Nenhum dado para exportar.', 'warning');
            return;
        }

        const data = JSON.parse(savedData);
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anexo-processamento-minimo-${new Date().toISOString().split('T')[0]}.json`;
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
        const counted = new Set();

        requiredFields.forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                const name = field.name;
                if (!counted.has(name)) {
                    counted.add(name);
                    const checked = form.querySelector(`[name="${name}"]:checked`);
                    if (checked) filled++;
                }
            } else {
                if (field.value.trim() !== '') filled++;
            }
        });

        const progress = requiredFields.length > 0 ? Math.round((filled / counted.size) * 100) : 0;

        // Atualizar UI
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (progressBar) {
            progressBar.style.width = progress + '%';
        }

        if (progressText) {
            progressText.textContent = `${progress}% Completo`;
        }
    },

    /**
     * Mostrar mensagem ao usuário
     */
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type}`;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.zIndex = '9999';
        messageDiv.style.minWidth = '300px';
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

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
    AnexoProcessamento.init();
});

// Alertar sobre mudanças não salvas ao sair
window.addEventListener('beforeunload', (e) => {
    if (AnexoProcessamento.state.hasChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
        return e.returnValue;
    }
});
