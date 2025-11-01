# Prompt Universal para Criação de Formulários PMO - Plano de Manejo Orgânico

## Contexto
Crie formulários HTML5 responsivos para o Plano de Manejo Orgânico (PMO) da ANC utilizando os schemas do diretório `schemas/pmo/` e os componentes oficiais do framework localizado em `framework/`. Cada tela deve respeitar a arquitetura de navegação dinâmica (Flow Navigator), gerenciamento de escopo (Scope Manager) e salvamento local (Storage + Storage Manager), garantindo experiência consistente entre os módulos.

## 📦 Pré-requisitos e Estrutura do Projeto

### Schemas JSON Disponíveis
Todos os schemas ficam em `schemas/pmo/` e são indexados por `schemas/pmo/manifest.json`:

1. **schema-pmo-geral.json** — Cadastro Geral (cadastro principal obrigatório).
2. **schema-pmo-vegetal.json** — Produção Primária Vegetal.
3. **schema-pmo-animal.json** — Produção Animal.
4. **schema-pmo-cogumelo.json** — Produção de Cogumelos.
5. **schema-pmo-apicultura.json** — Apicultura / Meliponicultura.
6. **schema-pmo-processamento_minimo.json** — Processamento Mínimo.
7. **schema-pmo-processamento.json** — Processamento de Produtos.

Use o `manifest.json` para mapear slug ↔ título ↔ anexo e gerar o menu/contexto automaticamente.

### Framework PMO Existente

#### Core
- `framework/core/pmo-framework-full.css` — Design system completo com variáveis, componentes e responsividade.
- `framework/core/pmo-framework.js` — Núcleo JS com registro de módulos, notificações simples (`PMOFramework.notify`) e utilidades gerais.

#### Componentes Essenciais (JS)
- `framework/components/pmo-storage-manager.js` — Registro de PMOs, controle de formulários ativos e sincronização com localStorage.
- `framework/components/scope-manager.js` — Controle de escopos selecionados, filtragem de anexos e badges de status.
- `framework/components/flow-navigator.js` — Navegador lateral/topo que exibe a ordem dos anexos e progresso de cada módulo.
- `framework/components/progress-tracker.js` — Calcula preenchimento (`PMOProgressTracker`) e dispara eventos `pmo-progress-changed`.
- `framework/components/pmo-tables.js` — Sistema de tabelas dinâmicas (`PMOTable`) com suporte a duplicar/remover linhas.
- `framework/components/dynamic-fields.js` — Campos dinâmicos e condicionais (`PMODynamicFields`) para coleções complexas.
- `framework/components/storage.js` — Abstração de armazenamento (`PMOStorage`) com suporte a localStorage e IndexedDB.
- `framework/components/export.js` — Exportação de dados (JSON, CSV, PDF) via `PMOExport`.
- `framework/components/auto-save-navigation.js` — Salvamento automático ao navegar entre páginas (`AutoSaveNavigation`).
- `framework/components/location-picker.js` / `location-modal.js` — Seleção e validação de coordenadas/endereços.
- `framework/components/timeline.js`, `avaliacao-storage.js` e demais utilitários menores — apoio a fluxos específicos (relatórios, avaliações, dashboards).

Arquivos `import.js`, `navigation.js`, `notifications.js`, `progress.js` e `upload.js` existem como stubs (0 bytes) e estão listados na seção TODO.

#### Utilitários
- `framework/utils/formatters.js` — Máscaras (`PMOMasks`) e formatadores (`PMOFormatters`).
- `framework/utils/api-client.js` — Cliente HTTP básico para integrações.
- `framework/components/validators.js` — Validação de CPF/CNPJ/CEP/datas.
- `framework/components/pmo-storage-manager.js` + `scope-manager.js` + `flow-navigator.js` trabalham em conjunto, portanto importe-os sempre que o formulário fizer parte do fluxo oficial.

O arquivo `framework/README.md` detalha classes CSS e convenções adicionais; consulte-o para aprofundar.

