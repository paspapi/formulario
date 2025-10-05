# Teste de Importação JSON - pmoteste.json

## ✅ Correções Implementadas

### 1. Função `preencherFormularioComJSON` Atualizada
**Arquivo:** `pmo/cadastro-geral-pmo/cadastro-geral-pmo.js`
**Linhas:** 1355-1402

**Mudanças:**
- ✅ Adicionado suporte para campo `activities` (formato v2.0.0)
- ✅ Mantido fallback para campo `escopo` (compatibilidade retroativa)
- ✅ Adicionados logs detalhados para debug

### 2. Prioridade de Processamento

```javascript
// PRIORIDADE 1: activities (formato correto)
if (dados.activities) {
    // Processa: escopo_hortalicas, escopo_frutas, etc.
}
// PRIORIDADE 2: escopo (formato legado)
else if (dados.escopo) {
    // Converte: hortalicas → escopo_hortalicas
}
```

---

## 📝 Como Testar

### Passo 1: Preparar Ambiente
1. Abrir navegador em: `pmo/painel/index.html`
2. Abrir DevTools (F12) → aba Console
3. Verificar se PMOStorageManager está carregado

### Passo 2: Importar JSON
1. No painel, clicar em **"Importar JSON/PDF"**
2. Selecionar arquivo: `pmoteste.json`
3. Aguardar processamento

### Passo 3: Verificar Logs no Console

**Logs Esperados:**
```
🔍 Estrutura dos dados carregados: {
  tipo: "object",
  tem_metadata: true,
  tem_dados: true,
  tem_activities: true,     ← DEVE SER TRUE
  tem_escopo: true
}

✅ Campo activities encontrado:
  ["escopo_hortalicas", "escopo_frutas", "escopo_graos", ...]

📥 Formato 1 detectado: Novo (metadata + dados)
📝 Preenchendo activities (formato v2.0):
  ✅ Activity marcada: escopo_hortalicas = true
  ✅ Activity marcada: escopo_frutas = true
  ✅ Activity marcada: escopo_graos = true
  ✅ Activity marcada: escopo_medicinais = true
  ✅ Activity marcada: escopo_cogumelos = true
```

### Passo 4: Verificar Formulário
1. Navegar para: `pmo/cadastro-geral-pmo/index.html`
2. **Verificar Campos Preenchidos:**
   - ✅ Nome: "MAURO AUGUSTO FERNANDES"
   - ✅ CPF: "758.132.038-34"
   - ✅ Unidade: "SÍTIO MANTÍ"
   - ✅ Grupo SPG: "IBIUNA"

3. **Verificar Checkboxes de Escopo:**
   - ✅ Hortaliças (marcado)
   - ✅ Frutas (marcado)
   - ✅ Grãos (marcado)
   - ✅ Medicinais (marcado)
   - ✅ Cogumelos (marcado)
   - ❌ Pecuária (desmarcado)
   - ❌ Apicultura (desmarcado)

---

## 🔍 Diagnóstico de Problemas

### Problema: Checkboxes não marcam
**Causa:** Campo `activities` não está sendo processado

**Solução:**
1. Verificar console para confirmar: `tem_activities: true`
2. Se FALSE, o JSON está no formato legado (usar `escopo`)
3. Verificar se nomes dos checkboxes no HTML são: `escopo_hortalicas`, etc.

### Problema: Campos não preenchem
**Causa:** Mapeamento incorreto de campos

**Verificar logs:**
```
⚠️ Campo não encontrado: [nome_do_campo]
```

**Solução:** Verificar se campo existe no HTML com mesmo `name`

---

## 📊 Compatibilidade de Schemas

### ✅ Compatíveis com pmo-unified.schema.json

| Schema | Versão | Status | Observações |
|--------|--------|--------|-------------|
| pmoteste.json | 2.0.0 | ✅ Compatível | Formato correto |
| anexo-vegetal.schema.json | 2.0 | ✅ Compatível | Estrutura correta |
| anexo-animal.schema.json | 1.0 | ⚠️ Parcial | Muito detalhado |
| anexo-apicultura.schema.json | 1.0 | ⚠️ Parcial | Muito detalhado |
| cadastro-geral-pmo.schema.json | 1.0 | ❌ Incompatível | Estrutura flat antiga |

### ❌ Necessita Atualização

**cadastro-geral-pmo.schema.json:**
- Migrar de estrutura flat para metadata + dados
- Atualizar versão para 2.0.0
- Alinhar campos com pmo-unified.schema.json

---

## ✅ Resultado Esperado

Após a importação do `pmoteste.json`:

1. **Formulário Cadastro Geral:**
   - ✅ Todos os campos básicos preenchidos
   - ✅ Checkboxes de escopo marcados corretamente
   - ✅ Dados de contato e endereço preenchidos

2. **Scope Manager:**
   - ✅ Formulários ativos sincronizados
   - ✅ Anexos habilitados: Vegetal, Cogumelo
   - ✅ Anexos desabilitados: Animal, Apicultura

3. **Console:**
   - ✅ Sem erros
   - ✅ Logs de sucesso
   - ✅ Confirmação de preenchimento

---

## 🐛 Troubleshooting

### Erro: "Checkbox de activity não encontrado"
**Solução:** Verificar nome do checkbox no HTML deve ser exatamente `escopo_hortalicas`, não `hortalicas`

### Erro: "Nenhum campo de escopo ou activities encontrado"
**Solução:** JSON não tem nem `dados.activities` nem `dados.escopo`. Verificar estrutura do JSON.

### Erro: "Formulário não encontrado"
**Solução:** Garantir que está na página correta: `pmo/cadastro-geral-pmo/index.html`

---

## 📌 Próximos Passos

1. ✅ Testar importação do pmoteste.json
2. ⚠️ Atualizar cadastro-geral-pmo.schema.json para v2.0.0
3. 🔄 Criar validação JSON Schema antes de importar
4. 🔄 Adicionar testes automatizados
5. 🔄 Documentar formatos suportados
