# Prompt para Desenvolvimento do Framework de Ferramentas PMO

## 🎯 Objetivo
Desenvolver o framework unificado de componentes, validadores e utilitários reutilizáveis para todos os formulários do sistema PMO, garantindo consistência, manutenibilidade e performance.

---

## 📋 ESTRUTURA DO FRAMEWORK

```
framework/
├── core/
│   ├── pmo-framework.css          # CSS unificado (30-40KB)
│   ├── pmo-framework.js           # JavaScript core (50-70KB)
│   ├── pmo-framework.min.css      # Versão minificada
│   └── pmo-framework.min.js       # Versão minificada
│
├── components/
│   ├── validators.js              # Validadores (CPF, CNPJ, CEP, email, etc)
│   ├── dynamic-fields.js          # Sistema de campos dinâmicos
│   ├── tables.js                  # Tabelas dinâmicas
│   ├── upload.js                  # Sistema de upload com preview
│   ├── storage.js                 # Auto-save e localStorage
│   ├── progress.js                # Barra de progresso
│   ├── export.js                  # Exportação (JSON, PDF, CSV)
│   ├── import.js                  # Importação JSON
│   ├── navigation.js              # Sistema de navegação
│   └── notifications.js           # Sistema de mensagens
│
├── styles/
│   ├── _variables.css             # Variáveis CSS
│   ├── _base.css                  # Reset e base
│   ├── _components.css            # Componentes
│   ├── _utilities.css             # Classes utilitárias
│   ├── _responsive.css            # Media queries
│   └── _print.css                 # Estilos para impressão
│
└── utils/
    ├── api-client.js              # Cliente para APIs externas
    ├── date-helpers.js            # Funções de data
    ├── formatters.js              # Formatadores
    └── constants.js               # Constantes do sistema
```

---

## 🎨 PARTE 1: CSS FRAMEWORK

### Arquivo: `framework/styles/_variables.css`

```css
/**
 * PMO Design System - Variáveis CSS
 * Baseado em Tailwind CSS e Material Design
 */

:root {
    /* ===== CORES PRINCIPAIS ===== */
    /* Verde ANC (cor primária) */
    --primary: #10b981;
    --primary-50: #ecfdf5;
    --primary-100: #d1fae5;
    --primary-200: #a7f3d0;
    --primary-300: #6ee7b7;
    --primary-400: #34d399;
    --primary-500: #10b981;
    --primary-600: #059669;
    --primary-700: #047857;
    --primary-800: #065f46;
    --primary-900: #064e3b;
    --primary-dark: #059669;
    --primary-light: #86efac;

    /* Azul (cor secundária) */
    --secondary: #3b82f6;
    --secondary-50: #eff6ff;
    --secondary-100: #dbeafe;
    --secondary-200: #bfdbfe;
    --secondary-300: #93c5fd;
    --secondary-400: #60a5fa;
    --secondary-500: #3b82f6;
    --secondary-600: #2563eb;
    --secondary-700: #1d4ed8;
    --secondary-800: #1e40af;
    --secondary-900: #1e3a8a;
    --secondary-dark: #1d4ed8;

    /* ===== ESTADOS E FEEDBACK ===== */
    --success: #10b981;
    --success-light: #d1fae5;
    --success-dark: #047857;

    --error: #ef4444;
    --error-light: #fee2e2;
    --error-dark: #991b1b;

    --warning: #f59e0b;
    --warning-light: #fef3c7;
    --warning-dark: #92400e;

    --info: #3b82f6;
    --info-light: #dbeafe;
    --info-dark: #1e40af;

    /* ===== ESCALA DE CINZAS ===== */
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;

    --black: #000000;
    --white: #ffffff;

    /* ===== ESPAÇAMENTOS ===== */
    --spacing-xs: 0.25rem;    /* 4px */
    --spacing-sm: 0.5rem;     /* 8px */
    --spacing-md: 1rem;       /* 16px */
    --spacing-lg: 1.5rem;     /* 24px */
    --spacing-xl: 2rem;       /* 32px */
    --spacing-2xl: 3rem;      /* 48px */
    --spacing-3xl: 4rem;      /* 64px */

    /* ===== BORDAS ===== */
    --radius-sm: 0.25rem;     /* 4px */
    --radius-md: 0.375rem;    /* 6px */
    --radius-lg: 0.5rem;      /* 8px */
    --radius-xl: 0.75rem;     /* 12px */
    --radius-2xl: 1rem;       /* 16px */
    --radius-full: 9999px;    /* Círculo */

    --border-width: 1px;
    --border-width-2: 2px;
    --border-width-4: 4px;

    /* ===== SOMBRAS ===== */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);

    /* ===== TIPOGRAFIA ===== */
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --font-mono: 'Courier New', Courier, monospace;

    --text-xs: 0.75rem;      /* 12px */
    --text-sm: 0.875rem;     /* 14px */
    --text-base: 1rem;       /* 16px */
    --text-lg: 1.125rem;     /* 18px */
    --text-xl: 1.25rem;      /* 20px */
    --text-2xl: 1.5rem;      /* 24px */
    --text-3xl: 1.875rem;    /* 30px */
    --text-4xl: 2.25rem;     /* 36px */

    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;

    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;

    /* ===== TRANSIÇÕES ===== */
    --transition-fast: 150ms ease;
    --transition-base: 300ms ease;
    --transition-slow: 500ms ease;

    /* ===== Z-INDEX ===== */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;

    /* ===== BREAKPOINTS (para JS) ===== */
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;
}
```

