# Prompt para Criação de Formulário Digital PMO - Plano de Manejo Orgânico (COMPLETO)

## Contexto
Crie um formulário HTML5 responsivo e interativo para digitalização do Plano de Manejo Orgânico (PMO) da ANC - Associação de Agricultura Natural de Campinas, seguindo rigorosamente a estrutura do documento original para certificação orgânica participativa.

## Requisitos Técnicos

### 1. Estrutura Base
- Use HTML5 semântico com tags apropriadas (`<form>`, `<fieldset>`, `<legend>`, `<section>`)
- Implemente CSS moderno com design limpo e profissional
- JavaScript vanilla para validações e interatividade
- Layout responsivo que funcione em desktop, tablet e mobile
- Salvar dados localmente (localStorage) com auto-save a cada 30 segundos
- Sistema de upload de arquivos com preview
- Botão de exportar dados em JSON e PDF

### 2. CAMPOS DINÂMICOS (Adicionar/Remover Itens)

#### A) CONTATOS MÚLTIPLOS
```javascript
// Estrutura para múltiplos telefones
const telefoneFields = {
  max: 5,
  fields: [
    { type: 'tel', mask: '(00) 00000-0000', label: 'Telefone Principal' },
    { type: 'tel', mask: '(00) 00000-0000', label: 'Telefone Adicional' },
    { type: 'select', options: ['Celular', 'Fixo', 'WhatsApp', 'Comercial'], label: 'Tipo' }
  ],
  addButton: '➕ Adicionar Telefone',
  removeButton: '❌',
  validation: 'Pelo menos 1 telefone obrigatório'
}

// Estrutura para múltiplos emails
const emailFields = {
  max: 3,
  fields: [
    { type: 'email', label: 'Email', placeholder: 'exemplo@dominio.com' },
    { type: 'select', options: ['Principal', 'Alternativo', 'Comercial'], label: 'Tipo' }
  ],
  addButton: '➕ Adicionar Email',
  validation: 'Pelo menos 1 email obrigatório'
}
```

#### B) RESPONSÁVEIS/FORNECEDORES (Tabela Dinâmica)
```html
<div class="dynamic-table" data-min="1" data-max="4">
  <table id="tabela-fornecedores">
    <thead>
      <tr>
        <th>Nome Completo <span class="required">*</span></th>
        <th>CPF <span class="required">*</span></th>
        <th>Data de Nascimento <span class="required">*</span></th>
        <th>Telefone</th>
        <th>Email</th>
        <th>Função/Cargo</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody id="fornecedores-body">
      <!-- Linhas adicionadas dinamicamente -->
    </tbody>
  </table>
  <button type="button" class="btn-add-row">➕ Adicionar Responsável (máx. 4)</button>
</div>
```

### 3. SEÇÃO ESPECIAL: CROQUI DA PROPRIEDADE

```html
<section id="croqui-propriedade" class="form-section">
  <h2>4. Croqui da Propriedade</h2>
  
  <div class="croqui-info">
    <p class="instruction">ℹ️ O croqui pode ser desenhado à mão, criado no computador, ou usar imagem do Google Maps/Earth</p>
    <p class="alert">⚠️ OBRIGATÓRIO incluir no croqui:</p>
    <ul class="croqui-requirements">
      <li>☑ Entrada da propriedade</li>
      <li>☑ Casa/Residência (se houver)</li>
      <li>☑ Armazéns e galpões</li>
      <li>☑ Local de guarda de insumos</li>
      <li>☑ Rios e cursos d'água</li>
      <li>☑ Áreas de plantio (talhões, pomares, canteiros)</li>
      <li>☑ Barreiras vegetais</li>
      <li>☑ Culturas perenes</li>
      <li>☑ Locais de processamento</li>
      <li>☑ Composteira</li>
      <li>☑ Estradas</li>
      <li>☑ Áreas de mata</li>
      <li>☑ Instalações animais (se houver)</li>
      <li>☑ Vizinhos confrontantes e suas atividades</li>
    </ul>
  </div>
  
  <div class="upload-area" id="croqui-upload">
    <div class="upload-options">
      <button type="button" onclick="selectUploadType('file')">📎 Upload de Arquivo</button>
      <button type="button" onclick="selectUploadType('draw')">✏️ Desenhar Online</button>
      <button type="button" onclick="selectUploadType('maps')">🗺️ Google Maps</button>
    </div>
    
    <!-- Área de Upload de Arquivo -->
    <div id="file-upload-area" class="upload-type">
      <input type="file" 
             id="croqui-file" 
             name="croqui_file"
             accept="image/*,.pdf"
             onchange="previewCroqui(this)">
      <label for="croqui-file" class="file-label">
        <span>📁 Clique ou arraste o arquivo aqui</span>
        <small>Formatos aceitos: JPG, PNG, PDF (máx. 10MB)</small>
      </label>
      <div id="croqui-preview" class="file-preview"></div>
    </div>
    
    <!-- Canvas para Desenho -->
    <div id="draw-area" class="upload-type" style="display:none;">
      <canvas id="drawing-canvas" width="800" height="600"></canvas>
      <div class="drawing-tools">
        <button onclick="setTool('pen')">✏️ Caneta</button>
        <button onclick="setTool('eraser')">🧹 Borracha</button>
        <button onclick="setTool('text')">📝 Texto</button>
        <button onclick="clearCanvas()">🗑️ Limpar</button>
        <button onclick="saveDrawing()">💾 Salvar Desenho</button>
      </div>
    </div>
    
    <!-- Embed Google Maps -->
    <div id="maps-area" class="upload-type" style="display:none;">
      <input type="text" 
             placeholder="Cole aqui o link do Google Maps da sua propriedade"
             onchange="embedMap(this.value)">
      <div id="map-embed"></div>
      <button onclick="captureMap()">📸 Capturar Imagem do Mapa</button>
    </div>
  </div>
  
  <div class="croqui-validation">
    <h4>Validação do Croqui:</h4>
    <checklist id="croqui-checklist">
      <!-- Checklist dinâmica dos itens obrigatórios -->
    </checklist>
  </div>
</section>
```

