# 📋 Documento de Padronização - Formulários PMO

## Sistema PMO ANC - Versão 2.0

Este documento define os padrões para todos os formulários do sistema PMO (Plano de Manejo Orgânico).

---

## 🎨 1. IDENTIDADE VISUAL

### Cores Temáticas por Anexo

Cada anexo possui uma cor temática específica para facilitar identificação:

| Anexo | Cor Principal | Código Hex | Gradiente |
|-------|--------------|------------|-----------|
| **Vegetal** 🌱 | Verde | `#10b981` | `#10b981` → `#059669` |
| **Animal** 🐄 | Laranja | `#f97316` | `#f97316` → `#ea580c` |
| **Cogumelo** 🍄 | Roxo | `#a855f7` | `#a855f7` → `#9333ea` |

### Aplicação das Cores

As cores temáticas são aplicadas em:
- Header (gradiente)
- Títulos de seção (h2)
- Botões primários
- Barra de progresso
- Estados de foco dos campos

---

## 📁 2. ESTRUTURA DE ARQUIVOS

### Organização Padrão

```
pmo/
├── anexo-vegetal/
│   ├── index.html
│   ├── anexo-vegetal.css    (específico)
│   ├── vegetal.js
│   └── vegetal-validators.js
├── anexo-animal/
│   ├── index.html
│   ├── anexo-animal.css     (específico)
│   ├── anexo-animal.js
│   └── validation-rules.js
└── anexo-cogumelo/
    ├── index.html
    ├── cogumelo.css         (específico)
    └── cogumelo.js
```

### CSS - Ordem de Carregamento

1. **Framework Base**: `pmo-framework-full.css` (comum)
2. **CSS Específico**: `anexo-[nome].css` (cores temáticas)

```html
<!-- Framework CSS Unificado -->
<link rel="stylesheet" href="../../framework/core/pmo-framework-full.css">

<!-- CSS Específico do Anexo -->
<link rel="stylesheet" href="./anexo-vegetal.css">
```

### JavaScript - Ordem de Carregamento

1. **Framework Core**: `pmo-framework.js`
2. **Biblioteca de Tabelas**: `pmo-tables.js`
3. **Scripts Específicos**: `[anexo].js`, `validators.js`

```html
<!-- Framework JS Unificado -->
<script src="../../framework/core/pmo-framework.js"></script>
<script src="../../framework/components/pmo-tables.js"></script>

<!-- JS Específico do Módulo -->
<script src="./vegetal.js"></script>
<script src="./vegetal-validators.js"></script>
```

---

## 🏗️ 3. ESTRUTURA HTML PADRÃO

### Header

```html
<header class="pmo-header">
    <div class="pmo-container">
        <div class="header-content">
            <h1>🌱 Anexo I - Produção Vegetal</h1>
            <p class="subtitle">Plano de Manejo Orgânico - ANC</p>
        </div>

        <!-- Navegação -->
        <nav class="pmo-navigation">
            <a href="../dashboard/index.html">🏠 Dashboard</a>
            <a href="../pmo-principal/index.html">📋 PMO Principal</a>
            <a href="../anexo-vegetal/index.html" class="active">🌱 Anexo Vegetal</a>
            <a href="../anexo-animal/index.html">🐄 Anexo Animal</a>
            <a href="../relatorios/index.html">📊 Relatórios</a>
        </nav>

        <!-- Barra de Progresso -->
        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
            <span class="progress-text" id="progress-text">0% Completo</span>
        </div>
    </div>
</header>
```

### Seção do Formulário

```html
<section id="secao-exemplo" class="form-section">
    <h2>1. Título da Seção</h2>

    <div class="section-info">
        <p class="instruction">ℹ️ Instruções para o usuário</p>
        <p class="alert">⚠️ Avisos importantes</p>
    </div>

    <div class="form-grid">
        <div class="field-wrapper">
            <label for="campo">
                Nome do Campo
                <span class="required">*</span>
            </label>
            <input type="text" id="campo" name="campo" required>
        </div>
    </div>
</section>
```

### Footer

```html
<footer class="pmo-footer">
    <p>&copy; 2024 ANC - Associação de Agricultura Natural de Campinas e Região</p>
    <p>Sistema PMO - Plano de Manejo Orgânico</p>
</footer>
```

