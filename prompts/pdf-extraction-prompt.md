# 🤖 Prompt de IA: Extração de Dados de PMO de PDF

## Instruções para a IA

Você é um especialista em extrair dados de documentos PDF de **Plano de Manejo Orgânico (PMO)** e convertê-los para o formato JSON padronizado do Sistema PMO ANC.

---

## 📋 Tarefa

Analise o conteúdo do PDF fornecido e extraia TODOS os dados para gerar um JSON válido seguindo o **Schema PMO Unified v2.0.0**.

---

## ⚠️ IMPORTANTE: CONSULTE OS SCHEMAS OFICIAIS - NÃO ADIVINHE ESTRUTURAS

**Antes de extrair os dados, você DEVE consultar os schemas JSON oficiais para garantir estrutura EXATA:**

📁 **Schemas Disponíveis:**
- `/database/schemas/cadastro-geral-pmo.schema.json` - Cadastro Geral (obrigatório)
- `/database/schemas/anexo-vegetal.schema.json` - Produção Primária Vegetal
- `/database/schemas/anexo-animal.schema.json` - Produção Animal
- `/database/schemas/anexo-cogumelo.schema.json` - Produção de Cogumelos
- `/database/schemas/anexo-apicultura.schema.json` - Apicultura/Meliponicultura
- `/database/schemas/anexo-processamento.schema.json` - Processamento Industrial
- `/database/schemas/anexo-processamentomin.schema.json` - Processamento Mínimo

**⚡ REGRAS CRÍTICAS:**
1. ✅ Use a estrutura EXATA dos schemas - campo por campo
2. ❌ NÃO invente nomes de campos
3. ❌ NÃO renomeie campos (ex: se schema tem `cpf_cnpj`, use `cpf_cnpj`, NÃO use `cnpj`)
4. ✅ Respeite tipos de dados (string, number, boolean, array, object)
5. ✅ Consulte o schema para saber se campo é array ou object

---

## 📊 Estrutura do JSON de Saída - Schema v2.0.0 Unificado

**⚡ REGRA FUNDAMENTAL: TODOS os formulários (cadastro + anexos) seguem estrutura `metadata` + `dados`**

