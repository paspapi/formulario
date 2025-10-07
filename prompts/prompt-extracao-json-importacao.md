# Prompt para Extração de Dados PMO em JSON (Importação)

Você deve extrair as informações deste documento/imagem e gerar um arquivo JSON válido seguindo rigorosamente o schema definido em `pmo-unified.schema.json`.

## Instruções Críticas:

1. **SEMPRE use a estrutura exata do schema** `pmo-unified.schema.json`
2. O JSON deve ter OBRIGATORIAMENTE estas seções principais:
   - `metadata` (obrigatório)
   - `dados` (obrigatório)
   - `arquivos_anexados` (opcional)
   - `validacao` (opcional)

3. **Estrutura de metadata obrigatória:**
```json
{
  "metadata": {
    "versao_schema": "2.0.0",
    "tipo_formulario": "[TIPO_AQUI]",
    "data_criacao": "[ISO_8601_DATETIME]",
    "id_produtor": "[CPF_OU_CNPJ_FORMATADO]",
    "nome_produtor": "[NOME_COMPLETO]",
    "nome_unidade": "[NOME_UNIDADE]",
    "ano_vigente": [ANO_NUMERO]
  }
}
```

4. **Valores válidos para `tipo_formulario`:**
   - `"cadastro_geral_pmo"` - para dados cadastrais gerais
   - `"anexo_vegetal"` - para produção vegetal
   - `"anexo_animal"` - para produção animal
   - `"anexo_cogumelo"` - para produção de cogumelos
   - `"anexo_apicultura"` - para apicultura
   - `"anexo_processamento"` - para processamento
   - `"anexo_processamentominimo"` - para processamento mínimo
   - `"pmo_completo"` - quando incluir múltiplos formulários

5. **Estrutura de `dados` conforme tipo:**

### Para `cadastro_geral_pmo` (Formulário Geral PMO):
```json
{
  "dados": {
    "tipo_pessoa": "fisica|juridica",
    "identificacao": {
      "fornecedores_responsaveis": [
        {
          "nome_completo": "string",
          "cpf": "123.456.789-01",
          "data_nascimento": "YYYY-MM-DD"
        }
      ],
      "cpf_cnpj": "12.345.678/0001-90",
      "inscricao_estadual": "string",
      "caf_numero": "string",
      "grupo_spg": "string",
      "data_preenchimento_pmo": "YYYY-MM-DD",
      "nome_fantasia": "string",
      "nome_unidade_producao": "string"
    },
    "contato": {
      "telefone": "(00) 00000-0000",
      "email": "email@example.com",
      "endereco": {
        "logradouro": "string",
        "bairro": "string",
        "municipio": "string",
        "uf": "SP",
        "cep": "00000-000",
        "coordenadas": {
          "latitude": -23.550520,
          "longitude": -46.633308
        }
      },
      "roteiro_acesso": "string"
    },
    "propriedade": {
      "posse_terra": "PRÓPRIA|ARRENDADA|PARCERIA|COMODATO",
      "area_total_propriedade_ha": 10.5,
      "area_total_organica_ha": 8.0,
      "relacao_unidade_producao": "string",
      "data_aquisicao_posse": "YYYY-MM-DD",
      "terra_familiar": true/false
    },
    "manejo_organico": {
      "historico_propriedade": "string",
      "topografia_e_utilizacao": "string",
      "status_manejo_organico": "string",
      "anos_manejo_organico": 0,
      "comprovacao_manejo": [
        {"tipo": "string", "status": true/false}
      ],
      "historico_ultimos_10_anos": [
        {
          "cultura_animal": "string",
          "data_ultima_aplicacao_nao_permitido": "YYYY-MM-DD",
          "insumo_utilizado": "string",
          "estavam_sob_manejo_organico": true/false,
          "eram_certificados": true/false
        }
      ],
      "relato_historico_recente": "string"
    },
    "activities": {
      "escopo_vegetal": true/false,
      "escopo_animal": true/false,
      "escopo_cogumelo": true/false,
      "escopo_apicultura": true/false,
      "escopo_processamento": true/false,
      "escopo_processamento_minimo": true/false
    },
    "mao_de_obra": {
      "familiar": true/false,
      "identifique_familiar": "string",
      "empregados_quantos": 0,
      "diaristas_quantos": 0,
      "parceiros_quantos": 0,
      "meeiro_rural_quantos": 0
    },
    "croqui": {
      "local_insercao_croqui": "string",
      "itens_obrigatorios_localizados": []
    },
    "biodiversidade_e_ambiente": {
      "preservacao_ambiental": [
        {"area": "MATA NATIVA (RESERVA LEGAL)", "possui": true/false, "preservada": true/false}
      ],
      "tecnicas_prevencao_incendios": "string",
      "experiencia_recuperacao_solos": "string",
      "destino_lixo_organico": "string",
      "destino_lixo_nao_organico": "string",
      "destino_esgoto_domestico": "string"
    },
    "manejo_da_agua": {
      "periodicidade_analise_irrigacao": "string",
      "fontes_agua_uso": [
        {
          "uso": "CONSUMO DOMÉSTICO",
          "origem": "string",
          "risco_contaminacao": "BAIXO|MÉDIO|ALTO",
          "garantia_qualidade": "string"
        }
      ]
    },
    "regularizacao_ambiental": {
      "possui_car": "string",
      "explicacao_reserva_legal": "string"
    },
    "producao_subsistencia_ornamental": {
      "possui_nao_organica": true/false,
      "atividades": [
        {"tipo": "HORTALIÇAS", "area_ha": 0.0}
      ],
      "utiliza_insumos_nao_permitidos": true/false,
      "risco_contaminacao": "BAIXO|MÉDIO|ALTO",
      "manejo_bloqueio_riscos": "string"
    },
    "producao_paralela": {
      "possui_paralela": true/false,
      "utiliza_insumos_nao_permitidos": true/false,
      "risco_contaminacao": "string",
      "manejo_bloqueio_riscos": "string",
      "pretende_conversao_total": true/false,
      "tempo_conversao": "string"
    },
    "declaracoes_conformidade": {
      "veracidade_e_comunicacao": "string",
      "conhecimento_normas": "string",
      "conhecimento_regras_spg": "string",
      "concordancia_verificacao_acesso": "string",
      "concordancia_informacao_adicional": "string",
      "ciente_visitas_amostras": "string",
      "aceite_condicoes_corretivas": "string",
      "total_conhecimento_conviccao": "string"
    },
    "comercializacao": {
      "processo_pos_colheita": "string",
      "produtos_armazenados": true/false,
      "explicacao_armazenamento": "string",
      "tipos_comercializacao": [
        {"tipo": "string", "status": true/false}
      ],
      "modelo_rotulo": "string",
      "transporte_produtos": "string",
      "rastreabilidade_produtos": "string",
      "comercializa_nao_organicos": "string"
    },
    "controles_e_registros": [
      {"atividade": "string", "controles": []}
    ]
  }
}
```

