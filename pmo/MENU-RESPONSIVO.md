# Menu Responsivo ao Escopo com Indicadores de Progresso

## 📋 Visão Geral

O sistema PMO agora possui um menu dinâmico que responde automaticamente ao escopo selecionado pelo usuário no PMO Principal, além de exibir indicadores visuais de progresso de preenchimento para cada anexo.

## ✨ Funcionalidades

### 1. **Menu Responsivo ao Escopo**
- O menu mostra/oculta automaticamente os anexos baseado nas atividades marcadas no PMO Principal
- Apenas anexos relevantes ao escopo selecionado são exibidos
- Sincronização automática entre abas/janelas

### 2. **Indicadores de Progresso**
- Badge visual ao lado de cada item do menu mostrando % de preenchimento
- Códigos de cor intuitivos:
  - ⚪ **0%** - Não iniciado (cinza)
  - 🔴 **1-33%** - Baixo progresso (vermelho)
  - 🟡 **34-66%** - Progresso médio (amarelo)
  - 🔵 **67-99%** - Progresso alto (azul)
  - ✅ **100%** - Completo (verde)

### 3. **Sincronização Automática**
- Mudanças no PMO Principal refletem instantaneamente no menu
- Progresso é salvo automaticamente no localStorage
- Atualização periódica a cada 30 segundos

## 🔧 Como Funciona

### Mapeamento de Atividades → Anexos

| Atividade (PMO Principal) | Anexo Habilitado |
|---------------------------|------------------|
| Hortaliças, Frutas, Grãos, Plantas Medicinais | 🌱 Produção Vegetal |
| Pecuária | 🐄 Produção Animal |
| Cogumelos | 🍄 Cogumelos |
| Apicultura | 🐝 Apicultura |
| Processamento | 🏭 Processamento + 🥗 Proc. Mínimo |

### Fluxo de Dados

```
┌─────────────────────┐
│   PMO Principal     │
│  (Seção 6)          │
│                     │
│ ☑ Hortaliças        │
│ ☑ Pecuária          │
│ ☐ Apicultura        │
└──────────┬──────────┘
           │
           ↓
    ┌──────────────┐
    │ ScopeManager │ ← Salva no localStorage
    └──────┬───────┘
           │
           ↓
    ┌─────────────────────────┐
    │    Menu Dashboard       │
    │                         │
    │ ✅ Produção Vegetal 75% │ ← Habilitado
    │ ✅ Produção Animal  50% │ ← Habilitado
    │ 🔒 Apicultura           │ ← Desabilitado/Oculto
    └─────────────────────────┘
```

## 📁 Arquivos Criados/Modificados

### Novos Arquivos

1. **`framework/components/scope-manager.js`**
   - Gerencia atividades selecionadas
   - Mapeia atividades → anexos
   - Salva/carrega do localStorage
   - Eventos customizados para sincronização

2. **`framework/components/progress-tracker.js`**
   - Calcula progresso de formulários
   - Rastreamento automático
   - Estatísticas detalhadas
   - Helper para campos obrigatórios

3. **`pmo/dashboard/menu-manager.js`**
   - Controla visibilidade do menu
   - Cria e atualiza badges
   - Sincroniza com scope manager
   - Mensagens de feedback

4. **`pmo/dashboard/menu-styles.css`**
   - Estilos para badges
   - Estados de menu (ativo/inativo)
   - Animações e transições
   - Responsividade

### Arquivos Modificados

1. **`pmo/pmo-principal/pmo-principal.js`**
   - Sincronização de atividades
   - Salvamento de progresso
   - Event listeners para checkboxes

2. **`pmo/pmo-principal/index.html`**
   - Import do scope-manager

3. **`pmo/dashboard/index.html`**
   - Import dos módulos
   - Inicialização do menu manager

4. **`pmo/anexo-vegetal/index.html`** (exemplo)
   - Auto-tracking de progresso
   - Integração com scope manager

## 🚀 Como Usar

### Para o Usuário

1. **Selecione o escopo no PMO Principal:**
   ```
   Seção 6: Atividades Orgânicas na Propriedade
   ☑ Marque as atividades que você desenvolve
   ```

2. **O menu se atualiza automaticamente:**
   - Apenas anexos relevantes aparecem
   - Badges mostram % de preenchimento

3. **Preencha os anexos habilitados:**
   - Progresso é calculado automaticamente
   - Badges atualizam em tempo real

### Para Desenvolvedores

