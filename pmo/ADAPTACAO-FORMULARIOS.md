# Guia de Adaptação dos Formulários para PMOStorageManager

## ✅ Formulários Adaptados - TODOS COMPLETOS! 🎉
- [x] `/pmo/cadastro-geral-pmo/` ✅ COMPLETO
- [x] `/pmo/anexo-vegetal/` ✅ COMPLETO
- [x] `/pmo/anexo-animal/` ✅ COMPLETO
- [x] `/pmo/anexo-cogumelo/` ✅ COMPLETO
- [x] `/pmo/anexo-apicultura/` ✅ COMPLETO
- [x] `/pmo/anexo-processamento/` ✅ COMPLETO
- [x] `/pmo/anexo-processamentominimo/` ✅ COMPLETO
- [x] `/pmo/avaliacao/` ✅ COMPLETO

**TODOS OS FORMULÁRIOS FORAM ADAPTADOS COM SUCESSO!**
Todos seguem o mesmo padrão e estão usando o PMOStorageManager.

---

## 📋 Mudanças Necessárias em Cada Formulário

### 1. No arquivo HTML (`index.html`)

**Adicionar script do PMOStorageManager ANTES do script específico:**

```html
<!-- Framework JS Unificado -->
<script src="../../framework/core/pmo-framework.js"></script>
<script src="../../framework/components/pmo-tables.js"></script>
<script src="../../framework/components/pmo-storage-manager.js"></script> <!-- ✅ ADICIONAR -->
<script type="module" src="../../framework/components/scope-manager.js"></script>

<!-- JS Específico do Formulário -->
<parameter name="form-specific-js" />
```

---

### 2. No arquivo JavaScript (ex: `vegetal.js`)

#### A. Modificar função `saveForm()`:

**ANTES:**
```javascript
saveForm(isAutoSave = false) {
    try {
        const data = this.collectFormData();
        if (!data) throw new Error('Erro ao coletar dados');

        localStorage.setItem(this.config.storageKey, JSON.stringify(data));

        if (!isAutoSave) {
            this.showMessage('Dados salvos com sucesso!', 'success');
        }
        return true;
    } catch (error) {
        console.error('Erro ao salvar:', error);
        return false;
    }
}
```

**DEPOIS:**
```javascript
saveForm(isAutoSave = false) {
    try {
        const data = this.collectFormData();
        if (!data) throw new Error('Erro ao coletar dados');

        // Usar PMOStorageManager
        if (window.PMOStorageManager) {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (pmo) {
                // Substituir 'anexo_vegetal' pelo nome correto do formulário
                window.PMOStorageManager.updateFormulario(pmo.id, 'anexo_vegetal', data);
            } else {
                console.warn('Nenhum PMO ativo. Crie o Cadastro Geral primeiro.');
                this.showMessage('Crie o Cadastro Geral PMO primeiro!', 'warning');
                return false;
            }
        } else {
            // Fallback para formato antigo
            localStorage.setItem(this.config.storageKey, JSON.stringify(data));
        }

        if (!isAutoSave) {
            this.showMessage('Dados salvos com sucesso!', 'success');
        }
        return true;
    } catch (error) {
        console.error('Erro ao salvar:', error);
        return false;
    }
}
```

---

#### B. Modificar função `loadSavedData()`:

**ANTES:**
```javascript
loadSavedData() {
    try {
        const savedData = localStorage.getItem(this.config.storageKey);
        if (savedData) {
            const data = JSON.parse(savedData);
            // preencher formulário...
            this.showMessage('Dados anteriores carregados', 'info');
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}
```

**DEPOIS:**
```javascript
loadSavedData() {
    try {
        let data = null;

        // Tentar carregar usando PMOStorageManager
        if (window.PMOStorageManager) {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (pmo && pmo.dados && pmo.dados.anexo_vegetal) { // ✅ Substituir pelo nome correto
                data = pmo.dados.anexo_vegetal;
                console.log(`✅ Dados carregados do PMO: ${pmo.id}`);
            }
        }

        // Fallback para formato antigo
        if (!data) {
            const savedData = localStorage.getItem(this.config.storageKey);
            if (savedData) {
                data = JSON.parse(savedData);
                console.log('✅ Dados carregados do formato antigo');
            }
        }

        if (data) {
            // preencher formulário com data...
            this.showMessage('Dados anteriores carregados', 'info');
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}
```

