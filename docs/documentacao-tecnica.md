# Documentação Técnica - Sistema PMO Digital

> Guia técnico completo para desenvolvedores que trabalham ou contribuem com o sistema

## Índice

1. [Arquitetura do Sistema](#arquitetura-do-sistema)
2. [Tecnologias e Dependências](#tecnologias-e-dependências)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Componentes Principais](#componentes-principais)
5. [Armazenamento de Dados](#armazenamento-de-dados)
6. [APIs e Integrações](#apis-e-integrações)
7. [Sistema de Validação](#sistema-de-validação)
8. [Fluxo de Dados](#fluxo-de-dados)
9. [Desenvolvimento Local](#desenvolvimento-local)
10. [Deploy e Produção](#deploy-e-produção)
11. [Testes](#testes)
12. [Performance e Otimização](#performance-e-otimização)
13. [Segurança](#segurança)
14. [Contribuindo](#contribuindo)

---

## Arquitetura do Sistema

### Visão Geral

O Sistema PMO Digital é uma aplicação **frontend-first** com arquitetura **offline-first**, utilizando localStorage para persistência de dados.

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (SPA)                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Camada de Apresentação                   │  │
│  │  HTML5 + CSS3 + JavaScript ES6+                    │  │
│  └───────────────────────────────────────────────────┘  │
│                           │                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Camada de Lógica de Negócio               │  │
│  │  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │ PMOStorage   │  │ PMOScope     │               │  │
│  │  │ Manager      │  │ Manager      │               │  │
│  │  └──────────────┘  └──────────────┘               │  │
│  │  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │ Validators   │  │ Progress     │               │  │
│  │  │              │  │ Tracker      │               │  │
│  │  └──────────────┘  └──────────────┘               │  │
│  └───────────────────────────────────────────────────┘  │
│                           │                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │          Camada de Persistência                    │  │
│  │         localStorage (Browser)                     │  │
│  └───────────────────────────────────────────────────┘  │
│                           │                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │        Camada de Integração (APIs)                 │  │
│  │  ViaCEP │ BrasilAPI (futuro) │ Backend (futuro)   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Padrões Arquiteturais

**1. MVC Adaptado**
- **Model**: Classes de gerenciamento (PMOStorageManager, PMOScopeManager)
- **View**: HTML + CSS
- **Controller**: JavaScript event handlers + lógica de negócio

**2. Component-Based**
- Componentes reutilizáveis (tabelas dinâmicas, upload, validadores)
- Framework próprio modular

**3. Offline-First**
- Todos dados armazenados localmente primeiro
- Sincronização cloud é opcional (futuro)

**4. Progressive Enhancement**
- Funciona sem JavaScript (validação HTML5)
- JavaScript adiciona features avançadas

---

## Tecnologias e Dependências

### Core Technologies

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| HTML5 | - | Estrutura semântica, validação nativa |
| CSS3 | - | Estilos, animações, responsive design |
| JavaScript | ES6+ | Lógica de negócio, interatividade |

### APIs JavaScript Utilizadas

**Storage APIs:**
- `localStorage`: Persistência de dados
- `IndexedDB`: (futuro) Para arquivos grandes

**File APIs:**
- `FileReader`: Leitura de arquivos
- `Blob`: Manipulação de binários
- `Base64`: Encoding de arquivos

**Modern JavaScript Features:**
- Classes (ES6)
- Modules (ES6)
- Promises & Async/Await
- Arrow Functions
- Template Literals
- Destructuring
- Spread/Rest Operators

### Bibliotecas Externas

**Planejadas (não implementadas ainda):**
- PDF-lib: Geração de PDF
- html2canvas: Screenshots de formulários
- Chart.js: Gráficos de relatórios

### APIs Externas

**ViaCEP** (implementado):
```javascript
https://viacep.com.br/ws/{cep}/json/
```

**BrasilAPI** (planejado):
```javascript
https://brasilapi.com.br/api/cnpj/v1/{cnpj}
```

---

## Estrutura de Arquivos

### Árvore de Diretórios

```
formulario/
├── index.html                          # Página inicial
├── README.md                           # Documentação principal
├── DOCUMENTACAO-SISTEMA-PMO.md         # Doc completa (legado)
│
├── docs/                               # Documentação estruturada
│   ├── README.md                       # Visão geral
│   ├── guia-usuario.md                 # Para produtores
│   ├── guia-avaliador.md               # Para avaliadores
│   ├── documentacao-tecnica.md         # Este arquivo
│   ├── faq.md                          # FAQ
│   ├── troubleshooting.md              # Problemas comuns
│   ├── changelog.md                    # Histórico
│   └── images/                         # Screenshots, diagramas
│
├── framework/                          # Framework reutilizável
│   ├── core/                           # Arquivos compilados
│   │   ├── pmo-framework.css           # CSS compilado
│   │   └── pmo-framework.js            # JS compilado
│   │
│   ├── styles/                         # CSS modular
│   │   ├── _variables.css              # Variáveis de design
│   │   ├── _base.css                   # Reset e base
│   │   ├── _components.css             # Componentes UI
│   │   ├── _utilities.css              # Utilitários
│   │   ├── _responsive.css             # Media queries
│   │   └── _print.css                  # Impressão
│   │
│   ├── components/                     # Componentes JS
│   │   ├── pmo-storage-manager.js      # Gerenciador storage
│   │   ├── pmo-tables.js               # Tabelas dinâmicas
│   │   ├── scope-manager.js            # Gerenciador escopo
│   │   ├── progress-tracker.js         # Rastreador progresso
│   │   ├── flow-navigator.js           # Navegação formulários
│   │   ├── validators.js               # Validações
│   │   ├── storage.js                  # Utilitários localStorage
│   │   ├── upload.js                   # Upload de arquivos
│   │   ├── notifications.js            # Notificações
│   │   └── export.js                   # Exportação
│   │
│   ├── utils/                          # Utilitários
│   │   ├── formatters.js               # Formatação de dados
│   │   ├── constants.js                # Constantes
│   │   ├── date-helpers.js             # Datas
│   │   └── api-client.js               # Cliente HTTP
│   │
│   └── README.md                       # Doc do framework
│
├── pmo/                                # Módulos do sistema
│   ├── painel/                         # Painel gerenciamento
│   │   ├── index.html
│   │   ├── painel.js
│   │   └── painel.css
│   │
│   ├── cadastro-geral-pmo/             # Form principal
│   │   ├── index.html
│   │   ├── cadastro-geral-pmo.js
│   │   ├── validation-rules.js
│   │   └── README.md
│   │
│   ├── anexo-vegetal/                  # Anexo vegetal
│   │   ├── index.html
│   │   ├── vegetal.js
│   │   ├── vegetal-validators.js
│   │   └── README.md
│   │
│   ├── anexo-animal/                   # Anexo animal
│   ├── anexo-cogumelo/                 # Anexo cogumelo
│   ├── anexo-apicultura/               # Anexo apicultura
│   ├── anexo-processamento/            # Anexo processamento
│   ├── anexo-processamentominimo/      # Proc. mínimo
│   │
│   ├── avaliacao/                      # Módulo avaliação
│   │   ├── index.html
│   │   └── avaliacao.js
│   │
│   └── relatorios/                     # Relatórios
│       ├── index.html
│       ├── visualizar.html
│       ├── exportar.html
│       └── relatorios.js
│
└── config/                             # Configurações (futuro)
    ├── routes.config.js
    ├── validation.config.js
    ├── storage.config.js
    └── app.config.js
```

### Convenções de Nomenclatura

**Arquivos:**
- HTML: `kebab-case.html`
- CSS: `kebab-case.css`
- JavaScript: `kebab-case.js`
- Classes JS: `PascalCase`

**Variáveis:**
- Constantes: `UPPER_SNAKE_CASE`
- Funções/métodos: `camelCase`
- Classes: `PascalCase`
- IDs HTML: `kebab-case`
- Classes CSS: `kebab-case`

---

## Componentes Principais

### 1. PMOStorageManager

**Responsabilidade**: Gerenciar múltiplos PMOs com IDs únicos

**Localização**: `framework/components/pmo-storage-manager.js`

**Estrutura de Classe**:

```javascript
class PMOStorageManager {
  constructor() {
    this.registryKey = 'pmo_registry';
    this.init();
  }

  // Inicialização
  init() { }

  // CRUD Operations
  createPMO(dados) → String
  getPMO(id) → Object
  updateFormulario(id, formularioNome, dados) → Boolean
  getFormulario(id, formularioNome) → Object
  deletePMO(id) → Boolean

  // Registry Management
  setActivePMO(id) → Boolean
  getActivePMO() → Object
  listAllPMOs() → Array

  // Progress Management
  updateProgresso(id, formularioNome, percentual) → Boolean
  getProgresso(id) → Object

  // Utilities
  migrateOldData() → void
  exportPMO(id) → Object
  importPMO(jsonData) → Boolean
}
```

**Métodos Principais**:

#### `createPMO(dados)`
```javascript
/**
 * Cria novo PMO com ID único
 * @param {Object} dados - { cpf_cnpj, nome, unidade, ano, grupo_spg }
 * @returns {String} ID do PMO criado
 */
createPMO(dados) {
  const id = this.generateID(dados);
  const pmo = {
    id: id,
    cpf_cnpj: dados.cpf_cnpj,
    nome: dados.nome,
    unidade: dados.unidade,
    grupo_spg: dados.grupo_spg || 'ANC',
    ano_vigente: dados.ano || new Date().getFullYear(),
    versao: '1.0',
    data_criacao: new Date().toISOString(),
    data_modificacao: new Date().toISOString(),
    status: 'rascunho',
    progresso: {},
    formularios_ativos: ['cadastro-geral-pmo']
  };

  // Adiciona ao registry
  this.addToRegistry(pmo);

  // Inicializa storage do PMO
  this.initPMOStorage(id);

  return id;
}
```

#### `getPMO(id)`
```javascript
/**
 * Obtém PMO completo por ID
 * @param {String} id - ID do PMO
 * @returns {Object} Dados completos do PMO
 */
getPMO(id) {
  const registry = this.getRegistry();
  const pmoMeta = registry.pmos.find(p => p.id === id);

  if (!pmoMeta) return null;

  const dataKey = `${id}_data`;
  const data = JSON.parse(localStorage.getItem(dataKey) || '{}');

  return {
    ...pmoMeta,
    dados: data
  };
}
```

#### `updateFormulario(id, formularioNome, dados)`
```javascript
/**
 * Atualiza formulário específico de um PMO
 * @param {String} id - ID do PMO
 * @param {String} formularioNome - Nome do formulário
 * @param {Object} dados - Dados do formulário
 * @returns {Boolean} Sucesso
 */
updateFormulario(id, formularioNome, dados) {
  const dataKey = `${id}_data`;
  const pmoData = JSON.parse(localStorage.getItem(dataKey) || '{}');

  pmoData[formularioNome] = dados;

  localStorage.setItem(dataKey, JSON.stringify(pmoData));

  // Atualiza timestamp
  this.updateTimestamp(id);

  return true;
}
```

**Estrutura de Dados**:

```javascript
// Registry (pmo_registry)
{
  current_pmo_id: "pmo_2025_12345678900_sitio-exemplo",
  pmos: [
    {
      id: "pmo_2025_12345678900_sitio-exemplo",
      cpf_cnpj: "123.456.789-00",
      nome: "João da Silva",
      unidade: "Sítio Exemplo",
      grupo_spg: "ANC",
      ano_vigente: 2025,
      versao: "1.0",
      data_criacao: "2025-01-30T10:00:00Z",
      data_modificacao: "2025-01-30T14:30:00Z",
      status: "rascunho",
      progresso: {
        "cadastro-geral-pmo": 85,
        "anexo-vegetal": 60,
        "total": 72
      },
      formularios_ativos: [
        "cadastro-geral-pmo",
        "anexo-vegetal"
      ]
    }
  ]
}

// Dados do PMO (pmo_2025_12345678900_sitio-exemplo_data)
{
  cadastro_geral_pmo: {
    identificacao: { ... },
    contato: { ... },
    endereco: { ... },
    // ... todas seções
  },
  anexo_vegetal: {
    culturas: [ ... ],
    calendario: [ ... ],
    // ... todas seções
  },
  documentos_anexados: {
    "croqui.pdf": "data:application/pdf;base64,...",
    "car.pdf": "data:application/pdf;base64,..."
  },
  pdfs_gerados: {
    "cadastro-geral-pmo": "base64..."
  }
}
```

### 2. PMOScopeManager

**Responsabilidade**: Gerenciar escopo de atividades e habilitar formulários

**Localização**: `framework/components/scope-manager.js`

**Estrutura**:

```javascript
class PMOScopeManager {
  constructor() {
    this.scopeKey = 'pmo_scope_activities';
    this.activityFormMap = {
      'escopo_hortalicas': 'anexo-vegetal',
      'escopo_frutas': 'anexo-vegetal',
      'escopo_graos': 'anexo-vegetal',
      'escopo_medicinais': 'anexo-vegetal',
      'escopo_cogumelos': 'anexo-cogumelo',
      'escopo_pecuaria': 'anexo-animal',
      'escopo_apicultura': 'anexo-apicultura',
      'escopo_processamento': 'anexo-processamento',
      'escopo_proc_minimo': 'anexo-processamentominimo'
    };
  }

  // Principais métodos
  saveActivities(activities, pretendeCertificar) → void
  getActivities() → Object
  getRequiredAnexos() → Array<String>
  isAnexoRequired(anexoNome) → Boolean
  updateAnexoProgress(anexoNome, percentage) → void
  onScopeChanged() → void (callback)
}
```

**Uso**:

```javascript
// Salvar atividades selecionadas
const activities = {
  escopo_hortalicas: true,
  escopo_frutas: true,
  escopo_apicultura: true
};
scopeManager.saveActivities(activities, true);

// Obter anexos necessários
const anexos = scopeManager.getRequiredAnexos();
// Retorna: ['anexo-vegetal', 'anexo-apicultura']

// Verificar se anexo é necessário
if (scopeManager.isAnexoRequired('anexo-vegetal')) {
  // Mostrar no menu
}
```

### 3. Validators

**Responsabilidade**: Validações de CPF, CNPJ, e-mail, etc.

**Localização**: `framework/components/validators.js`

**Funções Principais**:

```javascript
/**
 * Valida CPF brasileiro
 * @param {String} cpf - CPF com ou sem formatação
 * @returns {Boolean}
 */
function validateCPF(cpf) {
  // Remove formatação
  cpf = cpf.replace(/[^\d]/g, '');

  // Verifica tamanho
  if (cpf.length !== 11) return false;

  // Verifica dígitos repetidos
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Valida dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

/**
 * Valida CNPJ brasileiro
 * @param {String} cnpj - CNPJ com ou sem formatação
 * @returns {Boolean}
 */
function validateCNPJ(cnpj) {
  // Remove formatação
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica tamanho
  if (cnpj.length !== 14) return false;

  // Verifica dígitos repetidos
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Valida primeiro dígito
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0)) return false;

  // Valida segundo dígito
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(1)) return false;

  return true;
}

/**
 * Valida e-mail
 * @param {String} email
 * @returns {Boolean}
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida coordenadas GPS do Brasil
 * @param {Number} lat - Latitude
 * @param {Number} lng - Longitude
 * @returns {Object} { valido: Boolean, erro: String }
 */
function validateGPS(lat, lng) {
  lat = parseFloat(lat);
  lng = parseFloat(lng);

  // Brasil: aprox. -33° a 5° lat, -73° a -34° lng
  if (lat < -35 || lat > 6) {
    return {
      valido: false,
      erro: 'Latitude fora dos limites do Brasil'
    };
  }

  if (lng < -75 || lng > -30) {
    return {
      valido: false,
      erro: 'Longitude fora dos limites do Brasil'
    };
  }

  return { valido: true };
}
```

### 4. PMOTables (Tabelas Dinâmicas)

**Responsabilidade**: Gerenciar tabelas com adicionar/remover linhas

**Localização**: `framework/components/pmo-tables.js`

**Estrutura**:

```javascript
class PMOTables {
  /**
   * Adiciona nova linha à tabela
   * @param {String} tableId - ID da tabela
   * @param {String} template - HTML template da linha
   */
  static addRow(tableId, template) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    const newRow = document.createElement('tr');
    newRow.innerHTML = template;
    tbody.appendChild(newRow);
    this.updateRowNumbers(tableId);
  }

  /**
   * Remove linha da tabela
   * @param {HTMLElement} button - Botão que foi clicado
   */
  static removeRow(button) {
    const row = button.closest('tr');
    const table = row.closest('table');
    row.remove();
    this.updateRowNumbers(table.id);
  }

  /**
   * Atualiza numeração das linhas
   * @param {String} tableId
   */
  static updateRowNumbers(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach((row, index) => {
      const numberCell = row.querySelector('.row-number');
      if (numberCell) {
        numberCell.textContent = index + 1;
      }
    });
  }

  /**
   * Obtém dados da tabela
   * @param {String} tableId
   * @returns {Array<Object>}
   */
  static getTableData(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    const data = [];

    rows.forEach(row => {
      const rowData = {};
      const inputs = row.querySelectorAll('input, select, textarea');

      inputs.forEach(input => {
        if (input.name) {
          rowData[input.name] = input.value;
        }
      });

      data.push(rowData);
    });

    return data;
  }

  /**
   * Popula tabela com dados
   * @param {String} tableId
   * @param {Array<Object>} data
   */
  static populateTable(tableId, data) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = ''; // Limpa tabela

    data.forEach(rowData => {
      // Cria linha baseada em template
      // Preenche com dados
      // Adiciona à tabela
    });

    this.updateRowNumbers(tableId);
  }
}
```

### 5. ProgressTracker

**Responsabilidade**: Calcular e atualizar progresso de preenchimento

**Localização**: `framework/components/progress-tracker.js`

**Lógica**:

```javascript
class ProgressTracker {
  /**
   * Calcula progresso de um formulário
   * @param {String} formularioNome
   * @returns {Number} Percentual (0-100)
   */
  static calculateProgress(formularioNome) {
    const form = document.querySelector('form');
    if (!form) return 0;

    // Obtém campos obrigatórios
    const requiredFields = form.querySelectorAll('[required]');
    if (requiredFields.length === 0) return 100;

    // Conta preenchidos
    let filled = 0;
    requiredFields.forEach(field => {
      if (this.isFieldFilled(field)) {
        filled++;
      }
    });

    // Calcula percentual
    const percentage = Math.round((filled / requiredFields.length) * 100);

    return percentage;
  }

  /**
   * Verifica se campo está preenchido
   * @param {HTMLElement} field
   * @returns {Boolean}
   */
  static isFieldFilled(field) {
    if (field.type === 'checkbox' || field.type === 'radio') {
      return field.checked;
    }

    if (field.tagName === 'SELECT') {
      return field.value !== '' && field.value !== null;
    }

    return field.value.trim() !== '';
  }

  /**
   * Atualiza UI do progresso
   * @param {Number} percentage
   */
  static updateProgressUI(percentage) {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }

    if (progressText) {
      progressText.textContent = `${percentage}% Completo`;
    }

    // Atualiza cor baseado em progresso
    this.updateProgressColor(percentage);
  }

  /**
   * Atualiza cor da barra de progresso
   * @param {Number} percentage
   */
  static updateProgressColor(percentage) {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    progressBar.classList.remove('low', 'medium', 'high');

    if (percentage < 40) {
      progressBar.classList.add('low'); // Vermelho
    } else if (percentage < 80) {
      progressBar.classList.add('medium'); // Amarelo
    } else {
      progressBar.classList.add('high'); // Verde
    }
  }
}
```

---

## Armazenamento de Dados

### localStorage Structure

**Chaves Principais**:

```javascript
// 1. Registry (índice de todos PMOs)
'pmo_registry': {
  current_pmo_id: String,
  pmos: Array<PMOMeta>
}

// 2. Dados de cada PMO
'pmo_{id}_data': {
  cadastro_geral_pmo: Object,
  anexo_vegetal: Object,
  anexo_animal: Object,
  // ... outros formulários
  documentos_anexados: Object,
  pdfs_gerados: Object
}

// 3. Escopo de atividades (por PMO)
'pmo_{id}_scope': {
  pretende_certificar: Boolean,
  activities: Object,
  lastUpdated: String
}
```

### Capacidade e Limitações

**localStorage**:
- **Limite típico**: 5-10MB por domínio
- **Varia por navegador**:
  - Chrome: ~10MB
  - Firefox: ~10MB
  - Safari: ~5MB
  - Edge: ~10MB

**Base64 Overhead**:
- Arquivos em Base64 aumentam ~33%
- Arquivo de 1MB → ~1.33MB em Base64

**Recomendações**:
- Limitar uploads a 10MB total
- Comprimir PDFs antes de subir
- Usar IndexedDB para arquivos grandes (futuro)

### Exemplo de Uso

```javascript
// Criar PMO
const manager = new PMOStorageManager();
const pmoId = manager.createPMO({
  cpf_cnpj: '123.456.789-00',
  nome: 'João da Silva',
  unidade: 'Sítio Exemplo',
  ano: 2025
});

// Salvar dados de formulário
manager.updateFormulario(pmoId, 'cadastro-geral-pmo', {
  identificacao: {
    cpf_cnpj: '123.456.789-00',
    nome: 'João da Silva',
    // ... mais campos
  }
});

// Atualizar progresso
manager.updateProgresso(pmoId, 'cadastro-geral-pmo', 85);

// Obter PMO completo
const pmo = manager.getPMO(pmoId);

// Listar todos
const all = manager.listAllPMOs();

// Exportar para JSON
const json = manager.exportPMO(pmoId);
```

---

## APIs e Integrações

### ViaCEP API

**Endpoint**: `https://viacep.com.br/ws/{cep}/json/`

**Uso**:

```javascript
async function buscarCEP(cep) {
  // Remove formatação
  cep = cep.replace(/\D/g, '');

  // Valida formato
  if (cep.length !== 8) {
    throw new Error('CEP inválido');
  }

  // Faz requisição
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

  if (!response.ok) {
    throw new Error('Erro ao buscar CEP');
  }

  const data = await response.json();

  // Verifica se CEP existe
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  return {
    logradouro: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf,
    cep: data.cep
  };
}

// Uso
try {
  const endereco = await buscarCEP('13087-280');
  document.getElementById('logradouro').value = endereco.logradouro;
  document.getElementById('bairro').value = endereco.bairro;
  document.getElementById('cidade').value = endereco.cidade;
  document.getElementById('estado').value = endereco.estado;
} catch (error) {
  alert(error.message);
}
```

### BrasilAPI (Planejado)

**Endpoint CNPJ**: `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`

**Uso futuro**:

```javascript
async function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, '');

  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
  const data = await response.json();

  return {
    razao_social: data.razao_social,
    nome_fantasia: data.nome_fantasia,
    situacao: data.situacao_cadastral,
    atividade_principal: data.cnae_fiscal_descricao
  };
}
```

---

## Sistema de Validação

### Níveis de Validação

**1. HTML5 Nativo**:
- `required`: Campos obrigatórios
- `type="email"`: Validação de e-mail
- `pattern`: Regex customizado
- `min`, `max`: Valores numéricos

**2. JavaScript Custom**:
- CPF/CNPJ: Algoritmo de validação
- GPS: Limites do Brasil
- Período conversão: Datas
- Tabelas: Mínimo de linhas

**3. Validação de Negócio**:
- Conformidade com legislação
- Coerência entre seções
- Completude de informações

### Estrutura de Validação

```javascript
// validation-rules.js

const ValidationRules = {
  /**
   * Valida seção completa
   * @param {String} secaoNome
   * @param {Object} dados
   * @returns {Object} { erros: [], avisos: [] }
   */
  validateSecao(secaoNome, dados) {
    const result = {
      erros: [],
      avisos: []
    };

    switch(secaoNome) {
      case 'identificacao':
        return this.validateIdentificacao(dados);
      case 'preservacao_ambiental':
        return this.validatePreservacao(dados);
      // ... outras seções
    }

    return result;
  },

  /**
   * Valida identificação
   */
  validateIdentificacao(dados) {
    const result = { erros: [], avisos: [] };

    // CPF/CNPJ
    if (!dados.cpf_cnpj) {
      result.erros.push('CPF/CNPJ é obrigatório');
    } else {
      const tipo = dados.cpf_cnpj.replace(/\D/g, '').length === 11 ? 'cpf' : 'cnpj';
      const valido = tipo === 'cpf' ? validateCPF(dados.cpf_cnpj) : validateCNPJ(dados.cpf_cnpj);

      if (!valido) {
        result.erros.push(`${tipo.toUpperCase()} inválido`);
      }
    }

    // Nome
    if (!dados.nome || dados.nome.trim().length < 3) {
      result.erros.push('Nome completo é obrigatório (mínimo 3 caracteres)');
    }

    return result;
  },

  /**
   * Valida preservação ambiental
   */
  validatePreservacao(dados) {
    const result = { erros: [], avisos: [] };

    // CAR obrigatório
    if (!dados.car) {
      result.erros.push('CAR é obrigatório (Lei 12.651/2012)');
    }

    // CAR anexado (recomendado)
    if (!dados.car_anexado) {
      result.avisos.push('Recomenda-se anexar comprovante do CAR');
    }

    return result;
  },

  /**
   * Valida formulário completo
   * @param {String} formularioNome
   * @param {Object} dados
   * @returns {Object}
   */
  validateComplete(formularioNome, dados) {
    const result = {
      valido: true,
      erros: [],
      avisos: [],
      percentual: 0
    };

    // Valida cada seção
    Object.keys(dados).forEach(secaoNome => {
      const secaoResult = this.validateSecao(secaoNome, dados[secaoNome]);
      result.erros.push(...secaoResult.erros);
      result.avisos.push(...secaoResult.avisos);
    });

    // Define se é válido
    result.valido = result.erros.length === 0;

    // Calcula percentual
    result.percentual = ProgressTracker.calculateProgress(formularioNome);

    return result;
  }
};
```

### Relatório de Validação

```javascript
/**
 * Gera relatório de validação visual
 * @param {Object} validationResult
 */
function showValidationReport(validationResult) {
  const container = document.getElementById('validation-report');

  let html = '<div class="validation-report">';

  // Cabeçalho
  html += `<h3>Relatório de Validação</h3>`;
  html += `<p>Completude: ${validationResult.percentual}%</p>`;

  // Erros
  if (validationResult.erros.length > 0) {
    html += `<div class="errors">`;
    html += `<h4>❌ ERROS (${validationResult.erros.length})</h4>`;
    html += `<ul>`;
    validationResult.erros.forEach(erro => {
      html += `<li>${erro}</li>`;
    });
    html += `</ul></div>`;
  }

  // Avisos
  if (validationResult.avisos.length > 0) {
    html += `<div class="warnings">`;
    html += `<h4>⚠️ AVISOS (${validationResult.avisos.length})</h4>`;
    html += `<ul>`;
    validationResult.avisos.forEach(aviso => {
      html += `<li>${aviso}</li>`;
    });
    html += `</ul></div>`;
  }

  // Sucesso
  if (validationResult.valido) {
    html += `<div class="success">`;
    html += `<p>✅ Formulário válido! Pode enviar para avaliação.</p>`;
    html += `</div>`;
  }

  html += '</div>';

  container.innerHTML = html;
}
```

---

## Fluxo de Dados

### 1. Criar Novo PMO

```
User Action: Clica "Novo PMO"
    ↓
JavaScript: Abre modal
    ↓
User Input: Preenche CPF, Nome, Unidade
    ↓
JavaScript: Valida entrada
    ↓
PMOStorageManager.createPMO(dados)
    ↓
Gera ID único
    ↓
Salva no registry (localStorage)
    ↓
Inicializa storage do PMO
    ↓
Redireciona para formulário
```

### 2. Preencher Formulário

```
User Action: Preenche campos
    ↓
JavaScript: Event listeners (change, input)
    ↓
Auto-save timer (30s)
    ↓
getFormData()
    ↓
PMOStorageManager.updateFormulario(id, nome, dados)
    ↓
localStorage.setItem(...)
    ↓
ProgressTracker.calculateProgress()
    ↓
PMOStorageManager.updateProgresso(id, nome, percentual)
    ↓
UI atualizada (barra de progresso)
```

### 3. Selecionar Escopo

```
User Action: Marca atividades (Seção 7)
    ↓
JavaScript: Event listener onChange
    ↓
PMOScopeManager.saveActivities(activities)
    ↓
Calcula anexos necessários
    ↓
Atualiza registry (formularios_ativos)
    ↓
Atualiza menu de navegação
    ↓
Mostra apenas anexos necessários
```

### 4. Upload de Arquivo

```
User Action: Arrasta arquivo ou seleciona
    ↓
JavaScript: FileReader API
    ↓
Valida arquivo (tipo, tamanho)
    ↓
readAsDataURL(file)
    ↓
Converte para Base64
    ↓
PMOStorageManager.updateFormulario(id, nome, {
  documentos_anexados: {
    [filename]: base64Data
  }
})
    ↓
localStorage atualizado
    ↓
Preview gerado na UI
```

### 5. Validar PMO

```
User Action: Clica "Validar"
    ↓
JavaScript: Coleta todos dados
    ↓
ValidationRules.validateComplete(nome, dados)
    ↓
Valida cada seção
    ↓
Agrega erros e avisos
    ↓
Calcula percentual
    ↓
Gera relatório
    ↓
showValidationReport(result)
    ↓
UI mostra erros/avisos
```

### 6. Exportar JSON

```
User Action: Clica "Exportar JSON"
    ↓
JavaScript: PMOStorageManager.exportPMO(id)
    ↓
Coleta todos dados do PMO
    ↓
Adiciona metadata
    ↓
JSON.stringify(data, null, 2)
    ↓
Cria Blob
    ↓
Gera URL temporário
    ↓
Trigger download
    ↓
Arquivo baixado
```

---

## Desenvolvimento Local

### Requisitos

- **Navegador moderno**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Editor de código**: VS Code (recomendado)
- **Live Server** (extensão VS Code) ou HTTP server local

### Setup Inicial

1. **Clone ou baixe o repositório**

2. **Abra no VS Code**
   ```bash
   cd formulario
   code .
   ```

3. **Instale extensão Live Server**
   - No VS Code: Extensions → busque "Live Server"
   - Instale

4. **Inicie servidor local**
   - Clique com botão direito em `index.html`
   - Selecione "Open with Live Server"
   - Navegador abrirá automaticamente

### Estrutura de Desenvolvimento

```
Desenvolvimento
    ↓
Edita código
    ↓
Live Server recarrega automaticamente
    ↓
Testa no navegador
    ↓
Debug com DevTools
```

### DevTools Essenciais

**Console**:
```javascript
// Ver todos PMOs
const manager = new PMOStorageManager();
console.log(manager.listAllPMOs());

// Ver localStorage
console.log(localStorage);

// Limpar tudo
localStorage.clear();
```

**Application Tab**:
- Local Storage → Ver/editar dados
- Clear Storage → Limpar tudo

**Network Tab**:
- Ver chamadas à API (ViaCEP)
- Debug de requisições

### Debugging

**Adicionar breakpoints**:
```javascript
function createPMO(dados) {
  debugger; // Execução para aqui
  const id = this.generateID(dados);
  // ...
}
```

**Console logging**:
```javascript
console.log('Dados recebidos:', dados);
console.table(pmos); // Tabela bonita
console.error('Erro:', erro);
console.warn('Aviso:', aviso);
```

**Verificar eventos**:
```javascript
document.addEventListener('click', (e) => {
  console.log('Clicou em:', e.target);
});
```

---

## Deploy e Produção

### Opção 1: Hospedar Estaticamente

**GitHub Pages**:
1. Push para repositório GitHub
2. Settings → Pages
3. Source: main branch
4. URL: `https://usuario.github.io/repo`

**Netlify**:
1. Arraste pasta para Netlify Drop
2. Ou conecte repositório Git
3. Deploy automático

**Vercel**:
1. `vercel` na pasta
2. Deploy instantâneo

### Opção 2: Servidor Web

**Nginx**:
```nginx
server {
    listen 80;
    server_name pmo.anc.org.br;
    root /var/www/formulario;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache**:
```apache
<VirtualHost *:80>
    ServerName pmo.anc.org.br
    DocumentRoot /var/www/formulario

    <Directory /var/www/formulario>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Otimizações para Produção

**1. Minificar CSS/JS**:
```bash
# Usando terser para JS
npm install -g terser
terser input.js -o output.min.js -c -m

# Usando cssnano para CSS
npm install -g cssnano-cli
cssnano input.css output.min.css
```

**2. Comprimir Imagens**:
- Use TinyPNG ou similar
- Converta para WebP quando possível

**3. Habilitar Gzip**:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

**4. Cache Headers**:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**5. HTTPS**:
- Use Let's Encrypt para certificado gratuito
- Sempre use HTTPS em produção

---

## Testes

### Testes Manuais

**Checklist de Teste**:

- [ ] Criar novo PMO
- [ ] Preencher Cadastro Geral
- [ ] Selecionar escopo
- [ ] Preencher anexos
- [ ] Upload de arquivos
- [ ] Validação completa
- [ ] Exportar JSON
- [ ] Exportar PDF
- [ ] Editar PMO existente
- [ ] Deletar PMO
- [ ] Busca e filtros
- [ ] Progresso atualiza
- [ ] Auto-save funciona
- [ ] Offline funciona

### Testes Automatizados (Futuro)

**Framework sugerido**: Jest

```javascript
// pmo-storage-manager.test.js
describe('PMOStorageManager', () => {
  let manager;

  beforeEach(() => {
    localStorage.clear();
    manager = new PMOStorageManager();
  });

  test('deve criar PMO com ID único', () => {
    const id = manager.createPMO({
      cpf_cnpj: '123.456.789-00',
      nome: 'João',
      unidade: 'Sítio'
    });

    expect(id).toBeTruthy();
    expect(id).toMatch(/^pmo_\d{4}_\d+_.+$/);
  });

  test('deve salvar e recuperar PMO', () => {
    const id = manager.createPMO({
      cpf_cnpj: '123.456.789-00',
      nome: 'João',
      unidade: 'Sítio'
    });

    const pmo = manager.getPMO(id);

    expect(pmo).toBeTruthy();
    expect(pmo.nome).toBe('João');
  });
});
```

---

## Performance e Otimização

### Medição de Performance

```javascript
// Medir tempo de operação
console.time('createPMO');
const id = manager.createPMO(dados);
console.timeEnd('createPMO');

// Medir uso de memória
console.log(performance.memory);

// Marcar eventos
performance.mark('start-validation');
// ... código
performance.mark('end-validation');
performance.measure('validation', 'start-validation', 'end-validation');
```

### Otimizações Implementadas

**1. Debounce em Auto-save**:
```javascript
let saveTimer;
function autoSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveFormData();
  }, 2000); // 2s após última digitação
}
```

**2. Lazy Loading de Anexos**:
```javascript
// Só carrega anexo quando necessário
function loadAnexo(anexoNome) {
  if (!isAnexoRequired(anexoNome)) return;

  // Carrega HTML do anexo
  fetch(`pmo/anexo-${anexoNome}/index.html`)
    .then(response => response.text())
    .then(html => {
      document.getElementById('anexo-container').innerHTML = html;
    });
}
```

**3. Validação Incremental**:
```javascript
// Valida apenas seção alterada, não tudo
function validateSection(sectionName, data) {
  // Só valida essa seção
  return ValidationRules.validateSecao(sectionName, data);
}
```

### Limitações de localStorage

**Quando atingir limite**:
```javascript
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    alert('Armazenamento cheio! Exporte PMOs antigos e delete-os.');
    // Sugerir limpeza
  }
}
```

**Monitorar uso**:
```javascript
function getLocalStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024 / 1024).toFixed(2) + ' MB';
}

console.log('localStorage usage:', getLocalStorageSize());
```

---

## Segurança

### Considerações Atuais

**localStorage NÃO é seguro**:
- ❌ Dados em texto puro
- ❌ Acessível por qualquer script no domínio
- ❌ Vulnerável a XSS

**Mitigações**:
1. **Não armazene dados ultra-sensíveis** (senhas, cartões)
2. **Sanitize inputs** para prevenir XSS
3. **Use Content Security Policy**

### CSP (Content Security Policy)

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               connect-src 'self' https://viacep.com.br;">
```

### Sanitização de Inputs

```javascript
/**
 * Sanitiza string para prevenir XSS
 * @param {String} str
 * @returns {String}
 */
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Uso
const userInput = document.getElementById('nome').value;
const safe = sanitize(userInput);
```

### HTTPS Obrigatório

- Sempre use HTTPS em produção
- APIs externas devem ser HTTPS
- Mixed content (HTTP em página HTTPS) é bloqueado

---

## Contribuindo

### Como Contribuir

1. **Fork o repositório**
2. **Crie branch feature**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Faça commit das alterações**
   ```bash
   git commit -m "Adiciona nova funcionalidade X"
   ```
4. **Push para o branch**
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. **Abra Pull Request**

### Code Style

**JavaScript**:
```javascript
// Use camelCase
const minhaVariavel = 'valor';

// Funções descritivas
function calcularProgressoFormulario() {
  // ...
}

// Comentários úteis
/**
 * Calcula progresso do formulário
 * @param {String} formId - ID do formulário
 * @returns {Number} Percentual 0-100
 */
```

**HTML**:
```html
<!-- Use kebab-case para IDs -->
<div id="meu-componente">
  <!-- Indentação de 2 espaços -->
  <p>Conteúdo</p>
</div>
```

**CSS**:
```css
/* Use kebab-case para classes */
.meu-componente {
  /* Propriedades alfabéticas */
  background: #fff;
  color: #333;
  padding: 1rem;
}
```

### Commits

**Padrão de mensagens**:
```
tipo(escopo): descrição curta

Descrição mais longa se necessário.

Fixes #123
```

**Tipos**:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, estilos
- `refactor`: Refatoração de código
- `test`: Testes
- `chore`: Manutenção

**Exemplos**:
```
feat(storage): adiciona suporte a múltiplos PMOs

fix(validators): corrige validação de CNPJ

docs(readme): atualiza instruções de instalação
```

---

## Roadmap Técnico

### Curto Prazo

- [ ] Implementar testes automatizados (Jest)
- [ ] Adicionar CI/CD (GitHub Actions)
- [ ] Melhorar geração de PDF (PDF-lib)
- [ ] Adicionar TypeScript (gradualmente)

### Médio Prazo

- [ ] Backend REST API (Node.js + Express)
- [ ] Banco de dados (MongoDB)
- [ ] Autenticação (JWT)
- [ ] Sincronização cloud
- [ ] IndexedDB para arquivos grandes

### Longo Prazo

- [ ] PWA (Progressive Web App)
- [ ] Offline sync com service workers
- [ ] Websockets para colaboração real-time
- [ ] App mobile (React Native ou similar)

---

## Recursos Adicionais

### Documentação de Referência

- [MDN Web Docs](https://developer.mozilla.org/)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Ferramentas Úteis

- [VS Code](https://code.visualstudio.com/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [JSON Formatter](https://jsonformatter.org/)
- [Base64 Encoder/Decoder](https://www.base64encode.org/)

---

**Desenvolvido para ANC - Associação de Agricultura Natural de Campinas e Região**

*Versão 1.0.0 - Janeiro 2025*
