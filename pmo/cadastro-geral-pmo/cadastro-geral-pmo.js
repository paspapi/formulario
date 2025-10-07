/**
 * Cadastro Geral do PMO - JavaScript
 * Módulo de gerenciamento do Cadastro Geral do Plano de Manejo Orgânico
 * @version 2.0
 * @author ANC - Associação de Agricultura Natural de Campinas e Região
 */

const CadastroGeralPMO = {
    // Configurações
    config: {
        moduleName: 'cadastro-geral-pmo',
        storageKey: 'cadastro_geral_pmo_data',
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
        console.log('✅ Inicializando Cadastro Geral do PMO...');

        // Verificar modo de criação (do painel)
        const urlParams = new URLSearchParams(window.location.search);
        const modoCriar = urlParams.get('modo') === 'criar';

        // Armazenar modo no state para uso posterior
        this.state.modoCriar = modoCriar;

        if (modoCriar) {
            console.log('📝 Modo criação de novo PMO');
            // Limpar dados em cache do localStorage para garantir formulário em branco
            localStorage.removeItem(this.config.storageKey);
            // Não carregar dados, começar em branco
            // NOTA: Não é necessário limpar pmo_scope_activities pois agora cada PMO tem seu próprio escopo
        } else {
            // Carregar dados salvos
            this.loadSavedData();
        }

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

        console.log('✅ Cadastro Geral do PMO inicializado com sucesso!');
    },

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('form-cadastro-geral-pmo');
        if (!form) return;

        // Marcar como modificado em qualquer alteração
        form.addEventListener('change', () => {
            this.state.isModified = true;
            this.updateAutoSaveStatus('Há alterações não salvas');
            this.calculateProgress();
        });

        // Interceptar navegação para salvar automaticamente
        this.setupNavigationAutoSave();

        // Submit do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Drag and drop para uploads
        this.setupDragAndDrop();
    },

    /**
     * Configurar salvamento automático ao navegar
     */
    setupNavigationAutoSave() {
        // Usar helper do framework se disponível
        if (window.AutoSaveNavigation) {
            window.AutoSaveNavigation.setup(this);
        } else {
            console.warn('AutoSaveNavigation não disponível');
        }
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

        // Sincronizar atividades com scope manager
        this.setupActivitySync();
    },

    /**
     * Configurar sincronização de atividades
     */
    setupActivitySync() {
        // Checkboxes de atividades
        const activityCheckboxes = document.querySelectorAll(
            'input[name^="atividade_"]'
        );

        activityCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.syncActivitiesWithScopeManager();
            });
        });

        // Sincronizar no carregamento inicial
        setTimeout(() => {
            this.syncActivitiesWithScopeManager();
        }, 500);
    },

    /**
     * Sincronizar atividades com scope manager
     */
    syncActivitiesWithScopeManager() {
        if (!window.PMOScopeManager) {
            console.warn('PMOScopeManager não disponível');
            return;
        }

        window.PMOScopeManager.syncFromCadastroGeralPMO();
        console.log('✅ Atividades sincronizadas com scope manager');
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
        // Máscara CPF/CNPJ dinâmica para responsáveis
        const cpfCnpjInputs = document.querySelectorAll('input[data-mask="cpf-cnpj"]');
        cpfCnpjInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');

                if (value.length <= 11) {
                    // Máscara CPF: 000.000.000-00
                    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                    e.target.value = value.substring(0, 14);
                } else {
                    // Máscara CNPJ: 00.000.000/0000-00
                    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                    e.target.value = value.substring(0, 18);
                }
            });
        });

        // Máscara CPF simples
        const cpfInputs = document.querySelectorAll('input[data-mask="cpf"]');
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
     * Toggle tipo de certificação
     */
    toggleTipoCertificacao() {
        const tipoCertificacao = document.getElementById('tipo_certificacao');
        const campoOpac = document.getElementById('campo-opac');
        const campoGrupoSpg = document.getElementById('campo-grupo-spg');
        const opacNomeInput = document.getElementById('opac_nome');

        if (!tipoCertificacao || !campoOpac || !campoGrupoSpg) return;

        const valor = tipoCertificacao.value;

        // Mostrar/ocultar campos baseado no tipo
        if (valor === 'spg') {
            // SPG/OPAC - mostrar ambos
            campoOpac.style.display = 'block';
            campoGrupoSpg.style.display = 'block';
            opacNomeInput.setAttribute('required', 'required');
        } else if (valor === 'ocs') {
            // OCS - ocultar ambos
            campoOpac.style.display = 'none';
            campoGrupoSpg.style.display = 'none';
            opacNomeInput.removeAttribute('required');
        } else if (valor === 'auditoria') {
            // Auditoria - mostrar OPAC, ocultar grupo
            campoOpac.style.display = 'block';
            campoGrupoSpg.style.display = 'none';
            opacNomeInput.setAttribute('required', 'required');
            // Limpar valor de ANC para auditoria
            if (opacNomeInput.value === 'ANC') {
                opacNomeInput.value = '';
                opacNomeInput.removeAttribute('readonly');
            }
        } else {
            // Nenhum selecionado - ocultar ambos
            campoOpac.style.display = 'none';
            campoGrupoSpg.style.display = 'none';
            opacNomeInput.removeAttribute('required');
        }
    },

    /**
     * Atualizar escopo no scope manager
     * Chamado sempre que uma atividade é marcada/desmarcada
     */
    updateEscopo() {
        if (!window.PMOScopeManager) {
            console.warn('PMOScopeManager não disponível');
            return;
        }

        const activities = {};

        // Coletar todas as atividades selecionadas
        const activityCheckboxes = document.querySelectorAll('[name^="escopo_"]');
        activityCheckboxes.forEach(checkbox => {
            activities[checkbox.name] = checkbox.checked;
        });

        // Verificar se pelo menos uma atividade foi selecionada
        const hasActivity = Object.values(activities).some(val => val === true || val === 'sim');

        // Salvar no scope manager (pretende certificar = true se houver alguma atividade marcada)
        window.PMOScopeManager.saveActivities(activities, hasActivity);

        console.log('✅ Escopo atualizado:', { hasActivity, activities });
        console.log('📦 LocalStorage salvo:', localStorage.getItem('pmo_scope_activities'));
    },


    /**
     * Toggle tipo de documento (CPF/CNPJ)
     */
    toggleTipoDocumento() {
        const tipoDocumento = document.getElementById('tipo_documento');
        const campoTipoPessoaCnpj = document.getElementById('campo-tipo-pessoa-cnpj');
        const tipoPessoaSelect = document.getElementById('tipo_pessoa');
        const campoCpfCnpj = document.getElementById('campo-cpf-cnpj');
        const labelCpfCnpj = document.getElementById('label-cpf-cnpj');
        const cpfCnpjInput = document.getElementById('cpf_cnpj');
        const campoInscricaoEstadual = document.getElementById('campo-inscricao-estadual');
        const campoInscricaoMunicipal = document.getElementById('campo-inscricao-municipal');
        const campoNomeFantasia = document.getElementById('campo-nome-fantasia');

        if (!tipoDocumento) return;

        const valor = tipoDocumento.value;

        if (valor === 'cpf') {
            // CPF - sempre pessoa física
            campoTipoPessoaCnpj.style.display = 'none';
            tipoPessoaSelect.value = 'fisica';
            tipoPessoaSelect.removeAttribute('required');

            // Mostrar campo CPF
            campoCpfCnpj.style.display = 'block';
            labelCpfCnpj.innerHTML = 'CPF <span class="required">*</span>';
            cpfCnpjInput.placeholder = '000.000.000-00';
            cpfCnpjInput.setAttribute('required', 'required');
            cpfCnpjInput.value = '';

            // Ocultar campos de empresa
            if (campoInscricaoEstadual) campoInscricaoEstadual.style.display = 'none';
            if (campoInscricaoMunicipal) campoInscricaoMunicipal.style.display = 'none';
            if (campoNomeFantasia) campoNomeFantasia.style.display = 'none';

            // Aplicar máscara de CPF
            this.aplicarMascaraCpf(cpfCnpjInput);

        } else if (valor === 'cnpj') {
            // CNPJ - perguntar tipo de pessoa
            campoTipoPessoaCnpj.style.display = 'block';
            tipoPessoaSelect.value = '';
            tipoPessoaSelect.setAttribute('required', 'required');

            // Mostrar campo CNPJ
            campoCpfCnpj.style.display = 'block';
            labelCpfCnpj.innerHTML = 'CNPJ <span class="required">*</span>';
            cpfCnpjInput.placeholder = '00.000.000/0000-00';
            cpfCnpjInput.setAttribute('required', 'required');
            cpfCnpjInput.value = '';

            // Ocultar campos de empresa até escolher tipo de pessoa
            if (campoInscricaoEstadual) campoInscricaoEstadual.style.display = 'none';
            if (campoInscricaoMunicipal) campoInscricaoMunicipal.style.display = 'none';
            if (campoNomeFantasia) campoNomeFantasia.style.display = 'none';

            // Aplicar máscara de CNPJ
            this.aplicarMascaraCnpj(cpfCnpjInput);

        } else {
            // Nenhum selecionado - ocultar tudo
            campoTipoPessoaCnpj.style.display = 'none';
            campoCpfCnpj.style.display = 'none';
            if (campoInscricaoEstadual) campoInscricaoEstadual.style.display = 'none';
            if (campoInscricaoMunicipal) campoInscricaoMunicipal.style.display = 'none';
            if (campoNomeFantasia) campoNomeFantasia.style.display = 'none';
            cpfCnpjInput.removeAttribute('required');
            tipoPessoaSelect.removeAttribute('required');
        }
    },

    /**
     * Toggle tipo de pessoa (para CNPJ)
     */
    togglePessoaTipo() {
        const tipoPessoa = document.getElementById('tipo_pessoa');
        const campoInscricaoEstadual = document.getElementById('campo-inscricao-estadual');
        const campoInscricaoMunicipal = document.getElementById('campo-inscricao-municipal');
        const campoNomeFantasia = document.getElementById('campo-nome-fantasia');

        if (!tipoPessoa) return;

        const valor = tipoPessoa.value;

        if (valor === 'fisica') {
            // Pessoa Física com CNPJ (Produtor Rural) - ocultar campos de empresa
            if (campoInscricaoEstadual) campoInscricaoEstadual.style.display = 'none';
            if (campoInscricaoMunicipal) campoInscricaoMunicipal.style.display = 'none';
            if (campoNomeFantasia) campoNomeFantasia.style.display = 'none';

        } else if (valor === 'juridica') {
            // Pessoa Jurídica - mostrar campos de empresa
            if (campoInscricaoEstadual) campoInscricaoEstadual.style.display = 'block';
            if (campoInscricaoMunicipal) campoInscricaoMunicipal.style.display = 'block';
            if (campoNomeFantasia) campoNomeFantasia.style.display = 'block';

        } else {
            // Nenhum selecionado - ocultar campos de empresa
            if (campoInscricaoEstadual) campoInscricaoEstadual.style.display = 'none';
            if (campoInscricaoMunicipal) campoInscricaoMunicipal.style.display = 'none';
            if (campoNomeFantasia) campoNomeFantasia.style.display = 'none';
        }
    },

    /**
     * Aplicar máscara de CPF
     */
    aplicarMascaraCpf(input) {
        input.removeEventListener('input', this._cnpjMask);
        this._cpfMask = (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            e.target.value = value.substring(0, 14);
        };
        input.addEventListener('input', this._cpfMask);
    },

    /**
     * Aplicar máscara de CNPJ
     */
    aplicarMascaraCnpj(input) {
        input.removeEventListener('input', this._cpfMask);
        this._cnpjMask = (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            e.target.value = value.substring(0, 18);
        };
        input.addEventListener('input', this._cnpjMask);
    },

    /**
     * Parsear coordenadas do campo único
     */
    parseCoordenadas() {
        const coordenadasInput = document.getElementById('coordenadas');
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');

        if (!coordenadasInput || !latitudeInput || !longitudeInput) return;

        const coordenadas = coordenadasInput.value.trim();

        // Limpar se vazio
        if (!coordenadas) {
            latitudeInput.value = '';
            longitudeInput.value = '';
            return;
        }

        // Padrões aceitos:
        // -22.907104, -47.063236
        // -22.907104,-47.063236
        // (-22.907104, -47.063236)
        const patterns = [
            /^\(?(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\)?$/,  // Com ou sem parênteses e espaços
            /^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/             // Separado por espaço
        ];

        let latitude = null;
        let longitude = null;

        for (const pattern of patterns) {
            const match = coordenadas.match(pattern);
            if (match) {
                latitude = parseFloat(match[1]);
                longitude = parseFloat(match[2]);
                break;
            }
        }

        // Validar range
        if (latitude !== null && longitude !== null) {
            if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
                latitudeInput.value = latitude;
                longitudeInput.value = longitude;

                // Feedback visual positivo
                coordenadasInput.style.borderColor = '#28a745';
                setTimeout(() => {
                    coordenadasInput.style.borderColor = '';
                }, 1000);
            } else {
                // Coordenadas fora do range válido
                latitudeInput.value = '';
                longitudeInput.value = '';
                coordenadasInput.style.borderColor = '#dc3545';
            }
        } else {
            // Formato inválido
            latitudeInput.value = '';
            longitudeInput.value = '';
            if (coordenadas.length > 5) { // Só mostrar erro se já digitou algo significativo
                coordenadasInput.style.borderColor = '#ffc107';
            }
        }
    },

    /**
     * Abrir modal de coordenadas
     */
    abrirModalCoordenadas() {
        // Verificar se LocationModal está disponível
        if (typeof window.LocationModal === 'undefined' || !window.LocationModal.open) {
            // Tentar novamente após pequeno delay (pode estar carregando)
            setTimeout(() => {
                if (typeof window.LocationModal === 'undefined' || !window.LocationModal.open) {
                    alert('Modal de coordenadas não disponível. Por favor, recarregue a página.');
                    return;
                }
                this.abrirModalCoordenadas();
            }, 100);
            return;
        }

        // Obter endereço atual para o modal
        const endereco = document.getElementById('endereco')?.value || '';
        const bairro = document.getElementById('bairro')?.value || '';
        const municipio = document.getElementById('municipio')?.value || '';
        const uf = document.getElementById('uf')?.value || '';
        const cep = document.getElementById('cep')?.value || '';

        const enderecoCompleto = [endereco, bairro, municipio, uf, cep]
            .filter(v => v)
            .join(', ');

        // Configurar callback para quando confirmar no modal
        window.LocationModal.open({
            latInput: 'latitude',
            lonInput: 'longitude',
            address: enderecoCompleto,
            onConfirm: (coords) => {
                // Preencher o campo único com as coordenadas do modal
                const coordenadasInput = document.getElementById('coordenadas');
                if (coordenadasInput && coords && coords.latitude && coords.longitude) {
                    coordenadasInput.value = `${coords.latitude}, ${coords.longitude}`;
                    this.parseCoordenadas();
                    this.state.isModified = true;
                }
            }
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
            if (window.CadastroGeralPMO) {
                CadastroGeralPMO.state.isModified = true;
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
            if (window.CadastroGeralPMO) {
                CadastroGeralPMO.state.isModified = true;
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
            if (window.CadastroGeralPMO) {
                CadastroGeralPMO.state.isModified = true;
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
        const form = document.getElementById('form-cadastro-geral-pmo');
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

        // Salvar progresso no scope manager
        if (window.PMOScopeManager) {
            window.PMOScopeManager.saveProgress('cadastro-geral-pmo', percentage);
        }

        // Salvar progresso no PMOStorageManager
        if (window.PMOStorageManager) {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (pmo) {
                window.PMOStorageManager.updateProgresso(pmo.id, 'cadastro-geral-pmo', percentage);
            }
        }
    },

    /**
     * Salvar dados no localStorage usando PMOStorageManager
     */
    salvar(isAutoSave = false) {
        const form = document.getElementById('form-cadastro-geral-pmo');
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

        // Salvar usando PMOStorageManager
        try {
            // Verificar se PMOStorageManager está disponível
            if (!window.PMOStorageManager) {
                console.error('PMOStorageManager não disponível. Salvando no formato antigo.');
                localStorage.setItem(this.config.storageKey, JSON.stringify(data));
                this.state.lastSaved = new Date();
                this.state.isModified = false;
                if (!isAutoSave) {
                    this.showMessage('Rascunho salvo com sucesso!', 'success');
                }
                this.updateAutoSaveStatus(`Salvo em ${new Date().toLocaleTimeString()}`);
                return;
            }

            // Obter ou criar PMO
            let pmo = window.PMOStorageManager.getActivePMO();
            let pmoId;
            let isPMONovo = false;

            if (!pmo) {
                // Criar novo PMO
                const cpf_cnpj = data.cpf_cnpj || data.cpf || data.cnpj || '000.000.000-00';
                const nome = data.nome_completo || 'Novo Produtor';
                const unidade = data.nome_unidade_producao || 'Nova Unidade';
                const ano = data.ano_vigente || new Date().getFullYear();
                const grupo = data.grupo_spg || '';

                pmoId = window.PMOStorageManager.createPMO({
                    cpf_cnpj: cpf_cnpj,
                    nome: nome,
                    unidade: unidade,
                    grupo_spg: grupo,
                    ano_vigente: ano,
                    cadastro_geral_pmo: data
                });

                console.log(`✅ Novo PMO criado: ${pmoId}`);
                isPMONovo = true;
            } else {
                pmoId = pmo.id;

                // Atualizar dados do formulário
                window.PMOStorageManager.updateFormulario(pmoId, 'cadastro_geral_pmo', data);

                // Atualizar informações básicas do PMO (se mudaram)
                const updates = {};
                if (data.nome_completo && data.nome_completo !== pmo.nome) {
                    updates.nome = data.nome_completo;
                }
                if (data.grupo_spg && data.grupo_spg !== pmo.grupo_spg) {
                    updates.grupo_spg = data.grupo_spg;
                }
                if (Object.keys(updates).length > 0) {
                    window.PMOStorageManager.updatePMOInfo(pmoId, updates);
                }
            }

            // Salvar documentos anexados
            if (this.state.uploadedFiles && Object.keys(this.state.uploadedFiles).length > 0) {
                Object.keys(this.state.uploadedFiles).forEach(fileName => {
                    const file = this.state.uploadedFiles[fileName];
                    window.PMOStorageManager.saveDocumentoAnexado(pmoId, fileName, file.data);
                });
            }

            this.state.lastSaved = new Date();
            this.state.isModified = false;

            if (!isAutoSave) {
                this.showMessage('Rascunho salvo com sucesso!', 'success');
            }

            this.updateAutoSaveStatus(`Salvo em ${new Date().toLocaleTimeString()}`);

            // Se foi criado PMO novo e está em modo criar, redirecionar para o painel
            if (isPMONovo && !isAutoSave) {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('modo') === 'criar') {
                    setTimeout(() => {
                        window.location.href = '../painel/index.html';
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            if (!isAutoSave) {
                this.showMessage('Erro ao salvar rascunho.', 'error');
            }
        }
    },

    /**
     * Carregar dados salvos usando PMOStorageManager
     */
    loadSavedData() {
        try {
            let data = null;

            // Tentar carregar usando PMOStorageManager
            if (window.PMOStorageManager) {
                const pmo = window.PMOStorageManager.getActivePMO();
                if (pmo && pmo.dados && pmo.dados.cadastro_geral_pmo) {
                    data = pmo.dados.cadastro_geral_pmo;
                    console.log(`✅ Dados carregados do PMO: ${pmo.id}`);
                }
            }

            // Fallback: tentar carregar do formato antigo
            if (!data) {
                const savedData = localStorage.getItem(this.config.storageKey);
                if (savedData) {
                    data = JSON.parse(savedData);
                    console.log('✅ Dados carregados do formato antigo');
                }
            }

            if (!data) {
                console.log('ℹ️ Nenhum dado salvo encontrado');
                return;
            }

            // DEBUG: Verificar estrutura completa dos dados recebidos
            console.log('🔍 Estrutura dos dados carregados:', {
                tipo: typeof data,
                keys: Object.keys(data).slice(0, 10), // Primeiras 10 keys
                tem_metadata: 'metadata' in data,
                tem_dados: 'dados' in data,
                tem_activities: data.dados && 'activities' in data.dados,
                tem_escopo: data.dados && 'escopo' in data.dados,
                tem_identificacao: data.dados && 'identificacao' in data.dados,
                tem_contato: data.dados && 'contato' in data.dados,
                tem_propriedade: data.dados && 'propriedade' in data.dados,
                tem_tipo_pessoa: data.dados && 'tipo_pessoa' in data.dados,
                primeiros_campos: Object.keys(data).slice(0, 5)
            });

            // Log específico para dados aninhados
            if (data.dados) {
                console.log('📊 Campos em data.dados:', Object.keys(data.dados));

                if (data.dados.activities) {
                    console.log('✅ Campo activities encontrado:', Object.keys(data.dados.activities));
                }
                if (data.dados.escopo) {
                    console.log('⚠️ Campo escopo encontrado (legado):', Object.keys(data.dados.escopo));
                }
                if (data.dados.identificacao) {
                    console.log('✅ Campo identificacao encontrado:', Object.keys(data.dados.identificacao));
                }
            }

            // TENTAR 3 FORMATOS DIFERENTES DE DADOS

            // Formato 1: Novo (importação JSON com metadata + dados)
            if (data.metadata && data.dados) {
                console.log('📥 Formato 1 detectado: Novo (metadata + dados)');
                this.preencherFormularioComJSON(data);
                return;
            }

            // Formato 2: Só dados aninhados (sem metadata)
            if (data.dados && typeof data.dados === 'object' && data.dados.identificacao) {
                console.log('📥 Formato 2 detectado: Intermediário (dados aninhados sem metadata)');
                this.preencherFormularioComJSON({
                    metadata: { versao: '1.0' },
                    dados: data.dados
                });
                return;
            }

            // Formato 3: Dados diretos com estrutura de importação
            if (data.identificacao || data.contato || data.propriedade) {
                console.log('📥 Formato 3 detectado: Dados diretos (estrutura importada)');
                this.preencherFormularioComJSON({
                    metadata: { versao: '1.0' },
                    dados: data
                });
                return;
            }

            console.log('📝 Formato 4 detectado: Antigo (flat fields), usando método tradicional...');

            const form = document.getElementById('form-cadastro-geral-pmo');
            if (!form) return;

            // Preencher campos (formato antigo - flat)
            Object.keys(data).forEach(key => {
                if (key === 'uploadedFiles') {
                    this.state.uploadedFiles = data[key] || {};
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

            // Restaurar campo de coordenadas visível a partir dos campos hidden
            const latitude = data.latitude;
            const longitude = data.longitude;
            const coordenadasInput = document.getElementById('coordenadas');

            if (coordenadasInput && latitude && longitude) {
                coordenadasInput.value = `${latitude}, ${longitude}`;
            }

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
        const form = document.getElementById('form-cadastro-geral-pmo');
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
     * Importar dados de JSON
     * NOTA: Esta função não é mais usada na interface (botão foi removido),
     * mas mantida para uso futuro ou chamadas programáticas.
     * A importação padrão é feita via Painel PMO (upload unificado PDF/JSON).
     */
    importarJSON() {
        // Criar input file invisível
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const data = JSON.parse(text);

                // Validar estrutura
                if (!data.metadata || !data.dados) {
                    throw new Error('Estrutura do JSON inválida');
                }

                // Preencher formulário com dados importados
                this.preencherFormularioComJSON(data);

                // Salvar automaticamente
                setTimeout(() => {
                    this.salvar();
                }, 500);

                this.showMessage('JSON importado com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao importar JSON:', error);
                this.showMessage(`Erro ao importar JSON: ${error.message}`, 'error');
            }
        };

        input.click();
    },

    /**
     * Preencher formulário com dados do JSON
     */
    preencherFormularioComJSON(data) {
        const form = document.getElementById('form-cadastro-geral-pmo');
        if (!form) {
            console.error('❌ Formulário não encontrado');
            return;
        }

        console.log('📥 Iniciando importação de JSON:', data);
        console.log('📊 Estrutura do JSON:', {
            tem_metadata: !!data.metadata,
            tem_dados: !!data.dados,
            keys_data: Object.keys(data),
            keys_dados: data.dados ? Object.keys(data.dados) : null
        });

        // NÃO limpar formulário - pode causar conflitos
        // form.reset();

        const dados = data.dados;

        if (!dados) {
            console.error('❌ Campo "dados" não encontrado no JSON');
            console.error('Estrutura recebida:', data);
            return;
        }

        console.log('✅ Dados encontrados, iniciando preenchimento...');
        console.log('📋 Seções a preencher:', {
            identificacao: !!dados.identificacao,
            contato: !!dados.contato,
            propriedade: !!dados.propriedade,
            manejo_organico: !!dados.manejo_organico,
            activities: !!dados.activities,
            escopo: !!dados.escopo,
            tipo_pessoa: dados.tipo_pessoa
        });

        // 1. Identificação
        if (dados.identificacao) {
            console.log('📝 Preenchendo identificação:', dados.identificacao);

            // Nome completo ou Razão Social (buscar em múltiplas fontes)
            const nome = dados.identificacao.razao_social ||
                         dados.identificacao.nome_completo ||
                         data.metadata?.nome_produtor;
            if (nome) {
                this.preencherCampo(form, 'nome_completo', nome);
            }

            this.preencherCampo(form, 'cpf_cnpj', dados.identificacao.cpf_cnpj);
            this.preencherCampo(form, 'inscricao_estadual', dados.identificacao.inscricao_estadual);
            this.preencherCampo(form, 'inscricao_municipal', dados.identificacao.inscricao_municipal);
            this.preencherCampo(form, 'nome_fantasia', dados.identificacao.nome_fantasia);
            this.preencherCampo(form, 'nome_unidade_producao', dados.identificacao.nome_unidade_producao);
        }

        // 2. Tipo de documento e tipo de pessoa
        // Determinar tipo de documento baseado no CPF/CNPJ
        if (dados.identificacao && dados.identificacao.cpf_cnpj) {
            const cpfCnpj = dados.identificacao.cpf_cnpj.replace(/\D/g, '');
            const tipoDocumento = cpfCnpj.length === 11 ? 'cpf' : 'cnpj';

            console.log('📝 Preenchendo tipo de documento:', tipoDocumento);
            this.preencherCampo(form, 'tipo_documento', tipoDocumento);

            // Disparar evento para mostrar campos corretos
            const tipoDocSelect = document.getElementById('tipo_documento');
            if (tipoDocSelect) {
                tipoDocSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        // Preencher tipo de pessoa (se houver)
        if (dados.tipo_pessoa) {
            console.log('📝 Preenchendo tipo de pessoa:', dados.tipo_pessoa);
            this.preencherCampo(form, 'tipo_pessoa', dados.tipo_pessoa);

            // Disparar evento para ajustar campos de empresa
            const tipoPessoaSelect = document.getElementById('tipo_pessoa');
            if (tipoPessoaSelect) {
                tipoPessoaSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        // 3. Contato
        if (dados.contato) {
            console.log('📝 Preenchendo contato:', dados.contato);
            // Telefone e email são preenchidos na tabela de responsáveis, não como campos diretos
            // this.preencherCampo(form, 'telefone', dados.contato.telefone);
            // this.preencherCampo(form, 'email', dados.contato.email);

            if (dados.contato.endereco) {
                const end = dados.contato.endereco;
                this.preencherCampo(form, 'endereco', end.endereco_completo || end.logradouro);
                this.preencherCampo(form, 'bairro', end.bairro);
                this.preencherCampo(form, 'municipio', end.municipio);
                this.preencherCampo(form, 'uf', end.uf);
                this.preencherCampo(form, 'cep', end.cep);

                if (end.coordenadas) {
                    const coordInput = document.getElementById('coordenadas');
                    if (coordInput && end.coordenadas.latitude && end.coordenadas.longitude) {
                        coordInput.value = `${end.coordenadas.latitude}, ${end.coordenadas.longitude}`;
                        this.parseCoordenadas();
                    }
                }
            }
        }

        // 4. Propriedade
        if (dados.propriedade) {
            console.log('📝 Preenchendo propriedade:', dados.propriedade);
            this.preencherCampo(form, 'posse_terra', dados.propriedade.posse_terra);
            this.preencherCampo(form, 'area_total_ha', dados.propriedade.area_total_ha || dados.propriedade.area_total_propriedade_ha);
            this.preencherCampo(form, 'caf_numero', dados.propriedade.caf_numero);
            this.preencherCampo(form, 'caf_nao_possui', dados.propriedade.caf_nao_possui);
            this.preencherCampo(form, 'data_aquisicao', dados.propriedade.data_aquisicao_posse || dados.propriedade.data_aquisicao);
            this.preencherCampo(form, 'terra_familiar', dados.propriedade.terra_familiar);

            // Roteiro de acesso pode estar em propriedade ou contato
            if (dados.propriedade.roteiro_acesso) {
                this.preencherCampo(form, 'roteiro_acesso', dados.propriedade.roteiro_acesso);
            }
        }

        // Roteiro de acesso pode estar em contato ou propriedade
        const roteiroAcesso = dados.contato?.roteiro_acesso || dados.propriedade?.roteiro_acesso;
        if (roteiroAcesso) {
            this.preencherCampo(form, 'roteiro_acesso', roteiroAcesso);
        }

        // 5. Manejo Orgânico
        if (dados.manejo_organico) {
            console.log('📝 Preenchendo manejo orgânico:', dados.manejo_organico);
            this.preencherCampo(form, 'anos_manejo_organico', dados.manejo_organico.anos_manejo_organico);
            this.preencherCampo(form, 'situacao_manejo', dados.manejo_organico.situacao_manejo);
            this.preencherCampo(form, 'historico_propriedade', dados.manejo_organico.historico_propriedade);
            this.preencherCampo(form, 'topografia_utilizacao', dados.manejo_organico.topografia_e_utilizacao || dados.manejo_organico.topografia_utilizacao);
            this.preencherCampo(form, 'status_manejo_organico', dados.manejo_organico.status_manejo_organico);
            this.preencherCampo(form, 'relato_historico_recente', dados.manejo_organico.relato_historico_recente);
        }

        // 6. Escopo/Activities
        // PRIORIDADE 1: Processar "activities" (formato correto para o formulário)
        if (dados.activities) {
            console.log('📝 Preenchendo activities (formato v2.0):', dados.activities);

            // Mapeamento de activities do JSON para checkboxes do HTML
            // Nomes dos checkboxes no HTML: escopo_hortalicas, escopo_frutas, escopo_cogumelos,
            // escopo_medicinais, escopo_pecuaria, escopo_apicultura, escopo_proc_minimo, escopo_processamento
            const activityMapping = {
                // Agrupamentos para compatibilidade (se JSON usar agrupamentos)
                // escopo_vegetal → marcar checkboxes individuais de produção vegetal
                'escopo_vegetal': ['escopo_hortalicas', 'escopo_frutas', 'escopo_medicinais'],

                // escopo_animal → marcar checkbox de pecuária
                'escopo_animal': ['escopo_pecuaria'],

                // escopo_processamento_minimo → escopo_proc_minimo
                'escopo_processamento_minimo': ['escopo_proc_minimo'],

                // escopo_cogumelo → escopo_cogumelos (alias)
                'escopo_cogumelo': ['escopo_cogumelos'],

                // Aliases para compatibilidade
                'escopo_graos': ['escopo_hortalicas'], // Grãos podem ser mapeados para hortaliças ou criar novo checkbox

                // Mapeamentos diretos já existem e não precisam ser mapeados
                // 'escopo_hortalicas': ['escopo_hortalicas'],
                // 'escopo_frutas': ['escopo_frutas'],
                // etc.
            };

            Object.keys(dados.activities).forEach(activityKey => {
                const valor = dados.activities[activityKey];

                // Verificar se precisa de mapeamento
                if (activityMapping[activityKey]) {
                    const targetCheckboxes = activityMapping[activityKey];

                    targetCheckboxes.forEach(targetName => {
                        const checkbox = form.querySelector(`input[name="${targetName}"]`);

                        if (checkbox) {
                            checkbox.checked = valor === true || valor === 'sim';

                            if (checkbox.checked) {
                                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                            }

                            console.log(`✅ Activity mapeada: ${activityKey} → ${targetName} = ${checkbox.checked}`);
                        } else {
                            console.warn(`⚠️ Checkbox mapeado não encontrado: ${targetName}`);
                        }
                    });
                } else {
                    // Tentar usar o nome direto
                    const checkbox = form.querySelector(`input[name="${activityKey}"]`);

                    if (checkbox) {
                        checkbox.checked = valor === true || valor === 'sim';

                        if (checkbox.checked) {
                            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }

                        console.log(`✅ Activity marcada: ${activityKey} = ${checkbox.checked}`);
                    } else {
                        console.warn(`⚠️ Checkbox de activity não encontrado: ${activityKey}`);
                    }
                }
            });
        }
        // PRIORIDADE 2: Fallback para "escopo" (formato antigo, compatibilidade retroativa)
        else if (dados.escopo) {
            console.log('📝 Preenchendo escopos (formato legado):', dados.escopo);
            Object.keys(dados.escopo).forEach(escopoKey => {
                const valor = dados.escopo[escopoKey];
                const nomeCheckbox = `escopo_${escopoKey}`;
                const checkbox = form.querySelector(`input[name="${nomeCheckbox}"]`);

                if (checkbox) {
                    // Marcar checkbox
                    checkbox.checked = valor === true || valor === 'sim';

                    // IMPORTANTE: Disparar evento change para atualizar scope manager
                    if (checkbox.checked) {
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    console.log(`✅ Escopo marcado (legado): ${nomeCheckbox} = ${checkbox.checked}`);
                } else {
                    console.warn(`⚠️ Checkbox de escopo não encontrado: ${nomeCheckbox}`);
                }
            });
        } else {
            console.warn('⚠️ Nenhum campo de escopo ou activities encontrado no JSON');
        }

        // 7. Metadata (grupo SPG, etc)
        if (data.metadata) {
            this.preencherCampo(form, 'grupo_spg', data.metadata.grupo_spg);
            // ano_vigente não está no formulário, é parte do metadata do PMO
            // this.preencherCampo(form, 'ano_vigente', data.metadata.ano_vigente);
        }

        // 7.5. Campos diretos em dados (não aninhados)
        // Alguns campos podem estar diretamente no objeto dados
        const camposDiretos = [
            'tipo_pessoa',
            'pretende_certificar',
            'tipo_certificacao',
            'opac_nome'
        ];

        camposDiretos.forEach(campo => {
            if (dados[campo] !== undefined) {
                this.preencherCampo(form, campo, dados[campo]);
                console.log(`✅ Campo direto preenchido: ${campo} = ${dados[campo]}`);
            }
        });

        // 8. Fornecedores/Responsáveis (Tabela Dinâmica)
        if (dados.identificacao && dados.identificacao.fornecedores_responsaveis && Array.isArray(dados.identificacao.fornecedores_responsaveis)) {
            console.log('📝 Preenchendo responsáveis:', dados.identificacao.fornecedores_responsaveis);
            const responsaveis = dados.identificacao.fornecedores_responsaveis;

            responsaveis.forEach((resp, index) => {
                if (index > 0) {
                    this.table.addRow('tabela-responsaveis');
                }

                setTimeout(() => {
                    const rows = document.querySelectorAll('#tbody-responsaveis tr.dynamic-row');
                    const row = rows[index];
                    if (row) {
                        const nomeInput = row.querySelector('input[name="responsavel_nome[]"]');
                        const cpfInput = row.querySelector('input[name="responsavel_cpf_cnpj[]"]');
                        const nascInput = row.querySelector('input[name="responsavel_nascimento[]"]');
                        const telefoneInput = row.querySelector('input[name="responsavel_telefone[]"]');
                        const emailInput = row.querySelector('input[name="responsavel_email[]"]');

                        if (nomeInput && resp.nome_completo) nomeInput.value = resp.nome_completo;
                        if (cpfInput && resp.cpf) cpfInput.value = resp.cpf;
                        if (nascInput && resp.data_nascimento) nascInput.value = resp.data_nascimento;

                        // IMPORTANTE: Preencher telefone/email da primeira linha com dados de contato
                        if (index === 0 && dados.contato) {
                            if (telefoneInput && dados.contato.telefone) {
                                telefoneInput.value = dados.contato.telefone;
                            }
                            if (emailInput && dados.contato.email) {
                                emailInput.value = dados.contato.email;
                            }
                        } else {
                            // Outras linhas: preencher com dados do responsável se houver
                            if (telefoneInput && resp.telefone) telefoneInput.value = resp.telefone;
                            if (emailInput && resp.email) emailInput.value = resp.email;
                        }
                    }
                }, index * 50);
            });
        } else {
            console.log('ℹ️ Nenhum responsável para preencher');
        }

        // 9. Manejo Orgânico (campos adicionais)
        if (dados.manejo_organico) {
            this.preencherCampo(form, 'historico_propriedade', dados.manejo_organico.historico_propriedade);
            this.preencherCampo(form, 'topografia_utilizacao', dados.manejo_organico.topografia_e_utilizacao);
            this.preencherCampo(form, 'status_manejo_organico', dados.manejo_organico.status_manejo_organico);
            this.preencherCampo(form, 'relato_historico_recente', dados.manejo_organico.relato_historico_recente);

            // Comprovação de Manejo (Tabela)
            if (dados.manejo_organico.comprovacao_manejo) {
                console.log('📝 Preenchendo comprovação de manejo');
                dados.manejo_organico.comprovacao_manejo.forEach(comp => {
                    const tipo = comp.tipo;
                    const checkbox = form.querySelector(`input[name="comprovacao_manejo"][value="${tipo}"]`);
                    if (checkbox) {
                        checkbox.checked = comp.status === true;
                    }
                });
            }

            // Histórico de Aplicações (Tabela)
            if (dados.manejo_organico.historico_ultimos_10_anos) {
                console.log('📝 Preenchendo histórico de aplicações');
                const historico = dados.manejo_organico.historico_ultimos_10_anos;

                historico.forEach((item, index) => {
                    if (index > 0) {
                        this.table.addRow('tabela-historico-aplicacoes');
                    }

                    setTimeout(() => {
                        const rows = document.querySelectorAll('#tbody-historico-aplicacoes tr.dynamic-row');
                        const row = rows[index];
                        if (row) {
                            const culturaInput = row.querySelector('input[name="historico_cultura[]"]');
                            const dataInput = row.querySelector('input[name="historico_data_aplicacao[]"]');
                            const insumoInput = row.querySelector('input[name="historico_insumo[]"]');
                            const organicoCheck = row.querySelector('input[name="historico_organico[]"]');
                            const certificadoCheck = row.querySelector('input[name="historico_certificado[]"]');

                            if (culturaInput) culturaInput.value = item.cultura_animal || '';
                            if (dataInput) dataInput.value = item.data_ultima_aplicacao_nao_permitido || '';
                            if (insumoInput) insumoInput.value = item.insumo_utilizado || '';
                            if (organicoCheck) organicoCheck.checked = item.estavam_sob_manejo_organico === true;
                            if (certificadoCheck) certificadoCheck.checked = item.eram_certificados === true;
                        }
                    }, index * 50);
                });
            }
        }

        // 10. Mão de Obra
        if (dados.mao_de_obra) {
            console.log('📝 Preenchendo mão de obra:', dados.mao_de_obra);
            this.preencherCampo(form, 'mao_obra_familiar', dados.mao_de_obra.familiar);
            this.preencherCampo(form, 'identifique_familiar', dados.mao_de_obra.identifique_familiar);
            this.preencherCampo(form, 'empregados_quantos', dados.mao_de_obra.empregados_quantos);
            this.preencherCampo(form, 'diaristas_quantos', dados.mao_de_obra.diaristas_quantos);
            this.preencherCampo(form, 'parceiros_quantos', dados.mao_de_obra.parceiros_quantos);
            this.preencherCampo(form, 'meeiro_rural_quantos', dados.mao_de_obra.meeiro_rural_quantos);
        }

        // 11. Croqui
        if (dados.croqui) {
            console.log('📝 Preenchendo croqui');
            this.preencherCampo(form, 'local_insercao_croqui', dados.croqui.local_insercao_croqui);

            if (dados.croqui.itens_obrigatorios_localizados) {
                dados.croqui.itens_obrigatorios_localizados.forEach(item => {
                    const checkbox = form.querySelector(`input[name="itens_croqui"][value="${item}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }

        // 12. Biodiversidade e Ambiente
        if (dados.biodiversidade_e_ambiente) {
            console.log('📝 Preenchendo biodiversidade e ambiente');
            this.preencherCampo(form, 'tecnicas_prevencao_incendios', dados.biodiversidade_e_ambiente.tecnicas_prevencao_incendios);
            this.preencherCampo(form, 'experiencia_recuperacao_solos', dados.biodiversidade_e_ambiente.experiencia_recuperacao_solos);
            this.preencherCampo(form, 'destino_lixo_organico', dados.biodiversidade_e_ambiente.destino_lixo_organico);
            this.preencherCampo(form, 'destino_lixo_nao_organico', dados.biodiversidade_e_ambiente.destino_lixo_nao_organico);
            this.preencherCampo(form, 'destino_esgoto_domestico', dados.biodiversidade_e_ambiente.destino_esgoto_domestico);

            // Preservação Ambiental (Tabela/Checkboxes)
            if (dados.biodiversidade_e_ambiente.preservacao_ambiental) {
                dados.biodiversidade_e_ambiente.preservacao_ambiental.forEach(area => {
                    const areaKey = area.area;
                    const possuiCheck = form.querySelector(`input[name="preservacao_${areaKey}_possui"]`);
                    const preservadaCheck = form.querySelector(`input[name="preservacao_${areaKey}_preservada"]`);

                    if (possuiCheck) possuiCheck.checked = area.possui === true;
                    if (preservadaCheck) preservadaCheck.checked = area.preservada === true;
                });
            }
        }

        // 13. Manejo da Água
        if (dados.manejo_da_agua) {
            console.log('📝 Preenchendo manejo da água');
            this.preencherCampo(form, 'periodicidade_analise_irrigacao', dados.manejo_da_agua.periodicidade_analise_irrigacao);

            // Fontes de Água (Tabela)
            if (dados.manejo_da_agua.fontes_agua_uso) {
                const fontes = dados.manejo_da_agua.fontes_agua_uso;

                fontes.forEach((fonte, index) => {
                    if (index > 0) {
                        this.table.addRow('tabela-fontes-agua');
                    }

                    setTimeout(() => {
                        const rows = document.querySelectorAll('#tbody-fontes-agua tr.dynamic-row');
                        const row = rows[index];
                        if (row) {
                            const usoInput = row.querySelector('input[name="fonte_uso[]"], select[name="fonte_uso[]"]');
                            const origemInput = row.querySelector('input[name="fonte_origem[]"], select[name="fonte_origem[]"]');
                            const riscoInput = row.querySelector('input[name="fonte_risco[]"], select[name="fonte_risco[]"]');
                            const garantiaInput = row.querySelector('input[name="fonte_garantia[]"], textarea[name="fonte_garantia[]"]');

                            if (usoInput) usoInput.value = fonte.uso || '';
                            if (origemInput) origemInput.value = fonte.origem || '';
                            if (riscoInput) riscoInput.value = fonte.risco_contaminacao || '';
                            if (garantiaInput) garantiaInput.value = fonte.garantia_qualidade || '';
                        }
                    }, index * 50);
                });
            }
        }

        // 14. Regularização Ambiental
        if (dados.regularizacao_ambiental) {
            console.log('📝 Preenchendo regularização ambiental');
            this.preencherCampo(form, 'possui_car', dados.regularizacao_ambiental.possui_car);
            this.preencherCampo(form, 'explicacao_reserva_legal', dados.regularizacao_ambiental.explicacao_reserva_legal);
        }

        // 15. Comercialização
        if (dados.comercializacao) {
            console.log('📝 Preenchendo comercialização');
            this.preencherCampo(form, 'processo_pos_colheita', dados.comercializacao.processo_pos_colheita);
            this.preencherCampo(form, 'produtos_armazenados', dados.comercializacao.produtos_armazenados);
            this.preencherCampo(form, 'explicacao_armazenamento', dados.comercializacao.explicacao_armazenamento);
            this.preencherCampo(form, 'transporte_produtos', dados.comercializacao.transporte_produtos);
            this.preencherCampo(form, 'rastreabilidade_produtos', dados.comercializacao.rastreabilidade_produtos);
            this.preencherCampo(form, 'comercializa_nao_organicos', dados.comercializacao.comercializa_nao_organicos);

            // Tipos de Comercialização (Checkboxes)
            if (dados.comercializacao.tipos_comercializacao) {
                dados.comercializacao.tipos_comercializacao.forEach(tipo => {
                    const checkbox = form.querySelector(`input[name="tipo_comercializacao"][value="${tipo.tipo}"]`);
                    if (checkbox) checkbox.checked = tipo.status === true;
                });
            }
        }

        // 16. Controles e Registros (Tabela)
        if (dados.controles_e_registros) {
            console.log('📝 Preenchendo controles e registros');
            const controles = dados.controles_e_registros;

            controles.forEach((ctrl, index) => {
                if (index > 0) {
                    this.table.addRow('tabela-controles-registros');
                }

                setTimeout(() => {
                    const rows = document.querySelectorAll('#tbody-controles-registros tr.dynamic-row');
                    const row = rows[index];
                    if (row) {
                        const atividadeInput = row.querySelector('input[name="controle_atividade[]"], select[name="controle_atividade[]"]');

                        if (atividadeInput) atividadeInput.value = ctrl.atividade || '';

                        // Marcar checkboxes de controles
                        if (ctrl.controles && Array.isArray(ctrl.controles)) {
                            ctrl.controles.forEach(controle => {
                                const checkbox = row.querySelector(`input[value="${controle}"]`);
                                if (checkbox) checkbox.checked = true;
                            });
                        }
                    }
                }, index * 50);
            });
        }

        // 17. Produção de Subsistência
        if (dados.producao_subsistencia_ornamental) {
            console.log('📝 Preenchendo produção de subsistência');
            this.preencherCampo(form, 'possui_producao_subsistencia', dados.producao_subsistencia_ornamental.possui_nao_organica);
            this.preencherCampo(form, 'utiliza_insumos_subsistencia', dados.producao_subsistencia_ornamental.utiliza_insumos_nao_permitidos);
            this.preencherCampo(form, 'risco_contaminacao_subsistencia', dados.producao_subsistencia_ornamental.risco_contaminacao);
            this.preencherCampo(form, 'manejo_bloqueio_subsistencia', dados.producao_subsistencia_ornamental.manejo_bloqueio_riscos);
        }

        // 18. Produção Paralela
        if (dados.producao_paralela) {
            console.log('📝 Preenchendo produção paralela');
            this.preencherCampo(form, 'possui_producao_paralela', dados.producao_paralela.possui_paralela);
            this.preencherCampo(form, 'utiliza_insumos_paralela', dados.producao_paralela.utiliza_insumos_nao_permitidos);
            this.preencherCampo(form, 'risco_contaminacao_paralela', dados.producao_paralela.risco_contaminacao);
            this.preencherCampo(form, 'manejo_bloqueio_paralela', dados.producao_paralela.manejo_bloqueio_riscos);
            this.preencherCampo(form, 'pretende_conversao_total', dados.producao_paralela.pretende_conversao_total);
            this.preencherCampo(form, 'tempo_conversao', dados.producao_paralela.tempo_conversao);
        }

        // 19. Declarações de Conformidade
        if (dados.declaracoes_conformidade) {
            console.log('📝 Preenchendo declarações de conformidade');
            const declaracoes = dados.declaracoes_conformidade;

            Object.keys(declaracoes).forEach(key => {
                const checkbox = form.querySelector(`input[name="${key}"]`);
                if (checkbox && checkbox.type === 'checkbox') {
                    checkbox.checked = declaracoes[key] === true || declaracoes[key] === 'true';
                }
            });
        }

        // Processar escopos se existirem
        if (data.escopos && data.escopos.anexo_processamento) {
            const processoData = data.escopos.anexo_processamento.dados;
            if (processoData) {
                // Marcar escopo processamento se não estiver marcado
                const checkbox = form.querySelector('input[name="escopo_processamento"]');
                if (checkbox) checkbox.checked = true;
            }
        }

        console.log('✅ Preenchimento concluído, atualizando campos condicionais...');

        // Contar campos preenchidos
        const camposPreenchidos = form.querySelectorAll('input:not([type="button"]):not([type="submit"]), select, textarea');
        let countPreenchidos = 0;
        let countTotal = camposPreenchidos.length;

        camposPreenchidos.forEach(campo => {
            if (campo.type === 'checkbox' || campo.type === 'radio') {
                if (campo.checked) countPreenchidos++;
            } else if (campo.value && campo.value.trim() !== '') {
                countPreenchidos++;
            }
        });

        console.log(`📊 Campos preenchidos: ${countPreenchidos}/${countTotal} (${Math.round(countPreenchidos/countTotal*100)}%)`);

        // Atualizar campos condicionais e sincronizar
        setTimeout(() => {
            console.log('🔄 Iniciando atualização de campos condicionais...');

            // Atualizar visibilidade de campos baseados em selects
            this.toggleTipoDocumento();
            this.togglePessoaTipo();
            this.toggleTipoCertificacao();

            // Disparar eventos de change em campos importantes para garantir sincronização
            const camposImportantes = [
                'tipo_documento',
                'tipo_pessoa',
                'tipo_certificacao',
                'possui_subsistencia',
                'possui_producao_paralela',
                'vende_nao_organicos'
            ];

            camposImportantes.forEach(campoId => {
                const elemento = document.getElementById(campoId);
                if (elemento) {
                    elemento.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log(`🔄 Evento change disparado em ${campoId}`);
                }
            });

            // Sincronizar activities com scope manager (já feito via dispatchEvent nos checkboxes)
            if (window.PMOScopeManager) {
                this.syncActivitiesWithScopeManager();
                console.log('✅ Activities sincronizadas com PMOScopeManager');
            }

            // Calcular progresso
            this.calculateProgress();

            // Marcar como modificado para que seja salvo
            this.state.isModified = true;

            console.log('✅ Formulário completamente preenchido e atualizado!');
            console.log('📊 Status final:', {
                isModified: this.state.isModified,
                uploadedFiles: Object.keys(this.state.uploadedFiles).length
            });
        }, 500); // Aumentar timeout para garantir que todas as tabelas sejam criadas
    },

    /**
     * Preencher campos do formulário
     */
    preencherCampos(form, data) {
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (typeof value !== 'object' || value === null) {
                this.preencherCampo(form, key, value);
            }
        });
    },

    /**
     * Preencher um campo específico
     */
    preencherCampo(form, name, value) {
        // Validar valor - aceitar 0 e false como valores válidos
        if (value === undefined || value === null || value === '' || value === 'undefined' || value === 'null') {
            // console.log(`ℹ️ Campo ${name} ignorado (valor vazio)`);
            return; // Não preencher valores vazios
        }

        const elements = form.querySelectorAll(`[name="${name}"]`);

        if (elements.length === 0) {
            console.warn(`⚠️ Campo não encontrado no formulário: ${name} (valor: ${value})`);
            return;
        }

        let preenchido = false;

        elements.forEach(element => {
            try {
                if (element.type === 'checkbox') {
                    const shouldCheck = value === true || value === 'sim' || value === 'true' || value === element.value;
                    element.checked = shouldCheck;
                    if (shouldCheck) preenchido = true;
                } else if (element.type === 'radio') {
                    const shouldCheck = String(value) === String(element.value);
                    element.checked = shouldCheck;
                    if (shouldCheck) preenchido = true;
                } else if (element.tagName === 'SELECT') {
                    element.value = value;
                    preenchido = true;
                } else if (element.tagName === 'TEXTAREA') {
                    element.value = value;
                    preenchido = true;
                } else {
                    // Input text, number, date, etc
                    element.value = value;
                    preenchido = true;
                }
            } catch (error) {
                console.error(`❌ Erro ao preencher campo ${name}:`, error);
            }
        });

        if (preenchido) {
            console.log(`✅ Campo preenchido: ${name} = ${typeof value === 'object' ? JSON.stringify(value) : value}`);
        }
    },

    /**
     * Exportar dados como JSON (conforme schema unificado v2.0.0)
     */
    exportarJSON() {
        const form = document.getElementById('form-cadastro-geral-pmo');
        if (!form) return;

        const formData = new FormData(form);
        const data = {
            metadata: {
                versao_schema: '2.0.0',
                tipo_formulario: 'cadastro_geral_pmo',
                data_criacao: formData.get('data_declaracao') || new Date().toISOString(),
                ultima_atualizacao: new Date().toISOString(),
                status: 'rascunho',
                id_produtor: formData.get('cpf_cnpj') || '',
                grupo_spg: formData.get('grupo_spg') || 'ANC',
                nome_produtor: formData.get('nome_completo') || '',
                nome_unidade: formData.get('nome_unidade_producao') || '',
                ano_vigente: parseInt(formData.get('ano_vigente')) || new Date().getFullYear()
            },
            dados: {}
        };

        // Adicionar PMO info se disponível
        if (window.PMOStorageManager) {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (pmo) {
                data.metadata.id_pmo = pmo.id;
            }
        }

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

        // Adicionar arquivos anexados
        if (this.state.uploadedFiles && Object.keys(this.state.uploadedFiles).length > 0) {
            data.arquivos_anexados = {};
            Object.keys(this.state.uploadedFiles).forEach(fileName => {
                const file = this.state.uploadedFiles[fileName];
                data.arquivos_anexados[fileName] = {
                    nome: file.name,
                    tipo: file.type,
                    tamanho: file.size,
                    data_base64: file.data,
                    data_upload: new Date().toISOString()
                };
            });
        }

        // Adicionar informações de validação
        data.validacao = {
            percentual_completo: this.calculateProgress(),
            data_validacao: new Date().toISOString()
        };

        // Download
        const pmoId = data.metadata.id_pmo || 'sem-pmo';
        const fileName = `cadastro-geral-pmo_${pmoId}_${new Date().toISOString().split('T')[0]}.json`;

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);

        this.showMessage('JSON exportado com sucesso!', 'success');
        console.log('✅ Cadastro Geral PMO exportado:', fileName);
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
        const form = document.getElementById('form-cadastro-geral-pmo');
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
    CadastroGeralPMO.init();
});

// Expor globalmente
window.CadastroGeralPMO = CadastroGeralPMO;