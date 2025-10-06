/**
 * Schema Mapper - Sistema PMO ANC
 * Mapeamento bidirecional entre FormData e schemas /jsonSchemas/
 * @version 2.0.0
 */

const SchemaMapper = {
    /**
     * Carregar schema de referência
     */
    async loadSchema(schemaPath) {
        try {
            const response = await fetch(schemaPath);
            if (!response.ok) throw new Error(`Failed to load schema: ${schemaPath}`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar schema:', error);
            return null;
        }
    },

    /**
     * ========================================
     * CADASTRO GERAL PMO
     * ========================================
     */
    toCadastroGeralSchema(formData) {
        return {
            metadata: {
                versao_schema: '2.0.0',
                tipo_formulario: 'cadastro_geral_pmo',
                data_criacao: formData.data_declaracao || new Date().toISOString(),
                ultima_atualizacao: new Date().toISOString(),
                status: 'rascunho'
            },
            dados: {
                identificacao: {
                    nome_completo: formData.nome_completo,
                    razao_social: formData.razao_social || formData.nome_completo,
                    cpf_cnpj: formData.cpf_cnpj,
                    inscricao_estadual: formData.inscricao_estadual,
                    inscricao_municipal: formData.inscricao_municipal,
                    nome_fantasia: formData.nome_fantasia,
                    nome_unidade_producao: formData.nome_unidade_producao
                },
                tipo_pessoa: formData.tipo_pessoa,
                contato: {
                    telefone: formData.telefone,
                    email: formData.email,
                    endereco: {
                        endereco_completo: formData.endereco,
                        bairro: formData.bairro,
                        municipio: formData.municipio,
                        uf: formData.uf,
                        cep: formData.cep,
                        coordenadas: {
                            latitude: parseFloat(formData.latitude) || null,
                            longitude: parseFloat(formData.longitude) || null
                        }
                    }
                },
                propriedade: {
                    posse_terra: formData.posse_terra,
                    area_total_ha: parseFloat(formData.area_total_ha) || 0,
                    caf_numero: formData.caf_numero,
                    caf_nao_possui: formData.caf_nao_possui === 'on',
                    roteiro_acesso: formData.roteiro_acesso,
                    data_aquisicao_posse: formData.data_aquisicao,
                    terra_familiar: formData.terra_familiar === 'on'
                },
                manejo_organico: {
                    anos_manejo_organico: parseInt(formData.anos_manejo_organico) || 0,
                    situacao_manejo: formData.situacao_manejo
                },
                activities: this.extractActivities(formData)
            }
        };
    },

    fromCadastroGeralSchema(schemaData, form) {
        const dados = schemaData.dados || {};

        this.setFieldValue(form, 'nome_completo', dados.identificacao?.nome_completo);
        this.setFieldValue(form, 'razao_social', dados.identificacao?.razao_social);
        this.setFieldValue(form, 'cpf_cnpj', dados.identificacao?.cpf_cnpj);
        this.setFieldValue(form, 'tipo_pessoa', dados.tipo_pessoa);
        this.setFieldValue(form, 'telefone', dados.contato?.telefone);
        this.setFieldValue(form, 'email', dados.contato?.email);
        this.setFieldValue(form, 'endereco', dados.contato?.endereco?.endereco_completo);
        this.setFieldValue(form, 'bairro', dados.contato?.endereco?.bairro);
        this.setFieldValue(form, 'municipio', dados.contato?.endereco?.municipio);
        this.setFieldValue(form, 'uf', dados.contato?.endereco?.uf);
        this.setFieldValue(form, 'cep', dados.contato?.endereco?.cep);

        if (dados.contato?.endereco?.coordenadas) {
            this.setFieldValue(form, 'latitude', dados.contato.endereco.coordenadas.latitude);
            this.setFieldValue(form, 'longitude', dados.contato.endereco.coordenadas.longitude);
        }

        // Activities
        if (dados.activities) {
            Object.keys(dados.activities).forEach(key => {
                const checkbox = form.querySelector(`[name="${key}"]`);
                if (checkbox && checkbox.type === 'checkbox') {
                    checkbox.checked = dados.activities[key] === true;
                }
            });
        }
    },

    /**
     * ========================================
     * ANEXO VEGETAL
     * ========================================
     */
    toVegetalSchema(formData) {
        return {
            metadata: {
                versao_schema: '2.0.0',
                tipo_formulario: 'anexo_vegetal',
                data_criacao: formData.data_preenchimento || new Date().toISOString(),
                ultima_atualizacao: new Date().toISOString(),
                status: 'rascunho'
            },
            dados: {
                preparo_solo: this.extractArray(formData, 'preparo_solo', ['ROÇADA', 'ARAÇÃO', 'GRADAGEM']).map(tipo => ({
                    tipo,
                    utiliza: formData[`preparo_${tipo.toLowerCase()}`] === 'on'
                })),
                praticas_conservacionistas: this.extractPraticasConservacionistas(formData),
                contaminacao_e_barreiras: {
                    estado_conservacao_barreiras: formData.estado_conservacao_barreiras,
                    risco_deriva_agrotoxicos: formData.risco_deriva_agrotoxicos === 'on',
                    risco_transgenicos: formData.risco_transgenicos === 'on'
                },
                adubacao_nutricao: {
                    descricao_geral: formData.descricao_adubacao,
                    substrato: this.extractSubstrato(formData),
                    receitas_proprias: this.extractArray(formData, 'receita', null)
                },
                produtos_insumos: this.extractArray(formData, 'produto', null),
                equipamentos_manejo: {
                    usa_equipamento_terceiro: formData.usa_equipamento_terceiro === 'on',
                    empresta_equipamento: formData.empresta_equipamento === 'on',
                    declaracao_nao_compartilhamento_pulverizacao: formData.decl_nao_compartilhamento === 'on',
                    declaracao_higienizacao_e_produtos_permitidos: formData.decl_higienizacao === 'on'
                },
                lista_produtos_nao_certificar: this.extractArray(formData, 'produto_nc', null),
                certificacao_detalhes: {
                    lista_produtos_certificar: this.extractArray(formData, 'produto_cert', null),
                    declaracao_incremento_mudas_sementes_proprias: formData.decl_mudas_proprias === 'on'
                },
                comercializacao: this.extractComercializacao(formData)
            }
        };
    },

    fromVegetalSchema(schemaData, form) {
        const dados = schemaData.dados || {};

        // Preparo solo
        if (dados.preparo_solo) {
            dados.preparo_solo.forEach(item => {
                const checkbox = form.querySelector(`[name="preparo_${item.tipo.toLowerCase()}"]`);
                if (checkbox) checkbox.checked = item.utiliza;
            });
        }

        // Práticas conservacionistas
        if (dados.praticas_conservacionistas) {
            dados.praticas_conservacionistas.forEach(item => {
                this.setFieldValue(form, `pratica_${item.tipo.toLowerCase().replace(/\s+/g, '_')}_desc`, item.descricao);
            });
        }

        // Contaminação
        this.setFieldValue(form, 'estado_conservacao_barreiras', dados.contaminacao_e_barreiras?.estado_conservacao_barreiras);
        this.setCheckbox(form, 'risco_deriva_agrotoxicos', dados.contaminacao_e_barreiras?.risco_deriva_agrotoxicos);
        this.setCheckbox(form, 'risco_transgenicos', dados.contaminacao_e_barreiras?.risco_transgenicos);
    },

    /**
     * ========================================
     * ANEXO ANIMAL
     * ========================================
     */
    toAnimalSchema(formData) {
        return {
            metadata: {
                versao_schema: '2.0.0',
                tipo_formulario: 'anexo_animal',
                data_criacao: formData.data_preenchimento || new Date().toISOString(),
                ultima_atualizacao: new Date().toISOString(),
                status: 'rascunho'
            },
            dados: {
                inspecao_sanitaria: {
                    possui_inspecao: formData.possui_inspecao_sanitaria === 'sim',
                    qual_inspecao: formData.tipo_inspecao || ''
                },
                especies_criadas: this.extractArray(formData, 'especie', null),
                alimentacao: {
                    origem_alimentos: this.extractArray(formData, 'alimento_origem', null),
                    ingredientes_racao: this.extractArray(formData, 'racao_ingrediente', null),
                    tipos_forragem: this.extractArray(formData, 'forragem_tipo', null, true),
                    plano_anual_alimentacao: this.extractArray(formData, 'plano_alimentacao', null)
                },
                bem_estar_animal: {
                    praticas: this.extractArray(formData, 'bem_estar', null, true),
                    outras_formas: formData.bem_estar_outras
                },
                manejo_sanitario: {
                    evitar_enfermidades: this.extractArray(formData, 'prevencao', null, true),
                    tratamento_doencas: this.extractArray(formData, 'tratamento', null),
                    vacinas_obrigatorias: formData.vacinas_obrigatorias
                },
                plantel: {
                    origem_animais: formData.origem_animais,
                    metodo_reproducao: formData.metodo_reproducao,
                    evolucao_plantel: this.extractArray(formData, 'evolucao_plantel', null)
                },
                manejo_esterco_residuos: this.extractArray(formData, 'manejo_esterco', null, true),
                instalacoes_animais: this.extractArray(formData, 'instalacao', null),
                equipamentos_armazenamento: {
                    equipamento_terceiro: formData.equipamento_terceiro === 'on',
                    empresta_equipamento: formData.empresta_equipamento === 'on',
                    declaracao_higienizacao_conforme: formData.decl_higienizacao_conforme === 'on',
                    condicoes_armazenamento: formData.condicoes_armazenamento,
                    declaracao_nao_permitidos: formData.decl_nao_permitidos === 'on',
                    declaracao_risco_acidente: formData.decl_risco_acidente === 'on',
                    declaracao_acessivel_visitacao: formData.decl_acessivel_visitacao === 'on'
                }
            }
        };
    },

    fromAnimalSchema(schemaData, form) {
        const dados = schemaData.dados || {};

        this.setRadio(form, 'possui_inspecao_sanitaria', dados.inspecao_sanitaria?.possui_inspecao ? 'sim' : 'nao');
        this.setFieldValue(form, 'tipo_inspecao', dados.inspecao_sanitaria?.qual_inspecao);

        // Bem-estar
        if (dados.bem_estar_animal?.praticas) {
            dados.bem_estar_animal.praticas.forEach(pratica => {
                const checkbox = form.querySelector(`[name="bem_estar[]"][value="${pratica}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    },

    /**
     * ========================================
     * ANEXO COGUMELO
     * ========================================
     */
    toCogumeloSchema(formData) {
        return {
            metadata: {
                versao_schema: '2.0.0',
                tipo_formulario: 'anexo_cogumelo',
                data_criacao: formData.data_preenchimento || new Date().toISOString(),
                ultima_atualizacao: new Date().toISOString(),
                status: 'rascunho'
            },
            dados: {
                producao: this.extractArray(formData, 'cogumelo', null),
                substrato: {
                    producao_propria: formData.producao_propria_substrato === 'on',
                    ingredientes: this.extractArray(formData, 'substrato_material', null),
                    analise_metais_pesados: formData.analise_metais_pesados === 'on',
                    metodos_tratamento_madeira: formData.tratamento_madeira
                },
                inoculo: {
                    origem: formData.origem_inoculo,
                    comprovacao_nao_transgenico: formData.comprovacao_nao_transgenico === 'on',
                    informacoes_adicionais: formData.info_inoculo
                },
                controle_pragas: this.extractArray(formData, 'praga', null),
                residuos: {
                    destino_substrato: formData.destino_substrato,
                    destino_chorume: formData.destino_chorume
                },
                ferramentas_equipamentos: this.extractArray(formData, 'equipamento', null)
            }
        };
    },

    fromCogumeloSchema(schemaData, form) {
        const dados = schemaData.dados || {};

        this.setCheckbox(form, 'producao_propria_substrato', dados.substrato?.producao_propria);
        this.setCheckbox(form, 'analise_metais_pesados', dados.substrato?.analise_metais_pesados);
        this.setFieldValue(form, 'origem_inoculo', dados.inoculo?.origem);
        this.setFieldValue(form, 'destino_substrato', dados.residuos?.destino_substrato);
    },

    /**
     * ========================================
     * ANEXO APICULTURA
     * ========================================
     */
    toApiculturaSchema(formData) {
        return {
            metadata: {
                versao_schema: '2.0.0',
                tipo_formulario: 'anexo_apicultura',
                data_criacao: formData.data_preenchimento || new Date().toISOString(),
                ultima_atualizacao: new Date().toISOString(),
                status: 'rascunho'
            },
            dados: {
                apiarios: this.extractArray(formData, 'apiario', null),
                colmeias: {
                    numero_colmeias: parseInt(formData.total_colmeias) || 0,
                    origem_enxames: formData.origem_enxames,
                    material_colmeias: formData.material_colmeias
                },
                floradas: this.extractArray(formData, 'florada', null),
                alimentacao_artificial: {
                    uso: formData.alimentacao_artificial === 'sim',
                    justificativa: formData.justificativa_alimentacao,
                    tipo_alimento: formData.tipo_alimento_artificial,
                    epoca_uso: formData.epoca_uso_alimentacao
                },
                sanidade_apicola: {
                    praticas_preventivas: this.extractArray(formData, 'pratica_preventiva', null, true),
                    tratamentos: this.extractArray(formData, 'tratamento_apicola', null)
                },
                producao: this.extractArray(formData, 'produto_apicola', null),
                armazenamento_declaracoes: {
                    condicoes_organizacao: formData.condicoes_organizacao,
                    bloqueio_riscos: formData.bloqueio_riscos === 'on',
                    acessivel_visitacao: formData.acessivel_visitacao === 'on',
                    declaracao_nao_permitidos: formData.decl_nao_permitidos === 'on',
                    declaracao_risco_acidente: formData.decl_risco_acidente === 'on'
                }
            }
        };
    },

    fromApiculturaSchema(schemaData, form) {
        const dados = schemaData.dados || {};

        this.setFieldValue(form, 'total_colmeias', dados.colmeias?.numero_colmeias);
        this.setFieldValue(form, 'origem_enxames', dados.colmeias?.origem_enxames);
        this.setFieldValue(form, 'material_colmeias', dados.colmeias?.material_colmeias);
        this.setRadio(form, 'alimentacao_artificial', dados.alimentacao_artificial?.uso ? 'sim' : 'nao');
        this.setFieldValue(form, 'condicoes_organizacao', dados.armazenamento_declaracoes?.condicoes_organizacao);
    },

    /**
     * ========================================
     * ANEXO PROCESSAMENTO
     * ========================================
     */
    toProcessamentoSchema(formData) {
        return {
            metadata: {
                versao_schema: '2.0.0',
                tipo_formulario: 'anexo_processamento',
                data_criacao: formData.data_preenchimento || new Date().toISOString(),
                ultima_atualizacao: new Date().toISOString(),
                status: 'rascunho'
            },
            dados: {
                identificacao: {
                    fornecedores_responsaveis: this.extractArray(formData, 'responsavel', null),
                    dados_empresa: {
                        razao_social: formData.razao_social,
                        nome_fantasia: formData.nome_fantasia,
                        cpf_cnpj: formData.cnpj_empresa,
                        inscricao_estadual: formData.inscricao_estadual,
                        inscricao_municipal: formData.inscricao_municipal,
                        grupo_spg: formData.grupo_spg,
                        data_preenchimento: formData.data_preenchimento
                    },
                    contato: {
                        telefone: formData.telefone,
                        email: formData.email
                    }
                },
                localizacao: {
                    endereco_processamento: {
                        logradouro: formData.endereco,
                        numero: formData.numero,
                        bairro: formData.bairro,
                        municipio: formData.municipio,
                        uf: formData.uf,
                        cep: formData.cep
                    },
                    coordenadas: {
                        latitude: parseFloat(formData.latitude) || null,
                        longitude: parseFloat(formData.longitude) || null
                    },
                    tipo_local: formData.tipo_local,
                    roteiro_acesso: formData.roteiro_acesso
                },
                produtos_processados: this.extractArray(formData, 'produto', null),
                fornecedores_materia_prima: this.extractArray(formData, 'fornecedor', null),
                etapas_processamento: {
                    recepcao_materia_prima: this.extractEtapaProcessamento(formData, 'recepcao'),
                    lavagem_higienizacao: this.extractEtapaProcessamento(formData, 'lavagem'),
                    embalagem: this.extractEtapaProcessamento(formData, 'embalagem'),
                    armazenamento_estocagem: this.extractEtapaProcessamento(formData, 'armazenamento')
                },
                rastreabilidade: {
                    sistema_rastreabilidade: formData.sistema_rastreabilidade,
                    mecanismos_registro: {
                        anotacoes_entrada_insumo: formData.registro_entrada === 'on',
                        controle_estoque_lote: formData.controle_lote === 'on',
                        identificacao_lotes: formData.identificacao_lotes === 'on'
                    }
                },
                boas_praticas_fabricacao: {
                    possui_manual_bpf: formData.possui_manual_bpf === 'on',
                    funcionarios_treinados: formData.funcionarios_treinados === 'on',
                    procedimentos_implementados: {
                        uso_uniforme_e_epi: formData.uso_uniforme_epi === 'on',
                        controle_saude_funcionarios: formData.controle_saude === 'on',
                        monitoramento_ponto_critico: formData.monitoramento_critico === 'on'
                    }
                }
            }
        };
    },

    fromProcessamentoSchema(schemaData, form) {
        const dados = schemaData.dados || {};

        this.setFieldValue(form, 'razao_social', dados.identificacao?.dados_empresa?.razao_social);
        this.setFieldValue(form, 'cnpj_empresa', dados.identificacao?.dados_empresa?.cpf_cnpj);
        this.setFieldValue(form, 'telefone', dados.identificacao?.contato?.telefone);
        this.setFieldValue(form, 'endereco', dados.localizacao?.endereco_processamento?.logradouro);
        this.setFieldValue(form, 'sistema_rastreabilidade', dados.rastreabilidade?.sistema_rastreabilidade);
        this.setCheckbox(form, 'possui_manual_bpf', dados.boas_praticas_fabricacao?.possui_manual_bpf);
    },

    /**
     * ========================================
     * ANEXO PROCESSAMENTO MÍNIMO
     * ========================================
     */
    toProcessamentoMinimoSchema(formData) {
        return {
            metadata: {
                versao_schema: '2.0.0',
                tipo_formulario: 'anexo_processamentomin',
                data_criacao: formData.data_preenchimento || new Date().toISOString(),
                ultima_atualizacao: new Date().toISOString(),
                status: 'rascunho'
            },
            dados: {
                identificacao: {
                    fornecedores_responsaveis: this.extractArray(formData, 'responsavel', null),
                    dados_empresa: {
                        razao_social: formData.razao_social,
                        nome_fantasia: formData.nome_fantasia,
                        cpf_cnpj: formData.cnpj_produtor,
                        inscricao_estadual: formData.inscricao_estadual,
                        inscricao_municipal: formData.inscricao_municipal,
                        grupo_spg: formData.grupo_spg,
                        data_preenchimento: formData.data_preenchimento
                    },
                    contato: {
                        telefone: formData.telefone,
                        email: formData.email
                    }
                },
                localizacao: {
                    endereco_processamento: {
                        logradouro: formData.endereco,
                        numero: formData.numero,
                        bairro: formData.bairro,
                        municipio: formData.municipio,
                        uf: formData.uf,
                        cep: formData.cep
                    },
                    coordenadas: {
                        latitude: parseFloat(formData.latitude) || null,
                        longitude: parseFloat(formData.longitude) || null
                    },
                    tipo_local: formData.tipo_local,
                    roteiro_acesso: formData.roteiro_acesso
                },
                produtos_minimamente_processados: this.extractArray(formData, 'produto_nome', null),
                fornecedores_materia_prima: this.extractArray(formData, 'forn_nome', null),
                etapas_processamento_minimo: {
                    etapa_selecao_e_lavagem: {
                        realiza: formData.realiza_lavagem === 'on',
                        procedimentos_recebimento: formData.procedimentos_recebimento,
                        pre_lavados_higienizados: formData.pre_lavados === 'on',
                        substancias_lavagem: formData.substancias_lavagem,
                        destinacao_partes_retiradas: formData.destino_residuos
                    },
                    etapa_manipulacao: {
                        procedimentos_detalhados: formData.procedimentos_manipulacao
                    },
                    etapa_embalagem: {
                        procedimentos: formData.procedimentos_embalagem,
                        equipamentos_utilizados: formData.equipamentos_embalagem,
                        embalagens_utilizadas: formData.tipo_embalagem,
                        declaracao_uso_embalagem_permitida: formData.decl_embalagem_permitida === 'on',
                        declaracao_nao_contaminacao: formData.decl_nao_contaminacao === 'on'
                    },
                    etapa_estocagem: {
                        procedimentos: formData.procedimentos_estocagem,
                        declaracao_separacao_riscos: formData.decl_separacao_riscos === 'on'
                    }
                },
                producao_paralela: {
                    processa_nao_organicos: formData.processa_nao_organicos === 'on',
                    declaracao_nao_processamento_paralelo_mesma_cultura: formData.decl_nao_paralelo_cultura === 'on'
                }
            }
        };
    },

    fromProcessamentoMinimoSchema(schemaData, form) {
        const dados = schemaData.dados || {};

        this.setFieldValue(form, 'razao_social', dados.identificacao?.dados_empresa?.razao_social);
        this.setFieldValue(form, 'cnpj_produtor', dados.identificacao?.dados_empresa?.cpf_cnpj);
        this.setFieldValue(form, 'telefone', dados.identificacao?.contato?.telefone);
        this.setFieldValue(form, 'procedimentos_recebimento', dados.etapas_processamento_minimo?.etapa_selecao_e_lavagem?.procedimentos_recebimento);
        this.setCheckbox(form, 'processa_nao_organicos', dados.producao_paralela?.processa_nao_organicos);
    },

    /**
     * ========================================
     * HELPER FUNCTIONS
     * ========================================
     */
    extractActivities(formData) {
        const activities = {};
        const activityKeys = [
            'escopo_vegetal', 'escopo_animal', 'escopo_cogumelo',
            'escopo_apicultura', 'escopo_processamento', 'escopo_processamento_minimo'
        ];

        activityKeys.forEach(key => {
            if (formData[key] !== undefined) {
                activities[key] = formData[key] === 'on' || formData[key] === true;
            }
        });

        return activities;
    },

    extractArray(formData, prefix, fixedKeys = null, isCheckbox = false) {
        const result = [];

        if (fixedKeys) {
            // Estrutura fixa (ex: preparo_solo)
            fixedKeys.forEach(key => {
                const fieldName = `${prefix}_${key.toLowerCase().replace(/\s+/g, '_')}`;
                if (formData[fieldName] !== undefined) {
                    result.push({
                        tipo: key,
                        utiliza: formData[fieldName] === 'on'
                    });
                }
            });
        } else if (isCheckbox) {
            // Array de checkboxes
            for (let key in formData) {
                if (key.startsWith(`${prefix}[]`) || key.startsWith(prefix)) {
                    result.push(formData[key]);
                }
            }
        } else {
            // Array dinâmico (ex: produtos)
            let index = 0;
            while (true) {
                const firstField = formData[`${prefix}[${index}]`] || formData[`${prefix}_nome[${index}]`];
                if (!firstField) break;

                const item = {};
                for (let key in formData) {
                    if (key.includes(`[${index}]`) && key.startsWith(prefix)) {
                        const fieldName = key.replace(`[${index}]`, '').replace(`${prefix}_`, '');
                        item[fieldName] = formData[key];
                    }
                }

                if (Object.keys(item).length > 0) result.push(item);
                index++;
            }
        }

        return result;
    },

    extractPraticasConservacionistas(formData) {
        const praticas = [
            'ROTAÇÃO DE CULTURAS',
            'ADUBAÇÃO VERDE',
            'CONSÓRCIOS',
            'QUEBRA-VENTOS',
            'COBERTURA DO SOLO',
            'PROTEÇÃO CONTRA EROSÃO',
            'MANEJO DO MATO'
        ];

        return praticas.map(tipo => ({
            tipo,
            descricao: formData[`pratica_${tipo.toLowerCase().replace(/\s+/g, '_')}_desc`] || ''
        })).filter(p => p.descricao);
    },

    extractSubstrato(formData) {
        return {
            uso: formData.usa_substrato === 'on',
            declaracao_rastreabilidade: formData.decl_rastreabilidade_substrato === 'on',
            ingredientes: this.extractArray(formData, 'substrato', null)
        };
    },

    extractComercializacao(formData) {
        return {
            processo_pos_colheita: formData.processo_pos_colheita,
            produtos_armazenados: formData.produtos_armazenados === 'on',
            explicacao_armazenamento: formData.explicacao_armazenamento,
            tipos_comercializacao: this.extractArray(formData, 'comercializacao_tipo', null),
            modelo_rotulo: formData.modelo_rotulo,
            transporte_produtos: formData.transporte_produtos,
            rastreabilidade_produtos: formData.rastreabilidade_produtos,
            comercializa_nao_organicos: formData.comercializa_nao_organicos
        };
    },

    extractEtapaProcessamento(formData, etapa) {
        return {
            procedimentos: formData[`${etapa}_procedimentos`],
            produtos_utilizados: formData[`${etapa}_produtos`],
            declaracao: formData[`decl_${etapa}`] === 'on'
        };
    },

    setFieldValue(form, name, value) {
        if (!value) return;
        const field = form.querySelector(`[name="${name}"]`);
        if (field) {
            if (field.type === 'radio') {
                const radio = form.querySelector(`[name="${name}"][value="${value}"]`);
                if (radio) radio.checked = true;
            } else {
                field.value = value;
            }
        }
    },

    setCheckbox(form, name, value) {
        const checkbox = form.querySelector(`[name="${name}"]`);
        if (checkbox && checkbox.type === 'checkbox') {
            checkbox.checked = value === true;
        }
    },

    setRadio(form, name, value) {
        const radio = form.querySelector(`[name="${name}"][value="${value}"]`);
        if (radio) radio.checked = true;
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.SchemaMapper = SchemaMapper;
}
