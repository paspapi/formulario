# Prompt Universal para Criação de Formulários PMO - Plano de Manejo Orgânico

## Contexto
Crie um formulário HTML5 responsivo e interativo para digitalização do Plano de Manejo Orgânico (PMO) da ANC - Associação de Agricultura Natural de Campinas, seguindo rigorosamente a estrutura definida nos schemas JSON e utilizando o framework PMO padronizado para garantir consistência entre todos os formulários do sistema.

## 📦 Pré-requisitos e Estrutura do Projeto

### Schemas JSON Disponíveis
Todos os formulários devem ser gerados a partir dos schemas JSON localizados em `/database/schemas/`:

1. **pmo-principal.schema.json** (638 linhas) - Formulário base obrigatório
2. **anexo-vegetal.schema.json** (171 linhas) - Produção Primária Vegetal
3. **anexo-animal.schema.json** (640 linhas) - Produção Animal
4. **anexo-cogumelo.schema.json** (383 linhas) - Produção de Cogumelos
5. **anexo-apicultura.schema.json** (696 linhas) - Apicultura/Meliponicultura
6. **anexo-processamento.schema.json** (630 linhas) - Processamento de Produtos

### Framework PMO Existente
O projeto possui um framework padronizado localizado em `/framework/`:

**Arquivos do Framework:**
- `/framework/core/pmo-framework-full.css` - Design system completo
- `/framework/core/pmo-framework.js` - Funcionalidades core
- `/framework/components/pmo-tables.js` - Tabelas dinâmicas

**Exemplos de Referência:**
- `/pmo/pmo-principal/index.html` - Implementação HTML completa
- `/pmo/pmo-principal/pmo-principal.js` - Lógica JavaScript
- `/pmo/pmo-principal/pmo-principal.css` - Estilos específicos
- `/pmo/anexo-animal/index.html` - Exemplo com tabelas complexas
- `/pmo/anexo-vegetal/index.html` - Exemplo simplificado

## 🎨 Estrutura de Página Padrão (Obrigatória para Todos os Formulários)

### Header Padrão com Menu de Navegação Global
**TODOS os formulários devem incluir este header fixo no topo:**

```html
<header class="pmo-header">
    <div class="pmo-container">
        <div class="header-content">
            <h1>📋 PMO Principal</h1>
            <p class="subtitle">Plano de Manejo Orgânico - ANC</p>
        </div>

        <!-- Navegação -->
        <nav class="pmo-navigation">
            <a href="../dashboard/index.html">🏠 Dashboard</a>
            <a href="../pmo-principal/index.html" class="active">📋 PMO Principal</a>
            <a href="../anexo-vegetal/index.html">🌱 Anexo Vegetal</a>
            <a href="../anexo-animal/index.html">🐄 Anexo Animal</a>
            <a href="../anexo-cogumelo/index.html">🍄 Anexo Cogumelo</a>
            <a href="../anexo-apicultura/index.html">🐝 Anexo Apicultura</a>
            <a href="../anexo-processamento/index.html">🏭 Anexo Processamento</a>
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

**Notas:**
- Destacar o item ativo com classe `active` no formulário atual
- Título do h1 deve ser específico do formulário (ex: "🌱 Anexo I - Produção Vegetal")
- A barra de progresso está DENTRO do header

### Footer Padrão Global
**TODOS os formulários devem incluir o mesmo footer:**

```html
<footer class="pmo-footer">
    <p>&copy; 2024 ANC - Associação de Agricultura Natural de Campinas e Região</p>
    <p>Sistema PMO - Plano de Manejo Orgânico</p>
</footer>
```

## 🔧 Framework PMO - Sistema de Componentes

### Componentes JavaScript Disponíveis

O framework PMO fornece objetos JavaScript reutilizáveis. Use-os ao invés de reescrever funcionalidades:

```javascript
// Objeto principal do módulo (substitua 'NomeModulo' pelo nome específico)
const MeuFormulario = {
    config: {
        moduleName: 'nome-modulo',
        storageKey: 'nome_modulo_data',
        autoSaveInterval: 30000,
        version: '2.0'
    },

    // Inicialização
    init() {
        this.loadSavedData();
        this.setupAutoSave();
        this.setupEventListeners();
        this.initDynamicTables();
        this.applyMasks();
        this.calculateProgress();
    },

    // Usar métodos do framework para tabelas
    table: {
        addRow(tableId) { /* usa PMOTable do framework */ },
        removeRow(button) { /* implementação padrão */ },
        duplicateRow(button) { /* implementação padrão */ }
    }
};
```

### Funções Helper Disponíveis

**1. Validadores (validators.js)**
```javascript
// Validar CPF
PMOValidators.validateCPF('123.456.789-00') // true/false