### Para `anexo_vegetal`:
```json
{
  "dados": {
    "preparo_solo": [
      {"tipo": "ROÇADA", "utiliza": true/false},
      {"tipo": "ARAÇÃO", "utiliza": true/false},
      {"tipo": "GRADAGEM", "utiliza": true/false}
    ],
    "praticas_conservacionistas": [
      {"tipo": "ROTAÇÃO DE CULTURAS", "descricao": "string"},
      {"tipo": "ADUBAÇÃO VERDE", "descricao": "string"},
      {"tipo": "CONSÓRCIOS", "descricao": "string"},
      {"tipo": "QUEBRA-VENTOS", "descricao": "string"}
    ],
    "contaminacao_e_barreiras": {
      "estado_conservacao_barreiras": "string",
      "risco_deriva_agrotoxicos": true/false,
      "risco_transgenicos": true/false
    },
    "controle_pragas": {
      "controle_formigas": {
        "situacao_problema": "string",
        "metodos_controle": "string"
      }
    },
    "adubacao_nutricao": {
      "descricao_geral": "string",
      "substrato": {
        "uso": "string",
        "declaracao_rastreabilidade": true/false,
        "ingredientes": [
          {
            "material_insumo": "string",
            "origem": "string",
            "proporcao_percentual": 100.0
          }
        ]
      },
      "receitas_proprias": [
        {
          "nome_receita": "string",
          "ingredientes": "string",
          "quantidade_dose_frequencia": "string",
          "cultura_talhao": "string",
          "status_uso": "USO|PRETENDO USAR|NÃO USO"
        }
      ]
    },
    "produtos_insumos": [
      {
        "marca_nome_comercial": "string",
        "substancia_ingrediente_ativo": "string",
        "fabricante": "string",
        "funcao": "FERTILIZANTE|FITOSSANITÁRIO|DEFENSIVO",
        "culturas": "string",
        "status_uso": "USO|PRETENDO USAR|CASO NECESSÁRIO"
      }
    ],
    "equipamentos_manejo": {
      "usa_equipamento_terceiro": true/false,
      "empresta_equipamento": true/false,
      "declaracao_nao_compartilhamento_pulverizacao": true/false,
      "declaracao_higienizacao_e_produtos_permitidos": true/false
    },
    "armazenamento_insumos": {
      "condicoes_organizacao": "BOA|REGULAR|RUIM",
      "declaracao_ausencia_nao_permitidos": true/false,
      "declaracao_bloqueio_riscos": true/false,
      "declaracao_acessibilidade_visitas": true/false
    },
    "lista_produtos_nao_certificar": [
      {
        "produto_variedade": "string",
        "talhao_area": "string",
        "origem_muda": "string",
        "origem_semente": "string",
        "tipo": "ORGÂNICA|CONVENCIONAL C/ TRAT|CONVENCIONAL S/ TRAT"
      }
    ],
    "certificacao_detalhes": {
      "lista_produtos_certificar": [
        {
          "produto_variedade": "string",
          "talhao_area": "string",
          "estimativa_producao_qtd": "string",
          "periodo_estimativa": "string",
          "peso_kg_und": "string",
          "origem_muda": "string",
          "origem_semente": "string",
          "tipo": "ORGÂNICA|CONVENCIONAL C/ TRAT|CONVENCIONAL S/ TRAT"
        }
      ],
      "declaracao_incremento_mudas_sementes_proprias": true/false
    },
    "comercializacao": {
      "processo_pos_colheita": "string",
      "produtos_armazenados": true/false,
      "explicacao_armazenamento": "string",
      "tipos_comercializacao": [
        {"tipo": "VENDA DIRETA - FEIRAS", "status": true/false}
      ],
      "modelo_rotulo": "string",
      "transporte_produtos": "string",
      "rastreabilidade_produtos": "string",
      "comercializa_nao_organicos": "string"
    },
    "controles_e_registros": [
      {"atividade": "OPERAÇÕES DE MANEJO", "controles": ["AGENDA", "CADERNO", "COMPUTADOR"]},
      {"atividade": "COMPRA DE INSUMOS", "controles": ["NOTAS FISCAIS/ RECIBOS"]}
    ]
  }
}
```

