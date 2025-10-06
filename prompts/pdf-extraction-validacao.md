# Checklist de Validação - Extração de PDFs PMO/ANC

Este documento contém checklist de validação para garantir qualidade e consistência dos dados extraídos de formulários PMO (Plano de Manejo Orgânico) e cadastros ANC.

**Quando usar**: Após agregação final do JSON, antes de retornar resultado.

---

## 1. Validação Geral de Estrutura

### 1.1 JSON Válido

- [ ] JSON está sintaticamente correto (sem erros de parsing)
- [ ] Todas as chaves estão entre aspas duplas
- [ ] Não há vírgulas finais em arrays ou objetos
- [ ] Colchetes `[]` e chaves `{}` estão balanceados
- [ ] Não há comentários no JSON (remover se existir)

### 1.2 Encoding e Caracteres

- [ ] Encoding UTF-8 correto
- [ ] Caracteres especiais preservados (ç, ã, õ, á, é, etc.)
- [ ] Aspas duplas escapadas corretamente dentro de strings
- [ ] Quebras de linha dentro de strings usando `\n`

---

## 2. Validação de Campos Obrigatórios

### 2.1 Metadata (Sempre Obrigatório)

```json
"metadata": {
  "id_produtor": "...",  // ✅ Não pode estar vazio
  "tipo_documento": [...],  // ✅ Array com pelo menos 1 item
  "data_extracao": "YYYY-MM-DD",  // ✅ Data válida ISO 8601
  "versao_schema": "1.0",  // ✅ Preenchido
  "status_processamento": "EXTRAIDO"  // ✅ Preenchido
}
```

**Checklist**:
- [ ] `id_produtor` não vazio
- [ ] `tipo_documento` é array com pelo menos 1 elemento
- [ ] `data_extracao` no formato ISO 8601 (YYYY-MM-DD)
- [ ] `versao_schema` = "1.0"
- [ ] `status_processamento` = "EXTRAIDO"

### 2.2 Certificação

```json
"certificacao": {
  "tipo_certificacao": "SPG/OPAC",  // ✅ Obrigatório
  "opac_nome": "ANC",  // ✅ Obrigatório
  "grupo_spg": "..."  // ✅ Obrigatório
}
```

**Checklist**:
- [ ] `tipo_certificacao` preenchido
- [ ] `opac_nome` = "ANC"
- [ ] `grupo_spg` não vazio

### 2.3 Dados Gerais - Identificação

```json
"dados_gerais": {
  "identificacao": {
    "nome_completo": "...",  // ✅ Obrigatório
    "cpf_cnpj": "..."  // ✅ Obrigatório e válido
  }
}
```

**Checklist**:
- [ ] `nome_completo` não vazio
- [ ] `cpf_cnpj` não vazio
- [ ] `cpf_cnpj` formato válido (CPF: 123.456.789-01 ou CNPJ: 12.345.678/0001-90)
- [ ] `cpf_cnpj` passa validação de dígitos verificadores (se possível)

### 2.4 Dados Gerais - Contato

```json
"contato": {
  "telefone": "...",  // ✅ Obrigatório
  "endereco": {
    "municipio": "...",  // ✅ Obrigatório
    "uf": "..."  // ✅ Obrigatório
  }
}
```

**Checklist**:
- [ ] `telefone` não vazio e apenas dígitos
- [ ] `telefone` tem 10 ou 11 dígitos
- [ ] `endereco.municipio` não vazio
- [ ] `endereco.uf` não vazio e formato válido (2 letras)

---

## 3. Validação de Tipos de Dados

### 3.1 Strings

**Regra**: Campos de texto sempre string, nunca `null`

**Checklist**:
- [ ] Todos os campos string são `""` (vazio) ou com conteúdo
- [ ] Nenhum campo string é `null`
- [ ] Strings não têm espaços em branco extras no início/fim

**Exemplos**:
```json
✅ "nome": ""
✅ "nome": "João Silva"
❌ "nome": null
❌ "nome": "  João Silva  "  // espaços extras
```

### 3.2 Numbers

**Regra**: Campos numéricos sempre number, nunca string

**Checklist**:
- [ ] `area_ha`, `area_total_ha` são números, não strings
- [ ] `latitude`, `longitude` são números decimais
- [ ] `quantidade`, `numero_animais` são números inteiros
- [ ] Valores monetários são números decimais
- [ ] Números não estão entre aspas

**Exemplos**:
```json
✅ "area_ha": 5.5
✅ "latitude": -23.5475
✅ "quantidade": 10
❌ "area_ha": "5.5"
❌ "latitude": "-23.5475"
```

