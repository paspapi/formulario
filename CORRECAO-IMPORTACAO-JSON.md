# Correção de Importação JSON no Upload de PMO

**Data:** 2025-10-06
**Arquivo:** `pmo/cadastro-geral-pmo/cadastro-geral-pmo.js`

## 🐛 Problema Identificado

A importação de JSON no upload de PMO para atualização não estava lendo todos os dados para o formulário. Alguns campos não eram mapeados corretamente, faltavam logs para debug e a sincronização com o scope manager não estava completa.

## ✅ Correções Implementadas

### 1. Função `loadSavedData()` (linha 1043)

**Melhorias:**
- ✅ Adicionados logs detalhados para debug da estrutura recebida
- ✅ Verificação de todos os campos aninhados (identificacao, contato, propriedade, tipo_pessoa, etc)
- ✅ Logs específicos para activities e escopos
- ✅ Detecção melhorada de 4 formatos diferentes de dados

**Exemplo de log:**
```javascript
console.log('🔍 Estrutura dos dados carregados:', {
    tipo: typeof data,
    keys: Object.keys(data).slice(0, 10),
    tem_metadata: 'metadata' in data,
    tem_dados: 'dados' in data,
    tem_activities: data.dados && 'activities' in data.dados,
    tem_escopo: data.dados && 'escopo' in data.dados,
    tem_identificacao: data.dados && 'identificacao' in data.dados,
    tem_contato: data.dados && 'contato' in data.dados,
    tem_propriedade: data.dados && 'propriedade' in data.dados,
    tem_tipo_pessoa: data.dados && 'tipo_pessoa' in data.dados,
    primeiros_campos: Object.keys(data).slice(0, 5)
});
```

### 2. Função `preencherFormularioComJSON()` (linha 1299)

**Melhorias:**
- ✅ Logs de início de importação com estrutura completa
- ✅ Logs para cada seção sendo preenchida (identificacao, contato, propriedade, manejo_organico, etc)
- ✅ Tratamento de campos diretos no objeto dados (tipo_pessoa, pretende_certificar, tipo_certificacao, opac_nome)
- ✅ Mapeamento completo de manejo_organico (adicionados 4 campos que faltavam):
  - `historico_propriedade`
  - `topografia_utilizacao` (alias: `topografia_e_utilizacao`)
  - `status_manejo_organico`
  - `relato_historico_recente`

- ✅ Melhoria no preenchimento de propriedade:
  - `roteiro_acesso` (de propriedade ou contato)
  - `data_aquisicao` (alias: `data_aquisicao_posse`)

- ✅ Tratamento melhorado de tabela de responsáveis:
  - Telefone/email da primeira linha vem de `dados.contato`
  - Telefone/email das outras linhas vem dos próprios responsáveis

- ✅ Contador de campos preenchidos com percentual:
```javascript
console.log(`📊 Campos preenchidos: ${countPreenchidos}/${countTotal} (${Math.round(countPreenchidos/countTotal*100)}%)`);
```

- ✅ Sincronização completa após importação (timeout de 500ms):
  - `toggleTipoDocumento()`
  - `togglePessoaTipo()`
  - `toggleTipoCertificacao()`
  - Disparo de eventos `change` em 6 campos importantes:
    - `tipo_documento`
    - `tipo_pessoa`
    - `tipo_certificacao`
    - `possui_subsistencia`
    - `possui_producao_paralela`
    - `vende_nao_organicos`
  - `syncActivitiesWithScopeManager()`
  - `calculateProgress()`
  - Marcação de `isModified = true`

### 3. Função `preencherCampo()` (linha 1829)

**Melhorias:**
- ✅ Validação melhorada de valores (aceita `0` e `false` como valores válidos)
- ✅ Tratamento explícito de `TEXTAREA`
- ✅ Melhor conversão de valores booleanos para checkboxes (`true`, `'sim'`, `'true'`)
- ✅ Melhor conversão de strings para radio buttons (comparação com `String()`)
- ✅ Try-catch para cada elemento preenchido
- ✅ Logs apenas para campos que foram realmente preenchidos
- ✅ Warning detalhado para campos não encontrados no formulário:
```javascript
console.warn(`⚠️ Campo não encontrado no formulário: ${name} (valor: ${value})`);
```

### 4. Mapeamento de Activities Corrigido

**Problema anterior:**
O JSON usava nomes agrupados (`escopo_vegetal`, `escopo_animal`, `escopo_processamento_minimo`) que não correspondiam aos checkboxes individuais no HTML.

**Solução:**
Criado mapeamento detalhado:

```javascript
const activityMapping = {
    // Agrupamentos para compatibilidade
    'escopo_vegetal': ['escopo_hortalicas', 'escopo_frutas', 'escopo_medicinais'],
    'escopo_animal': ['escopo_pecuaria'],
    'escopo_processamento_minimo': ['escopo_proc_minimo'],
    'escopo_cogumelo': ['escopo_cogumelos'], // alias
    'escopo_graos': ['escopo_hortalicas'] // fallback
};
```

**Checkboxes no HTML:**
- `escopo_hortalicas`
- `escopo_frutas`
- `escopo_cogumelos`
- `escopo_medicinais`
- `escopo_pecuaria`
- `escopo_apicultura`
- `escopo_proc_minimo`
- `escopo_processamento`

### 5. Campos Removidos (não existem no formulário)

