// PMO Form - Main Application JavaScript
// ANC - Associação de Agricultura Natural de Campinas

// Global variables
let formData = {};
let autoSaveInterval;
let drawingCanvas;
let drawingContext;
let isDrawing = false;
let currentTool = 'pen';
let currentColor = '#000000';

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    loadSavedData();
    startAutoSave();
    populateProductSuggestions();
    generateHistoricoTable();
    updateProgress();
});

// Initialize form components
function initializeForm() {
    console.log('Initializing PMO Form...');
    
    // Setup navigation
    setupNavigation();
    
    // Setup drawing canvas
    setupDrawingCanvas();
    
    // Setup file uploads
    setupFileUploads();
    
    // Setup form validation
    setupFormValidation();
    
    // Setup masks for inputs
    setupInputMasks();
    
    console.log('Form initialized successfully');
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('pmo-form');
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Input changes for auto-save
    form.addEventListener('input', handleInputChange);
    form.addEventListener('change', handleInputChange);
    
    // Navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Window events
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', updateActiveNav);
}

// Navigation functionality
function setupNavigation() {
    const sections = document.querySelectorAll('.form-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Create intersection observer for automatic nav updates
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                updateActiveNavLink(id);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        updateActiveNavLink(targetId);
    }
}

function updateActiveNavLink(activeId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + activeId) {
            link.classList.add('active');
        }
    });
}

function updateActiveNav() {
    // This will be called by intersection observer
}

// Input masks
function setupInputMasks() {
    // CPF mask
    document.querySelectorAll('.cpf-mask').forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    });
    
    // Phone mask
    document.querySelectorAll('.phone-mask').forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    });
    
    // CEP mask
    document.querySelectorAll('.cep-mask').forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = formatCEP(e.target.value);
        });
    });
}

// Format functions
function formatCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

function formatPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

function formatCEP(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
}

// Dynamic fields management
function addFornecedor() {
    const template = document.getElementById('fornecedor-row-template');
    const tbody = document.getElementById('fornecedores-body');
    const clone = template.content.cloneNode(true);
    
    // Apply masks to new inputs
    const cpfInput = clone.querySelector('.cpf-mask');
    const phoneInput = clone.querySelector('.phone-mask');
    
    cpfInput.addEventListener('input', function(e) {
        e.target.value = formatCPF(e.target.value);
    });
    
    phoneInput.addEventListener('input', function(e) {
        e.target.value = formatPhone(e.target.value);
    });
    
    tbody.appendChild(clone);
    updateFornecedorButtons();
}

function removeFornecedor(button) {
    const row = button.closest('tr');
    const tbody = document.getElementById('fornecedores-body');
    
    if (tbody.children.length > 1) {
        row.remove();
        updateFornecedorButtons();
    } else {
        alert('Pelo menos um fornecedor deve ser mantido.');
    }
}

function updateFornecedorButtons() {
    const tbody = document.getElementById('fornecedores-body');
    const removeButtons = tbody.querySelectorAll('.btn-remove');
    
    removeButtons.forEach(button => {
        button.disabled = tbody.children.length <= 1;
    });
}

