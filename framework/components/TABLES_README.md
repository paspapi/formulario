# 📊 PMO Table - Tabelas Dinâmicas com Clipboard

Sistema completo de tabelas dinâmicas para formulários PMO, com suporte avançado para **colar dados de planilhas** (Excel, Google Sheets) diretamente no navegador.

## ✨ Funcionalidades

### Core
- ✅ Adicionar/remover linhas dinamicamente
- ✅ Validação em tempo real
- ✅ Auto-save em localStorage
- ✅ Exportação para CSV
- ✅ Zebra striping (linhas alternadas)
- ✅ Responsivo (mobile-first)
- ✅ Múltiplos tipos de campos (text, number, date, select, textarea, checkbox)
- ✅ Máscaras automáticas (CPF, CNPJ, CEP, telefone)

### **🎯 Clipboard (Colar de Planilhas)**
- ✅ **Colar direto com Ctrl+V** em qualquer campo
- ✅ **Botão "Colar planilha"** com preview visual
- ✅ **Detecção automática de delimitadores** (Tab, vírgula, ponto-e-vírgula)
- ✅ **Preview antes de colar** (3 primeiras linhas)
- ✅ **Parsing inteligente** com suporte a:
  - Campos entre aspas (`"valor com, vírgula"`)
  - Aspas duplas escapadas (`""`)
  - Múltiplos delimitadores
- ✅ **Validação de colunas** (alerta se número de colunas não bater)
- ✅ **Opção de limpar ou adicionar** às linhas existentes

## 🚀 Instalação

### 1. Incluir CSS
```html
<link rel="stylesheet" href="framework/styles/_variables.css">
<link rel="stylesheet" href="framework/styles/_base.css">
<link rel="stylesheet" href="framework/styles/_components.css">
```

### 2. Incluir JavaScript
```html
<script src="framework/components/tables.js"></script>
```

### 3. Criar container HTML
```html
<div id="minhaTabelaContainer"></div>
```

## 📝 Uso Básico

```javascript
const minhaTabela = new PMOTable('minhaTabelaContainer', {
    minRows: 1,
    maxRows: 50,
    columns: [
        {
            field: 'produto',
            label: 'Produto',
            type: 'text',
            required: true
        },
        {
            field: 'quantidade',
            label: 'Quantidade',
            type: 'number',
            required: true,
            min: 0
        },
        {
            field: 'unidade',
            label: 'Unidade',
            type: 'select',
            options: ['kg', 'L', 'unidade']
        }
    ],
    allowPaste: true,  // Habilitar colar do clipboard
    allowExport: true, // Habilitar exportação CSV
    zebra: true        // Linhas alternadas
});
```

## 🎨 Configuração

### Opções do Construtor

```javascript
{
    // Controle de linhas
    minRows: 1,              // Mínimo de linhas (padrão: 1)
    maxRows: 999,            // Máximo de linhas (padrão: 999)

    // Funcionalidades
    allowAdd: true,          // Permitir adicionar linhas
    allowRemove: true,       // Permitir remover linhas
    allowPaste: true,        // Permitir colar do clipboard ⭐
    allowExport: true,       // Permitir exportar CSV

    // Persistência
    autoSave: true,          // Auto-save em localStorage
    storageKey: 'pmo_table', // Chave do localStorage

    // Aparência
    zebra: true,             // Linhas alternadas (zebra striping)

    // Validação
    validators: {            // Validadores customizados
        campo: (value, field) => {
            return value.length > 3;
        }
    },

    // Callbacks
    onRowAdd: (row, index, data) => {},
    onRowRemove: (row, index) => {},
    onPaste: (parsed, addedCount, errorCount) => {},
    onValidate: (field, isValid, errorMsg) => {}
}
```

## 📋 Definição de Colunas

### Tipos de Campos Suportados

#### 1. Text / Number / Email / Tel / URL / Date
```javascript
{
    field: 'nome',
    label: 'Nome Completo',
    type: 'text',
    required: true,
    placeholder: 'Digite o nome',
    pattern: '[A-Za-z ]+',
    minLength: 3,
    maxLength: 100
}
```

#### 2. Select (Dropdown)
```javascript
{
    field: 'categoria',
    label: 'Categoria',
    type: 'select',
    required: true,
    options: ['Hortaliças', 'Frutas', 'Grãos']
}

// Ou com value e label
{
    field: 'status',
    label: 'Status',
    type: 'select',
    options: [
        { value: '1', label: 'Ativo' },
        { value: '0', label: 'Inativo' }
    ]
}
```

#### 3. Textarea
```javascript
{
    field: 'observacoes',
    label: 'Observações',
    type: 'textarea',
    rows: 3,
    placeholder: 'Informações adicionais'
}
```

#### 4. Checkbox
```javascript
{
    field: 'organico',
    label: 'Orgânico',
    type: 'checkbox',
    checkboxLabel: 'Produto orgânico certificado'
}
```