### Arquivo: `framework/styles/_base.css`

```css
/**
 * PMO Framework - Reset e Estilos Base
 */

/* Reset básico */
*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    font-weight: var(--font-normal);
    line-height: var(--line-height-normal);
    color: var(--gray-900);
    background: var(--gray-50);
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-bold);
    line-height: var(--line-height-tight);
    color: var(--gray-900);
}

h1 { font-size: var(--text-4xl); margin-bottom: var(--spacing-lg); }
h2 { font-size: var(--text-3xl); margin-bottom: var(--spacing-md); }
h3 { font-size: var(--text-2xl); margin-bottom: var(--spacing-md); }
h4 { font-size: var(--text-xl); margin-bottom: var(--spacing-sm); }
h5 { font-size: var(--text-lg); margin-bottom: var(--spacing-sm); }
h6 { font-size: var(--text-base); margin-bottom: var(--spacing-sm); }

/* Parágrafos */
p {
    margin-bottom: var(--spacing-md);
}

/* Links */
a {
    color: var(--primary);
    text-decoration: none;
    transition: color var(--transition-fast);
}

a:hover {
    color: var(--primary-dark);
    text-decoration: underline;
}

/* Listas */
ul, ol {
    margin-left: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
}

li {
    margin-bottom: var(--spacing-xs);
}

/* Imagens */
img {
    max-width: 100%;
    height: auto;
    display: block;
}

/* Tabelas */
table {
    width: 100%;
    border-collapse: collapse;
}

/* Code */
code, pre {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
}

/* Formulários base */
input,
select,
textarea,
button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}

/* Acessibilidade */
:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}

/* Print */
@media print {
    body {
        background: white;
        color: black;
    }

    .no-print {
        display: none !important;
    }
}
```

### Arquivo: `framework/styles/_components.css`