// Add contact functionality
function addContact(button, type) {
    const container = button.parentElement;
    const newInputContainer = document.createElement('div');
    newInputContainer.className = 'multiple-contacts';
    newInputContainer.style.marginTop = '0.5rem';
    
    const newInput = document.createElement('input');
    newInput.type = type === 'telefone' ? 'tel' : 'email';
    newInput.name = `fornecedor_${type}[]`;
    newInput.placeholder = type === 'telefone' ? '(00) 00000-0000' : 'email@exemplo.com';
    
    if (type === 'telefone') {
        newInput.className = 'phone-mask';
        newInput.addEventListener('input', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove';
    removeBtn.innerHTML = '❌';
    removeBtn.style.padding = '0.25rem';
    removeBtn.onclick = function() {
        newInputContainer.remove();
    };
    
    newInputContainer.appendChild(newInput);
    newInputContainer.appendChild(removeBtn);
    
    container.parentElement.appendChild(newInputContainer);
}

// Document type toggle
function toggleDocumento(type) {
    const documentoInput = document.getElementById('documento');
    const label = document.getElementById('documento-label');
    
    if (type === 'cpf') {
        label.textContent = 'CPF *';
        documentoInput.placeholder = '000.000.000-00';
        documentoInput.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    } else {
        label.textContent = 'CNPJ *';
        documentoInput.placeholder = '00.000.000/0000-00';
        documentoInput.addEventListener('input', function(e) {
            e.target.value = formatCNPJ(e.target.value);
        });
    }
}

function formatCNPJ(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

// Contract toggle
function toggleContrato(show) {
    const contratoInfo = document.getElementById('contrato-info');
    const contratoValidade = document.getElementById('contrato_validade');
    
    if (show) {
        contratoInfo.style.display = 'block';
        contratoValidade.required = true;
    } else {
        contratoInfo.style.display = 'none';
        contratoValidade.required = false;
    }
}

// Google Maps Integration with Address
function openMapsWithAddress() {
    const endereco = document.getElementById('endereco').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    
    // Montar endereço completo
    let enderecoCompleto = '';
    if (endereco) enderecoCompleto += endereco;
    if (numero && numero !== 'S/N') enderecoCompleto += ', ' + numero;
    if (bairro) enderecoCompleto += ', ' + bairro;
    if (cidade) enderecoCompleto += ', ' + cidade;
    if (estado) enderecoCompleto += ', ' + estado + ', Brasil';
    
    if (!enderecoCompleto) {
        showWarning('Preencha pelo menos o endereço, bairro e cidade antes de abrir o Google Maps');
        return;
    }
    
    // Criar URL do Google Maps com o endereço
    const encodedAddress = encodeURIComponent(enderecoCompleto);
    const mapsUrl = `https://www.google.com/maps/search/${encodedAddress}`;
    
    const newWindow = window.open(mapsUrl, '_blank', 'width=1200,height=800');
    
    if (newWindow) {
        showInfo('Google Maps aberto com seu endereço. Encontre a localização exata da propriedade, clique com botão direito e selecione "Copiar coordenadas"');
    } else {
        showError('Pop-up bloqueado. Permita pop-ups e tente novamente.');
    }
}

function parseCoordinates(coordinatesString) {
    if (!coordinatesString || !coordinatesString.trim()) {
        clearCoordinates();
        return;
    }
    
    try {
        // Remove espaços extras e quebras de linha
        const cleanString = coordinatesString.trim().replace(/\s+/g, ' ');
        
        // Diferentes formatos possíveis:
        // -22.906847, -47.062860
        // -22.906847,-47.062860
        // -22°54'24.6"S 47°03'46.3"W (formato DMS - não comum no Google Maps)
        
        let lat = null, lng = null;
        
        // Padrão mais comum: dois números separados por vírgula
        const pattern1 = /(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/;
        const match1 = cleanString.match(pattern1);
        
        if (match1) {
            lat = parseFloat(match1[1]);
            lng = parseFloat(match1[2]);
        } else {
            // Tentar separar por espaço se não tiver vírgula
            const parts = cleanString.split(/\s+/);
            if (parts.length >= 2) {
                lat = parseFloat(parts[0]);
                lng = parseFloat(parts[1]);
            }
        }
        
        // Validar se são números válidos
        if (isNaN(lat) || isNaN(lng)) {
            showError('Formato de coordenadas inválido. Use o formato: -22.906847, -47.062860');
            return;
        }
        
        // Validar se estão dentro do Brasil (aproximadamente)
        if (lat < -34 || lat > 6 || lng < -75 || lng > -30) {
            showWarning('Coordenadas parecem estar fora do Brasil. Verifique se estão corretas.');
        }
        
        // Preencher campos individuais
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);
        
        // Mostrar preview
        showCoordinatesPreview(lat, lng);
        
        showSuccess('Coordenadas extraídas com sucesso!');
        
    } catch (error) {
        showError('Erro ao processar coordenadas: ' + error.message);
        clearCoordinates();
    }
}

function showCoordinatesPreview(lat, lng) {
    const preview = document.getElementById('coordinates-preview');
    const details = document.getElementById('coordinates-details');
    
    details.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div><strong>Latitude:</strong> ${lat.toFixed(6)}</div>
            <div><strong>Longitude:</strong> ${lng.toFixed(6)}</div>
        </div>
        <div style="font-size: 0.9rem; color: var(--text-secondary);">
            <p>📍 Localização registrada com precisão de ~1 metro</p>
        </div>
    `;
    
    preview.style.display = 'block';
}

function verifyLocation() {
    const lat = document.getElementById('latitude').value;
    const lng = document.getElementById('longitude').value;
    
    if (!lat || !lng) {
        showError('Coordenadas não estão preenchidas');
        return;
    }
    
    // Abrir Google Maps com as coordenadas exatas
    const mapsUrl = `https://www.google.com/maps/@${lat},${lng},18z`;
    window.open(mapsUrl, '_blank', 'width=1200,height=800');
}

function clearCoordinates() {
    document.getElementById('latitude').value = '';
    document.getElementById('longitude').value = '';
    document.getElementById('coordinates-preview').style.display = 'none';
}

// CEP lookup
async function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) return;
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            showError('CEP não encontrado');
            return;
        }
        
        document.getElementById('endereco').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
        
        showSuccess('Endereço preenchido automaticamente');
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showError('Erro ao buscar CEP');
    }
}