### Para `anexo_animal`:
```json
{
  "dados": {
    "inspecao_sanitaria": {
      "possui_inspecao": true/false,
      "qual_inspecao": "string"
    },
    "especies_criadas": [
      {
        "especie": "string",
        "area_utilizada_ha": 0.0,
        "quantidade_subsistencia": 0,
        "quantidade_estimacao": 0,
        "quantidade_comercial": 0
      }
    ],
    "alimentacao": {
      "origem_alimentos": [
        {
          "tipo_alimento": "PASTO|RAÇÃO|SILAGEM",
          "alvos": "string",
          "producao_propria": true/false,
          "compra_fora_fabricante": "string",
          "percent_organico": 0,
          "percent_nao_organico": 0
        }
      ],
      "ingredientes_racao": [
        {
          "ingrediente": "string",
          "percent_organico": 0,
          "percent_nao_organico": 0
        }
      ],
      "tipos_forragem": [],
      "plano_anual_alimentacao": [
        {"tipo": "string", "uso_mensal": "string"}
      ]
    },
    "bem_estar_animal": {
      "praticas": [],
      "outras_formas": "string"
    },
    "manejo_sanitario": {
      "evitar_enfermidades": [],
      "tratamento_doencas": [
        {
          "especie_alvo": "string",
          "doenca": "string",
          "tratamento_produto_marca": "string",
          "fabricante_origem": "string",
          "condicao_epoca_uso": "string"
        }
      ],
      "vacinas_obrigatorias": "string"
    },
    "plantel": {
      "origem_animais": "string",
      "metodo_reproducao": "string",
      "evolucao_plantel": [
        {"tipo_animal": "string", "atual": 0, "em_1_ano": 0, "em_3_anos": 0, "em_5_anos": 0}
      ]
    },
    "manejo_esterco_residuos": [],
    "instalacoes_animais": [
      {
        "instalacao": "string",
        "tamanho_m2": 0,
        "lotacao_m2": 0.0,
        "permanencia_h_dia": 0,
        "limpeza": "string"
      }
    ],
    "animais_nao_comerciais": {
      "manejo_detalhes": "string",
      "destino_dejetos": "string"
    },
    "equipamentos_armazenamento": {
      "equipamento_terceiro": true/false,
      "empresta_equipamento": true/false,
      "declaracao_higienizacao_conforme": true/false,
      "condicoes_armazenamento": "BOA|REGULAR|RUIM",
      "declaracao_nao_permitidos": true/false,
      "declaracao_risco_acidente": true/false,
      "declaracao_acessivel_visitacao": true/false
    }
  }
}
```

### Para `anexo_cogumelo`:
```json
{
  "dados": {
    "producao": [
      {
        "produto": "string",
        "origem_semente": "string",
        "origem_substrato": "string",
        "estimativa_producao_anual_kg": 0,
        "area_cultivada_m2": 0,
        "periodo_cultivo": {
          "data_inicio": "YYYY-MM-DD",
          "data_fim": "YYYY-MM-DD"
        },
        "metodo_cultivo": "TORAS|BLOCOS|SACOLAS",
        "ambiente_cultivo": "ESTUFA|CAVE|AR_LIVRE|OUTRO",
        "ambiente_descricao": "string",
        "usa_substrato": true/false,
        "origem_toras": {
          "local": "string",
          "especie_madeira": "string",
          "tratamento": "string",
          "certificacao": "string"
        },
        "embalagem": {
          "tipo": "string",
          "material": "string",
          "capacidade": "string"
        },
        "armazenamento": {
          "temperatura": "string",
          "umidade": "string",
          "duracao_maxima": "string"
        }
      }
    ],
    "substrato": {
      "producao_propria": true/false,
      "ingredientes": [
        {
          "material": "string",
          "origem": "PRÓPRIO|COMPRADO",
          "tipo": "ORGÂNICO|CONVENCIONAL",
          "risco_transgenicos": true/false,
          "proporcao_percent": 0.0
        }
      ],
      "analise_metais_pesados": true/false,
      "metodos_tratamento_madeira": "string"
    },
    "inoculo": {
      "origem": "PRÓPRIA|COMPRADA",
      "comprovacao_nao_transgenico": true/false,
      "informacoes_adicionais": "string"
    },
    "controle_pragas": [
      {
        "praga": "string",
        "praticas": "string",
        "substancias": "string",
        "origem_fabricante": "string"
      }
    ],
    "residuos": {
      "destino_substrato": "string",
      "destino_chorume": "string"
    },
    "ferramentas_equipamentos": [
      {
        "nome": "string",
        "tipo": "FERRAMENTA|EQUIPAMENTO",
        "uso": "string",
        "origem": "PRÓPRIO|ALUGADO|COMPARTILHADO",
        "higienizacao": "string",
        "manutencao": "string"
      }
    ]
  }
}
```

### Para `anexo_apicultura`:
```json
{
  "dados": {
    "apiarios": [
      {
        "nome_apiario": "string",
        "localizacao": "string",
        "distancia_unidade_km": 0.0,
        "confrontantes_risco": "string"
      }
    ],
    "colmeias": {
      "numero_colmeias": 0,
      "origem_enxames": "string",
      "material_colmeias": "string"
    },
    "floradas": [
      {
        "tipo_vegetacao": "string",
        "epoca_floracao": "string",
        "localizacao_florada": "string"
      }
    ],
    "alimentacao_artificial": {
      "uso": true/false,
      "justificativa": "string",
      "tipo_alimento": "string",
      "epoca_uso": "string"
    },
    "sanidade_apicola": {
      "praticas_preventivas": [],
      "tratamentos": [
        {
          "doenca_praga": "string",
          "tratamento_produto": "string",
          "fabricante_origem": "string",
          "condicao_epoca_uso": "string"
        }
      ]
    },
    "producao": [
      {
        "produto": "string",
        "estimativa_producao_anual_kg": 0,
        "periodo_producao": "string",
        "uso_proprio_porcentagem": 0
      }
    ],
    "armazenamento_declaracoes": {
      "condicoes_organizacao": "BOA|REGULAR|RUIM",
      "bloqueio_riscos": true/false,
      "acessivel_visitacao": true/false,
      "declaracao_nao_permitidos": true/false,
      "declaracao_risco_acidente": true/false
    }
  }
}
```