**Removidos para evitar warnings:**
- ❌ `telefone` (direto) - preenchido na tabela de responsáveis
- ❌ `email` (direto) - preenchido na tabela de responsáveis
- ❌ `ano_vigente` - faz parte do metadata do PMO, não do formulário

## 📊 Resultado Esperado

Ao fazer upload de JSON no painel PMO:

1. ✅ **Todos os campos** devem ser preenchidos corretamente
2. ✅ **Logs detalhados** no console para debug
3. ✅ **Tabelas dinâmicas** populadas corretamente (responsáveis, fontes de água, etc)
4. ✅ **Campos condicionais** exibidos/ocultados corretamente
5. ✅ **Activities sincronizadas** com scope manager
6. ✅ **Progresso calculado** automaticamente
7. ✅ **Formulário marcado** como modificado para auto-save

## 🧪 Como Testar

1. Acessar o **Painel PMO** (`pmo/painel/index.html`)
2. Fazer **upload de um arquivo JSON** (`pmoteste.json` ou similar)
3. Clicar em **"Editar"** no PMO importado
4. **Verificar no console** do navegador os logs de importação:
   ```
   📥 Iniciando importação de JSON
   📊 Estrutura do JSON
   📝 Preenchendo identificação
   📝 Preenchendo contato
   📝 Preenchendo propriedade
   📝 Preenchendo manejo orgânico
   📝 Preenchendo activities
   📊 Campos preenchidos: X/Y (Z%)
   🔄 Iniciando atualização de campos condicionais
   ✅ Formulário completamente preenchido e atualizado!
   ```
5. **Confirmar** que:
   - Todos os campos foram preenchidos
   - Tabelas dinâmicas foram populadas
   - Checkboxes de activities foram marcados
   - Progresso foi calculado
   - Campos condicionais estão visíveis/ocultos corretamente

## 🔧 Estrutura de JSON Esperada

```json
{
  "metadata": {
    "versao_schema": "2.0.0",
    "tipo_formulario": "pmo_completo",
    "id_produtor": "123.456.789-00",
    "grupo_spg": "Grupo Exemplo",
    "nome_produtor": "Nome do Produtor",
    "nome_unidade": "Nome da Unidade",
    "ano_vigente": 2025
  },
  "dados": {
    "tipo_pessoa": "fisica",
    "identificacao": {
      "nome_completo": "...",
      "cpf_cnpj": "...",
      "inscricao_estadual": "...",
      "nome_unidade_producao": "...",
      "fornecedores_responsaveis": [...]
    },
    "contato": {
      "telefone": "...",
      "email": "...",
      "endereco": {
        "endereco_completo": "...",
        "bairro": "...",
        "municipio": "...",
        "uf": "...",
        "cep": "...",
        "coordenadas": {
          "latitude": -22.123,
          "longitude": -45.456
        }
      }
    },
    "propriedade": {
      "posse_terra": "...",
      "area_total_ha": 10.5,
      "roteiro_acesso": "...",
      "data_aquisicao": "2020-01-01"
    },
    "manejo_organico": {
      "anos_manejo_organico": 5,
      "situacao_manejo": "...",
      "historico_propriedade": "...",
      "topografia_utilizacao": "..."
    },
    "activities": {
      "escopo_hortalicas": true,
      "escopo_frutas": true,
      "escopo_cogumelos": false,
      "escopo_pecuaria": false,
      "escopo_apicultura": false,
      "escopo_processamento": false,
      "escopo_proc_minimo": false
    }
  }
}
```

## 📝 Próximos Passos

- [ ] Testar com JSONs de diferentes estruturas (schema v1.0, v2.0)
- [ ] Verificar se outros formulários (anexos) precisam das mesmas correções
- [ ] Considerar adicionar validação de schema JSON antes da importação
- [ ] Adicionar feedback visual durante importação (progress bar)
- [ ] Criar testes automatizados para importação

## 🔗 Referências

- **Arquivo modificado:** [cadastro-geral-pmo.js](pmo/cadastro-geral-pmo/cadastro-geral-pmo.js)
- **Painel PMO:** [painel.js](pmo/painel/painel.js)
- **Storage Manager:** [pmo-storage-manager.js](framework/components/pmo-storage-manager.js)
- **Schema v2.0:** [schema-pmo-geral.json](database/jsonSchemas/schema-pmo-geral.json)

## 🔧 ATUALIZAÇÃO - Correções Adicionais (Commit 8f28f2e)

**Data:** 2025-10-06 22:10

### Problemas Corrigidos:

1. **ReferenceError: PMOPrincipal is not defined** (linhas 695, 722, 748)
   - ❌ Erro: Chamava PMOPrincipal.calculateProgress() em 3 funções de tabela
   - ✅ Correção: Mudado para CadastroGeralPMO.calculateProgress()
   - 📍 Afetava: addRow(), removeRow(), duplicateRow()
   - 🎯 Resultado: Tabelas dinâmicas agora funcionam sem erros

2. **Campos inexistentes gerando warnings** (linhas 1447-1450)
   - ❌ Erro: Tentava preencher campos que não existem no formulário:
     * historico_propriedade
     * topografia_utilizacao
     * status_manejo_organico
     * relato_historico_recente
   - ✅ Correção: Campos comentados
   - 📝 Motivo: Esses campos estão em anexos específicos, não no cadastro geral
   - 🎯 Resultado: Sem warnings no console

3. **Código duplicado** (linha 1617-1623)
   - ❌ Problema: Seção duplicada de preenchimento de manejo_organico
   - ✅ Correção: Removida duplicação, mantida apenas comprovação e histórico

