// Validadores Especificos - Anexo de Producao Vegetal
// Sistema PMO - ANC
// ENCODING: UTF-8 (sem acentos para compatibilidade)

const VegetalValidators = {

    validatePreparoSolo() {
        const errors = [];
        const warnings = [];
        const form = document.getElementById('form-anexo-vegetal');
        if (!form) return { errors, warnings };

        const preparoCheckboxes = form.querySelectorAll('[name^="preparo_"]');
        const algumSelecionado = Array.from(preparoCheckboxes).some(function(cb) { return cb.checked; });

        if (!algumSelecionado) {
            warnings.push('Recomenda-se indicar pelo menos um tipo de preparo de solo');
        }

        const outrosCheckbox = form.querySelector('[name="preparo_outros"]');
        const outrosDescricao = form.querySelector('[name="preparo_outros_descricao"]');

        if (outrosCheckbox && outrosCheckbox.checked && (!outrosDescricao || !outrosDescricao.value || outrosDescricao.value.trim() === '')) {
            errors.push('Quando "Outros" e selecionado em Preparo do Solo, a descricao e obrigatoria');
        }

        return { errors, warnings };
    },

    validatePraticasConservacionistas() {
        const errors = [];
        const warnings = [];
        const form = document.getElementById('form-anexo-vegetal');
        if (!form) return { errors, warnings };

        const praticasCheckboxes = form.querySelectorAll('[name^="pratica_"]');
        const algumaSelecionada = Array.from(praticasCheckboxes).some(function(cb) { return cb.checked; });

        if (!algumaSelecionada) {
            errors.push('E OBRIGATORIO selecionar pelo menos uma pratica conservacionista');
        }

        praticasCheckboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                const praticaName = checkbox.name.replace('pratica_', '');
                const descricaoField = form.querySelector('[name="' + praticaName + '_descricao"]');

                if (!descricaoField || !descricaoField.value || descricaoField.value.trim().length < 10) {
                    const label = checkbox.nextElementSibling ? checkbox.nextElementSibling.textContent : 'Pratica';
                    errors.push('Pratica "' + label + '" selecionada requer descricao detalhada (minimo 10 caracteres)');
                }
            }
        });

        const rotacaoCheckbox = form.querySelector('[name="pratica_rotacao"]');
        const coberturaCheckbox = form.querySelector('[name="pratica_cobertura_solo"]');

        if ((!rotacaoCheckbox || !rotacaoCheckbox.checked) && (!coberturaCheckbox || !coberturaCheckbox.checked)) {
            warnings.push('Recomenda-se fortemente Rotacao de Culturas e/ou Cobertura de Solo');
        }

        return { errors, warnings };
    },

    validateBarreirasProtecao() {
        const errors = [];
        const warnings = [];
        const form = document.getElementById('form-anexo-vegetal');
        if (!form) return { errors, warnings };

        const estadoBarreiras = form.querySelector('[name="estado_conservacao_barreiras"]');
        const riscoDerivaCheckbox = form.querySelector('[name="risco_deriva_agrotoxicos"]');
        const riscoTransgenicosCheckbox = form.querySelector('[name="risco_contaminacao_transgenicos"]');

        if (estadoBarreiras && estadoBarreiras.value === 'NAO_POSSUI') {
            if ((riscoDerivaCheckbox && riscoDerivaCheckbox.checked) || (riscoTransgenicosCheckbox && riscoTransgenicosCheckbox.checked)) {
                errors.push('CRITICO: Propriedade nao possui barreiras mas ha risco de contaminacao');
            } else {
                warnings.push('Propriedade sem barreiras. Recomenda-se implementar');
            }
        }

        if (estadoBarreiras && estadoBarreiras.value === 'RUIM') {
            warnings.push('Barreiras em estado ruim. Recomenda-se manutencao urgente');
        }

        const situacaoFormigas = form.querySelector('[name="situacao_formigas"]');
        const controleFormigas = form.querySelector('[name="controle_formigas"]');

        if (situacaoFormigas && situacaoFormigas.value === 'PROBLEMAS_GRAVES' && (!controleFormigas || !controleFormigas.value || controleFormigas.value.trim() === '')) {
            errors.push('Problema grave de formigas requer descricao dos metodos de controle');
        }

        return { errors, warnings };
    },

    validateAdubacaoNutricao() {
        const errors = [];
        const warnings = [];
        const form = document.getElementById('form-anexo-vegetal');
        if (!form) return { errors, warnings };

        const sistemaAdubacao = form.querySelector('[name="sistema_adubacao"]');

        if (!sistemaAdubacao || !sistemaAdubacao.value || sistemaAdubacao.value.trim().length < 50) {
            errors.push('Descricao do sistema de adubacao deve ter no minimo 50 caracteres');
        }

        const utilizaSubstrato = form.querySelector('[name="utiliza_substrato"]');
        const preparaSubstrato = form.querySelector('[name="prepara_substrato_proprio"]');
        const compraSubstrato = form.querySelector('[name="compra_substrato_pronto"]');
        const adquireAprovado = form.querySelector('[name="adquire_substrato_aprovado"]');

        if (utilizaSubstrato && utilizaSubstrato.checked && (!preparaSubstrato || !preparaSubstrato.checked) && (!compraSubstrato || !compraSubstrato.checked)) {
            warnings.push('Especifique se prepara substrato proprio ou compra pronto');
        }

        if (compraSubstrato && compraSubstrato.checked && (!adquireAprovado || !adquireAprovado.checked)) {
            warnings.push('IMPORTANTE: Substrato comprado deve ser aprovado para uso organico');
        }

        return { errors, warnings };
    },

    validateEquipamentos() {
        const errors = [];
        const warnings = [];
        const form = document.getElementById('form-anexo-vegetal');
        if (!form) return { errors, warnings };

        const usaTerceiro = form.querySelector('[name="usa_equipamento_terceiro"]');
        const empresta = form.querySelector('[name="empresta_equipamento"]');
        const naoCompartilhados = form.querySelector('[name="equipamentos_nao_compartilhados"]');
        const fazHigienizacao = form.querySelector('[name="faz_higienizacao"]');

        if ((usaTerceiro && usaTerceiro.checked || empresta && empresta.checked) && (!fazHigienizacao || !fazHigienizacao.checked)) {
            errors.push('Se usa equipamentos de terceiros ou empresta, e OBRIGATORIO fazer higienizacao');
        }

        if (naoCompartilhados && !naoCompartilhados.checked) {
            warnings.push('ATENCAO: Compartilhamento com producao convencional e PROIBIDO');
        }

        return { errors, warnings };
    },

    validateEspacosArmazenamento() {
        const errors = [];
        const warnings = [];
        const form = document.getElementById('form-anexo-vegetal');
        if (!form) return { errors, warnings };

        const semProdutosNaoPermitidos = form.querySelector('[name="sem_produtos_nao_permitidos"]');
        const baixoRiscoAcidente = form.querySelector('[name="baixo_nivel_acidente"]');
        const acessivel = form.querySelector('[name="acessivel_visitacao"]');

        if (!semProdutosNaoPermitidos || !semProdutosNaoPermitidos.checked) {
            errors.push('CRITICO: Espacos NAO PODEM conter produtos nao permitidos');
        }

        if (!baixoRiscoAcidente || !baixoRiscoAcidente.checked) {
            warnings.push('Recomenda-se melhorar condicoes de seguranca');
        }

        if (!acessivel || !acessivel.checked) {
            warnings.push('Espacos devem ser acessiveis para vistoria de certificacao');
        }

        return { errors, warnings };
    },

    validateDeclaracoes() {
        const errors = [];
        const warnings = [];
        const form = document.getElementById('form-anexo-vegetal');
        if (!form) return { errors, warnings };

        const declaracoes = [
            { name: 'decl_incrementa_producao_mudas', label: 'Incremento de producao de mudas' },
            { name: 'decl_equipamentos_nao_compartilhados', label: 'Equipamentos nao compartilhados' },
            { name: 'decl_faz_higienizacao', label: 'Higienizacao adequada' },
            { name: 'decl_espacos_sem_produtos_proibidos', label: 'Espacos sem produtos proibidos' },
            { name: 'decl_baixo_risco_acidentes', label: 'Baixo risco de acidentes' },
            { name: 'decl_espacos_acessiveis', label: 'Espacos acessiveis' }
        ];

        declaracoes.forEach(function(decl) {
            const checkbox = form.querySelector('[name="' + decl.name + '"]');
            if (!checkbox || !checkbox.checked) {
                errors.push('Declaracao obrigatoria: ' + decl.label);
            }
        });

        return { errors, warnings };
    },

    validateComplete() {
        const allErrors = [];
        const allWarnings = [];

        const validations = [
            this.validatePreparoSolo(),
            this.validatePraticasConservacionistas(),
            this.validateBarreirasProtecao(),
            this.validateAdubacaoNutricao(),
            this.validateEquipamentos(),
            this.validateEspacosArmazenamento(),
            this.validateDeclaracoes()
        ];

        validations.forEach(function(result) {
            allErrors.push.apply(allErrors, result.errors);
            allWarnings.push.apply(allWarnings, result.warnings);
        });

        return {
            valid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings,
            totalErrors: allErrors.length,
            totalWarnings: allWarnings.length
        };
    },

    showValidationReport(result) {
        var message = '';

        if (result.valid) {
            message = 'Validacao concluida com sucesso!\n\n';

            if (result.totalWarnings > 0) {
                message += result.totalWarnings + ' aviso(s) encontrado(s):\n\n';
                result.warnings.forEach(function(w, i) {
                    message += (i + 1) + '. ' + w + '\n';
                });
            } else {
                message += 'Nenhum erro ou aviso. Formulario pronto para envio!';
            }
        } else {
            message = 'Validacao encontrou ' + result.totalErrors + ' erro(s):\n\n';
            result.errors.forEach(function(e, i) {
                message += (i + 1) + '. ' + e + '\n';
            });

            if (result.totalWarnings > 0) {
                message += '\n' + result.totalWarnings + ' aviso(s):\n\n';
                result.warnings.forEach(function(w, i) {
                    message += (i + 1) + '. ' + w + '\n';
                });
            }

            message += '\n\nPor favor, corrija os erros antes de finalizar.';
        }

        alert(message);
        return result.valid;
    }
};

if (typeof AnexoVegetal !== 'undefined') {
    AnexoVegetal.validateForm = function() {
        const form = document.getElementById(this.config.formId);
        if (!form) return false;

        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        const result = VegetalValidators.validateComplete();
        return VegetalValidators.showValidationReport(result);
    };
}

console.log('Validadores do Anexo Vegetal carregados');