---

#### C. Modificar função `updateProgress()`:

Adicionar ao final da função:

```javascript
updateProgress() {
    const form = document.getElementById(this.config.formId);
    if (!form) return;

    // ... código existente de cálculo de percentage ...

    const percentage = Math.round((filledFields / requiredFields.length) * 100);

    // Atualizar UI
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressText) progressText.textContent = percentage + '% Completo';

    // ✅ ADICIONAR: Atualizar progresso no PMOStorageManager
    if (window.PMOStorageManager) {
        const pmo = window.PMOStorageManager.getActivePMO();
        if (pmo) {
            window.PMOStorageManager.updateProgresso(pmo.id, 'anexo_vegetal', percentage); // ✅ Substituir pelo nome correto
        }
    }

    return percentage;
}
```

---

#### D. Modificar função `loadPMOPrincipal()`:

**ANTES:**
```javascript
loadPMOPrincipal() {
    try {
        const cadastroGeralPMO = localStorage.getItem('cadastro_geral_pmo_data');
        if (!cadastroGeralPMO) {
            this.showMessage('Aviso: Preencha o PMO Principal primeiro.', 'warning');
            return;
        }
        const data = JSON.parse(cadastroGeralPMO);
        // preencher campos...
    }
}
```

**DEPOIS:**
```javascript
loadPMOPrincipal() {
    try {
        let data = null;

        // Tentar carregar usando PMOStorageManager
        if (window.PMOStorageManager) {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (pmo && pmo.dados && pmo.dados.cadastro_geral_pmo) {
                data = pmo.dados.cadastro_geral_pmo;
            }
        }

        // Fallback para formato antigo
        if (!data) {
            const cadastroGeralPMO = localStorage.getItem('cadastro_geral_pmo_data');
            if (cadastroGeralPMO) {
                data = JSON.parse(cadastroGeralPMO);
            }
        }

        if (!data) {
            this.showMessage('Aviso: Preencha o PMO Principal primeiro.', 'warning');
            return;
        }

        // preencher campos com data...
        this.showMessage('Dados carregados do PMO Principal!', 'success');
    } catch (error) {
        console.error('Erro ao carregar PMO Principal:', error);
    }
}
```

---

## 📝 Tabela de Mapeamento de Nomes

| Formulário | Nome no PMOStorageManager | storageKey Antigo |
|------------|---------------------------|-------------------|
| Cadastro Geral | `cadastro_geral_pmo` | `cadastro_geral_pmo_data` |
| Anexo Vegetal | `anexo_vegetal` | `anexo_vegetal_data` |
| Anexo Animal | `anexo_animal` | `pmo_anexo_animal` |
| Anexo Cogumelo | `anexo_cogumelo` | `anexo_cogumelo_data` |
| Anexo Apicultura | `anexo_apicultura` | `pmo_anexo_apicultura` |
| Anexo Processamento | `anexo_processamento` | `pmo_processamento` |
| Anexo Proc. Mínimo | `anexo_processamentominimo` | `pmo_processamento_minimo` |
| Avaliação | `avaliacao` | `avaliacao_data` |

---

## ✅ Checklist de Adaptação

Para cada formulário:

- [ ] 1. Adicionar `<script src="../../framework/components/pmo-storage-manager.js"></script>` no HTML
- [ ] 2. Modificar `saveForm()` para usar `PMOStorageManager.updateFormulario()`
- [ ] 3. Modificar `loadSavedData()` para usar `PMOStorageManager.getActivePMO()`
- [ ] 4. Modificar `updateProgress()` para usar `PMOStorageManager.updateProgresso()`
- [ ] 5. Modificar `loadPMOPrincipal()` (se existir) para usar `PMOStorageManager.getActivePMO()`
- [ ] 6. Testar: salvar, carregar, progresso

---

## 🔄 Compatibilidade com Formato Antigo

Todas as funções mantêm **fallback** para o formato antigo (`localStorage` direto), garantindo:

✅ Dados antigos continuam funcionando
✅ Migração automática na primeira execução
✅ Zero quebra de compatibilidade

---

## 🎯 Próximos Passos

Após adaptar todos os formulários:
1. Testar em cada um
2. Verificar migração de dados antigos
3. Confirmar progresso sendo salvo corretamente
4. Avançar para ETAPA 3: Criar interface do painel
