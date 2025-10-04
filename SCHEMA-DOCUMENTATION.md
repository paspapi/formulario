# 📋 Documentação do Schema JSON Unificado - Sistema PMO ANC

## 📖 Visão Geral

Este documento descreve a estrutura padronizada de dados JSON para **todos** os formulários do Sistema PMO da ANC (Associação de Agricultura Natural de Campinas e Região).

**Versão do Schema:** `2.0.0`
**Data de Criação:** Janeiro 2025
**Padrão:** JSON Schema Draft-07

---

## 🎯 Objetivo

Unificar a estrutura de dados de todos os formulários PMO, garantindo:

- ✅ **Consistência**: Mesma estrutura para todos os formulários
- ✅ **Validação**: Schema JSON validável e tipado
- ✅ **Interoperabilidade**: Compatibilidade entre formulários e sistemas
- ✅ **Rastreabilidade**: Metadados completos para auditoria
- ✅ **Exportação/Importação**: Backup e migração de dados

---

## 📂 Estrutura Geral

Todos os formulários seguem a seguinte estrutura base:

```json
{
  "metadata": {
    "versao_schema": "2.0.0",
    "tipo_formulario": "cadastro_geral_pmo | anexo_vegetal | anexo_animal | ...",
    "id_pmo": "pmo_2024_12345678901_sitio-boa-vista",
    "data_criacao": "2024-01-15T10:30:00.000Z",
    "ultima_atualizacao": "2024-01-20T14:45:00.000Z",
    "status": "rascunho",
    "id_produtor": "123.456.789-01",
    "grupo_spg": "ANC",
    "nome_produtor": "João da Silva",
    "nome_unidade": "Sítio Boa Vista",
    "ano_vigente": 2024
  },
  "dados": {
    /* Campos específicos de cada formulário */
  },
  "arquivos_anexados": {
    "croqui.pdf": {
      "nome": "croqui.pdf",
      "tipo": "application/pdf",
      "tamanho": 245678,
      "data_base64": "JVBERi0xLjQKJ...",
      "data_upload": "2024-01-15T11:00:00.000Z"
    }
  },
  "validacao": {
    "percentual_completo": 85,
    "campos_obrigatorios_completos": true,
    "erros": [],
    "avisos": [
      {
        "campo": "car",
        "mensagem": "CAR não anexado. É obrigatório por lei.",
        "tipo": "recomendacao"
      }
    ],
    "data_validacao": "2024-01-20T14:45:00.000Z"
  },
  "historico": [
    {
      "data": "2024-01-15T10:30:00.000Z",
      "acao": "criacao",
      "usuario": "joao.silva@email.com",
      "observacoes": "PMO criado via formulário web"
    }
  ]
}
```

---

## 🔑 Campos do `metadata`

### Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `versao_schema` | string | Versão do schema JSON (sempre "2.0.0") | `"2.0.0"` |
| `tipo_formulario` | string | Tipo de formulário PMO | `"cadastro_geral_pmo"` |
| `data_criacao` | string (ISO 8601) | Data/hora de criação | `"2024-01-15T10:30:00.000Z"` |

