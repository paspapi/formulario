# 🔗 Guia de Integração com PMO Principal

## 📌 Resumo Rápido

**Regra:** Todos os anexos DEVEM carregar dados do PMO Principal automaticamente.

---

## ✅ Checklist de Implementação

- [ ] Implementar função `loadPMOPrincipal()`
- [ ] Chamar `this.loadPMOPrincipal()` no método `init()`
- [ ] Usar chave correta do localStorage: `'pmo_principal_data'`
- [ ] Preencher no mínimo 4 campos: nome_fornecedor, nome_unidade_producao, data_preenchimento, grupo_spg
- [ ] NÃO sobrescrever campos já preenchidos
- [ ] Adicionar logs no console para debug
- [ ] Exibir mensagem de confirmação ao usuário
- [ ] Tratar erros gracefully

---

## 📝 Código Completo

```javascript
/**
 * Carregar dados do PMO Principal
 * OBRIGATÓRIO para todos os anexos (Vegetal, Animal, Cogumelos, etc.)
 */
loadPMOPrincipal() {
    try {
        // Chave correta do localStorage do PMO Principal
        const pmoPrincipal = localStorage.getItem('pmo_principal_data');
        if (!pmoPrincipal) {
            console.log('Nenhum dado do PMO Principal encontrado.');
            return;
        }

        const data = JSON.parse(pmoPrincipal);
        const form = document.getElementById(this.config.formId);

        if (!form) return;

        // 1. Nome do fornecedor/produtor
        const nomeField = form.querySelector('[name="nome_fornecedor"]');
        if (nomeField && !nomeField.value) {
            nomeField.value = data.nome_completo || data.razao_social || '';
            console.log('Nome do fornecedor preenchido:', nomeField.value);
        }

        // 2. Nome da unidade de produção
        const unidadeField = form.querySelector('[name="nome_unidade_producao"]');
        if (unidadeField && !unidadeField.value) {
            unidadeField.value = data.nome_unidade_producao || '';
            console.log('Nome da unidade preenchido:', unidadeField.value);
        }

        // 3. Data de preenchimento
        const dataField = form.querySelector('[name="data_preenchimento"]');
        if (dataField && !dataField.value) {
            const today = new Date().toISOString().split('T')[0];
            dataField.value = today;
        }

        // 4. Grupo SPG (se disponível)
        const grupoField = form.querySelector('[name="grupo_spg"]');
        if (grupoField && !grupoField.value && data.grupo_spg) {
            grupoField.value = data.grupo_spg;
        }

        // ADICIONAR OUTROS CAMPOS CONFORME NECESSÁRIO
        // Exemplos:
        /*
        // CPF
        const cpfField = form.querySelector('[name="cpf_produtor"]');
        if (cpfField && !cpfField.value && data.cpf) {
            cpfField.value = data.cpf;
        }

        // CNPJ
        const cnpjField = form.querySelector('[name="cnpj"]');
        if (cnpjField && !cnpjField.value && data.cnpj) {
            cnpjField.value = data.cnpj;
        }

        // Endereço
        const enderecoField = form.querySelector('[name="endereco"]');
        if (enderecoField && !enderecoField.value && data.endereco) {
            enderecoField.value = data.endereco;
        }

        // CEP
        const cepField = form.querySelector('[name="cep"]');
        if (cepField && !cepField.value && data.cep) {
            cepField.value = data.cep;
        }

        // Município
        const municipioField = form.querySelector('[name="municipio"]');
        if (municipioField && !municipioField.value && data.municipio) {
            municipioField.value = data.municipio;
        }

        // UF
        const ufField = form.querySelector('[name="uf"]');
        if (ufField && !ufField.value && data.uf) {
            ufField.value = data.uf;
        }
        */

        this.showMessage('Dados carregados do PMO Principal!', 'info');
    } catch (error) {
        console.error('Erro ao carregar dados do PMO Principal:', error);
        this.showMessage('Aviso: Não foi possível carregar dados do PMO Principal.', 'warning');
    }
}
```

---

## 🔧 Integração no init()

```javascript
init() {
    console.log('Inicializando [Nome do Módulo]...');

    // Inicializar tabelas dinâmicas
    this.initTables();

    // Carregar dados salvos (do próprio anexo)
    this.loadData();

    // Auto-save
    this.initAutoSave();

    // Event listeners
    this.initEventListeners();

    // Máscaras de campos
    this.initMasks();

    // ⚠️ OBRIGATÓRIO: Carregar dados do PMO Principal
    this.loadPMOPrincipal();

    // Calcular progresso inicial
    this.updateProgress();

    console.log('[Nome do Módulo] inicializado com sucesso!');
}
```

---

## 🎯 Campos HTML Correspondentes

### Seção 1: Identificação do Produtor