// Validar CNPJ
PMOValidators.validateCNPJ('12.345.678/0001-90') // true/false

// Validar CEP
PMOValidators.validateCEP('13100-000') // true/false

// Validar Email
PMOValidators.validateEmail('email@example.com') // true/false

// Validar Data (idade mínima)
PMOValidators.validateAge(birthDate, 18) // true/false
```

**2. Máscaras de Entrada**
```javascript
// Aplicar máscara em campo
PMOField.mask(inputElement, 'cpf');    // 000.000.000-00
PMOField.mask(inputElement, 'cnpj');   // 00.000.000/0000-00
PMOField.mask(inputElement, 'cep');    // 00000-000
PMOField.mask(inputElement, 'phone');  // (00) 00000-0000
PMOField.mask(inputElement, 'date');   // DD/MM/AAAA
```

**3. Storage e Auto-Save**
```javascript
// Salvar dados automaticamente
PMOStorage.autoSave(formElement, 30000); // a cada 30 segundos

// Salvar manualmente
PMOStorage.save(formId, data);

// Carregar dados salvos
const savedData = PMOStorage.load(formId);

// Limpar storage
PMOStorage.clear(formId);
```

**4. Tabelas Dinâmicas**
```javascript
// Adicionar linha - usar via onclick
onclick="MeuFormulario.table.addRow('tabela-produtos')"

// Remover linha - usar via onclick
onclick="MeuFormulario.table.removeRow(this)"

// Duplicar linha - usar via onclick
onclick="MeuFormulario.table.duplicateRow(this)"

// Atualizar numeração
PMOTable.updateRowNumbers(tbodyElement);
```

**5. Barra de Progresso**
```javascript
// Calcular e atualizar progresso
PMOProgress.calculate(formElement);

// Atualizar manualmente
PMOProgress.update(percentage); // 0-100
```

**6. Exportação**
```javascript
// Exportar JSON
PMOExport.toJSON(formData, 'pmo-principal-2024-01-15.json');

// Exportar PDF
PMOExport.toPDF(formElement, 'pmo-principal.pdf');

// Exportar CSV (tabelas)
PMOExport.toCSV(tableElement, 'dados.csv');
```

**7. Notificações**
```javascript
// Mostrar mensagem de sucesso
PMONotify.success('Dados salvos com sucesso!');

// Mostrar erro
PMONotify.error('Preencha todos os campos obrigatórios');

// Mostrar aviso
PMONotify.warning('Verifique os dados antes de enviar');

// Mostrar informação
PMONotify.info('Formulário salvo automaticamente');
```

**8. Busca CEP Automática**
```javascript
// Buscar e preencher endereço
async function buscarCEP(cep) {
    const dados = await PMOAddress.fetchCEP(cep);
    // Preenche automaticamente: logradouro, bairro, cidade, UF
}
```

### Design System - Variáveis CSS

**Use estas variáveis CSS ao invés de valores hard-coded:**

```css
/* Cores */
var(--primary)        /* Azul principal */
var(--primary-dark)   /* Azul escuro */
var(--primary-light)  /* Azul claro */
var(--secondary)      /* Verde secundário */
var(--success)        /* Verde sucesso */
var(--warning)        /* Laranja aviso */
var(--error)          /* Vermelho erro */
var(--gray-50) até var(--gray-900)

/* Espaçamentos */
var(--spacing-xs)     /* 0.25rem */
var(--spacing-sm)     /* 0.5rem */
var(--spacing-md)     /* 1rem */
var(--spacing-lg)     /* 1.5rem */
var(--spacing-xl)     /* 2rem */
var(--spacing-2xl)    /* 3rem */

/* Tipografia */
var(--text-xs)        /* 0.75rem */
var(--text-sm)        /* 0.875rem */
var(--text-base)      /* 1rem */
var(--text-lg)        /* 1.125rem */
var(--text-xl)        /* 1.25rem */
var(--text-2xl)       /* 1.5rem */
var(--text-3xl)       /* 2rem */

