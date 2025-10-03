# Painel Geral do PMO - Documentação Completa

## 📋 Visão Geral

O **Painel Geral do PMO** é a interface centralizada para gerenciar múltiplos Planos de Manejo Orgânico. Permite criar, visualizar, editar e exportar PMOs de diferentes produtores e anos.

---

## 🎯 Funcionalidades Principais

### 1. **Upload de PDF com Metadados JSON**
- Upload de arquivo PDF contendo metadados JSON embutidos
- Extração automática dos dados usando pdf-lib
- Criação automática de novo PMO no sistema
- Validação do schema JSON

### 2. **Lista de PMOs com Fluxo Visual**
- Exibição de todos os PMOs cadastrados
- Card minimalista para cada PMO
- Fluxo de preenchimento integrado no card
- Indicadores de progresso por formulário

### 3. **Filtros e Busca**
- Busca por nome, CPF/CNPJ, unidade
- Filtros por status (Rascunho, Completo)
- Filtro por grupo SPG
- Filtro por ano vigente
- Ordenação (data, progresso, nome)
- Seção de filtros colapsável

### 4. **Edição de PMO**
- Clicar em qualquer linha do fluxo abre o formulário correspondente
- Sincronização automática via PMOStorageManager
- Auto-save ao navegar entre formulários

### 5. **Exportação de PDF Completo**
- Mescla TODOS os PDFs do escopo habilitado
- Inclui documentos anexados (croqui, CAR, etc.)
- Embute JSON completo como metadata
- Gera arquivo único para download

---

## 🎨 Layout do Card do PMO

```
┌────────────────────────────────────────────┐
│ 65% | João Silva - Sítio Boa Vista         │
│ 123.456.789-00 | Grupo: ANC Campinas        │
│ Ano Vigente: 2024 | V1.0 | 15/03/2024      │
├────────────────────────────────────────────┤
│ Cadastro Geral ──────────────────── 100%   │
│ Anexo Vegetal ───────────────────── 65%    │
│ Anexo Cogumelo ──────────────────── 100%   │
│ Proc. Mínimo ────────────────────── 30%    │
├────────────────────────────────────────────┤
│ [Editar] [Exportar PMO Completo] [Deletar] │
└────────────────────────────────────────────┘
```

**Elementos:**
- **Linha 1:** % total + Nome do produtor + Nome da unidade
- **Linha 2:** CPF/CNPJ + Grupo SPG
- **Linha 3:** Ano vigente + Versão + Data de criação
- **Fluxo:** Lista APENAS formulários do escopo habilitado
- **Cada linha do fluxo:** Nome + Barra de progresso + %
- **Rodapé:** 3 botões de ação

---

## 📊 Sistema de ID Único

### Formato do ID:
```
pmo_{ano}_{cpf_cnpj}_{unidade_producao}
```

### Exemplo:
```
CPF/CNPJ: 123.456.789-00
Ano: 2024
Unidade: Sítio Boa Vista

ID Gerado: pmo_2024_12345678900_sitio-boa-vista
```

### Regras:
- CPF/CNPJ sem pontuação
- Unidade em lowercase, sem acentos, com hífens
- Ano de 4 dígitos

---

## 🗂️ Estrutura de Dados

### localStorage: `pmo_registry`
```json
{
  "current_pmo_id": "pmo_2024_12345678900_sitio-boa-vista",
  "pmos": [
    {
      "id": "pmo_2024_12345678900_sitio-boa-vista",
      "cpf_cnpj": "123.456.789-00",
      "nome": "João Silva",
      "unidade": "Sítio Boa Vista",
      "grupo_spg": "ANC Campinas",
      "ano_vigente": 2024,
      "versao": "1.0",
      "data_criacao": "2024-03-15T10:30:00.000Z",
      "data_modificacao": "2024-03-20T15:45:00.000Z",
      "status": "rascunho",
      "progresso": {
        "cadastro-geral-pmo": 100,
        "anexo-vegetal": 65,
        "anexo-cogumelo": 100,
        "anexo-processamentominimo": 30,
        "total": 73
      },
      "formularios_ativos": [
        "cadastro-geral-pmo",
        "anexo-vegetal",
        "anexo-cogumelo",
        "anexo-processamentominimo"
      ]
    }
  ]
}
```

### localStorage: `pmo_{id}_data`
```json
{
  "cadastro_geral_pmo": {
    /* dados do cadastro geral */
  },
  "anexo_vegetal": {
    /* dados do anexo vegetal */
  },
  "anexo_cogumelo": {
    /* dados do anexo cogumelo */
  },
  "documentos_anexados": {
    "croqui": "data:application/pdf;base64,JVBERi0xLjQK...",
    "car": "data:application/pdf;base64,JVBERi0xLjQK..."
  },
  "pdfs_gerados": {
    "cadastro-geral-pmo": "base64...",
    "anexo-vegetal": "base64..."
  }
}
```

