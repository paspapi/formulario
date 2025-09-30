# Prompt Universal para Criação de Formulários PMO - Sistema ANC

## 🎯 Objetivo
Este prompt serve como template universal para criação de qualquer formulário ou anexo do sistema PMO (Plano de Manejo Orgânico) da ANC, garantindo consistência, qualidade e conformidade com a legislação MAPA.

---

## ⚠️ REGRA CRÍTICA - INTEGRAÇÃO COM PMO PRINCIPAL

### 🔴 OBRIGATÓRIO para TODOS os anexos:
encoding UTF-8
Todos os formulários secundários (Anexo Vegetal, Anexo Animal, Anexo Cogumelos, etc.) **DEVEM** carregar automaticamente dados do PMO Principal na inicialização.

**Implementação obrigatória:**
```javascript
// Na função init() do módulo:
init() {
    console.log('Inicializando...');

    // ... outras inicializações ...

    // ⚠️ OBRIGATÓRIO: Carregar dados do PMO Principal
    this.loadPMOPrincipal();

    // ... resto da inicialização ...
}

// Função loadPMOPrincipal() - Ver seção "J) Integração com PMO Principal"
```

**Chave do localStorage:** `'pmo_principal_data'`

**Campos mínimos a preencher:**
- ✅ nome_fornecedor/nome_produtor
- ✅ nome_unidade_producao
- ✅ data_preenchimento
- ✅ grupo_spg

**Ver detalhes completos na seção "J) Integração com PMO Principal"**

**📖 Guia completo:** [`INTEGRACAO_PMO_PRINCIPAL.md`](./INTEGRACAO_PMO_PRINCIPAL.md)

---

## 📋 INSTRUÇÕES GERAIS

### Contexto Base
Você deve criar um formulário HTML5 responsivo e interativo para **[NOME DO FORMULÁRIO/ANEXO]** do Plano de Manejo Orgânico (PMO) da ANC - Associação de Agricultura Natural de Campinas e Região, seguindo rigorosamente a estrutura do documento original para certificação orgânica participativa conforme **Portaria 52/2021 do MAPA**.

### Requisitos Técnicos Obrigatórios

#### 1. Stack Tecnológico (Site Estático - GitHub Pages)
- **HTML5** semântico com tags apropriadas
- **CSS3** usando o framework unificado PMO (`framework/core/pmo-framework.css`)
- **JavaScript vanilla (ES6+)** usando PMO Framework (`framework/core/pmo-framework.js`)
- **Sem dependências externas** pesadas - apenas CDN quando necessário
- **Progressive Web App (PWA)** - funcionar offline após primeiro carregamento
- **Responsivo**: Desktop (1920px), Tablet (768px), Mobile (375px)

#### 2. Estrutura de Arquivos
```
anc/[nome-modulo]/
├── index.html              # Formulário principal
├── [nome-modulo].js        # Lógica específica do módulo
├── [nome-modulo].css       # Estilos específicos (se necessário)
├── validation-rules.js     # Regras de validação específicas
└── README.md              # Documentação do módulo
```

#### 3. Integração com Framework Unificado

**IMPORTANTE**: Sempre usar o PMO Framework global para funcionalidades comuns:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Nome do Formulário] - PMO ANC</title>

    <!-- Framework CSS Unificado -->
    <link rel="stylesheet" href="../../framework/core/pmo-framework.css">

    <!-- CSS Específico do Módulo (se necessário) -->
    <link rel="stylesheet" href="./[nome-modulo].css">
</head>
<body>
    <div class="pmo-container">
        <!-- Conteúdo do formulário -->
    </div>

    <!-- Framework JS Unificado -->
    <script src="../../framework/core/pmo-framework.js"></script>

    <!-- JS Específico do Módulo -->
    <script src="./[nome-modulo].js"></script>
</body>
</html>
```

#### 4. Funcionalidades Obrigatórias (usando PMO Framework)

##### A) Auto-Save com localStorage
```javascript
// Usar PMOFramework.storage
PMOFramework.storage.autoSave(); // Salva automaticamente a cada 30s