### Campos Opcionais (mas recomendados)

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id_pmo` | string | ID único do PMO | `"pmo_2024_12345678901_sitio-boa-vista"` |
| `ultima_atualizacao` | string (ISO 8601) | Data/hora da última atualização | `"2024-01-20T14:45:00.000Z"` |
| `status` | string | Status do formulário | `"rascunho"`, `"completo"`, `"enviado"` |
| `id_produtor` | string | CPF ou CNPJ do produtor | `"123.456.789-01"` |
| `grupo_spg` | string | Nome do grupo SPG | `"ANC"` |
| `nome_produtor` | string | Nome completo ou razão social | `"João da Silva"` |
| `nome_unidade` | string | Nome da unidade de produção | `"Sítio Boa Vista"` |
| `ano_vigente` | integer | Ano de vigência do PMO | `2024` |

### Formato do `id_pmo`

O ID único do PMO segue o padrão:

```
pmo_{ano}_{cpf_cnpj_sem_pontuacao}_{unidade_normalizada}
```

**Exemplos:**
- `pmo_2024_12345678901_sitio-boa-vista`
- `pmo_2024_12345678000100_fazenda-esperanca`

**Normalização da unidade:**
- Lowercase (tudo minúsculo)
- Sem acentos
- Caracteres especiais substituídos por `-`
- Hífens duplicados removidos

---

## 📦 Tipos de Formulário

| Valor | Descrição | Obrigatório? |
|-------|-----------|--------------|
| `cadastro_geral_pmo` | Cadastro Geral do PMO | ✅ Sim |
| `anexo_vegetal` | Anexo I - Produção Vegetal | ⬜ Condicional |
| `anexo_animal` | Anexo III - Produção Animal | ⬜ Condicional |
| `anexo_cogumelo` | Anexo II - Cogumelos | ⬜ Condicional |
| `anexo_apicultura` | Anexo IV - Apicultura | ⬜ Condicional |
| `anexo_processamento` | Anexo - Processamento Completo | ⬜ Condicional |
| `anexo_processamentominimo` | Anexo - Processamento Mínimo | ⬜ Condicional |
| `avaliacao` | Formulário de Avaliação | ⬜ Opcional |

---

## 📄 Objeto `dados`

O objeto `dados` contém os campos específicos de cada formulário. A estrutura varia conforme o tipo:

### Cadastro Geral PMO

```json
"dados": {
  "tipo_certificacao": "spg",
  "tipo_pessoa": "fisica",
  "nome_completo": "João da Silva",
  "cpf_cnpj": "123.456.789-01",
  "nome_unidade_producao": "Sítio Boa Vista",
  "escopo_hortalicas": "sim",
  "escopo_frutas": "sim",
  "responsavel_nome": ["João da Silva", "Maria Silva"],
  "responsavel_cpf_cnpj": ["123.456.789-01", "987.654.321-00"],
  "responsavel_funcao": ["proprietario", "responsavel_tecnico"],
  "endereco": {
    "cep": "13000-000",
    "logradouro": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "municipio": "Campinas",
    "uf": "SP",
    "latitude": -22.907104,
    "longitude": -47.063236
  }
}
```

### Anexo Vegetal

```json
"dados": {
  "nome_fornecedor": "João da Silva",
  "nome_unidade_producao": "Sítio Boa Vista",
  "data_preenchimento": "2024-01-15",
  "preparo_solo": "Manual com enxada rotativa",
  "praticas_conservacionistas": ["curva_nivel", "cobertura_morta"],
  "adubacao_fonte": "Composto orgânico próprio",
  "controle_pragas_metodo": "Controle biológico"
}
```

### Anexo Animal

```json
"dados": {
  "especies": ["bovinos", "galinhas"],
  "bovinos_quantidade": "10",
  "galinhas_quantidade": "50",
  "alimentacao_pasto": "sim",
  "alimentacao_racao_organica": "sim",
  "bem_estar_area_minima": "sim",
  "manejo_sanitario_preventivo": "sim"
}
```

---

## 📎 Objeto `arquivos_anexados`

Armazena arquivos em formato base64:

```json
"arquivos_anexados": {
  "croqui_propriedade.pdf": {
    "nome": "croqui_propriedade.pdf",
    "tipo": "application/pdf",
    "tamanho": 245678,
    "data_base64": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL...",
    "data_upload": "2024-01-15T11:00:00.000Z"
  },
  "car.pdf": {
    "nome": "car.pdf",
    "tipo": "application/pdf",
    "tamanho": 189234,
    "data_base64": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL...",
    "data_upload": "2024-01-15T11:05:00.000Z"
  }
}
```

**Tipos permitidos:**
- `application/pdf` - PDFs
- `image/jpeg` - Imagens JPG
- `image/png` - Imagens PNG

**Limite de tamanho:** 5MB por arquivo

---

## ✅ Objeto `validacao`

Informações sobre a validação do formulário:

```json
"validacao": {
  "percentual_completo": 85,
  "campos_obrigatorios_completos": false,
  "erros": [
    {
      "campo": "cpf_cnpj",
      "mensagem": "CPF inválido",
      "tipo": "formato"
    }
  ],
  "avisos": [
    {
      "campo": "car",
      "mensagem": "CAR não anexado. É obrigatório por lei.",
      "tipo": "recomendacao"
    }
  ],
  "data_validacao": "2024-01-20T14:45:00.000Z"
}
```

### Tipos de Erro

- `obrigatorio` - Campo obrigatório não preenchido
- `formato` - Formato inválido (CPF, CNPJ, email, etc.)
- `valor_invalido` - Valor fora do range permitido
- `regra_negocio` - Regra de negócio não atendida

### Tipos de Aviso

- `recomendacao` - Recomendação de preenchimento
- `atencao` - Algo que requer atenção
- `informacao` - Informação adicional

---

## 📜 Objeto `historico`

Registro de alterações do formulário:

```json
"historico": [
  {
    "data": "2024-01-15T10:30:00.000Z",
    "acao": "criacao",
    "usuario": "joao.silva@email.com",
    "observacoes": "PMO criado via formulário web"
  },
  {
    "data": "2024-01-15T14:20:00.000Z",
    "acao": "edicao",
    "usuario": "joao.silva@email.com",
    "observacoes": "Adicionado croqui da propriedade"
  },
  {
    "data": "2024-01-20T09:15:00.000Z",
    "acao": "validacao",
    "usuario": "tecnico@anc.org.br",
    "observacoes": "Validação técnica aprovada"
  },
  {
    "data": "2024-01-20T14:45:00.000Z",
    "acao": "envio",
    "usuario": "joao.silva@email.com",
    "observacoes": "PMO enviado para certificação"
  }
]
```

### Ações disponíveis

- `criacao` - Criação do formulário
- `edicao` - Edição de dados
- `validacao` - Validação técnica
- `envio` - Envio para certificação
- `aprovacao` - Aprovação do PMO
- `rejeicao` - Rejeição com motivo

---

## 🔄 Migração de Dados Antigos

O sistema possui migração automática de dados do formato antigo (v1.0) para o novo (v2.0):

### Mapeamento de Chaves Antigas

| Chave Antiga | Formulário Novo |
|--------------|-----------------|
| `cadastro_geral_pmo_data` | `cadastro_geral_pmo` |
| `anexo_vegetal_data` | `anexo_vegetal` |
| `pmo_anexo_animal` | `anexo_animal` |
| `anexo_cogumelo_data` | `anexo_cogumelo` |
| `pmo_anexo_apicultura` | `anexo_apicultura` |
| `pmo_processamento` | `anexo_processamento` |
| `pmo_processamento_minimo` | `anexo_processamentominimo` |

### Processo de Migração

1. **Detecção automática**: Ao inicializar o PMOStorageManager
2. **Criação de PMO**: Gera ID único com base nos dados antigos
3. **Migração de formulários**: Converte cada formulário antigo para novo formato
4. **Preservação**: Dados antigos são mantidos (não deletados)

---

## 💻 Implementação nos Formulários

### Coletar Dados (collectFormData)

```javascript
collectFormData() {
    const form = document.getElementById(this.config.formId);
    if (!form) return null;

    const formData = new FormData(form);
    const data = {
        metadata: {
            versao_schema: '2.0.0',
            tipo_formulario: 'anexo_vegetal', // Alterar conforme formulário
            data_criacao: formData.get('data_preenchimento') || new Date().toISOString(),
            ultima_atualizacao: new Date().toISOString(),
            status: 'rascunho'
        },
        dados: {}
    };

    // Adicionar PMO info se disponível
    if (window.PMOStorageManager) {
        const pmo = window.PMOStorageManager.getActivePMO();
        if (pmo) {
            data.metadata.id_pmo = pmo.id;
            data.metadata.id_produtor = pmo.cpf_cnpj;
            data.metadata.grupo_spg = pmo.grupo_spg;
            data.metadata.nome_produtor = pmo.nome;
            data.metadata.nome_unidade = pmo.unidade;
            data.metadata.ano_vigente = pmo.ano_vigente;
        }
    }

    // Converter todos os campos do FormData
    for (let [key, value] of formData.entries()) {
        if (data.dados[key]) {
            // Array
            if (Array.isArray(data.dados[key])) {
                data.dados[key].push(value);
            } else {
                data.dados[key] = [data.dados[key], value];
            }
        } else {
            data.dados[key] = value;
        }
    }

    // Adicionar validação
    data.validacao = {
        percentual_completo: this.updateProgress(),
        campos_obrigatorios_completos: this.validateForm(),
        data_validacao: new Date().toISOString()
    };

    return data;
}
```

### Exportar JSON (exportJSON)

```javascript
exportJSON() {
    const data = this.collectFormData();
    if (!data) {
        this.showMessage('Erro ao coletar dados', 'error');
        return;
    }

    const pmoId = data.metadata.id_pmo || 'sem-pmo';
    const fileName = `anexo-vegetal_${pmoId}_${new Date().toISOString().split('T')[0]}.json`;

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    this.showMessage('JSON exportado com sucesso!', 'success');
    console.log('✅ Anexo Vegetal exportado:', fileName);
}
```

---

## 🧪 Validação do Schema

Para validar um JSON exportado contra o schema:

```javascript
// Usando biblioteca ajv (JSON Schema validator)
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = require('./pmo-unified.schema.json');
const data = require('./cadastro-geral-pmo_pmo_2024_12345678901_sitio-boa-vista_2024-01-20.json');

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
    console.log('Erros de validação:', validate.errors);
} else {
    console.log('✅ JSON válido!');
}
```

---

## 📝 Exemplos Completos

### Exemplo 1: Cadastro Geral PMO (Mínimo)

```json
{
  "metadata": {
    "versao_schema": "2.0.0",
    "tipo_formulario": "cadastro_geral_pmo",
    "data_criacao": "2024-01-15T10:30:00.000Z"
  },
  "dados": {
    "nome_completo": "João da Silva",
    "tipo_pessoa": "fisica",
    "cpf_cnpj": "123.456.789-01",
    "nome_unidade_producao": "Sítio Boa Vista",
    "tipo_certificacao": "spg",
    "grupo_spg": "ANC"
  }
}
```

### Exemplo 2: Anexo Vegetal (Completo)

Ver arquivo: `examples/anexo-vegetal-completo.json`

### Exemplo 3: Múltiplos Formulários (PMO Completo)

Ver arquivo: `examples/pmo-completo.json`

---

## ⚠️ Notas Importantes

1. **Sempre use `versao_schema: "2.0.0"`** em novos formulários
2. **Campos com `[]`** no FormData são automaticamente convertidos em arrays
3. **Arquivos base64** devem incluir o prefixo `data:` completo
4. **Datas** devem estar no formato ISO 8601 (UTC)
5. **ID do PMO** é gerado automaticamente pelo PMOStorageManager
6. **Migração automática** preserva dados antigos

---

## 📞 Suporte

- **Organização**: ANC - Associação de Agricultura Natural de Campinas e Região
- **Schema**: [pmo-unified.schema.json](./pmo-unified.schema.json)
- **Issues**: Reportar problemas no repositório

---

**Versão:** 2.0.0
**Última atualização:** Janeiro 2025
**Autor:** Sistema PMO ANC