### 4. SEÇÃO: LISTA DE PRODUTOS (Tabela Dinâmica Complexa)

```html
<section id="lista-produtos" class="form-section">
  <h2>5. Lista de Produtos para Certificação</h2>
  
  <div class="section-warning">
    <p>⚠️ ATENÇÃO: Esta lista constará no certificado. Apenas produtos aqui listados poderão ser comercializados em 2026</p>
  </div>
  
  <div class="products-table-wrapper">
    <table id="tabela-produtos" class="dynamic-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Produto/Variedade*</th>
          <th>Talhão/Área*</th>
          <th>Estimativa Produção*</th>
          <th>Período</th>
          <th>Peso (kg/und)</th>
          <th>Origem Muda</th>
          <th>Origem Semente</th>
          <th>Tipo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody id="produtos-body">
        <!-- Linhas dinâmicas -->
      </tbody>
    </table>
    
    <div class="table-actions">
      <button type="button" onclick="addProductRow()">➕ Adicionar Produto</button>
      <button type="button" onclick="importProductList()">📥 Importar Lista</button>
      <button type="button" onclick="sortProducts()">🔤 Ordenar Alfabeticamente</button>
    </div>
  </div>
  
  <!-- Template para nova linha de produto -->
  <template id="product-row-template">
    <tr class="product-row">
      <td class="row-number"></td>
      <td>
        <input type="text" name="produto_nome[]" required 
               placeholder="Ex: Alface Crespa" 
               list="produtos-sugestoes">
      </td>
      <td>
        <input type="text" name="produto_talhao[]" required 
               placeholder="Ex: Talhão 2 e 4">
      </td>
      <td>
        <div class="compound-field">
          <input type="number" name="produto_qtd[]" required min="0" step="0.01">
          <select name="produto_unidade[]">
            <option>unidade</option>
            <option>maço</option>
            <option>kg</option>
            <option>bandeja</option>
            <option>dúzia</option>
            <option>caixa</option>
          </select>
        </div>
      </td>
      <td>
        <select name="produto_periodo[]">
          <option>semanal</option>
          <option>quinzenal</option>
          <option>mensal</option>
          <option>bimestral</option>
          <option>semestral</option>
          <option>anual</option>
        </select>
      </td>
      <td>
        <input type="number" name="produto_peso[]" step="0.001" min="0">
      </td>
      <td>
        <select name="produto_origem_muda[]" onchange="checkCustom(this)">
          <option>N/A</option>
          <option>Própria</option>
          <option>Viveirista local</option>
          <option>Doada</option>
          <option value="custom">Outro...</option>
        </select>
        <input type="text" name="produto_origem_muda_custom[]" 
               style="display:none" 
               placeholder="Especifique">
      </td>
      <td>
        <input type="text" name="produto_origem_semente[]" 
               placeholder="Ex: Isla, Feltrin, Própria">
      </td>
      <td>
        <div class="checkbox-group">
          <label><input type="checkbox" name="produto_tipo_conv_trat[]"> Conv. c/ Trat.</label>
          <label><input type="checkbox" name="produto_tipo_conv_sem[]"> Conv. s/ Trat.</label>
          <label><input type="checkbox" name="produto_tipo_org[]"> Orgânica</label>
        </div>
      </td>
      <td>
        <button type="button" onclick="duplicateRow(this)" title="Duplicar">📋</button>
        <button type="button" onclick="removeRow(this)" title="Remover">❌</button>
      </td>
    </tr>
  </template>
</section>
```