// Marcar mudanças
document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('change', () => {
        PMOFramework.storage.markAsChanged();
    });
});
```

##### B) Sistema de Validação
```javascript
// Usar PMOFramework.validators
const cpfValido = PMOFramework.validators.cpf(valorCPF);
const cnpjValido = PMOFramework.validators.cnpj(valorCNPJ);
const emailValido = PMOFramework.validators.email(valorEmail);

// Aplicar máscaras
<input type="text" data-mask="cpf" name="cpf">
<input type="text" data-mask="cnpj" name="cnpj">
<input type="text" data-mask="cep" name="cep">
<input type="text" data-mask="telefone" name="telefone">
```

##### C) Campos Dinâmicos (Adicionar/Remover)
```javascript
// Usar PMOFramework.dynamic
<div data-dynamic data-min="1" data-max="10" id="container-dinamico">
    <div class="dynamic-row">
        <!-- Campos -->
        <button onclick="PMOFramework.dynamic.remove(this)">❌</button>
    </div>
</div>
<button onclick="PMOFramework.dynamic.add('container-dinamico')">➕ Adicionar</button>
```

##### D) Tabelas Dinâmicas
```javascript
// Usar PMOFramework.table
<table id="tabela-produtos" class="dynamic-table">
    <tbody id="produtos-body"></tbody>
</table>
<button onclick="PMOFramework.table.addRow('tabela-produtos')">➕ Adicionar Linha</button>
<button onclick="PMOFramework.table.removeRow(this)">❌</button>
```

##### E) Sistema de Upload
```html
<!-- Usar PMOFramework.upload -->
<div class="upload-area"
     data-preview="preview-container"
     data-max-size="10">
    <input type="file" name="arquivo[]" multiple>
</div>
<div id="preview-container" class="file-preview"></div>
```

##### F) Barra de Progresso
```javascript
// Usar PMOFramework.progress
// Atualiza automaticamente baseado em campos [required]
PMOFramework.progress.calculate();
```

##### G) Exportação
```javascript
// Usar PMOFramework.export
<button onclick="PMOFramework.export.toJSON()">💾 Exportar JSON</button>
<button onclick="PMOFramework.export.toPDF()">📄 Exportar PDF</button>
<button onclick="PMOFramework.export.toCSV()">📊 Exportar CSV</button>
```

##### H) Mensagens de Feedback
```javascript
// Usar PMOFramework.ui
PMOFramework.ui.showMessage('Dados salvos com sucesso!', 'success');
PMOFramework.ui.showMessage('Erro ao validar CPF', 'error');
PMOFramework.ui.showMessage('Campo recomendado não preenchido', 'warning');
PMOFramework.ui.showMessage('Lembre-se de anexar documentos', 'info');
```

##### I) Integração com APIs Externas
```javascript
// Usar PMOFramework.api
// Buscar CEP
const endereco = await PMOFramework.api.buscarCEP('13087-280');
document.querySelector('[name="logradouro"]').value = endereco.logradouro;
document.querySelector('[name="bairro"]').value = endereco.bairro;
document.querySelector('[name="cidade"]').value = endereco.cidade;
document.querySelector('[name="uf"]').value = endereco.uf;

