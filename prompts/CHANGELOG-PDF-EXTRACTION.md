# Changelog - Prompt de Extração PDF

## v2.0.0 - Janeiro 2025 ✅ ATUAL

### 🎯 Objetivo
Unificar completamente para schema v2.0.0, eliminando inconsistências e duplicações.

### ✅ Mudanças Principais

#### 1. **Estrutura Unificada `metadata` + `dados`**
- **ANTES (v1.0):** Schemas tinham estrutura flat com campos no root
- **AGORA (v2.0):** TODOS usam `metadata` + `dados` wrapper

```json
// ❌ ANTES (v1.0 - OBSOLETO)
{
  "metadata": {
    "tipo_documento": "PROCESSAMENTO",
    "data_extracao": "..."
  },
  "identificacao": {...},  // ← campos direto no root
  "produtos": [...]
}

// ✅ AGORA (v2.0.0)
{
  "metadata": {
    "tipo_formulario": "anexo_processamento",
    "data_criacao": "..."
  },
  "dados": {  // ← TODOS os campos dentro de "dados"
    "identificacao": {...},
    "produtos_processados": [...]
  }
}
```

---

#### 2. **Nomenclatura Padronizada**

**Campos CPF/CNPJ:**
| Antes (v1.0) | Agora (v2.0.0) | Local |
|---|---|---|
| `cnpj_empresa` | `cpf_cnpj` | Cadastro geral |
| `cnpj_produtor_rural` | `cpf_cnpj` | Anexo processamento |
| `cnpj` (separado) | `cpf_cnpj` | Todos |

**Outros campos:**
| Antes | Agora | Motivo |
|---|---|---|
| `produtos` | `produtos_processados` | Clareza |
| `tipo_documento` | `tipo_formulario` | Consistência |
| `data_extracao` | `data_criacao` | Padrão unificado |
| `status_processamento` | `status` | Simplificação |

---

#### 3. **Sistema de Escopos Simplificado**

**REMOVIDO:**
- Campo `dados.escopo` (objeto duplicado)

**MANTIDO:**
- APENAS `dados.activities` com nomenclatura `escopo_*`

```json
// ❌ ANTES (CONFUSO - tinha 2 objetos!)
{
  "dados": {
    "escopo": {
      "processamento": true  // ← objeto 1
    },
    "activities": {
      "escopo_processamento": true  // ← objeto 2 duplicado
    }
  }
}

// ✅ AGORA (LIMPO - 1 único objeto)
{
  "dados": {
    "activities": {
      "escopo_processamento": true,
      "escopo_hortalicas": false,
      "escopo_cogumelos": false
    }
  }
}
```

**Lógica:**
```javascript
// Se PDF menciona processamento
dados.activities.escopo_processamento = true;

// Definir pretende_certificar
dados.pretende_certificar = (algum activities.escopo_* === true);

// Incluir anexo correspondente
if (dados.activities.escopo_processamento === true) {
  escopos.anexo_processamento = {...};
}
```

---

#### 4. **Campos Completos nos Anexos**

**Anexo Processamento - Campos ADICIONADOS:**
- `dados.croqui_planta` - Layout das instalações
- `dados.etapas_fora_unidade` - Etapas terceirizadas
- `dados.rastreabilidade` - Sistema de rastreamento
- `dados.controle_pragas_higiene` - Controle de pragas
- `dados.agua_utilizada` - Análise de água
- `dados.infraestrutura` - Descrição das instalações
- `dados.boas_praticas_fabricacao` - BPF
- `dados.capacitacao_equipe` - Treinamentos
- `dados.declaracoes_responsavel` - Declarações obrigatórias
- `dados.assinatura` - Assinatura digital

**Anexo Cogumelos - Campos ADICIONADOS:**
- `dados.ambiente_cultivo` - Controle ambiental
- `dados.colheita_pos_colheita` - Processos pós-colheita
- `dados.rastreabilidade_registros` - Registros mantidos
- `dados.higienizacao_sanitizacao` - Produtos de limpeza

---

#### 5. **Exemplo Real Atualizado**

**ANTES:** Exemplo inventado sem base em dados reais

**AGORA:** Baseado em `pmoteste.json` (caso real testado)
- Produtor: MAURO AUGUSTO FERNANDES
- Unidade: SÍTIO MANTÍ
- Escopos: Hortaliças, Frutas, Grãos, Medicinais, Cogumelos
- Estrutura validada e funcional