### 5. SEÇÃO: UPLOAD DE DOCUMENTOS COMPLEMENTARES

```html
<section id="documentos-complementares" class="form-section">
  <h2>Documentos Complementares</h2>
  
  <div class="documents-upload">
    <!-- CAR - Cadastro Ambiental Rural -->
    <div class="document-type">
      <h3>CAR - Cadastro Ambiental Rural</h3>
      <select name="car_status" onchange="toggleCarUpload(this)">
        <option value="">Selecione...</option>
        <option value="nao_iniciado">Ainda não dei entrada</option>
        <option value="aguardando">Aguardando aprovação</option>
        <option value="aprovado">Aprovado</option>
      </select>
      <div id="car-upload" style="display:none;">
        <input type="file" name="car_documento" accept=".pdf,.jpg,.png">
        <small>Upload do protocolo ou documento aprovado</small>
      </div>
    </div>
    
    <!-- Análise de Água -->
    <div class="document-type">
      <h3>Análise de Água para Irrigação</h3>
      <input type="file" name="analise_agua[]" accept=".pdf" multiple>
      <select name="periodicidade_analise">
        <option>Anualmente</option>
        <option>A cada 2 anos</option>
        <option>A cada 3 anos ou mais</option>
      </select>
      <small>Última análise realizada em: <input type="date" name="data_ultima_analise"></small>
    </div>
    
    <!-- Certificados Anteriores -->
    <div class="document-type">
      <h3>Certificados Anteriores</h3>
      <div id="certificados-anteriores">
        <button type="button" onclick="addCertificado()">➕ Adicionar Certificado</button>
      </div>
    </div>
    
    <!-- Contratos (para arrendamento/parceria) -->
    <div class="document-type" id="contratos-section" style="display:none;">
      <h3>Contrato de Arrendamento/Parceria/Comodato</h3>
      <input type="file" name="contrato_terra" accept=".pdf">
      <input type="date" name="contrato_validade" placeholder="Validade do contrato">
    </div>
    
    <!-- Notas Fiscais de Insumos -->
    <div class="document-type">
      <h3>Notas Fiscais de Insumos Orgânicos</h3>
      <div class="multi-upload">
        <input type="file" name="nf_insumos[]" accept=".pdf,.jpg,.png" multiple>
        <div class="uploaded-files-list" id="nf-list"></div>
      </div>
    </div>
    
    <!-- Declarações -->
    <div class="document-type">
      <h3>Declarações de Vizinhos/Associações</h3>
      <input type="file" name="declaracoes[]" accept=".pdf" multiple>
      <textarea name="declaracao_descricao" 
                placeholder="Descreva brevemente o conteúdo das declarações"></textarea>
    </div>
    
    <!-- Fotos da Propriedade -->
    <div class="document-type">
      <h3>Fotos da Propriedade</h3>
      <div class="photo-upload">
        <input type="file" 
               name="fotos_propriedade[]" 
               accept="image/*" 
               multiple 
               onchange="previewPhotos(this)">
        <div id="photos-preview" class="photos-grid"></div>
      </div>
      <small>Recomendado: fotos dos talhões, instalações, barreiras vegetais</small>
    </div>
    
    <!-- Outros Documentos -->
    <div class="document-type">
      <h3>Outros Documentos Relevantes</h3>
      <div id="outros-documentos" class="dynamic-documents">
        <button type="button" onclick="addOutroDocumento()">➕ Adicionar Documento</button>
      </div>
    </div>
  </div>
</section>
```

### 6. SEÇÃO: INSUMOS (Tabela Dinâmica)

```html
<section id="insumos-utilizados" class="form-section">
  <h2>Insumos e Produtos Comerciais</h2>
  
  <div class="insumos-tabs">
    <button class="tab-btn active" onclick="showTab('fertilizantes')">Fertilizantes</button>
    <button class="tab-btn" onclick="showTab('fitossanitarios')">Fitossanitários</button>
    <button class="tab-btn" onclick="showTab('sementes')">Sementes/Mudas</button>
    <button class="tab-btn" onclick="showTab('substratos')">Substratos</button>
  </div>
  
  <div id="fertilizantes" class="tab-content">
    <table class="dynamic-table">
      <thead>
        <tr>
          <th>Nome Comercial</th>
          <th>Ingrediente Ativo</th>
          <th>Fabricante</th>
          <th>Fornecedor</th>
          <th>Para quais culturas</th>
          <th>Frequência de Uso</th>
          <th>Certificado Orgânico</th>
          <th>Upload NF/Certificado</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody id="fertilizantes-body">
        <!-- Linhas dinâmicas -->
      </tbody>
    </table>
    <button onclick="addInsumoRow('fertilizantes')">➕ Adicionar Fertilizante</button>
  </div>
  
  <!-- Repetir estrutura similar para outras abas -->
</section>
```

