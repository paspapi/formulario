/**
 * JavaScript para Anexo de Produção Primária Vegetal - PMO ANC
 * Sistema completo de validação e interatividade
 */

class FormularioProducaoVegetal {
    constructor() {
        this.formData = {};
        this.errors = [];
        this.warnings = [];
        this.autoSaveInterval = null;

        this.initializeEventListeners();
        this.setupAutoSave();
        this.loadSavedData();
        this.initializeTooltips();
        this.updateProgress();
    }

    // Inicialização de event listeners
    initializeEventListeners() {
        // Listeners para checkboxes que mostram/escondem campos
        document.querySelectorAll('input[type="checkbox"][onchange]').forEach(checkbox => {
            checkbox.addEventListener('change', this.handleCheckboxChange.bind(this));
        });

        // Listeners para selects que mostram/escondem campos
        document.querySelectorAll('select[onchange]').forEach(select => {
            select.addEventListener('change', this.handleSelectChange.bind(this));
        });

        // Listeners para validação em tempo real
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        // Listener para submissão do formulário
        const form = document.getElementById('anexo-producao-vegetal');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    // Configurar auto-save
    setupAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, 30000); // Auto-save a cada 30 segundos
    }

    // Carregar dados salvos
    loadSavedData() {
        const savedData = localStorage.getItem('anexo_vegetal_data');
        if (savedData) {
            try {
                this.formData = JSON.parse(savedData);
                this.populateForm(this.formData);
                this.showNotification('Dados salvos carregados', 'success');
            } catch (error) {
                console.error('Erro ao carregar dados salvos:', error);
            }
        }
    }

    // Preencher formulário com dados
    populateForm(data) {
        Object.keys(data).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = data[key] === 'on' || data[key] === field.value;
                } else {
                    field.value = data[key];
                }

                // Triggerar eventos para campos que mostram/escondem outros
                if (field.hasAttribute('onchange')) {
                    field.dispatchEvent(new Event('change'));
                }
            }
        });
    }

    // Auto-save
    autoSave() {
        const formData = new FormData(document.getElementById('anexo-producao-vegetal'));
        const data = Object.fromEntries(formData);

        localStorage.setItem('anexo_vegetal_data', JSON.stringify(data));
        localStorage.setItem('anexo_vegetal_timestamp', new Date().toISOString());

        console.log('Auto-save realizado');
    }

    // Manipulação de mudanças em checkboxes
    handleCheckboxChange(event) {
        const checkbox = event.target;

        // Implementar lógica específica baseada no name do checkbox
        switch (checkbox.name) {
            case 'preparo_rocada':
            case 'preparo_aracao':
            case 'preparo_gradagem':
                this.showDetails(checkbox);
                break;
            case 'preparo_outros':
                this.showOthers(checkbox);
                break;
            case 'plantio_direto':
                this.togglePlantioDetails(checkbox);
                break;
            case 'rotacao_culturas':
            case 'adubacao_verde':
            case 'consorcios':
                this.togglePractice(checkbox);
                break;
            default:
                // Comportamento padrão para outros checkboxes
                this.showDetails(checkbox);
        }

        this.updateProgress();
    }

    // Manipulação de mudanças em selects
    handleSelectChange(event) {
        const select = event.target;

        switch (select.name) {
            case 'barreiras_estado':
                this.showBarrierDetails(select);
                break;
            case 'formiga_nivel':
                this.updateAntControl(select);
                break;
            case 'substrato_uso':
                this.toggleSubstrate(select);
                break;
            default:
                // Comportamento padrão
                break;
        }

        this.updateProgress();
    }

    // Funções específicas de controle de visibilidade
    showDetails(checkbox) {
        const detailField = checkbox.parentElement.nextElementSibling;
        if (detailField && detailField.classList.contains('detail-field')) {
            if (checkbox.checked) {
                detailField.style.display = 'block';
                this.setFieldsRequired(detailField, true);
            } else {
                detailField.style.display = 'none';
                this.clearFields(detailField);
                this.setFieldsRequired(detailField, false);
            }
        }
    }

    showOthers(checkbox) {
        const otherField = document.getElementById('outros-preparo');
        if (otherField) {
            if (checkbox.checked) {
                otherField.style.display = 'block';
            } else {
                otherField.style.display = 'none';
                this.clearFields(otherField);
            }
        }
    }

    togglePlantioDetails(checkbox) {
        const details = document.getElementById('plantio-direto-details');
        if (details) {
            if (checkbox.checked) {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
                this.clearFields(details);
            }
        }
    }

    togglePractice(checkbox) {
        const details = checkbox.parentElement.nextElementSibling;
        if (details && details.classList.contains('practice-details')) {
            if (checkbox.checked) {
                details.style.display = 'block';
                details.classList.add('active');
            } else {
                details.style.display = 'none';
                details.classList.remove('active');
                this.clearFields(details);
            }
        }
    }

    showBarrierDetails(select) {
        const details = document.getElementById('barrier-details');
        if (details) {
            if (select.value && select.value !== 'inexistente') {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
                this.clearFields(details);
            }
        }
    }

    updateAntControl(select) {
        const methods = document.getElementById('ant-control-methods');
        if (methods) {
            if (select.value && select.value !== 'ausente') {
                methods.style.display = 'block';
            } else {
                methods.style.display = 'none';
                this.clearFields(methods);
            }
        }
    }

    toggleSubstrate(select) {
        const details = document.getElementById('substrate-details');
        if (details) {
            if (select.value !== 'nao') {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
                this.clearFields(details);
            }
        }
    }

    // Utilitários para manipulação de campos
    clearFields(container) {
        const inputs = container.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    }

    setFieldsRequired(container, required) {
        const inputs = container.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.required = required;
        });
    }

    // Validação de campos individuais
    validateField(field) {
        let valid = true;
        const errors = [];

        // Validação básica de campos obrigatórios
        if (field.required && !field.value.trim()) {
            errors.push('Campo obrigatório');
            valid = false;
        }

        // Validações específicas por tipo de campo
        switch (field.type) {
            case 'email':
                if (field.value && !this.isValidEmail(field.value)) {
                    errors.push('Email inválido');
                    valid = false;
                }
                break;
            case 'number':
                if (field.value && (isNaN(field.value) || field.value < 0)) {
                    errors.push('Número inválido');
                    valid = false;
                }
                break;
        }

        // Validações específicas por nome do campo
        switch (field.name) {
            case 'rotacao_ciclo':
                if (field.value && (field.value < 1 || field.value > 48)) {
                    errors.push('Ciclo deve ser entre 1 e 48 meses');
                    valid = false;
                }
                break;
            case 'substrato_proporcao[]':
                this.validateSubstrateComposition();
                break;
        }

        this.displayFieldValidation(field, valid, errors);
        return valid;
    }

    // Validação específica para composição de substrato
    validateSubstrateComposition() {
        const proporcoes = document.querySelectorAll('[name="substrato_proporcao[]"]');
        let total = 0;

        proporcoes.forEach(input => {
            total += parseFloat(input.value) || 0;
        });

        const totalDisplay = document.getElementById('substrate-total');
        if (totalDisplay) {
            totalDisplay.textContent = `${total}%`;

            if (total === 100) {
                totalDisplay.style.color = 'green';
            } else if (total > 100) {
                totalDisplay.style.color = 'red';
            } else {
                totalDisplay.style.color = 'orange';
            }
        }

        return total === 100;
    }

    // Validação completa do formulário
    validateAnexo() {
        this.errors = [];
        this.warnings = [];
        let valid = true;

        // Validar se pelo menos um método de preparo foi selecionado
        const preparoMethods = document.querySelectorAll('[name^="preparo_"]:checked');
        if (preparoMethods.length === 0) {
            this.addError('Selecione pelo menos um método de preparo do solo');
            valid = false;
        }

        // Validar barreiras verdes vs risco de deriva
        const riscoDeriva = document.querySelector('[name="risco_deriva"]:checked');
        const barreiraEstado = document.querySelector('[name="barreiras_estado"]');

        if (riscoDeriva?.value === 'sim' && barreiraEstado?.value === 'inexistente') {
            this.addError('Barreiras verdes são obrigatórias quando há risco de deriva');
            valid = false;
        }

        // Validar composição do substrato se utilizado
        const substratoUso = document.querySelector('[name="substrato_uso"]:checked');
        if (substratoUso && substratoUso.value !== 'nao') {
            if (!this.validateSubstrateComposition()) {
                this.addError('Composição do substrato deve somar 100%');
                valid = false;
            }
        }

        // Verificar declarações obrigatórias
        const declaracoes = document.querySelectorAll('.declaration-required input[type="checkbox"]');
        declaracoes.forEach(decl => {
            if (!decl.checked) {
                this.addError(`Declaração obrigatória não marcada`);
                valid = false;
            }
        });

        // Validações recomendadas (warnings)
        this.validatePraticasConservacionistas();

        this.showValidationResults();
        return valid;
    }

    // Validação de práticas conservacionistas (warning)
    validatePraticasConservacionistas() {
        const praticas = document.querySelectorAll('.practice-block input[type="checkbox"]:checked');
        if (praticas.length === 0) {
            this.addWarning('Recomenda-se ao menos uma prática conservacionista');
        }
    }

    // Análise de riscos de vizinhos
    analyzeNeighborRisks() {
        const vizinhos = document.querySelectorAll('#vizinhos-table tbody tr');
        let riscos = [];

        vizinhos.forEach((row, index) => {
            const direcao = row.cells[0].textContent;
            const agrotoxicos = row.querySelector('select[name*="agrotoxicos"]')?.value;
            const distancia = parseFloat(row.querySelector('input[name*="distancia"]')?.value);
            const protecao = row.querySelector('input[name*="protecao"]')?.value;

            if (agrotoxicos === 'sim') {
                let nivelRisco = 'baixo';
                let mensagem = `Vizinho ${direcao} usa agrotóxicos`;

                if (distancia < 50) {
                    nivelRisco = distancia < 20 ? 'alto' : 'medio';
                    mensagem += ` - Distância: ${distancia}m`;
                }

                if (!protecao || protecao.trim() === '') {
                    nivelRisco = 'alto';
                    mensagem += ' - Sem proteção';
                }

                riscos.push({
                    direcao,
                    nivel: nivelRisco,
                    mensagem,
                    distancia,
                    protecao
                });
            }
        });

        this.displayRiskAnalysis(riscos);
        return riscos;
    }

    // Exibir análise de riscos
    displayRiskAnalysis(riscos) {
        // Remover análise anterior
        const existingAnalysis = document.querySelector('.risk-analysis-result');
        if (existingAnalysis) {
            existingAnalysis.remove();
        }

        const container = document.createElement('div');
        container.className = 'risk-analysis-result';

        if (riscos.length > 0) {
            const riscosAltos = riscos.filter(r => r.nivel === 'alto');
            const riscosMedios = riscos.filter(r => r.nivel === 'medio');

            container.innerHTML = `
                <h4>⚠️ Análise de Riscos Identificados</h4>
                ${riscosAltos.length > 0 ? `
                    <div class="risk-high">
                        <h5>🔴 Riscos Altos:</h5>
                        <ul>
                            ${riscosAltos.map(r => `<li>${r.mensagem}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${riscosMedios.length > 0 ? `
                    <div class="risk-medium">
                        <h5>🟡 Riscos Médios:</h5>
                        <ul>
                            ${riscosMedios.map(r => `<li>${r.mensagem}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="risk-recommendations">
                    <h5>📋 Recomendações:</h5>
                    <ul>
                        <li>Reforçar barreiras vegetais nas direções de risco</li>
                        <li>Estabelecer faixa de segurança mínima de 10m</li>
                        <li>Dialogar com vizinhos sobre calendário de aplicações</li>
                        <li>Realizar análises de resíduos periodicamente</li>
                        ${riscosAltos.length > 0 ? '<li><strong>Considere mudança de culturas nas áreas de maior risco</strong></li>' : ''}
                    </ul>
                </div>
            `;
        } else {
            container.innerHTML = '<div class="success">✅ Nenhum risco significativo identificado</div>';
        }

        const riskAssessment = document.querySelector('.risk-assessment');
        if (riskAssessment) {
            riskAssessment.appendChild(container);
        }
    }

    // Cálculo de necessidades de insumos
    calculateInputNeeds() {
        const area = parseFloat(document.querySelector('[name="area_organica"]')?.value || 0);
        const estercoQtd = parseFloat(document.querySelector('[name="esterco_quantidade"]')?.value || 0);

        if (area > 0 && estercoQtd > 0) {
            const totalEsterco = area * estercoQtd;
            const resultados = {
                area,
                estercoQtd,
                totalEsterco,
                custoEstimado: totalEsterco * 50 // R$ 50 por tonelada (estimativa)
            };

            this.displayInputCalculation(resultados);
        }
    }

    // Exibir cálculos de insumos
    displayInputCalculation(resultados) {
        const existing = document.querySelector('.calculation-result');
        if (existing) existing.remove();

        const result = document.createElement('div');
        result.className = 'calculation-result';
        result.innerHTML = `
            <h4>📊 Cálculo de Necessidade Anual</h4>
            <div class="calc-grid">
                <div class="calc-item">
                    <label>Área orgânica:</label>
                    <span>${resultados.area} ha</span>
                </div>
                <div class="calc-item">
                    <label>Aplicação:</label>
                    <span>${resultados.estercoQtd} ton/ha</span>
                </div>
                <div class="calc-item highlight">
                    <label>Total necessário:</label>
                    <span><strong>${resultados.totalEsterco} toneladas/ano</strong></span>
                </div>
                <div class="calc-item">
                    <label>Custo estimado:</label>
                    <span>R$ ${resultados.custoEstimado.toLocaleString('pt-BR')}</span>
                </div>
            </div>
        `;

        const manureSection = document.querySelector('.manure-management');
        if (manureSection) {
            manureSection.appendChild(result);
        }
    }

    // Funções para adicionar elementos dinâmicos
    addAduboVerde() {
        const container = document.getElementById('adubos-verdes-container');
        if (!container) return;

        const template = container.querySelector('.adubo-verde-item');
        const newItem = template.cloneNode(true);

        // Limpar valores
        newItem.querySelectorAll('input, select').forEach(field => {
            field.value = '';
        });

        container.appendChild(newItem);
    }

    addConsorcio() {
        const tbody = document.getElementById('consorcios-body');
        if (!tbody) return;

        const template = tbody.querySelector('tr');
        const newRow = template.cloneNode(true);

        newRow.querySelectorAll('input, select').forEach(field => {
            field.value = '';
        });

        tbody.appendChild(newRow);
    }

    addRecipe() {
        const container = document.getElementById('recipes-list');
        if (!container) return;

        const recipeCount = container.children.length + 1;
        // Aqui você implementaria a lógica completa para adicionar receita
        console.log('Adicionar receita', recipeCount);
    }

    // Remoção de itens
    removeItem(button) {
        const item = button.parentElement;
        const container = item.parentElement;

        // Só remove se não for o último item
        if (container.children.length > 2) { // 1 item + 1 botão adicionar
            item.remove();
        } else {
            this.showNotification('Deve manter pelo menos um item', 'warning');
        }
    }

    // Progress tracking
    updateProgress() {
        const form = document.getElementById('anexo-producao-vegetal');
        if (!form) return;

        const allFields = form.querySelectorAll('input, select, textarea');
        const filledFields = Array.from(allFields).filter(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                return field.checked;
            }
            return field.value.trim() !== '';
        });

        const progress = Math.round((filledFields.length / allFields.length) * 100);

        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}% concluído`;
    }

    // Tooltips
    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip.bind(this));
            element.addEventListener('mouseleave', this.hideTooltip.bind(this));
        });
    }

    showTooltip(event) {
        const element = event.target;
        const text = element.getAttribute('data-tooltip');

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
            z-index: 1000;
            max-width: 200px;
        `;

        document.body.appendChild(tooltip);

        // Posicionamento
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;

        element.tooltip = tooltip;
    }

    hideTooltip(event) {
        const element = event.target;
        if (element.tooltip) {
            element.tooltip.remove();
            element.tooltip = null;
        }
    }

    // Utilitários para validação
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    addError(message) {
        this.errors.push(message);
    }

    addWarning(message) {
        this.warnings.push(message);
    }

    clearFieldError(field) {
        field.classList.remove('field-invalid');
        const errorMsg = field.parentElement.querySelector('.field-error');
        if (errorMsg) errorMsg.remove();
    }

    displayFieldValidation(field, valid, errors) {
        this.clearFieldError(field);

        if (!valid) {
            field.classList.add('field-invalid');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errors.join(', ');
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '0.8rem';
            field.parentElement.appendChild(errorDiv);
        } else {
            field.classList.add('field-valid');
        }
    }

    showValidationResults() {
        let message = '';
        let type = 'success';

        if (this.errors.length > 0) {
            message = `Erros encontrados: ${this.errors.join(', ')}`;
            type = 'error';
        } else if (this.warnings.length > 0) {
            message = `Avisos: ${this.warnings.join(', ')}`;
            type = 'warning';
        } else {
            message = 'Formulário válido! ✅';
        }

        this.showNotification(message, type);
    }

    // Notificações
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        // Cores por tipo
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        if (type === 'warning') {
            notification.style.color = '#212529';
        }

        document.body.appendChild(notification);

        // Animação de entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remoção automática
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // Submissão do formulário
    handleSubmit(event) {
        event.preventDefault();

        if (this.validateAnexo()) {
            this.showNotification('Enviando formulário...', 'info');

            // Aqui você implementaria o envio real
            setTimeout(() => {
                this.showNotification('Formulário enviado com sucesso!', 'success');
            }, 2000);
        }
    }

    // Exportação
    exportToPDF() {
        if (this.validateAnexo()) {
            this.showNotification('Gerando PDF...', 'info');
            // Implementar exportação PDF
            window.print(); // Temporário
        }
    }

    // Limpeza ao destruir
    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }
}