#### Convenções de Codificação
- Todos os arquivos novos ou modificados devem ser gravados em UTF-8 (sem BOM).

## 🧭 Arquitetura Recomendada

- **PMOStorage + PMOStorageManager**: persistem dados do formulário e sincronizam com o PMO ativo.
- **PMOScopeManager**: salva atividades selecionadas e habilita/desabilita anexos no menu.
- **FlowNavigator**: mostra sequência de preenchimento e progresso por anexo; depende dos eventos de progresso e escopos.
- **PMOProgressTracker**: calcula percentuais e dispara `pmo-progress-changed`.
- **PMOTable / PMODynamicFields**: gerenciam coleções repetíveis e linhas dinâmicas.
- **PMOMasks / PMOFormatters / validators**: padronizam entradas.
- **AutoSaveNavigation**: impõe salvamento antes da navegação.
- Sempre dispare `document.dispatchEvent(new CustomEvent('pmo-form-saved'))` após salvar para atualizar Flow Navigator e cards.

### Layout Base HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PMO [Título] - ANC</title>
    <link rel="stylesheet" href="../../framework/core/pmo-framework-full.css">
    <link rel="stylesheet" href="./formulario.css"><!-- opcional -->
    <link rel="icon" type="image/png" href="../../assets/images/favicon.png">
</head>
<body>
    <header class="pmo-header">
        <div class="pmo-container">
            <div class="header-content">
                <h1>📋 [Nome do formulário]</h1>
                <p class="subtitle">Plano de Manejo Orgânico - ANC</p>
            </div>

            <nav class="pmo-navigation">
                <a href="../dashboard/index.html">🏠 Dashboard</a>
                <a href="../pmo-principal/index.html"
                   data-form-type="cadastro-geral-pmo"
                   class="active">📋 Cadastro Geral</a>
                <a href="../anexo-vegetal/index.html" data-form-type="anexo-vegetal">🌱 Anexo Vegetal</a>
                <a href="../anexo-animal/index.html" data-form-type="anexo-animal">🐄 Anexo Animal</a>
                <a href="../anexo-cogumelo/index.html" data-form-type="anexo-cogumelo">🍄 Anexo Cogumelo</a>
                <a href="../anexo-apicultura/index.html" data-form-type="anexo-apicultura">🐝 Anexo Apicultura</a>
                <a href="../anexo-processamento/index.html" data-form-type="anexo-processamento">🏭 Processamento</a>
                <a href="../anexo-processamentominimo/index.html" data-form-type="anexo-processamentominimo">🥗 Proc. Mínimo</a>
                <a href="../relatorios/index.html">📊 Relatórios</a>
            </nav>
        </div>
    </header>

    <!-- Flow Navigator renderiza aqui -->
    <section id="flow-navigator" class="pmo-container"></section>

    <main class="pmo-container">
        <form id="form-[slug]" class="pmo-form" autocomplete="off">
            <!-- Seções geradas a partir do schema -->
            <section class="form-section" id="sec-identificacao">
                <h2>1. Identificação</h2>
                <div class="section-info">
                    <p class="instruction">Preencha conforme o schema `schema-pmo-geral.json`.</p>
                </div>

                <div class="form-grid">
                    <div class="field-wrapper">
                        <label for="nome_produtor">
                            Nome do produtor <span class="required">*</span>
                        </label>
                        <input id="nome_produtor"
                               name="nome_produtor"
                               type="text"
                               required>
                    </div>

                    <div class="field-wrapper">
                        <label for="cpf_produtor">CPF <span class="required">*</span></label>
                        <input id="cpf_produtor"
                               name="cpf_produtor"
                               type="text"
                               data-mask="cpf"
                               required>
                    </div>
                </div>
            </section>
        </form>
    </main>

    <footer class="pmo-footer">
        <p>&copy; 2024 ANC - Associação de Agricultura Natural de Campinas e Região</p>
        <p>Sistema PMO - Plano de Manejo Orgânico</p>
    </footer>

    <!-- Scripts do framework (ordem importa) -->
    <script src="../../framework/core/pmo-framework.js"></script>
    <script src="../../framework/components/pmo-storage-manager.js"></script>
    <script src="../../framework/components/scope-manager.js"></script>
    <script src="../../framework/components/progress-tracker.js"></script>
    <script src="../../framework/components/pmo-tables.js"></script>
    <script src="../../framework/components/dynamic-fields.js"></script>
    <script src="../../framework/components/flow-navigator.js"></script>
    <script src="../../framework/components/auto-save-navigation.js"></script>
    <script src="../../framework/components/export.js"></script>
    <script src="../../framework/utils/formatters.js"></script>
    <script src="../../framework/components/storage.js"></script>
    <script src="./formulario.js"></script>