### 7. VALIDAÇÕES E FUNCIONALIDADES ESPECIAIS

#### A) Sistema de Upload com Preview
```javascript
function setupFileUpload() {
  // Preview de imagens
  function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];
    
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.innerHTML = `
          <img src="${e.target.result}" alt="Preview">
          <button onclick="removeFile('${input.id}')">❌ Remover</button>
        `;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Validação de tamanho
  function validateFileSize(input, maxMB = 10) {
    const file = input.files[0];
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Arquivo muito grande. Máximo: ${maxMB}MB`);
      input.value = '';
      return false;
    }
    return true;
  }
  
  // Upload múltiplo com lista
  function handleMultipleFiles(input, listId) {
    const fileList = document.getElementById(listId);
    const files = Array.from(input.files);
    
    files.forEach(file => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `
        <span>📄 ${file.name}</span>
        <span class="file-size">(${formatFileSize(file.size)})</span>
        <button onclick="removeFromList(this)">❌</button>
      `;
      fileList.appendChild(item);
    });
  }
}
```

#### B) Campos Dinâmicos com Limite
```javascript
class DynamicFieldManager {
  constructor(containerId, options) {
    this.container = document.getElementById(containerId);
    this.min = options.min || 1;
    this.max = options.max || 10;
    this.count = 0;
    this.template = options.template;
  }
  
  add() {
    if (this.count >= this.max) {
      alert(`Máximo de ${this.max} itens permitidos`);
      return;
    }
    
    const newItem = this.template.cloneNode(true);
    newItem.id = `${this.container.id}_${++this.count}`;
    this.container.appendChild(newItem);
    this.updateButtons();
  }
  
  remove(item) {
    if (this.count <= this.min) {
      alert(`Mínimo de ${this.min} item(s) obrigatório(s)`);
      return;
    }
    
    item.remove();
    this.count--;
    this.updateButtons();
  }
  
  updateButtons() {
    const addBtn = this.container.querySelector('.btn-add');
    const removeBtns = this.container.querySelectorAll('.btn-remove');
    
    addBtn.disabled = this.count >= this.max;
    removeBtns.forEach(btn => {
      btn.disabled = this.count <= this.min;
    });
  }
}
```

#### C) Validações Complexas de Tabelas
```javascript
// Validar produtos únicos
function validateUniqueProducts() {
  const products = document.querySelectorAll('[name="produto_nome[]"]');
  const productNames = Array.from(products).map(p => p.value.toLowerCase());
  const duplicates = productNames.filter((item, index) => productNames.indexOf(item) !== index);
  
  if (duplicates.length > 0) {
    alert(`Produtos duplicados encontrados: ${[...new Set(duplicates)].join(', ')}`);
    return false;
  }
  return true;
}

// Validar pelo menos uma origem de semente/muda
function validateProductOrigins() {
  const rows = document.querySelectorAll('.product-row');
  let invalid = [];
  
  rows.forEach((row, index) => {
    const muda = row.querySelector('[name="produto_origem_muda[]"]').value;
    const semente = row.querySelector('[name="produto_origem_semente[]"]').value;
    
    if (muda === 'N/A' && !semente) {
      invalid.push(index + 1);
    }
  });
  
  if (invalid.length > 0) {
    alert(`Produtos nas linhas ${invalid.join(', ')} precisam ter origem de muda ou semente`);
    return false;
  }
  return true;
}
```

#### D) Sistema de Rótulos de Produtos
```html
<section id="rotulos-produtos" class="form-section">
  <h2>Rótulos dos Produtos</h2>
  
  <div class="labels-generator">
    <button onclick="addLabel()">➕ Adicionar Rótulo</button>
    
    <div id="labels-list" class="labels-container">
      <!-- Template de rótulo -->
      <div class="label-item">
        <h4>Rótulo #1</h4>
        <select name="rotulo_produto[]" required>
          <option value="">Selecione o produto...</option>
          <!-- Options populadas dinamicamente da lista de produtos -->
        </select>
        
        <div class="label-preview">
          <div class="label-design">
            <!-- Preview visual do rótulo -->
          </div>
        </div>
        
        <div class="label-fields">
          <input type="text" name="rotulo_marca[]" placeholder="Marca/Nome Fantasia">
          <input type="text" name="rotulo_peso[]" placeholder="Peso/Volume">
          <input type="date" name="rotulo_fabricacao[]" placeholder="Data Fabricação">
          <input type="text" name="rotulo_validade[]" placeholder="Validade">
          
          <div class="label-upload">
            <label>Upload do Design do Rótulo:</label>
            <input type="file" name="rotulo_arquivo[]" accept="image/*,.pdf">
          </div>
        </div>
        
        <div class="label-validation">
          <h5>Checklist Obrigatória:</h5>
          <label><input type="checkbox"> Nome da unidade produtiva</label>
          <label><input type="checkbox"> CNPJ</label>
          <label><input type="checkbox"> Endereço completo</label>
          <label><input type="checkbox"> Selo Sistema Participativo (tamanho mínimo)</label>
          <label><input type="checkbox"> Peso/Volume</label>
          <label><input type="checkbox"> Data de fabricação/validade</label>
          <label><input type="checkbox"> Ingredientes orgânicos identificados</label>
        </div>
      </div>
    </div>
  </div>
