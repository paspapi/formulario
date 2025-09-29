// Dynamic Fields Module
// PMO Form - ANC

class DynamicFieldManager {
    constructor() {
        this.fieldCounts = {};
        this.maxLimits = {
            fornecedores: 10,
            produtos: 100,
            telefones: 5,
            emails: 3
        };
        this.minLimits = {
            fornecedores: 1,
            produtos: 1
        };
        
        this.setupDynamicFields();
    }

    setupDynamicFields() {
        // Initialize field counts
        this.fieldCounts.fornecedores = document.querySelectorAll('#fornecedores-body tr').length;
        this.fieldCounts.produtos = document.querySelectorAll('#produtos-body tr').length;
        
        // Update button states
        this.updateButtonStates();
        
        console.log('Dynamic fields initialized');
    }

    // Generic method to add rows to any table
    addTableRow(tableBodyId, templateId, category) {
        const tbody = document.getElementById(tableBodyId);
        const template = document.getElementById(templateId);
        
        if (!tbody || !template) {
            console.error(`Table body ${tableBodyId} or template ${templateId} not found`);
            return false;
        }

        // Check max limit
        if (this.fieldCounts[category] >= this.maxLimits[category]) {
            if (window.showWarning) {
                window.showWarning(`Máximo de ${this.maxLimits[category]} ${category} permitidos`);
            } else {
                alert(`Máximo de ${this.maxLimits[category]} ${category} permitidos`);
            }
            return false;
        }

        // Clone template
        const clone = template.content.cloneNode(true);
        
        // Apply any specific setup for the cloned elements
        this.setupClonedElements(clone, category);
        
        // Append to table
        tbody.appendChild(clone);
        
        // Update count and button states
        this.fieldCounts[category]++;
        this.updateButtonStates(category);
        
        // Update row numbers if needed
        if (category === 'produtos') {
            this.updateProductRowNumbers();
        }
        
        return true;
    }

    // Generic method to remove table rows
    removeTableRow(button, category, tableBodyId) {
        const row = button.closest('tr');
        const tbody = document.getElementById(tableBodyId);
        
        if (!row || !tbody) return false;

        // Check min limit
        if (this.fieldCounts[category] <= this.minLimits[category]) {
            if (window.showWarning) {
                window.showWarning(`Mínimo de ${this.minLimits[category]} ${category} obrigatório(s)`);
            } else {
                alert(`Mínimo de ${this.minLimits[category]} ${category} obrigatório(s)`);
            }
            return false;
        }

        // Remove row
        row.remove();
        
        // Update count and button states
        this.fieldCounts[category]--;
        this.updateButtonStates(category);
        
        // Update row numbers if needed
        if (category === 'produtos') {
            this.updateProductRowNumbers();
        }
        
        return true;
    }

    // Setup cloned elements with event listeners and masks
    setupClonedElements(clone, category) {
        switch (category) {
            case 'fornecedores':
                this.setupFornecedorElements(clone);
                break;
            case 'produtos':
                this.setupProductElements(clone);
                break;
        }
    }