### 3.3 Booleans

**Regra**: Campos booleanos sempre `true` ou `false`, nunca string

**Checklist**:
- [ ] Todos os campos booleanos são `true` ou `false`
- [ ] Nenhum campo booleano é `"true"`, `"false"`, `"sim"`, `"não"`
- [ ] Valores padrão são `false` quando não encontrado

**Exemplos**:
```json
✅ "possui_car": false
✅ "possui_car": true
❌ "possui_car": "false"
❌ "possui_car": "sim"
❌ "possui_car": null
```

### 3.4 Arrays

**Regra**: Arrays vazios são `[]`, nunca `null`

**Checklist**:
- [ ] Arrays vazios são `[]`, não `null`
- [ ] Arrays não contêm objetos vazios `[{}]`
- [ ] Arrays de strings não contêm strings vazias desnecessárias

**Exemplos**:
```json
✅ "produtos": []
✅ "produtos": [{"produto": "Alface"}]
❌ "produtos": null
❌ "produtos": [{}]
❌ "produtos": [""]
```

### 3.5 Objects

**Regra**: Objetos vazios são `{}`, nunca `null`

**Checklist**:
- [ ] Objetos vazios são `{}`, não `null`
- [ ] Objetos aninhados seguem mesma regra

**Exemplos**:
```json
✅ "endereco": {}
✅ "endereco": {"logradouro": "Rua X"}
❌ "endereco": null
```

---

## 4. Validação de Formatação

### 4.1 CPF/CNPJ

**Checklist**:
- [ ] CPF no formato `123.456.789-01` (14 caracteres)
- [ ] CNPJ no formato `12.345.678/0001-90` (18 caracteres)
- [ ] Campo sempre `cpf_cnpj`, nunca `cpf` ou `cnpj` separados
- [ ] Dígitos verificadores corretos (se possível validar)

### 4.2 Datas

**Checklist**:
- [ ] Todas as datas no formato ISO 8601: `YYYY-MM-DD`
- [ ] Datas são strings, não números
- [ ] Datas fazem sentido lógico (não futuras, não antes de 1900)
- [ ] Campos vazios são `""`, não `null`

**Exemplos**:
```json
✅ "data_preenchimento": "2024-03-15"
✅ "data_nascimento": "1985-07-20"
✅ "data_preenchimento": ""
❌ "data_preenchimento": "15/03/2024"
❌ "data_nascimento": null
❌ "data_preenchimento": 2024
```

### 4.3 Coordenadas

**Checklist**:
- [ ] Latitude e longitude são números decimais
- [ ] Latitude entre -33 e +5 (Brasil)
- [ ] Longitude entre -74 e -34 (Brasil)
- [ ] 4 a 6 casas decimais de precisão
- [ ] Se não disponível: `0` (não `null`)

**Exemplos**:
```json
✅ "coordenadas": {"latitude": -23.5475, "longitude": -46.6361}
✅ "coordenadas": {"latitude": 0, "longitude": 0}
❌ "coordenadas": {"latitude": "23°32'S", "longitude": "46°38'W"}
❌ "coordenadas": null
```

### 4.4 Telefone

**Checklist**:
- [ ] Apenas dígitos (sem parênteses, espaços, hífens)
- [ ] 10 ou 11 dígitos (com DDD)
- [ ] String, não número

**Exemplos**:
```json
✅ "telefone": "11987654321"
✅ "telefone": "1134567890"
❌ "telefone": "(11) 98765-4321"
❌ "telefone": 11987654321
```

### 4.5 CEP

**Checklist**:
- [ ] Formato `12345-678` (com hífen)
- [ ] 9 caracteres (8 dígitos + 1 hífen)

**Exemplos**:
```json
✅ "cep": "12345-678"
❌ "cep": "12345678"
```

### 4.6 Email

**Checklist**:
- [ ] Minúsculas
- [ ] Formato básico válido: `usuario@dominio.ext`
- [ ] Se vazio: `""`, não `null`

**Exemplos**:
```json
✅ "email": "produtor@exemplo.com.br"
✅ "email": ""
❌ "email": "PRODUTOR@EXEMPLO.COM"
❌ "email": "produtor"
❌ "email": null
```

---

## 5. Validação por Anexo

### 5.1 Cadastro Geral

**Campos mínimos obrigatórios**:
- [ ] `atividades_organicas.tipos_producao` tem pelo menos 1 item
- [ ] Se `produtos_certificar` preenchido, tem pelo menos 1 produto
- [ ] `dados_gerais.propriedade.area_total_ha` > 0