```json
{
  "metadata": {
    "versao_schema": "2.0.0",
    "tipo_formulario": "pmo_completo",
    "data_criacao": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "id_pmo": "pmo_{ano}_{cpf_cnpj_numeros}_{unidade_slug}",
    "id_produtor": "CPF ou CNPJ formatado",
    "grupo_spg": "Nome do grupo SPG",
    "nome_produtor": "Nome completo ou razão social",
    "nome_unidade": "Nome da unidade de produção",
    "ano_vigente": 2024,
    "status": "completo",
    "ultima_atualizacao": "YYYY-MM-DDTHH:mm:ss.sssZ"
  },
  "dados": {
    "tipo_pessoa": "fisica" ou "juridica",
    "identificacao": {
      "nome_completo": "",
      "cpf_cnpj": "",  // ← SEMPRE usar este nome (NÃO "cnpj" ou "cpf" separados)
      "inscricao_estadual": "",
      "inscricao_municipal": "",
      "nome_fantasia": "",
      "nome_unidade_producao": "",
      "razao_social": ""
    },
    "contato": {
      "telefone": "",
      "email": "",
      "endereco": {
        "endereco_completo": "",
        "logradouro": "",
        "numero": "",
        "complemento": "",
        "bairro": "",
        "municipio": "",
        "uf": "",
        "cep": "",
        "coordenadas": {
          "latitude": 0.0,
          "longitude": 0.0
        }
      }
    },
    "propriedade": {
      "posse_terra": "PRÓPRIA|ARRENDADA|PARCERIA|COMODATO|OUTROS",
      "area_total_ha": 0.0,
      "caf_numero": "",
      "caf_nao_possui": false,
      "roteiro_acesso": "",
      "data_aquisicao_posse": "",
      "terra_familiar": false
    },
    "manejo_organico": {
      "anos_manejo_organico": 0,
      "situacao_manejo": "",
      "comprovacao_manejo": []
    },
    "activities": {  // ← ÚNICO objeto de escopos (NÃO criar "escopo" separado)
      "escopo_hortalicas": false,
      "escopo_frutas": false,
      "escopo_graos": false,
      "escopo_medicinais": false,
      "escopo_cogumelos": false,
      "escopo_pecuaria": false,
      "escopo_apicultura": false,
      "escopo_proc_minimo": false,
      "escopo_processamento": false
    },
    "pretende_certificar": true  // ← SEMPRE true se QUALQUER activities.escopo_* = true
  },
  "escopos": {
    // Incluir APENAS anexos cujo escopo está ativo (activities.escopo_* = true)
    "anexo_vegetal": {
      "metadata": {
        "versao_schema": "2.0.0",
        "tipo_formulario": "anexo_vegetal",
        "data_criacao": "YYYY-MM-DDTHH:mm:ss.sssZ",
        "ultima_atualizacao": "YYYY-MM-DDTHH:mm:ss.sssZ",
        "status": "completo"
      },
      "dados": {
        "preparo_solo": [],
        "praticas_conservacionistas": [],
        "adubacao_nutricao": {},
        "controle_pragas": {},
        "produtos_insumos": []
      }
    },
    "anexo_processamento": {
      "metadata": {
        "versao_schema": "2.0.0",
        "tipo_formulario": "anexo_processamento",
        "data_criacao": "YYYY-MM-DDTHH:mm:ss.sssZ",
        "ultima_atualizacao": "YYYY-MM-DDTHH:mm:ss.sssZ",
        "status": "completo"
      },
      "dados": {
        "identificacao": {
          "fornecedores_responsaveis": [{
            "nome_completo": "",
            "cpf": "",
            "data_nascimento": ""
          }],
          "dados_empresa": {
            "razao_social": "",
            "nome_fantasia": "",
            "cpf_cnpj": "",  // ← Padronizado (NÃO "cnpj_empresa" ou "cnpj_produtor_rural")
            "inscricao_estadual": "",
            "inscricao_municipal": "",
            "grupo_spg": "",
            "data_preenchimento": ""
          },
          "contato": {
            "telefone": "",
            "email": ""
          }
        },
        "localizacao": {
          "endereco_processamento": {
            "logradouro": "",
            "numero": "",
            "bairro": "",
            "municipio": "",
            "uf": "",
            "cep": ""
          },
          "coordenadas": {
            "latitude": 0.0,
            "longitude": 0.0
          },
          "tipo_local": "",
          "roteiro_acesso": ""
        },
        "situacao_legal": {
          "documentos_legais": [{
            "documento": "",
            "possui": false,
            "numero": "",
            "situacao": "",
            "data_validade": "",
            "orgao_emissor": ""
          }],
          "declaracoes": {
            "ciencia_obrigacoes": false,
            "possui_alvara_funcionamento": false,
            "nao_usa_transgenicos": false,
            "conhece_legislacao_especifica": false
          }
        },
        "mao_obra": {
          "situacao_funcional": [{
            "tipo_funcionario": "",
            "quantidade": 0,
            "funcao": "",
            "capacitacao_organicos": false
          }],
          "numero_total_funcionarios": 0
        },
        "produtos_processados": [{  // ← Nome correto (NÃO "produtos")
          "nome_produto_final": "",
          "conteudo_processado": "",
          "descricao_processamento": "",
          "expectativa_producao_mensal_kg": 0,
          "origem_materia_prima": {
            "produto_proprio": false,
            "nome_agricultor_fornecedor": "",
            "cidade_origem": "",
            "uf_origem": "",
            "opac_certificou_parceiro": false
          },
          "tipo_produto": "",
          "embalagem": "",
          "rotulagem_conforme": false
        }],
        "fornecedores_materia_prima": [{
          "nome_fornecedor": "",
          "tipo_pessoa": "",
          "cpf_cnpj": "",
          "produtos_fornecidos": [],
          "certificacao_organica": false,
          "opac_certificadora": ""
        }],
        "etapas_processamento": {
          "recepcao_materia_prima": {},
          "lavagem_higienizacao": {},
          "embalagem": {},
          "armazenamento_estocagem": {}
        },
        "rastreabilidade": {
          "sistema_rastreabilidade": "",
          "mecanismos_registro": {
            "anotacoes_entrada_insumo": false,
            "controle_estoque_lote": false,
            "identificacao_lotes": false
          }
        },
        "controle_pragas_higiene": {
          "higienizacao_ambientes": {},
          "desinsetizacao": {},
          "declaracao_higienizacao_conforme": false
        },
        "boas_praticas_fabricacao": {
          "possui_manual_bpf": false,
          "funcionarios_treinados": false,
          "procedimentos_implementados": {}
        },
        "declaracoes_responsavel": {
          "veracidade_informacoes": false,
          "conhecimento_legislacao": false,
          "autorizacao_acesso_integral": false
        }
      }
    }
  }
}
```

