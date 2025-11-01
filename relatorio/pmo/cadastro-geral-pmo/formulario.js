/* eslint-disable no-undef */
const CadastroGeralPMO = {
    config: {
        moduleName: 'cadastro-geral-pmo',
        storageKey: 'cadastro-geral-pmo-form-data',
        anexoId: 'cadastro-geral-pmo',
        autoSaveInterval: 30000
    },
    state: {
        storage: null,
        isModified: false,
        autoSaveTimer: null
    },

    async init() {
        this.form = document.getElementById('form-cadastro-geral-pmo');
        if (!this.form) {
            console.warn('CadastroGeralPMO: formulário não encontrado.');
            return;
        }

        this.fornecedoresTableId = 'tabela-fornecedores-responsaveis';

        this.state.storage = new PMOStorage({ storageType: 'localStorage' });
        await this.state.storage.init();

        this.initComponents();
        this.bindEvents();
        await this.restore();

        this.ensureMinimumRows([
            'tabela-fornecedores-responsaveis',
            'tabela-comprovacao-manejo',
            'tabela-historico-ultimos-anos',
            'tabela-fontes-agua'
        ]);

        this.updateConditionalSections();
        PMOProgressTracker.autoTrack(this.form.id, this.config.anexoId);
        PMOScopeManager.applyDashboardFilters('.pmo-navigation');

        if (this.config.autoSaveInterval > 0) {
            this.state.autoSaveTimer = setInterval(() => this.salvar(true), this.config.autoSaveInterval);
        }

        AutoSaveNavigation.setup(this, '.pmo-navigation a');
        console.log('CadastroGeralPMO inicializado.');
    },

    initComponents() {
        if (typeof PMOTable !== 'undefined') {
            PMOTable.initAll();
        }

        if (typeof PMODynamicFields !== 'undefined' && PMODynamicFields.init) {
            PMODynamicFields.init();
        }

        if (typeof PMOMasks !== 'undefined' && PMOMasks.init) {
            PMOMasks.init();
        }

        if (typeof LocationPicker !== 'undefined' && LocationPicker.init) {
            LocationPicker.init();
        }
    },

    bindEvents() {
        this.form.addEventListener('input', () => {
            this.state.isModified = true;
        });

        this.form.addEventListener('change', (event) => {
            const { name } = event.target;

            if (name === 'possui_nao_organica' ||
                name === 'utiliza_insumos_nao_permitidos' ||
                name === 'possui_paralela' ||
                name === 'paralela_insumos_nao_permitidos' ||
                name === 'pretende_conversao_total' ||
                name === 'possui_car' ||
                name === 'vende_nao_organicos' ||
                name === 'possui_subsistencia') {
                this.updateConditionalSections();
            }

            if (name && name.startsWith('escopo_') || name === 'pretende_certificar') {
                PMOScopeManager.syncFromCadastroGeralPMO();
            }
        });

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.salvar();
        });

        const exportButton = document.getElementById('btn-exportar-json');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                const payload = this.serialize();
                const filename = `cadastro-geral-pmo-${new Date().toISOString().split('T')[0]}.json`;
                PMOExport.toJSON(payload, filename);
            });
        }
    },

    updateConditionalSections() {
        this.toggleGroup('grupo-subsistencia-ornamental', this.getRadioValue('possui_nao_organica') === 'sim');
        this.toggleGroup('grupo-producao-paralela', this.getRadioValue('possui_paralela') === 'sim');
        this.toggleField('situacao_car', this.form.elements['possui_car']?.value === 'sim');
        this.toggleField('como_separa_comercializacao', this.getRadioValue('vende_nao_organicos') === 'sim');
        this.toggleField('separacao_subsistencia', this.getRadioValue('possui_subsistencia') === 'sim');
    },

    toggleGroup(groupId, show) {
        const group = document.getElementById(groupId);
        if (!group) return;

        group.classList.toggle('hidden', !show);
        const fields = group.querySelectorAll('input, select, textarea');
        fields.forEach((field) => {
            field.disabled = !show;
        });
    },

    toggleField(fieldId, show) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const wrapper = field.closest('.field-wrapper') || field.parentElement;
        if (!wrapper) return;

        wrapper.classList.toggle('hidden', !show);
        field.disabled = !show;
        if (!show && 'value' in field) {
            field.value = '';
        }
    },

    collectScopes() {
        const names = [
            'escopo_hortalicas',
            'escopo_frutas',
            'escopo_medicinais',
            'escopo_pecuaria',
            'escopo_apicultura',
            'escopo_cogumelos',
            'escopo_processamento',
            'escopo_proc_minimo'
        ];

        const result = {};
        names.forEach((name) => {
            const input = this.form.elements[name];
            result[name] = input ? Boolean(input.checked) : false;
        });
        return result;
    },

    buildActivities(scopes) {
        return {
            escopo_vegetal: Boolean(scopes.escopo_hortalicas || scopes.escopo_frutas || scopes.escopo_medicinais),
            escopo_animal: Boolean(scopes.escopo_pecuaria),
            escopo_cogumelo: Boolean(scopes.escopo_cogumelos),
            escopo_apicultura: Boolean(scopes.escopo_apicultura),
            escopo_processamento: Boolean(scopes.escopo_processamento),
            escopo_processamento_minimo: Boolean(scopes.escopo_proc_minimo)
        };
    },

    serialize() {
        const formData = new FormData(this.form);
        const scopes = this.collectScopes();
        const activities = this.buildActivities(scopes);

        const fornecedores = (typeof PMOTable !== 'undefined')
            ? PMOTable.getTableData('tabela-fornecedores-responsaveis')
            : [];

        const comprovacao = PMOTable.getTableData('tabela-comprovacao-manejo')
            .filter((item) => item.tipo || item.status)
            .map((item) => ({
                tipo: item.tipo || '',
                status: this.toBoolean(item.status)
            }));

        const historico = PMOTable.getTableData('tabela-historico-ultimos-anos')
            .filter((item) => item.cultura_animal || item.data_ultima_aplicacao_nao_permitido || item.insumo_utilizado)
            .map((item) => ({
                cultura_animal: item.cultura_animal || '',
                data_ultima_aplicacao_nao_permitido: item.data_ultima_aplicacao_nao_permitido || '',
                insumo_utilizado: item.insumo_utilizado || '',
                estavam_sob_manejo_organico: this.toBoolean(item.estavam_sob_manejo_organico),
                eram_certificados: this.toBoolean(item.eram_certificados)
            }));

        const fontesAgua = PMOTable.getTableData('tabela-fontes-agua')
            .filter((item) => item.uso || item.origem || item.nivel_risco || item.risco_contaminacao || item.garantia_qualidade)
            .map((item) => ({
                uso: item.uso || '',
                origem: item.origem || '',
                nivel_risco: item.nivel_risco || '',
                risco_contaminacao: item.risco_contaminacao || '',
                garantia_qualidade: item.garantia_qualidade || ''
            }));

        const atividadesSubsistencia = PMOTable.getTableData('tabela-atividades-subsistencia-ornamental')
            .filter((item) => item.tipo || item.area_ha)
            .map((item) => ({
                tipo: item.tipo || '',
                area_ha: this.toNumber(item.area_ha)
            }));

        const atividadesParalela = PMOTable.getTableData('tabela-producao-paralela')
            .filter((item) => item.tipo || item.area_ha)
            .map((item) => ({
                tipo: item.tipo || '',
                area_ha: this.toNumber(item.area_ha)
            }));

        const firstResponsavel = fornecedores[0] || {};
        const tipoPessoa = formData.get('tipo_pessoa') || null;
        const cpfCnpj = formData.get('cpf_cnpj') || '';
        const nomeUnidade = formData.get('nome_unidade_producao') || '';
        const nomeFantasia = formData.get('nome_fantasia') || firstResponsavel.nome_completo || '';

        const unidadeSlug = this.slugify(nomeUnidade);
        const cpfDigits = (cpfCnpj || '').replace(/\D/g, '');

        const metadata = {
            versao_schema: '2.0.0',
            ultima_atualizacao: new Date().toISOString(),
            tipo_formulario: 'pmo_completo',
            nome_produtor: nomeFantasia,
            nome_unidade: nomeUnidade,
            id_produtor: cpfCnpj,
            grupo_spg: formData.get('grupo_spg') || '',
            ano_vigente: new Date().getFullYear(),
            status: 'rascunho',
            id_pmo: unidadeSlug && cpfDigits
                ? `pmo_${new Date().getFullYear()}_${cpfDigits}_${unidadeSlug}`
                : ''
        };

        const dados = {
            tipo_pessoa: tipoPessoa,
            pretende_certificar: this.toBoolean(formData.get('pretende_certificar')),
            identificacao: {
                fornecedores_responsaveis: fornecedores,
                cpf_cnpj: cpfCnpj,
                inscricao_estadual: formData.get('inscricao_estadual') || '',
                caf_numero: formData.get('caf_numero') || '',
                grupo_spg: formData.get('grupo_spg') || '',
                data_preenchimento_pmo: formData.get('data_preenchimento_pmo') || '',
                nome_fantasia: nomeFantasia,
                nome_unidade_producao: nomeUnidade
            },
            contato: {
                telefone: formData.get('telefone') || '',
                email: formData.get('email') || '',
                endereco: {
                    logradouro: formData.get('logradouro') || '',
                    bairro: formData.get('bairro') || '',
                    municipio: formData.get('municipio') || '',
                    uf: formData.get('uf') || '',
                    cep: formData.get('cep') || '',
                    coordenadas: {
                        latitude: this.toNumber(formData.get('latitude')),
                        longitude: this.toNumber(formData.get('longitude'))
                    }
                },
                roteiro_acesso: formData.get('roteiro_acesso') || ''
            },
            propriedade: {
                posse_terra: (formData.get('posse_terra') || '').toUpperCase(),
                area_total_propriedade_ha: this.toNumber(formData.get('area_total_propriedade_ha')),
                area_total_organica_ha: this.toNumber(formData.get('area_total_organica_ha')),
                relacao_unidade_producao: formData.get('relacao_unidade_producao') || '',
                data_aquisicao_posse: formData.get('data_aquisicao_posse') || '',
                terra_familiar: this.toBoolean(formData.get('terra_familiar'))
            },
            manejo_organico: {
                historico_propriedade: formData.get('historico_propriedade') || '',
                topografia_e_utilizacao: formData.get('topografia_e_utilizacao') || '',
                status_manejo_organico: formData.get('status_manejo_organico') || '',
                anos_manejo_organico: this.toInt(formData.get('anos_manejo_organico')),
                comprovacao_manejo: comprovacao,
                historico_ultimos_10_anos: historico,
                relato_historico_recente: formData.get('relato_historico_recente') || ''
            },
            activities,
            escopos: scopes,
            mao_de_obra: {
                permanentes: this.toInt(formData.get('funcionarios_permanentes')),
                temporarios: this.toInt(formData.get('funcionarios_temporarios')),
                familiares: this.toInt(formData.get('funcionarios_familiares')),
                voluntarios: this.toInt(formData.get('funcionarios_voluntarios'))
            },
            croqui: {
                local_insercao_croqui: formData.get('local_insercao_croqui') || '',
                itens_obrigatorios_localizados: formData.getAll('itens_obrigatorios_localizados[]')
            },
            biodiversidade_e_ambiente: {
                preservacao_ambiental: formData.getAll('preservacao_ambiental[]'),
                possui_car: formData.get('possui_car') || '',
                situacao_car: formData.get('situacao_car') || '',
                destino_lixo_organico: formData.get('destino_lixo_organico') || '',
                destino_lixo_nao_organico: formData.get('destino_lixo_nao_organico') || '',
                destino_esgoto: formData.get('destino_esgoto') || ''
            },
            manejo_da_agua: {
                periodicidade_analise_irrigacao: formData.get('periodicidade_analise_irrigacao') || '',
                fontes_agua_uso: fontesAgua
            },
            regularizacao_ambiental: {
                possui_car: formData.get('regularizacao_possui_car') || '',
                explicacao_reserva_legal: formData.get('explicacao_reserva_legal') || ''
            },
            producao_subsistencia_ornamental: {
                possui_nao_organica: this.toBoolean(formData.get('possui_nao_organica')),
                atividades: atividadesSubsistencia,
                utiliza_insumos_nao_permitidos: this.toBoolean(formData.get('utiliza_insumos_nao_permitidos')),
                risco_contaminacao: formData.get('risco_contaminacao') || '',
                manejo_bloqueio_riscos: formData.get('manejo_bloqueio_riscos') || ''
            },
            producao_paralela: {
                possui_paralela: this.toBoolean(formData.get('possui_paralela')),
                atividades: atividadesParalela,
                utiliza_insumos_nao_permitidos: this.toBoolean(formData.get('paralela_insumos_nao_permitidos')),
                risco_contaminacao: formData.get('paralela_risco_contaminacao') || '',
                manejo_bloqueio_riscos: formData.get('paralela_manejo_bloqueio') || '',
                pretende_conversao_total: this.toBoolean(formData.get('pretende_conversao_total')),
                tempo_conversao: formData.get('tempo_conversao') || ''
            },
            comercializacao: {
                canal_comercializacao: formData.getAll('canal_comercializacao[]'),
                inicio_vendas: formData.get('inicio_vendas') || '',
                percentual_venda_organica: this.toInt(formData.get('percentual_venda_organica')),
                vende_nao_organicos: this.toBoolean(formData.get('vende_nao_organicos')),
                como_separa_comercializacao: formData.get('como_separa_comercializacao') || '',
                sistema_rotulagem: formData.get('sistema_rotulagem') || '',
                sistema_rastreabilidade_comercial: formData.get('sistema_rastreabilidade_comercial') || '',
                transporte: formData.get('transporte') || ''
            },
            controles_e_registros: {
                tipo_registro: formData.getAll('tipo_registro[]'),
                descricao_caderno_campo: formData.get('descricao_caderno_campo') || '',
                sistema_rastreabilidade_interno: formData.get('sistema_rastreabilidade_interno') || '',
                controle_estoque: formData.get('controle_estoque') || '',
                tempo_registros: formData.get('tempo_registros') || ''
            },
            producao_subsistencia: {
                possui_subsistencia: this.toBoolean(formData.get('possui_subsistencia')),
                produtos_subsistencia: formData.get('produtos_subsistencia') || '',
                area_subsistencia: this.toNumber(formData.get('area_subsistencia')),
                separacao_subsistencia: formData.get('separacao_subsistencia') || '',
                insumos_subsistencia: formData.get('insumos_subsistencia') || '',
                armazenamento_subsistencia: formData.get('armazenamento_subsistencia') || ''
            },
            declaracoes_conformidade: {
                veracidade_e_comunicacao: formData.get('veracidade_e_comunicacao') || '',
                conhecimento_normas: formData.get('conhecimento_normas') || '',
                conhecimento_regras_spg: formData.get('conhecimento_regras_spg') || '',
                concordancia_verificacao_acesso: formData.get('concordancia_verificacao_acesso') || '',
                concordancia_informacao_adicional: formData.get('concordancia_informacao_adicional') || '',
                ciente_visitas_amostras: formData.get('ciente_visitas_amostras') || '',
                aceite_condicoes_corretivas: formData.get('aceite_condicoes_corretivas') || '',
                total_conhecimento_conviccao: formData.get('total_conhecimento_conviccao') || ''
            }
        };

        return { metadata, dados };
    },

    async restore() {
        const saved = await this.state.storage.load(this.config.storageKey);
        if (!saved) {
            PMOTable.initAll();
            return;
        }

        const dados = saved.dados || {};
        const metadata = saved.metadata || {};

        this.setRadioValue('tipo_pessoa', dados.tipo_pessoa);
        this.setRadioValue('pretende_certificar', dados.pretende_certificar ? 'sim' : 'nao');

        if (dados.identificacao) {
            this.setFieldValue('cpf_cnpj', dados.identificacao.cpf_cnpj);
            this.setFieldValue('inscricao_estadual', dados.identificacao.inscricao_estadual);
            this.setFieldValue('caf_numero', dados.identificacao.caf_numero);
            this.setFieldValue('grupo_spg', dados.identificacao.grupo_spg);
            this.setFieldValue('data_preenchimento_pmo', dados.identificacao.data_preenchimento_pmo);
            this.setFieldValue('nome_fantasia', dados.identificacao.nome_fantasia);
            this.setFieldValue('nome_unidade_producao', dados.identificacao.nome_unidade_producao);
        }

        if (typeof PMOTable !== 'undefined') {
            if (dados.identificacao?.fornecedores_responsaveis) {
                PMOTable.setTableData('tabela-fornecedores-responsaveis', dados.identificacao.fornecedores_responsaveis);
            }
            if (dados.manejo_organico?.comprovacao_manejo) {
                PMOTable.setTableData('tabela-comprovacao-manejo', dados.manejo_organico.comprovacao_manejo.map((item) => ({
                    tipo: item.tipo || '',
                    status: String(item.status)
                })));
            }
            if (dados.manejo_organico?.historico_ultimos_10_anos) {
                PMOTable.setTableData('tabela-historico-ultimos-anos', dados.manejo_organico.historico_ultimos_10_anos.map((item) => ({
                    cultura_animal: item.cultura_animal || '',
                    data_ultima_aplicacao_nao_permitido: item.data_ultima_aplicacao_nao_permitido || '',
                    insumo_utilizado: item.insumo_utilizado || '',
                    estavam_sob_manejo_organico: String(item.estavam_sob_manejo_organico),
                    eram_certificados: String(item.eram_certificados)
                })));
            }
            if (dados.manejo_da_agua?.fontes_agua_uso) {
                PMOTable.setTableData('tabela-fontes-agua', dados.manejo_da_agua.fontes_agua_uso);
            }
            if (dados.producao_subsistencia_ornamental?.atividades) {
                PMOTable.setTableData('tabela-atividades-subsistencia-ornamental', dados.producao_subsistencia_ornamental.atividades);
            }
            if (dados.producao_paralela?.atividades) {
                PMOTable.setTableData('tabela-producao-paralela', dados.producao_paralela.atividades);
            }
        }

        if (dados.contato) {
            this.setFieldValue('telefone', dados.contato.telefone);
            this.setFieldValue('email', dados.contato.email);
            if (dados.contato.endereco) {
                this.setFieldValue('logradouro', dados.contato.endereco.logradouro);
                this.setFieldValue('bairro', dados.contato.endereco.bairro);
                this.setFieldValue('municipio', dados.contato.endereco.municipio);
                this.setFieldValue('uf', dados.contato.endereco.uf);
                this.setFieldValue('cep', dados.contato.endereco.cep);
                const latitude = this.safeValue(dados.contato.endereco.coordenadas?.latitude);
                const longitude = this.safeValue(dados.contato.endereco.coordenadas?.longitude);
                this.setFieldValue('latitude', latitude);
                this.setFieldValue('longitude', longitude);
                const coordInput = this.form.elements['coordenadas_google_maps'];
                if (coordInput && latitude && longitude) {
                    coordInput.value = `${latitude}, ${longitude}`;
                }
            }
            this.setFieldValue('roteiro_acesso', dados.contato.roteiro_acesso);
        }

        if (dados.propriedade) {
            this.setFieldValue('posse_terra', dados.propriedade.posse_terra);
            this.setFieldValue('area_total_propriedade_ha', this.safeValue(dados.propriedade.area_total_propriedade_ha));
            this.setFieldValue('area_total_organica_ha', this.safeValue(dados.propriedade.area_total_organica_ha));
            this.setFieldValue('relacao_unidade_producao', dados.propriedade.relacao_unidade_producao);
            this.setFieldValue('data_aquisicao_posse', dados.propriedade.data_aquisicao_posse);
            this.setRadioValue('terra_familiar', dados.propriedade.terra_familiar ? 'sim' : 'nao');
        }

        if (dados.manejo_organico) {
            this.setFieldValue('historico_propriedade', dados.manejo_organico.historico_propriedade);
            this.setFieldValue('topografia_e_utilizacao', dados.manejo_organico.topografia_e_utilizacao);
            this.setFieldValue('status_manejo_organico', dados.manejo_organico.status_manejo_organico);
            this.setFieldValue('anos_manejo_organico', this.safeValue(dados.manejo_organico.anos_manejo_organico));
            this.setFieldValue('relato_historico_recente', dados.manejo_organico.relato_historico_recente);
        }

        const scopes = saved.escopos || dados.activities || {};
        Object.entries(scopes).forEach(([name, value]) => {
            if (!name.startsWith('escopo_')) return;
            const field = this.form.elements[name];
            if (field) field.checked = Boolean(value);
        });

        if (dados.mao_de_obra) {
            this.setFieldValue('funcionarios_permanentes', this.safeValue(dados.mao_de_obra.permanentes));
            this.setFieldValue('funcionarios_temporarios', this.safeValue(dados.mao_de_obra.temporarios));
            this.setFieldValue('funcionarios_familiares', this.safeValue(dados.mao_de_obra.familiares));
            this.setFieldValue('funcionarios_voluntarios', this.safeValue(dados.mao_de_obra.voluntarios));
        }

        if (dados.croqui) {
            this.setFieldValue('local_insercao_croqui', dados.croqui.local_insercao_croqui);
            this.setCheckboxGroup('itens_obrigatorios_localizados[]', dados.croqui.itens_obrigatorios_localizados);
        }

        if (dados.biodiversidade_e_ambiente) {
            this.setCheckboxGroup('preservacao_ambiental[]', dados.biodiversidade_e_ambiente.preservacao_ambiental);
            this.setFieldValue('possui_car', dados.biodiversidade_e_ambiente.possui_car);
            this.setFieldValue('situacao_car', dados.biodiversidade_e_ambiente.situacao_car);
            this.setFieldValue('destino_lixo_organico', dados.biodiversidade_e_ambiente.destino_lixo_organico);
            this.setFieldValue('destino_lixo_nao_organico', dados.biodiversidade_e_ambiente.destino_lixo_nao_organico);
            this.setFieldValue('destino_esgoto', dados.biodiversidade_e_ambiente.destino_esgoto);
        }

        if (dados.manejo_da_agua) {
            this.setFieldValue('periodicidade_analise_irrigacao', dados.manejo_da_agua.periodicidade_analise_irrigacao);
        }

        if (dados.regularizacao_ambiental) {
            this.setFieldValue('regularizacao_possui_car', dados.regularizacao_ambiental.possui_car);
            this.setFieldValue('explicacao_reserva_legal', dados.regularizacao_ambiental.explicacao_reserva_legal);
        }

        if (dados.producao_subsistencia_ornamental) {
            this.setRadioValue('possui_nao_organica', dados.producao_subsistencia_ornamental.possui_nao_organica ? 'sim' : 'nao');
            this.setRadioValue('utiliza_insumos_nao_permitidos', dados.producao_subsistencia_ornamental.utiliza_insumos_nao_permitidos ? 'sim' : 'nao');
            this.setFieldValue('risco_contaminacao', dados.producao_subsistencia_ornamental.risco_contaminacao);
            this.setFieldValue('manejo_bloqueio_riscos', dados.producao_subsistencia_ornamental.manejo_bloqueio_riscos);
        }

        if (dados.producao_paralela) {
            this.setRadioValue('possui_paralela', dados.producao_paralela.possui_paralela ? 'sim' : 'nao');
            this.setRadioValue('paralela_insumos_nao_permitidos', dados.producao_paralela.utiliza_insumos_nao_permitidos ? 'sim' : 'nao');
            this.setFieldValue('paralela_risco_contaminacao', dados.producao_paralela.risco_contaminacao);
            this.setFieldValue('paralela_manejo_bloqueio', dados.producao_paralela.manejo_bloqueio_riscos);
            this.setRadioValue('pretende_conversao_total', dados.producao_paralela.pretende_conversao_total ? 'sim' : 'nao');
            this.setFieldValue('tempo_conversao', dados.producao_paralela.tempo_conversao);
        }

        if (dados.comercializacao) {
            this.setCheckboxGroup('canal_comercializacao[]', dados.comercializacao.canal_comercializacao);
            this.setFieldValue('inicio_vendas', dados.comercializacao.inicio_vendas);
            this.setFieldValue('percentual_venda_organica', this.safeValue(dados.comercializacao.percentual_venda_organica));
            this.setRadioValue('vende_nao_organicos', dados.comercializacao.vende_nao_organicos ? 'sim' : 'nao');
            this.setFieldValue('como_separa_comercializacao', dados.comercializacao.como_separa_comercializacao);
            this.setFieldValue('sistema_rotulagem', dados.comercializacao.sistema_rotulagem);
            this.setFieldValue('sistema_rastreabilidade_comercial', dados.comercializacao.sistema_rastreabilidade_comercial);
            this.setFieldValue('transporte', dados.comercializacao.transporte);
        }

        if (dados.controles_e_registros) {
            this.setCheckboxGroup('tipo_registro[]', dados.controles_e_registros.tipo_registro);
            this.setFieldValue('descricao_caderno_campo', dados.controles_e_registros.descricao_caderno_campo);
            this.setFieldValue('sistema_rastreabilidade_interno', dados.controles_e_registros.sistema_rastreabilidade_interno);
            this.setFieldValue('controle_estoque', dados.controles_e_registros.controle_estoque);
            this.setFieldValue('tempo_registros', dados.controles_e_registros.tempo_registros);
        }

        if (dados.producao_subsistencia) {
            this.setRadioValue('possui_subsistencia', dados.producao_subsistencia.possui_subsistencia ? 'sim' : 'nao');
            this.setFieldValue('produtos_subsistencia', dados.producao_subsistencia.produtos_subsistencia);
            this.setFieldValue('area_subsistencia', this.safeValue(dados.producao_subsistencia.area_subsistencia));
            this.setFieldValue('separacao_subsistencia', dados.producao_subsistencia.separacao_subsistencia);
            this.setFieldValue('insumos_subsistencia', dados.producao_subsistencia.insumos_subsistencia);
            this.setFieldValue('armazenamento_subsistencia', dados.producao_subsistencia.armazenamento_subsistencia);
        }

        if (dados.declaracoes_conformidade) {
            Object.entries(dados.declaracoes_conformidade).forEach(([key, value]) => {
                this.setFieldValue(key, value);
            });
        }

        this.updateConditionalSections();
        PMOScopeManager.syncFromCadastroGeralPMO();
    },

    async salvar(silent = false) {
        const payload = this.serialize();
        await this.state.storage.save(this.config.storageKey, payload);

        const pmoId = this.ensureActivePMO(payload);
        if (pmoId) {
            PMOStorageManager.updateFormulario(pmoId, this.config.moduleName, payload);
        }

        this.state.isModified = false;

        document.dispatchEvent(new CustomEvent('pmo-form-saved', {
            detail: {
                module: this.config.moduleName,
                data: payload
            }
        }));

        if (!silent) {
            PMOFramework.notify('Dados salvos com sucesso!', 'success');
        }
    },

    ensureActivePMO(payload) {
        if (!window.PMOStorageManager) {
            return null;
        }

        const ativo = PMOStorageManager.getActivePMO();
        if (ativo) {
            return ativo.id;
        }

        const dados = payload.dados || {};
        const identificacao = dados.identificacao || {};

        if (!identificacao.cpf_cnpj || !identificacao.nome_unidade_producao) {
            return null;
        }

        const id = PMOStorageManager.createPMO({
            cpf_cnpj: identificacao.cpf_cnpj,
            nome: identificacao.nome_fantasia || identificacao.nome_unidade_producao || 'PMO',
            unidade: identificacao.nome_unidade_producao || 'Unidade',
            grupo_spg: identificacao.grupo_spg || '',
            ano_vigente: payload.metadata?.ano_vigente || new Date().getFullYear()
        });

        PMOStorageManager.setActivePMO(id);
        return id;
    },

    ensureMinimumRows(ids) {
        if (typeof PMOTable === 'undefined') return;
        ids.forEach((tableId) => {
            const table = document.getElementById(tableId);
            if (!table) return;
            const rowCount = table.querySelectorAll('tbody tr').length;
            if (rowCount === 0) {
                PMOTable.addRow(tableId);
            }
        });
    },

    setFieldValue(name, value) {
        const field = this.form.elements[name];
        if (!field || value === undefined || value === null) return;

        if (field instanceof RadioNodeList) {
            this.setRadioValue(name, value);
        } else if (field.tagName === 'SELECT' || field.tagName === 'TEXTAREA' || 'value' in field) {
            field.value = value;
        }
    },

    setRadioValue(name, value) {
        const list = this.form.elements[name];
        if (!(list instanceof RadioNodeList)) return;
        [...list].forEach((input) => {
            input.checked = input.value === String(value);
        });
    },

    setCheckboxGroup(name, values = []) {
        const inputs = this.form.querySelectorAll(`input[name="${name}"]`);
        if (!inputs.length) return;
        inputs.forEach((input) => {
            input.checked = values.includes(input.value);
        });
    },

    getRadioValue(name) {
        const list = this.form.elements[name];
        if (list instanceof RadioNodeList) {
            const checked = [...list].find((input) => input.checked);
            return checked ? checked.value : null;
        }
        return null;
    },

    toBoolean(value) {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            return ['true', 'sim', '1', 'on'].includes(value.toLowerCase());
        }
        return Boolean(value);
    },

    toNumber(value) {
        if (value === null || value === undefined || value === '') return null;
        const num = Number(value);
        return Number.isNaN(num) ? null : num;
    },

    toInt(value) {
        const num = this.toNumber(value);
        return typeof num === 'number' ? Math.trunc(num) : null;
    },

    safeValue(value) {
        return value === null || value === undefined ? '' : value;
    },

    slugify(value) {
        return value
            ? value
                .toString()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .toLowerCase()
            : '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CadastroGeralPMO.init();
});