```css
/**
 * PMO Framework - Componentes Reutilizáveis
 */

/* ===== CONTAINER ===== */
.pmo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-xl);
}

@media (max-width: 768px) {
    .pmo-container {
        padding: var(--spacing-md);
    }
}

/* ===== FORM SECTION ===== */
.form-section {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    box-shadow: var(--shadow-md);
}

.form-section h2 {
    color: var(--gray-800);
    font-size: var(--text-2xl);
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 2px solid var(--primary);
}

.form-section h3 {
    color: var(--gray-700);
    font-size: var(--text-xl);
    margin: var(--spacing-lg) 0 var(--spacing-md);
}

.form-section h4 {
    color: var(--gray-600);
    font-size: var(--text-lg);
    margin: var(--spacing-md) 0;
}

/* ===== GRID LAYOUT ===== */
.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}

/* ===== CAMPOS DE FORMULÁRIO ===== */
.field-wrapper {
    margin-bottom: var(--spacing-md);
}

.field-wrapper label {
    display: block;
    font-weight: var(--font-medium);
    color: var(--gray-700);
    margin-bottom: var(--spacing-xs);
}

.field-wrapper label .required {
    color: var(--error);
    margin-left: var(--spacing-xs);
}

input[type="text"],
input[type="number"],
input[type="email"],
input[type="tel"],
input[type="date"],
input[type="month"],
input[type="url"],
input[type="password"],
select,
textarea {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border: var(--border-width) solid var(--gray-300);
    border-radius: var(--radius-md);
    font-size: var(--text-base);
    transition: all var(--transition-fast);
    background: var(--white);
}

input:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

input:disabled,
select:disabled,
textarea:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
    opacity: 0.6;
}

/* Estados de validação */
.field-valid {
    border-left: 3px solid var(--success) !important;
    background: var(--success-light);
}

.field-invalid {
    border-left: 3px solid var(--error) !important;
    background: var(--error-light);
}

.field-warning {
    border-left: 3px solid var(--warning) !important;
    background: var(--warning-light);
}

/* Mensagens de ajuda */
.help-text {
    display: block;
    font-size: var(--text-sm);
    color: var(--gray-500);
    margin-top: var(--spacing-xs);
}

.error-text {
    display: block;
    font-size: var(--text-sm);
    color: var(--error);
    margin-top: var(--spacing-xs);
}

/* ===== CHECKBOXES E RADIOS MELHORADOS ===== */
.checkbox-enhanced,
.radio-enhanced {
    display: flex;
    align-items: center;
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--transition-fast);
}

.checkbox-enhanced:hover,
.radio-enhanced:hover {
    background: var(--gray-50);
}

.checkbox-enhanced input[type="checkbox"],
.radio-enhanced input[type="radio"] {
    width: auto;
    margin-right: var(--spacing-sm);
    cursor: pointer;
}

/* ===== BOTÕES ===== */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-base);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-primary {
    background: var(--primary);
    color: var(--white);
}

.btn-primary:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.btn-secondary {
    background: var(--gray-200);
    color: var(--gray-700);
}

.btn-secondary:hover:not(:disabled) {
    background: var(--gray-300);
}

.btn-success {
    background: var(--success);
    color: var(--white);
}

.btn-danger {
    background: var(--error);
    color: var(--white);
}

.btn-danger:hover:not(:disabled) {
    background: var(--error-dark);
}

.btn-add {
    background: var(--success);
    color: var(--white);
}

.btn-remove {
    background: transparent;
    color: var(--error);
    border: var(--border-width) solid var(--error);
    padding: var(--spacing-xs) var(--spacing-sm);
}

.btn-remove:hover:not(:disabled) {
    background: var(--error);
    color: var(--white);
}

/* ===== TABELAS DINÂMICAS ===== */
.dynamic-table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--spacing-md) 0;
    overflow-x: auto;
    display: block;
}

.dynamic-table thead {
    background: var(--gray-100);
}

.dynamic-table th {
    padding: var(--spacing-md);
    text-align: left;
    font-weight: var(--font-semibold);
    color: var(--gray-700);
    border-bottom: 2px solid var(--gray-200);
    white-space: nowrap;
}

.dynamic-table td {
    padding: var(--spacing-sm);
    border-bottom: var(--border-width) solid var(--gray-200);
}

.dynamic-table tbody tr:hover {
    background: var(--gray-50);
}

.dynamic-table input,
.dynamic-table select {
    min-width: 100px;
}

@media (max-width: 768px) {
    .dynamic-table {
        font-size: var(--text-sm);
    }

    .dynamic-table th,
    .dynamic-table td {
        padding: var(--spacing-xs);
    }
}

/* ===== UPLOAD ===== */
.upload-area {
    border: 2px dashed var(--gray-300);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    text-align: center;
    transition: all var(--transition-fast);
    cursor: pointer;
    background: var(--gray-50);
}

.upload-area:hover {
    border-color: var(--primary);
    background: var(--white);
}

.upload-area.dragover {
    border-color: var(--primary);
    background: var(--primary-50);
    box-shadow: var(--shadow-lg);
}

.file-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
}

.file-item {
    position: relative;
    border: var(--border-width) solid var(--gray-200);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    background: var(--white);
}

.file-item img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: var(--radius-sm);
}

.file-item .file-name {
    font-size: var(--text-sm);
    color: var(--gray-600);
    margin-top: var(--spacing-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-item .remove-file {
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--error);
    color: var(--white);
    border: none;
    border-radius: var(--radius-full);
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-lg);
    line-height: 1;
}

/* ===== MENSAGENS ===== */
.message {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
}

.message-info {
    background: var(--info-light);
    border-left: 4px solid var(--info);
    color: var(--info-dark);
}

.message-success {
    background: var(--success-light);
    border-left: 4px solid var(--success);
    color: var(--success-dark);
}

.message-warning {
    background: var(--warning-light);
    border-left: 4px solid var(--warning);
    color: var(--warning-dark);
}

.message-error {
    background: var(--error-light);
    border-left: 4px solid var(--error);
    color: var(--error-dark);
}

/* ===== PROGRESS BAR ===== */
.progress-container {
    position: sticky;
    top: 0;
    background: var(--white);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-md);
    z-index: var(--z-sticky);
    margin-bottom: var(--spacing-xl);
}

.progress-bar {
    height: 8px;
    background: var(--gray-200);
    border-radius: var(--radius-full);
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--primary-dark));
    border-radius: var(--radius-full);
    transition: width var(--transition-base);
}

.progress-text {
    text-align: center;
    margin-top: var(--spacing-sm);
    font-weight: var(--font-semibold);
    color: var(--gray-700);
}

/* ===== TABS ===== */
.tabs-container {
    margin-bottom: var(--spacing-lg);
}

.tabs-header {
    display: flex;
    border-bottom: 2px solid var(--gray-200);
    gap: var(--spacing-xs);
    overflow-x: auto;
}

.tab-button {
    padding: var(--spacing-sm) var(--spacing-lg);
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    color: var(--gray-600);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
    white-space: nowrap;
}

.tab-button:hover {
    color: var(--gray-800);
    background: var(--gray-50);
}

.tab-button.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
}

.tab-content {
    display: none;
    padding: var(--spacing-lg) 0;
}

.tab-content.active {
    display: block;
}

/* ===== ACCORDION ===== */
.accordion-item {
    border: var(--border-width) solid var(--gray-200);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
    overflow: hidden;
}

.accordion-header {
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--gray-50);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background var(--transition-fast);
    font-weight: var(--font-medium);
}

.accordion-header:hover {
    background: var(--gray-100);
}

.accordion-header.active {
    background: var(--primary);
    color: var(--white);
}

.accordion-content {
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transition: all var(--transition-base);
}

.accordion-content.active {
    padding: var(--spacing-lg);
    max-height: 2000px;
}

/* ===== TOOLTIP ===== */
.help-tooltip {
    position: relative;
    display: inline-block;
    margin-left: var(--spacing-xs);
}

.help-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: var(--info);
    color: var(--white);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    cursor: help;
}

.help-text-tooltip {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--gray-800);
    color: var(--white);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    white-space: nowrap;
    max-width: 300px;
    z-index: var(--z-tooltip);
    transition: all var(--transition-fast);
}

.help-tooltip:hover .help-text-tooltip {
    visibility: visible;
    opacity: 1;
}

/* ===== UTILITÁRIOS ===== */
.hidden { display: none !important; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }
.font-bold { font-weight: var(--font-bold); }
.font-semibold { font-weight: var(--font-semibold); }
.font-normal { font-weight: var(--font-normal); }

.mt-1 { margin-top: var(--spacing-sm); }
.mt-2 { margin-top: var(--spacing-md); }
.mt-3 { margin-top: var(--spacing-lg); }
.mb-1 { margin-bottom: var(--spacing-sm); }
.mb-2 { margin-bottom: var(--spacing-md); }
.mb-3 { margin-bottom: var(--spacing-lg); }
```