---

## 🔍 Regras de Extração

### 1. **📋 Campos Obrigatórios (Sistema Busca Estes Nomes EXATOS)**

**⚠️ ATENÇÃO: O sistema de importação busca campos específicos. Use os nomes EXATOS abaixo:**

**Em `metadata`:**
- `versao_schema`: sempre "2.0.0"
- `tipo_formulario`: sempre "pmo_completo"
- `data_criacao`: data atual em ISO 8601
- `id_produtor`: CPF ou CNPJ formatado (igual a `dados.identificacao.cpf_cnpj`)
- `grupo_spg`: Nome do grupo SPG
- `ano_vigente`: Ano do PMO (número, ex: 2024)
- `nome_produtor`: Nome completo ou razão social
- `nome_unidade`: Nome da unidade de produção

**Em `dados.identificacao` (SISTEMA BUSCA ESTES CAMPOS):**
- `cpf_cnpj` ← **Use este nome**, NÃO use `cnpj` ou `cpf` separados
- `nome_completo` ← Nome do produtor (PF) ou razão social (PJ)
- `razao_social` ← Se pessoa jurídica, preencher também
- `nome_unidade_producao` ← Nome da unidade

**🚨 MAPEAMENTO CRÍTICO (PDF → JSON):**

| Texto no PDF | Campo JSON | Observação |
|---|---|---|
| "CNPJ:" | `cpf_cnpj` | NÃO criar campo "cnpj" separado |
| "CPF:" | `cpf_cnpj` | NÃO criar campo "cpf" separado |
| "Razão Social:" | `nome_completo` E `razao_social` | Preencher ambos |
| "Nome:" | `nome_completo` | Nome do produtor pessoa física |
| "Produtos processados:" | `produtos_processados` | NÃO usar "produtos" |
| "CNPJ da empresa:" | `dados_empresa.cpf_cnpj` | NÃO usar "cnpj_empresa" |

### 2. **Formatação de Dados**
- **CPF**: `123.456.789-01`
- **CNPJ**: `12.345.678/0001-90`
- **CEP**: `13900-000`
- **Telefone**: `(19) 99999-9999`
- **Datas**: formato ISO 8601 `YYYY-MM-DDTHH:mm:ss.sssZ`
- **Coordenadas**: números decimais (ex: -22.6344166667)

### 3. **ID do PMO**
Gerar no formato: `pmo_{ano}_{cpf_cnpj_somente_numeros}_{unidade_slug}`

**Exemplo:**
- CPF: `123.456.789-01` → `12345678901`
- Unidade: `Sítio Boa Vista` → `sitio-boa-vista`
- ID: `pmo_2024_12345678901_sitio-boa-vista`