#### Integrar em um novo anexo:

```html
<!-- No HTML do anexo -->
<script type="module" src="../../framework/components/scope-manager.js"></script>
<script type="module" src="../../framework/components/progress-tracker.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Auto-tracking de progresso
        PMOProgressTracker.autoTrack('form-id', 'anexo-id');
    });
</script>
```

#### Verificar se anexo está habilitado:

```javascript
if (window.PMOScopeManager) {
    const isEnabled = PMOScopeManager.isAnexoEnabled('anexo-vegetal');
    if (!isEnabled) {
        alert('Este anexo não está habilitado no seu escopo.');
    }
}
```

#### Obter progresso:

```javascript
// Progresso de um anexo específico
const progress = PMOScopeManager.getProgress('anexo-vegetal');

// Progresso de todos os anexos habilitados
const allProgress = PMOScopeManager.getAllProgress();
// { 'anexo-vegetal': 75, 'anexo-animal': 50 }

// Progresso geral (média)
const overall = PMOScopeManager.getOverallProgress();
```

## 🎨 Personalização CSS

### Cores dos Badges

Customize as cores em `menu-styles.css`:

```css
.progress-badge.progress-low {
    background-color: var(--error-light);
    color: var(--error-dark);
}
```

### Animações

Desabilitar animações:

```css
.progress-badge,
.nav-item {
    transition: none !important;
    animation: none !important;
}
```

## 📊 API do ScopeManager

### Métodos Principais

```javascript
// Salvar atividades
PMOScopeManager.saveActivities({
    'atividade_hortalicas': true,
    'atividade_pecuaria': true
});

// Obter atividades
const activities = PMOScopeManager.getActivities();

// Verificar atividade
const isActive = PMOScopeManager.isActivityActive('atividade_hortalicas');

// Obter anexos habilitados
const enabled = PMOScopeManager.getEnabledAnexos();
// ['anexo-vegetal', 'anexo-animal']

// Salvar progresso
PMOScopeManager.saveProgress('anexo-vegetal', 75);

// Obter progresso
const progress = PMOScopeManager.getProgress('anexo-vegetal');

// Debug
console.log(PMOScopeManager.debug());
```

## 📊 API do ProgressTracker

### Métodos Principais

```javascript
// Calcular progresso
const progress = PMOProgressTracker.calculateFormProgress(
    'form-id',
    'anexo-id' // opcional: salva automaticamente
);

// Auto-tracking
PMOProgressTracker.autoTrack('form-id', 'anexo-id', 2000);

// Estatísticas detalhadas
const stats = PMOProgressTracker.getDetailedProgress('form-id');
/*
{
    total: 50,
    filled: 30,
    empty: 20,
    percentage: 60,
    bySection: {
        'secao-1': { total: 10, filled: 8, percentage: 80 },
        'secao-2': { total: 15, filled: 5, percentage: 33 }
    }
}
*/

// Listar campos vazios
const emptyFields = PMOProgressTracker.getEmptyRequiredFields('form-id');
```

## 🔄 Eventos Customizados

### Escutar mudanças de escopo:

```javascript
window.addEventListener('pmo-scope-changed', (e) => {
    console.log('Atividades:', e.detail.activities);
    console.log('Anexos habilitados:', e.detail.enabledAnexos);
});
```

### Escutar mudanças de progresso:

```javascript
window.addEventListener('pmo-progress-changed', (e) => {
    console.log(`Anexo ${e.detail.anexoId}: ${e.detail.progress}%`);
});
```

## 🐛 Troubleshooting

### Menu não atualiza

1. Verifique se `scope-manager.js` está carregado
2. Verifique console para erros
3. Limpe localStorage: `PMOScopeManager.clear()`

### Progresso não é salvo

1. Verifique se `form-id` está correto
2. Verifique se campos têm atributo `required`
3. Verifique localStorage no DevTools

### Badges não aparecem

1. Verifique se `menu-styles.css` está carregado
2. Verifique se `menu-manager.js` foi inicializado
3. Verifique console para erros

## 📝 Próximas Melhorias

- [ ] Exportar progresso no PDF
- [ ] Notificações push de atualização
- [ ] Histórico de progresso (gráfico)
- [ ] Compartilhar progresso entre usuários (via API)
- [ ] Estimativa de tempo para completar
- [ ] Sugestões de campos para preencher

## 📄 Licença

Sistema PMO Digital - ANC
© 2024 Associação de Agricultura Natural de Campinas e Região