### Para `anexo_processamento`:
```json
{
  "dados": {
    "identificacao": {
      "fornecedores_responsaveis": [
        {
          "nome_completo": "string",
          "cpf": "123.456.789-01",
          "data_nascimento": "YYYY-MM-DD"
        }
      ],
      "dados_empresa": {
        "razao_social": "string",
        "nome_fantasia": "string",
        "cpf_cnpj": "12.345.678/0001-90",
        "inscricao_estadual": "string",
        "inscricao_municipal": "string",
        "grupo_spg": "string",
        "data_preenchimento": "YYYY-MM-DD"
      },
      "contato": {
        "telefone": "(00) 00000-0000",
        "email": "email@example.com"
      }
    },
    "localizacao": {
      "endereco_processamento": {
        "logradouro": "string",
        "numero": "string",
        "bairro": "string",
        "municipio": "string",
        "uf": "SP",
        "cep": "00000-000"
      },
      "coordenadas": {
        "latitude": -23.550520,
        "longitude": -46.633308
      },
      "tipo_local": "string",
      "roteiro_acesso": "string"
    },
    "situacao_legal": {
      "documentos_legais": [
        {
          "documento": "string",
          "possui": true/false,
          "numero": "string",
          "situacao": "string",
          "data_validade": "YYYY-MM-DD",
          "orgao_emissor": "string"
        }
      ],
      "declaracoes": {
        "ciencia_obrigacoes": true/false,
        "possui_alvara_funcionamento": true/false,
        "nao_usa_transgenicos": true/false,
        "conhece_legislacao_especifica": true/false
      }
    },
    "mao_obra": {
      "situacao_funcional": [
        {
          "tipo_funcionario": "EMPREGADOS|DIARISTAS",
          "quantidade": 0,
          "funcao": "string",
          "capacitacao_organicos": true/false
        }
      ],
      "numero_total_funcionarios": 0
    },
    "produtos_processados": [
      {
        "nome_produto_final": "string",
        "conteudo_processado": "string",
        "descricao_processamento": "string",
        "expectativa_producao_mensal_kg": 0,
        "origem_materia_prima": {
          "produto_proprio": true/false,
          "nome_agricultor_fornecedor": "string",
          "cidade_origem": "string",
          "uf_origem": "SP",
          "opac_certificou_parceiro": true/false
        },
        "tipo_produto": "ORGÂNICO|CONVENCIONAL",
        "embalagem": "string",
        "rotulagem_conforme": true/false
      }
    ],
    "fornecedores_materia_prima": [
      {
        "nome_fornecedor": "string",
        "tipo_pessoa": "fisica|juridica",
        "cpf_cnpj": "string",
        "produtos_fornecidos": [],
        "certificacao_organica": true/false,
        "opac_certificadora": "string"
      }
    ],
    "etapas_processamento": {
      "recepcao_materia_prima": {
        "procedimentos": "string",
        "registro_lote": true/false,
        "declaracao_separacao_materiais": true/false
      },
      "lavagem_higienizacao": {
        "procedimentos": "string",
        "produtos_utilizados": "string",
        "declaracao_registro_lavagem": true/false
      },
      "embalagem": {
        "procedimentos": "string",
        "tipo_material_embalagem": "string",
        "declaracao_uso_embalagem_permitida": true/false,
        "declaracao_nao_contaminacao": true/false
      },
      "armazenamento_estocagem": {
        "local": "string",
        "procedimentos_separacao": "string",
        "declaracao_separacao_riscos": true/false
      }
    },
    "rastreabilidade": {
      "sistema_rastreabilidade": "string",
      "mecanismos_registro": {
        "anotacoes_entrada_insumo": true/false,
        "controle_estoque_lote": true/false,
        "identificacao_lotes": true/false
      }
    },
    "controle_pragas_higiene": {
      "higienizacao_ambientes": {
        "procedimentos": "string",
        "produtos_utilizados": "string"
      },
      "desinsetizacao": {
        "procedimentos": "string",
        "declaracao_nao_uso_venenos": true/false
      },
      "declaracao_higienizacao_conforme": true/false
    },
    "boas_praticas_fabricacao": {
      "possui_manual_bpf": true/false,
      "funcionarios_treinados": true/false,
      "procedimentos_implementados": {
        "uso_uniforme_e_epi": true/false,
        "controle_saude_funcionarios": true/false,
        "monitoramento_ponto_critico": true/false
      }
    },
    "declaracoes_responsavel": {
      "veracidade_informacoes": true/false,
      "conhecimento_legislacao": true/false,
      "autorizacao_acesso_integral": true/false
    }
  }
}
```