</section>
```

### 8. HISTÓRICO E RASTREABILIDADE

```html
<section id="historico-area" class="form-section">
  <h2>3. Histórico da Área</h2>
  
  <!-- Timeline de Manejo -->
  <div class="timeline-container">
    <h3>Linha do Tempo do Manejo Orgânico</h3>
    <div id="timeline" class="timeline">
      <button onclick="addTimelineEvent()">➕ Adicionar Evento</button>
    </div>
  </div>
  
  <!-- Tabela de Culturas dos Últimos 10 Anos -->
  <div class="historical-crops">
    <h3>Culturas dos Últimos 10 Anos</h3>
    <table id="historico-culturas">
      <thead>
        <tr>
          <th>Ano</th>
          <th>Cultura/Animal</th>
          <th>Área (ha)</th>
          <th>Manejo Orgânico?</th>
          <th>Certificado?</th>
          <th>Último Insumo Não Permitido</th>
          <th>Data Aplicação</th>
          <th>Documentos</th>
        </tr>
      </thead>
      <tbody>
        <!-- Anos de 2015-2025 pré-populados -->
        <script>
          for(let year = 2025; year >= 2015; year--) {
            document.write(`
              <tr>
                <td>${year}</td>
                <td><input type="text" name="cultura_${year}"></td>
                <td><input type="number" name="area_${year}" step="0.01"></td>
                <td><input type="checkbox" name="organico_${year}"></td>
                <td><input type="checkbox" name="certificado_${year}"></td>
                <td><input type="text" name="insumo_${year}"></td>
                <td><input type="date" name="data_insumo_${year}"></td>
                <td><input type="file" name="doc_${year}" accept=".pdf"></td>
              </tr>
            `);
          }
        </script>
      </tbody>
    </table>
  </div>
</section>
```

### 9. FUNCIONALIDADES AVANÇADAS

#### A) Sistema de Progresso Detalhado
```javascript
class FormProgress {
  constructor() {
    this.sections = document.querySelectorAll('.form-section');
    this.requiredFields = document.querySelectorAll('[required]');
    this.setupProgressBar();
  }
  
  calculateProgress() {
    let totalFields = 0;
    let completedFields = 0;
    let sectionProgress = {};
    
    this.sections.forEach(section => {
      const sectionFields = section.querySelectorAll('input, select, textarea');
      const sectionRequired = section.querySelectorAll('[required]');
      let sectionComplete = 0;
      
      sectionRequired.forEach(field => {
        if (this.isFieldComplete(field)) {
          sectionComplete++;
          completedFields++;
        }
        totalFields++;
      });
      
      sectionProgress[section.id] = {
        total: sectionRequired.length,
        completed: sectionComplete,
        percentage: (sectionComplete / sectionRequired.length) * 100
      };
    });
    
    return {
      overall: (completedFields / totalFields) * 100,
      sections: sectionProgress
    };
  }
  
  isFieldComplete(field) {
    if (field.type === 'checkbox') return field.checked;
    if (field.type === 'file') return field.files.length > 0;
    return field.value.trim() !== '';
  }
  