// Generate historic table
function generateHistoricoTable() {
    const tbody = document.getElementById('historico-body');
    tbody.innerHTML = '';
    
    for (let year = 2025; year >= 2015; year--) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${year}</td>
            <td><input type="text" name="cultura_${year}" placeholder="Ex: Milho, Feijão"></td>
            <td><input type="number" name="area_${year}" step="0.01" min="0" placeholder="0.00"></td>
            <td><input type="checkbox" name="organico_${year}"></td>
            <td><input type="checkbox" name="certificado_${year}"></td>
            <td><input type="text" name="insumo_${year}" placeholder="Ex: Herbicida XYZ"></td>
            <td><input type="date" name="data_insumo_${year}"></td>
        `;
        tbody.appendChild(row);
    }
}

// Toggle certificação anterior details
function toggleCertificacaoAnterior(select) {
    const detalhesDiv = document.getElementById('certificacao-anterior-detalhes');
    const nomeInput = document.getElementById('historico_certificadora_anterior');
    
    if (select.value === 'sim_outra') {
        detalhesDiv.style.display = 'block';
        nomeInput.required = true;
        showInfo('Preencha os detalhes da certificação anterior');
    } else if (select.value === 'sim_anc') {
        detalhesDiv.style.display = 'block';
        nomeInput.required = false;
        nomeInput.value = 'ANC - Associação de Agricultura Natural de Campinas';
        nomeInput.readOnly = true;
    } else {
        detalhesDiv.style.display = 'none';
        nomeInput.required = false;
        nomeInput.readOnly = false;
        nomeInput.value = '';
    }
}

// Product suggestions
function populateProductSuggestions() {
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
    
    const datalist = document.getElementById('produtos-sugestoes');
    datalist.innerHTML = '';
    
    produtosSugestoes.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto;
        datalist.appendChild(option);
    });
}

// Product management
function addProductRow() {
    const template = document.getElementById('product-row-template');
    const tbody = document.getElementById('produtos-body');
    const clone = template.content.cloneNode(true);
    
    tbody.appendChild(clone);
    updateProductNumbers();
}

function removeProductRow(button) {
    const row = button.closest('tr');
    const tbody = document.getElementById('produtos-body');
    
    if (tbody.children.length > 1) {
        row.remove();
        updateProductNumbers();
    } else {
        alert('Pelo menos um produto deve ser mantido.');
    }
}

function updateProductNumbers() {
    const rows = document.querySelectorAll('#produtos-body .product-row');
    rows.forEach((row, index) => {
        const numberCell = row.querySelector('.row-number');
        if (numberCell) {
            numberCell.textContent = index + 1;
        }
    });
}

function duplicateRow(button) {
    const row = button.closest('tr');
    const newRow = row.cloneNode(true);
    
    // Clear some fields in the new row
    const inputs = newRow.querySelectorAll('input[type="text"], input[type="number"]');
    inputs.forEach(input => {
        if (input.name.includes('produto_nome')) {
            input.value = input.value + ' - Cópia';
        }
    });
    
    row.parentNode.insertBefore(newRow, row.nextSibling);
    updateProductNumbers();
}

function checkCustom(select) {
    const customInput = select.nextElementSibling;
    if (select.value === 'custom') {
        customInput.style.display = 'block';
        customInput.required = true;
    } else {
        customInput.style.display = 'none';
        customInput.required = false;
        customInput.value = '';
    }
}

function sortProducts() {
    const tbody = document.getElementById('produtos-body');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const nameA = a.querySelector('[name="produto_nome[]"]').value.toLowerCase();
        const nameB = b.querySelector('[name="produto_nome[]"]').value.toLowerCase();
        return nameA.localeCompare(nameB, 'pt-BR');
    });
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    updateProductNumbers();
}

function importProductList() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    let products = [];
                    if (file.name.endsWith('.csv')) {
                        products = parseCSV(e.target.result);
                    } else if (file.name.endsWith('.json')) {
                        products = JSON.parse(e.target.result);
                    }
                    
                    products.forEach(product => {
                        addProductFromData(product);
                    });
                    updateProductNumbers();
                    showSuccess(`${products.length} produtos importados com sucesso!`);
                } catch (error) {
                    showError('Erro ao importar arquivo: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',');
            const product = {};
            headers.forEach((header, index) => {
                product[header.trim()] = values[index]?.trim() || '';
            });
            products.push(product);
        }
    }
    
    return products;
}

function addProductFromData(productData) {
    addProductRow();
    const lastRow = document.querySelector('#produtos-body tr:last-child');
    
    // Fill in the data
    const nameInput = lastRow.querySelector('[name="produto_nome[]"]');
    const talhaoInput = lastRow.querySelector('[name="produto_talhao[]"]');
    const qtdInput = lastRow.querySelector('[name="produto_qtd[]"]');
    
    if (nameInput && productData.nome) nameInput.value = productData.nome;
    if (talhaoInput && productData.talhao) talhaoInput.value = productData.talhao;
    if (qtdInput && productData.quantidade) qtdInput.value = productData.quantidade;
}

// Tabs management
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active to selected tab button
    const selectedBtn = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
}

// Insumos management
function addInsumoRow(type) {
    const tbody = document.getElementById(`${type}-body`);
    const row = document.createElement('tr');
    
    let cellsHTML = '';
    
    switch (type) {
        case 'fertilizantes':
            cellsHTML = `
                <td><input type="text" name="fert_nome[]" required></td>
                <td><input type="text" name="fert_ingrediente[]"></td>
                <td><input type="text" name="fert_fabricante[]"></td>
                <td><input type="text" name="fert_fornecedor[]"></td>
                <td><input type="text" name="fert_culturas[]"></td>
                <td><select name="fert_frequencia[]">
                    <option>Semanal</option>
                    <option>Quinzenal</option>
                    <option>Mensal</option>
                    <option>Conforme necessidade</option>
                </select></td>
                <td><input type="checkbox" name="fert_certificado[]"></td>
                <td><input type="file" name="fert_arquivo[]" accept=".pdf,.jpg,.png"></td>
                <td><button type="button" onclick="removeInsumoRow(this)" class="btn-remove">❌</button></td>
            `;
            break;
            
        case 'fitossanitarios':
            cellsHTML = `
                <td><input type="text" name="fito_nome[]" required></td>
                <td><input type="text" name="fito_ingrediente[]"></td>
                <td><input type="text" name="fito_fabricante[]"></td>
                <td><input type="text" name="fito_registro[]"></td>
                <td><input type="text" name="fito_pragas[]"></td>
                <td><input type="text" name="fito_culturas[]"></td>
                <td><select name="fito_frequencia[]">
                    <option>Conforme necessidade</option>
                    <option>Preventivo</option>
                    <option>Curativo</option>
                </select></td>
                <td><input type="checkbox" name="fito_certificado[]"></td>
                <td><input type="file" name="fito_arquivo[]" accept=".pdf,.jpg,.png"></td>
                <td><button type="button" onclick="removeInsumoRow(this)" class="btn-remove">❌</button></td>
            `;
            break;
            
        case 'sementes':
            cellsHTML = `
                <td><input type="text" name="sem_variedade[]" required></td>
                <td><input type="text" name="sem_fornecedor[]"></td>
                <td><select name="sem_tipo[]">
                    <option>Semente</option>
                    <option>Muda</option>
                    <option>Bulbo</option>
                    <option>Tubérculo</option>
                </select></td>
                <td><select name="sem_tratamento[]">
                    <option>Sem tratamento</option>
                    <option>Tratamento orgânico</option>
                    <option>Tratamento químico</option>
                </select></td>
                <td><input type="checkbox" name="sem_certificado[]"></td>
                <td><input type="file" name="sem_arquivo[]" accept=".pdf,.jpg,.png"></td>
                <td><button type="button" onclick="removeInsumoRow(this)" class="btn-remove">❌</button></td>
            `;
            break;
            
        case 'substratos':
            cellsHTML = `
                <td><input type="text" name="sub_nome[]" required></td>
                <td><textarea name="sub_composicao[]" rows="2"></textarea></td>
                <td><input type="text" name="sub_fabricante[]"></td>
                <td><input type="text" name="sub_finalidade[]"></td>
                <td><input type="text" name="sub_quantidade[]"></td>
                <td><input type="checkbox" name="sub_certificado[]"></td>
                <td><input type="file" name="sub_arquivo[]" accept=".pdf,.jpg,.png"></td>
                <td><button type="button" onclick="removeInsumoRow(this)" class="btn-remove">❌</button></td>
            `;
            break;
    }
    
    row.innerHTML = cellsHTML;
    tbody.appendChild(row);
}

function removeInsumoRow(button) {
    const row = button.closest('tr');
    row.remove();
}

// Commercialization
function toggleComercializacao(radio) {
    const previsao = document.getElementById('previsao-comercializacao');
    const canais = document.getElementById('canais-comercializacao');
    
    if (radio.value === 'ja_comercializo') {
        previsao.style.display = 'none';
        canais.style.display = 'block';
    } else {
        previsao.style.display = 'block';
        canais.style.display = 'none';
    }
}

function showFeiraDados(checkbox) {
    const feiraDados = document.getElementById('feira-dados');
    
    if (checkbox.checked) {
        feiraDados.style.display = 'block';
        addFeira(); // Add first feira automatically
    } else {
        feiraDados.style.display = 'none';
        // Clear feira list
        document.getElementById('feiras-list').innerHTML = '';
    }
}

function addFeira() {
    const feirasList = document.getElementById('feiras-list');
    const feiraItem = document.createElement('div');
    feiraItem.className = 'feira-item';
    feiraItem.style.cssText = 'margin-bottom: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; background: white;';
    
    feiraItem.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
                <label>Nome da Feira:</label>
                <input type="text" name="feira_nome[]" placeholder="Ex: Feira da Vila">
            </div>
            <div>
                <label>Local:</label>
                <input type="text" name="feira_local[]" placeholder="Ex: Praça Central">
            </div>
        </div>
        <div style="margin-bottom: 1rem;">
            <label>Dias da Semana:</label>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                <label><input type="checkbox" name="feira_dias[]" value="segunda"> Segunda</label>
                <label><input type="checkbox" name="feira_dias[]" value="terca"> Terça</label>
                <label><input type="checkbox" name="feira_dias[]" value="quarta"> Quarta</label>
                <label><input type="checkbox" name="feira_dias[]" value="quinta"> Quinta</label>
                <label><input type="checkbox" name="feira_dias[]" value="sexta"> Sexta</label>
                <label><input type="checkbox" name="feira_dias[]" value="sabado"> Sábado</label>
                <label><input type="checkbox" name="feira_dias[]" value="domingo"> Domingo</label>
            </div>
        </div>
        <button type="button" onclick="removeFeira(this)" class="btn-remove">❌ Remover Feira</button>
    `;
    
    feirasList.appendChild(feiraItem);
}