### Para `anexo_processamentominimo`:
```json
{
  "dados": {
    "identificacao": {
      "fornecedores_responsaveis": [
        {
          "nome_completo": "string",
          "cpf": "123.456.789-01",
          "data_nascimento": "YYYY-MM-DD"
        }
      ],
      "dados_empresa": {
        "razao_social": "string",
        "nome_fantasia": "string",
        "cpf_cnpj": "12.345.678/0001-90",
        "inscricao_estadual": "string",
        "inscricao_municipal": "string",
        "grupo_spg": "string",
        "data_preenchimento": "YYYY-MM-DD"
      },
      "contato": {
        "telefone": "(00) 00000-0000",
        "email": "email@example.com"
      }
    },
    "localizacao": {
      "endereco_processamento": {
        "logradouro": "string",
        "numero": "string",
        "bairro": "string",
        "municipio": "string",
        "uf": "SP",
        "cep": "00000-000"
      },
      "coordenadas": {
        "latitude": -23.550520,
        "longitude": -46.633308
      },
      "tipo_local": "string",
      "roteiro_acesso": "string"
    },
    "situacao_legal": {
      "documentos_legais": [
        {
          "documento": "string",
          "possui": true/false,
          "numero": "string",
          "situacao": "string",
          "data_validade": "YYYY-MM-DD",
          "orgao_emissor": "string"
        }
      ],
      "declaracoes": {
        "ciencia_obrigacoes": true/false,
        "possui_alvara_funcionamento": true/false,
        "declaracao_licenca_sanitaria": true/false,
        "declaracao_nao_usa_radiacao_ionizante": true/false,
        "declaracao_nao_usa_ingrediente_paralelo": true/false,
        "nao_usa_transgenicos": true/false,
        "conhece_legislacao_especifica": true/false
      }
    },
    "mao_obra": {
      "situacao_funcional": [
        {
          "tipo_funcionario": "EMPREGADOS|DIARISTAS",
          "quantidade": 0,
          "funcao": "string",
          "capacitacao_organicos": true/false
        }
      ],
      "numero_total_funcionarios": 0
    },
    "produtos_minimamente_processados": [
      {
        "nome_produto_final": "string",
        "conteudo_processado": "string",
        "expectativa_producao_mensal_kg": 0,
        "origem_materia_prima": {
          "produto_proprio": true/false,
          "nome_agricultor_fornecedor": "string",
          "cidade_origem": "string",
          "uf_origem": "SP",
          "opac_certificou_parceiro": true/false
        },
        "tipo_produto": "ORGÂNICO|CONVENCIONAL",
        "embalagem": "string",
        "rotulagem_conforme": true/false
      }
    ],
    "fornecedores_materia_prima": [
      {
        "nome_fornecedor": "string",
        "tipo_pessoa": "fisica|juridica",
        "cpf_cnpj": "string",
        "produtos_fornecidos": [],
        "certificacao_organica": true/false,
        "opac_certificadora": "string"
      }
    ],
    "etapas_processamento_minimo": {
      "etapa_selecao_e_lavagem": {
        "realiza": true/false,
        "procedimentos_recebimento": "string",
        "pre_lavados_higienizados": true/false,
        "substancias_lavagem": "string",
        "destinacao_partes_retiradas": "string"
      },
      "etapa_manipulacao": {
        "procedimentos_detalhados": "string"
      },
      "etapa_higienizacao": {
        "realiza": true/false,
        "procedimentos": "string",
        "substancias_higienizacao": "string"
      },
      "etapa_embalagem": {
        "procedimentos": "string",
        "equipamentos_utilizados": "string",
        "embalagens_utilizadas": "string",
        "declaracao_uso_embalagem_permitida": true/false,
        "declaracao_nao_contaminacao": true/false
      },
      "etapa_rotulagem": {
        "procedimentos": "string",
        "equipamentos_rotulagem": "string",
        "modelo_rotulo_anexo": true/false
      },
      "etapa_estocagem": {
        "procedimentos": "string",
        "declaracao_separacao_riscos": true/false
      },
      "etapa_transporte": {
        "procedimentos": "string",
        "declaracao_riscos_transporte": true/false
      },
      "etapa_comercializacao": {
        "procedimentos": "string",
        "declaracao_riscos_comercializacao": true/false
      }
    },
    "rastreabilidade": {
      "sistema_rastreabilidade": "string",
      "mecanismos_registro": {
        "anotacoes_entrada_insumo": true/false,
        "controle_estoque_lote": true/false,
        "identificacao_lotes": true/false,
        "anotacoes_saida_comercializacao": true/false,
        "notas_fiscais_recibos_certificados": true/false
      }
    },
    "controle_pragas_higiene": {
      "higienizacao_ambientes": {
        "procedimentos": "string",
        "produtos_utilizados": "string"
      },
      "desinsetizacao": {
        "declaracao_desinsetizacao_conforme": true/false,
        "procedimentos": "string",
        "periodicidade_aplicacao": "string"
      },
      "declaracao_higienizacao_conforme": true/false
    },
    "producao_paralela": {
      "processa_nao_organicos": true/false,
      "declaracao_nao_processamento_paralelo_mesma_cultura": true/false
    },
    "residuos": {
      "tipos_residuos": "string",
      "disponibilidade_croqui": true/false,
      "destino_efluentes": "string",
      "tratamento_efluentes": true/false,
      "riscos_externos": "string"
    },
    "declaracoes_responsavel": {
      "veracidade_informacoes": true/false,
      "conhecimento_legislacao": true/false,
      "autorizacao_acesso_integral": true/false
    }
  }
}
```