// Validar CNPJ (algoritmo + BrasilAPI)
const cnpjDados = await PMOFramework.api.validarCNPJ('12.345.678/0001-90');
```

##### J) Integração com PMO Principal (OBRIGATÓRIO para Anexos)
**IMPORTANTE**: Todos os anexos e formulários secundários **DEVEM** carregar dados do PMO Principal automaticamente.

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

        // Preencher campos de identificação (ADAPTAR conforme formulário)
        // Nome do fornecedor/produtor
        const nomeField = form.querySelector('[name="nome_fornecedor"]');
        if (nomeField && !nomeField.value) {
            nomeField.value = data.nome_completo || data.razao_social || '';
            console.log('Nome do fornecedor preenchido:', nomeField.value);
        }

        // Nome da unidade de produção
        const unidadeField = form.querySelector('[name="nome_unidade_producao"]');
        if (unidadeField && !unidadeField.value) {
            unidadeField.value = data.nome_unidade_producao || '';
            console.log('Nome da unidade preenchido:', unidadeField.value);
        }

        // Data de preenchimento
        const dataField = form.querySelector('[name="data_preenchimento"]');
        if (dataField && !dataField.value) {
            const today = new Date().toISOString().split('T')[0];
            dataField.value = today;
        }

        // Grupo SPG (se disponível)
        const grupoField = form.querySelector('[name="grupo_spg"]');
        if (grupoField && !grupoField.value && data.grupo_spg) {
            grupoField.value = data.grupo_spg;
        }

        // ADICIONAR OUTROS CAMPOS CONFORME NECESSÁRIO
        // Exemplos: CPF, CNPJ, endereço, telefone, etc.

        this.showMessage('Dados carregados do PMO Principal!', 'info');
    } catch (error) {
        console.error('Erro ao carregar dados do PMO Principal:', error);
        this.showMessage('Aviso: Não foi possível carregar dados do PMO Principal.', 'warning');
    }
}

// CHAMAR na inicialização do módulo
init() {
    console.log('Inicializando...');

    // ... outras inicializações ...

    // OBRIGATÓRIO: Carregar dados do PMO Principal
    this.loadPMOPrincipal();

    // ... resto da inicialização ...
}
```

**Campos comuns que devem ser preenchidos automaticamente:**
- ✅ `nome_fornecedor` ou `nome_produtor` → `data.nome_completo` ou `data.razao_social`
- ✅ `nome_unidade_producao` → `data.nome_unidade_producao`
- ✅ `data_preenchimento` → Data atual
- ✅ `grupo_spg` → `data.grupo_spg`
- ✅ `cpf` ou `cnpj` → `data.cpf` ou `data.cnpj` (se aplicável)
- ✅ `endereco`, `cep`, `municipio`, `uf` → Dados de endereço (se aplicável)

**Princípios importantes:**
1. **NÃO sobrescrever** campos já preenchidos manualmente (`if (!field.value)`)
2. **Registrar logs** no console para debug
3. **Mostrar mensagem** de confirmação ao usuário
4. **Tratar erros** gracefully - não bloquear o formulário se PMO Principal não existir
5. **Validar dados** antes de preencher

---

## 🏗️ PADRÕES DE COMPONENTES

### 1. Estrutura de Seção
```html
<section id="[id-secao]" class="form-section">
    <h2>[Número]. [Título da Seção]</h2>

    <!-- Info/Alerta (opcional) -->
    <div class="section-info">
        <p class="instruction">ℹ️ [Instrução de preenchimento]</p>
        <p class="alert">⚠️ [Alerta importante]</p>
    </div>

    <!-- Conteúdo da seção -->
    <div class="[classe-especifica]">
        <!-- Campos e componentes -->
    </div>

    <!-- Indicador de progresso da seção (opcional) -->
    <div class="section-progress"></div>
</section>
```

### 2. Campo de Texto Simples
```html
<div class="field-wrapper">
    <label for="campo-id">
        Nome do Campo
        <span class="required">*</span>
        <span class="help-tooltip">
            <span class="help-icon">?</span>
            <span class="help-text">Texto de ajuda</span>
        </span>
    </label>
    <input type="text"
           id="campo-id"
           name="campo_nome"
           required
           placeholder="Exemplo..."
           data-mask="cpf"
           aria-describedby="campo-help">
    <small id="campo-help" class="help-text">Dica adicional</small>
</div>
```

### 3. Grupo de Checkboxes/Radio
```html
<div class="checkbox-group">
    <h4>Título do Grupo</h4>

    <label class="checkbox-enhanced">
        <input type="checkbox" name="opcao_1" value="sim">
        <span>Opção 1</span>
    </label>

    <label class="checkbox-enhanced">
        <input type="checkbox" name="opcao_2" value="sim">
        <span>Opção 2</span>
    </label>
</div>
```

