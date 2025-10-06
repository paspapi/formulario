# Regras Comuns - Extração de PDFs PMO/ANC

Este documento contém regras compartilhadas por todos os prompts de extração de dados de formulários PMO (Plano de Manejo Orgânico) e cadastros ANC.

**IMPORTANTE**: Este arquivo deve ser carregado ANTES de qualquer prompt específico de extração.

---

## 1. Formatação de Dados

### 1.1 CPF e CNPJ

**CPF** (Pessoa Física):
- Formato: `123.456.789-01` (com pontos e hífen)
- 11 dígitos numéricos
- Validar dígitos verificadores se possível

**CNPJ** (Pessoa Jurídica):
- Formato: `12.345.678/0001-90` (com pontos, barra e hífen)
- 14 dígitos numéricos
- Validar dígitos verificadores se possível

**Campo JSON**:
- SEMPRE usar `cpf_cnpj` (campo único)
- NUNCA usar `cpf` e `cnpj` separados
- NUNCA usar variações como `cpf_produtor`, `cnpj_empresa`

**Exemplos**:
```json
✅ CORRETO:
"cpf_cnpj": "123.456.789-01"
"cpf_cnpj": "12.345.678/0001-90"

❌ INCORRETO:
"cpf": "123.456.789-01"
"cnpj": "12.345.678/0001-90"
"cpf_produtor": "123.456.789-01"
```

### 1.2 Datas

**Formato**: ISO 8601 → `YYYY-MM-DD`

**Conversões**:
- `15/03/2024` → `2024-03-15`
- `03/2024` (apenas mês/ano) → `2024-03-01` (usar dia 01)
- `2024` (apenas ano) → `2024-01-01`
- Datas textuais: "março de 2024" → `2024-03-01`

**Campos de data**:
- `data_extracao`: data atual da extração
- `data_preenchimento`: data informada no formulário
- `data_nascimento`: formato completo obrigatório
- `data_aquisicao_posse`: aceita apenas ano

**Exemplos**:
```json
✅ CORRETO:
"data_preenchimento": "2024-03-15"
"data_nascimento": "1985-07-20"

❌ INCORRETO:
"data_preenchimento": "15/03/2024"
"data_nascimento": "20/07/1985"
```

### 1.3 Coordenadas Geográficas

**Formato**: Decimal (WGS84)

**Latitude**: -90 a +90 (Brasil: -33 a +5)
**Longitude**: -180 a +180 (Brasil: -74 a -34)

**Conversão de Graus/Minutos/Segundos**:
- Fórmula: `Decimal = Graus + (Minutos/60) + (Segundos/3600)`
- Se Sul (S) ou Oeste (W): multiplicar por -1

**Exemplo**:
- `23°32'51"S, 46°38'10"W` → `{"latitude": -23.5475, "longitude": -46.6361}`

**Precisão**: 4 a 6 casas decimais

```json
✅ CORRETO:
"coordenadas": {
  "latitude": -23.5475,
  "longitude": -46.6361
}

❌ INCORRETO:
"coordenadas": {
  "latitude": "23°32'51\"S",
  "longitude": "46°38'10\"W"
}
```

### 1.4 Valores Monetários

**Formato**: Número sem símbolos
**Separador decimal**: ponto (.)
**Sem separador de milhares**

**Conversões**:
- `R$ 1.500,50` → `1500.50`
- `R$ 25.000,00` → `25000.00`
- `1500` → `1500.00`

```json
✅ CORRETO:
"valor_medio_un": 1500.50

❌ INCORRETO:
"valor_medio_un": "R$ 1.500,50"
"valor_medio_un": "1500,50"
```

### 1.5 Áreas

**Unidade padrão**: Hectares (ha)

**Conversões**:
- 1 alqueire paulista = 2.42 ha
- 1 alqueire mineiro = 4.84 ha
- 10.000 m² = 1 ha
- 1 km² = 100 ha

**Sempre especificar unidade no PDF antes de converter**

```json
✅ CORRETO:
"area_total_ha": 5.5

❌ INCORRETO:
"area_total": "5,5 hectares"
"area_total_ha": "5.5ha"
```

### 1.6 Telefone

**Formato**: Apenas números (sem formatação)
**Com DDD**: sempre incluir

**Conversões**:
- `(11) 98765-4321` → `11987654321`
- `11 9 8765-4321` → `11987654321`
- `+55 11 98765-4321` → `11987654321`