### Para `pmo_completo` com múltiplos formulários:
```json
{
  "metadata": {
    "versao_schema": "2.0.0",
    "tipo_formulario": "pmo_completo",
    "data_criacao": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "id_produtor": "12.345.678/0001-90",
    "grupo_spg": "Nome do Grupo SPG",
    "nome_produtor": "Nome do Produtor ou Razão Social",
    "nome_unidade": "Nome da Unidade de Produção",
    "ano_vigente": 2025,
    "status": "completo"
  },
  "dados": {
    "cadastro_geral_pmo": {
      "tipo_pessoa": "fisica|juridica",
      "identificacao": { /* ... ver estrutura cadastro_geral_pmo acima ... */ },
      "contato": { /* ... */ },
      "propriedade": { /* ... */ },
      "manejo_organico": { /* ... */ },
      "activities": { /* ... */ }
      /* ... demais campos conforme estrutura cadastro_geral_pmo ... */
    },
    "anexo_vegetal": {
      "metadata": {
        "versao_schema": "2.0.0",
        "tipo_formulario": "anexo_vegetal",
        "data_criacao": "YYYY-MM-DDTHH:mm:ss.sssZ",
        "status": "completo"
      },
      "dados": {
        "preparo_solo": [ /* ... */ ],
        "praticas_conservacionistas": [ /* ... */ ]
        /* ... demais campos conforme estrutura anexo_vegetal acima ... */
      }
    },
    "anexo_animal": {
      "metadata": {
        "versao_schema": "2.0.0",
        "tipo_formulario": "anexo_animal",
        "data_criacao": "YYYY-MM-DDTHH:mm:ss.sssZ",
        "status": "completo"
      },
      "dados": { /* ... ver estrutura anexo_animal acima ... */ }
    }
    /* Adicione outros anexos conforme necessário */
  }
}
```

## Regras de Formatação:

1. **CPF/CNPJ**: Use formato com pontuação:
   - CPF: `"123.456.789-01"`
   - CNPJ: `"12.345.678/0001-90"`

2. **Datas**: Use formato ISO 8601:
   - Data: `"2025-10-06"`
   - Data/hora: `"2025-10-06T17:30:00-03:00"`

3. **Coordenadas geográficas**:
   - latitude: número entre -90 e 90
   - longitude: número entre -180 e 180

4. **Booleanos**: Use `true` ou `false` (minúsculas, sem aspas)

5. **Arrays vazios**: Use `[]` ao invés de omitir o campo

6. **Objetos vazios**: Use `{}` ao invés de omitir o campo

## Campos Obrigatórios CRÍTICOS:

- `metadata.versao_schema` = `"2.0.0"` (SEMPRE)
- `metadata.tipo_formulario` (um dos valores válidos acima)
- `metadata.data_criacao` (formato ISO 8601)
- `dados` (objeto, nunca vazio)

## Exemplo de Output Válido (PMO Completo com Cadastro Geral + Anexo Vegetal):