### 4. Select com Opções
```html
<div class="field-wrapper">
    <label for="select-id">Escolha uma opção <span class="required">*</span></label>
    <select id="select-id" name="campo_select" required onchange="funcaoCondicional(this)">
        <option value="">Selecione...</option>
        <optgroup label="Categoria 1">
            <option value="op1">Opção 1</option>
            <option value="op2">Opção 2</option>
        </optgroup>
        <option value="outro">Outro...</option>
    </select>
</div>

<!-- Campo condicional (mostrado se selecionar "outro") -->
<div id="outro-campo" style="display:none;">
    <input type="text" name="campo_outro" placeholder="Especifique...">
</div>
```

### 5. Tabela Dinâmica
```html
<div class="table-wrapper">
    <table id="tabela-[nome]" class="dynamic-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Campo 1 <span class="required">*</span></th>
                <th>Campo 2</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody id="tbody-[nome]">
            <!-- Template de linha -->
            <template id="row-template-[nome]">
                <tr class="dynamic-row">
                    <td class="row-number"></td>
                    <td><input type="text" name="campo1[]" required></td>
                    <td><input type="text" name="campo2[]"></td>
                    <td>
                        <button type="button"
                                onclick="PMOFramework.table.duplicateRow(this)"
                                title="Duplicar">📋</button>
                        <button type="button"
                                onclick="PMOFramework.table.removeRow(this)"
                                title="Remover">❌</button>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
    <button type="button"
            onclick="PMOFramework.table.addRow('tabela-[nome]')"
            class="btn btn-add">➕ Adicionar</button>
</div>
```

### 6. Accordion/Collapse
```html
<div class="accordion-item">
    <div class="accordion-header" onclick="PMOFramework.accordion.toggle(this)">
        <span>📦 Seção Expansível</span>
        <span>▼</span>
    </div>
    <div class="accordion-content">
        <!-- Conteúdo que pode ser expandido/recolhido -->
    </div>
</div>
```

### 7. Sistema de Tabs
```html
<div class="tabs-container">
    <div class="tabs-header">
        <button class="tab-button active" onclick="PMOFramework.tabs.show('tab1')">Aba 1</button>
        <button class="tab-button" onclick="PMOFramework.tabs.show('tab2')">Aba 2</button>
        <button class="tab-button" onclick="PMOFramework.tabs.show('tab3')">Aba 3</button>
    </div>

    <div id="tab-tab1" class="tab-content active">
        <!-- Conteúdo aba 1 -->
    </div>

    <div id="tab-tab2" class="tab-content">
        <!-- Conteúdo aba 2 -->
    </div>

    <div id="tab-tab3" class="tab-content">
        <!-- Conteúdo aba 3 -->
    </div>
</div>
```

### 8. Upload de Arquivos
```html
<div class="upload-section">
    <h3>Upload de Documentos</h3>

    <div class="upload-area"
         id="upload-[tipo]"
         data-preview="preview-[tipo]"
         data-max-size="10">
        <p>📁 Arraste arquivos aqui ou clique para selecionar</p>
        <input type="file"
               name="arquivo_[tipo][]"
               accept=".pdf,.jpg,.png"
               multiple
               hidden>
        <small>Formatos aceitos: PDF, JPG, PNG (máx. 10MB cada)</small>
    </div>

    <div id="preview-[tipo]" class="file-preview"></div>
</div>
```

---

## 📝 PADRÕES DE VALIDAÇÃO

### Validações Nativas HTML5
```html
<!-- Obrigatório -->
<input type="text" required>

<!-- Tamanho mínimo/máximo -->
<input type="text" minlength="5" maxlength="100">

<!-- Valor mínimo/máximo (números) -->
<input type="number" min="0" max="100" step="0.01">

<!-- Padrão (regex) -->
<input type="text" pattern="[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}">

<!-- Email -->
<input type="email">

<!-- URL -->
<input type="url">

<!-- Data -->
<input type="date" min="2024-01-01" max="2026-12-31">
```