</body>
</html>
```

Ajuste caminhos relativos quando o formulário estiver em outra pasta (ex.: `../../` → `../../../`).

### Inicialização JavaScript Recomendada (`formulario.js`)

```javascript
const CadastroGeralPMO = {
    config: {
        moduleName: 'cadastro-geral-pmo',
        storageKey: 'cadastro-geral-pmo-form-data',
        anexoId: 'cadastro-geral-pmo'
    },
    state: {
        storage: null,
        isModified: false,
        autoSaveTimer: null
    },

    async init() {
        this.form = document.getElementById('form-cadastro-geral-pmo');
        if (!this.form) {
            console.warn('Formulário não encontrado');
            return;
        }

        this.state.storage = new PMOStorage({ storageType: 'localStorage' });
        await this.state.storage.init();

        await this.restore();
        this.bindEvents();

        PMOTable.initAll();
        PMODynamicFields.init();
        PMOMasks.init();

        PMOProgressTracker.autoTrack(this.form.id, this.config.anexoId);
        PMOScopeManager.applyDashboardFilters('.pmo-navigation');

        // Auto-save periódico (opcional)
        this.state.autoSaveTimer = setInterval(() => this.salvar(true), 30000);

        // Exige salvar antes de navegar
        AutoSaveNavigation.setup(this, '.pmo-navigation a');
    },

    bindEvents() {
        this.form.addEventListener('input', () => {
            this.state.isModified = true;
        });

        this.form.addEventListener('change', (event) => {
            if (event.target.name?.startsWith('escopo_') || event.target.name === 'pretende_certificar') {
                PMOScopeManager.syncFromCadastroGeralPMO();
            }
        });

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.salvar();
        });
    },

    serialize() {
        const data = {};
        const formData = new FormData(this.form);

        formData.forEach((value, key) => {
            if (data[key]) {
                if (!Array.isArray(data[key])) data[key] = [data[key]];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });

        return data;
    },

    async restore() {
        const saved = await this.state.storage.load(this.config.storageKey);
        if (!saved) return;

        Object.entries(saved).forEach(([name, value]) => {
            const field = this.form.elements[name];
            if (!field) return;

            if (field instanceof RadioNodeList) {
                [...field].forEach(item => item.checked = Array.isArray(value) ? value.includes(item.value) : item.value === value);
            } else if (Array.isArray(value)) {
                value.forEach(val => {
                    const input = this.form.querySelector(`[name="${name}"][value="${val}"]`);
                    if (input) input.checked = true;
                });
            } else if (field.type === 'checkbox') {
                field.checked = value === true || value === 'on';
            } else {
                field.value = value;
            }
        });

        PMOScopeManager.syncFromCadastroGeralPMO();
    },

    async salvar(silent = false) {
        const data = this.serialize();
        await this.state.storage.save(this.config.storageKey, data);

        const ativo = PMOStorageManager.getActivePMO();
        if (ativo) {
            PMOStorageManager.updateFormulario(ativo.id, this.config.moduleName, data);
        }

        this.state.isModified = false;

        document.dispatchEvent(new CustomEvent('pmo-form-saved', {
            detail: { module: this.config.moduleName }
        }));

        if (!silent) {
            PMOFramework.notify('Dados salvos com sucesso!', 'success');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CadastroGeralPMO.init();
});
```

Adapte `moduleName`, `storageKey` e `anexoId` para cada formulário. Use `PMOStorageManager.createPMO()` para iniciar um PMO quando necessário (ex.: fluxo de cadastro).

## 🔧 APIs e Helpers Fundamentais

### Armazenamento Local (`PMOStorage`)
```javascript
const storage = new PMOStorage({ storageType: 'localStorage' });
await storage.init();
await storage.save('anexo-vegetal-form-data', payload);
const restored = await storage.load('anexo-vegetal-form-data');
await storage.remove('anexo-vegetal-form-data');
```

### Gerenciador de PMO (`PMOStorageManager`)
```javascript
const pmoId = PMOStorageManager.createPMO({
    cpf_cnpj: '123.456.789-00',
    nome: 'Produtor Exemplo',
    unidade: 'Sítio Boa Terra',
    ano_vigente: 2024
});
PMOStorageManager.setActivePMO(pmoId);
const ativo = PMOStorageManager.getActivePMO();
PMOStorageManager.updateFormulario(ativo.id, 'anexo-vegetal', dados);
const dadosVegetal = PMOStorageManager.getFormulario(ativo.id, 'anexo-vegetal');
```

### Escopos e Navegação (`PMOScopeManager`, `FlowNavigator`)
```javascript
PMOScopeManager.saveActivities({ escopo_pecuaria: true, escopo_apicultura: false });
PMOScopeManager.applyDashboardFilters('.pmo-navigation');
window.addEventListener('pmo-scope-changed', ({ detail }) => {
    console.log(detail.enabledAnexos);
});
/* FlowNavigator inicializa automaticamente ao encontrar #flow-navigator,
   mas é possível forçar uma renderização manual: */
const flowNavigator = new FlowNavigator();
flowNavigator.init('flow-navigator');
```

### Progresso (`PMOProgressTracker`)
```javascript
const percent = PMOProgressTracker.calculateFormProgress('form-anexo-vegetal', 'anexo-vegetal');
console.log(percent + '% completo');

window.addEventListener('pmo-progress-changed', ({ detail }) => {
    console.log(detail.anexoId, detail.progress);
});
```

### Tabelas Dinâmicas (`PMOTable`)
```html
<table id="tabela-produtos" class="dynamic-table">
    <thead>...</thead>
    <tbody>
        <tr data-template>
            <td class="row-number">1</td>
            <td><input name="produto_nome" data-field-name="produto_nome" required></td>
            <td><button type="button" data-remove-row class="btn btn-danger btn-sm">Remover</button></td>
        </tr>
    </tbody>
</table>
<button type="button" data-add-row data-target="tabela-produtos" class="btn btn-add">Adicionar produto</button>
```

```javascript
PMOTable.addRow('tabela-produtos');
PMOTable.removeRow(buttonElement);
PMOTable.initAll(); // sempre chamar após renderizar a tabela
```

### Campos Dinâmicos (`PMODynamicFields`)
```javascript
PMODynamicFields.init();
const dadosTabela = PMODynamicFields.getTableData('tabela-produtos');
PMODynamicFields.setTableData('tabela-produtos', dadosTabela);
```

### Máscaras e Formatação (`PMOMasks`, `PMOFormatters`)
```javascript
PMOMasks.init();
const cpfFormatado = PMOFormatters.formatCPF('12345678901');
const moeda = PMOFormatters.formatCurrency(1250.5);
```

### Validação (`PMOValidators`)
```javascript
PMOValidators.validateCPF('123.456.789-09'); // true/false
PMOValidators.validateCNPJ('12.345.678/0001-90');
PMOValidators.validateCEP('13100-000');
```

### Exportação (`PMOExport`)
```javascript
PMOExport.toJSON(dadosFormulario, 'anexo-vegetal.json');
PMOExport.toCSV(document.querySelector('#tabela-produtos'), 'produtos.csv');
await PMOExport.toPDF(document.getElementById('form-anexo-vegetal'), 'anexo-vegetal.pdf');
```

### Localização (`LocationPicker`)
```javascript
LocationPicker.init({
    coordsInputId: 'coordenadas-google-maps',
    latitudeId: 'latitude',
    longitudeId: 'longitude'
});
LocationPicker.openGoogleMaps();
```

### Navegação com Auto-Save (`AutoSaveNavigation`)
```javascript
AutoSaveNavigation.setup(CadastroGeralPMO, '.pmo-navigation a');
```

## 🎨 Design System

Priorize as variáveis e classes utilitárias do framework:

- **Cores**: `var(--primary)`, `var(--secondary)`, `var(--success)`, `var(--warning)`, `var(--error)`, `var(--gray-50)` ... `var(--gray-900)`.
- **Espaçamentos**: `var(--spacing-xs)` a `var(--spacing-2xl)`.
- **Tipografia**: `var(--text-xs)` a `var(--text-3xl)`, `var(--font-sans)`.
- **Raios e sombras**: `var(--radius-sm|md|lg)`, `var(--shadow-sm|md|lg)`.
- **Containers/Formulário**: `.pmo-container`, `.pmo-form`, `.form-section`, `.form-grid`, `.field-wrapper`, `.form-actions`.
- **Botões**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-warning`, `.btn-danger`, `.btn-add`, `.btn-sm`, `.btn-lg`.
- **Alertas/Informativos**: `.alert`, `.alert-success`, `.alert-warning`, `.alert-error`, `.alert-info`, `.section-info`.
- **Tabelas**: `.dynamic-table`, `.table-wrapper`, `.action-buttons`.
- **Input states**: `.checkbox-enhanced`, `.radio-group`, `.hidden`, `.text-center`, `.col-span-2` a `.col-span-4`.
- **Flow Navigator**: `.flow-navigator`, `.flow-step`, `.flow-progress`, `.flow-current-indicator` (definidos em `pmo-framework-full.css`).

Consulte `framework/README.md` para uma lista completa e exemplos de composição.

## ✅ Checklist de Implementação

- [ ] Ler o schema correspondente em `schemas/pmo/` e gerar as seções do formulário seguindo a ordem definida.
- [ ] Configurar header/nav com `data-form-type` e aplicar `PMOScopeManager.applyDashboardFilters`.
- [ ] Instanciar `PMOStorage`, restaurar valores salvos e habilitar auto-save antes de navegar.
- [ ] Registrar progresso com `PMOProgressTracker.autoTrack` e disparar `pmo-form-saved` após salvar.
- [ ] Usar `PMOTable` / `PMODynamicFields` para coleções, evitando clones manuais.
- [ ] Aplicar `PMOMasks.init()` + `PMOValidators` ao validar envios.
- [ ] Usar `PMOFramework.notify` (ou implementar `PMONotifications`) para feedback ao usuário.
- [ ] Incluir exportações relevantes (`PMOExport`) quando solicitadas pelos requisitos do anexo.
- [ ] Garantir compatibilidade mobile testando breakpoints definidos no design system.

## 📋 TODO do Framework

- [ ] Implementar `framework/components/notifications.js` e unificar notificações (substituir fallbacks de `PMOFramework.notify` / `LocationPicker.showToast`).
- [ ] Preencher stubs `framework/components/import.js`, `navigation.js`, `progress.js` e `upload.js` ou removê-los se obsoletos.
- [ ] Publicar implementações de referência atualizadas em `pmo/` (HTML, JS e CSS) geradas a partir dos schemas mais recentes.
- [ ] Automatizar build/minificação de `pmo-framework.js` e `pmo-framework-full.css` (`*.min.*` estão vazios).
- [ ] Documentar no `framework/README.md` o fluxo completo de `PMOStorageManager`, `PMOScopeManager` e `FlowNavigator` com exemplos.
- [ ] Mapear integração de busca de CEP (substituir chamada inexistente a `PMOAddress.fetchCEP` por um utilitário real ou serviço externo configurável).