### 4. **Detecção de Escopos** ⚠️ CRÍTICO - REGRAS SIMPLES

**📍 REGRA ÚNICA: Analise o PDF e marque `activities.escopo_{tipo}` = true se produtor realiza a atividade**

| Atividade no PDF | Campo JSON | Incluir Anexo |
|---|---|---|
| Hortaliças, frutas, grãos, plantas | `activities.escopo_hortalicas: true` | `anexo_vegetal` |
| Cogumelos (Shitake, Shiimeji, etc) | `activities.escopo_cogumelos: true` | `anexo_cogumelo` |
| Pecuária, animais, leite, ovos | `activities.escopo_pecuaria: true` | `anexo_animal` |
| Apicultura, mel, própolis | `activities.escopo_apicultura: true` | `anexo_apicultura` |
| Processamento (pães, doces, conservas) | `activities.escopo_processamento: true` | `anexo_processamento` |
| Processamento mínimo (higienização) | `activities.escopo_proc_minimo: true` | `anexo_processamentomin` |

**⚡ LÓGICA DE IMPLEMENTAÇÃO:**

```javascript
// Pseudocódigo para clareza

// 1. Marcar activities
if (PDF_menciona_processamento_de_alimentos) {
  dados.activities.escopo_processamento = true;
}

// 2. Definir pretende_certificar
if (algum dados.activities.escopo_* === true) {
  dados.pretende_certificar = true;
} else {
  dados.pretende_certificar = false;
}

// 3. Incluir anexos correspondentes
if (dados.activities.escopo_processamento === true) {
  escopos.anexo_processamento = {
    metadata: {...},
    dados: {...}  // Preencher com dados extraídos do PDF
  };
}
```

**❌ NÃO CRIAR:**
- Campo `dados.escopo` (objeto duplicado)
- Use APENAS `dados.activities` com nomenclatura `escopo_*`

### 5. **Tabelas Dinâmicas**

Extrair tabelas como arrays de objetos:

**Exemplo - Fornecedores:**
```json
"fornecedores": [
  {
    "ingrediente": "Farinha de trigo branca",
    "nome_fornecedor": "Casa do Naturalista",
    "quantidade_mensal_kg": 25
  },
  {
    "ingrediente": "Açúcar orgânico",
    "nome_fornecedor": "Fazenda Toca",
    "quantidade_mensal_kg": 10
  }
]
```

**Exemplo - Produtos:**
```json
"produtos": [
  {
    "produto_final": "PÃO INTEGRAL",
    "ingredientes_organicos": "1. farinha de trigo integral – 500gr, 2. levain – 300gr",
    "percent_organicos": 99.62,
    "ingredientes_nao_organicos": "1. fermento biológico – 5gr",
    "percent_nao_organicos": 0.38,
    "expectativa_producao_mensal": 15.6,
    "tipo_produto": "ORGÂNICO"
  }
]
```

### 6. **Valores Padrão**

Se informação não estiver disponível no PDF:
- Strings vazias: `""`
- Números: `0` ou `0.0`
- Booleanos: `false`
- Arrays: `[]`
- Objetos: `{}`

### 7. **Tipo de Produto (Processamento)**

Classificar produtos baseado em % de ingredientes orgânicos:
- **≥ 95% orgânicos** → `"ORGÂNICO"`
- **70-94% orgânicos** → `"COM_INGREDIENTES_ORGÂNICOS"`
- **< 70% orgânicos** → NÃO pode ser certificado (avisar no campo observações)

---

## 📋 REFERÊNCIA RÁPIDA: Campos Principais por Anexo

**Consulte os schemas oficiais em `/database/schemas/` para estrutura COMPLETA. Abaixo, os campos principais:**

### Anexo Processamento Industrial (`anexo_processamento`)

