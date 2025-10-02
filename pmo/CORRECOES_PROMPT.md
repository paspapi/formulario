# ✅ Correções Aplicadas ao prompt_universal.md

## 📋 Resumo das Correções

O arquivo `prompt_universal.md` foi **corrigido** para refletir a implementação real dos formulários PMO (Animal, Vegetal e Principal).

---

## 🔧 Principais Mudanças

### 1. **Menu de Navegação - CORRIGIDO** ✅

**ANTES (Incorreto):**
```html
<nav class="header-nav">
  <a href="/pmo/dashboard/" class="btn btn-nav">🏠 Dashboard</a>
  <a href="/pmo/pmo-principal/" class="btn btn-nav btn-nav-active">📋 PMO Básica</a>
  <!-- ... -->
</nav>
```

**DEPOIS (Correto):**
```html
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
```

**Mudanças:**
- ✅ Classe: `header-nav` → `pmo-navigation`
- ✅ Total de itens: **8 itens** (incluindo todos os anexos + relatórios)
- ✅ Classe de ativo: `btn-nav-active` → `active`
- ✅ Links relativos: `/pmo/...` → `../...`
- ✅ Adicionados: Cogumelo, Apicultura, Processamento, Relatórios

---

### 2. **Header Estrutura - CORRIGIDO** ✅

**ANTES (Incorreto):**
```html
<header class="pmo-header">
  <div class="container header-content">
    <div class="header-logo">
      <h1>📋 PMO Digital - ANC</h1>
      <p>Sistema de Plano de Manejo Orgânico</p>
    </div>
    <nav class="header-nav">...</nav>
  </div>
</header>
```

**DEPOIS (Correto):**
```html
<header class="pmo-header">
    <div class="pmo-container">
        <div class="header-content">
            <h1>📋 PMO Principal</h1>
            <p class="subtitle">Plano de Manejo Orgânico - ANC</p>
        </div>

        <nav class="pmo-navigation">...</nav>

        <!-- Barra de Progresso DENTRO do header -->
        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
            <span class="progress-text" id="progress-text">0% Completo</span>
        </div>
    </div>
</header>
```

**Mudanças:**
- ✅ Container: `container` → `pmo-container`
- ✅ Subtítulo: adicionar classe `subtitle`
- ✅ Barra de progresso: movida **para dentro** do header
- ✅ Estrutura simplificada (sem `header-logo`)

---

### 3. **Barra de Progresso - CORRIGIDO** ✅

**ANTES (Fora do header, estrutura complexa):**
```html
<div class="progress-container">
  <div class="progress-info">
    <span id="progress-text">Progresso: 0%</span>
    <span id="auto-save-status">💾 Não salvo</span>
  </div>
  <div class="progress-bar">
    <div id="progress-fill" class="progress-fill" style="width: 0%"></div>
  </div>
</div>
```

**DEPOIS (Dentro do header, simplificada):**
```html
<div class="progress-bar-container">
    <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
    <span class="progress-text" id="progress-text">0% Completo</span>
</div>
```

**Mudanças:**
- ✅ Localização: **DENTRO do header**
- ✅ Estrutura simplificada
- ✅ Removido: `auto-save-status` (não existe na implementação real)
- ✅ IDs corretos: `progress-bar` e `progress-text`

---

### 4. **Framework CSS - CORRIGIDO** ✅

**ANTES:**
```html
<link rel="stylesheet" href="/framework/core/pmo-framework.css">
```

**DEPOIS:**
```html
<link rel="stylesheet" href="../../framework/core/pmo-framework-full.css">
```

**Mudanças:**
- ✅ Arquivo: `pmo-framework.css` → `pmo-framework-full.css`
- ✅ Path: absoluto `/framework/` → relativo `../../framework/`

---

### 5. **Scripts Framework - CORRIGIDO** ✅

**ANTES (8 arquivos):**
```html
<script src="/framework/core/pmo-framework.js"></script>
<script src="/framework/components/validators.js"></script>
<script src="/framework/components/storage.js"></script>
<script src="/framework/components/tables.js"></script>
<script src="/framework/components/upload.js"></script>
<script src="/framework/components/progress.js"></script>
<script src="/framework/components/export.js"></script>
<script src="/framework/components/notifications.js"></script>
```

**DEPOIS (2 arquivos apenas):**
```html
<script src="../../framework/core/pmo-framework.js"></script>
<script src="../../framework/components/pmo-tables.js"></script>
```