  updateProgressBar() {
    const progress = this.calculateProgress();
    
    // Barra geral
    document.getElementById('progress-bar').style.width = `${progress.overall}%`;
    document.getElementById('progress-text').innerText = `${Math.round(progress.overall)}% Completo`;
    
    // Progress por seção
    Object.keys(progress.sections).forEach(sectionId => {
      const sectionData = progress.sections[sectionId];
      const indicator = document.querySelector(`#${sectionId} .section-progress`);
      if (indicator) {
        indicator.innerHTML = `
          <div class="mini-progress">
            <div class="mini-bar" style="width: ${sectionData.percentage}%"></div>
            <span>${sectionData.completed}/${sectionData.total}</span>
          </div>
        `;
      }
    });
  }
}
```

#### B) Validação de Coordenadas Geográficas
```javascript
function validateCoordinates() {
  const lat = document.getElementById('latitude');
  const lon = document.getElementById('longitude');
  
  // Padrão para coordenadas brasileiras
  const latPattern = /^-?([1-9]|[1-2][0-9]|3[0-3])\.\d{4,6}$/;
  const lonPattern = /^-?([3-7][0-9]|80)\.\d{4,6}$/;
  
  if (!latPattern.test(lat.value)) {
    showError(lat, 'Latitude inválida para o Brasil (ex: -22.9068)');
    return false;
  }
  
  if (!lonPattern.test(lon.value)) {
    showError(lon, 'Longitude inválida para o Brasil (ex: -47.0628)');
    return false;
  }
  
  // Verificar se está dentro do Brasil
  const latNum = parseFloat(lat.value);
  const lonNum = parseFloat(lon.value);
  
  if (latNum < -33.75 || latNum > 5.27 || lonNum < -73.99 || lonNum > -34.79) {
    showWarning('Coordenadas parecem estar fora do território brasileiro');
  }
  
  return true;
}

// Obter localização atual
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
        document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
        showSuccess('Localização obtida com sucesso!');
      },
      (error) => {
        showError('Erro ao obter localização: ' + error.message);
      }
    );
  } else {
    showError('Geolocalização não suportada pelo navegador');
  }
}
```

#### C) Sistema de Auto-Complete para Produtos
```javascript
// Lista de produtos comuns na agricultura orgânica
const produtosSugestoes = [
  // Hortaliças Folhosas
  'Alface Crespa', 'Alface Crespa Roxa', 'Alface Americana', 'Alface Lisa',
  'Rúcula', 'Agrião', 'Couve', 'Couve-flor', 'Brócolis', 'Repolho Verde',
  'Repolho Roxo', 'Acelga', 'Espinafre', 'Almeirão', 'Chicória', 'Mostarda',
  
  // Hortaliças Fruto
  'Tomate Cereja', 'Tomate Italiano', 'Tomate Caqui', 'Pimentão Verde',
  'Pimentão Vermelho', 'Pimentão Amarelo', 'Berinjela', 'Jiló', 'Quiabo',
  'Abobrinha Italiana', 'Abobrinha Menina', 'Abóbora Cabotiá', 'Moranga',
  
  // Raízes e Tubérculos
  'Cenoura', 'Beterraba', 'Rabanete', 'Nabo', 'Mandioca', 'Batata Doce',
  'Batata Inglesa', 'Inhame', 'Cará', 'Gengibre', 'Açafrão',
  
  // Temperos e Ervas
  'Salsinha', 'Cebolinha', 'Coentro', 'Manjericão', 'Orégano', 'Tomilho',
  'Alecrim', 'Sálvia', 'Hortelã', 'Capim Limão', 'Erva Doce',
  
  // Frutas
  'Banana Nanica', 'Banana Prata', 'Banana da Terra', 'Mamão Formosa',
  'Mamão Papaya', 'Manga Tommy', 'Manga Palmer', 'Abacate', 'Limão Tahiti',
  'Limão Siciliano', 'Laranja Pera', 'Mexerica', 'Maracujá', 'Goiaba',
  
  // Grãos e Cereais
  'Milho Verde', 'Feijão Carioca', 'Feijão Preto', 'Ervilha', 'Vagem',
  
  // Microverdes
  'Microverde - Rúcula', 'Microverde - Mostarda', 'Microverde - Repolho Roxo',
  
  // Produtos Processados
  'Mel', 'Própolis', 'Pólen', 'Geleia Real',
  
  // Cogumelos
  'Shiitake', 'Shimeji', 'Champignon', 'Cogumelo Paris'
];