**Consistência**:
- [ ] Se `possui_producao_paralela = true`, `producao_paralela.detalhes` preenchido
- [ ] Se `possui_producao_subsistencia = true`, `producao_subsistencia.detalhes` preenchido

### 5.2 Anexo Vegetal

**Placeholder**: Validações específicas serão adicionadas após criação do prompt específico

**Campos esperados**:
- [ ] `preparo_solo` tem pelo menos 1 método = true
- [ ] `praticas_conservacionistas` tem pelo menos 1 prática utilizada
- [ ] `equipamentos` objeto não está vazio

### 5.3 Anexo Cogumelo

**Placeholder**: Validações específicas serão adicionadas após criação do prompt específico

**Campos esperados**:
- [ ] `tipos_cogumelos` array tem pelo menos 1 item
- [ ] `substrato.materiais_formulacao` preenchido se `utiliza_substrato = true`
- [ ] `inoculo.origem_inoculos` não vazio

### 5.4 Anexo Animal

**Placeholder**: Validações específicas serão adicionadas após criação do prompt específico

**Campos esperados**:
- [ ] `especies_criadas` array tem pelo menos 1 item
- [ ] `alimentacao.plano_alimentar` array tem pelo menos 1 item
- [ ] `instalacoes` array tem pelo menos 1 item

### 5.5 Anexo Apicultura

**Placeholder**: Validações específicas serão adicionadas após criação do prompt específico

**Campos esperados**:
- [ ] `geral.tipo_abelha` não vazio
- [ ] `floradas` array tem pelo menos 1 item
- [ ] `distancias_areas_risco` preenchido

### 5.6 Processamento Industrial

**Placeholder**: Validações específicas serão adicionadas após criação do prompt específico

**Campos esperados**:
- [ ] `geral.razao_social` não vazio
- [ ] `geral.cnpj_empresa` válido
- [ ] `produtos` array tem pelo menos 1 item
- [ ] `etapas_processamento` tem pelo menos 1 etapa descrita

### 5.7 Processamento Mínimo

**Placeholder**: Validações específicas serão adicionadas após criação do prompt específico

**Campos esperados**:
- [ ] `geral.razao_social` ou `cpf_cnpj` preenchido
- [ ] `produtos` array tem pelo menos 1 item
- [ ] `controles` array preenchido

---

## 6. Validação de Lógica de Negócio

### 6.1 Escopo de Certificação

**SE** `certificacao.escopo = "Produção"`:
- [ ] Pelo menos 1 anexo de produção preenchido (vegetal, cogumelo, animal ou apicultura)
- [ ] `processamento_minimo = {}`
- [ ] `processamento_industrial = {}`

**SE** `certificacao.escopo = "Processamento"`:
- [ ] `processamento_minimo` OU `processamento_industrial` preenchido
- [ ] `anexo_vegetal = {}`
- [ ] `anexo_cogumelos = {}`
- [ ] `anexo_animal = {}`
- [ ] `anexo_apicultura = {}`

**SE** `certificacao.escopo = "Produção + Processamento"`:
- [ ] Pelo menos 1 anexo de produção preenchido
- [ ] Pelo menos 1 anexo de processamento preenchido

### 6.2 Campos Condicionais

**Produção Paralela**:
- [ ] Se `producao_paralela.possui = true`, então `producao_paralela.detalhes` não vazio
- [ ] Se `producao_paralela.possui = false`, então `producao_paralela.detalhes = {}`

**Produção Subsistência**:
- [ ] Se `producao_subsistencia.possui = true`, então `producao_subsistencia.detalhes` não vazio
- [ ] Se `producao_subsistencia.possui = false`, então `producao_subsistencia.detalhes = {}`

**Utiliza Substrato**:
- [ ] Se `adubacao_nutricao.utiliza_substrato = true`, então `substrato_receitas` array preenchido
- [ ] Se `adubacao_nutricao.utiliza_substrato = false`, então `substrato_receitas = []`

**Inspeção Sanitária**:
- [ ] Se `possui_inspecao_sanitaria = true`, então `detalhes_inspecao` não vazio
- [ ] Se `possui_inspecao_sanitaria = false`, então `detalhes_inspecao = ""`

### 6.3 Consistência entre Campos

**Tipo de Pessoa**:
- [ ] Se CPF (11 dígitos), então campo derivado `tipo_pessoa = "FISICA"` (se existir)
- [ ] Se CNPJ (14 dígitos), então campo derivado `tipo_pessoa = "JURIDICA"` (se existir)

**Área Total vs Áreas Parciais**:
- [ ] Soma de áreas de atividades ≤ `area_total_ha` (com margem de 10%)