---

#### 6. **Tabela de Referência Rápida**

**ADICIONADO:** Tabela de campos principais por anexo
- Anexo Processamento Industrial
- Anexo Vegetal
- Anexo Cogumelos
- Anexo Animal
- Anexo Apicultura

Facilita identificação rápida dos campos sem precisar ler schema completo.

---

#### 7. **Documentação Melhorada**

**Mapeamento PDF → JSON:**
- Tabela clara de conversão de campos
- Exemplos de como mapear "CNPJ:" → `cpf_cnpj`

**Validação:**
- Checklist atualizado
- Remoção de validações duplicadas
- Foco em v2.0.0 apenas

**Exemplos de código:**
- Pseudocódigo JavaScript para lógica de escopos
- Exemplos de arrays e objetos

---

### 🔄 Migração de v1.0 para v2.0.0

**Se você tem JSONs v1.0 (estrutura flat), precisa migrar:**

```javascript
// Script de migração (conceitual)
function migrarV1ParaV2(jsonV1) {
  return {
    metadata: {
      versao_schema: "2.0.0",
      tipo_formulario: jsonV1.metadata.tipo_documento.toLowerCase(),
      data_criacao: jsonV1.metadata.data_extracao,
      status: jsonV1.metadata.status_processamento
    },
    dados: {
      // Mover TODOS os campos (exceto metadata) para dentro de "dados"
      identificacao: jsonV1.identificacao,
      produtos_processados: jsonV1.produtos,  // Renomear
      // ... etc
    }
  };
}
```

---

### ⚠️ Breaking Changes

**Não são mais suportados:**
1. ❌ Estrutura flat (campos no root)
2. ❌ Campo `dados.escopo` separado de `activities`
3. ❌ Campos `cnpj_empresa`, `cnpj_produtor_rural` (usar `cpf_cnpj`)
4. ❌ Campo `produtos` (usar `produtos_processados`)
5. ❌ Metadata v1.0 (`tipo_documento`, `data_extracao`, `status_processamento`)

**Devem ser migrados para:**
1. ✅ Estrutura `metadata` + `dados`
2. ✅ Apenas `activities` com `escopo_*`
3. ✅ Campo unificado `cpf_cnpj`
4. ✅ Campo `produtos_processados`
5. ✅ Metadata v2.0 (`tipo_formulario`, `data_criacao`, `status`)

---

### 📊 Comparação Completa

| Aspecto | v1.0 (OBSOLETO) | v2.0.0 (ATUAL) |
|---|---|---|
| **Estrutura** | Flat (root level) | `metadata` + `dados` |
| **CPF/CNPJ** | Vários nomes diferentes | Sempre `cpf_cnpj` |
| **Escopos** | 2 objetos (`escopo` + `activities`) | 1 objeto (`activities`) |
| **Produtos** | `produtos` | `produtos_processados` |
| **Campos anexos** | Básicos | Completos (BPF, rastreabilidade) |
| **Exemplo** | Inventado | Real (pmoteste.json) |
| **Tabelas** | Não tinha | Referência rápida |
| **Validação** | Genérica | Específica por versão |

---

### 🎯 Benefícios v2.0.0

1. **Consistência Total:** Todos os schemas seguem mesmo padrão
2. **Menos Confusão:** Um único objeto de escopos
3. **Nomenclatura Clara:** Campos autoexplicativos
4. **Campos Completos:** Todos os campos obrigatórios presentes
5. **Exemplo Real:** Testado e funcional
6. **Fácil Validação:** Schema único bem definido

---

### 📝 Checklist de Atualização

Se você está atualizando de v1.0 para v2.0.0:

- [ ] Atualizar estrutura para `metadata` + `dados`
- [ ] Renomear `tipo_documento` → `tipo_formulario`
- [ ] Renomear `data_extracao` → `data_criacao`
- [ ] Renomear `status_processamento` → `status`
- [ ] Unificar todos campos CNP J/CPF para `cpf_cnpj`
- [ ] Renomear `produtos` → `produtos_processados`
- [ ] Remover objeto `dados.escopo`
- [ ] Manter apenas `dados.activities`
- [ ] Adicionar campos faltantes (BPF, rastreabilidade, etc)
- [ ] Testar importação no sistema
- [ ] Validar contra schemas v2.0.0

---

**Versão Atual:** 2.0.0
**Data:** Janeiro 2025
**Status:** ✅ Estável e Recomendado