| Campo JSON | Tipo | Observação |
|---|---|---|
| `dados.identificacao.dados_empresa.cpf_cnpj` | string | NÃO usar "cnpj_empresa" |
| `dados.produtos_processados` | array | NÃO usar "produtos" |
| `dados.fornecedores_materia_prima` | array | Lista de fornecedores certificados |
| `dados.etapas_processamento` | object | Todas as etapas do processo |
| `dados.rastreabilidade.mecanismos_registro` | object | Controles obrigatórios |
| `dados.boas_praticas_fabricacao` | object | BPF obrigatório |
| `dados.declaracoes_responsavel` | object | Declarações exigidas |

### Anexo Vegetal (`anexo_vegetal`)

| Campo JSON | Tipo | Observação |
|---|---|---|
| `dados.preparo_solo` | array | Práticas de preparo |
| `dados.praticas_conservacionistas` | array | Lista de práticas |
| `dados.adubacao_nutricao` | object | Inclui `receitas_proprias` |
| `dados.controle_pragas.controle_formigas` | object | Métodos utilizados |
| `dados.produtos_insumos` | array | Insumos permitidos |

### Anexo Cogumelos (`anexo_cogumelo`)

| Campo JSON | Tipo | Observação |
|---|---|---|
| `dados.tipos_cogumelos` | array | Ou `producao` dependendo do schema |
| `dados.substrato` | object | Inclui `materiais_formulacao` |
| `dados.inoculo` | object | Origem e certificação |
| `dados.ambiente_cultivo` | object | Controle ambiental |
| `dados.controle_pragas_doencas` | object | Ou `controle_pragas` array |
| `dados.residuos_efluentes` | object | Ou `residuos` |

### Anexo Animal (`anexo_animal`)

| Campo JSON | Tipo | Observação |
|---|---|---|
| `dados.especies_criadas` | array | Detalhes de cada espécie |
| `dados.alimentacao` | object | Plano alimentar completo |
| `dados.bem_estar_animal` | object | Práticas de bem-estar |
| `dados.manejo_sanitario` | object | Tratamentos e vacinas |
| `dados.instalacoes_animais` | array | Descrição das instalações |

### Anexo Apicultura (`anexo_apicultura`)

| Campo JSON | Tipo | Observação |
|---|---|---|
| `dados.apiarios` | array | Localização de cada apiário |
| `dados.colmeias` | object | Quantidade e especificações |
| `dados.floradas` | array | Floradas por período |
| `dados.alimentacao_artificial` | object | Se utiliza |
| `dados.sanidade_apicola` | object | Tratamentos permitidos |

---

## 🔍 VALIDAÇÃO CONTRA SCHEMAS (CRÍTICO)

**Antes de retornar o JSON, CONSULTE os schemas e valide:**

### **1. Estrutura Conforme Schemas**
- [ ] `dados` segue exatamente `/database/schemas/cadastro-geral-pmo.schema.json`
- [ ] Cada anexo em `escopos` segue seu schema correspondente
- [ ] Campos têm os NOMES EXATOS dos schemas (não renomear)
- [ ] Tipos de dados corretos (string, number, boolean, array, object)

### **2. Campos Obrigatórios do Sistema**
- [ ] `metadata.id_produtor` preenchido
- [ ] `metadata.grupo_spg` preenchido
- [ ] `metadata.ano_vigente` é número
- [ ] `metadata.nome_produtor` preenchido
- [ ] `metadata.nome_unidade` preenchido
- [ ] `dados.identificacao.cpf_cnpj` preenchido (ESTE NOME EXATO)
- [ ] `dados.identificacao.nome_completo` ou `razao_social` preenchido
- [ ] `dados.identificacao.nome_unidade_producao` preenchido
- [ ] `dados.escopo` (SINGULAR) presente