    setupFornecedorElements(clone) {
        // Apply CPF mask
        const cpfInput = clone.querySelector('.cpf-mask');
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                e.target.value = formatCPF(e.target.value);
            });
        }

        // Apply phone mask
        const phoneInput = clone.querySelector('.phone-mask');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                e.target.value = formatPhone(e.target.value);
            });
        }

        // Setup validation
        this.setupFieldValidation(clone);
    }

    setupProductElements(clone) {
        // Setup custom origin handler
        const originSelect = clone.querySelector('[name="produto_origem_muda[]"]');
        if (originSelect) {
            originSelect.addEventListener('change', function() {
                checkCustom(this);
            });
        }

        // Setup validation
        this.setupFieldValidation(clone);
    }

    setupFieldValidation(clone) {
        // Add validation listeners to required fields
        const requiredFields = clone.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                if (window.formValidator) {
                    window.formValidator.validateField(field);
                }
            });
            
            field.addEventListener('input', () => {
                if (window.updateProgress) {
                    window.updateProgress();
                }
            });
        });
    }

    updateButtonStates(category = null) {
        const categories = category ? [category] : Object.keys(this.fieldCounts);
        
        categories.forEach(cat => {
            this.updateCategoryButtons(cat);
        });
    }

    updateCategoryButtons(category) {
        const count = this.fieldCounts[category];
        const maxLimit = this.maxLimits[category];
        const minLimit = this.minLimits[category];

        // Update add buttons
        const addButtons = document.querySelectorAll(`[onclick*="${category}"], .btn-add-${category}`);
        addButtons.forEach(btn => {
            btn.disabled = count >= maxLimit;
            if (count >= maxLimit) {
                btn.title = `Máximo de ${maxLimit} ${category} atingido`;
            } else {
                btn.title = '';
            }
        });

        // Update remove buttons
        let removeButtons = [];
        if (category === 'fornecedores') {
            removeButtons = document.querySelectorAll('#fornecedores-body .btn-remove');
        } else if (category === 'produtos') {
            removeButtons = document.querySelectorAll('#produtos-body .btn-remove');
        }

        removeButtons.forEach(btn => {
            btn.disabled = count <= minLimit;
            if (count <= minLimit) {
                btn.title = `Mínimo de ${minLimit} ${category} obrigatório`;
            } else {
                btn.title = 'Remover';
            }
        });
    }

    updateProductRowNumbers() {
        const rows = document.querySelectorAll('#produtos-body .product-row');
        rows.forEach((row, index) => {
            const numberCell = row.querySelector('.row-number');
            if (numberCell) {
                numberCell.textContent = index + 1;
            }
        });
    }

    // Multiple contact fields management
    addContactField(button, type) {
        const container = button.closest('.multiple-contacts').parentElement;
        const contactCount = container.querySelectorAll('.multiple-contacts').length;
        
        const maxContacts = type === 'telefone' ? this.maxLimits.telefones : this.maxLimits.emails;
        
        if (contactCount >= maxContacts) {
            if (window.showWarning) {
                window.showWarning(`Máximo de ${maxContacts} ${type}s permitidos`);
            }
            return;
        }

        const newContactDiv = document.createElement('div');
        newContactDiv.className = 'multiple-contacts';
        newContactDiv.style.marginTop = '0.5rem';

        const inputType = type === 'telefone' ? 'tel' : 'email';
        const inputName = `fornecedor_${type}[]`;
        const placeholder = type === 'telefone' ? '(00) 00000-0000' : 'email@exemplo.com';

        newContactDiv.innerHTML = `
            <input type="${inputType}" name="${inputName}" placeholder="${placeholder}"
                   ${type === 'telefone' ? 'class="phone-mask"' : ''}>
            <button type="button" onclick="this.parentElement.remove()" class="btn-add-contact" 
                    style="background: #dc3545;">❌</button>
        `;

        // Add event listener for phone mask
        if (type === 'telefone') {
            const phoneInput = newContactDiv.querySelector('input');
            phoneInput.addEventListener('input', function(e) {
                e.target.value = formatPhone(e.target.value);
            });
        }

        container.appendChild(newContactDiv);
        
        // Update the original add button if limit reached
        if (contactCount + 1 >= maxContacts) {
            button.disabled = true;
            button.title = `Máximo de ${maxContacts} ${type}s atingido`;
        }
    }

    // Duplicate row functionality
    duplicateTableRow(button, category) {
        const row = button.closest('tr');
        const newRow = row.cloneNode(true);
        
        // Clear some specific fields and modify others
        if (category === 'produtos') {
            // Modify product name to indicate it's a copy
            const nameInput = newRow.querySelector('[name="produto_nome[]"]');
            if (nameInput && nameInput.value) {
                nameInput.value = nameInput.value + ' - Cópia';
            }
            
            // Clear quantity but keep other data
            const qtyInput = newRow.querySelector('[name="produto_qtd[]"]');
            if (qtyInput) {
                qtyInput.value = '';
            }
        }
        
        // Insert after current row
        row.parentNode.insertBefore(newRow, row.nextSibling);
        
        // Update counts and states
        this.fieldCounts[category]++;
        this.updateButtonStates(category);
        
        if (category === 'produtos') {
            this.updateProductRowNumbers();
        }
        
        // Setup event listeners for new row
        this.setupClonedElements(newRow, category);
    }

    // Sorting functionality
    sortTableRows(tableBodyId, sortBy) {
        const tbody = document.getElementById(tableBodyId);
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            let aValue = '';
            let bValue = '';
            
            if (sortBy === 'produto_nome') {
                aValue = a.querySelector('[name="produto_nome[]"]')?.value || '';
                bValue = b.querySelector('[name="produto_nome[]"]')?.value || '';
            } else if (sortBy === 'fornecedor_nome') {
                aValue = a.querySelector('[name="fornecedor_nome[]"]')?.value || '';
                bValue = b.querySelector('[name="fornecedor_nome[]"]')?.value || '';
            }
            
            return aValue.toLowerCase().localeCompare(bValue.toLowerCase(), 'pt-BR');
        });
        
        // Clear tbody and re-append sorted rows
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
        
        // Update row numbers if products
        if (tableBodyId === 'produtos-body') {
            this.updateProductRowNumbers();
        }
        
        if (window.showSuccess) {
            window.showSuccess('Lista ordenada alfabeticamente!');
        }
    }

    // Import functionality
    importData(category, data) {
        if (!Array.isArray(data)) {
            console.error('Import data must be an array');
            return false;
        }
        
        let successCount = 0;
        
        data.forEach(item => {
            if (category === 'produtos') {
                if (this.addTableRow('produtos-body', 'product-row-template', 'produtos')) {
                    this.fillProductRow(item);
                    successCount++;
                }
            } else if (category === 'fornecedores') {
                if (this.addTableRow('fornecedores-body', 'fornecedor-row-template', 'fornecedores')) {
                    this.fillFornecedorRow(item);
                    successCount++;
                }
            }
        });
        
        if (window.showSuccess && successCount > 0) {
            window.showSuccess(`${successCount} ${category} importados com sucesso!`);
        }
        
        return successCount > 0;
    }

    fillProductRow(data) {
        const lastRow = document.querySelector('#produtos-body tr:last-child');
        if (!lastRow) return;
        
        const fields = {
            'produto_nome[]': data.nome || data.produto || data.name,
            'produto_talhao[]': data.talhao || data.area || data.location,
            'produto_qtd[]': data.quantidade || data.qty || data.quantity,
            'produto_unidade[]': data.unidade || data.unit,
            'produto_periodo[]': data.periodo || data.period,
            'produto_peso[]': data.peso || data.weight,
            'produto_origem_muda[]': data.origem_muda || data.seedling_origin,
            'produto_origem_semente[]': data.origem_semente || data.seed_origin
        };
        
        Object.entries(fields).forEach(([fieldName, value]) => {
            if (value) {
                const field = lastRow.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    field.value = value;
                }
            }
        });
    }

    fillFornecedorRow(data) {
        const lastRow = document.querySelector('#fornecedores-body tr:last-child');
        if (!lastRow) return;
        
        const fields = {
            'fornecedor_nome[]': data.nome || data.name,
            'fornecedor_cpf[]': data.cpf,
            'fornecedor_nascimento[]': data.nascimento || data.birth_date,
            'fornecedor_funcao[]': data.funcao || data.role,
            'fornecedor_telefone[]': data.telefone || data.phone,
            'fornecedor_email[]': data.email
        };
        
        Object.entries(fields).forEach(([fieldName, value]) => {
            if (value) {
                const field = lastRow.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    field.value = value;
                }
            }
        });
    }

    // Validation helpers
    validateDynamicFields() {
        const errors = [];
        
        // Check minimum requirements
        Object.entries(this.minLimits).forEach(([category, minLimit]) => {
            if (this.fieldCounts[category] < minLimit) {
                errors.push(`Mínimo de ${minLimit} ${category} obrigatório(s)`);
            }
        });
        
        return errors;
    }

    // Get field statistics
    getFieldStats() {
        return {
            counts: { ...this.fieldCounts },
            limits: {
                max: { ...this.maxLimits },
                min: { ...this.minLimits }
            }
        };
    }

    // Reset all dynamic fields
    resetFields(category) {
        if (confirm(`Tem certeza que deseja remover todos os ${category}?`)) {
            const tbody = document.getElementById(`${category}-body`);
            if (tbody) {
                // Keep only the minimum required rows
                const rows = tbody.querySelectorAll('tr');
                const minLimit = this.minLimits[category] || 0;
                
                for (let i = rows.length - 1; i >= minLimit; i--) {
                    rows[i].remove();
                }
                
                // Reset counter
                this.fieldCounts[category] = minLimit;
                this.updateButtonStates(category);
                
                if (category === 'produtos') {
                    this.updateProductRowNumbers();
                }
            }
        }
    }
}

