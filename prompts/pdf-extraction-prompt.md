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

## 📊 Estrutura do JSON de Saída

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
      "cpf_cnpj": "",
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
    "escopo": {
      "hortalicas": false,
      "frutas": false,
      "graos": false,
      "medicinais": false,
      "cogumelos": false,
      "pecuaria": false,
      "apicultura": false,
      "proc_minimo": false,
      "processamento": false
    },
    // NOTA: Campo é "escopo" (SINGULAR), não "escopos"

    "pretende_certificar": true,  // ← SEMPRE true se houver QUALQUER escopo marcado acima
    "activities": {               // ← DUPLICAR os escopos aqui com prefixo "escopo_"
      "escopo_hortalicas": false,
      "escopo_frutas": false,
      "escopo_graos": false,
      "escopo_medicinais": false,
      "escopo_cogumelos": false,
      "escopo_pecuaria": false,
      "escopo_apicultura": false,
      "escopo_proc_minimo": false,
      "escopo_processamento": false  // ← Se "escopo.processamento" = true, este TAMBÉM deve ser true
    }
  },
  "escopos": {
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
        "geral": {
          "razao_social": "",
          "cnpj_empresa": "",
          "escopo_origem_animal": false,
          "escopo_origem_vegetal": false,
          "endereco_processamento": "",
          "coordenadas": {
            "latitude": 0.0,
            "longitude": 0.0
          },
          "numero_funcionarios": 0
        },
        "situacao_legal": [
          {
            "documento_legal": "",
            "possui_documento": false,
            "numero_documento": "",
            "situacao_documento": ""
          }
        ],
        "fornecedores": [
          {
            "ingrediente": "",
            "nome_fornecedor": "",
            "quantidade_mensal_kg": 0
          }
        ],
        "produtos": [
          {
            "produto_final": "",
            "ingredientes_organicos": "",
            "percent_organicos": 0.0,
            "ingredientes_nao_organicos": "",
            "percent_nao_organicos": 0.0,
            "expectativa_producao_mensal": 0.0,
            "tipo_produto": "ORGÂNICO|COM_INGREDIENTES_ORGÂNICOS"
          }
        ],
        "higienizacao": [
          {
            "marca_nome_comercial": "",
            "substancia_ativa": "",
            "fabricante": "",
            "quando_usar": "",
            "ja_usa_pretende": false
          }
        ],
        "controles": [
          {
            "atividade_controle": "",
            "metodo_controle": ""
          }
        ],
        "mao_obra": [
          {
            "tipo_funcionario": "FAMILIAR|ASSALARIADO|TEMPORÁRIO",
            "quantidade_funcionarios": 0
          }
        ]
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
- Se PDF tem "CNPJ:" → extrair para campo `cpf_cnpj` (NÃO criar campo "cnpj")
- Se PDF tem "CPF:" → extrair para campo `cpf_cnpj` (NÃO criar campo "cpf")
- Se PDF tem "Razão Social:" → extrair para `nome_completo` E `razao_social`
- Se PDF tem "Nome:" → extrair para `nome_completo`

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

### 4. **Detecção de Escopos** ⚠️ CRÍTICO

Analise o PDF para identificar quais atividades o produtor realiza:

- **Hortaliças/Frutas** → `dados.escopo.hortalicas: true` + incluir `anexo_vegetal`
- **Pecuária/Animais** → `dados.escopo.pecuaria: true` + incluir `anexo_animal`
- **Cogumelos** → `dados.escopo.cogumelos: true` + incluir `anexo_cogumelo`
- **Apicultura/Mel** → `dados.escopo.apicultura: true` + incluir `anexo_apicultura`
- **Processamento** → `dados.escopo.processamento: true` + incluir `anexo_processamento`

**🚨 REGRAS CRÍTICAS DE ESCOPOS:**

1. **DUPLICAR ESCOPOS**: Cada escopo marcado como `true` em `dados.escopo.{tipo}` DEVE ser duplicado em `dados.activities.escopo_{tipo}` como `true`

   **Exemplo:**
   ```json
   {
     "dados": {
       "escopo": {
         "processamento": true  // ← Marcado
       },
       "activities": {
         "escopo_processamento": true  // ← DEVE ser true também
       }
     }
   }
   ```

2. **pretende_certificar**: SEMPRE `true` se houver QUALQUER escopo marcado

3. **Incluir em escopos**: Só incluir em `escopos` os formulários que o produtor REALMENTE preenche

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
- [ ] `dados.escopo.{tipo}` = true SOMENTE se houver dados para esse anexo
- [ ] `dados.activities.escopo_{tipo}` = MESMO VALOR de `dados.escopo.{tipo}` (DUPLICAR)
- [ ] `dados.pretende_certificar` = true se QUALQUER escopo estiver marcado
- [ ] `escopos.anexo_{tipo}` presente SOMENTE se `dados.escopo.{tipo}` = true
- [ ] Cada anexo em `escopos` tem `metadata` + `dados` completos

**Exemplo de Validação de Escopos:**
```json
{
  "dados": {
    "escopo": {
      "processamento": true,  // ← Marcado
      "hortalicas": false
    },
    "pretende_certificar": true,  // ← true porque tem escopo marcado
    "activities": {
      "escopo_processamento": true,  // ← DEVE estar true (duplicado)
      "escopo_hortalicas": false
    }
  },
  "escopos": {
    "anexo_processamento": { /* dados completos */ }  // ← Incluído porque escopo = true
    // anexo_vegetal NÃO incluído porque escopo.hortalicas = false
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

## 🎯 Exemplo Completo (Estrutura EXATA Aceita pelo Sistema)

**Este exemplo mostra a estrutura EXATA que o sistema de importação aceita:**

```json
{
  "metadata": {
    "versao_schema": "2.0.0",
    "tipo_formulario": "pmo_completo",
    "data_criacao": "2025-01-10T15:30:00.000Z",
    "id_pmo": "pmo_2024_46765198000103_quinta-quebra-machado",
    "id_produtor": "46.765.198/0001-03",  // ← Campo obrigatório
    "grupo_spg": "Bela Vista",             // ← Campo obrigatório
    "nome_produtor": "Sítio Quinta do Quebra Machado",  // ← Campo obrigatório
    "nome_unidade": "Quinta do Quebra Machado",         // ← Campo obrigatório
    "ano_vigente": 2024,                   // ← Campo obrigatório (número)
    "status": "completo",
    "ultima_atualizacao": "2025-01-10T15:30:00.000Z"
  },
  "dados": {
    "tipo_pessoa": "juridica",  // ← "fisica" ou "juridica"
    "identificacao": {
      "nome_completo": "Sítio Quinta do Quebra Machado",  // ← Sistema busca este campo
      "cpf_cnpj": "46.765.198/0001-03",  // ← Sistema busca ESTE NOME (não "cnpj")
      "inscricao_estadual": "15.587.1.208-99",
      "inscricao_municipal": "",
      "nome_fantasia": "Quinta do Quebra Machado - QQM",
      "nome_unidade_producao": "Quinta do Quebra Machado",  // ← Sistema busca este campo
      "razao_social": "Sítio Quinta do Quebra Machado"
    },
    "contato": {
      "telefone": "(19) 99773-8697",
      "email": "lualuzi1@yahoo.com.br",
      "endereco": {
        "endereco_completo": "Sítio Quinta do Quebra Machado, Pantaleão, Amparo - SP, 13900-000",
        "bairro": "Pantaleão",
        "municipio": "Amparo",
        "uf": "SP",
        "cep": "13900-000",
        "coordenadas": {
          "latitude": -22.6344166667,
          "longitude": -46.8167777778
        }
      }
    },
    "escopo": {  // ← SINGULAR "escopo", não "escopos"
      "processamento": true  // ← Marca quais anexos estão ativos
    },
    "pretende_certificar": true,  // ← SEMPRE true se tiver escopo marcado
    "activities": {               // ← DUPLICAR escopos com prefixo "escopo_"
      "escopo_processamento": true  // ← Mesmo valor de dados.escopo.processamento
    }
  },
  "escopos": {  // ← RAIZ, contém dados completos dos anexos ativos
    "anexo_processamento": {  // ← Só incluir se dados.escopo.processamento = true
      "metadata": {
        "versao_schema": "2.0.0",
        "tipo_formulario": "anexo_processamento",
        "data_criacao": "2025-01-10T15:30:00.000Z",
        "ultima_atualizacao": "2025-01-10T15:30:00.000Z",
        "status": "completo"
      },
      "dados": {
        "geral": {
          "razao_social": "Sítio Quinta do Quebra Machado",
          "cnpj_empresa": "46.765.198/0001-03",
          "escopo_origem_vegetal": true,
          "numero_funcionarios": 1
        },
        "fornecedores": [
          {
            "ingrediente": "Farinha de trigo branca",
            "nome_fornecedor": "Casa do Naturalista",
            "quantidade_mensal_kg": 25
          }
        ],
        "produtos": [
          {
            "produto_final": "PÃO INTEGRAL",
            "ingredientes_organicos": "1. farinha integral – 500gr, 2. levain – 300gr",
            "percent_organicos": 99.62,
            "ingredientes_nao_organicos": "1. fermento – 5gr",
            "percent_nao_organicos": 0.38,
            "expectativa_producao_mensal": 15.6,
            "tipo_produto": "ORGÂNICO"
          }
        ],
        "higienizacao": [
          {
            "marca_nome_comercial": "YPÊ",
            "substancia_ativa": "DETERGENTE",
            "fabricante": "YPÊ",
            "quando_usar": "NA LIMPEZA COM ÁGUA",
            "ja_usa_pretende": true
          }
        ],
        "mao_obra": [
          {
            "tipo_funcionario": "FAMILIAR",
            "quantidade_funcionarios": 1
          }
        ]
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

**Versão:** 1.0.0
**Compatível com:** PMO Unified Schema v2.0.0
**Data:** Janeiro 2025