```json
✅ CORRETO:
"telefone": "11987654321"

❌ INCORRETO:
"telefone": "(11) 98765-4321"
"telefone": "+55 11 98765-4321"
```

### 1.7 CEP

**Formato**: `12345-678` (com hífen)

```json
✅ CORRETO:
"cep": "12345-678"

❌ INCORRETO:
"cep": "12345678"
```

### 1.8 Email

**Formato**: Minúsculas, validar estrutura básica

```json
✅ CORRETO:
"email": "produtor@exemplo.com.br"

❌ INCORRETO:
"email": "PRODUTOR@EXEMPLO.COM.BR"
```

---

## 2. Nomenclatura Padronizada

### 2.1 Campos que SEMPRE Usam o Mesmo Nome

| Campo Correto | ❌ Variações Incorretas |
|--------------|------------------------|
| `cpf_cnpj` | cpf, cnpj, cpf_produtor, cnpj_empresa |
| `nome_completo` | nome, nome_produtor, nome_responsavel |
| `grupo_spg` | grupo, spg, nome_grupo |
| `data_preenchimento` | data, data_elaboracao, data_cadastro |
| `inscricao_estadual` | ie, insc_estadual |
| `inscricao_municipal` | im, insc_municipal |
| `area_total_ha` | area_total, area_ha |
| `nome_unidade_producao` | unidade_producao, nome_propriedade |

### 2.2 Convenções de Nomenclatura

**Snake_case**: Sempre usar underline, nunca camelCase
```json
✅ "nome_completo"
❌ "nomeCompleto"
```

**Plural para arrays**: Arrays sempre no plural
```json
✅ "produtos_certificar": []
❌ "produto_certificar": []
```

**Booleanos**: Prefixos claros
```json
✅ "possui_inspecao_sanitaria": false
✅ "tem_atividade": false
✅ "utiliza_substrato": false

❌ "inspecao_sanitaria": false  (ambíguo)
```

---

## 3. Valores Padrão (quando campo não encontrado)

| Tipo | Valor Padrão | Exemplo |
|------|-------------|---------|
| String | `""` (string vazia) | `"nome": ""` |
| Number | `0` ou `0.0` | `"area_ha": 0` |
| Boolean | `false` | `"possui_car": false` |
| Array | `[]` (array vazio) | `"produtos": []` |
| Object | `{}` (objeto vazio) | `"endereco": {}` |

**NUNCA use `null`**

```json
✅ CORRETO:
{
  "nome": "",
  "area_ha": 0,
  "possui_car": false,
  "produtos": [],
  "endereco": {}
}

❌ INCORRETO:
{
  "nome": null,
  "area_ha": null,
  "possui_car": null,
  "produtos": null
}
```

---

## 4. Detecção de Tipo de Documento

### 4.1 Identificadores de Anexos

**No PDF, procure por estas palavras-chave**:

| Anexo | Palavras-chave | Tipo no Schema |
|-------|---------------|----------------|
| Cadastro Geral | "dados gerais", "identificação", "PMO" | `CADASTRO_GERAL` |
| Anexo I - Vegetal | "ANEXO I", "produção vegetal", "culturas", "preparo do solo" | `ANEXO_I_VEGETAL` |
| Anexo II - Cogumelo | "ANEXO II", "cogumelos", "shiitake", "substrato", "inoculo" | `ANEXO_II_COGUMELOS` |
| Anexo III - Animal | "ANEXO III", "pecuária", "animais", "plantel", "espécies criadas" | `ANEXO_III_ANIMAL` |
| Anexo IV - Apicultura | "ANEXO IV", "apicultura", "mel", "abelhas", "colmeias", "floradas" | `ANEXO_IV_APICULTURA` |
| Processamento | "agroindústria", "CNPJ", "processamento", "produtos processados" | `PROCESSAMENTO` |
| Proc. Mínimo | "processamento mínimo", "higienização", "sanitização" | `PROCESSAMENTO_MINIMO` |

### 4.2 Campo `metadata.tipo_documento`

**Tipo**: Array de strings

**Valores possíveis**:
```json
"tipo_documento": [
  "CADASTRO_GERAL",
  "ANEXO_I_VEGETAL",
  "ANEXO_II_COGUMELOS",
  "ANEXO_III_ANIMAL",
  "ANEXO_IV_APICULTURA",
  "PROCESSAMENTO",
  "PROCESSAMENTO_MINIMO"
]
```