// Global functions for backward compatibility

// Fornecedor functions
function addFornecedor() {
    if (window.dynamicFieldManager) {
        return window.dynamicFieldManager.addTableRow('fornecedores-body', 'fornecedor-row-template', 'fornecedores');
    }
}

function removeFornecedor(button) {
    if (window.dynamicFieldManager) {
        return window.dynamicFieldManager.removeTableRow(button, 'fornecedores', 'fornecedores-body');
    }
}

// Contact functions
function addContact(button, type) {
    if (window.dynamicFieldManager) {
        window.dynamicFieldManager.addContactField(button, type);
    }
}

// Product functions
function addProductRow() {
    if (window.dynamicFieldManager) {
        return window.dynamicFieldManager.addTableRow('produtos-body', 'product-row-template', 'produtos');
    }
}

function removeProductRow(button) {
    if (window.dynamicFieldManager) {
        return window.dynamicFieldManager.removeTableRow(button, 'produtos', 'produtos-body');
    }
}

function duplicateRow(button) {
    if (window.dynamicFieldManager) {
        window.dynamicFieldManager.duplicateTableRow(button, 'produtos');
    }
}

function sortProducts() {
    if (window.dynamicFieldManager) {
        window.dynamicFieldManager.sortTableRows('produtos-body', 'produto_nome');
    }
}

// Initialize dynamic field manager
document.addEventListener('DOMContentLoaded', function() {
    window.dynamicFieldManager = new DynamicFieldManager();
});