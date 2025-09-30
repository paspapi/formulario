/**
 * PMO Principal - Regras de Validação
 * Regras específicas de validação conforme Portaria 52/2021 MAPA
 * @version 2.0
 * @author ANC - Associação de Agricultura Natural de Campinas e Região
 */

const PMOValidationRules = {
    /**
     * Validar seção de identificação
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
            errors.push('Seção 1: Tipo de pessoa não selecionado');
        }

        // Validar documento correspondente
        if (tipoPessoa === 'fisica' && !cpf) {
            errors.push('Seção 1: CPF obrigatório para pessoa física');
        }

        if (tipoPessoa === 'juridica' && !cnpj) {
            errors.push('Seção 1: CNPJ obrigatório para pessoa jurídica');
        }

        // Validar nome completo
        if (nomeCompleto.length < 3) {
            errors.push('Seção 1: Nome completo deve ter pelo menos 3 caracteres');
        }

        return { errors, warnings };
    },

    /**
     * Validar seção de contato
     */
    validateContato() {
        const errors = [];
        const warnings = [];

        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;

        // Validar telefone (mínimo 10 dígitos)
        const telefoneDigits = telefone.replace(/\D/g, '');
        if (telefoneDigits.length < 10) {
            errors.push('Seção 2: Telefone inválido (mínimo 10 dígitos)');
        }

        // Validar email (regex básico)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Seção 2: E-mail inválido');
        }

        return { errors, warnings };
    },

    /**
     * Validar seção de endereço
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
            errors.push('Seção 3: CEP inválido (deve ter 8 dígitos)');
        }

        // Validar campos obrigatórios
        if (!endereco || endereco.length < 5) {
            errors.push('Seção 3: Endereço incompleto');
        }

        if (!bairro) {
            errors.push('Seção 3: Bairro não informado');
        }

        if (!municipio) {
            errors.push('Seção 3: Município não informado');
        }

        if (!uf) {
            errors.push('Seção 3: UF não selecionada');
        }

        // Avisos
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        if (!latitude || !longitude) {
            warnings.push('Seção 3: Coordenadas geográficas não informadas (recomendado)');
        }

        return { errors, warnings };
    },

    /**
     * Validar seção de propriedade
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
            errors.push('Seção 4: Situação da posse da terra não informada');
        }

        // Validar área total
        if (isNaN(areaTotal) || areaTotal <= 0) {
            errors.push('Seção 4: Área total inválida');
        }

        // Validar CAF para agricultura familiar
        if (terraFamiliar && !cafNumero && !cafNaoPossui) {
            warnings.push('Seção 4: Recomenda-se informar o CAF para agricultura familiar');
        }

        // Alertar sobre área muito pequena ou muito grande
        if (areaTotal < 0.5) {
            warnings.push('Seção 4: Área muito pequena (< 0.5 ha). Verificar se está correto.');
        } else if (areaTotal > 1000) {
            warnings.push('Seção 4: Área muito grande (> 1000 ha). Verificar se está correto.');
        }

        return { errors, warnings };
    },

    /**
     * Validar seção de manejo orgânico
     */
    validateManejoOrganico() {
        const errors = [];
        const warnings = [];

        const anosManejo = parseInt(document.getElementById('anos_manejo_organico').value);
        const situacaoManejo = document.getElementById('situacao_manejo').value;

        // Validar anos de manejo
        if (isNaN(anosManejo) || anosManejo < 0) {
            errors.push('Seção 5: Anos de manejo orgânico inválido');
        }

        // Validar situação do manejo
        if (!situacaoManejo) {
            errors.push('Seção 5: Situação do manejo não informada');
        }

        // Avisos sobre período de conversão
        if (situacaoManejo === 'em_conversao' && anosManejo < 1) {
            warnings.push('Seção 5: Período de conversão mínimo de 12 meses conforme legislação');
        }

        if (situacaoManejo === 'convencional') {
            warnings.push('Seção 5: Produção convencional em conversão. Certificação só após período de conversão completo.');
        }

        return { errors, warnings };
    },

    /**
     * Validar seção de responsáveis
     */
    validateResponsaveis() {
        const errors = [];
        const warnings = [];

        const tbody = document.getElementById('tbody-responsaveis');
        const rows = tbody.querySelectorAll('tr');

        if (rows.length === 0) {
            errors.push('Seção 6: Nenhum responsável cadastrado');
            return { errors, warnings };
        }

        // Validar cada responsável
        rows.forEach((row, index) => {
            const nome = row.querySelector('[name="responsavel_nome[]"]')?.value;
            const cpf = row.querySelector('[name="responsavel_cpf[]"]')?.value;
            const funcao = row.querySelector('[name="responsavel_funcao[]"]')?.value;

            if (!nome || nome.length < 3) {
                errors.push(`Seção 6 (Linha ${index + 1}): Nome do responsável inválido`);
            }

            if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
                errors.push(`Seção 6 (Linha ${index + 1}): CPF inválido`);
            }

            if (!funcao) {
                errors.push(`Seção 6 (Linha ${index + 1}): Função não informada`);
            }
        });

        return { errors, warnings };
    },

    /**
     * Validar seção de atividades
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
            errors.push('Seção 7: Nenhuma atividade orgânica selecionada');
        }

        // Validar áreas informadas
        atividades.forEach(atividade => {
            const checkbox = document.getElementsByName(atividade)[0];
            if (checkbox?.checked) {
                const atividadeNome = atividade.replace('atividade_', '');
                const areaInput = document.getElementsByName(`area_${atividadeNome}_ha`)[0] ||
                                 document.getElementsByName(`area_${atividadeNome}_m2`)[0];

                if (areaInput && (!areaInput.value || parseFloat(areaInput.value) <= 0)) {
                    warnings.push(`Seção 7: Área não informada para ${atividadeNome}`);
                }
            }
        });

        return { errors, warnings };
    },

    /**
     * Validar seção de histórico
     */
    validateHistorico() {
        const errors = [];
        const warnings = [];

        const semAplicacoes = document.getElementById('sem_aplicacoes').checked;
        const tbody = document.getElementById('tbody-historico');
        const rows = tbody.querySelectorAll('tr');

        if (!semAplicacoes && rows.length === 0) {
            warnings.push('Seção 8: Histórico de aplicações não preenchido. Se não houve aplicações, marque a opção correspondente.');
        }

        // Validar data das aplicações (não pode ser futura)
        const hoje = new Date();
        rows.forEach((row, index) => {
            const dataInput = row.querySelector('[name="historico_data[]"]');
            if (dataInput?.value) {
                const dataAplicacao = new Date(dataInput.value);
                if (dataAplicacao > hoje) {
                    errors.push(`Seção 8 (Linha ${index + 1}): Data de aplicação no futuro`);
                }

                // Verificar se é muito antiga (mais de 3 anos)
                const tresAnosAtras = new Date();
                tresAnosAtras.setFullYear(tresAnosAtras.getFullYear() - 3);

                if (dataAplicacao < tresAnosAtras) {
                    warnings.push(`Seção 8 (Linha ${index + 1}): Aplicação há mais de 3 anos. Área já pode estar em conversão completa.`);
                }
            }
        });

        return { errors, warnings };
    },

    /**
     * Validar seção de produtos
     */
    validateProdutos() {
        const errors = [];
        const warnings = [];

        const tbody = document.getElementById('tbody-produtos');
        const rows = tbody.querySelectorAll('tr');

        if (rows.length === 0) {
            errors.push('Seção 9: Nenhum produto cadastrado para certificação (obrigatório)');
            return { errors, warnings };
        }

        // Validar cada produto
        rows.forEach((row, index) => {
            const produto = row.querySelector('[name="produto_nome[]"]')?.value;
            const estimativa = row.querySelector('[name="produto_estimativa[]"]')?.value;
            const origem = row.querySelector('[name="produto_origem[]"]')?.value;

            if (!produto || produto.length < 2) {
                errors.push(`Seção 9 (Linha ${index + 1}): Nome do produto inválido`);
            }

            if (!estimativa) {
                warnings.push(`Seção 9 (Linha ${index + 1}): Estimativa de produção não informada`);
            }

            if (origem === 'comprada_nao_organica') {
                warnings.push(`Seção 9 (Linha ${index + 1}): Sementes/mudas não orgânicas. Justificar indisponibilidade no mercado.`);
            }
        });

        return { errors, warnings };
    },

    /**
     * Validar seção de preservação ambiental
     */
    validatePreservacao() {
        const errors = [];
        const warnings = [];

        const possuiCAR = document.getElementById('possui_car').value;
        const situacaoCAR = document.getElementById('situacao_car')?.value;

        // Validar CAR
        if (!possuiCAR) {
            errors.push('Seção 10: Informação sobre CAR não fornecida');
        }

        if (possuiCAR === 'sim' && !situacaoCAR) {
            errors.push('Seção 10: Situação do CAR não informada');
        }

        if (possuiCAR === 'nao') {
            warnings.push('Seção 10: CAR é obrigatório conforme Código Florestal (Lei 12.651/2012)');
        }

        // Validar destino de resíduos
        const destinoOrganico = document.getElementById('destino_lixo_organico').value;
        const destinoNaoOrganico = document.getElementById('destino_lixo_nao_organico').value;

        if (destinoOrganico === 'queima') {
            warnings.push('Seção 10: Queima de lixo orgânico não é recomendada. Prefira compostagem.');
        }

        if (destinoNaoOrganico === 'queima' || destinoNaoOrganico === 'enterro') {
            warnings.push('Seção 10: Destino inadequado para lixo não orgânico. Prefira coleta seletiva.');
        }

        return { errors, warnings };
    },

    /**
     * Validar seção de recursos hídricos
     */
    validateRecursosHidricos() {
        const errors = [];
        const warnings = [];

        const tbody = document.getElementById('tbody-recursos-hidricos');
        const rows = tbody.querySelectorAll('tr');

        // Validar riscos de contaminação
        rows.forEach((row, index) => {
            const nivelRisco = row.querySelector('[name="agua_nivel_risco[]"]')?.value;
            const garantia = row.querySelector('[name="agua_garantia[]"]')?.value;

            if (nivelRisco === 'alto' || nivelRisco === 'medio') {
                if (!garantia || garantia.length < 5) {
                    warnings.push(`Seção 11 (Linha ${index + 1}): Risco de contaminação ${nivelRisco}. Descreva medidas de garantia de qualidade.`);
                }
            }
        });

        return { errors, warnings };
    },

    /**
     * Validar seção de comercialização
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
            warnings.push('Seção 12: Nenhum canal de comercialização selecionado');
        }

        // Validar produção paralela
        const comercializaNaoOrganicos = document.getElementById('comercializa_nao_organicos').value;
        const separacaoProdutos = document.getElementById('separacao_produtos')?.value;

        if (comercializaNaoOrganicos === 'sim' && (!separacaoProdutos || separacaoProdutos.length < 5)) {
            errors.push('Seção 12: Descreva como separa produtos orgânicos de não orgânicos');
        }

        return { errors, warnings };
    },

    /**
     * Validar seção de controles
     */
    validateControles() {
        const errors = [];
        const warnings = [];

        // Verificar se mantém pelo menos um controle
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
            warnings.push('Seção 13: Nenhum controle/registro marcado. Sistema de rastreabilidade é obrigatório conforme IN 19/2011.');
        }

        // Rastreabilidade é obrigatório
        if (!document.getElementsByName('controle_rastreabilidade')[0]?.checked) {
            warnings.push('Seção 13: Sistema de rastreabilidade é obrigatório para certificação orgânica');
        }

        return { errors, warnings };
    },

    /**
     * Validar seção de produção paralela
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
                errors.push('Seção 15: Descreva os riscos de contaminação da produção paralela');
            }

            if (!bloqueios || bloqueios.length < 5) {
                errors.push('Seção 15: Descreva os manejos de bloqueio/separação entre produção orgânica e convencional');
            }

            if (usaNaoPermitidos === 'sim') {
                warnings.push('Seção 15: Produção paralela com insumos não permitidos requer atenção redobrada na separação');
            }

            warnings.push('Seção 15: Produção paralela é permitida mas não recomendada. Considere conversão total.');
        }

        return { errors, warnings };
    },

    /**
     * Validar seção de documentos
     */
    validateDocumentos() {
        const errors = [];
        const warnings = [];

        // Verificar croqui (obrigatório)
        const croquiInput = document.querySelector('[name="documento_croqui"]');
        if (!croquiInput?.files || croquiInput.files.length === 0) {
            errors.push('Seção 16: Croqui da propriedade é obrigatório');
        }

        // CAR recomendado
        const possuiCAR = document.getElementById('possui_car').value;
        const carInput = document.querySelector('[name="documento_car"]');
        if (possuiCAR === 'sim' && (!carInput?.files || carInput.files.length === 0)) {
            warnings.push('Seção 16: Recomenda-se anexar documento do CAR');
        }

        return { errors, warnings };
    },

    /**
     * Validar seção de declarações
     */
    validateDeclaracoes() {
        const errors = [];
        const warnings = [];

        const declaracoes = [
            { name: 'declaracao_veracidade', label: 'veracidade das informações' },
            { name: 'declaracao_normas', label: 'seguir normas de produção orgânica' },
            { name: 'declaracao_visitas', label: 'autorizar visitas de verificação' },
            { name: 'declaracao_atualizacao', label: 'comunicar mudanças no manejo' },
            { name: 'declaracao_rastreabilidade', label: 'manter registros de rastreabilidade' }
        ];

        declaracoes.forEach(dec => {
            const checkbox = document.getElementsByName(dec.name)[0];
            if (!checkbox?.checked) {
                errors.push(`Seção 17: É obrigatório concordar com: ${dec.label}`);
            }
        });

        // Validar data
        const dataPreenchimento = document.getElementById('data_preenchimento').value;
        if (!dataPreenchimento) {
            errors.push('Seção 17: Data de preenchimento não informada');
        } else {
            const data = new Date(dataPreenchimento);
            const hoje = new Date();
            if (data > hoje) {
                errors.push('Seção 17: Data de preenchimento não pode ser futura');
            }
        }

        // Validar assinatura
        const assinatura = document.getElementById('assinatura_responsavel').value;
        if (!assinatura || assinatura.length < 3) {
            errors.push('Seção 17: Nome do responsável não informado');
        }

        return { errors, warnings };
    },

    /**
     * Validar formulário completo
     */
    validateComplete() {
        const allErrors = [];
        const allWarnings = [];

        // Executar todas as validações
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