```html
<section id="secao-identificacao" class="form-section">
    <h2>1. Identificação do Produtor</h2>

    <div class="form-grid">
        <!-- Campo 1: Nome do Fornecedor -->
        <div class="field-wrapper col-span-2">
            <label for="nome_fornecedor">
                Nome do Fornecedor/Produtor
                <span class="required">*</span>
            </label>
            <input type="text"
                   id="nome_fornecedor"
                   name="nome_fornecedor"
                   required
                   placeholder="Nome completo ou Razão Social">
        </div>

        <!-- Campo 2: Nome da Unidade -->
        <div class="field-wrapper col-span-2">
            <label for="nome_unidade_producao">
                Nome da Unidade de Produção
                <span class="required">*</span>
            </label>
            <input type="text"
                   id="nome_unidade_producao"
                   name="nome_unidade_producao"
                   required
                   placeholder="Ex: Sítio Boa Vista">
        </div>

        <!-- Campo 3: Data de Preenchimento -->
        <div class="field-wrapper">
            <label for="data_preenchimento">
                Data de Preenchimento
                <span class="required">*</span>
            </label>
            <input type="date"
                   id="data_preenchimento"
                   name="data_preenchimento"
                   required>
        </div>

        <!-- Campo 4: Grupo SPG -->
        <div class="field-wrapper">
            <label for="grupo_spg">
                Grupo SPG/ANC
                <span class="required">*</span>
            </label>
            <input type="text"
                   id="grupo_spg"
                   name="grupo_spg"
                   required
                   placeholder="Ex: Grupo Norte">
        </div>
    </div>
</section>
```

---

## 🐛 Troubleshooting

### Problema: Dados não carregam

**1. Verificar se PMO Principal foi salvo:**
```javascript
// No console do navegador (F12):
localStorage.getItem('pmo_principal_data')
// Deve retornar JSON, não null
```

**2. Verificar nome dos campos:**
```javascript
// Os campos HTML devem ter exatamente estes nomes:
name="nome_fornecedor"        // ou name="nome_produtor"
name="nome_unidade_producao"
name="data_preenchimento"
name="grupo_spg"
```

**3. Verificar se função foi chamada:**
```javascript
// Ver no console:
"Nome do fornecedor preenchido: [nome]"
"Nome da unidade preenchido: [nome]"
"Dados carregados do PMO Principal!"
```

**4. Verificar estrutura de dados:**
```javascript
// No console:
const data = JSON.parse(localStorage.getItem('pmo_principal_data'));
console.log(data);

// Deve ter:
// data.nome_completo ou data.razao_social
// data.nome_unidade_producao
```

---

## 📊 Dados Disponíveis no PMO Principal

### Campos básicos sempre disponíveis:
- `nome_completo` (Pessoa Física)
- `razao_social` (Pessoa Jurídica)
- `nome_fantasia`
- `nome_unidade_producao`
- `cpf` ou `cnpj`
- `inscricao_estadual`
- `inscricao_municipal`
- `tipo_pessoa` ('fisica' ou 'juridica')

### Campos de endereço:
- `cep`
- `endereco`
- `bairro`
- `municipio`
- `uf`
- `latitude`
- `longitude`
- `roteiro_acesso`

### Campos de contato:
- `contato_telefone[]` (array)
- `contato_email[]` (array)

### Campos de propriedade:
- `posse_terra`
- `area_total_ha`
- `data_aquisicao`
- `terra_familiar` (boolean)
- `caf_numero`
- `possui_car`
- `situacao_car`

### Outros campos:
- `anos_manejo_organico`
- `situacao_manejo`
- `grupo_spg`
- `data_declaracao`

---

## 🎨 Mensagem de Confirmação

### Opção 1: Toast/Alert
```javascript
this.showMessage('Dados carregados do PMO Principal!', 'info');
```

### Opção 2: Info Box na página
```html
<div class="alert alert-info" id="info-pmo-carregado" style="display:none;">
    <strong>✅ Dados carregados!</strong>
    Os dados básicos foram preenchidos automaticamente do PMO Principal.
</div>
```

```javascript
// Mostrar info box
document.getElementById('info-pmo-carregado').style.display = 'block';
```

---

## 📖 Referências

- **Prompt Universal:** `/prompt_universal_formulario_pmo.md` - Seção J
- **Exemplo Completo:** `/pmo/anexo-animal/anexo-animal.js` - linhas 384-431
- **Documentação:** `/pmo/anexo-animal/README.md` - Seção "Integração com PMO Principal"

---

## ✨ Exemplo de Uso

```javascript
// Módulo: Anexo Cogumelos
const AnexoCogumelos = {
    config: {
        formId: 'form-anexo-cogumelos',
        storageKey: 'pmo_anexo_cogumelos'
    },

    init() {
        console.log('Inicializando Anexo Cogumelos...');

        this.loadData();
        this.initAutoSave();
        this.initEventListeners();

        // ⚠️ OBRIGATÓRIO
        this.loadPMOPrincipal();

        this.updateProgress();
    },

    // ⚠️ Copiar função loadPMOPrincipal() completa aqui
    loadPMOPrincipal() {
        // ... código completo da função ...
    },

    // ... resto do código ...
};

document.addEventListener('DOMContentLoaded', () => {
    AnexoCogumelos.init();
});
```

---

**📌 Lembrete:** Esta integração é **OBRIGATÓRIA** para manter consistência entre todos os formulários do sistema PMO.