### **3. Formatação e Consistência**
- [ ] CPF/CNPJ formatado corretamente
- [ ] Datas em formato ISO 8601
- [ ] Coordenadas em formato decimal (não DMS)
- [ ] ID do PMO gerado corretamente
- [ ] Tabelas como arrays de objetos
- [ ] Percentuais de ingredientes somam ~100%
- [ ] Tipo de produto condiz com % orgânicos

### **4. Lógica de Escopos** ⚠️ CRÍTICO
- [ ] `dados.activities.escopo_{tipo}` = true SOMENTE se houver dados para esse anexo no PDF
- [ ] `dados.pretende_certificar` = true se QUALQUER activities.escopo_* estiver marcado
- [ ] `escopos.anexo_{tipo}` presente SOMENTE se `dados.activities.escopo_{tipo}` = true
- [ ] Cada anexo em `escopos` tem `metadata` + `dados` completos
- [ ] ❌ NÃO criar campo `dados.escopo` separado

**Exemplo de Validação de Escopos:**
```json
{
  "dados": {
    "activities": {
      "escopo_processamento": true,  // ← PDF menciona processamento
      "escopo_hortalicas": false,    // ← PDF NÃO menciona produção vegetal
      "escopo_cogumelos": false
    },
    "pretende_certificar": true  // ← true porque tem pelo menos 1 escopo ativo
  },
  "escopos": {
    "anexo_processamento": {
      "metadata": {...},
      "dados": {...}  // ← Incluído porque activities.escopo_processamento = true
    }
    // anexo_vegetal NÃO incluído porque activities.escopo_hortalicas = false
    // anexo_cogumelo NÃO incluído porque activities.escopo_cogumelos = false
  }
}
```

---

## 📤 Formato de Saída

**RETORNE APENAS O JSON VÁLIDO, SEM TEXTO ADICIONAL.**

```json
{
  "metadata": { ... },
  "dados": { ... },
  "escopos": { ... }
}
```

---

## 🎯 Exemplo Completo - Baseado em Caso Real

**Este exemplo é baseado em pmoteste.json e mostra a estrutura EXATA aceita pelo sistema:**

