# PMO Framework v1.0.0

Framework unificado de componentes CSS e JavaScript para o Sistema de Plano de Manejo Orgânico (PMO) da ANC.

## 📦 Estrutura

```
framework/
├── core/
│   ├── pmo-framework.css      # CSS compilado (usar este!)
│   └── pmo-framework.js       # JavaScript compilado (em desenvolvimento)
│
├── styles/
│   ├── _variables.css         # Variáveis CSS
│   ├── _base.css              # Reset e base
│   ├── _components.css        # Componentes
│   ├── _utilities.css         # Classes utilitárias
│   ├── _responsive.css        # Media queries
│   └── _print.css             # Estilos para impressão
│
├── components/ (em desenvolvimento)
│   ├── validators.js
│   ├── storage.js
│   ├── progress.js
│   └── ...
│
└── utils/ (em desenvolvimento)
    ├── api-client.js
    └── ...
```

## 🚀 Como Usar o CSS

### Importar no HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Formulário PMO</title>

    <!-- Importar framework CSS -->
    <link rel="stylesheet" href="../../framework/core/pmo-framework.css">

    <!-- CSS específico do módulo (opcional) -->
    <link rel="stylesheet" href="./meu-modulo.css">
</head>
<body>
    <div class="pmo-container">
        <!-- Seu conteúdo aqui -->
    </div>
</body>
</html>
```

### Ou importar arquivos individuais

Se preferir importar apenas o necessário:

```html
<link rel="stylesheet" href="../../framework/styles/_variables.css">
<link rel="stylesheet" href="../../framework/styles/_base.css">
<link rel="stylesheet" href="../../framework/styles/_components.css">
<!-- ... -->
```

## 🎨 Componentes Disponíveis

### Containers

```html
<div class="pmo-container">
    <!-- Conteúdo com max-width: 1200px e padding responsivo -->
</div>
```

### Seções de Formulário

```html
<section class="form-section">
    <h2>1. Título da Seção</h2>

    <div class="section-info">
        <p class="instruction">ℹ️ Instruções de preenchimento</p>
        <p class="alert">⚠️ Alerta importante</p>
    </div>

    <!-- Campos do formulário -->
</section>
```

### Grid Layout

```html
<!-- Grid responsivo automático -->
<div class="form-grid">
    <div class="field-wrapper"><!-- campo 1 --></div>
    <div class="field-wrapper"><!-- campo 2 --></div>
    <div class="field-wrapper"><!-- campo 3 --></div>
</div>

<!-- Grid com colunas fixas -->
<div class="form-grid form-grid-2">
    <!-- 2 colunas em desktop, 1 em mobile -->
</div>

<div class="form-grid form-grid-3">
    <!-- 3 colunas em desktop, 1 em mobile -->
</div>
```

### Campos de Formulário

```html
<div class="field-wrapper">
    <label for="campo-id">
        Nome do Campo
        <span class="required">*</span>
    </label>
    <input type="text"
           id="campo-id"
           name="campo_nome"
           required
           placeholder="Exemplo...">
    <small class="help-text">Texto de ajuda</small>
</div>
```

### Checkboxes e Radios

```html
<div class="checkbox-group">
    <h4>Título do Grupo</h4>

    <label class="checkbox-enhanced">
        <input type="checkbox" name="opcao1" value="sim">
        <span>Opção 1</span>
    </label>

    <label class="checkbox-enhanced">
        <input type="checkbox" name="opcao2" value="sim">
        <span>Opção 2</span>
    </label>
</div>
```

### Botões

```html
<!-- Botão primário -->
<button class="btn btn-primary">Salvar</button>

<!-- Botão secundário -->
<button class="btn btn-secondary">Cancelar</button>

<!-- Botão de sucesso -->
<button class="btn btn-success">Confirmar</button>

<!-- Botão de perigo -->
<button class="btn btn-danger">Excluir</button>

<!-- Botão adicionar -->
<button class="btn btn-add">➕ Adicionar</button>

<!-- Botão remover -->
<button class="btn btn-remove">❌ Remover</button>

<!-- Tamanhos -->
<button class="btn btn-primary btn-sm">Pequeno</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-lg">Grande</button>
```

### Tabelas Dinâmicas

```html
<div class="table-wrapper">
    <table class="dynamic-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="row-number">1</td>
                <td><input type="text" name="nome[]" required></td>
                <td><input type="text" name="cpf[]" data-mask="cpf" required></td>
                <td>
                    <button type="button" class="btn btn-remove">❌</button>
                </td>
            </tr>
        </tbody>
    </table>
    <button type="button" class="btn btn-add">➕ Adicionar Linha</button>
</div>
```

### Upload de Arquivos

```html
<div class="upload-area" id="upload-container">
    <p>📁 Arraste arquivos aqui ou clique para selecionar</p>
    <input type="file"
           name="arquivo[]"
           accept=".pdf,.jpg,.png"
           multiple
           hidden>
    <small>Formatos aceitos: PDF, JPG, PNG (máx. 10MB cada)</small>
</div>

<div class="file-preview" id="preview-container">
    <!-- Preview dos arquivos aparecerá aqui -->
</div>
```

### Mensagens

```html
<!-- Informação -->
<div class="message message-info">
    <span>ℹ️</span>
    <span>Mensagem informativa</span>
</div>

<!-- Sucesso -->
<div class="message message-success">
    <span>✅</span>
    <span>Operação realizada com sucesso!</span>
</div>

<!-- Aviso -->
<div class="message message-warning">
    <span>⚠️</span>
    <span>Atenção: verifique este campo</span>