#### 5. Radio
```javascript
{
    field: 'origem',
    label: 'Origem',
    type: 'radio',
    options: ['Nacional', 'Importado']
}
```

### Propriedades Disponíveis

| Propriedade | Tipo | Descrição |
|------------|------|-----------|
| `field` | string | Nome do campo (obrigatório) |
| `label` | string | Texto do cabeçalho |
| `type` | string | Tipo do campo |
| `required` | boolean | Campo obrigatório |
| `disabled` | boolean | Campo desabilitado |
| `placeholder` | string | Placeholder |
| `min` | number | Valor mínimo (number/date) |
| `max` | number | Valor máximo (number/date) |
| `step` | number | Incremento (number) |
| `pattern` | string | Regex de validação |
| `mask` | string | Máscara: `cpf`, `cnpj`, `cep`, `telefone` |
| `options` | array | Opções (select/radio) |
| `rows` | number | Linhas (textarea) |
| `width` | string | Largura da coluna CSS |
| `help` | string | Texto de ajuda (tooltip) |
| `validate` | string | Nome do validador |

## 🎯 Clipboard - Colar de Planilhas

### Método 1: Botão "Colar planilha"

1. Copie dados no Excel/Google Sheets (Ctrl+C)
2. Clique em **"Colar planilha"**
3. Cole na caixa de texto (Ctrl+V)
4. Veja o preview
5. Clique em **"Colar dados"**

### Método 2: Atalho Direto (Ctrl+V)

1. Copie dados no Excel/Google Sheets (Ctrl+C)
2. Clique em **qualquer campo** da tabela
3. Pressione **Ctrl+V**
4. Dados são colados automaticamente!

### Formatos Suportados

| Formato | Delimitador | Exemplo |
|---------|-------------|---------|
| **TSV** | Tab (`\t`) | `Produto	100	kg` |
| **CSV** | Vírgula (`,`) | `Produto,100,kg` |
| **CSV BR** | Ponto-e-vírgula (`;`) | `Produto;100;kg` |
| **Auto** | Detectado automaticamente | Qualquer um acima |

### Parsing Avançado

O parser suporta:

```javascript
// Campos simples
Produto1	100	kg

// Campos entre aspas
"Produto com, vírgula"	100	kg

// Aspas escapadas
"Produto com ""aspas"""	100	kg

// Células vazias
Produto		kg

// Múltiplas linhas
Produto1	100	kg
Produto2	200	L
Produto3	50	unidade
```

### Exemplo de Dados para Teste

Copie e cole:

```
Tomate	100	kg	Orgânico certificado
Alface	50	kg	Hidropônico
Cenoura	75	kg	Agroecológico
Batata	200	kg	Cultivo em terra
```

## 🔧 Métodos da API

### Manipulação de Linhas

```javascript
// Adicionar linha vazia
table.addRow();

// Adicionar linha com dados
table.addRow({ produto: 'Tomate', quantidade: 100, unidade: 'kg' });

// Remover linha específica
const row = document.querySelector('.dynamic-row');
table.removeRow(row);

// Limpar todas as linhas (mantém mínimo)
table.clearRows();
```

### Dados

```javascript
// Obter todos os dados
const data = table.getData();
// Retorna: [{ produto: 'Tomate', quantidade: 100, ... }, ...]

// Definir dados (substitui tudo)
table.setData([
    { produto: 'Tomate', quantidade: 100, unidade: 'kg' },
    { produto: 'Alface', quantidade: 50, unidade: 'kg' }
]);
```

### Validação

```javascript
// Validar campo específico
const input = document.querySelector('#produto_0');
const isValid = table.validateField(input);

// Validar todas as linhas
const result = table.validateAll();
console.log(result);
// {
//   valid: true/false,
//   errors: [
//     { row: 1, field: 'produto', value: '' }
//   ]
// }
```

### Exportação

```javascript
// Exportar para CSV
table.exportToCSV();
// Download automático: tabela_2024-01-15.csv
```

### Persistência

```javascript
// Salvar manualmente
table.saveData();

// Carregar dados salvos
table.loadSavedData();

// Dados são salvos automaticamente se autoSave: true
```

### Destruição

```javascript
// Destruir instância (salva antes se autoSave: true)
table.destroy();
```

## 🎨 Customização de Estilo

### CSS Variables

```css
:root {
    --primary: #10b981;          /* Cor primária */
    --error: #ef4444;            /* Cor de erro */
    --success: #10b981;          /* Cor de sucesso */
    --gray-50: #f9fafb;          /* Background zebra */
}
```

### Classes CSS

```css
/* Customizar cabeçalho */
.dynamic-table thead {
    background: linear-gradient(135deg, #10b981, #059669);
}

/* Customizar linhas */
.dynamic-table tbody tr:hover {
    background: #f0fdf4;
}

/* Customizar botões */
.btn-add-row {
    background: #10b981;
    color: white;
}
```