```json
{
  "metadata": {
    "versao_schema": "2.0.0",
    "tipo_formulario": "pmo_completo",
    "data_criacao": "2023-11-06T00:00:00.000Z",
    "id_pmo": "pmo_2024_75813203834_sitio-manti",
    "id_produtor": "758.132.038-34",
    "grupo_spg": "IBIUNA",
    "nome_produtor": "MAURO AUGUSTO FERNANDES",
    "nome_unidade": "SÍTIO MANTÍ",
    "ano_vigente": 2024,
    "status": "completo",
    "ultima_atualizacao": "2023-11-06T00:00:00.000Z"
  },
  "dados": {
    "tipo_pessoa": "fisica",
    "identificacao": {
      "nome_completo": "MAURO AUGUSTO FERNANDES",
      "cpf_cnpj": "758.132.038-34",  // ← SEMPRE usar este nome
      "inscricao_estadual": "001532559.00-14",
      "inscricao_municipal": "",
      "nome_fantasia": "Mantí Biô",
      "nome_unidade_producao": "SÍTIO MANTÍ",
      "razao_social": ""
    },
    "contato": {
      "telefone": "(11) 99952-9383",
      "email": "MAUROFERN@YAHOO.COM.BR",
      "endereco": {
        "endereco_completo": "ESTRADA DA CACHOEIRA KM 05",
        "logradouro": "ESTRADA DA CACHOEIRA",
        "numero": "KM 05",
        "complemento": "",
        "bairro": "D. Luciana",
        "municipio": "Gonçalves",
        "uf": "MG",
        "cep": "37680-000",
        "coordenadas": {
          "latitude": -22.63583333,
          "longitude": -45.88111111
        }
      }
    },
    "propriedade": {
      "posse_terra": "PRÓPRIA",
      "area_total_ha": 16.0,
      "caf_numero": "",
      "caf_nao_possui": false,
      "roteiro_acesso": "O acesso é feito pela estrada que dá acesso a Cachoeira dos Henriques",
      "data_aquisicao_posse": "2004-12-01",
      "terra_familiar": false
    },
    "manejo_organico": {
      "anos_manejo_organico": 19,
      "situacao_manejo": "A propriedade adquirida em 2004 havia sido utilizada como pastagem. O manejo orgânico foi iniciado em 2005.",
      "comprovacao_manejo": []
    },
    "activities": {  // ← ÚNICO objeto de escopos
      "escopo_hortalicas": true,
      "escopo_frutas": true,
      "escopo_graos": true,
      "escopo_medicinais": true,
      "escopo_cogumelos": true,
      "escopo_pecuaria": false,
      "escopo_apicultura": false,
      "escopo_proc_minimo": false,
      "escopo_processamento": false
    },
    "pretende_certificar": true
  },
  "escopos": {
    "anexo_vegetal": {
      "metadata": {
        "versao_schema": "2.0.0",
        "tipo_formulario": "anexo_vegetal",
        "data_criacao": "2023-11-06T00:00:00.000Z",
        "ultima_atualizacao": "2023-11-06T00:00:00.000Z",
        "status": "completo"
      },
      "dados": {
        "preparo_solo": [],
        "praticas_conservacionistas": [
          {
            "tipo": "ROTAÇÃO DE CULTURAS",
            "descricao": "ROTACIONANDO YACON E GRÃOS"
          },
          {
            "tipo": "ADUBAÇÃO VERDE",
            "descricao": "NABO FORRAGEIRO, CROTALÁRIA, AMENDOIM FORRAGEIRO"
          },
          {
            "tipo": "COBERTURA DE SOLO COM PALHADA",
            "descricao": "COM PALHADA DA ROÇADA E ESTERCO CURTIDO"
          }
        ],
        "adubacao_nutricao": {
          "composicao_substrato": [
            {
              "material": "TERRA DE BARRANCO",
              "origem": "PRÓPRIA",
              "proporcao_percent": 50
            },
            {
              "material": "COMPOSTO",
              "origem": "PRÓPRIO",
              "proporcao_percent": 30
            }
          ],
          "receitas_proprias": [
            {
              "nome_receita": "BOKASHI",
              "ingredientes": [
                {"nome": "ÁGUA S/ CLORO", "quantidade_dose": "30 L"},
                {"nome": "TORTA MAMONA", "quantidade_dose": "50KG"}
              ]
            }
          ]
        },
        "controle_pragas": {
          "controle_formigas": {
            "situacao": "SITUAÇÃO EXISTENTE",
            "metodos": [
              "FITAS ADESIVAS NOS TRONCOS",
              "BIOISCA",
              "CAL VIRGEM"
            ]
          },
          "risco_deriva_agrotoxicos": false,
          "risco_transgenicos": false
        },
        "produtos_insumos": [
          {
            "marca_nome_comercial": "BOKASHI",
            "substancia": "NITROGENIO, FÓSFORO, POTÁSSIO",
            "fabricante": "PRÓPRIO",
            "funcao": "FERTILIZANTE",
            "cultura_talhao": "TODAS",
            "uso_ou_pretende": true
          },
          {
            "marca_nome_comercial": "CALCARIO",
            "substancia": "CALCIO, MAGNÉSIO",
            "fabricante": "DIVERSOS",
            "funcao": "CORREÇÃO DO SOLO",
            "cultura_talhao": "TODAS",
            "uso_ou_pretende": true
          }
        ]
      }
    },
    "anexo_cogumelo": {
      "metadata": {
        "versao_schema": "2.0.0",
        "tipo_formulario": "anexo_cogumelo",
        "data_criacao": "2023-11-06T00:00:00.000Z",
        "ultima_atualizacao": "2023-11-06T00:00:00.000Z",
        "status": "completo"
      },
      "dados": {
        "producao": [
          {
            "produto": "Shitake",
            "origem_semente": "Comprado",
            "origem_substrato": "Comprado",
            "estimativa_producao_anual_kg": 2000,
            "area_cultivada_m2": 100
          }
        ],
        "substrato": {
          "producao_propria": false,
          "ingredientes": [
            {
              "material": "SERRAGEM",
              "origem": "COMPRADO",
              "tipo": "CONVENCIONAL",
              "risco_transgenicos": false,
              "proporcao_percent": 0.0
            }
          ],
          "analise_metais_pesados": true,
          "metodos_tratamento_madeira": "Não se aplica. Utiliza serragem de primeiro corte."
        },
        "inoculo": {
          "origem": "COMPRADA",
          "comprovacao_nao_transgenico": true,
          "informacoes_adicionais": "ADQUIRIDOS BLOCOS AXÊNICOS JÁ INOCULADOS"
        },
        "controle_pragas": [
          {
            "praga": "FUNGUS GNATS",
            "praticas": "PLACAS COM COLA ENTOMOLÓGICA",
            "substancias": "POLIBUTENO E SÍLICA SINTÉTICA",
            "origem_fabricante": "PROMIP"
          }
        ],
        "residuos": {
          "destino_substrato": "COMPOSTAGEM NO SÍTIO",
          "destino_chorume": "NÃO GERA"
        }
      }
    }
  }
}
```

