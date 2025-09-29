// Form Validation Module
// PMO Form - ANC

class FormValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.setupValidation();
    }

    setupValidation() {
        const form = document.getElementById('pmo-form');
        
        // Real-time validation
        form.addEventListener('input', (e) => this.validateField(e.target));
        form.addEventListener('change', (e) => this.validateField(e.target));
        form.addEventListener('blur', (e) => this.validateField(e.target), true);
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value;
        let isValid = true;
        let message = '';

        // Clear previous validation state
        this.clearFieldValidation(field);

        // Skip validation if field is empty and not required
        if (!field.required && !value.trim()) {
            return true;
        }

        // Required field validation
        if (field.required && !value.trim()) {
            isValid = false;
            message = 'Este campo é obrigatório';
        }

        // Specific field validations
        switch (field.type) {
            case 'email':
                if (value && !this.validateEmail(value)) {
                    isValid = false;
                    message = 'Email inválido';
                }
                break;

            case 'tel':
                if (value && !this.validatePhone(value)) {
                    isValid = false;
                    message = 'Telefone inválido';
                }
                break;

            case 'number':
                if (value && isNaN(value)) {
                    isValid = false;
                    message = 'Apenas números são permitidos';
                } else if (field.min && value < field.min) {
                    isValid = false;
                    message = `Valor mínimo: ${field.min}`;
                } else if (field.max && value > field.max) {
                    isValid = false;
                    message = `Valor máximo: ${field.max}`;
                }
                break;

            case 'date':
                if (value && !this.validateDate(value)) {
                    isValid = false;
                    message = 'Data inválida';
                }
                break;
        }

        // Custom validations by field name
        if (fieldName.includes('cpf')) {
            if (value && !this.validateCPF(value)) {
                isValid = false;
                message = 'CPF inválido';
            }
        }

        if (fieldName.includes('cnpj')) {
            if (value && !this.validateCNPJ(value)) {
                isValid = false;
                message = 'CNPJ inválido';
            }
        }

        if (fieldName === 'cep') {
            if (value && !this.validateCEP(value)) {
                isValid = false;
                message = 'CEP inválido';
            }
        }

        if (fieldName === 'latitude') {
            if (value && !this.validateLatitude(value)) {
                isValid = false;
                message = 'Latitude inválida para o Brasil (-33.75 a 5.27)';
            }
        }

        if (fieldName === 'longitude') {
            if (value && !this.validateLongitude(value)) {
                isValid = false;
                message = 'Longitude inválida para o Brasil (-73.99 a -34.79)';
            }
        }

        // Apply validation styling
        this.applyFieldValidation(field, isValid, message);

        return isValid;
    }

    validateComplete() {
        this.errors = [];
        this.warnings = [];

        // Validate each section
        this.validateDadosEmpresa();
        this.validateFornecedores();
        this.validateEndereco();
        this.validateHistorico();
        this.validateCroqui();
        this.validateProdutos();
        this.validateComercializacao();

        return this.showValidationResults();
    }

    validateDadosEmpresa() {
        const razaoSocial = document.getElementById('razao_social').value;
        const documento = document.getElementById('documento').value;
        const areaTotal = document.getElementById('area_total').value;
        const areaOrganica = document.getElementById('area_organica').value;
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        if (!razaoSocial || razaoSocial.length < 3) {
            this.errors.push({
                section: 'Dados da Empresa',
                field: 'razao_social',
                message: 'Razão social deve ter pelo menos 3 caracteres'
            });
        }

        const tipoDocumento = document.querySelector('[name="tipo_documento"]:checked')?.value;
        if (tipoDocumento === 'cpf' && !this.validateCPF(documento)) {
            this.errors.push({
                section: 'Dados da Empresa',
                field: 'documento',
                message: 'CPF inválido'
            });
        } else if (tipoDocumento === 'cnpj' && !this.validateCNPJ(documento)) {
            this.errors.push({
                section: 'Dados da Empresa',
                field: 'documento',
                message: 'CNPJ inválido'
            });
        }

        if (parseFloat(areaOrganica) > parseFloat(areaTotal)) {
            this.errors.push({
                section: 'Dados da Empresa',
                field: 'area_organica',
                message: 'Área orgânica não pode ser maior que área total'
            });
        }

        if (!this.validateLatitude(latitude) || !this.validateLongitude(longitude)) {
            this.warnings.push({
                section: 'Dados da Empresa',
                field: 'coordenadas',
                message: 'Coordenadas parecem estar fora do Brasil'
            });
        }
    }

    validateFornecedores() {
        const fornecedores = document.querySelectorAll('#fornecedores-body tr');
        
        if (fornecedores.length === 0) {
            this.errors.push({
                section: 'Fornecedores',
                message: 'Pelo menos um fornecedor deve ser cadastrado'
            });
            return;
        }

        const cpfs = new Set();
        fornecedores.forEach((row, index) => {
            const nome = row.querySelector('[name="fornecedor_nome[]"]')?.value;
            const cpf = row.querySelector('[name="fornecedor_cpf[]"]')?.value;
            const nascimento = row.querySelector('[name="fornecedor_nascimento[]"]')?.value;
            const funcao = row.querySelector('[name="fornecedor_funcao[]"]')?.value;

            const rowNumber = index + 1;

            if (!nome || nome.length < 5) {
                this.errors.push({
                    section: 'Fornecedores',
                    message: `Fornecedor ${rowNumber}: Nome deve ter pelo menos 5 caracteres`
                });
            }

            if (!this.validateCPF(cpf)) {
                this.errors.push({
                    section: 'Fornecedores',
                    message: `Fornecedor ${rowNumber}: CPF inválido`
                });
            } else {
                if (cpfs.has(cpf)) {
                    this.errors.push({
                        section: 'Fornecedores',
                        message: `CPF duplicado: ${cpf}`
                    });
                }
                cpfs.add(cpf);
            }

            if (!this.validateAge(nascimento, 16)) {
                this.errors.push({
                    section: 'Fornecedores',
                    message: `Fornecedor ${rowNumber}: Deve ser maior de 16 anos`
                });
            }

            if (!funcao) {
                this.errors.push({
                    section: 'Fornecedores',
                    message: `Fornecedor ${rowNumber}: Função/cargo é obrigatório`
                });
            }
        });
    }

    validateEndereco() {
        const cep = document.getElementById('cep').value;
        const endereco = document.getElementById('endereco').value;
        const cidade = document.getElementById('cidade').value;
        const estado = document.getElementById('estado').value;

        if (!this.validateCEP(cep)) {
            this.errors.push({
                section: 'Endereço',
                field: 'cep',
                message: 'CEP inválido'
            });
        }

        if (!endereco || endereco.length < 5) {
            this.errors.push({
                section: 'Endereço',
                field: 'endereco',
                message: 'Endereço deve ter pelo menos 5 caracteres'
            });
        }

        if (!cidade) {
            this.errors.push({
                section: 'Endereço',
                field: 'cidade',
                message: 'Cidade é obrigatória'
            });
        }

        if (!estado) {
            this.errors.push({
                section: 'Endereço',
                field: 'estado',
                message: 'Estado é obrigatório'
            });
        }
    }

    validateHistorico() {
        const currentYear = new Date().getFullYear();
        let hasRecentOrganic = false;

        for (let year = currentYear; year >= currentYear - 3; year--) {
            const organico = document.querySelector(`[name="organico_${year}"]`)?.checked;
            if (organico) {
                hasRecentOrganic = true;
                break;
            }
        }

        if (!hasRecentOrganic) {
            this.warnings.push({
                section: 'Histórico',
                message: 'Recomenda-se pelo menos 3 anos de manejo orgânico para certificação'
            });
        }
    }

    validateCroqui() {
        const croquiFile = document.getElementById('croqui-file');
        const hasDrawing = this.canvasHasDrawing();
        
        if (!croquiFile.files.length && !hasDrawing) {
            this.errors.push({
                section: 'Croqui',
                message: 'O croqui da propriedade é obrigatório'
            });
        }

        // Check required elements
        const requiredElements = [
            'req-entrada', 'req-plantio', 'req-insumos', 'req-barreiras'
        ];
        
        const missingElements = requiredElements.filter(id => 
            !document.getElementById(id)?.checked
        );

        if (missingElements.length > 0) {
            this.warnings.push({
                section: 'Croqui',
                message: `${missingElements.length} elementos obrigatórios não identificados no croqui`
            });
        }
    }

    validateProdutos() {
        const produtos = document.querySelectorAll('#produtos-body .product-row');
        
        if (produtos.length === 0) {
            this.errors.push({
                section: 'Produtos',
                message: 'Pelo menos um produto deve ser cadastrado para certificação'
            });
            return;
        }

        const nomesProdutos = new Set();
        produtos.forEach((row, index) => {
            const nome = row.querySelector('[name="produto_nome[]"]')?.value?.toLowerCase();
            const talhao = row.querySelector('[name="produto_talhao[]"]')?.value;
            const quantidade = row.querySelector('[name="produto_qtd[]"]')?.value;
            const origemMuda = row.querySelector('[name="produto_origem_muda[]"]')?.value;
            const origemSemente = row.querySelector('[name="produto_origem_semente[]"]')?.value;

            const rowNumber = index + 1;

            if (!nome) {
                this.errors.push({
                    section: 'Produtos',
                    message: `Produto ${rowNumber}: Nome é obrigatório`
                });
            } else if (nomesProdutos.has(nome)) {
                this.warnings.push({
                    section: 'Produtos',
                    message: `Produto duplicado: ${nome}`
                });
            } else {
                nomesProdutos.add(nome);
            }

            if (!talhao) {
                this.errors.push({
                    section: 'Produtos',
                    message: `Produto ${rowNumber}: Talhão/área é obrigatório`
                });
            }

            if (!quantidade || parseFloat(quantidade) <= 0) {
                this.errors.push({
                    section: 'Produtos',
                    message: `Produto ${rowNumber}: Quantidade deve ser maior que zero`
                });
            }

            if (origemMuda === 'N/A' && !origemSemente) {
                this.warnings.push({
                    section: 'Produtos',
                    message: `Produto ${rowNumber}: Recomenda-se informar origem da muda ou semente`
                });
            }
        });
    }

    validateComercializacao() {
        const statusComercializacao = document.querySelector('[name="status_comercializacao"]:checked')?.value;
        
        if (!statusComercializacao) {
            this.errors.push({
                section: 'Comercialização',
                message: 'Status de comercialização é obrigatório'
            });
        }

        if (statusComercializacao === 'ja_comercializo') {
            const hasChannel = document.querySelector('[name^="venda_"]:checked, [name^="revenda_"]:checked');
            if (!hasChannel) {
                this.errors.push({
                    section: 'Comercialização',
                    message: 'Pelo menos um canal de comercialização deve ser selecionado'
                });
            }
        }
    }

    // Validation helper methods
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }

    validateCPF(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');
        
        if (cleanCPF.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cleanCPF)) return false; // All same digits
        
        // Validate check digits
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanCPF[i]) * (10 - i);
        }
        let digit1 = (sum * 10) % 11;
        if (digit1 === 10) digit1 = 0;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanCPF[i]) * (11 - i);
        }
        let digit2 = (sum * 10) % 11;
        if (digit2 === 10) digit2 = 0;
        
        return parseInt(cleanCPF[9]) === digit1 && parseInt(cleanCPF[10]) === digit2;
    }

    validateCNPJ(cnpj) {
        const cleanCNPJ = cnpj.replace(/\D/g, '');
        
        if (cleanCNPJ.length !== 14) return false;
        if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false; // All same digits
        
        // Validate check digits
        const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cleanCNPJ[i]) * weights1[i];
        }
        let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        
        sum = 0;
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cleanCNPJ[i]) * weights2[i];
        }
        let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        
        return parseInt(cleanCNPJ[12]) === digit1 && parseInt(cleanCNPJ[13]) === digit2;
    }

    validateCEP(cep) {
        const cleanCEP = cep.replace(/\D/g, '');
        return cleanCEP.length === 8;
    }

    validateLatitude(lat) {
        const latitude = parseFloat(lat);
        return !isNaN(latitude) && latitude >= -33.75 && latitude <= 5.27;
    }

    validateLongitude(lng) {
        const longitude = parseFloat(lng);
        return !isNaN(longitude) && longitude >= -73.99 && longitude <= -34.79;
    }

    validateDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    validateAge(birthDate, minAge) {
        if (!birthDate) return false;
        
        const birth = new Date(birthDate);
        const today = new Date();
        const age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));
        
        return age >= minAge;
    }

    canvasHasDrawing() {
        const canvas = document.getElementById('drawing-canvas');
        if (!canvas) return false;
        
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Check if any pixel is not white/transparent
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const a = imageData.data[i + 3];
            
            if (a !== 0 && (r !== 255 || g !== 255 || b !== 255)) {
                return true;
            }
        }
        
        return false;
    }

    // UI Methods
    clearFieldValidation(field) {
        field.classList.remove('field-valid', 'field-invalid', 'field-warning');
        
        // Remove existing feedback message
        const existingFeedback = field.parentElement.querySelector('.feedback-message');
        if (existingFeedback) {
            existingFeedback.remove();
        }
    }

    applyFieldValidation(field, isValid, message) {
        if (isValid) {
            field.classList.add('field-valid');
        } else {
            field.classList.add('field-invalid');
            
            // Add feedback message
            const feedback = document.createElement('div');
            feedback.className = 'feedback-message error';
            feedback.textContent = message;
            
            field.parentElement.appendChild(feedback);
        }
    }

    showValidationResults() {
        const resultsContainer = document.getElementById('validation-results');
        resultsContainer.innerHTML = '';
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            resultsContainer.innerHTML = `
                <div class="success-message">
                    <h3>✅ Formulário válido e pronto para envio!</h3>
                    <p>Todos os campos obrigatórios foram preenchidos corretamente.</p>
                </div>
            `;
            document.getElementById('submit-btn').disabled = false;
        } else {
            let html = '<div class="validation-results-content">';
            
            if (this.errors.length > 0) {
                html += '<div class="errors-list">';
                html += '<h4>❌ Erros encontrados (obrigatório corrigir):</h4>';
                html += '<ul>';
                this.errors.forEach(error => {
                    html += `<li><strong>${error.section}:</strong> ${error.message}</li>`;
                });
                html += '</ul></div>';
            }
            
            if (this.warnings.length > 0) {
                html += '<div class="warnings-list">';
                html += '<h4>⚠️ Avisos (recomendado revisar):</h4>';
                html += '<ul>';
                this.warnings.forEach(warning => {
                    html += `<li><strong>${warning.section}:</strong> ${warning.message}</li>`;
                });
                html += '</ul></div>';
            }
            
            html += '</div>';
            resultsContainer.innerHTML = html;
            
            // Disable submit if there are errors
            document.getElementById('submit-btn').disabled = this.errors.length > 0;
        }
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        return this.errors.length === 0;
    }
}

// Initialize validator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.formValidator = new FormValidator();
});

// Global validation function
function validateForm() {
    if (window.formValidator) {
        return window.formValidator.validateComplete();
    }
    return false;
}