---

## 🧩 PARTE 2: JAVASCRIPT FRAMEWORK

### Estrutura Modular do PMOFramework

```javascript
/**
 * PMO Framework v1.0.0
 * Sistema Unificado de Componentes para Formulários PMO
 *
 * Arquitetura: Module Pattern (IIFE)
 * Compatibilidade: ES6+ (Chrome 51+, Firefox 54+, Safari 10+)
 * Dependências: Nenhuma
 */

const PMOFramework = (function() {
    'use strict';

    // ===== CONFIGURAÇÃO =====
    const CONFIG = {
        AUTO_SAVE_INTERVAL: 30000,  // 30 segundos
        MAX_FILE_SIZE: 10,          // 10 MB
        STORAGE_PREFIX: 'pmo_',
        DEBUG: true
    };

    // ===== MÓDULO CORE =====
    const Core = {
        version: '1.0.0',

        init() {
            this.log('Inicializando PMO Framework v' + this.version);
            this.setupEventListeners();
            this.initializeComponents();
            this.loadSavedData();
        },

        setupEventListeners() {
            // Auto-save
            setInterval(() => Storage.autoSave(), CONFIG.AUTO_SAVE_INTERVAL);

            // Prevenir perda de dados
            window.addEventListener('beforeunload', (e) => {
                if (Storage.hasUnsavedChanges()) {
                    e.preventDefault();
                    e.returnValue = 'Existem alterações não salvas. Deseja sair?';
                }
            });

            // Marcar mudanças nos campos
            document.addEventListener('change', (e) => {
                if (e.target.matches('input, select, textarea')) {
                    Storage.markAsChanged();
                }
            });
        },

        initializeComponents() {
            Validators.initMasks();
            DynamicFields.init();
            Upload.init();
            Progress.calculate();
            Tabs.init();
            Accordion.init();
        },

        loadSavedData() {
            Storage.loadSavedData();
        },

        log(...args) {
            if (CONFIG.DEBUG) {
                console.log('[PMOFramework]', ...args);
            }
        },

        error(...args) {
            console.error('[PMOFramework ERROR]', ...args);
        }
    };

    // ===== MÓDULO VALIDATORS =====
    const Validators = {
        /**
         * Validar CPF
         */
        cpf(value) {
            const cpf = value.replace(/\D/g, '');

            if (cpf.length !== 11) return false;
            if (/^(\d)\1{10}$/.test(cpf)) return false;

            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let rev = 11 - (sum % 11);
            if (rev === 10 || rev === 11) rev = 0;
            if (rev !== parseInt(cpf.charAt(9))) return false;

            sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += parseInt(cpf.charAt(i)) * (11 - i);
            }
            rev = 11 - (sum % 11);
            if (rev === 10 || rev === 11) rev = 0;
            if (rev !== parseInt(cpf.charAt(10))) return false;

            return true;
        },

        /**
         * Validar CNPJ
         */
        cnpj(value) {
            const cnpj = value.replace(/\D/g, '');

            if (cnpj.length !== 14) return false;
            if (/^(\d)\1{13}$/.test(cnpj)) return false;

            let length = cnpj.length - 2;
            let numbers = cnpj.substring(0, length);
            let digits = cnpj.substring(length);
            let sum = 0;
            let pos = length - 7;

            for (let i = length; i >= 1; i--) {
                sum += numbers.charAt(length - i) * pos--;
                if (pos < 2) pos = 9;
            }

            let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
            if (result !== parseInt(digits.charAt(0))) return false;

            length = length + 1;
            numbers = cnpj.substring(0, length);
            sum = 0;
            pos = length - 7;

            for (let i = length; i >= 1; i--) {
                sum += numbers.charAt(length - i) * pos--;
                if (pos < 2) pos = 9;
            }

            result = sum % 11 < 2 ? 0 : 11 - sum % 11;
            if (result !== parseInt(digits.charAt(1))) return false;

            return true;
        },

        /**
         * Validar Email
         */
        email(value) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(value);
        },

        /**
         * Validar CEP
         */
        cep(value) {
            const cep = value.replace(/\D/g, '');
            return cep.length === 8;
        },

        /**
         * Validar Telefone
         */
        telefone(value) {
            const tel = value.replace(/\D/g, '');
            return tel.length >= 10 && tel.length <= 11;
        },

        /**
         * Validar Coordenadas Geográficas (Brasil)
         */
        coordenadas(lat, lon) {
            const latNum = parseFloat(lat);
            const lonNum = parseFloat(lon);

            if (latNum < -33.75 || latNum > 5.27) return false;
            if (lonNum < -73.99 || lonNum > -34.79) return false;

            return true;
        },

        /**
         * Validar Idade Mínima
         */
        idadeMinima(dataNascimento, minIdade = 18) {
            const nascimento = new Date(dataNascimento);
            const hoje = new Date();
            const idade = Math.floor((hoje - nascimento) / (365.25 * 24 * 60 * 60 * 1000));
            return idade >= minIdade;
        },

        /**
         * Inicializar máscaras automáticas
         */
        initMasks() {
            document.querySelectorAll('[data-mask]').forEach(input => {
                const mask = input.dataset.mask;
                input.addEventListener('input', (e) => {
                    e.target.value = this.applyMask(e.target.value, mask);
                });
            });
        },

        /**
         * Aplicar máscara específica
         */
        applyMask(value, type) {
            const masks = {
                cpf: (v) => v.replace(/\D/g, '')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                    .replace(/(-\d{2})\d+?$/, '$1'),

                cnpj: (v) => v.replace(/\D/g, '')
                    .replace(/(\d{2})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1/$2')
                    .replace(/(\d{4})(\d)/, '$1-$2')
                    .replace(/(-\d{2})\d+?$/, '$1'),

                cep: (v) => v.replace(/\D/g, '')
                    .replace(/(\d{5})(\d)/, '$1-$2')
                    .replace(/(-\d{3})\d+?$/, '$1'),

                telefone: (v) => {
                    v = v.replace(/\D/g, '');
                    if (v.length <= 10) {
                        return v.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
                    } else {
                        return v.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
                    }
                }
            };

            return masks[type] ? masks[type](value) : value;
        }
    };

    // ===== MÓDULO DYNAMIC FIELDS =====
    const DynamicFields = {
        init() {
            document.querySelectorAll('[data-dynamic]').forEach(container => {
                this.setupDynamic(container);
            });
        },

        setupDynamic(container) {
            const min = parseInt(container.dataset.min) || 1;
            const max = parseInt(container.dataset.max) || 999;

            container.dataset.count = container.querySelectorAll('.dynamic-row').length || 1;
            this.updateButtons(container, min, max);
        },

        add(containerId, template) {
            const container = document.getElementById(containerId);
            const count = parseInt(container.dataset.count) || 0;
            const max = parseInt(container.dataset.max) || 999;

            if (count >= max) {
                UI.showMessage(`Máximo de ${max} itens permitidos`, 'warning');
                return;
            }

            const newRow = template.cloneNode(true);
            newRow.querySelectorAll('input, select, textarea').forEach(field => {
                field.value = '';
                if (field.name) {
                    field.name = field.name.replace('[]', `[${count}]`);
                }
            });

            container.appendChild(newRow);
            container.dataset.count = count + 1;

            this.updateButtons(container);
            Progress.calculate();
        },

        remove(button) {
            const container = button.closest('[data-dynamic]');
            const min = parseInt(container.dataset.min) || 1;
            const count = parseInt(container.dataset.count) || 0;

            if (count <= min) {
                UI.showMessage(`Mínimo de ${min} item(s) obrigatório(s)`, 'warning');
                return;
            }

            button.closest('.dynamic-row').remove();
            container.dataset.count = count - 1;

            this.updateButtons(container);
            Progress.calculate();
        },

        updateButtons(container) {
            const count = parseInt(container.dataset.count) || 0;
            const min = parseInt(container.dataset.min) || 1;
            const max = parseInt(container.dataset.max) || 999;

            const addBtn = container.querySelector('.btn-add-dynamic');
            if (addBtn) {
                addBtn.disabled = count >= max;
            }

            container.querySelectorAll('.btn-remove-dynamic').forEach(btn => {
                btn.disabled = count <= min;
            });
        }
    };

    // Continua nos próximos comentários devido ao limite de caracteres...

    // ===== API PÚBLICA =====
    return {
        version: Core.version,
        init: () => Core.init(),
        validators: Validators,
        dynamic: DynamicFields,
        // ... outros módulos
    };
})();

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    PMOFramework.init();
});

// Expor globalmente
window.PMOFramework = PMOFramework;
```

---

## 📝 PRÓXIMOS PASSOS

1. Implementar módulos restantes (Table, Upload, Storage, Progress, Export, etc.)
2. Criar testes unitários para cada módulo
3. Minificar CSS e JS para produção
4. Documentar cada função com JSDoc
5. Criar exemplos de uso para cada componente

---

## ✅ CHECKLIST DE DESENVOLVIMENTO

- [ ] Todos os módulos implementados
- [ ] Testes unitários escritos
- [ ] Documentação JSDoc completa
- [ ] Minificação funcionando
- [ ] Compatibilidade cross-browser testada
- [ ] Performance otimizada
- [ ] Sem dependências externas
- [ ] Funciona offline
- [ ] Acessível (WCAG AA)
- [ ] Responsivo (mobile, tablet, desktop)