// Funções globais para compatibilidade com HTML
let formularioVegetal;

// Funções chamadas pelo HTML
function showDetails(checkbox) {
    formularioVegetal?.showDetails(checkbox);
}

function showOthers(checkbox) {
    formularioVegetal?.showOthers(checkbox);
}

function togglePlantioDetails(checkbox) {
    formularioVegetal?.togglePlantioDetails(checkbox);
}

function togglePractice(checkbox) {
    formularioVegetal?.togglePractice(checkbox);
}

function showBarrierDetails(select) {
    formularioVegetal?.showBarrierDetails(select);
}

function updateAntControl(select) {
    formularioVegetal?.updateAntControl(select);
}

function toggleSubstrate(select) {
    formularioVegetal?.toggleSubstrate(select);
}

function addAduboVerde() {
    formularioVegetal?.addAduboVerde();
}

function removeItem(button) {
    formularioVegetal?.removeItem(button);
}

function saveForm() {
    formularioVegetal?.autoSave();
    formularioVegetal?.showNotification('Rascunho salvo com sucesso!', 'success');
}

function validateForm() {
    return formularioVegetal?.validateAnexo();
}

function exportForm() {
    formularioVegetal?.exportToPDF();
}

// Inicialização quando DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    formularioVegetal = new FormularioProducaoVegetal();

    // Análise automática de riscos quando dados de vizinhos são preenchidos
    document.querySelectorAll('#vizinhos-table input, #vizinhos-table select').forEach(field => {
        field.addEventListener('blur', () => {
            setTimeout(() => formularioVegetal.analyzeNeighborRisks(), 100);
        });
    });

    // Cálculo automático quando área ou quantidade de esterco mudam
    document.querySelectorAll('[name="area_organica"], [name="esterco_quantidade"]').forEach(field => {
        field.addEventListener('blur', () => {
            formularioVegetal.calculateInputNeeds();
        });
    });

    console.log('Formulário de Produção Vegetal inicializado');
});