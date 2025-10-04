# 🗺️ Guia Completo - Location Modal (Sistema de Localização por Popup)

## ✅ Implementação Concluída

Sistema de geolocalização via **modal popup reutilizável** que funciona em qualquer contexto:
- ✅ Localização única (Cadastro Geral PMO)
- ✅ Múltiplas localizações (Apicultura, Apiários)
- ✅ Botão inline discreto
- ✅ Auto-detecção de endereço
- ✅ Zero configuração necessária

---

## 📦 Arquivos Criados/Modificados

### Novos Componentes
1. **`framework/components/location-modal.js`** - Modal popup reutilizável
2. **`framework/core/pmo-framework-full.css`** - Estilos adicionados (CSS do modal)
3. **`teste-location-modal.html`** - Demonstração completa

### Arquivos Modificados
1. **`pmo/cadastro-geral-pmo/index.html`** - Botão 🗺️ adicionado
2. **`pmo/anexo-apicultura/index.html`** - Coluna GPS + botões 📍 adicionados

---

## 🎯 Como Funciona

### **Cenário 1: Localização Única (Cadastro Geral PMO)**

```
Usuário preenche endereço
    ↓
Clica no botão 🗺️ (ao lado do CEP)
    ↓
Modal abre com endereço auto-detectado
    ↓
Clica "Abrir Google Maps" → Maps abre em nova aba
    ↓
Encontra ponto exato → Copia coordenadas
    ↓
Cola no modal → Auto-separa lat/lon
    ↓
Confirma → Campos latitude/longitude preenchidos
    ↓
Modal fecha automaticamente
```

**Localização do botão:**
```html
<label for="cep">
    CEP
    <button type="button" class="btn-icon-inline"
            onclick="CadastroGeralPMO.buscarCEP()">🔍</button>
    <button type="button" class="btn-icon-inline"
            onclick="LocationModal.open({latInput: 'latitude', lonInput: 'longitude'})">
        🗺️
    </button>
</label>
```

---

### **Cenário 2: Múltiplas Localizações (Apicultura)**

```
Usuário adiciona linha "Apiário 1"
    ↓
Preenche endereço do apiário na tabela
    ↓
Clica no botão 📍 DAQUELA linha
    ↓
Modal abre com endereço DAQUELA linha específica
    ↓
Processo igual: Maps → Copiar → Colar
    ↓
Confirma → Lat/Lon preenchidos NAQUELA linha
    ↓
Modal fecha
    ↓
Repete para Apiário 2, 3, 4...
```

**Estrutura da tabela:**
```html
<th>GPS</th>
<th>Latitude</th>
<th>Longitude</th>
...
<tr>
    <td>
        <button type="button" class="btn-location-mini"
                onclick="abrirLocalizacaoApiario(this)">
            📍
        </button>
    </td>
    <td><input name="apiarios[0][lat]" readonly></td>
    <td><input name="apiarios[0][lon]" readonly></td>
</tr>
```

**Helper JavaScript:**
```javascript
function abrirLocalizacaoApiario(button) {
    const row = button.closest('tr');
    const enderecoInput = row.querySelector('input[name*="[endereco]"]');
    const latInput = row.querySelector('input[name*="[lat]"]');
    const lonInput = row.querySelector('input[name*="[lon]"]');

    LocationModal.open({
        latInput: latInput,
        lonInput: lonInput,
        address: enderecoInput.value
    });
}
```

---

## 🔧 API do LocationModal

### **Abrir Modal Básico**
```javascript
LocationModal.open({
    latInput: 'latitude',      // ID ou elemento do input de latitude
    lonInput: 'longitude',     // ID ou elemento do input de longitude
});
```

### **Abrir com Endereço Específico**
```javascript
LocationModal.open({
    latInput: 'latitude',
    lonInput: 'longitude',
    address: 'Rua X, 123, Bairro Y, Cidade Z'
});
```

### **Abrir com Auto-detecção de Campos**
```javascript
LocationModal.open({
    latInput: 'latitude',
    lonInput: 'longitude',
    addressFields: {
        endereco: 'endereco',
        bairro: 'bairro',
        municipio: 'municipio',
        uf: 'uf',
        cep: 'cep'
    }
});
```

### **Abrir com Callback**
```javascript
LocationModal.open({
    latInput: 'latitude',
    lonInput: 'longitude',
    onConfirm: function(coords) {
        console.log('Latitude:', coords.latitude);
        console.log('Longitude:', coords.longitude);
        // Fazer algo extra quando confirmar
    }
});
```

### **Fechar Modal Programaticamente**
```javascript
LocationModal.close();
```

---

## 🎨 Classes CSS Disponíveis

### **Botão Inline (ao lado de labels)**
```html
<button class="btn-icon-inline">🗺️</button>
```
- Background transparente
- Borda cinza
- Hover: azul
- Tamanho: 32x32px

### **Botão Mini (em células de tabela)**
```html
<button class="btn-location-mini">📍</button>
```
- Menor que inline
- Ideal para tabelas
- Mesmo estilo visual