---

## 📊 4. TABELAS DINÂMICAS

### Implementação Padrão

Todas as tabelas dinâmicas devem usar a biblioteca `pmo-tables.js`.

#### HTML

```html
<div class="table-wrapper">
    <table id="tabela-exemplo" class="dynamic-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Campo 1 <span class="required">*</span></th>
                <th>Campo 2</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody id="tbody-exemplo">
            <tr>
                <td class="row-number">1</td>
                <td><input type="text" name="campo1[]" required></td>
                <td><input type="text" name="campo2[]"></td>
                <td class="action-buttons">
                    <button type="button" onclick="PMOTable.duplicateRow(this)" title="Duplicar">📋</button>
                    <button type="button" onclick="PMOTable.removeRow(this)" title="Remover">❌</button>
                </td>
            </tr>
        </tbody>
    </table>
    <button type="button" onclick="PMOTable.addRow('tabela-exemplo')" class="btn btn-add">
        ➕ Adicionar Item
    </button>
</div>
```

#### Funções Disponíveis

```javascript
// Adicionar linha
PMOTable.addRow('tabela-exemplo');

// Remover linha (do botão)
PMOTable.removeRow(button);

// Duplicar linha (do botão)
PMOTable.duplicateRow(button);

// Obter dados da tabela
const dados = PMOTable.getTableData('tabela-exemplo');

// Preencher tabela com dados
PMOTable.setTableData('tabela-exemplo', dados);

// Validar tabela
const valida = PMOTable.validateTable('tabela-exemplo');
```

---

## 🎛️ 5. CAMPOS CONDICIONAIS

### Implementação

Campos que aparecem/desaparecem baseados em seleções do usuário.

#### HTML

```html
<div class="field-wrapper">
    <label class="checkbox-enhanced">
        <input type="checkbox"
               name="utiliza_substrato"
               onchange="toggleConditional('detalhes-substrato', this.checked)">
        <span>Utiliza substrato?</span>
    </label>
</div>

<div id="detalhes-substrato" class="conditional-field">
    <!-- Campos que aparecem quando checkbox marcado -->
    <label for="tipo_substrato">Tipo de Substrato</label>
    <input type="text" id="tipo_substrato" name="tipo_substrato">
</div>
```

#### JavaScript

```javascript
function toggleConditional(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        if (show) {
            element.classList.add('show');
        } else {
            element.classList.remove('show');
        }
    }
}
```

#### CSS

```css
.conditional-field {
    display: none;
    margin-top: 15px;
    padding: 15px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
}

.conditional-field.show {
    display: block;
}
```

---

## 🔘 6. BOTÕES DE AÇÃO

### Botões Padrão

```html
<div class="form-actions">
    <button type="button" onclick="validateForm()" class="btn btn-secondary">
        ✅ Validar Formulário
    </button>
    <button type="button" onclick="saveForm()" class="btn btn-primary">
        💾 Salvar Rascunho
    </button>
    <button type="button" onclick="exportJSON()" class="btn btn-secondary">
        📦 Exportar JSON
    </button>
    <button type="button" onclick="exportPDF()" class="btn btn-secondary">
        📄 Exportar PDF
    </button>
    <button type="submit" class="btn btn-success">
        ✔️ Finalizar e Enviar
    </button>
</div>
```

### Classes de Botões

| Classe | Uso | Cor |
|--------|-----|-----|
| `btn-primary` | Ação principal | Cor temática do anexo |
| `btn-secondary` | Ações secundárias | Azul (`#3b82f6`) |
| `btn-success` | Submissão/Confirmação | Verde (`#10b981`) |
| `btn-add` | Adicionar itens | Cor temática do anexo |
| `btn-icon` | Remover itens | Vermelho (`#ef4444`) |

---

## 📝 7. CLASSES CSS PADRÃO

### Layout

```css
.pmo-container       /* Container principal */
.pmo-header          /* Cabeçalho */
.pmo-footer          /* Rodapé */
.pmo-form            /* Formulário */
.form-section        /* Seção do formulário */
.form-grid           /* Grid de campos */
.form-actions        /* Área de botões */
```

### Campos