### Validações JavaScript Customizadas
```javascript
// Módulo de validação específico do formulário
const [NomeModulo]Validation = {
    // Validar seção completa
    validateSection(sectionId) {
        const section = document.getElementById(sectionId);
        const required = section.querySelectorAll('[required]');
        const errors = [];

        required.forEach(field => {
            if (!field.value.trim()) {
                errors.push(`${field.name}: Campo obrigatório não preenchido`);
                field.classList.add('field-invalid');
            } else {
                field.classList.remove('field-invalid');
                field.classList.add('field-valid');
            }
        });

        return errors;
    },

    // Validação customizada
    validateCustom(fieldValue, rules) {
        // Implementar regras específicas
        if (rules.unique) {
            // Verificar se valor é único
        }
        if (rules.dependency) {
            // Verificar dependência com outro campo
        }
        return true;
    },

    // Validação final antes de envio
    validateComplete() {
        const allErrors = [];
        const allWarnings = [];

        // Validar cada seção
        document.querySelectorAll('.form-section').forEach(section => {
            const sectionErrors = this.validateSection(section.id);
            allErrors.push(...sectionErrors);
        });

        // Exibir resultados
        if (allErrors.length === 0) {
            PMOFramework.ui.showMessage('✅ Formulário válido!', 'success');
            return true;
        } else {
            this.showValidationReport(allErrors, allWarnings);
            return false;
        }
    },

    showValidationReport(errors, warnings) {
        const report = document.createElement('div');
        report.className = 'validation-report';

        if (errors.length > 0) {
            report.innerHTML += `
                <h3>❌ Erros (${errors.length})</h3>
                <ul class="errors-list">
                    ${errors.map(e => `<li>${e}</li>`).join('')}
                </ul>
            `;
        }

        if (warnings.length > 0) {
            report.innerHTML += `
                <h3>⚠️ Avisos (${warnings.length})</h3>
                <ul class="warnings-list">
                    ${warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>
            `;
        }

        // Exibir modal ou inserir no DOM
        document.getElementById('validation-results').innerHTML = report.outerHTML;
    }
};
```

---

## 🎨 PADRÕES DE ESTILO

### Cores e Temas (usar variáveis CSS do framework)
```css
/* Usar variáveis do framework */
:root {
    --primary: #10b981;        /* Verde ANC */
    --secondary: #3b82f6;      /* Azul */
    --success: #10b981;        /* Verde sucesso */
    --error: #ef4444;          /* Vermelho erro */
    --warning: #f59e0b;        /* Laranja aviso */
    --info: #3b82f6;           /* Azul info */
}

/* Estilos customizados do módulo */
.custom-component {
    background: var(--primary-light);
    border: 2px solid var(--primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
}
```

### Responsividade
```css
/* Mobile First */
.componente {
    /* Estilos base (mobile) */
}

/* Tablet */
@media (min-width: 768px) {
    .componente {
        /* Ajustes tablet */
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .componente {
        /* Ajustes desktop */
    }
}
```

---

## 🔗 INTEGRAÇÃO ENTRE MÓDULOS

### Compartilhar Dados entre Formulários
```javascript
// Módulo A salva dados
const dadosModuloA = {
    id_produtor: '12345',
    nome_produtor: 'João Silva',
    area_total: 10.5
};
localStorage.setItem('pmo_modulo_a', JSON.stringify(dadosModuloA));

// Módulo B carrega dados
const dadosModuloA = JSON.parse(localStorage.getItem('pmo_modulo_a'));
document.querySelector('[name="area_total_ref"]').value = dadosModuloA.area_total;
```

### Sistema de Navegação entre Módulos
```html
<nav class="pmo-navigation">
    <a href="../dashboard/index.html">🏠 Dashboard</a>
    <a href="../pmo-principal/index.html">📋 PMO Principal</a>
    <a href="../anexo-vegetal/index.html">🌱 Anexo Vegetal</a>
    <a href="../relatorios/index.html">📊 Relatórios</a>
</nav>
```

---

## 📦 ESTRUTURA DE DADOS (JSON Schema)

### Definir Schema para o Módulo
```json
{
  "metadata": {
    "modulo": "[NOME_MODULO]",
    "versao": "1.0",
    "data_preenchimento": "",
    "id_produtor": "",
    "status": "em_andamento"
  },

  "secao_1": {
    "campo_1": "",
    "campo_2": "",
    "sub_secao": [
      {
        "item_1": "",
        "item_2": ""
      }
    ]
  },

  "validacao": {
    "campos_obrigatorios_completos": false,
    "possui_erros": false,
    "erros": [],
    "avisos": [],
    "percentual_preenchimento": 0
  }
}
```

Salvar schema em: `database/schemas/[nome-modulo].schema.json`

---

## ✅ CHECKLIST FINAL

Antes de considerar o formulário completo, verificar:

### Funcionalidades
- [ ] Auto-save funciona (30s)
- [ ] Validações nativas HTML5 configuradas
- [ ] Validações JavaScript implementadas
- [ ] Campos dinâmicos (adicionar/remover) funcionam
- [ ] Máscaras aplicadas corretamente (CPF, CNPJ, CEP, telefone)
- [ ] Upload de arquivos com preview
- [ ] Barra de progresso atualiza em tempo real
- [ ] Exportação JSON funciona
- [ ] Exportação PDF funciona
- [ ] Mensagens de feedback aparecem corretamente

### Acessibilidade
- [ ] Labels associados a inputs (for/id)
- [ ] Atributos `aria-*` quando necessário
- [ ] Navegação por teclado (Tab, Enter)
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Textos alternativos em imagens

### Responsividade
- [ ] Mobile (375px) - Testado
- [ ] Tablet (768px) - Testado
- [ ] Desktop (1920px) - Testado
- [ ] Tabelas horizontalmente roláveis em mobile
- [ ] Botões e campos com tamanho mínimo 44x44px (touch)

### Performance
- [ ] Sem dependências pesadas desnecessárias
- [ ] CSS e JS minificados para produção
- [ ] Imagens otimizadas
- [ ] Lazy loading quando apropriado
- [ ] Service Worker para cache (PWA)

### Integração
- [ ] Usa PMO Framework corretamente
- [ ] Não duplica funcionalidades do framework
- [ ] Compartilha dados com outros módulos via localStorage
- [ ] Schema JSON definido em `database/schemas/`
- [ ] **OBRIGATÓRIO (para anexos)**: Carrega dados do PMO Principal automaticamente
- [ ] Implementa função `loadPMOPrincipal()` na inicialização
- [ ] Preenche campos: nome_fornecedor, nome_unidade_producao, data_preenchimento, grupo_spg
- [ ] Não sobrescreve campos já preenchidos manualmente
- [ ] Exibe mensagem de confirmação ao carregar dados

### Documentação
- [ ] README.md com instruções de uso
- [ ] Comentários no código explicando lógica complexa
- [ ] Exemplos de preenchimento quando necessário

---

## 🚀 EXEMPLO DE USO DESTE PROMPT

### Para criar o "Anexo de Produção Animal":

**Prompt para IA:**
```
Use o Prompt Universal de Formulários PMO para criar o Anexo III - Produção Animal.

INFORMAÇÕES ESPECÍFICAS:
- Nome do módulo: anexo-animal
- Escopo: Detalhamento de práticas de criação animal orgânica
- Seções principais:
  1. Identificação do Produtor (carregar do PMO Principal)
  2. Espécies criadas (tabela dinâmica)
  3. Alimentação (origem, composição, pastagens)
  4. Bem-estar animal
  5. Manejo sanitário (vacinas, medicamentos)
  6. Instalações
  7. Rastreabilidade

CAMPOS DINÂMICOS:
- Tabela de espécies (min: 1, max: 10)
- Lista de medicamentos utilizados
- Lista de vacinas aplicadas
- Instalações (currais, piquetes, galpões)

VALIDAÇÕES ESPECÍFICAS:
- Verificar se animais em conversão têm período mínimo declarado
- Validar que medicamentos estão na lista permitida MAPA
- Verificar densidade de animais por área

INTEGRAÇÃO OBRIGATÓRIA:
- Carregar automaticamente dados do PMO Principal (nome_fornecedor, nome_unidade_producao)
- Implementar função loadPMOPrincipal() conforme seção J do prompt
- Exibir mensagem de confirmação ao usuário

Siga todos os padrões do Prompt Universal.
```

---

## 📖 REFERÊNCIAS

- **Legislação**: Portaria 52/2021 MAPA
- **Framework**: `/framework/core/pmo-framework.js`
- **Schemas**: `/database/schemas/`
- **Documentação Claude Code**: https://docs.claude.com/claude-code

---

## 🆘 TROUBLESHOOTING

### Problema: Auto-save não funciona
**Solução**: Verificar se `PMOFramework.storage.markAsChanged()` está sendo chamado nos eventos de change dos campos.

### Problema: Validação não bloqueia envio
**Solução**: Adicionar `event.preventDefault()` no submit e chamar função de validação antes.

### Problema: Campos dinâmicos não aparecem
**Solução**: Verificar se `data-dynamic` está no container e se há template definido.

### Problema: Exportação PDF não formata corretamente
**Solução**: Usar biblioteca jsPDF via CDN e configurar margens/orientação adequadas.

### Problema: Dados do PMO Principal não carregam automaticamente
**Causas possíveis:**
1. PMO Principal não foi salvo antes → Preencher e salvar o PMO Principal primeiro
2. Chave do localStorage incorreta → Usar `'pmo_principal_data'` (não `'pmo_principal'`)
3. Função `loadPMOPrincipal()` não foi chamada no `init()`
4. Campos do formulário têm nomes diferentes → Verificar `name` dos inputs

**Solução:**
```javascript
// Debug no console (F12):
localStorage.getItem('pmo_principal_data') // Deve retornar JSON, não null

// Verificar se função está sendo chamada:
init() {
    console.log('Inicializando...');
    this.loadPMOPrincipal(); // IMPORTANTE: Deve estar aqui
}

// Verificar logs:
// "Nome do fornecedor preenchido: [nome]"
// "Dados carregados do PMO Principal!"
```

---

## 📝 NOTAS FINAIS

Este prompt universal deve ser **adaptado** conforme necessidades específicas de cada formulário/anexo, mas sempre mantendo:

1. ✅ Uso obrigatório do PMO Framework
2. ✅ Padrões de código e nomenclatura
3. ✅ Validações rigorosas
4. ✅ Acessibilidade
5. ✅ Responsividade
6. ✅ Performance
7. ✅ Documentação
8. ✅ **Integração com PMO Principal (OBRIGATÓRIO para anexos)**

**Objetivo**: Criar formulários consistentes, manuteníveis e que proporcionem excelente experiência ao usuário (produtor rural) preenchendo o PMO.

---

## 🔑 REGRAS DE OURO

### Para TODOS os anexos e formulários secundários:

1. **SEMPRE carregar dados do PMO Principal**
   - Chave: `localStorage.getItem('pmo_principal_data')`
   - Implementar função `loadPMOPrincipal()`
   - Chamar no `init()` do módulo

2. **Campos mínimos a preencher automaticamente:**
   - `nome_fornecedor` ou `nome_produtor`
   - `nome_unidade_producao`
   - `data_preenchimento`
   - `grupo_spg`

3. **Princípios da integração:**
   - ❌ NÃO sobrescrever campos já preenchidos
   - ✅ Registrar logs no console
   - ✅ Mostrar mensagem de confirmação
   - ✅ Tratar erros gracefully
   - ✅ Validar dados antes de preencher

4. **Fluxo de trabalho esperado:**
   - Usuário preenche PMO Principal primeiro
   - Depois abre qualquer anexo
   - Dados básicos são preenchidos automaticamente
   - Usuário continua preenchendo campos específicos do anexo