```json
{
  "metadata": {
    "versao_schema": "2.0.0",
    "tipo_formulario": "pmo_completo",
    "data_criacao": "2024-10-22T00:00:00Z",
    "id_produtor": "44.876.030/0001-30",
    "grupo_spg": "Bela Vista",
    "nome_produtor": "MARCELO GONÇALVES DA SILVA / RAQUEL MATOS XAVIER",
    "nome_unidade": "SITIO RECANTO DA PAZ",
    "ano_vigente": 2025,
    "status": "completo"
  },
  "dados": {
    "cadastro_geral_pmo": {
      "tipo_pessoa": "fisica",
      "identificacao": {
        "fornecedores_responsaveis": [
          {
            "nome_completo": "MARCELO GONÇALVES DA SILVA",
            "cpf": "739.066.119-49",
            "data_nascimento": "1969-09-23"
          }
        ],
        "cpf_cnpj": "44.876.030/0001-30",
        "inscricao_estadual": "168.165.939.110",
        "caf_numero": "",
        "grupo_spg": "Bela Vista",
        "data_preenchimento_pmo": "2024-10-22",
        "nome_fantasia": "",
        "nome_unidade_producao": "SITIO RECANTO DA PAZ"
      },
      "contato": {
        "telefone": "(13) 991168778",
        "email": "Bixodoparana69@gmail.com",
        "endereco": {
          "logradouro": "",
          "bairro": "SERTAOZINHO",
          "municipio": "AMPARO",
          "uf": "SP",
          "cep": "13909-899",
          "coordenadas": {
            "latitude": -22.767266,
            "longitude": -46.711834
          }
        },
        "roteiro_acesso": ""
      },
      "propriedade": {
        "posse_terra": "PRÓPRIA",
        "area_total_propriedade_ha": 6.64,
        "area_total_organica_ha": 2.5,
        "relacao_unidade_producao": "A propriedade foi adquirida em 2021",
        "data_aquisicao_posse": "2021-03-10",
        "terra_familiar": true
      },
      "manejo_organico": {
        "historico_propriedade": "ADQUIRIDA EM MARÇO DE 2021, JÁ ERA ORGANICA DESDE 2016",
        "topografia_e_utilizacao": "área íngreme com angulação de até 45 graus",
        "status_manejo_organico": "SIM, POIS ESTOU EM PROCESSO DE AVALIAÇÃO DA CONFORMIDADE ORGÂNICA",
        "anos_manejo_organico": 3,
        "comprovacao_manejo": [
          {"tipo": "CERTIFICADO ANTERIOR", "status": true}
        ],
        "historico_ultimos_10_anos": [
          {
            "cultura_animal": "PRODUÇÃO PRIMÁRIA VEGETAL - HORTALIÇAS",
            "data_ultima_aplicacao_nao_permitido": "",
            "insumo_utilizado": "n/a",
            "estavam_sob_manejo_organico": true,
            "eram_certificados": true
          }
        ],
        "relato_historico_recente": "Compramos o sitio em 2021, implantamos 2 estufas"
      },
      "activities": {
        "escopo_vegetal": true,
        "escopo_animal": false,
        "escopo_cogumelo": false,
        "escopo_apicultura": false,
        "escopo_processamento": false,
        "escopo_processamento_minimo": false
      },
      "mao_de_obra": {
        "familiar": false,
        "identifique_familiar": "",
        "empregados_quantos": 0,
        "diaristas_quantos": 1,
        "parceiros_quantos": 0,
        "meeiro_rural_quantos": 0
      },
      "biodiversidade_e_ambiente": {
        "preservacao_ambiental": [
          {"area": "MATA NATIVA (RESERVA LEGAL)", "possui": true, "preservada": true}
        ],
        "tecnicas_prevencao_incendios": "BARREIRAS vegetais, extintores",
        "experiencia_recuperacao_solos": "n/a",
        "destino_lixo_organico": "COMPOSTAGEM",
        "destino_lixo_nao_organico": "COLETA PÚBLICA",
        "destino_esgoto_domestico": "FOSSA SÉPTICA"
      },
      "comercializacao": {
        "processo_pos_colheita": "O PRODUTO É COLHIDO, ARMAZENADO EM CAIXAS",
        "produtos_armazenados": true,
        "explicacao_armazenamento": "CÂMARA FRIA POR PERÍODO CURTO",
        "tipos_comercializacao": [
          {"tipo": "REVENDA - VENDO PARA OUTROS PRODUTORES DO SPG", "status": true}
        ],
        "modelo_rotulo": "",
        "transporte_produtos": "VEÍCULO PRÓPRIO",
        "rastreabilidade_produtos": "ROMANEIO E NOTA FISCAL",
        "comercializa_nao_organicos": "N/A"
      }
    },
    "anexo_vegetal": {
      "metadata": {
        "versao_schema": "2.0.0",
        "tipo_formulario": "anexo_vegetal",
        "data_criacao": "2024-10-09T00:00:00Z",
        "status": "completo"
      },
      "dados": {
        "preparo_solo": [
          {"tipo": "ROÇADA", "utiliza": true},
          {"tipo": "ARAÇÃO", "utiliza": true}
        ],
        "praticas_conservacionistas": [
          {"tipo": "ROTAÇÃO DE CULTURAS", "descricao": "NAS ESTUFAS: TOMATE/Gramíneas"},
          {"tipo": "ADUBAÇÃO VERDE", "descricao": "PLANTIO DIRETO DE VÁRIAS SEMENTES"}
        ],
        "contaminacao_e_barreiras": {
          "estado_conservacao_barreiras": "BOM ESTADO",
          "risco_deriva_agrotoxicos": false,
          "risco_transgenicos": false
        },
        "produtos_insumos": [
          {
            "marca_nome_comercial": "OLEO DE NEEM",
            "substancia_ingrediente_ativo": "AZARIRACTIN A",
            "fabricante": "DOW",
            "funcao": "FITOSSANITÁRIO",
            "culturas": "TOMATE, ABACATE",
            "status_uso": "USO"
          }
        ],
        "certificacao_detalhes": {
          "lista_produtos_certificar": [
            {
              "produto_variedade": "TOMATE ITALIANO",
              "talhao_area": "ESTUFA 3",
              "estimativa_producao_qtd": "13000KG",
              "periodo_estimativa": "8 MESES",
              "peso_kg_und": "200GR",
              "origem_muda": "SAKATA",
              "origem_semente": "CONVENCIONAL COM TRATAMENTO",
              "tipo": "CONVENCIONAL C/ TRAT"
            }
          ],
          "declaracao_incremento_mudas_sementes_proprias": true
        }
      }
    }
  }
}
```

## TABELA DE NORMALIZAÇÃO DE VALORES

**CRÍTICO**: Os documentos fontes têm valores inconsistentes. Use esta tabela para normalizar TODOS os valores para o padrão do schema:

### 1. `posse_terra` (Situação da Posse da Terra)
| Variações encontradas no documento | Valor PADRÃO no JSON |
|-------------------------------------|----------------------|
| proprietario, proprietário, própria, dono, proprietária | `PROPRIETÁRIO` |
| arrendatario, arrendatário, arrendamento, arrendada | `ARRENDATÁRIO` |
| parceiro, parceria, em parceria | `PARCEIRO` |
| comodato, em comodato | `COMODATO` |
| posseiro, posse | `POSSEIRO` |
| assentado, assentamento | `ASSENTADO` |
| outro, outros, outra forma | `OUTRO` |

### 2. `origem_muda` e `origem_semente` (Origem de Mudas/Sementes)
| Variações encontradas | Valor PADRÃO |
|-----------------------|--------------|
| propria organica, própria orgânica, produção própria orgânica | `PRÓPRIA ORGÂNICA` |
| comprada organica, comprada orgânica, compra orgânica | `COMPRADA ORGÂNICA` |
| comprada não organica, convencional, comprada convencional | `COMPRADA NÃO ORGÂNICA` |
| doacao, doação, recebida | `DOAÇÃO` |

### 3. `tipo` (Tipo de Muda/Semente - Anexo Vegetal)
| Variações encontradas | Valor PADRÃO |
|-----------------------|--------------|
| organica, orgânica, org | `ORGÂNICA` |
| convencional com tratamento, c/ tratamento, tratada | `CONVENCIONAL C/ TRAT` |
| convencional sem tratamento, s/ tratamento, não tratada | `CONVENCIONAL S/ TRAT` |

### 4. `destino_lixo_organico` (Destino do Lixo Orgânico)
| Variações encontradas | Valor PADRÃO |
|-----------------------|--------------|
| compostagem, compostado, faz compostagem, compostar | `compostagem` |
| alimentacao animal, alimentação de animais, para os animais | `alimentacao_animal` |
| queima, queimado, queimar | `queima` |
| coleta publica, coleta pública, lixeiro | `coleta_publica` |
| outro, outros, outra forma | `outro` |