**Regra**: Adicionar ao array TODOS os anexos detectados no PDF

**Exemplo**:
```json
// PMO completo com produção vegetal e animal
"tipo_documento": ["CADASTRO_GERAL", "ANEXO_I_VEGETAL", "ANEXO_III_ANIMAL"]

// Apenas processamento
"tipo_documento": ["CADASTRO_GERAL", "PROCESSAMENTO"]
```

---

## 5. Escopo de Certificação

### 5.1 Regras de Negócio

**Campo**: `certificacao.escopo` (no cadastro geral)

**Valores possíveis**:
- `"Produção"`
- `"Processamento"`
- `"Produção + Processamento"`

### 5.2 Lógica de Preenchimento

#### Escopo: "Produção"
✅ **Preencher**:
- `anexo_vegetal`
- `anexo_cogumelos`
- `anexo_animal`
- `anexo_apicultura`

❌ **Deixar vazios** (objeto vazio `{}`):
- `processamento_minimo`
- `processamento_industrial`

#### Escopo: "Processamento"
✅ **Preencher**:
- `processamento_minimo` OU
- `processamento_industrial`

❌ **Deixar vazios**:
- `anexo_vegetal`
- `anexo_cogumelos`
- `anexo_animal`
- `anexo_apicultura`

#### Escopo: "Produção + Processamento"
✅ **Preencher**: Tudo que estiver presente no documento

---

## 6. Arrays vs Objetos

### 6.1 Quando usar Array `[]`

**Use array quando**: Há múltiplos registros do mesmo tipo

**Exemplos**:
```json
"produtos_certificar": [
  {"produto": "Alface", "variedade": "Crespa"},
  {"produto": "Tomate", "variedade": "Cereja"}
],

"especies_criadas": [
  {"especie": "Bovinos", "numero_animais_atual": 10},
  {"especie": "Galinhas", "numero_animais_atual": 50}
],

"floradas": [
  {"nome_planta": "Laranjeira", "periodo_floracao": "Agosto-Setembro"},
  {"nome_planta": "Eucalipto", "periodo_floracao": "Outubro-Novembro"}
]
```

### 6.2 Quando usar Object `{}`

**Use objeto quando**: É um registro único com múltiplas propriedades

**Exemplos**:
```json
"endereco": {
  "logradouro": "Rua das Flores",
  "numero": "123",
  "bairro": "Centro",
  "municipio": "São Paulo",
  "uf": "SP",
  "cep": "01234-567"
},

"contato": {
  "telefone": "11987654321",
  "email": "produtor@exemplo.com"
},

"coordenadas": {
  "latitude": -23.5475,
  "longitude": -46.6361
}
```

---

## 7. Tratamento de Tabelas no PDF

### 7.1 Estrutura Padrão

**Tabela no PDF**:
```
| Produto | Variedade | Área (ha) |
|---------|-----------|-----------|
| Alface  | Crespa    | 0.5       |
| Tomate  | Cereja    | 1.0       |
```

**JSON Resultante**:
```json
"produtos_certificar": [
  {
    "produto": "Alface",
    "variedade": "Crespa",
    "area_ha": 0.5
  },
  {
    "produto": "Tomate",
    "variedade": "Cereja",
    "area_ha": 1.0
  }
]
```

### 7.2 Tabelas Vazias

**Se tabela não preenchida**: Retornar array vazio `[]`

```json
✅ CORRETO:
"produtos_certificar": []

❌ INCORRETO:
"produtos_certificar": null
"produtos_certificar": [{}]
```

### 7.3 Células Vazias na Tabela

**Se célula vazia**: Usar valor padrão do tipo

```json
// Célula "Variedade" vazia
{
  "produto": "Alface",
  "variedade": "",  // string vazia
  "area_ha": 0.5
}
```

---

## 8. Campos Calculados/Derivados

### 8.1 `tipo_pessoa`

**Lógica**:
- Se `cpf_cnpj` tem 14 caracteres (11 dígitos) → `"FISICA"`
- Se `cpf_cnpj` tem 18 caracteres (14 dígitos) → `"JURIDICA"`

```json
// CPF: 123.456.789-01
"tipo_pessoa": "FISICA"

// CNPJ: 12.345.678/0001-90
"tipo_pessoa": "JURIDICA"
```

### 8.2 `id_produtor`

**Gerar se não existir no PDF**:

**Formato**: `{UF}{MUNICIPIO_3_LETRAS}{CPF_CNPJ_6_ULTIMOS_DIGITOS}{ANO}`

**Exemplo**:
- UF: SP
- Município: São Paulo → SPA
- CPF: 123.456.789-01 → últimos 6 dígitos: 789-01 → 78901
- Ano: 2024

**Resultado**: `SPASPA78901-2024`

### 8.3 `data_extracao`

**Sempre gerar**: Data atual no momento da extração

```json
"data_extracao": "2024-03-15"  // ISO 8601
```

---

## 9. Campos Condicionais

### 9.1 Condições Booleanas

**Regra**: Se campo booleano = `true`, preencher campos relacionados

**Exemplos**:

```json
// Se possui inspeção sanitária
"inspecao_sanitaria": {
  "possui_inspecao_sanitaria": true,
  "detalhes_inspecao": "SIF 123/SP"  // OBRIGATÓRIO
}

// Se NÃO possui
"inspecao_sanitaria": {
  "possui_inspecao_sanitaria": false,
  "detalhes_inspecao": ""  // Vazio
}
```

```json
// Se utiliza substrato
"adubacao_nutricao": {
  "utiliza_substrato": true,
  "substrato_receitas": [...]  // OBRIGATÓRIO
}

// Se NÃO utiliza
"adubacao_nutricao": {
  "utiliza_substrato": false,
  "substrato_receitas": []  // Array vazio
}
```

### 9.2 Produção Paralela

```json
// Se possui produção paralela
"producao_paralela": {
  "possui_producao_paralela": true,
  "detalhes": {  // OBRIGATÓRIO preencher
    "tipos": [...],
    "risco_contaminacao": "...",
    "manejos_bloqueios": "..."
  }
}

// Se NÃO possui
"producao_paralela": {
  "possui_producao_paralela": false,
  "detalhes": {}  // Objeto vazio
}
```

---

## 10. Validação Básica

### 10.1 Campos Obrigatórios (SEMPRE)

Independente do anexo, **SEMPRE** preencher:

```json
{
  "metadata": {
    "id_produtor": "",  // Gerar se não existir
    "data_extracao": "",  // Data atual
    "tipo_documento": []  // Array com anexos detectados
  },
  "dados_gerais": {
    "identificacao": {
      "nome_completo": "",  // OBRIGATÓRIO
      "cpf_cnpj": ""  // OBRIGATÓRIO
    },
    "contato": {
      "telefone": "",  // OBRIGATÓRIO
      "endereco": {
        "municipio": "",  // OBRIGATÓRIO
        "uf": ""  // OBRIGATÓRIO
      }
    }
  }
}
```

### 10.2 Consistência de Dados

**Email**: Validar formato básico `usuario@dominio.com`

**Telefone**: Apenas dígitos, 10 ou 11 caracteres (com DDD)

**CEP**: Formato `12345-678` (8 dígitos)

**UF**: 2 letras maiúsculas (SP, MG, RJ, etc.)

**Coordenadas**:
- Latitude Brasil: -33 a +5
- Longitude Brasil: -74 a -34

### 10.3 Tipos de Dados

**Validar tipos**:
```json
✅ CORRETO:
"area_ha": 5.5,  // number
"possui_car": false,  // boolean
"produtos": [],  // array
"telefone": "11987654321"  // string

❌ INCORRETO:
"area_ha": "5.5",  // string em vez de number
"possui_car": "false",  // string em vez de boolean
"telefone": 11987654321  // number em vez de string
```

---

## 11. Observações Gerais

### 11.1 Prioridade de Dados

**Quando houver conflito**:
1. Dados específicos > Dados gerais
2. Dados mais recentes > Dados antigos
3. Dados do anexo > Dados do cadastro geral

**Documentar decisão** em `metadata.observacoes` se necessário

### 11.2 Dados Ambíguos

**Se informação no PDF é ambígua**:
1. Extrair literal como está
2. Adicionar observação em campo `observacoes` relevante
3. Não inventar ou inferir dados

### 11.3 Múltiplas Páginas

**Se mesmo campo aparece em múltiplas páginas**:
- Usar informação mais completa
- Se ambas completas e diferentes: usar a mais recente
- Registrar em observações se relevante

---

## Referências

- **Schemas JSON**: `/database/schemas/*.schema.json`
- **Prompt Master**: `pdf-master-extraction.md`
- **Validação**: `pdf-extraction-validacao.md`