function removeFeira(button) {
    const feiraItem = button.closest('.feira-item');
    feiraItem.remove();
}

// Auto-save functionality
function startAutoSave() {
    autoSaveInterval = setInterval(saveForm, 30000); // Save every 30 seconds
}

function saveForm() {
    const form = document.getElementById('pmo-form');
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to regular object
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // Save to localStorage
    localStorage.setItem('pmo_form_data', JSON.stringify(data));
    localStorage.setItem('pmo_form_timestamp', new Date().toISOString());
    
    // Update save status
    const saveStatus = document.getElementById('save-status');
    if (saveStatus) {
        saveStatus.innerHTML = `💾 Salvo automaticamente às ${new Date().toLocaleTimeString()}`;
        setTimeout(() => {
            saveStatus.innerHTML = '';
        }, 3000);
    }
}

function loadSavedData() {
    const savedData = localStorage.getItem('pmo_form_data');
    const timestamp = localStorage.getItem('pmo_form_timestamp');
    
    if (savedData && timestamp) {
        try {
            const data = JSON.parse(savedData);
            const form = document.getElementById('pmo-form');
            
            // Fill form with saved data
            Object.entries(data).forEach(([key, value]) => {
                const elements = form.querySelectorAll(`[name="${key}"]`);
                elements.forEach((element, index) => {
                    if (element.type === 'checkbox' || element.type === 'radio') {
                        if (Array.isArray(value)) {
                            element.checked = value.includes(element.value);
                        } else {
                            element.checked = element.value === value;
                        }
                    } else {
                        if (Array.isArray(value)) {
                            element.value = value[index] || '';
                        } else {
                            element.value = value;
                        }
                    }
                });
            });
            
            const saveTime = new Date(timestamp).toLocaleString();
            showInfo(`Dados carregados do rascunho salvo em ${saveTime}`);
        } catch (error) {
            console.error('Erro ao carregar dados salvos:', error);
        }
    }
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Process form submission
        const formData = new FormData(e.target);
        
        // Here you would normally send data to server
        console.log('Form submitted successfully');
        showSuccess('PMO enviado com sucesso!');
        
        // Clear saved data
        localStorage.removeItem('pmo_form_data');
        localStorage.removeItem('pmo_form_timestamp');
    }
}