---

## 🔄 Fluxos de Uso

### Fluxo 1: Criar Novo PMO
```
1. Usuário clica em "Novo PMO"
2. Sistema redireciona para cadastro-geral-pmo
3. Usuário preenche dados básicos (CPF, nome, unidade, ano)
4. Ao salvar, PMOStorageManager cria novo ID
5. PMO aparece na lista do painel
```

### Fluxo 2: Upload de PDF
```
1. Usuário faz upload de PDF
2. pdf-lib extrai metadata JSON
3. PMOStorageManager cria novo PMO com os dados
4. PMO aparece na lista do painel
5. Usuário pode editar ou exportar
```

### Fluxo 3: Editar PMO Existente
```
1. Usuário clica em linha do fluxo (ex: "Anexo Vegetal")
2. PMOStorageManager.setActivePMO(id)
3. Sistema redireciona para /pmo/anexo-vegetal/
4. Dados carregam automaticamente
5. Usuário edita e salva
6. Progresso atualiza no painel
```

### Fluxo 4: Exportar PMO Completo
```
1. Usuário clica "Exportar PMO Completo"
2. Sistema identifica formularios_ativos do PMO
3. pdf-lib mescla APENAS PDFs do escopo:
   - cadastro-geral-pmo (sempre incluído)
   - anexo-vegetal (se no escopo)
   - anexo-cogumelo (se no escopo)
   - etc.
4. Mescla documentos_anexados (croqui, CAR, etc.)
5. Embute JSON completo como metadata
6. Download: PMO-Completo-JoaoSilva-2024.pdf
```

---

## 🔍 Sistema de Filtros

### Filtros Disponíveis:

**1. Status:**
- Todos (padrão)
- Rascunho (progresso < 100%)
- Completo (progresso = 100%)

**2. Grupo SPG:**
- Dropdown com todos os grupos encontrados
- Permite filtrar por grupo específico

**3. Ano Vigente:**
- Dropdown com todos os anos encontrados
- Permite filtrar por ano específico

**4. Ordenação:**
- Mais recentes (data_modificacao DESC)
- Mais antigos (data_modificacao ASC)
- Maior progresso (progresso.total DESC)
- Menor progresso (progresso.total ASC)
- Nome (A-Z)
- Nome (Z-A)

### UI dos Filtros:

```
┌─────────────────────────────────────────────┐
│ Busca: [_______________________] 🔍        │
│ [🔽 Mostrar Filtros]                        │
│                                             │
│ ┌─────────────────────────────────────┐    │ (Expandido)
│ │ Status: ⚪ Todos ⚪ Rascunho ...     │    │
│ │ Grupo: [Todos ▼]                    │    │
│ │ Ano: [Todos ▼]                      │    │
│ │ Ordenar: [Mais Recentes ▼]          │    │
│ │ [🔼 Ocultar Filtros]                │    │
│ └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 📤 Upload de PDF com Metadata JSON

### Formato do PDF:

O PDF deve conter metadata customizada com a chave `pmo_data`:

```javascript
// Estrutura do JSON no metadata
{
  "pmo_schema": "1.0",
  "id_produtor": "123.456.789-00",
  "nome": "João Silva",
  "unidade": "Sítio Boa Vista",
  "grupo_spg": "ANC Campinas",
  "ano_vigente": 2024,
  "versao": "1.0",
  "dados_completos": {
    "cadastro_geral_pmo": { /* ... */ },
    "anexo_vegetal": { /* ... */ }
  },
  "formularios_ativos": ["cadastro-geral-pmo", "anexo-vegetal"]
}
```

### Processo de Upload:

```javascript
async function uploadPDF(file) {
  // 1. Carregar PDF
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

  // 2. Extrair metadata
  const metadata = pdfDoc.getCustomMetadata('pmo_data');
  const dados = JSON.parse(metadata);

  // 3. Validar schema
  if (!dados.pmo_schema || !dados.id_produtor) {
    throw new Error('PDF inválido: metadata ausente');
  }

  // 4. Criar PMO
  const pmoId = PMOStorageManager.createPMO({
    cpf_cnpj: dados.id_produtor,
    nome: dados.nome,
    unidade: dados.unidade,
    grupo_spg: dados.grupo_spg,
    ano_vigente: dados.ano_vigente
  });

  // 5. Salvar dados
  Object.keys(dados.dados_completos).forEach(formulario => {
    PMOStorageManager.updateFormulario(
      pmoId,
      formulario,
      dados.dados_completos[formulario]
    );
  });

  // 6. Atualizar escopo
  PMOStorageManager.updateFormulariosAtivos(
    pmoId,
    dados.formularios_ativos
  );

  return pmoId;
}
```

---

## 📥 Exportação de PDF Completo

### Processo de Exportação:

```javascript
async function exportarPMOCompleto(pmoId) {
  const pmo = PMOStorageManager.getPMO(pmoId);
  const pdfDoc = await PDFLib.PDFDocument.create();

  // 1. Mesclar formulários do escopo
  for (const formulario of pmo.formularios_ativos) {
    const pdfBase64 = pmo.dados.pdfs_gerados[formulario];
    if (pdfBase64) {
      const formPdfBytes = base64ToUint8Array(pdfBase64);
      const formPdf = await PDFLib.PDFDocument.load(formPdfBytes);
      const pages = await pdfDoc.copyPages(formPdf, formPdf.getPageIndices());
      pages.forEach(page => pdfDoc.addPage(page));
    }
  }

  // 2. Mesclar documentos anexados
  for (const [nome, base64] of Object.entries(pmo.dados.documentos_anexados)) {
    const docBytes = base64ToUint8Array(base64);
    const docPdf = await PDFLib.PDFDocument.load(docBytes);
    const pages = await pdfDoc.copyPages(docPdf, docPdf.getPageIndices());
    pages.forEach(page => pdfDoc.addPage(page));
  }

  // 3. Embeber metadata JSON
  const metadata = {
    pmo_schema: "1.0",
    id_produtor: pmo.cpf_cnpj,
    nome: pmo.nome,
    unidade: pmo.unidade,
    grupo_spg: pmo.grupo_spg,
    ano_vigente: pmo.ano_vigente,
    versao: pmo.versao,
    data_exportacao: new Date().toISOString(),
    dados_completos: pmo.dados,
    formularios_ativos: pmo.formularios_ativos,
    progresso: pmo.progresso
  };

  pdfDoc.setCustomMetadata('pmo_data', JSON.stringify(metadata));

  // 4. Download
  const pdfBytes = await pdfDoc.save();
  downloadPDF(`PMO-Completo-${pmo.nome}-${pmo.ano_vigente}.pdf`, pdfBytes);
}
```

---

## 🎨 Estilos CSS

### Paleta de Cores:
- **Primary:** #10b981 (Verde)
- **Secondary:** #3b82f6 (Azul)
- **Danger:** #ef4444 (Vermelho)
- **Warning:** #f59e0b (Laranja)
- **Background:** #f9fafb (Cinza claro)
- **Text:** #1f2937 (Cinza escuro)

### Classes Principais:
- `.pmo-card` - Card de PMO
- `.pmo-card-header` - Cabeçalho com % e nome
- `.pmo-card-info` - Linha de informações
- `.pmo-card-flow` - Seção do fluxo
- `.flow-item` - Item individual do fluxo
- `.progress-bar-mini` - Barra de progresso pequena
- `.pmo-card-actions` - Botões de ação
- `.filter-section` - Seção de filtros
- `.filter-collapsed` - Filtros escondidos
- `.filter-expanded` - Filtros visíveis

---

## 🔧 Funções JavaScript Principais

### `PainelPMO.init()`
Inicializa o painel, carrega PMOs, configura eventos.

### `PainelPMO.carregarPMOs()`
Carrega lista de PMOs do PMOStorageManager e renderiza cards.

### `PainelPMO.renderizarCard(pmo)`
Renderiza um card individual de PMO.

### `PainelPMO.editarPMO(pmoId, formulario)`
Define PMO como ativo e redireciona para o formulário.

### `PainelPMO.exportarPMOCompleto(pmoId)`
Exporta PDF completo mesclado.

### `PainelPMO.deletarPMO(pmoId)`
Remove PMO após confirmação.

### `PainelPMO.filtrarPMOs()`
Aplica filtros e busca na lista.

### `PainelPMO.toggleFiltros()`
Mostra/oculta seção de filtros.

### `PainelPMO.uploadPDF(file)`
Processa upload de PDF com metadata.

---

## 🚀 Próximos Passos

Após criar o painel:

1. ✅ Testar criação de novo PMO
2. ✅ Testar upload de PDF
3. ✅ Testar edição de PMO
4. ✅ Testar exportação completa
5. ✅ Testar filtros e busca
6. ✅ Adaptar demais formulários (seguindo guia)
7. ✅ Integração final

---

**Versão:** 1.0
**Data:** 2024-03-15
**Autor:** ANC - Sistema PMO