// Criar datalist para sugestões
function createProductDatalist() {
  const datalist = document.createElement('datalist');
  datalist.id = 'produtos-sugestoes';
  
  produtosSugestoes.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto;
    datalist.appendChild(option);
  });
  
  document.body.appendChild(datalist);
}
```

#### D) Sistema de Comercialização
```html
<section id="comercializacao" class="form-section">
  <h2>7. Comercialização</h2>
  
  <div class="comercializacao-status">
    <label>
      <input type="radio" name="status_comercializacao" value="ja_comercializo" onchange="toggleComercializacao(this)">
      Já comercializo produtos orgânicos
    </label>
    <label>
      <input type="radio" name="status_comercializacao" value="ainda_nao" onchange="toggleComercializacao(this)">
      Ainda não comercializo
    </label>
  </div>
  
  <div id="previsao-comercializacao" style="display:none;">
    <label>Previsão para começar a vender:</label>
    <input type="month" name="previsao_inicio_vendas">
    <textarea name="plano_comercializacao" placeholder="Descreva seus planos de comercialização"></textarea>
  </div>
  
  <div id="canais-comercializacao" style="display:none;">
    <h3>Canais de Comercialização</h3>
    
    <div class="comercializacao-group">
      <h4>Venda Direta</h4>
      <label><input type="checkbox" name="venda_feira" onchange="showFeiraDados(this)"> Feiras</label>
      <div id="feira-dados" style="display:none;">
        <input type="text" name="feira_nome[]" placeholder="Nome da Feira">
        <input type="text" name="feira_local[]" placeholder="Local">
        <select name="feira_dia[]" multiple>
          <option>Segunda</option><option>Terça</option><option>Quarta</option>
          <option>Quinta</option><option>Sexta</option><option>Sábado</option><option>Domingo</option>
        </select>
        <button type="button" onclick="addFeira()">+ Adicionar outra feira</button>
      </div>
      
      <label><input type="checkbox" name="venda_domicilio"> Entregas em Domicílio/Cestas</label>
      <label><input type="checkbox" name="venda_csa"> CSA - Comunidade que Sustenta Agricultura</label>
      <label><input type="checkbox" name="venda_horeca"> Hotéis, Restaurantes e Similares</label>
      <label><input type="checkbox" name="venda_outro_direto"> Outro tipo de venda direta</label>
    </div>
    
    <div class="comercializacao-group">
      <h4>Revenda</h4>
      <label><input type="checkbox" name="revenda_produtores_spg"> Outros produtores do SPG</label>
      <label><input type="checkbox" name="revenda_pequeno_varejo"> Pequeno varejo</label>
      <label><input type="checkbox" name="revenda_lojas_naturais"> Lojas de produtos naturais</label>
      <label><input type="checkbox" name="revenda_supermercado_bairro"> Supermercado de bairro</label>
      <label><input type="checkbox" name="revenda_rede_supermercado"> Rede de supermercado</label>
      <label><input type="checkbox" name="revenda_atacadista"> Mercado atacadista</label>
      <label><input type="checkbox" name="revenda_exportacao"> Mercado externo</label>
      <label><input type="checkbox" name="revenda_distribuidores"> Distribuidores</label>
    </div>
    
    <div class="comercializacao-group">
      <h4>Venda Governamental</h4>
      <label><input type="checkbox" name="venda_paa_pnae"> PAA/PNAE - Programa de Alimentação Escolar</label>
    </div>
  </div>
  
  <!-- Transporte -->
  <div class="transporte-section">
    <h3>Transporte dos Produtos</h3>
    <textarea name="descricao_transporte" 
              placeholder="Descreva como é feito o transporte (veículo próprio/terceirizado, refrigerado, caixas utilizadas, etc.)"
              rows="3"></textarea>
  </div>
  
  <!-- Rastreabilidade -->
  <div class="rastreabilidade-section">
    <h3>Sistema de Rastreabilidade</h3>
    <label><input type="checkbox" name="rastreabilidade_lote"> Controle por lote</label>
    <label><input type="checkbox" name="rastreabilidade_data"> Controle por data de colheita</label>
    <label><input type="checkbox" name="rastreabilidade_talhao"> Identificação do talhão</label>
    <label><input type="checkbox" name="rastreabilidade_nf"> Notas fiscais de produtor</label>
    <textarea name="descricao_rastreabilidade" 
              placeholder="Descreva como garante a rastreabilidade dos produtos"></textarea>
  </div>