/* Outros */
var(--radius-sm)      /* Border radius pequeno */
var(--radius-md)      /* Border radius médio */
var(--radius-lg)      /* Border radius grande */
var(--shadow-sm)      /* Sombra pequena */
var(--shadow-md)      /* Sombra média */
var(--shadow-lg)      /* Sombra grande */
```

### Classes CSS Prontas

```css
/* Containers */
.pmo-container         /* Container específico do PMO */

/* Formulários */
.form-section          /* Seção do formulário com card */
.form-grid             /* Grid responsivo para campos */
.field-wrapper         /* Wrapper para label + input */
.form-actions          /* Container de botões de ação */

/* Botões */
.btn                   /* Botão base */
.btn-primary           /* Botão primário (azul) */
.btn-secondary         /* Botão secundário (verde) */
.btn-success           /* Botão sucesso */
.btn-danger            /* Botão perigo */
.btn-warning           /* Botão aviso */
.btn-add               /* Botão adicionar */
.btn-sm, .btn-lg       /* Tamanhos */

/* Alertas */
.alert                 /* Alert base */
.alert-success         /* Verde */
.alert-warning         /* Laranja */
.alert-error           /* Vermelho */
.alert-info            /* Azul */
.section-info          /* Informação de seção */

/* Tabelas */
.dynamic-table         /* Tabela dinâmica estilizada */
.table-wrapper         /* Wrapper com scroll */
.action-buttons        /* Coluna de ações */

/* Checkbox/Radio */
.checkbox-enhanced     /* Checkbox estilizado */
.radio-group           /* Grupo de radios */

/* Utilitários */
.text-center           /* Texto centralizado */
.hidden                /* Ocultar elemento */
.col-span-2, .col-span-3, .col-span-4  /* Grid spanning */
```

## Requisitos Técnicos

### 1. Estrutura Base HTML
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PMO [Nome do Formulário] - ANC</title>

    <!-- Framework CSS Unificado -->
    <link rel="stylesheet" href="../../framework/core/pmo-framework-full.css">

    <!-- CSS Específico (apenas se necessário) -->
    <link rel="stylesheet" href="./formulario.css">

    <!-- Favicon (opcional) -->
    <link rel="icon" type="image/png" href="../../assets/images/favicon.png">
</head>
<body>
    <!-- HEADER PADRÃO (copiar da seção anterior) -->
    <header class="pmo-header">
        <div class="pmo-container">
            <div class="header-content">
                <h1>📋 [Título do Formulário]</h1>
                <p class="subtitle">Plano de Manejo Orgânico - ANC</p>
            </div>

            <!-- Navegação -->
            <nav class="pmo-navigation">
                <a href="../dashboard/index.html">🏠 Dashboard</a>
                <a href="../pmo-principal/index.html">📋 PMO Principal</a>
                <a href="../anexo-vegetal/index.html">🌱 Anexo Vegetal</a>
                <a href="../anexo-animal/index.html">🐄 Anexo Animal</a>
                <a href="../anexo-cogumelo/index.html">🍄 Anexo Cogumelo</a>
                <a href="../anexo-apicultura/index.html">🐝 Anexo Apicultura</a>
                <a href="../anexo-processamento/index.html">🏭 Anexo Processamento</a>
                <a href="../relatorios/index.html">📊 Relatórios</a>
            </nav>

            <!-- Barra de Progresso -->
            <div class="progress-bar-container">
                <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
                <span class="progress-text" id="progress-text">0% Completo</span>
            </div>
        </div>
    </header>

    <!-- CONTAINER PRINCIPAL -->
    <div class="pmo-container">
        <form id="form-[nome-modulo]" class="pmo-form">
            <!-- SEÇÕES DO FORMULÁRIO AQUI -->
            <!-- Geradas a partir do schema JSON -->
        </form>
    </div>

    <!-- FOOTER PADRÃO (copiar da seção anterior) -->
    <footer class="pmo-footer">
        <p>&copy; 2024 ANC - Associação de Agricultura Natural de Campinas e Região</p>
        <p>Sistema PMO - Plano de Manejo Orgânico</p>
    </footer>

    <!-- Framework JS Unificado -->
    <script src="../../framework/core/pmo-framework.js"></script>
    <script src="../../framework/components/pmo-tables.js"></script>

    <!-- Script Específico do Formulário -->
    <script src="./formulario.js"></script>
</invoke>