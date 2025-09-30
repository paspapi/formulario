/**
 * PMO Principal - JavaScript
 * Módulo de gerenciamento do Plano de Manejo Orgânico Principal
 * @version 2.0
 * @author ANC - Associação de Agricultura Natural de Campinas e Região
 */

const PMOPrincipal = {
    // Configurações
    config: {
        moduleName: 'pmo-principal',
        storageKey: 'pmo_principal_data',
        autoSaveInterval: 30000, // 30 segundos
        version: '2.0'
    },

    // Estado do formulário
    state: {
        isModified: false,
        lastSaved: null,
        uploadedFiles: {}
    },

    /**
     * Inicialização do módulo
     */
    init() {
        console.log('✅ Inicializando PMO Principal...');

        // Carregar dados salvos
        this.loadSavedData();

        // Configurar auto-save
        this.setupAutoSave();

        // Configurar event listeners
        this.setupEventListeners();

        // Inicializar tabelas dinâmicas
        this.initDynamicTables();

        // Aplicar máscaras
        this.applyMasks();

        // Configurar data atual
        this.setCurrentDate();

        // Calcular progresso inicial
        this.calculateProgress();

        // Configurar campos condicionais
        this.setupConditionalFields();

        console.log('✅ PMO Principal inicializado com sucesso!');
    },

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('form-pmo-principal');
        if (!form) return;

        // Marcar como modificado em qualquer alteração
        form.addEventListener('change', () => {
            this.state.isModified = true;
            this.updateAutoSaveStatus('Há alterações não salvas');
            this.calculateProgress();
        });

        // Prevenir perda de dados ao sair
        window.addEventListener('beforeunload', (e) => {
            if (this.state.isModified) {
                e.preventDefault();
                e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
            }
        });

        // Submit do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Drag and drop para uploads
        this.setupDragAndDrop();
    },

    /**
     * Configurar campos condicionais
     */
    setupConditionalFields() {
        // Produção de Subsistência
        const subsistenciaRadios = document.getElementsByName('possui_subsistencia');
        subsistenciaRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const detalhes = document.getElementById('detalhes-subsistencia');
                if (detalhes) {
                    detalhes.style.display = e.target.value === 'sim' ? 'block' : 'none';
                }
            });
        });

        // Produção Paralela
        const paralelaRadios = document.getElementsByName('possui_producao_paralela');
        paralelaRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const detalhes = document.getElementById('detalhes-paralela');
                if (detalhes) {
                    detalhes.style.display = e.target.value === 'sim' ? 'block' : 'none';
                }
            });
        });

        // Vende produtos não orgânicos
        const vendeNaoOrganicosRadios = document.getElementsByName('vende_nao_organicos');
        vendeNaoOrganicosRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const separacao = document.getElementById('separacao-nao-organicos');
                if (separacao) {
                    separacao.style.display = e.target.value === 'sim' ? 'block' : 'none';
                }
            });
        });
    },

    /**
     * Configurar auto-save
     */
    setupAutoSave() {
        setInterval(() => {
            if (this.state.isModified) {
                this.salvar(true); // true = auto-save silencioso
            }
        }, this.config.autoSaveInterval);
    },

    /**
     * Atualizar status do auto-save
     */
    updateAutoSaveStatus(message) {
        const statusElement = document.getElementById('auto-save-status');
        if (statusElement) {
            statusElement.textContent = `💾 ${message}`;
        }
    },

    /**
     * Aplicar máscaras de entrada
     */
    applyMasks() {
        // Máscara CPF
        const cpfInputs = document.querySelectorAll('input[name="cpf"], input[name="cpf_responsavel[]"], input[name="cpf_declarante"]');
        cpfInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                e.target.value = value.substring(0, 14);
            });
        });

        // Máscara CNPJ
        const cnpjInputs = document.querySelectorAll('input[name="cnpj"]');
        cnpjInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                e.target.value = value.substring(0, 18);
            });
        });

        // Máscara CEP
        const cepInputs = document.querySelectorAll('input[name="cep"]');
        cepInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
                e.target.value = value.substring(0, 9);
            });
        });

        // Máscara Telefone
        const telefoneInputs = document.querySelectorAll('input[name="telefone"], input[name="telefone_responsavel[]"]');
        telefoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value.substring(0, 15);
            });
        });
    },

    /**
     * Buscar CEP
     */
    async buscarCEP() {
        const cepInput = document.getElementById('cep');
        if (!cepInput) return;

        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            alert('CEP inválido. Digite 8 dígitos.');
            return;
        }

        // Mostrar loading
        const btnBuscar = event.target;
        const originalText = btnBuscar.textContent;
        btnBuscar.textContent = '⏳';
        btnBuscar.disabled = true;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                alert('CEP não encontrado.');
                return;
            }

            // Preencher campos
            const logradouroInput = document.getElementById('logradouro');
            const bairroInput = document.getElementById('bairro');
            const cidadeInput = document.getElementById('cidade');
            const estadoInput = document.getElementById('estado');

            if (logradouroInput) logradouroInput.value = data.logradouro || '';
            if (bairroInput) bairroInput.value = data.bairro || '';
            if (cidadeInput) cidadeInput.value = data.localidade || '';
            if (estadoInput) estadoInput.value = data.uf || '';

            this.state.isModified = true;
            this.showMessage('Endereço preenchido automaticamente!', 'success');

        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Erro ao buscar CEP. Verifique sua conexão e tente novamente.');
        } finally {
            btnBuscar.textContent = originalText;
            btnBuscar.disabled = false;
        }
    },

    /**
     * Configurar data atual
     */
    setCurrentDate() {
        const dataDeclaracao = document.getElementById('data_declaracao');
        if (dataDeclaracao && !dataDeclaracao.value) {
            const today = new Date().toISOString().split('T')[0];
            dataDeclaracao.value = today;
        }
    },

    /**
     * Inicializar tabelas dinâmicas
     */
    initDynamicTables() {
        // As tabelas já têm uma linha de exemplo no template
        console.log('Tabelas dinâmicas inicializadas');
    },

    /**
     * Módulo de gerenciamento de tabelas dinâmicas
     */
    table: {
        /**
         * Adicionar linha na tabela
         */
        addRow(tableId) {
            const table = document.getElementById(tableId);
            if (!table) {
                console.error(`Tabela ${tableId} não encontrada`);
                return;
            }

            const tbody = table.querySelector('tbody');
            const template = tbody.querySelector('template');

            if (!template) {
                console.error(`Template não encontrado na tabela ${tableId}`);
                return;
            }

            const clone = template.content.cloneNode(true);

            // Atualizar numeração
            const rows = tbody.querySelectorAll('tr:not(template)');
            const rowNumber = clone.querySelector('.row-number');
            if (rowNumber) {
                rowNumber.textContent = rows.length + 1;
            }

            tbody.appendChild(clone);

            // Recalcular progresso
            if (window.PMOPrincipal) {
                PMOPrincipal.state.isModified = true;
                PMOPrincipal.calculateProgress();
            }
        },

        /**
         * Remover linha da tabela
         */
        removeRow(button) {
            const row = button.closest('tr');
            const tbody = row.closest('tbody');

            // Impedir remoção se for a última linha
            const rows = tbody.querySelectorAll('tr:not(template)');
            if (rows.length <= 1) {
                alert('Deve haver pelo menos uma linha na tabela.');
                return;
            }

            row.remove();

            // Atualizar numeração
            this.updateRowNumbers(tbody);

            // Recalcular progresso
            if (window.PMOPrincipal) {
                PMOPrincipal.state.isModified = true;
                PMOPrincipal.calculateProgress();
            }
        },

        /**
         * Duplicar linha da tabela
         */
        duplicateRow(button) {
            const row = button.closest('tr');
            const tbody = row.closest('tbody');
            const clone = row.cloneNode(true);

            // Limpar campos de texto clonados (mantém selects)
            clone.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], textarea').forEach(input => {
                input.value = '';
            });

            // Inserir após a linha atual
            row.after(clone);

            // Atualizar numeração
            this.updateRowNumbers(tbody);

            // Recalcular progresso
            if (window.PMOPrincipal) {
                PMOPrincipal.state.isModified = true;
                PMOPrincipal.calculateProgress();
            }
        },

        /**
         * Atualizar numeração das linhas
         */
        updateRowNumbers(tbody) {
            const rows = tbody.querySelectorAll('tr:not(template)');
            rows.forEach((row, index) => {
                const rowNumber = row.querySelector('.row-number');
                if (rowNumber) {
                    rowNumber.textContent = index + 1;
                }
            });
        }
    },

    /**
     * Configurar drag and drop para uploads
     */
    setupDragAndDrop() {
        const uploadAreas = document.querySelectorAll('.upload-area');

        uploadAreas.forEach(area => {
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('dragover');
            });

            area.addEventListener('dragleave', () => {
                area.classList.remove('dragover');
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('dragover');

                const fileInput = area.querySelector('input[type="file"]');
                if (fileInput && e.dataTransfer.files.length > 0) {
                    fileInput.files = e.dataTransfer.files;
                    this.handleFileUpload(fileInput);
                }
            });
        });

        // Listener para inputs de arquivo
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.handleFileUpload(input);
            });
        });
    },

    /**
     * Processar upload de arquivo
     */
    handleFileUpload(input) {
        const files = Array.from(input.files);
        const previewId = input.id.replace('file-', 'preview-');
        const previewContainer = document.getElementById(previewId);

        if (!previewContainer) return;

        files.forEach(file => {
            // Validar tamanho (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(`Arquivo ${file.name} muito grande. Máximo: 5MB`);
                return;
            }

            // Validar tipo
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                alert(`Arquivo ${file.name} não é permitido. Use PDF, JPG ou PNG.`);
                return;
            }

            // Criar preview
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item fade-in';

            const fileName = document.createElement('span');
            fileName.textContent = file.name;

            const fileSize = document.createElement('span');
            fileSize.className = 'file-size';
            fileSize.textContent = this.formatFileSize(file.size);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn btn-danger btn-sm';
            removeBtn.textContent = '🗑️ Remover';
            removeBtn.onclick = () => {
                fileItem.remove();
                delete this.state.uploadedFiles[file.name];
                input.value = '';
                this.state.isModified = true;
            };

            fileItem.appendChild(fileName);
            fileItem.appendChild(fileSize);
            fileItem.appendChild(removeBtn);
            previewContainer.appendChild(fileItem);

            // Converter para Base64 e armazenar
            const reader = new FileReader();
            reader.onload = (e) => {
                this.state.uploadedFiles[file.name] = {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: e.target.result
                };
                this.state.isModified = true;
            };
            reader.readAsDataURL(file);
        });
    },

    /**
     * Formatar tamanho de arquivo
     */
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    /**
     * Calcular progresso do preenchimento
     */
    calculateProgress() {
        const form = document.getElementById('form-pmo-principal');
        if (!form) return;

        const requiredFields = form.querySelectorAll('[required]');
        let filledCount = 0;
        let totalCount = requiredFields.length;

        requiredFields.forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                const name = field.name;
                const checked = form.querySelector(`[name="${name}"]:checked`);
                if (checked) filledCount++;
            } else if (field.value.trim() !== '') {
                filledCount++;
            }
        });

        const percentage = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;

        // Atualizar UI
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `Progresso: ${percentage}%`;
    },

    /**
     * Salvar dados no localStorage
     */
    salvar(isAutoSave = false) {
        const form = document.getElementById('form-pmo-principal');
        if (!form) return;

        const formData = new FormData(form);
        const data = {};

        // Converter FormData para objeto
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Se já existe, transformar em array
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Adicionar arquivos uploadados
        data.uploadedFiles = this.state.uploadedFiles;

        // Salvar no localStorage
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(data));
            this.state.lastSaved = new Date();
            this.state.isModified = false;

            if (!isAutoSave) {
                this.showMessage('Rascunho salvo com sucesso!', 'success');
            }

            this.updateAutoSaveStatus(`Salvo em ${new Date().toLocaleTimeString()}`);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            if (!isAutoSave) {
                this.showMessage('Erro ao salvar rascunho.', 'error');
            }
        }
    },

    /**
     * Carregar dados salvos
     */
    loadSavedData() {
        try {
            const savedData = localStorage.getItem(this.config.storageKey);
            if (!savedData) return;

            const data = JSON.parse(savedData);
            const form = document.getElementById('form-pmo-principal');
            if (!form) return;

            // Preencher campos
            Object.keys(data).forEach(key => {
                if (key === 'uploadedFiles') {
                    this.state.uploadedFiles = data[key];
                    return;
                }

                const elements = form.querySelectorAll(`[name="${key}"]`);
                elements.forEach(element => {
                    if (element.type === 'checkbox') {
                        element.checked = Array.isArray(data[key]) ?
                            data[key].includes(element.value) :
                            data[key] === element.value;
                    } else if (element.type === 'radio') {
                        element.checked = data[key] === element.value;
                    } else {
                        element.value = data[key];
                    }
                });
            });

            this.updateAutoSaveStatus(`Dados recuperados`);
            this.calculateProgress();

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    },

    /**
     * Validar formulário
     */
    validar() {
        const resultsContainer = document.getElementById('validation-results');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '<div class="alert alert-info">⏳ Validando formulário...</div>';

        // Simular delay para parecer processamento
        setTimeout(() => {
            const result = window.PMOValidationRules ?
                window.PMOValidationRules.validateComplete() :
                this.basicValidation();

            this.displayValidationResults(result, resultsContainer);
        }, 500);
    },

    /**
     * Validação básica (fallback se validation-rules.js não estiver carregado)
     */
    basicValidation() {
        const form = document.getElementById('form-pmo-principal');
        const errors = [];
        const warnings = [];

        // Verificar campos obrigatórios
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                const name = field.name;
                const checked = form.querySelector(`[name="${name}"]:checked`);
                if (!checked) {
                    errors.push(`Campo obrigatório não preenchido: ${field.closest('.form-group')?.querySelector('label')?.textContent || name}`);
                }
            } else if (!field.value.trim()) {
                errors.push(`Campo obrigatório não preenchido: ${field.closest('.form-group')?.querySelector('label')?.textContent || field.name}`);
            }
        });

        return { errors, warnings };
    },

    /**
     * Exibir resultados da validação
     */
    displayValidationResults(result, container) {
        container.innerHTML = '';

        if (result.errors.length === 0 && result.warnings.length === 0) {
            container.innerHTML = `
                <div class="validation-success fade-in">
                    <h3>✅ Formulário Válido!</h3>
                    <p>Todos os campos obrigatórios foram preenchidos corretamente.</p>
                    <p>Você pode enviar o PMO clicando em "Enviar PMO".</p>
                </div>
            `;
            return;
        }

        if (result.errors.length > 0) {
            const errorsHtml = `
                <div class="validation-errors fade-in">
                    <h3>❌ Erros Encontrados (${result.errors.length})</h3>
                    <ul class="errors-list">
                        ${result.errors.map(err => `<li>${err}</li>`).join('')}
                    </ul>
                </div>
            `;
            container.innerHTML += errorsHtml;
        }

        if (result.warnings.length > 0) {
            const warningsHtml = `
                <div class="validation-warnings fade-in">
                    <h3>⚠️ Avisos (${result.warnings.length})</h3>
                    <ul class="warnings-list">
                        ${result.warnings.map(warn => `<li>${warn}</li>`).join('')}
                    </ul>
                    <p><em>Avisos não impedem o envio, mas recomenda-se corrigir.</em></p>
                </div>
            `;
            container.innerHTML += warningsHtml;
        }

        // Scroll até os resultados
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    /**
     * Exportar dados como JSON
     */
    exportarJSON() {
        const form = document.getElementById('form-pmo-principal');
        if (!form) return;

        const formData = new FormData(form);
        const data = {
            metadata: {
                id_produtor: formData.get('cpf') || formData.get('cnpj') || '',
                tipo_documento: ['pmo-principal'],
                data_extracao: new Date().toISOString(),
                versao_schema: '1.0',
                grupo_spg: 'ANC',
                status_processamento: 'PREENCHIDO'
            },
            dados: {}
        };

        // Converter todos os campos
        for (let [key, value] of formData.entries()) {
            if (data.dados[key]) {
                if (Array.isArray(data.dados[key])) {
                    data.dados[key].push(value);
                } else {
                    data.dados[key] = [data.dados[key], value];
                }
            } else {
                data.dados[key] = value;
            }
        }

        // Adicionar arquivos
        data.arquivos = this.state.uploadedFiles;

        // Download
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pmo-principal-${data.metadata.id_produtor}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showMessage('JSON exportado com sucesso!', 'success');
    },

    /**
     * Submeter formulário
     */
    submitForm() {
        // Validar primeiro
        const result = window.PMOValidationRules ?
            window.PMOValidationRules.validateComplete() :
            this.basicValidation();

        if (result.errors.length > 0) {
            alert('Há erros no formulário. Por favor, corrija-os antes de enviar.');
            this.validar(); // Mostrar erros
            return;
        }

        if (confirm('Deseja realmente enviar o PMO? Certifique-se de que todas as informações estão corretas.')) {
            // Salvar antes de enviar
            this.salvar();

            // Simular envio
            this.showMessage('PMO enviado com sucesso! Aguarde contato da certificadora.', 'success');

            // Em produção, aqui seria feito o envio real
            console.log('PMO enviado:', this.collectFormData());
        }
    },

    /**
     * Coletar dados do formulário
     */
    collectFormData() {
        const form = document.getElementById('form-pmo-principal');
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        return data;
    },

    /**
     * Mostrar mensagem
     */
    showMessage(message, type = 'info') {
        // Criar elemento de mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `message alert alert-${type} fade-in`;
        messageDiv.textContent = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.zIndex = '10000';
        messageDiv.style.maxWidth = '400px';

        // Adicionar ao body
        document.body.appendChild(messageDiv);

        // Remover após 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    PMOPrincipal.init();
});

// Expor globalmente
window.PMOPrincipal = PMOPrincipal;