### **Customizar Estilos**
```css
.btn-icon-inline {
    /* Seu estilo aqui */
}

.location-modal {
    /* Customizar modal */
}
```

---

## 📋 Como Integrar em Outros Formulários

### **Passo 1: Adicionar o Script**
```html
<script src="../../framework/components/location-modal.js"></script>
```

### **Passo 2: Adicionar Campos de Coordenadas**
```html
<input type="text" id="latitude" name="latitude" readonly>
<input type="text" id="longitude" name="longitude" readonly>
```

### **Passo 3: Adicionar Botão**

**Opção A: Botão Inline (em formulário)**
```html
<button type="button" class="btn-icon-inline"
        onclick="LocationModal.open({latInput: 'latitude', lonInput: 'longitude'})">
    🗺️
</button>
```

**Opção B: Botão em Tabela**
```html
<td>
    <button type="button" class="btn-location-mini"
            onclick="abrirLocalizacaoLinha(this)">
        📍
    </button>
</td>

<script>
function abrirLocalizacaoLinha(button) {
    const row = button.closest('tr');
    const latInput = row.querySelector('input[name*="lat"]');
    const lonInput = row.querySelector('input[name*="lon"]');
    const enderecoInput = row.querySelector('input[name*="endereco"]');

    LocationModal.open({
        latInput: latInput,
        lonInput: lonInput,
        address: enderecoInput ? enderecoInput.value : null
    });
}
</script>
```

---

## 🧪 Testar Agora

Abra no navegador:
- **`teste-location-modal.html`** - Demonstração interativa completa

**Coordenadas de teste (Campinas/SP):**
```
-22.9068467, -47.0632881
```

---

## ✨ Vantagens do Sistema

### **1. Modal Único Reutilizável**
- ✅ Um componente para todo o sistema
- ✅ Código limpo e manutenível
- ✅ Consistência de UX
- ✅ Fácil atualização

### **2. Flexibilidade Total**
- ✅ Funciona com 1 localização (Cadastro Geral)
- ✅ Funciona com N localizações (Apicultura)
- ✅ Auto-detecta campos de endereço
- ✅ Aceita endereço manual
- ✅ Suporta callbacks customizados

### **3. UX Otimizada**
- ✅ Botões inline discretos (não ocupa espaço)
- ✅ Popup rápido (não sai da página)
- ✅ Google Maps em nova aba
- ✅ Auto-separação de coordenadas
- ✅ Validação automática
- ✅ Feedback visual instantâneo

### **4. Zero Configuração**
- ✅ Funciona out-of-the-box
- ✅ Detecta campos automaticamente
- ✅ Estilos já incluídos
- ✅ Apenas adicionar o script

---

## 🎯 Casos de Uso

### **✅ Já Implementado**
- [x] Cadastro Geral PMO (localização da propriedade)
- [x] Anexo Apicultura (múltiplos apiários)

### **🔄 Pode ser Usado Em**
- [ ] Anexo Vegetal (parcelas/talhões com GPS)
- [ ] Anexo Animal (pastos/piquetes)
- [ ] Qualquer formulário que precise de coordenadas GPS

### **💡 Como Adicionar**
1. Incluir `location-modal.js`
2. Adicionar campos lat/lon
3. Adicionar botão com `LocationModal.open()`
4. Pronto!

---

## 📊 Comparação com Versão Anterior

| Aspecto | Versão Anterior | Versão Modal (Nova) |
|---------|-----------------|---------------------|
| **Tipo** | Seção inline fixa | Modal popup reutilizável |
| **Localização** | Ocupa espaço na página | Popup on-demand |
| **Reusabilidade** | Código duplicado | Componente único |
| **Múltiplas Coords** | Difícil | Fácil (tabelas) |
| **UX** | Sempre visível | Discreto, sob demanda |
| **Manutenção** | Alterar em cada form | Alterar em 1 lugar |

---

## 🐛 Troubleshooting

### **Modal não abre**
- Verifique se `location-modal.js` está carregado
- Abra o console: deve ter mensagem "LocationModal carregado"
- Verifique se IDs de latitude/longitude existem

### **Coordenadas não preenchem**
- Verifique se campos têm IDs corretos
- Console mostrará erros se IDs não encontrados
- Campos devem existir antes de abrir modal

### **Google Maps não abre**
- Popup blocker do navegador?
- Endereço vazio? Modal alertará

### **Botão não aparece**
- CSS carregado? Verifique `pmo-framework-full.css`
- Classe correta? `btn-icon-inline` ou `btn-location-mini`

---

## 📝 Changelog

**v2.0 - Sistema Modal Popup**
- ✅ Modal reutilizável criado
- ✅ Suporte para localização única
- ✅ Suporte para múltiplas localizações
- ✅ Botões inline discretos
- ✅ Auto-detecção de endereço
- ✅ Integrado no Cadastro Geral PMO
- ✅ Integrado no Anexo Apicultura
- ✅ Totalmente responsivo

---

**Desenvolvido para:** Sistema PMO ANC
**Versão:** 2.0
**Data:** 2025