## 🔍 Validadores Customizados

### Validador Simples

```javascript
validators: {
    cnpj: (value) => {
        const cnpj = value.replace(/\D/g, '');
        return cnpj.length === 14; // Validação básica
    }
}
```

### Validador com Mensagem

```javascript
validators: {
    email: (value, field) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        return {
            valid: isValid,
            message: isValid ? '' : 'E-mail inválido'
        };
    }
}
```

### Validador Assíncrono

```javascript
validators: {
    cep: async (value, field) => {
        if (value.length !== 8) return false;

        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();

        return !data.erro;
    }
}
```

## 🧪 Exemplos Avançados

### Tabela de Produtos Orgânicos

```javascript
const tableProdutos = new PMOTable('produtos', {
    minRows: 1,
    maxRows: 100,
    columns: [
        { field: 'produto', label: 'Produto', type: 'text', required: true },
        { field: 'variedade', label: 'Variedade', type: 'text' },
        { field: 'quantidade', label: 'Qtd', type: 'number', required: true, min: 0 },
        { field: 'unidade', label: 'Unidade', type: 'select',
          options: ['kg', 'g', 'L', 'mL', 'unidade', 'maço', 'dúzia'] },
        { field: 'certificado', label: 'Certificado', type: 'select',
          options: ['Orgânico', 'Em transição', 'Agroecológico'] },
        { field: 'data_colheita', label: 'Colheita', type: 'date' },
        { field: 'observacoes', label: 'Obs', type: 'textarea', rows: 2 }
    ],
    allowPaste: true,
    allowExport: true,
    zebra: true,
    storageKey: 'pmo_produtos_organicos',
    onPaste: (parsed, added, errors) => {
        alert(`${added} produtos adicionados!`);
    }
});
```

### Tabela de Fornecedores com Validação de CNPJ

```javascript
const tableFornecedores = new PMOTable('fornecedores', {
    columns: [
        { field: 'razao_social', label: 'Razão Social', type: 'text', required: true },
        { field: 'cnpj', label: 'CNPJ', type: 'text', required: true,
          mask: 'cnpj', validate: 'cnpj' },
        { field: 'inscricao_estadual', label: 'IE', type: 'text' },
        { field: 'telefone', label: 'Telefone', type: 'tel', mask: 'telefone' },
        { field: 'email', label: 'E-mail', type: 'email', validate: 'email' },
        { field: 'tipo', label: 'Tipo', type: 'select',
          options: ['Insumos', 'Sementes', 'Equipamentos', 'Serviços'] }
    ],
    validators: {
        cnpj: (value) => {
            const cnpj = value.replace(/\D/g, '');
            if (cnpj.length !== 14) return false;
            // Validação de dígitos verificadores aqui
            return true;
        },
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    },
    allowPaste: true,
    allowExport: true
});
```

## 🐛 Troubleshooting

### Os dados não estão sendo colados

1. Verifique se `allowPaste: true`
2. Certifique-se que o número de colunas corresponde
3. Verifique o console do navegador para erros

### Validação não está funcionando

1. Verifique se o validador está definido em `validators`
2. Certifique-se que o campo tem `validate: 'nomeDoValidador'`
3. Teste o validador isoladamente no console

### Auto-save não funciona

1. Verifique se `autoSave: true`
2. Certifique-se que `storageKey` é único
3. Verifique limites do localStorage (5-10MB)

### CSS não está aplicado

1. Importe todos os arquivos CSS na ordem correta
2. Verifique se as variáveis CSS estão definidas em `_variables.css`
3. Limpe o cache do navegador

## 📦 Dependências

- **Nenhuma!** O componente é standalone e não requer bibliotecas externas.

## 🌐 Compatibilidade

| Browser | Versão Mínima |
|---------|---------------|
| Chrome | 51+ |
| Firefox | 54+ |
| Safari | 10+ |
| Edge | 79+ |
| Mobile Safari | 10+ |
| Chrome Android | 51+ |

## 📄 Licença

Parte do **PMO Framework - ANC**
Associação de Agricultura Natural de Campinas e Região

---

## 🚀 Próximos Passos

- [ ] Suporte a drag-and-drop para reordenar linhas
- [ ] Filtros e busca em colunas
- [ ] Ordenação por coluna (sort)
- [ ] Paginação para grandes volumes
- [ ] Edição inline com double-click
- [ ] Undo/Redo
- [ ] Importação de CSV/Excel
- [ ] Exportação para Excel (XLSX)
- [ ] Templates de linhas
- [ ] Totalizadores automáticos (sum, avg, count)

## 💬 Suporte

Para dúvidas, sugestões ou relato de bugs:
- Abra uma issue no repositório
- Consulte a documentação completa
- Entre em contato com a equipe ANC

---

**Desenvolvido com 💚 para agricultura orgânica**