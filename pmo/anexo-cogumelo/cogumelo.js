/**
 * Anexo Cogumelos - JavaScript
 * Sistema PMO Digital - ANC
 * Formulário para Produção de Cogumelos Orgânicos
 */

const AnexoCogumelo = {
    config: {
        moduleName: 'anexo-cogumelo',
        storageKey: 'anexo_cogumelo_data',
        autoSaveInterval: 30000,
        version: '2.0',
        schemaPath: '/database/schemas/anexo-cogumelo.schema.json'
    },

    state: {
        isModified: false,
        lastSaved: null,
        uploadedFiles: {},
        schemaData: null
    },

    /**
     * Inicializar módulo
     */
    init() {
        console.log('✅ Inicializando Anexo Cogumelos...');

        // Carregar dados salvos
        this.loadSavedData();

        // Configurar funcionalidades do framework
        this.setupAutoSave();
        this.setupEventListeners();
        this.initDynamicTables();
        this.applyMasks();
        this.calculateProgress();

        console.log('✅ Anexo Cogumelos inicializado!');
    },

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('form-anexo-cogumelo');
        if (!form) return;

        // Detectar mudanças
        form.addEventListener('change', () => {
            this.state.isModified = true;
            this.calculateProgress();
        });

        form.addEventListener('input', () => {
            this.state.isModified = true;
        });

        // Prevenir perda de dados
        window.addEventListener('beforeunload', (e) => {
            if (this.state.isModified) {
                e.preventDefault();
                e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
            }
        });

        // Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
    },

    /**
     * Aplicar máscaras (usa framework)
     */
    applyMasks() {
        // CPF
        document.querySelectorAll('[data-mask="cpf"]').forEach(input => {
            if (typeof PMOField !== 'undefined') {
                PMOField.mask(input, 'cpf');
            }
        });

        // CNPJ
        document.querySelectorAll('[data-mask="cnpj"]').forEach(input => {
            if (typeof PMOField !== 'undefined') {
                PMOField.mask(input, 'cnpj');
            }
        });

        // Telefone
        document.querySelectorAll('[data-mask="phone"]').forEach(input => {
            if (typeof PMOField !== 'undefined') {
                PMOField.mask(input, 'phone');
            }
        });

        // CEP
        document.querySelectorAll('[data-mask="cep"]').forEach(input => {
            if (typeof PMOField !== 'undefined') {
                PMOField.mask(input, 'cep');
            }
        });
    },

    /**
     * Inicializar tabelas dinâmicas
     */
    initDynamicTables() {
        console.log('✅ Tabelas dinâmicas prontas');

        // Atualizar numeração das tabelas existentes
        const tabelas = [
            'tabela-cogumelos',
            'tabela-materiais-substrato',
            'tabela-produtos-solo',
            'tabela-estruturas',
            'tabela-pragas',
            'tabela-equipamentos',
            'tabela-insumos',
            'tabela-produtos-higienizacao',
            'tabela-funcionarios'
        ];

        tabelas.forEach(tabelaId => {
            const tbody = document.querySelector(`#${tabelaId} tbody`);
            if (tbody && typeof PMOTable !== 'undefined') {
                PMOTable.updateRowNumbers(tbody);
            }
        });
    },

    /**
     * Configurar auto-save (usa framework)
     */
    setupAutoSave() {
        setInterval(() => {
            if (this.state.isModified) {
                this.salvar(true); // auto-save silencioso
            }
        }, this.config.autoSaveInterval);
    },

    /**
     * Calcular progresso
     */
    calculateProgress() {
        if (typeof PMOProgress !== 'undefined') {
            PMOProgress.calculate(document.getElementById('form-anexo-cogumelo'));
        }
    },

    /**
     * Toggle de seções condicionais
     */
    toggleSection(sectionId, show) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = show ? 'block' : 'none';

            // Limpar campos se ocultar
            if (!show) {
                const inputs = section.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                });
            }
        }
    },

    /**
     * Salvar dados
     */
    salvar(isAutoSave = false) {
        const form = document.getElementById('form-anexo-cogumelo');
        const formData = new FormData(form);
        const data = {};

        // Converter FormData para objeto
        for (let [key, value] of formData.entries()) {
            // Arrays (campos com [])
            if (key.endsWith('[]')) {
                const arrayKey = key.replace('[]', '');
                if (!data[arrayKey]) {
                    data[arrayKey] = [];
                }
                data[arrayKey].push(value);
            } else {
                data[key] = value;
            }
        }

        // Adicionar arquivos
        data.uploadedFiles = this.state.uploadedFiles;
        data.lastModified = new Date().toISOString();

        // Salvar no localStorage
        if (typeof PMOStorage !== 'undefined') {
            PMOStorage.save(this.config.storageKey, data);
        } else {
            localStorage.setItem(this.config.storageKey, JSON.stringify(data));
        }

        this.state.isModified = false;
        this.state.lastSaved = new Date();

        // Atualizar status
        const statusElement = document.getElementById('auto-save-status');
        if (statusElement) {
            statusElement.textContent = `💾 Salvo às ${this.state.lastSaved.toLocaleTimeString()}`;
        }

        if (!isAutoSave) {
            if (typeof PMONotify !== 'undefined') {
                PMONotify.success('Dados salvos com sucesso!');
            } else {
                alert('Dados salvos com sucesso!');
            }
        }

        console.log('✅ Dados salvos:', data);
    },

    /**
     * Carregar dados salvos
     */
    loadSavedData() {
        let data;

        if (typeof PMOStorage !== 'undefined') {
            data = PMOStorage.load(this.config.storageKey);
        } else {
            const saved = localStorage.getItem(this.config.storageKey);
            if (saved) {
                data = JSON.parse(saved);
            }
        }

        if (!data) return;

        const form = document.getElementById('form-anexo-cogumelo');

        // Preencher campos simples
        Object.keys(data).forEach(key => {
            if (key === 'uploadedFiles' || key === 'lastModified') {
                if (key === 'uploadedFiles') {
                    this.state.uploadedFiles = data[key];
                }
                return;
            }

            // Arrays
            if (Array.isArray(data[key])) {
                // Arrays são tratados nas tabelas dinâmicas
                return;
            }

            const element = form.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = data[key] === 'on' || data[key] === true;
                } else if (element.type === 'radio') {
                    const radio = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    element.value = data[key];
                }
            }
        });

        if (typeof PMONotify !== 'undefined') {
            PMONotify.info('Dados recuperados do rascunho');
        }

        this.calculateProgress();
        console.log('✅ Dados carregados:', data);
    },

    /**
     * Validar formulário
     */
    validar() {
        const form = document.getElementById('form-anexo-cogumelo');
        const errors = [];
        const warnings = [];

        // Validar campos obrigatórios
        const required = form.querySelectorAll('[required]');
        required.forEach(field => {
            if (!field.value.trim() && field.type !== 'checkbox') {
                errors.push(`Campo obrigatório não preenchido: ${field.labels[0]?.textContent || field.name}`);
            }
            if (field.type === 'checkbox' && !field.checked) {
                errors.push(`Declaração obrigatória não marcada: ${field.labels[0]?.textContent || field.name}`);
            }
        });

        // Validar CPF
        const cpfFields = form.querySelectorAll('[data-mask="cpf"]');
        cpfFields.forEach(field => {
            if (field.value && typeof PMOValidators !== 'undefined') {
                if (!PMOValidators.validateCPF(field.value)) {
                    errors.push(`CPF inválido: ${field.labels[0]?.textContent || field.name}`);
                }
            }
        });

        // Validar datas
        const dataPreenchimento = document.getElementById('data_preenchimento');
        if (dataPreenchimento && dataPreenchimento.value) {
            const data = new Date(dataPreenchimento.value);
            const hoje = new Date();
            if (data > hoje) {
                warnings.push('Data de preenchimento está no futuro');
            }
        }

        // Validar temperaturas
        const tempMin = document.getElementById('temperatura_min');
        const tempMax = document.getElementById('temperatura_max');
        if (tempMin && tempMax && tempMin.value && tempMax.value) {
            if (parseFloat(tempMin.value) >= parseFloat(tempMax.value)) {
                warnings.push('Temperatura mínima deve ser menor que a máxima');
            }
        }

        // Validar umidade
        const umidMin = document.getElementById('umidade_relativa_min');
        const umidMax = document.getElementById('umidade_relativa_max');
        if (umidMin && umidMax && umidMin.value && umidMax.value) {
            if (parseFloat(umidMin.value) >= parseFloat(umidMax.value)) {
                warnings.push('Umidade mínima deve ser menor que a máxima');
            }
        }

        // Exibir resultados
        if (errors.length > 0) {
            let mensagem = '❌ Erros encontrados:\n\n';
            errors.forEach((error, index) => {
                mensagem += `${index + 1}. ${error}\n`;
            });

            if (typeof PMONotify !== 'undefined') {
                PMONotify.error('Corrija os erros antes de enviar');
                console.error(mensagem);
            } else {
                alert(mensagem);
            }
            return false;
        }

        if (warnings.length > 0) {
            let mensagem = '⚠️ Avisos:\n\n';
            warnings.forEach((warning, index) => {
                mensagem += `${index + 1}. ${warning}\n`;
            });

            if (typeof PMONotify !== 'undefined') {
                PMONotify.warning('Verifique os avisos');
                console.warn(mensagem);
            } else {
                alert(mensagem);
            }
        }

        if (errors.length === 0 && warnings.length === 0) {
            if (typeof PMONotify !== 'undefined') {
                PMONotify.success('✅ Formulário válido!');
            } else {
                alert('✅ Formulário válido!');
            }
        }

        return errors.length === 0;
    },

    /**
     * Exportar JSON
     */
    exportarJSON() {
        const form = document.getElementById('form-anexo-cogumelo');
        const formData = new FormData(form);
        const data = {};

        // Converter FormData para objeto estruturado
        for (let [key, value] of formData.entries()) {
            if (key.endsWith('[]')) {
                const arrayKey = key.replace('[]', '');
                if (!data[arrayKey]) {
                    data[arrayKey] = [];
                }
                data[arrayKey].push(value);
            } else {
                data[key] = value;
            }
        }

        // Estruturar conforme schema
        const exportData = {
            metadata: {
                tipo_documento: 'ANEXO_II_COGUMELOS',
                versao_schema: '1.0',
                data_extracao: new Date().toISOString(),
                status_processamento: 'EXPORTADO'
            },
            ...data
        };

        const fileName = `pmo-cogumelos-${new Date().toISOString().split('T')[0]}.json`;

        if (typeof PMOExport !== 'undefined') {
            PMOExport.toJSON(exportData, fileName);
        } else {
            // Fallback manual
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        }

        console.log('✅ JSON exportado:', exportData);
    },

    /**
     * Submeter formulário
     */
    submitForm() {
        // Validar antes de enviar
        if (!this.validar()) {
            return;
        }

        if (confirm('Deseja enviar o formulário para certificação?\n\nApós o envio, os dados serão processados pela equipe da ANC.')) {
            // Salvar antes de enviar
            this.salvar();

            if (typeof PMONotify !== 'undefined') {
                PMONotify.success('Formulário enviado com sucesso! Em breve você receberá um retorno.');
            } else {
                alert('Formulário enviado com sucesso!');
            }

            // Em produção: enviar para servidor
            console.log('✅ Formulário enviado para certificação');

            // Aqui você adicionaria o código para enviar ao servidor
            // fetch('/api/pmo/cogumelo', { method: 'POST', body: formData })
        }
    },

    /**
     * Limpar formulário
     */
    limparFormulario() {
        if (confirm('Deseja realmente limpar todos os dados do formulário?\n\nEsta ação não pode ser desfeita.')) {
            const form = document.getElementById('form-anexo-cogumelo');
            form.reset();

            // Limpar localStorage
            if (typeof PMOStorage !== 'undefined') {
                PMOStorage.clear(this.config.storageKey);
            } else {
                localStorage.removeItem(this.config.storageKey);
            }

            this.state.isModified = false;
            this.state.uploadedFiles = {};
            this.calculateProgress();

            if (typeof PMONotify !== 'undefined') {
                PMONotify.info('Formulário limpo');
            }

            console.log('✅ Formulário limpo');
        }
    }
};

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    AnexoCogumelo.init();
});

// Expor globalmente
window.AnexoCogumelo = AnexoCogumelo;