**Mudanças:**
- ✅ Simplificado: 8 scripts → **2 scripts**
- ✅ Nome correto: `tables.js` → `pmo-tables.js`
- ✅ Path relativo
- ✅ Componentes integrados no `pmo-framework.js`

---

### 6. **Footer - CORRIGIDO** ✅

**ANTES (Complexo):**
```html
<footer class="pmo-footer">
  <div class="container">
    <p><strong>ANC - Associação de Agricultura Natural de Campinas e Região</strong></p>
    <p>Sistema PMO Digital v2.0 | Certificação Orgânica Participativa</p>
    <p>Dúvidas: <a href="mailto:contato@anc.org.br">contato@anc.org.br</a> | 📞 (19) 3XXX-XXXX</p>
    <p class="footer-legal">
      Desenvolvido seguindo Lei 10.831/2003 e Instruções Normativas MAPA
    </p>
  </div>
</footer>
```

**DEPOIS (Simples):**
```html
<footer class="pmo-footer">
    <p>&copy; 2024 ANC - Associação de Agricultura Natural de Campinas e Região</p>
    <p>Sistema PMO - Plano de Manejo Orgânico</p>
</footer>
```

**Mudanças:**
- ✅ Removido: container interno
- ✅ Simplificado: 4 linhas → 2 linhas
- ✅ Removido: informações de contato e legal

---

### 7. **Classes CSS Atualizadas** ✅

**Adicionadas ao prompt:**
- ✅ `.pmo-container` (ao invés de `.container`)
- ✅ `.pmo-navigation` (ao invés de `.header-nav`)
- ✅ `.pmo-header`
- ✅ `.pmo-footer`
- ✅ `.progress-bar-container`
- ✅ `.progress-bar`
- ✅ `.progress-text`
- ✅ `.subtitle`
- ✅ `.field-wrapper`
- ✅ `.dynamic-table`
- ✅ `.table-wrapper`
- ✅ `.action-buttons`
- ✅ `.checkbox-enhanced`
- ✅ `.section-info`

---

### 8. **Tabelas Dinâmicas - CORRIGIDO** ✅

**Adicionada documentação de uso via onclick:**
```javascript
// Adicionar linha
onclick="MeuFormulario.table.addRow('tabela-produtos')"

// Remover linha
onclick="MeuFormulario.table.removeRow(this)"

// Duplicar linha
onclick="MeuFormulario.table.duplicateRow(this)"
```

**Exemplo correto de botões de ação:**
```html
<td class="action-buttons">
    <button type="button" onclick="MeuFormulario.table.duplicateRow(this)" title="Duplicar">📋</button>
    <button type="button" onclick="MeuFormulario.table.removeRow(this)" title="Remover">❌</button>
</td>
```

---

## 📊 Comparação Geral

| Aspecto | ANTES | DEPOIS |
|---------|-------|--------|
| Menu itens | 7 | **8** (completo) |
| Menu classe | `header-nav` | `pmo-navigation` |
| Container | `container` | `pmo-container` |
| CSS file | `pmo-framework.css` | `pmo-framework-full.css` |
| Scripts | 8 arquivos | **2 arquivos** |
| Progresso | Fora header | **Dentro header** |
| Footer | Complexo (4 linhas) | **Simples (2 linhas)** |
| Path links | Absoluto `/pmo/` | Relativo `../` |
| Classe ativo | `btn-nav-active` | `active` |

---

## ✅ Status

**Todas as correções foram aplicadas com sucesso!**

O `prompt_universal.md` agora reflete **exatamente** a estrutura real implementada nos formulários:
- ✅ `/pmo/pmo-principal/index.html`
- ✅ `/pmo/anexo-animal/index.html`
- ✅ `/pmo/anexo-vegetal/index.html`

---

## 🎯 Próximos Passos

Com o prompt corrigido, agora é possível:

1. **Criar novos formulários** seguindo o padrão correto:
   - `/pmo/anexo-cogumelo/` ✅ Pronto para criar
   - `/pmo/anexo-apicultura/` ✅ Pronto para criar
   - `/pmo/anexo-processamento/` ✅ Pronto para criar
   - `/pmo/dashboard/` ✅ Pronto para criar
   - `/pmo/relatorios/` ✅ Pronto para criar

2. **Garantir consistência** em todos os formulários futuros

3. **Manutenção facilitada** com documentação precisa

---

**Documento gerado em:** 2025-10-02
**Autor:** Claude Code Assistant
