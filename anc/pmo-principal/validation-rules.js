/**
 * PMO Principal - Regras de Valida��o
 * Regras espec�ficas de valida��o conforme Portaria 52/2021 MAPA
 * @version 2.0
 * @author ANC - Associa��o de Agricultura Natural de Campinas e Regi�o
 */

const PMOValidationRules = {
    /**
     * Validar se��o de identifica��o
     */
    validateIdentificacao() {
        const errors = [];
        const warnings = [];

        const tipoPessoa = document.getElementById('tipo_pessoa').value;
        const nomeCompleto = document.getElementById('nome_completo').value;
        const cpf = document.getElementById('cpf')?.value;
        const cnpj = document.getElementById('cnpj')?.value;

        // Validar tipo de pessoa
        if (!tipoPessoa) {
            errors.push('Se��o 1: Tipo de pessoa n�o selecionado');
        }

        // Validar documento correspondente
        if (tipoPessoa === 'fisica' && !cpf) {
            errors.push('Se��o 1: CPF obrigat�rio para pessoa f�sica');
        }

        if (tipoPessoa === 'juridica' && !cnpj) {
            errors.push('Se��o 1: CNPJ obrigat�rio para pessoa jur�dica');
        }

        // Validar nome completo
        if (nomeCompleto.length < 3) {
            errors.push('Se��o 1: Nome completo deve ter pelo menos 3 caracteres');
        }

        return { errors, warnings };
    },

    /**
     * Validar se��o de contato
     */
    validateContato() {
        const errors = [];
        const warnings = [];

        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;

        // Validar telefone (m�nimo 10 d�gitos)
        const telefoneDigits = telefone.replace(/\D/g, '');
        if (telefoneDigits.length < 10) {
            errors.push('Se��o 2: Telefone inv�lido (m�nimo 10 d�gitos)');
        }

        // Validar email (regex b�sico)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Se��o 2: E-mail inv�lido');
        }

        return { errors, warnings };
    },

    /**
     * Validar se��o de endere�o
     */
    validateEndereco() {
        const errors = [];
        const warnings = [];

        const cep = document.getElementById('cep').value;
        const endereco = document.getElementById('endereco').value;
        const bairro = document.getElementById('bairro').value;
        const municipio = document.getElementById('municipio').value;
        const uf = document.getElementById('uf').value;

        // Validar CEP
        const cepDigits = cep.replace(/\D/g, '');
        if (cepDigits.length !== 8) {
            errors.push('Se��o 3: CEP inv�lido (deve ter 8 d�gitos)');
        }

        // Validar campos obrigat�rios
        if (!endereco || endereco.length < 5) {
            errors.push('Se��o 3: Endere�o incompleto');
        }

        if (!bairro) {
            errors.push('Se��o 3: Bairro n�o informado');
        }

        if (!municipio) {
            errors.push('Se��o 3: Munic�pio n�o informado');
        }

        if (!uf) {
            errors.push('Se��o 3: UF n�o selecionada');
        }

        // Avisos
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        if (!latitude || !longitude) {
            warnings.push('Se��o 3: Coordenadas geogr�ficas n�o informadas (recomendado)');
        }

        return { errors, warnings };
    },

    /**
     * Validar se��o de propriedade
     */
    validatePropriedade() {
        const errors = [];
        const warnings = [];

        const posseTerra = document.getElementById('posse_terra').value;
        const areaTotal = parseFloat(document.getElementById('area_total_ha').value);
        const cafNumero = document.getElementById('caf_numero').value;
        const cafNaoPossui = document.getElementById('caf_nao_possui').checked;
        const terraFamiliar = document.getElementById('terra_familiar').checked;

        // Validar posse da terra
        if (!posseTerra) {
            errors.push('Se��o 4: Situa��o da posse da terra n�o informada');
        }

        // Validar �rea total
        if (isNaN(areaTotal) || areaTotal <= 0) {
            errors.push('Se��o 4: �rea total inv�lida');
        }

        // Validar CAF para agricultura familiar
        if (terraFamiliar && !cafNumero && !cafNaoPossui) {
            warnings.push('Se��o 4: Recomenda-se informar o CAF para agricultura familiar');
        }

        // Alertar sobre �rea muito pequena ou muito grande
        if (areaTotal < 0.5) {
            warnings.push('Se��o 4: �rea muito pequena (< 0.5 ha). Verificar se est� correto.');
        } else if (areaTotal > 1000) {
            warnings.push('Se��o 4: �rea muito grande (> 1000 ha). Verificar se est� correto.');
        }

        return { errors, warnings };
    },

    /**
     * Validar se��o de manejo org�nico
     */
    validateManejoOrganico() {
        const errors = [];
        const warnings = [];

        const anosManejo = parseInt(document.getElementById('anos_manejo_organico').value);
        const situacaoManejo = document.getElementById('situacao_manejo').value;

        // Validar anos de manejo
        if (isNaN(anosManejo) || anosManejo < 0) {
            errors.push('Se��o 5: Anos de manejo org�nico inv�lido');
        }

        // Validar situa��o do manejo
        if (!situacaoManejo) {
            errors.push('Se��o 5: Situa��o do manejo n�o informada');
        }

        // Avisos sobre per�odo de convers�o
        if (situacaoManejo === 'em_conversao' && anosManejo < 1) {
            warnings.push('Se��o 5: Per�odo de convers�o m�nimo de 12 meses conforme legisla��o');
        }

        if (situacaoManejo === 'convencional') {
            warnings.push('Se��o 5: Produ��o convencional em convers�o. Certifica��o s� ap�s per�odo de convers�o completo.');
        }

        return { errors, warnings };
    },

    /**
     * Validar se��o de respons�veis
     */
    validateResponsaveis() {
        const errors = [];
        const warnings = [];

        const tbody = document.getElementById('tbody-responsaveis');
        const rows = tbody.querySelectorAll('tr');

        if (rows.length === 0) {
            errors.push('Se��o 6: Nenhum respons�vel cadastrado');
            return { errors, warnings };
        }

        // Validar cada respons�vel
        rows.forEach((row, index) => {
            const nome = row.querySelector('[name="responsavel_nome[]"]')?.value;
            const cpf = row.querySelector('[name="responsavel_cpf[]"]')?.value;
            const funcao = row.querySelector('[name="responsavel_funcao[]"]')?.value;

            if (!nome || nome.length < 3) {
                errors.push(`Se��o 6 (Linha ${index + 1}): Nome do respons�vel inv�lido`);
            }

            if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
                errors.push(`Se��o 6 (Linha ${index + 1}): CPF inv�lido`);
            }

            if (!funcao) {
                errors.push(`Se��o 6 (Linha ${index + 1}): Fun��o n�o informada`);
            }
        });

        return { errors, warnings };
    },

    /**
     * Validar se��o de atividades
     */
    validateAtividades() {
        const errors = [];
        const warnings = [];

        // Verificar se pelo menos uma atividade foi marcada
        const atividades = [
            'atividade_hortalicas',
            'atividade_frutas',
            'atividade_graos',
            'atividade_plantas_medicinais',
            'atividade_pecuaria',
            'atividade_apicultura',
            'atividade_cogumelos',
            'atividade_processamento'
        ];

        const algumaMarcada = atividades.some(id =>
            document.getElementsByName(id)[0]?.checked
        );

        if (!algumaMarcada) {
            errors.push('Se��o 7: Nenhuma atividade org�nica selecionada');
        }

        // Validar �reas informadas
        atividades.forEach(atividade => {
            const checkbox = document.getElementsByName(atividade)[0];
            if (checkbox?.checked) {
                const atividadeNome = atividade.replace('atividade_', '');
                const areaInput = document.getElementsByName(`area_${atividadeNome}_ha`)[0] ||
                                 document.getElementsByName(`area_${atividadeNome}_m2`)[0];

                if (areaInput && (!areaInput.value || parseFloat(areaInput.value) <= 0)) {
                    warnings.push(`Se��o 7: �rea n�o informada para ${atividadeNome}`);
                }
            }
        });

        return { errors, warnings };
    },

    /**
     * Validar se��o de hist�rico
     */
    validateHistorico() {
        const errors = [];
        const warnings = [];

        const semAplicacoes = document.getElementById('sem_aplicacoes').checked;
        const tbody = document.getElementById('tbody-historico');
        const rows = tbody.querySelectorAll('tr');

        if (!semAplicacoes && rows.length === 0) {
            warnings.push('Se��o 8: Hist�rico de aplica��es n�o preenchido. Se n�o houve aplica��es, marque a op��o correspondente.');
        }

        // Validar data das aplica��es (n�o pode ser futura)
        const hoje = new Date();
        rows.forEach((row, index) => {
            const dataInput = row.querySelector('[name="historico_data[]"]');
            if (dataInput?.value) {
                const dataAplicacao = new Date(dataInput.value);
                if (dataAplicacao > hoje) {
                    errors.push(`Se��o 8 (Linha ${index + 1}): Data de aplica��o no futuro`);
                }

                // Verificar se � muito antiga (mais de 3 anos)
                const tresAnosAtras = new Date();
                tresAnosAtras.setFullYear(tresAnosAtras.getFullYear() - 3);

                if (dataAplicacao < tresAnosAtras) {
                    warnings.push(`Se��o 8 (Linha ${index + 1}): Aplica��o h� mais de 3 anos. �rea j� pode estar em convers�o completa.`);
                }
            }
        });

        return { errors, warnings };
    },

    /**
     * Validar se��o de produtos
     */
    validateProdutos() {
        const errors = [];
        const warnings = [];

        const tbody = document.getElementById('tbody-produtos');
        const rows = tbody.querySelectorAll('tr');

        if (rows.length === 0) {
            errors.push('Se��o 9: Nenhum produto cadastrado para certifica��o (obrigat�rio)');
            return { errors, warnings };
        }

        // Validar cada produto
        rows.forEach((row, index) => {
            const produto = row.querySelector('[name="produto_nome[]"]')?.value;
            const estimativa = row.querySelector('[name="produto_estimativa[]"]')?.value;
            const origem = row.querySelector('[name="produto_origem[]"]')?.value;

            if (!produto || produto.length < 2) {
                errors.push(`Se��o 9 (Linha ${index + 1}): Nome do produto inv�lido`);
            }

            if (!estimativa) {
                warnings.push(`Se��o 9 (Linha ${index + 1}): Estimativa de produ��o n�o informada`);
            }

            if (origem === 'comprada_nao_organica') {
                warnings.push(`Se��o 9 (Linha ${index + 1}): Sementes/mudas n�o org�nicas. Justificar indisponibilidade no mercado.`);
            }
        });

        return { errors, warnings };
    },

    /**
     * Validar se��o de preserva��o ambiental
     */
    validatePreservacao() {
        const errors = [];
        const warnings = [];

        const possuiCAR = document.getElementById('possui_car').value;
        const situacaoCAR = document.getElementById('situacao_car')?.value;

        // Validar CAR
        if (!possuiCAR) {
            errors.push('Se��o 10: Informa��o sobre CAR n�o fornecida');
        }

        if (possuiCAR === 'sim' && !situacaoCAR) {
            errors.push('Se��o 10: Situa��o do CAR n�o informada');
        }

        if (possuiCAR === 'nao') {
            warnings.push('Se��o 10: CAR � obrigat�rio conforme C�digo Florestal (Lei 12.651/2012)');
        }

        // Validar destino de res�duos
        const destinoOrganico = document.getElementById('destino_lixo_organico').value;
        const destinoNaoOrganico = document.getElementById('destino_lixo_nao_organico').value;

        if (destinoOrganico === 'queima') {
            warnings.push('Se��o 10: Queima de lixo org�nico n�o � recomendada. Prefira compostagem.');
        }

        if (destinoNaoOrganico === 'queima' || destinoNaoOrganico === 'enterro') {
            warnings.push('Se��o 10: Destino inadequado para lixo n�o org�nico. Prefira coleta seletiva.');
        }

        return { errors, warnings };
    },

    /**
     * Validar se��o de recursos h�dricos
     */
    validateRecursosHidricos() {
        const errors = [];
        const warnings = [];

        const tbody = document.getElementById('tbody-recursos-hidricos');
        const rows = tbody.querySelectorAll('tr');

        // Validar riscos de contamina��o
        rows.forEach((row, index) => {
            const nivelRisco = row.querySelector('[name="agua_nivel_risco[]"]')?.value;
            const garantia = row.querySelector('[name="agua_garantia[]"]')?.value;

            if (nivelRisco === 'alto' || nivelRisco === 'medio') {
                if (!garantia || garantia.length < 5) {
                    warnings.push(`Se��o 11 (Linha ${index + 1}): Risco de contamina��o ${nivelRisco}. Descreva medidas de garantia de qualidade.`);
                }
            }
        });

        return { errors, warnings };
    },

    /**
     * Validar se��o de comercializa��o
     */
    validateComercializacao() {
        const errors = [];
        const warnings = [];

        // Verificar se pelo menos um canal foi marcado
        const canais = [
            'comercio_feira',
            'comercio_csa',
            'comercio_entrega_domicilio',
            'comercio_venda_propriedade',
            'comercio_pnae',
            'comercio_paa',
            'comercio_supermercado',
            'comercio_cooperativa',
            'comercio_intermediario',
            'comercio_industria'
        ];

        const algumMarcado = canais.some(id =>
            document.getElementsByName(id)[0]?.checked
        );

        if (!algumMarcado) {
            warnings.push('Se��o 12: Nenhum canal de comercializa��o selecionado');
        }

        // Validar produ��o paralela
        const comercializaNaoOrganicos = document.getElementById('comercializa_nao_organicos').value;
        const separacaoProdutos = document.getElementById('separacao_produtos')?.value;

        if (comercializaNaoOrganicos === 'sim' && (!separacaoProdutos || separacaoProdutos.length < 5)) {
            errors.push('Se��o 12: Descreva como separa produtos org�nicos de n�o org�nicos');
        }

        return { errors, warnings };
    },

    /**
     * Validar se��o de controles
     */
    validateControles() {
        const errors = [];
        const warnings = [];

        // Verificar se mant�m pelo menos um controle
        const controles = [
            'controle_caderno_campo',
            'controle_plantio',
            'controle_colheita',
            'controle_vendas',
            'controle_insumos',
            'controle_estoque',
            'controle_rastreabilidade',
            'controle_nao_conformidades'
        ];

        const algumMarcado = controles.some(id =>
            document.getElementsByName(id)[0]?.checked
        );

        if (!algumMarcado) {
            warnings.push('Se��o 13: Nenhum controle/registro marcado. Sistema de rastreabilidade � obrigat�rio conforme IN 19/2011.');
        }

        // Rastreabilidade � obrigat�rio
        if (!document.getElementsByName('controle_rastreabilidade')[0]?.checked) {
            warnings.push('Se��o 13: Sistema de rastreabilidade � obrigat�rio para certifica��o org�nica');
        }

        return { errors, warnings };
    },

    /**
     * Validar se��o de produ��o paralela
     */
    validateProducaoParalela() {
        const errors = [];
        const warnings = [];

        const possuiParalela = document.getElementById('possui_paralela').value;

        if (possuiParalela === 'sim') {
            const usaNaoPermitidos = document.getElementById('paralela_usa_nao_permitidos')?.value;
            const risco = document.getElementById('paralela_risco')?.value;
            const bloqueios = document.getElementById('paralela_bloqueios')?.value;

            if (!risco || risco.length < 5) {
                errors.push('Se��o 15: Descreva os riscos de contamina��o da produ��o paralela');
            }

            if (!bloqueios || bloqueios.length < 5) {
                errors.push('Se��o 15: Descreva os manejos de bloqueio/separa��o entre produ��o org�nica e convencional');
            }

            if (usaNaoPermitidos === 'sim') {
                warnings.push('Se��o 15: Produ��o paralela com insumos n�o permitidos requer aten��o redobrada na separa��o');
            }

            warnings.push('Se��o 15: Produ��o paralela � permitida mas n�o recomendada. Considere convers�o total.');
        }

        return { errors, warnings };
    },

    /**
     * Validar se��o de documentos
     */
    validateDocumentos() {
        const errors = [];
        const warnings = [];

        // Verificar croqui (obrigat�rio)
        const croquiInput = document.querySelector('[name="documento_croqui"]');
        if (!croquiInput?.files || croquiInput.files.length === 0) {
            errors.push('Se��o 16: Croqui da propriedade � obrigat�rio');
        }

        // CAR recomendado
        const possuiCAR = document.getElementById('possui_car').value;
        const carInput = document.querySelector('[name="documento_car"]');
        if (possuiCAR === 'sim' && (!carInput?.files || carInput.files.length === 0)) {
            warnings.push('Se��o 16: Recomenda-se anexar documento do CAR');
        }

        return { errors, warnings };
    },

    /**
     * Validar se��o de declara��es
     */
    validateDeclaracoes() {
        const errors = [];
        const warnings = [];

        const declaracoes = [
            { name: 'declaracao_veracidade', label: 'veracidade das informa��es' },
            { name: 'declaracao_normas', label: 'seguir normas de produ��o org�nica' },
            { name: 'declaracao_visitas', label: 'autorizar visitas de verifica��o' },
            { name: 'declaracao_atualizacao', label: 'comunicar mudan�as no manejo' },
            { name: 'declaracao_rastreabilidade', label: 'manter registros de rastreabilidade' }
        ];

        declaracoes.forEach(dec => {
            const checkbox = document.getElementsByName(dec.name)[0];
            if (!checkbox?.checked) {
                errors.push(`Se��o 17: � obrigat�rio concordar com: ${dec.label}`);
            }
        });

        // Validar data
        const dataPreenchimento = document.getElementById('data_preenchimento').value;
        if (!dataPreenchimento) {
            errors.push('Se��o 17: Data de preenchimento n�o informada');
        } else {
            const data = new Date(dataPreenchimento);
            const hoje = new Date();
            if (data > hoje) {
                errors.push('Se��o 17: Data de preenchimento n�o pode ser futura');
            }
        }

        // Validar assinatura
        const assinatura = document.getElementById('assinatura_responsavel').value;
        if (!assinatura || assinatura.length < 3) {
            errors.push('Se��o 17: Nome do respons�vel n�o informado');
        }

        return { errors, warnings };
    },

    /**
     * Validar formul�rio completo
     */
    validateComplete() {
        const allErrors = [];
        const allWarnings = [];

        // Executar todas as valida��es
        const validations = [
            this.validateIdentificacao(),
            this.validateContato(),
            this.validateEndereco(),
            this.validatePropriedade(),
            this.validateManejoOrganico(),
            this.validateResponsaveis(),
            this.validateAtividades(),
            this.validateHistorico(),
            this.validateProdutos(),
            this.validatePreservacao(),
            this.validateRecursosHidricos(),
            this.validateComercializacao(),
            this.validateControles(),
            this.validateProducaoParalela(),
            this.validateDocumentos(),
            this.validateDeclaracoes()
        ];

        validations.forEach(result => {
            allErrors.push(...result.errors);
            allWarnings.push(...result.warnings);
        });

        return {
            isValid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings
        };
    }
};

// Expor globalmente
window.PMOValidationRules = PMOValidationRules;