**Coordenadas**:
- [ ] Se latitude ≠ 0 e longitude ≠ 0, ambos devem estar dentro do Brasil

---

## 7. Validação de Nomenclatura

### 7.1 Campos Padronizados

**Verificar que os seguintes campos usam EXATAMENTE estes nomes**:

- [ ] `cpf_cnpj` (não `cpf`, `cnpj`, `cpf_produtor`)
- [ ] `nome_completo` (não `nome`, `nome_produtor`)
- [ ] `grupo_spg` (não `grupo`, `spg`)
- [ ] `data_preenchimento` (não `data`, `data_elaboracao`)
- [ ] `area_total_ha` (não `area_total`, `area`)
- [ ] `inscricao_estadual` (não `ie`, `insc_est`)
- [ ] `inscricao_municipal` (não `im`, `insc_mun`)

### 7.2 Convenções

- [ ] Todos os nomes de campos em `snake_case` (não `camelCase`)
- [ ] Arrays sempre no plural (`produtos`, não `produto`)
- [ ] Booleanos com prefixos claros (`possui_`, `tem_`, `utiliza_`)

---

## 8. Validação de Completude

### 8.1 Seções Obrigatórias Preenchidas

**Mínimo esperado em PMO completo**:
- [ ] `metadata` completo
- [ ] `certificacao` completo
- [ ] `dados_gerais` completo
- [ ] `atividades_organicas` completo
- [ ] Pelo menos 1 anexo preenchido conforme escopo

### 8.2 Arrays com Conteúdo Relevante

**Arrays que não devem estar vazios** (se aplicável ao escopo):
- [ ] `produtos_certificar` (se escopo produção)
- [ ] `especies_criadas` (se anexo animal)
- [ ] `tipos_cogumelos` (se anexo cogumelo)
- [ ] `floradas` (se anexo apicultura)
- [ ] `produtos_processados` (se escopo processamento)

### 8.3 Percentual de Preenchimento

**Estimativa geral**:
- [ ] Pelo menos 70% dos campos obrigatórios preenchidos
- [ ] Pelo menos 50% dos campos opcionais relevantes preenchidos

---

## 9. Validação Final

### 9.1 Checklist Resumido

**Antes de retornar JSON final**:

- [ ] ✅ JSON sintaticamente válido
- [ ] ✅ Todos os campos obrigatórios preenchidos
- [ ] ✅ Tipos de dados corretos (string, number, boolean, array, object)
- [ ] ✅ Nenhum campo é `null`
- [ ] ✅ Datas no formato ISO 8601
- [ ] ✅ CPF/CNPJ formatados corretamente
- [ ] ✅ Coordenadas dentro do Brasil (se preenchidas)
- [ ] ✅ Escopo de certificação respeitado
- [ ] ✅ Lógica de campos condicionais aplicada
- [ ] ✅ Nomenclatura padronizada
- [ ] ✅ Pelo menos 1 anexo preenchido conforme escopo

### 9.2 Ações Corretivas

**Se validação falhar**:

1. **Identificar campo problemático**
2. **Revisar extração do PDF**
3. **Aplicar regras de `pdf-extraction-rules-common.md`**
4. **Corrigir e re-validar**
5. **Documentar em `metadata.observacoes` se necessário**

### 9.3 Registro de Validação

**Adicionar ao JSON final**:

```json
"metadata": {
  "validacao": {
    "validado_em": "2024-03-15T14:30:00Z",
    "status_validacao": "APROVADO",
    "campos_obrigatorios_completos": true,
    "possui_erros": false,
    "erros": [],
    "avisos": [
      "Campo 'coordenadas' não preenchido - localização não disponível no PDF"
    ],
    "percentual_preenchimento": 85
  }
}
```

---

## 10. Observações Finais

### 10.1 Prioridades de Validação

**Alta prioridade** (bloqueia processamento):
- JSON inválido
- Campos obrigatórios vazios
- Tipos de dados incorretos
- Escopo não respeitado

**Média prioridade** (gera avisos):
- Campos opcionais não preenchidos
- Formatação inconsistente
- Coordenadas fora do Brasil

**Baixa prioridade** (informativo):
- Campos complementares vazios
- Observações faltando

### 10.2 Ferramentas de Validação

**Recomendado validar JSON com**:
- JSON Schema validation
- Regex para CPF/CNPJ, datas, coordenadas
- Verificação de dígitos verificadores

---

## Referências

- **Regras Comuns**: `pdf-extraction-rules-common.md`
- **Prompt Master**: `pdf-master-extraction.md`
- **Schemas JSON**: `/database/schemas/*.schema.json`
