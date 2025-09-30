/**
 * Validation Rules - Anexo Animal
 * Sistema PMO - ANC
 *
 * Regras de validação específicas para produção animal orgânica
 * Baseado na Portaria 52/2021 MAPA e legislação aplicável
 */

const AnexoAnimalValidation = {
    /**
     * Regras de validação por seção
     */
    rules: {
        // Seção 1: Identificação
        identificacao: {
            required: ['nome_fornecedor', 'nome_unidade_producao', 'data_preenchimento', 'grupo_spg'],
            validations: {
                data_preenchimento: (value) => {
                    const date = new Date(value);
                    const now = new Date();
                    if (date > now) {
                        return { valid: false, message: 'Data de preenchimento não pode ser futura' };
                    }
                    return { valid: true };
                }
            }
        },

        // Seção 2: Inspeção Sanitária
        inspecao: {
            conditional: {
                field: 'possui_inspecao_sanitaria',
                value: 'sim',
                required: ['tipo_inspecao']
            },
            warnings: {
                possui_inspecao_sanitaria: (value) => {
                    if (value === 'nao') {
                        return 'Para comercializar produtos de origem animal, é obrigatória a inspeção sanitária (Municipal, Estadual ou Federal).';
                    }
                    return null;
                }
            }
        },

        // Seção 3: Espécies Criadas
        especies: {
            required: ['especie[]', 'finalidade[]', 'em_transicao_organica[]'],
            minItems: 1,
            validations: {
                'numero_animais_atual[]': (value) => {
                    if (value && parseInt(value) < 0) {
                        return { valid: false, message: 'Número de animais não pode ser negativo' };
                    }
                    return { valid: true };
                },
                'area_utilizada_ha[]': (value) => {
                    if (value && parseFloat(value) < 0) {
                        return { valid: false, message: 'Área não pode ser negativa' };
                    }
                    return { valid: true };
                },
                'densidade_animais[]': (value, rowData) => {
                    // Validar densidade de acordo com espécie
                    const especie = rowData.especie;
                    const area = parseFloat(rowData.area_utilizada_ha);
                    const numAnimais = parseInt(rowData.numero_animais_atual);

                    if (area > 0 && numAnimais > 0) {
                        const densidade = numAnimais / area;

                        // Limites de densidade por espécie (animais/ha)
                        const limites = {
                            'bovinos': 2.5,
                            'ovinos': 15,
                            'caprinos': 15,
                            'suinos': 10,
                            'aves_galinhas': 4000
                        };

                        if (limites[especie] && densidade > limites[especie]) {
                            return {
                                valid: false,
                                message: `Densidade muito alta para ${especie}. Máximo recomendado: ${limites[especie]} animais/ha`
                            };
                        }
                    }

                    return { valid: true };
                }
            }
        },

        // Seção 4: Alimentação
        alimentacao: {
            required: ['tipo_alimento[]', 'origem_alimento[]'],
            validations: {
                'percent_organico[]': (value, allValues) => {
                    // Calcular percentual total de alimentação orgânica
                    const percentuais = allValues['percent_organico[]'] || [];
                    const quantidades = allValues['quantidade_mensal_kg[]'] || [];

                    let totalOrganico = 0;
                    let totalGeral = 0;

                    percentuais.forEach((percent, index) => {
                        const qtd = parseFloat(quantidades[index]) || 0;
                        const perc = parseFloat(percent) || 0;

                        totalOrganico += (qtd * perc / 100);
                        totalGeral += qtd;
                    });

                    const percentualTotal = totalGeral > 0 ? (totalOrganico / totalGeral) * 100 : 0;

                    if (percentualTotal < 80) {
                        return {
                            valid: false,
                            message: `Alimentação orgânica abaixo do mínimo exigido. Atual: ${percentualTotal.toFixed(1)}%, Mínimo: 80%`
                        };
                    }

                    return { valid: true };
                }
            },
            warnings: {
                'percent_organico[]': (values) => {
                    const warnings = [];
                    values.forEach((value, index) => {
                        const percent = parseFloat(value);
                        if (percent < 80) {
                            warnings.push(`Alimento ${index + 1}: Percentual orgânico abaixo do recomendado (${percent}%)`);
                        }
                    });
                    return warnings.length > 0 ? warnings.join('; ') : null;
                }
            }
        },

        // Seção 5: Bem-Estar Animal
        bemEstar: {
            required: [],
            validations: {
                'tempo_confinamento_horas_dia': (value) => {
                    const horas = parseFloat(value);
                    if (horas > 24) {
                        return { valid: false, message: 'Tempo de confinamento não pode exceder 24 horas' };
                    }
                    if (horas > 16) {
                        return {
                            valid: false,
                            message: 'Tempo de confinamento excessivo. Animais devem ter acesso a áreas abertas.'
                        };
                    }
                    return { valid: true };
                },
                'area_minima_por_animal_m2': (value, allData) => {
                    // Validar área mínima por espécie
                    const area = parseFloat(value);

                    // Áreas mínimas recomendadas (m²/animal)
                    const minimasRecomendadas = {
                        'bovinos': 10,
                        'ovinos': 2,
                        'caprinos': 2,
                        'suinos': 1.5,
                        'aves_galinhas': 0.2
                    };

                    // Esta validação é complexa pois precisa cruzar com dados de espécies
                    // Implementação completa requer acesso aos dados da tabela de espécies

                    if (area < 0.1) {
                        return {
                            valid: false,
                            message: 'Área mínima por animal muito baixa. Verifique as normas de bem-estar.'
                        };
                    }

                    return { valid: true };
                }
            }
        },

        // Seção 6: Manejo Sanitário
        manejoSanitario: {
            validations: {
                'periodo_carencia_dias[]': (values) => {
                    // Verificar se período de carência foi dobrado para medicamentos alopáticos
                    // Esta validação é complexa e depende do tipo de medicamento
                    values.forEach((value, index) => {
                        const dias = parseInt(value);
                        if (dias < 0) {
                            return {
                                valid: false,
                                message: 'Período de carência não pode ser negativo'
                            };
                        }
                    });
                    return { valid: true };
                }
            },
            warnings: {
                'periodo_carencia_dias[]': (values, allData) => {
                    const warnings = [];
                    const tratamentos = allData['tratamento_produto[]'] || [];

                    values.forEach((value, index) => {
                        const dias = parseInt(value);
                        const tratamento = tratamentos[index];

                        // Avisar se período de carência parece muito curto
                        if (dias < 7 && tratamento) {
                            warnings.push(`Tratamento "${tratamento}": Período de carência pode estar abaixo do dobrado exigido para orgânicos`);
                        }
                    });

                    return warnings.length > 0 ? warnings.join('; ') : null;
                }
            }
        },

        // Seção 7: Vacinação
        vacinacao: {
            required: ['vacina[]'],
            warnings: {
                obrigatoria: (values) => {
                    const obrigatorias = values.filter(v => v === 'sim');
                    if (obrigatorias.length === 0) {
                        return 'Atenção: Verifique se há vacinas obrigatórias para as espécies criadas (ex: Febre Aftosa para bovinos).';
                    }
                    return null;
                }
            }
        },

        // Seção 8: Reprodução
        reproducao: {
            conditional: {
                field: 'utiliza_reproducao_artificial',
                value: 'sim',
                warnings: {
                    certificacao_organica_semen: (value) => {
                        if (value === 'nao') {
                            return 'Recomenda-se utilizar sêmen/embriões de animais orgânicos quando possível.';
                        }
                        return null;
                    }
                }
            }
        },

        // Seção 9: Instalações
        instalacoes: {
            required: ['tipo_instalacao[]'],
            validations: {
                lotacao_atual_instalacao: (values, allData) => {
                    const capacidades = allData['capacidade_maxima_animais[]'] || [];

                    values.forEach((lotacao, index) => {
                        const capacidade = parseInt(capacidades[index]);
                        const atual = parseInt(lotacao);

                        if (atual > capacidade) {
                            return {
                                valid: false,
                                message: `Instalação ${index + 1}: Lotação atual (${atual}) excede capacidade máxima (${capacidade})`
                            };
                        }
                    });

                    return { valid: true };
                }
            }
        },

        // Seção 10: Manejo de Esterco
        esterco: {
            required: ['metodo_manejo_esterco'],
            warnings: {
                armazenamento: (data) => {
                    const warnings = [];

                    if (!data.local_adequado_esterco) {
                        warnings.push('Recomenda-se armazenar esterco em local adequado e afastado');
                    }
                    if (!data.cobertura_esterco) {
                        warnings.push('Recomenda-se proteger o esterco da chuva');
                    }
                    if (!data.drenagem_chorume) {
                        warnings.push('Recomenda-se sistema de drenagem de chorume para evitar contaminação');
                    }

                    return warnings.length > 0 ? warnings.join('; ') : null;
                }
            }
        },

        // Seção 11: Rastreabilidade
        rastreabilidade: {
            required: ['metodo_identificacao', 'metodo_registro', 'periodo_retencao_anos', 'registros_nascimentos'],
            validations: {
                periodo_retencao_anos: (value) => {
                    const anos = parseInt(value);
                    if (anos < 5) {
                        return {
                            valid: false,
                            message: 'Período de retenção de registros deve ser no mínimo 5 anos'
                        };
                    }
                    return { valid: true };
                }
            },
            warnings: {
                rastreabilidade: (data) => {
                    if (!data.rastreabilidade_individual && !data.rastreabilidade_lote) {
                        return 'É obrigatório implementar sistema de rastreabilidade (individual ou por lote) conforme IN 19/2011 MAPA';
                    }
                    return null;
                }
            }
        },

        // Seção 12: Declarações
        declaracoes: {
            required: [
                'conhece_legislacao_organica',
                'cumpre_normas_bem_estar',
                'nao_usa_hormonios_crescimento',
                'nao_usa_antibioticos_preventivos',
                'nao_usa_urea_sintetica',
                'nao_usa_organismos_transgenicos',
                'respeita_periodo_carencia',
                'mantem_registros_atualizados',
                'autoriza_visitas_verificacao',
                'declara_veracidade_informacoes',
                'nome_completo_produtor',
                'cpf_produtor',
                'data_elaboracao_pmo'
            ],
            validations: {
                cpf_produtor: (value) => {
                    // Validar CPF
                    const cpf = value.replace(/\D/g, '');
                    if (cpf.length !== 11) {
                        return { valid: false, message: 'CPF inválido' };
                    }

                    // Validar dígitos verificadores
                    let soma = 0;
                    let resto;

                    if (cpf === '00000000000') {
                        return { valid: false, message: 'CPF inválido' };
                    }

                    for (let i = 1; i <= 9; i++) {
                        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
                    }

                    resto = (soma * 10) % 11;
                    if (resto === 10 || resto === 11) resto = 0;
                    if (resto !== parseInt(cpf.substring(9, 10))) {
                        return { valid: false, message: 'CPF inválido' };
                    }

                    soma = 0;
                    for (let i = 1; i <= 10; i++) {
                        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
                    }

                    resto = (soma * 10) % 11;
                    if (resto === 10 || resto === 11) resto = 0;
                    if (resto !== parseInt(cpf.substring(10, 11))) {
                        return { valid: false, message: 'CPF inválido' };
                    }

                    return { valid: true };
                },
                data_elaboracao_pmo: (value) => {
                    const date = new Date(value);
                    const now = new Date();
                    if (date > now) {
                        return { valid: false, message: 'Data de elaboração não pode ser futura' };
                    }
                    return { valid: true };
                }
            }
        }
    },

    /**
     * Validar formulário completo
     */
    validate(formData) {
        const errors = [];
        const warnings = [];

        // Validar cada seção
        Object.keys(this.rules).forEach(section => {
            const sectionRules = this.rules[section];
            const result = this.validateSection(section, sectionRules, formData);

            errors.push(...result.errors);
            warnings.push(...result.warnings);
        });

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    },

    /**
     * Validar uma seção específica
     */
    validateSection(sectionName, rules, formData) {
        const errors = [];
        const warnings = [];

        // Campos obrigatórios
        if (rules.required) {
            rules.required.forEach(field => {
                const value = formData.get(field);
                if (!value || value.trim() === '') {
                    errors.push(`${sectionName}: Campo obrigatório não preenchido - ${field}`);
                }
            });
        }

        // Validações customizadas
        if (rules.validations) {
            Object.keys(rules.validations).forEach(field => {
                const validator = rules.validations[field];
                const value = formData.get(field);

                if (value) {
                    const result = validator(value, formData);
                    if (!result.valid) {
                        errors.push(`${sectionName}: ${result.message}`);
                    }
                }
            });
        }

        // Avisos
        if (rules.warnings) {
            Object.keys(rules.warnings).forEach(field => {
                const warningFn = rules.warnings[field];
                const value = formData.get(field);

                if (value) {
                    const warning = warningFn(value, formData);
                    if (warning) {
                        warnings.push(`${sectionName}: ${warning}`);
                    }
                }
            });
        }

        // Validações condicionais
        if (rules.conditional) {
            const condField = formData.get(rules.conditional.field);
            if (condField === rules.conditional.value) {
                if (rules.conditional.required) {
                    rules.conditional.required.forEach(field => {
                        const value = formData.get(field);
                        if (!value || value.trim() === '') {
                            errors.push(`${sectionName}: Campo condicional obrigatório - ${field}`);
                        }
                    });
                }

                if (rules.conditional.warnings) {
                    Object.keys(rules.conditional.warnings).forEach(field => {
                        const warningFn = rules.conditional.warnings[field];
                        const value = formData.get(field);
                        const warning = warningFn(value);
                        if (warning) {
                            warnings.push(`${sectionName}: ${warning}`);
                        }
                    });
                }
            }
        }

        return { errors, warnings };
    },

    /**
     * Validar item mínimo em arrays
     */
    validateMinItems(fieldName, minItems, formData) {
        const values = formData.getAll(fieldName).filter(v => v && v.trim() !== '');
        return values.length >= minItems;
    }
};

// Exportar para uso global
window.AnexoAnimalValidation = AnexoAnimalValidation;
