/**
 * PMO Principal - Regras de Validação
 * Regras específicas de validação conforme Portaria 52/2021 MAPA
 * @version 2.0
 * @author ANC - Associação de Agricultura Natural de Campinas e Região
 */

const PMOValidationRules = {
    /**
     * Validação completa do formulário
     */
    validateComplete() {
        const errors = [];
        const warnings = [];

        // Validar cada seção
        const sections = [
            this.validateIdentificacao,
            this.validateContato,
            this.validateEndereco,
            this.validatePropriedade,
            this.validateManejoOrganico,
            this.validateResponsaveis,
            this.validateAtividades,
            this.validateHistoricoAplicacoes,
            this.validateProdutosCertificar,
            this.validatePreservacaoAmbiental,
            this.validateRecursosHidricos,
            this.validateComercializacao,
            this.validateControles,
            this.validateSubsistencia,
            this.validateProducaoParalela,
            this.validateDocumentos,
            this.validateDeclaracoes
        ];

        sections.forEach(validateFn => {
            const result = validateFn.call(this);
            errors.push(...result.errors);
            warnings.push(...result.warnings);
        });

        return { errors, warnings };
    },

    /**
     * Validar Seção 1: Identificação
     */
    validateIdentificacao() {
        const errors = [];
        const warnings = [];

        const tipoPessoa = document.getElementById('tipo_pessoa')?.value;
        const nomeCompleto = document.getElementById('nome_completo')?.value;
        const cpf = document.getElementById('cpf')?.value;
        const cnpj = document.getElementById('cnpj')?.value;

        if (!tipoPessoa) {
            errors.push('Seção 1: Selecione o tipo de pessoa (Física ou Jurídica)');
        }

        if (tipoPessoa === 'fisica' && !cpf) {
            errors.push('Seção 1: CPF obrigatório para pessoa física');
        } else if (cpf && !this.validarCPF(cpf)) {
            errors.push('Seção 1: CPF inválido');
        }

        if (tipoPessoa === 'juridica' && !cnpj) {
            errors.push('Seção 1: CNPJ obrigatório para pessoa jurídica');
        } else if (cnpj && !this.validarCNPJ(cnpj)) {
            errors.push('Seção 1: CNPJ inválido');
        }

        if (!nomeCompleto || nomeCompleto.length < 3) {
            errors.push('Seção 1: Nome completo deve ter pelo menos 3 caracteres');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 2: Contato
     */
    validateContato() {
        const errors = [];
        const warnings = [];

        const telefone = document.getElementById('telefone')?.value;
        const email = document.getElementById('email')?.value;

        if (!telefone) {
            errors.push('Seção 2: Telefone é obrigatório');
        }

        if (!email) {
            errors.push('Seção 2: E-mail é obrigatório');
        } else if (!this.validarEmail(email)) {
            errors.push('Seção 2: E-mail inválido');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 3: Endereço
     */
    validateEndereco() {
        const errors = [];
        const warnings = [];

        const cep = document.getElementById('cep')?.value;
        const logradouro = document.getElementById('logradouro')?.value;
        const cidade = document.getElementById('cidade')?.value;
        const estado = document.getElementById('estado')?.value;

        if (!cep) {
            errors.push('Seção 3: CEP é obrigatório');
        }

        if (!logradouro) {
            errors.push('Seção 3: Logradouro é obrigatório');
        }

        if (!cidade) {
            errors.push('Seção 3: Cidade é obrigatória');
        }

        if (!estado) {
            errors.push('Seção 3: Estado é obrigatório');
        }

        const coordenadas = document.getElementById('coordenadas')?.value;
        const latitude = document.getElementById('latitude')?.value;
        const longitude = document.getElementById('longitude')?.value;

        if (!coordenadas || !latitude || !longitude) {
            warnings.push('Seção 3: Coordenadas GPS recomendadas para localização precisa');
        } else {
            // Validar formato das coordenadas
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lon)) {
                errors.push('Seção 3: Coordenadas em formato inválido');
            } else if (lat < -90 || lat > 90) {
                errors.push('Seção 3: Latitude deve estar entre -90 e 90');
            } else if (lon < -180 || lon > 180) {
                errors.push('Seção 3: Longitude deve estar entre -180 e 180');
            }
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 4: Propriedade
     */
    validatePropriedade() {
        const errors = [];
        const warnings = [];

        const posseTerra = document.getElementById('posse_terra')?.value;
        const areaTotal = document.getElementById('area_total')?.value;

        if (!posseTerra) {
            errors.push('Seção 4: Tipo de posse da terra é obrigatório');
        }

        if (!areaTotal || parseFloat(areaTotal) <= 0) {
            errors.push('Seção 4: Área total deve ser maior que zero');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 5: Manejo Orgânico
     */
    validateManejoOrganico() {
        const errors = [];
        const warnings = [];

        const tempoOrganico = document.getElementById('tempo_organico')?.value;

        if (!tempoOrganico) {
            warnings.push('Seção 5: Informe há quanto tempo pratica manejo orgânico');
        } else if (parseInt(tempoOrganico) < 1) {
            warnings.push('Seção 5: Período de conversão orgânica mínimo é 12 meses (Portaria 52/2021)');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 6: Responsáveis pela Produção
     */
    validateResponsaveis() {
        const errors = [];
        const warnings = [];

        const table = document.getElementById('tabela-responsaveis');
        const rows = table?.querySelectorAll('tbody tr:not(template)');

        if (!rows || rows.length === 0) {
            errors.push('Seção 6: Adicione pelo menos um responsável pela produção');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 7: Atividades Orgânicas
     */
    validateAtividades() {
        const errors = [];
        const warnings = [];

        const atividadesChecked = document.querySelectorAll('input[name="atividade_organica"]:checked');

        if (atividadesChecked.length === 0) {
            errors.push('Seção 7: Selecione pelo menos uma atividade orgânica');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 8: Histórico de Aplicações
     */
    validateHistoricoAplicacoes() {
        const errors = [];
        const warnings = [];

        const usouProibidos = document.querySelector('input[name="usou_proibidos"]:checked')?.value;

        if (!usouProibidos) {
            errors.push('Seção 8: Informe se usou insumos não permitidos nos últimos 3 anos');
        }

        if (usouProibidos === 'sim') {
            const table = document.getElementById('tabela-historico-aplicacoes');
            const rows = table?.querySelectorAll('tbody tr:not(template)');

            if (!rows || rows.length === 0) {
                errors.push('Seção 8: Adicione os detalhes das aplicações de insumos não permitidos');
            }

            // Verificar período de conversão
            warnings.push('Seção 8: Produtos com histórico de insumos proibidos precisam de 12 meses de conversão (Portaria 52/2021)');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 9: Produtos a Certificar
     */
    validateProdutosCertificar() {
        const errors = [];
        const warnings = [];

        const table = document.getElementById('tabela-produtos');
        const rows = table?.querySelectorAll('tbody tr:not(template)');

        if (!rows || rows.length === 0) {
            errors.push('Seção 9: Adicione pelo menos um produto para certificação');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 10: Preservação Ambiental
     */
    validatePreservacaoAmbiental() {
        const errors = [];
        const warnings = [];

        const possuiCAR = document.querySelector('input[name="possui_car"]:checked')?.value;

        if (!possuiCAR) {
            errors.push('Seção 10: Informe se possui CAR (Cadastro Ambiental Rural)');
        }

        if (possuiCAR === 'nao') {
            warnings.push('Seção 10: CAR é obrigatório por lei (Lei 12.651/2012). Regularize o mais breve possível.');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 11: Recursos Hídricos
     */
    validateRecursosHidricos() {
        const errors = [];
        const warnings = [];

        const table = document.getElementById('tabela-recursos-hidricos');
        const rows = table?.querySelectorAll('tbody tr:not(template)');

        if (!rows || rows.length === 0) {
            errors.push('Seção 11: Adicione pelo menos uma fonte de água utilizada');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 12: Comercialização
     */
    validateComercializacao() {
        const errors = [];
        const warnings = [];

        const canaisChecked = document.querySelectorAll('input[name="canal_comercializacao"]:checked');

        if (canaisChecked.length === 0) {
            errors.push('Seção 12: Selecione pelo menos um canal de comercialização');
        }

        const vendeNaoOrganicos = document.querySelector('input[name="vende_nao_organicos"]:checked')?.value;

        if (!vendeNaoOrganicos) {
            errors.push('Seção 12: Informe se vende produtos não orgânicos');
        }

        const rotulagem = document.getElementById('sistema_rotulagem')?.value;
        if (!rotulagem) {
            errors.push('Seção 12: Descreva o sistema de rotulagem');
        }

        const rastreabilidade = document.getElementById('sistema_rastreabilidade_comercial')?.value;
        if (!rastreabilidade) {
            errors.push('Seção 12: Descreva o sistema de rastreabilidade na comercialização');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 13: Controles e Registros
     */
    validateControles() {
        const errors = [];
        const warnings = [];

        const registrosChecked = document.querySelectorAll('input[name="tipo_registro"]:checked');

        if (registrosChecked.length === 0) {
            errors.push('Seção 13: Selecione pelo menos um tipo de registro mantido');
        }

        // Verificar se rastreabilidade está marcada
        const rastreabilidadeChecked = document.querySelector('input[name="tipo_registro"][value="rastreabilidade"]:checked');
        if (!rastreabilidadeChecked) {
            errors.push('Seção 13: Sistema de rastreabilidade é OBRIGATÓRIO (IN 19/2011 MAPA)');
        }

        const cadernocampo = document.getElementById('descricao_caderno_campo')?.value;
        if (!cadernocampo) {
            errors.push('Seção 13: Descreva o caderno de campo');
        }

        const rastreabilidadeInterno = document.getElementById('sistema_rastreabilidade_interno')?.value;
        if (!rastreabilidadeInterno) {
            errors.push('Seção 13: Descreva o sistema de rastreabilidade interno');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 14: Produção de Subsistência
     */
    validateSubsistencia() {
        const errors = [];
        const warnings = [];

        const possuiSubsistencia = document.querySelector('input[name="possui_subsistencia"]:checked')?.value;

        if (!possuiSubsistencia) {
            errors.push('Seção 14: Informe se possui produção de subsistência não orgânica');
        }

        if (possuiSubsistencia === 'sim') {
            const separacao = document.getElementById('separacao_subsistencia')?.value;
            if (!separacao) {
                errors.push('Seção 14: Descreva como separa a produção de subsistência da orgânica');
            }
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 15: Produção Paralela
     */
    validateProducaoParalela() {
        const errors = [];
        const warnings = [];

        const possuiParalela = document.querySelector('input[name="possui_producao_paralela"]:checked')?.value;

        if (!possuiParalela) {
            errors.push('Seção 15: Informe se possui produção paralela (orgânica e convencional do mesmo produto)');
        }

        if (possuiParalela === 'sim') {
            warnings.push('Seção 15: Produção paralela aumenta o risco de contaminação e mistura. Não recomendada.');

            const produtos = document.getElementById('produtos_paralelos')?.value;
            const motivo = document.getElementById('motivo_paralela')?.value;
            const separacaoFisica = document.getElementById('separacao_fisica_paralela')?.value;
            const separacaoEquipamentos = document.getElementById('separacao_equipamentos')?.value;
            const separacaoColheita = document.getElementById('separacao_colheita')?.value;
            const rastreabilidadeParalela = document.getElementById('rastreabilidade_paralela')?.value;
            const registrosParalela = document.getElementById('registros_paralela')?.value;

            if (!produtos) errors.push('Seção 15: Liste os produtos produzidos paralelamente');
            if (!motivo) errors.push('Seção 15: Explique o motivo da produção paralela');
            if (!separacaoFisica) errors.push('Seção 15: Descreva a separação física das áreas');
            if (!separacaoEquipamentos) errors.push('Seção 15: Descreva a separação de equipamentos');
            if (!separacaoColheita) errors.push('Seção 15: Descreva a separação na colheita');
            if (!rastreabilidadeParalela) errors.push('Seção 15: Descreva o sistema de rastreabilidade para produção paralela');
            if (!registrosParalela) errors.push('Seção 15: Descreva os registros diferenciados');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 16: Documentos
     */
    validateDocumentos() {
        const errors = [];
        const warnings = [];

        const fileCroqui = document.getElementById('file-croqui');
        if (!fileCroqui || !fileCroqui.files || fileCroqui.files.length === 0) {
            errors.push('Seção 16: Upload do croqui/mapa da propriedade é OBRIGATÓRIO');
        }

        const fileCAR = document.getElementById('file-car');
        if (!fileCAR || !fileCAR.files || fileCAR.files.length === 0) {
            warnings.push('Seção 16: Recomenda-se fazer upload do CAR');
        }

        return { errors, warnings };
    },

    /**
     * Validar Seção 17: Declarações
     */
    validateDeclaracoes() {
        const errors = [];
        const warnings = [];

        const declaraVeracidade = document.querySelector('input[name="declara_veracidade"]:checked');
        const compromissoNormas = document.querySelector('input[name="compromisso_normas"]:checked');
        const compromissoVisitas = document.querySelector('input[name="compromisso_visitas"]:checked');
        const compromissoRegistros = document.querySelector('input[name="compromisso_registros"]:checked');
        const compromissoRastreabilidade = document.querySelector('input[name="compromisso_rastreabilidade"]:checked');
        const compromissoAtualizacao = document.querySelector('input[name="compromisso_atualizacao"]:checked');
        const compromissoParticipacao = document.querySelector('input[name="compromisso_participacao"]:checked');
        const aceitaRegrasSPG = document.querySelector('input[name="aceita_regras_spg"]:checked');

        if (!declaraVeracidade) errors.push('Seção 17: Declaração de veracidade é obrigatória');
        if (!compromissoNormas) errors.push('Seção 17: Compromisso de seguir normas é obrigatório');
        if (!compromissoVisitas) errors.push('Seção 17: Autorização de visitas é obrigatória');
        if (!compromissoRegistros) errors.push('Seção 17: Compromisso de manter registros é obrigatório');
        if (!compromissoRastreabilidade) errors.push('Seção 17: Compromisso de rastreabilidade é obrigatório');
        if (!compromissoAtualizacao) errors.push('Seção 17: Compromisso de comunicar alterações é obrigatório');
        if (!compromissoParticipacao) errors.push('Seção 17: Compromisso de participação é obrigatório');
        if (!aceitaRegrasSPG) errors.push('Seção 17: Aceitação das regras do SPG é obrigatória');

        const nomeDeclarante = document.getElementById('nome_declarante')?.value;
        const cpfDeclarante = document.getElementById('cpf_declarante')?.value;
        const dataDeclaracao = document.getElementById('data_declaracao')?.value;

        if (!nomeDeclarante) errors.push('Seção 17: Nome do responsável é obrigatório');
        if (!cpfDeclarante) errors.push('Seção 17: CPF do responsável é obrigatório');
        else if (!this.validarCPF(cpfDeclarante)) errors.push('Seção 17: CPF do responsável inválido');
        if (!dataDeclaracao) errors.push('Seção 17: Data da declaração é obrigatória');

        return { errors, warnings };
    },

    /**
     * Validar CPF
     */
    validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let digito1 = 11 - (soma % 11);
        if (digito1 > 9) digito1 = 0;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        let digito2 = 11 - (soma % 11);
        if (digito2 > 9) digito2 = 0;

        return parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2;
    },

    /**
     * Validar CNPJ
     */
    validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');

        if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
            return false;
        }

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        return resultado == digitos.charAt(1);
    },

    /**
     * Validar e-mail
     */
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
};

// Expor globalmente
window.PMOValidationRules = PMOValidationRules;