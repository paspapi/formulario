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
        console.log('=€ Inicializando PMO Principal...');

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

        console.log(' PMO Principal inicializado com sucesso!');
    },

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('form-pmo-principal');

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
            statusElement.textContent = `=¾ ${message}`;
        }
    },

    /**
     * Inicializar tabelas dinâmicas
     */
    initDynamicTables() {
        const tables = [
            'tabela-responsaveis',
            'tabela-historico',
            'tabela-produtos',
            'tabela-recursos-hidricos'
        ];

        tables.forEach(tableId => {
            // Adicionar primeira linha automaticamente
            this.table.addRow(tableId);
        });
    },

    /**
     * Gerenciamento de tabelas dinâmicas
     */
    table: {
        /**
         * Adicionar linha em tabela dinâmica
         */
        addRow(tableId) {
            const tbody = document.getElementById(`tbody-${tableId.replace('tabela-', '')}`);
            const template = document.getElementById(`row-template-${tableId.replace('tabela-', '')}`);

            if (!tbody || !template) {
                console.error(`Tabela ou template não encontrado: ${tableId}`);
                return;
            }

            // Clonar template
            const clone = template.content.cloneNode(true);
            const row = clone.querySelector('tr');

            // Atualizar número da linha
            const rowNumber = tbody.querySelectorAll('tr').length + 1;
            const rowNumberCell = clone.querySelector('.row-number');
            if (rowNumberCell) {
                rowNumberCell.textContent = rowNumber;
            }

            // Adicionar linha
            tbody.appendChild(clone);

            // Aplicar máscaras nos novos inputs
            PMOPrincipal.applyMasks();

            // Renumerar linhas
            this.renumberRows(tableId);

            console.log(` Linha adicionada na tabela ${tableId}`);
        },

        /**
         * Remover linha de tabela dinâmica
         */
        removeRow(button) {
            const row = button.closest('tr');
            const tbody = row.parentElement;
            const table = row.closest('table');

            // Não permitir remover se for a única linha
            if (tbody.querySelectorAll('tr').length <= 1) {
                alert('  É necessário manter pelo menos uma linha.');
                return;
            }

            // Confirmar remoção
            if (confirm('Deseja realmente remover esta linha?')) {
                row.remove();
                this.renumberRows(table.id);
                PMOPrincipal.state.isModified = true;
                PMOPrincipal.calculateProgress();
                console.log(' Linha removida');
            }
        },

        /**
         * Duplicar linha
         */
        duplicateRow(button) {
            const row = button.closest('tr');
            const tbody = row.parentElement;
            const table = row.closest('table');

            // Clonar a linha
            const clone = row.cloneNode(true);

            // Limpar valores (exceto selects)
            clone.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], input[type="tel"], input[type="email"], textarea').forEach(input => {
                // Manter o valor para facilitar o preenchimento
                // input.value = '';
            });

            // Adicionar ao tbody
            tbody.appendChild(clone);

            // Renumerar linhas
            this.renumberRows(table.id);

            PMOPrincipal.state.isModified = true;
            console.log(' Linha duplicada');
        },

        /**
         * Renumerar linhas da tabela
         */
        renumberRows(tableId) {
            const tbody = document.querySelector(`#${tableId} tbody`);
            if (!tbody) return;

            const rows = tbody.querySelectorAll('tr');
            rows.forEach((row, index) => {
                const numberCell = row.querySelector('.row-number');
                if (numberCell) {
                    numberCell.textContent = index + 1;
                }
            });
        }
    },

    /**
     * Aplicar máscaras em campos
     */
    applyMasks() {
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

        // CNPJ
        document.querySelectorAll('[data-mask="cnpj"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
                e.target.value = value;
            });
        });

        // CEP
        document.querySelectorAll('[data-mask="cep"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            });
        });

        // Telefone
        document.querySelectorAll('[data-mask="telefone"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                    value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{4})(\d)/, '$1-$2');
                } else {
                    value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
                e.target.value = value;
            });
        });
    },

    /**
     * Toggle tipo de pessoa (CPF/CNPJ)
     */
    togglePessoaTipo() {
        const tipoPessoa = document.getElementById('tipo_pessoa').value;
        const campoCPF = document.getElementById('campo-cpf');
        const campoCNPJ = document.getElementById('campo-cnpj');
        const inputCPF = document.getElementById('cpf');
        const inputCNPJ = document.getElementById('cnpj');

        if (tipoPessoa === 'fisica') {
            campoCPF.style.display = 'block';
            campoCNPJ.style.display = 'none';
            inputCPF.required = true;
            inputCNPJ.required = false;
            inputCNPJ.value = '';
        } else if (tipoPessoa === 'juridica') {
            campoCPF.style.display = 'none';
            campoCNPJ.style.display = 'block';
            inputCPF.required = false;
            inputCNPJ.required = true;
            inputCPF.value = '';
        } else {
            campoCPF.style.display = 'none';
            campoCNPJ.style.display = 'none';
            inputCPF.required = false;
            inputCNPJ.required = false;
        }
    },

    /**
     * Buscar CEP via ViaCEP
     */
    async buscarCEP() {
        const cepInput = document.getElementById('cep');
        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            alert('  CEP inválido! Digite 8 dígitos.');
            return;
        }

        try {
            // Mostrar loading
            this.showMessage('= Buscando CEP...', 'info');

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                throw new Error('CEP não encontrado');
            }

            // Preencher campos
            document.getElementById('endereco').value = `${data.logradouro}`;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('municipio').value = data.localidade;
            document.getElementById('uf').value = data.uf;

            this.showMessage(' Endereço encontrado!', 'success');
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            this.showMessage('L Erro ao buscar CEP. Verifique o número digitado.', 'error');
        }
    },

    /**
     * Toggle CAF
     */
    toggleCAF(checkbox) {
        const cafInput = document.getElementById('caf_numero');
        if (checkbox.checked) {
            cafInput.disabled = true;
            cafInput.value = '';
            cafInput.required = false;
        } else {
            cafInput.disabled = false;
            cafInput.required = false;
        }
    },

    /**
     * Toggle CAR
     */
    toggleCAR(select) {
        const campoSituacao = document.getElementById('campo-situacao-car');
        const situacaoSelect = document.getElementById('situacao_car');

        if (select.value === 'sim') {
            campoSituacao.style.display = 'block';
            situacaoSelect.required = true;
        } else {
            campoSituacao.style.display = 'none';
            situacaoSelect.required = false;
            situacaoSelect.value = '';
        }
    },

    /**
     * Toggle área de atividade
     */
    toggleAreaInput(checkbox, areaId) {
        const areaDiv = document.getElementById(areaId);
        const areaInput = areaDiv.querySelector('input');

        if (checkbox.checked) {
            areaDiv.style.display = 'block';
            areaInput.required = true;
        } else {
            areaDiv.style.display = 'none';
            areaInput.required = false;
            areaInput.value = '';
        }
    },

    /**
     * Toggle histórico
     */
    toggleHistorico(checkbox) {
        const tbody = document.getElementById('tbody-historico');
        const addButton = tbody.parentElement.nextElementSibling;

        if (checkbox.checked) {
            // Desabilitar tabela
            tbody.querySelectorAll('input, select').forEach(field => {
                field.disabled = true;
                field.required = false;
            });
            addButton.disabled = true;
        } else {
            // Habilitar tabela
            tbody.querySelectorAll('input, select').forEach(field => {
                field.disabled = false;
            });
            addButton.disabled = false;
        }
    },

    /**
     * Toggle comercialização de não orgânicos
     */
    toggleNaoOrganicos(select) {
        const campoSeparacao = document.getElementById('campo-separacao-produtos');
        const separacaoInput = document.getElementById('separacao_produtos');

        if (select.value === 'sim') {
            campoSeparacao.style.display = 'block';
            separacaoInput.required = true;
        } else {
            campoSeparacao.style.display = 'none';
            separacaoInput.required = false;
            separacaoInput.value = '';
        }
    },

    /**
     * Toggle subsistência
     */
    toggleSubsistencia(select) {
        const camposSubsistencia = document.getElementById('campos-subsistencia');

        if (select.value === 'sim') {
            camposSubsistencia.style.display = 'block';
        } else {
            camposSubsistencia.style.display = 'none';
            // Limpar campos
            camposSubsistencia.querySelectorAll('input, select, textarea').forEach(field => {
                field.value = '';
            });
        }
    },

    /**
     * Toggle produção paralela
     */
    toggleParalela(select) {
        const camposParalela = document.getElementById('campos-paralela');

        if (select.value === 'sim') {
            camposParalela.style.display = 'block';
        } else {
            camposParalela.style.display = 'none';
            // Limpar campos
            camposParalela.querySelectorAll('input, select, textarea').forEach(field => {
                field.value = '';
            });
        }
    },

    /**
     * Toggle conversão total
     */
    toggleConversaoTotal(select) {
        const campoTempo = document.getElementById('campo-tempo-conversao');
        const tempoInput = document.getElementById('paralela_tempo_conversao');

        if (select.value === 'sim') {
            campoTempo.style.display = 'block';
            tempoInput.required = true;
        } else {
            campoTempo.style.display = 'none';
            tempoInput.required = false;
            tempoInput.value = '';
        }
    },

    /**
     * Configurar drag and drop para uploads
     */
    setupDragAndDrop() {
        document.querySelectorAll('.upload-area').forEach(area => {
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

                const input = area.querySelector('input[type="file"]');
                if (input) {
                    input.files = e.dataTransfer.files;
                    const previewId = area.id.replace('upload-', 'preview-');
                    this.handleFileUpload(input, previewId);
                }
            });

            // Click para abrir seletor
            area.addEventListener('click', () => {
                const input = area.querySelector('input[type="file"]');
                if (input) input.click();
            });
        });
    },

    /**
     * Manipular upload de arquivos
     */
    handleFileUpload(input, previewId) {
        const previewContainer = document.getElementById(previewId);
        if (!previewContainer) return;

        previewContainer.innerHTML = '';

        Array.from(input.files).forEach(file => {
            // Validar tamanho (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(`  Arquivo ${file.name} excede 5MB!`);
                return;
            }

            // Criar preview
            const preview = document.createElement('div');
            preview.className = 'file-item';

            const icon = file.type.includes('image') ? '=¼' : '=Ä';
            const size = (file.size / 1024).toFixed(2);

            preview.innerHTML = `
                <span>${icon} ${file.name}</span>
                <span class="file-size">${size} KB</span>
                <button type="button" onclick="PMOPrincipal.removeFile(this, '${input.name}')" class="btn-remove">L</button>
            `;

            previewContainer.appendChild(preview);

            // Armazenar arquivo (converter para base64 para localStorage)
            this.storeFile(file, input.name);
        });

        this.state.isModified = true;
    },

    /**
     * Armazenar arquivo em base64
     */
    storeFile(file, fieldName) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!this.state.uploadedFiles[fieldName]) {
                this.state.uploadedFiles[fieldName] = [];
            }
            this.state.uploadedFiles[fieldName].push({
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result
            });
            console.log(` Arquivo ${file.name} armazenado`);
        };
        reader.readAsDataURL(file);
    },

    /**
     * Remover arquivo
     */
    removeFile(button, fieldName) {
        const fileItem = button.closest('.file-item');
        const fileName = fileItem.querySelector('span').textContent.split(' ').slice(1).join(' ');

        // Remover do state
        if (this.state.uploadedFiles[fieldName]) {
            this.state.uploadedFiles[fieldName] = this.state.uploadedFiles[fieldName].filter(
                f => f.name !== fileName
            );
        }

        // Remover do DOM
        fileItem.remove();

        this.state.isModified = true;
        console.log(` Arquivo ${fileName} removido`);
    },

    /**
     * Definir data atual
     */
    setCurrentDate() {
        const dataInput = document.getElementById('data_preenchimento');
        if (dataInput && !dataInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dataInput.value = today;
        }
    },

    /**
     * Calcular progresso do formulário
     */
    calculateProgress() {
        const form = document.getElementById('form-pmo-principal');
        const requiredFields = form.querySelectorAll('[required]');

        let filled = 0;
        let total = requiredFields.length;

        requiredFields.forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                if (field.checked) filled++;
            } else if (field.value.trim() !== '') {
                filled++;
            }
        });

        const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;

        // Atualizar UI
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `Progresso: ${percentage}%`;

        return percentage;
    },

    /**
     * Coletar dados do formulário
     */
    collectFormData() {
        const form = document.getElementById('form-pmo-principal');
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
            dados_gerais: {
                identificacao: {
                    nome_completo: formData.get('nome_completo') || '',
                    cpf_cnpj: formData.get('cpf') || formData.get('cnpj') || '',
                    inscricao_estadual: formData.get('inscricao_estadual') || '',
                    inscricao_municipal: formData.get('inscricao_municipal') || '',
                    nome_fantasia: formData.get('nome_fantasia') || '',
                    nome_unidade_producao: formData.get('nome_unidade_producao') || ''
                },
                contato: {
                    telefone: formData.get('telefone') || '',
                    email: formData.get('email') || '',
                    endereco: {
                        endereco_completo: formData.get('endereco') || '',
                        bairro: formData.get('bairro') || '',
                        municipio: formData.get('municipio') || '',
                        uf: formData.get('uf') || '',
                        cep: formData.get('cep') || '',
                        coordenadas: {
                            latitude: parseFloat(formData.get('latitude')) || 0,
                            longitude: parseFloat(formData.get('longitude')) || 0
                        }
                    }
                },
                propriedade: {
                    posse_terra: formData.get('posse_terra') || '',
                    area_total_ha: parseFloat(formData.get('area_total_ha')) || 0,
                    caf_numero: formData.get('caf_numero') || '',
                    caf_nao_possui: formData.get('caf_nao_possui') === 'sim',
                    roteiro_acesso: formData.get('roteiro_acesso') || '',
                    data_aquisicao_posse: formData.get('data_aquisicao') || '',
                    terra_familiar: formData.get('terra_familiar') === 'sim'
                },
                manejo_organico: {
                    anos_manejo_organico: parseInt(formData.get('anos_manejo_organico')) || 0,
                    situacao_manejo: formData.get('situacao_manejo') || '',
                    comprovacao_manejo: []
                }
            },
            responsaveis_producao: this.collectTableData('responsaveis'),
            produtos_certificar: this.collectTableData('produtos'),
            historico_culturas: this.collectTableData('historico'),
            recursos_hidricos: this.collectTableData('recursos-hidricos'),
            arquivos: this.state.uploadedFiles,
            validacao: {
                campos_obrigatorios_completos: this.calculateProgress() === 100,
                possui_erros: false,
                erros: [],
                avisos: [],
                percentual_preenchimento: this.calculateProgress()
            }
        };

        return data;
    },

    /**
     * Coletar dados de tabela dinâmica
     */
    collectTableData(tableName) {
        const tbody = document.getElementById(`tbody-${tableName}`);
        if (!tbody) return [];

        const rows = tbody.querySelectorAll('tr');
        const data = [];

        rows.forEach(row => {
            const rowData = {};
            row.querySelectorAll('input, select, textarea').forEach(field => {
                if (field.name) {
                    const fieldName = field.name.replace('[]', '');
                    if (field.type === 'checkbox') {
                        rowData[fieldName] = field.checked;
                    } else if (field.type === 'number') {
                        rowData[fieldName] = parseFloat(field.value) || 0;
                    } else {
                        rowData[fieldName] = field.value || '';
                    }
                }
            });
            if (Object.keys(rowData).length > 0) {
                data.push(rowData);
            }
        });

        return data;
    },

    /**
     * Salvar formulário
     */
    salvar(silent = false) {
        try {
            const data = this.collectFormData();
            localStorage.setItem(this.config.storageKey, JSON.stringify(data));

            this.state.isModified = false;
            this.state.lastSaved = new Date();

            if (!silent) {
                this.showMessage(' Dados salvos com sucesso!', 'success');
            } else {
                this.updateAutoSaveStatus(`Salvo automaticamente às ${this.state.lastSaved.toLocaleTimeString()}`);
            }

            console.log('=¾ Dados salvos:', data);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            this.showMessage('L Erro ao salvar dados!', 'error');
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
            console.log('=Â Carregando dados salvos:', data);

            // Preencher campos
            this.fillFormFields(data);

            this.showMessage('=Â Dados carregados com sucesso!', 'info');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    },

    /**
     * Preencher campos do formulário
     */
    fillFormFields(data) {
        // TODO: Implementar preenchimento automático dos campos
        // Isso seria um processo extenso de mapeamento dos dados para os campos
        console.log('Preenchimento automático não implementado nesta versão');
    },

    /**
     * Validar formulário
     */
    validar() {
        const form = document.getElementById('form-pmo-principal');
        const errors = [];
        const warnings = [];

        // Validação HTML5 nativa
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        // Validações customizadas
        const cpf = document.getElementById('cpf')?.value;
        const cnpj = document.getElementById('cnpj')?.value;

        if (cpf && !this.validateCPF(cpf)) {
            errors.push('CPF inválido');
        }

        if (cnpj && !this.validateCNPJ(cnpj)) {
            errors.push('CNPJ inválido');
        }

        // Verificar produtos
        const produtos = this.collectTableData('produtos');
        if (produtos.length === 0) {
            errors.push('É necessário cadastrar pelo menos um produto para certificar');
        }

        // Exibir resultados
        this.showValidationReport(errors, warnings);

        return errors.length === 0;
    },

    /**
     * Validar CPF
     */
    validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11) return false;

        // Verificar dígitos repetidos
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        // Validar dígitos verificadores
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
     * Validar CNPJ
     */
    validateCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');

        if (cnpj.length !== 14) return false;

        // Verificar dígitos repetidos
        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        // Validar primeiro dígito
        let sum = 0;
        let weight = 5;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cnpj.charAt(i)) * weight;
            weight = weight === 2 ? 9 : weight - 1;
        }
        let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (digit !== parseInt(cnpj.charAt(12))) return false;

        // Validar segundo dígito
        sum = 0;
        weight = 6;
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cnpj.charAt(i)) * weight;
            weight = weight === 2 ? 9 : weight - 1;
        }
        digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (digit !== parseInt(cnpj.charAt(13))) return false;

        return true;
    },

    /**
     * Mostrar relatório de validação
     */
    showValidationReport(errors, warnings) {
        const container = document.getElementById('validation-results');
        if (!container) return;

        let html = '<div class="validation-report">';

        if (errors.length === 0 && warnings.length === 0) {
            html += `
                <div class="validation-success">
                    <h3> Formulário Válido!</h3>
                    <p>Todos os campos obrigatórios foram preenchidos corretamente.</p>
                    <p>Você pode prosseguir com o envio do PMO.</p>
                </div>
            `;
        }

        if (errors.length > 0) {
            html += `
                <div class="validation-errors">
                    <h3>L Erros Encontrados (${errors.length})</h3>
                    <ul>
                        ${errors.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (warnings.length > 0) {
            html += `
                <div class="validation-warnings">
                    <h3>  Avisos (${warnings.length})</h3>
                    <ul>
                        ${warnings.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;

        // Scroll para os resultados
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    /**
     * Exportar para JSON
     */
    exportarJSON() {
        const data = this.collectFormData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `pmo-principal-${data.metadata.id_produtor}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);

        this.showMessage(' JSON exportado com sucesso!', 'success');
    },

    /**
     * Exportar para PDF
     */
    exportarPDF() {
        // TODO: Implementar exportação PDF usando jsPDF
        alert('=Ä Exportação para PDF será implementada em breve!\n\nPor enquanto, use a opção de imprimir do navegador (Ctrl+P).');
    },

    /**
     * Submeter formulário
     */
    submitForm() {
        // Validar
        if (!this.validar()) {
            this.showMessage('L Corrija os erros antes de enviar!', 'error');
            return;
        }

        // Confirmar envio
        if (!confirm('=ä Deseja realmente enviar o PMO Principal?\n\nApós o envio, o formulário será salvo e você poderá prosseguir para os anexos específicos.')) {
            return;
        }

        // Salvar
        this.salvar();

        // Simular envio (em produção, seria uma requisição para API)
        this.showMessage(' PMO Principal enviado com sucesso!\n\nVocê pode agora preencher os anexos específicos (Vegetal, Animal, etc.).', 'success');

        // Redirecionar para dashboard após 3 segundos
        setTimeout(() => {
            // window.location.href = '../dashboard/index.html';
        }, 3000);
    },

    /**
     * Mostrar mensagem
     */
    showMessage(message, type = 'info') {
        // Criar elemento de mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;

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