function handleInputChange() {
    updateProgress();
}

function handleBeforeUnload(e) {
    const hasUnsavedChanges = localStorage.getItem('pmo_form_data') !== null;
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
}

// Progress tracking
function updateProgress() {
    const form = document.getElementById('pmo-form');
    const requiredFields = form.querySelectorAll('[required]');
    const filledFields = Array.from(requiredFields).filter(field => {
        if (field.type === 'checkbox') return field.checked;
        if (field.type === 'file') return field.files.length > 0;
        return field.value.trim() !== '';
    });
    
    const progress = (filledFields.length / requiredFields.length) * 100;
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    if (progressText) {
        progressText.textContent = Math.round(progress) + '% Completo';
    }
    
    // Update section progress
    updateSectionProgress();
}

function updateSectionProgress() {
    const sections = document.querySelectorAll('.form-section');
    
    sections.forEach(section => {
        const requiredFields = section.querySelectorAll('[required]');
        const filledFields = Array.from(requiredFields).filter(field => {
            if (field.type === 'checkbox') return field.checked;
            if (field.type === 'file') return field.files.length > 0;
            return field.value.trim() !== '';
        });
        
        const progress = requiredFields.length > 0 ? (filledFields.length / requiredFields.length) * 100 : 100;
        
        const progressElement = section.querySelector('.section-progress');
        if (progressElement) {
            progressElement.textContent = `${filledFields.length}/${requiredFields.length} campos preenchidos (${Math.round(progress)}%)`;
        }
    });
}

// Utility functions
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showWarning(message) {
    showNotification(message, 'warning');
}

function showInfo(message) {
    showNotification(message, 'info');
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : type === 'warning' ? '#ffeaa7' : '#bee5eb'};
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; margin-left: auto;">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add slideIn animation to CSS dynamically
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Export functions (to be implemented in separate file)
function exportJSON() {
    console.log('Export JSON functionality - see export.js');
}

function generatePDF() {
    console.log('Generate PDF functionality - see export.js');
}

// Validation functions (to be implemented in separate file)  
function validateForm() {
    console.log('Form validation - see form-validation.js');
    return true; // Temporary
}