</section>
```

### 10. VALIDAÇÃO FINAL E ENVIO

```javascript
class FormValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.sections = [];
  }
  
  validateComplete() {
    this.errors = [];
    this.warnings = [];
    
    // Validar cada seção
    this.validateDadosFornecedores();
    this.validateDadosEmpresa();
    this.validateEndereco();
    this.validatePropriedade();
    this.validateDeclaracoes();
    this.validateEscopos();
    this.validateProdutos();
    this.validateCroqui();
    this.validateDocumentos();
    
    return this.showValidationResults();
  }
  
  validateDadosFornecedores() {
    const fornecedores = document.querySelectorAll('.fornecedor-row');
    
    if (fornecedores.length === 0) {
      this.errors.push({
        section: 'Fornecedores',
        message: 'Pelo menos um fornecedor deve ser cadastrado'
      });
    }
    
    fornecedores.forEach((row, index) => {
      const nome = row.querySelector('[name="fornecedor_nome[]"]').value;
      const cpf = row.querySelector('[name="fornecedor_cpf[]"]').value;
      const nascimento = row.querySelector('[name="fornecedor_nascimento[]"]').value;
      
      if (!nome || nome.length < 5) {
        this.errors.push({
          section: 'Fornecedores',
          message: `Fornecedor ${index + 1}: Nome inválido`
        });
      }
      
      if (!this.validateCPF(cpf)) {
        this.errors.push({
          section: 'Fornecedores',
          message: `Fornecedor ${index + 1}: CPF inválido`
        });
      }
      
      if (!this.validateAge(nascimento, 18)) {
        this.errors.push({
          section: 'Fornecedores',
          message: `Fornecedor ${index + 1}: Deve ser maior de 18 anos`
        });
      }
    });
  }
  
  validateProdutos() {
    const produtos = document.querySelectorAll('.product-row');
    
    if (produtos.length === 0) {
      this.errors.push({
        section: 'Produtos',
        message: 'Pelo menos um produto deve ser cadastrado para certificação'
      });
    }
    
    // Verificar produtos duplicados
    const nomesProdutos = [];
    produtos.forEach((row, index) => {
      const nome = row.querySelector('[name="produto_nome[]"]').value;
      if (nomesProdutos.includes(nome.toLowerCase())) {
        this.warnings.push({
          section: 'Produtos',
          message: `Produto duplicado: ${nome}`
        });
      }
      nomesProdutos.push(nome.toLowerCase());
    });
  }
  
  validateCroqui() {
    const croquiFile = document.getElementById('croqui-file');
    const croquiCanvas = document.getElementById('drawing-canvas');
    
    if (!croquiFile.files.length && !this.canvasHasDrawing(croquiCanvas)) {
      this.errors.push({
        section: 'Croqui',
        message: 'O croqui da propriedade é obrigatório'
      });
    }
    
    // Verificar itens obrigatórios no croqui
    const checklistItems = document.querySelectorAll('#croqui-checklist input[type="checkbox"]');
    const unchecked = Array.from(checklistItems).filter(item => !item.checked);
    
    if (unchecked.length > 0) {
      this.warnings.push({
        section: 'Croqui',
        message: `${unchecked.length} itens obrigatórios não identificados no croqui`
      });
    }
  }
  
  showValidationResults() {
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'validation-results';
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      resultsDiv.innerHTML = `
        <div class="success-message">
          <h3>✅ Formulário válido e pronto para envio!</h3>
        </div>
      `;
      document.getElementById('submit-btn').disabled = false;
    } else {
      let html = '<h3>Resultado da Validação</h3>';
      
      if (this.errors.length > 0) {
        html += '<div class="errors-list"><h4>❌ Erros (obrigatório corrigir):</h4><ul>';
        this.errors.forEach(error => {
          html += `<li><strong>${error.section}:</strong> ${error.message}</li>`;
        });
        html += '</ul></div>';
      }
      
      if (this.warnings.length > 0) {
        html += '<div class="warnings-list"><h4>⚠️ Avisos (recomendado revisar):</h4><ul>';
        this.warnings.forEach(warning => {
          html += `<li><strong>${warning.section}:</strong> ${warning.message}</li>`;
        });
        html += '</ul></div>';
      }
      
      resultsDiv.innerHTML = html;
      document.getElementById('submit-btn').disabled = this.errors.length > 0;
    }
    
    document.getElementById('validation-results').appendChild(resultsDiv);
    return this.errors.length === 0;
  }
  
  // Funções auxiliares de validação
  validateCPF(cpf) {
    // Implementar algoritmo de validação de CPF
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    // ... resto do algoritmo
    return true;
  }
  
  validateAge(birthDate, minAge) {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));
    return age >= minAge;
  }
}
```

### 11. SISTEMA DE EXPORTAÇÃO

```javascript
// Exportar para JSON
function exportJSON() {
  const formData = new FormData(document.getElementById('pmo-form'));
  const data = {};
  
  for (let [key, value] of formData.entries()) {
    if (data[key]) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }
  
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, 'pmo_' + new Date().toISOString() + '.json', 'application/json');
}

// Gerar PDF
async function generatePDF() {
  // Usar biblioteca como jsPDF ou html2pdf
  const element = document.getElementById('pmo-form');
  const opt = {
    margin: 1,
    filename: 'PMO_2026.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  
  // Gerar PDF
  html2pdf().set(opt).from(element).save();
}

// Download de arquivo
function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

## Output Esperado

O formulário final deve:
1. ✅ Replicar 100% dos campos do PMO original
2. ✅ Permitir adição/remoção de itens múltiplos (telefones, emails, produtos, insumos, documentos)
3. ✅ Sistema completo de upload com preview para croqui e documentos
4. ✅ Validações em tempo real com mensagens contextualizadas
5. ✅ Auto-save e recuperação de dados
6. ✅ Exportação em JSON e PDF
7. ✅ Interface intuitiva e responsiva
8. ✅ Sistema de progresso detalhado por seção
9. ✅ Rastreabilidade completa
10. ✅ Suporte offline após primeiro carregamento 