</div>

<!-- Erro -->
<div class="message message-error">
    <span>❌</span>
    <span>Erro ao processar</span>
</div>
```

### Barra de Progresso

```html
<div class="progress-container">
    <div class="progress-bar">
        <div class="progress-fill" style="width: 65%"></div>
    </div>
    <p class="progress-text">65% Completo</p>
</div>
```

### Tabs

```html
<div class="tabs-container">
    <div class="tabs-header">
        <button class="tab-button active" onclick="showTab('tab1')">Aba 1</button>
        <button class="tab-button" onclick="showTab('tab2')">Aba 2</button>
        <button class="tab-button" onclick="showTab('tab3')">Aba 3</button>
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

### Accordion

```html
<div class="accordion-item">
    <div class="accordion-header" onclick="toggleAccordion(this)">
        <span>📦 Título da Seção</span>
        <span class="accordion-icon">▼</span>
    </div>
    <div class="accordion-content">
        <!-- Conteúdo que pode ser expandido/recolhido -->
    </div>
</div>
```

### Cards

```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Título do Card</h3>
    </div>
    <div class="card-body">
        <p>Conteúdo do card</p>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary">Ação</button>
    </div>
</div>
```

## 🎨 Classes Utilitárias

### Display
```html
<div class="hidden">Oculto</div>
<div class="block">Display block</div>
<div class="flex">Display flex</div>
<div class="grid">Display grid</div>
```

### Flex
```html
<div class="flex justify-center items-center gap-3">
    <!-- Conteúdo centralizado com gap -->
</div>
```

### Text
```html
<p class="text-center">Texto centralizado</p>
<p class="text-lg font-bold">Texto grande e negrito</p>
<p class="text-primary">Texto na cor primária</p>
```

### Spacing
```html
<div class="mt-3">Margin top 3</div>
<div class="mb-4">Margin bottom 4</div>
<div class="p-5">Padding 5</div>
```

### Width
```html
<div class="w-full">Largura 100%</div>
<div class="w-1/2">Largura 50%</div>
```

### Background e Cores
```html
<div class="bg-primary text-white">Fundo primário</div>
<div class="bg-success-light">Fundo verde claro</div>
```

## 📱 Responsividade

O framework usa **Mobile First**. Classes responsive estão disponíveis:

```html
<!-- Ocultar em mobile, mostrar em tablet+ -->
<div class="hidden md:block">Conteúdo</div>

<!-- Grid responsivo -->
<div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <!-- 1 coluna mobile, 2 tablet, 3 desktop -->
</div>

<!-- Largura responsiva -->
<div class="w-full md:w-1/2 lg:w-1/3">
    <!-- 100% mobile, 50% tablet, 33% desktop -->
</div>
```

## 🖨️ Impressão

O framework inclui estilos otimizados para impressão. Use a classe `.no-print` para ocultar elementos na impressão:

```html
<button class="btn btn-primary no-print">Este botão não aparece na impressão</button>
```

## 🎨 Variáveis CSS Disponíveis

Você pode usar estas variáveis em CSS customizado:

```css
/* Cores */
var(--primary)
var(--secondary)
var(--success)
var(--error)
var(--warning)
var(--info)

/* Espaçamentos */
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 16px */
var(--spacing-lg)   /* 24px */
var(--spacing-xl)   /* 32px */

/* Bordas */
var(--radius-sm)
var(--radius-md)
var(--radius-lg)
var(--radius-full)

/* Sombras */
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)

/* Tipografia */
var(--font-sans)
var(--text-xs)
var(--text-sm)
var(--text-base)
var(--text-lg)
var(--text-xl)

/* Transições */
var(--transition-fast)
var(--transition-base)
var(--transition-slow)
```

## 📝 Exemplo Completo

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PMO Principal - ANC</title>
    <link rel="stylesheet" href="../../framework/core/pmo-framework.css">
</head>
<body>
    <div class="pmo-container">
        <!-- Barra de progresso -->
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: 45%"></div>
            </div>
            <p class="progress-text">45% Completo</p>
        </div>

        <!-- Seção 1 -->
        <section class="form-section">
            <h2>1. Dados dos Fornecedores</h2>

            <div class="section-info">
                <p class="instruction">ℹ️ Cadastre todos os responsáveis pela produção</p>
            </div>

            <div class="form-grid">
                <div class="field-wrapper">
                    <label for="nome">
                        Nome Completo
                        <span class="required">*</span>
                    </label>
                    <input type="text" id="nome" name="nome" required>
                </div>

                <div class="field-wrapper">
                    <label for="cpf">
                        CPF
                        <span class="required">*</span>
                    </label>
                    <input type="text" id="cpf" name="cpf" data-mask="cpf" required>
                    <small class="help-text">Apenas números</small>
                </div>
            </div>

            <div class="flex justify-end gap-3">
                <button type="button" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
        </section>
    </div>
</body>
</html>
```

## 🔧 Customização

Para customizar, crie um arquivo CSS próprio e sobrescreva as variáveis:

```css
:root {
    --primary: #your-color;
    --spacing-md: 20px;
    /* ... */
}
```

## 📄 Licença

Desenvolvido para ANC - Associação de Agricultura Natural de Campinas e Região

## 🚀 Próximos Passos

- [ ] Framework JavaScript (validators, storage, etc.)
- [ ] Minificação dos arquivos CSS
- [ ] Testes cross-browser
- [ ] Documentação de componentes JS

---

**Versão**: 1.0.0
**Última atualização**: 2025-01-30