### 5. `destino_lixo_nao_organico` (Destino do Lixo Não Orgânico)
| Variações encontradas | Valor PADRÃO |
|-----------------------|--------------|
| coleta seletiva, reciclagem coletiva | `coleta_seletiva` |
| coleta publica, coleta pública, lixeiro | `coleta_publica` |
| reciclagem, reciclagem própria, recicla | `reciclagem` |
| queima, queimado | `queima` |
| enterro, enterrado, enterra | `enterro` |
| outro, outros | `outro` |

### 6. `destino_esgoto` (Destino do Esgoto Doméstico)
| Variações encontradas | Valor PADRÃO |
|-----------------------|--------------|
| fossa septica, fossa séptica | `fossa_septica` |
| fossa negra, fossa rudimentar | `fossa_negra` |
| rede publica, rede pública, esgoto público | `rede_publica` |
| biodigestor | `biodigestor` |
| outro, outros | `outro` |

### 7. `agua_uso` (Uso da Água)
| Variações encontradas | Valor PADRÃO |
|-----------------------|--------------|
| irrigacao, irrigação, para irrigar | `irrigacao` |
| pulverizacao, pulverização, aplicação | `pulverizacao` |
| consumo animal, para os animais, bebedouro | `consumo_animal` |
| processamento, processar, indústria | `processamento` |
| higienizacao, higienização, limpeza | `higienizacao` |

### 8. `agua_origem` (Origem da Água)
| Variações encontradas | Valor PADRÃO |
|-----------------------|--------------|
| poco, poço, poço artesiano, poço caipira | `poco` |
| nascente, mina, olho d'água | `nascente` |
| rio, córrego, riacho, ribeirão | `rio` |
| represa, açude, barragem | `represa` |
| rede publica, rede pública, SABESP, água encanada | `rede_publica` |
| cisterna, caixa d'água | `cisterna` |

### 9. `nivel_risco` (Nível de Risco de Contaminação)
| Variações encontradas | Valor PADRÃO |
|-----------------------|--------------|
| baixo, baixa, pequeno, mínimo | `baixo` |
| medio, médio, moderado | `medio` |
| alto, alta, grande, elevado | `alto` |
| nenhum, nenhuma, sem risco, zero | `nenhum` |

### 10. `canal_comercializacao` (Canais de Comercialização)
| Variações encontradas | Valor PADRÃO |
|-----------------------|--------------|
| feira livre, feira, feirante | `feira_livre` |
| csa, comunidade que sustenta agricultura | `csa` |
| entrega domicilio, entrega em domicílio, delivery | `entrega_domicilio` |
| loja propria, loja própria, loja | `loja_propria` |
| supermercado, mercado | `supermercado` |
| pnae, alimentação escolar, merenda | `pnae` |
| paa, programa de aquisição | `paa` |
| restaurantes, restaurante | `restaurantes` |
| atacado, atacadista | `atacado` |
| outro, outros | `outro` |

### 11. `tempo_registros` (Tempo de Manutenção de Registros)
| Variações encontradas | Valor PADRÃO |
|-----------------------|--------------|
| menos de 1 ano, < 1 ano | `menos_1_ano` |
| 1 a 3 anos, de 1 a 3 anos | `1_a_3_anos` |
| 3 a 5 anos, de 3 a 5 anos | `3_a_5_anos` |
| mais de 5 anos, > 5 anos, + de 5 anos | `mais_5_anos` |

### 12. Campos Booleanos (true/false)
**REGRA GERAL**: Converta SEMPRE para boolean true/false (sem aspas)

| Variações para TRUE | Variações para FALSE |
|---------------------|----------------------|
| sim, s, yes, y, verdadeiro, possui, tem, x, marcado | não, n, no, nao, falso, não possui, não tem, vazio, desmarcado |

**Exemplos:**
- "terra_familiar": "sim" → `"terra_familiar": true`
- Checkbox marcado → `true`
- Checkbox vazio/ausente → `false`

### 13. Campos de Data
**FORMATO PADRÃO**: `YYYY-MM-DD` (ISO 8601)

| Variações encontradas | Exemplo PADRÃO |
|-----------------------|----------------|
| 22/10/2024 | `2024-10-22` |
| 22/10/24 | `2024-10-22` |
| 22 de outubro de 2024 | `2024-10-22` |
| out/2024 | `2024-10-01` (usar dia 01) |

---

## INSTRUÇÕES DE APLICAÇÃO DA NORMALIZAÇÃO:

1. **SEMPRE consulte esta tabela** antes de preencher campos com valores predefinidos
2. **Converta para UPPERCASE** quando o schema indicar (ex: PROPRIETÁRIO, ORGÂNICA)
3. **Mantenha lowercase com underscore** quando o schema indicar (ex: feira_livre, poco)
4. **Seja tolerante com variações**: se encontrar valor similar mas não exato, use a lógica da tabela
5. **Em caso de dúvida**: escolha o valor mais próximo semanticamente da tabela

---

## IMPORTANTE:

- NÃO invente campos que não existem no schema
- NÃO use nomes de campos diferentes dos definidos no schema
- NÃO misture estruturas de diferentes tipos de formulário no mesmo `dados` (exceto para `pmo_completo`)
- SEMPRE valide que o JSON gerado é válido sintaticamente
- Se um campo não tiver informação, use string vazia `""` para texto, `null` para valores opcionais, `[]` para arrays, `{}` para objetos
- Retorne APENAS o JSON válido, sem texto adicional antes ou depois