```css
.field-wrapper       /* Wrapper de campo */
.field-wrapper.full-width  /* Campo largura completa */
.required            /* Asterisco vermelho (*) */
.section-info        /* Caixa de informações */
.alert               /* Avisos */
```

### Componentes

```css
.checkbox-enhanced   /* Checkbox estilizado */
.checkbox-group      /* Grupo de checkboxes */
.practice-item       /* Item de prática */
.conditional-field   /* Campo condicional */
.table-wrapper       /* Wrapper de tabela */
.dynamic-table       /* Tabela dinâmica */
```

---

## 🎯 8. NOMENCLATURA

### IDs e Names

**Padrão**: `snake_case` (minúsculas com underscore)

```html
<input type="text" id="nome_fornecedor" name="nome_fornecedor">
<table id="tabela-substrato">
<section id="secao-dados-basicos">
```

### Arrays (campos múltiplos)

Adicione `[]` no final do name:

```html
<input type="text" name="material_ingrediente[]">
<select name="origem[]">
```

### Classes JavaScript

**Padrão**: `PascalCase` para classes/objetos, `camelCase` para funções

```javascript
const AnexoVegetal = {
    loadPMOPrincipal() { },
    saveForm() { },
    updateProgress() { }
}

const PMOTable = {
    addRow(tableId) { },
    removeRow(button) { }
}
```

---

## ✅ 9. CHECKLIST DE PADRONIZAÇÃO

Use este checklist ao criar ou atualizar um formulário:

### Estrutura
- [ ] CSS Framework incluído (`pmo-framework-full.css`)
- [ ] CSS específico com cores temáticas
- [ ] JavaScript framework incluído (`pmo-framework.js`)
- [ ] Biblioteca de tabelas incluída (`pmo-tables.js`)
- [ ] Header padronizado com navegação
- [ ] Barra de progresso implementada
- [ ] Footer padronizado

### Funcionalidades
- [ ] Tabelas dinâmicas usando `PMOTable`
- [ ] Campos condicionais com `toggleConditional()`
- [ ] Validação de formulário
- [ ] Auto-save implementado
- [ ] Progresso calculado automaticamente
- [ ] Botões de ação padrão

### Estilo
- [ ] Cores temáticas aplicadas corretamente
- [ ] Classes CSS padrão utilizadas
- [ ] Campos obrigatórios marcados com `*`
- [ ] Instruções e alertas presentes
- [ ] Responsivo (mobile-friendly)

### Dados
- [ ] Carrega dados do PMO Principal
- [ ] Salva no localStorage
- [ ] Exporta JSON
- [ ] Exporta PDF
- [ ] Rastreabilidade implementada

---

## 📚 10. REFERÊNCIAS

### Arquivos Core

```
framework/
├── core/
│   └── pmo-framework-full.css
│   └── pmo-framework.js
└── components/
    └── pmo-tables.js
    └── validators.js
    └── storage.js
    └── progress.js
    └── export.js
```

### Exemplos de Referência

- **Tabelas Dinâmicas**: Ver `anexo-vegetal/index.html` seções 6, 7, 8
- **Campos Condicionais**: Ver `anexo-vegetal/index.html` seções 3, 4
- **Cores Temáticas**: Ver arquivos `*.css` de cada anexo
- **Validações**: Ver `vegetal-validators.js`, `validation-rules.js`

---

## 🔄 11. VERSIONAMENTO

### Versão Atual: 2.0

**Mudanças na v2.0:**
- ✅ CSS unificado com framework
- ✅ Cores temáticas por anexo
- ✅ Biblioteca de tabelas dinâmicas centralizada
- ✅ Estrutura HTML padronizada
- ✅ Nomenclatura consistente

**Compatibilidade:**
- Mantém retrocompatibilidade com formulários v1.0
- Funções antigas continuam funcionando
- Migração gradual recomendada

---

## 📞 12. SUPORTE

Para dúvidas ou sugestões sobre a padronização:

- **Documentação**: Este arquivo (`PADRONIZACAO.md`)
- **Exemplos**: Anexo Vegetal (mais completo)
- **Issues**: Reportar no sistema de controle de versão

---

**Última atualização**: 2024
**Mantido por**: Equipe de Desenvolvimento PMO ANC