---

## 🚀 Como Usar Este Prompt

### Método 1: Claude/ChatGPT/Gemini

1. Copie todo este prompt
2. Cole no chat da IA
3. Anexe ou cole o conteúdo do PDF
4. A IA retornará o JSON estruturado
5. Copie o JSON e salve em arquivo `.json`
6. Importe no Sistema PMO

### Método 2: Via API

```javascript
const prompt = `[CONTEÚDO DESTE ARQUIVO]`;
const pdfText = await extractTextFromPDF(pdfFile);

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `${prompt}\n\n===PDF CONTENT===\n${pdfText}`
    }]
  })
});

const json = await response.json();
// json.content[0].text contém o JSON extraído
```

---

## 📝 Notas Importantes

- **Precisão**: IA pode cometer erros, sempre revise o JSON gerado
- **Validação**: Use o schema `pmo-unified.schema.json` para validar
- **Campos Faltantes**: Se o PDF não tiver uma informação, deixe vazio ou use valor padrão
- **Tabelas Complexas**: Extraia linha por linha, preservando estrutura
- **Coordenadas**: Converter de DMS para decimal se necessário
- **Percentuais**: Calcular se não estiver explícito no PDF

---

## 📝 Resumo de Mudanças v2.0.0

### ✅ Estrutura Unificada
- **TODOS** os formulários (cadastro + anexos) usam estrutura `metadata` + `dados`
- Removida estrutura flat (v1.0 obsoleto)

### ✅ Nomenclatura Padronizada
- `cpf_cnpj` para TODOS (NÃO mais `cnpj_empresa`, `cnpj_produtor_rural`)
- `produtos_processados` (NÃO `produtos`)
- `dados_empresa.cpf_cnpj` em anexos de processamento

### ✅ Sistema de Escopos Simplificado
- REMOVIDO: objeto `dados.escopo` duplicado
- USAR APENAS: `dados.activities` com nomenclatura `escopo_*`
- `pretende_certificar = true` se algum `activities.escopo_*` = true

### ✅ Campos Completos
- Adicionados: `rastreabilidade`, `boas_praticas_fabricacao`, `declaracoes_responsavel`
- Exemplo real baseado em pmoteste.json
- Tabela de referência rápida por anexo

---

**Versão:** 2.0.0
**Compatível com:** PMO Unified Schema v2.0.0
**Data:** Janeiro 2025
**Changelog:** Unificação completa para schema v2.0.0, remoção de duplicação escopo/activities, padronização de nomenclatura
