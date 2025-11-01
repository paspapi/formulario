/**
 * Rastreador de Progresso PMO
 * Calcula e salva progresso de formulários
 * @version 1.0.0
 */

class PMOProgressTracker {
    /**
     * Calcular progresso de um formulário
     * @param {string} formId - ID do formulário
     * @param {string} anexoId - ID do anexo (para salvar)
     * @returns {number} - Porcentagem (0-100)
     */
    static calculateFormProgress(formId, anexoId = null) {
        const form = document.getElementById(formId);
        if (!form) {
            console.warn(`Formulário ${formId} não encontrado`);
            return 0;
        }

        const requiredFields = form.querySelectorAll('[required]');
        if (requiredFields.length === 0) return 0;

        let filledCount = 0;
        let totalCount = requiredFields.length;

        // Contar campos preenchidos
        requiredFields.forEach(field => {
            if (this.isFieldFilled(field, form)) {
                filledCount++;
            }
        });

        const percentage = Math.round((filledCount / totalCount) * 100);

        // Salvar no scope manager se anexoId foi fornecido
        if (anexoId && window.PMOScopeManager) {
            window.PMOScopeManager.saveProgress(anexoId, percentage);
        }

        return percentage;
    }

    /**
     * Verificar se um campo está preenchido
     * @param {HTMLElement} field
     * @param {HTMLFormElement} form
     * @returns {boolean}
     */
    static isFieldFilled(field, form) {
        const type = field.type;
        const name = field.name;

        // Checkbox e Radio - verificar se algum está marcado
        if (type === 'checkbox' || type === 'radio') {
            const checked = form.querySelector(`[name="${name}"]:checked`);
            return checked !== null;
        }

        // Select - verificar se tem valor selecionado
        if (field.tagName === 'SELECT') {
            return field.value && field.value !== '';
        }

        // Input/Textarea - verificar se tem valor
        return field.value && field.value.trim() !== '';
    }

    /**
     * Atualizar barra de progresso visual
     * @deprecated Barra de progresso removida do menu - progresso exibido apenas no fluxo
     * @param {number} percentage
     * @param {string} barId - ID da barra de progresso
     * @param {string} textId - ID do texto de progresso
     */
    static updateProgressBar(percentage, barId = 'progress-bar', textId = 'progress-text') {
        // Função desabilitada - barra de progresso removida do menu
        // O progresso agora é exibido apenas no navegador de fluxo
        return;
    }

    /**
     * Auto-inicializar rastreamento de progresso
     * @param {string} formId
     * @param {string} anexoId
     * @param {number} updateInterval - Intervalo de atualização em ms (padrão: 2000)
     */
    static autoTrack(formId, anexoId, updateInterval = 2000) {
        const form = document.getElementById(formId);
        if (!form) {
            console.warn(`Formulário ${formId} não encontrado para auto-tracking`);
            return;
        }

        // Calcular progresso inicial
        const initialProgress = this.calculateFormProgress(formId, anexoId);
        this.updateProgressBar(initialProgress);

        // Atualizar quando formulário mudar
        let updateTimeout;
        form.addEventListener('change', () => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                const progress = this.calculateFormProgress(formId, anexoId);
                this.updateProgressBar(progress);
            }, 500); // Debounce de 500ms
        });

        // Atualizar periodicamente (para campos input sem evento change)
        setInterval(() => {
            const progress = this.calculateFormProgress(formId, anexoId);
            this.updateProgressBar(progress);
        }, updateInterval);

        console.log(`✅ Auto-tracking ativado para ${formId} (${anexoId})`);
    }

    /**
     * Obter estatísticas detalhadas do progresso
     * @param {string} formId
     * @returns {Object}
     */
    static getDetailedProgress(formId) {
        const form = document.getElementById(formId);
        if (!form) return null;

        const requiredFields = form.querySelectorAll('[required]');
        const stats = {
            total: requiredFields.length,
            filled: 0,
            empty: 0,
            percentage: 0,
            bySection: {}
        };

        requiredFields.forEach(field => {
            if (this.isFieldFilled(field, form)) {
                stats.filled++;
            } else {
                stats.empty++;
            }

            // Agrupar por seção
            const section = field.closest('.form-section');
            if (section) {
                const sectionId = section.id || 'sem-secao';
                if (!stats.bySection[sectionId]) {
                    stats.bySection[sectionId] = {
                        total: 0,
                        filled: 0,
                        percentage: 0
                    };
                }
                stats.bySection[sectionId].total++;
                if (this.isFieldFilled(field, form)) {
                    stats.bySection[sectionId].filled++;
                }
            }
        });

        stats.percentage = stats.total > 0 ? Math.round((stats.filled / stats.total) * 100) : 0;

        // Calcular percentual por seção
        Object.keys(stats.bySection).forEach(sectionId => {
            const section = stats.bySection[sectionId];
            section.percentage = section.total > 0 ?
                Math.round((section.filled / section.total) * 100) : 0;
        });

        return stats;
    }

    /**
     * Listar campos não preenchidos
     * @param {string} formId
     * @returns {Array}
     */
    static getEmptyRequiredFields(formId) {
        const form = document.getElementById(formId);
        if (!form) return [];

        const requiredFields = form.querySelectorAll('[required]');
        const emptyFields = [];

        requiredFields.forEach(field => {
            if (!this.isFieldFilled(field, form)) {
                const label = this.getFieldLabel(field);
                const section = this.getFieldSection(field);

                emptyFields.push({
                    element: field,
                    name: field.name,
                    label: label,
                    section: section,
                    type: field.type
                });
            }
        });

        return emptyFields;
    }

    /**
     * Obter label de um campo
     * @param {HTMLElement} field
     * @returns {string}
     */
    static getFieldLabel(field) {
        // Procurar label pelo for
        const labelFor = document.querySelector(`label[for="${field.id}"]`);
        if (labelFor) {
            return labelFor.textContent.replace('*', '').trim();
        }

        // Procurar label pai
        const labelParent = field.closest('label');
        if (labelParent) {
            return labelParent.textContent.replace('*', '').trim();
        }

        // Usar name como fallback
        return field.name || 'Campo sem nome';
    }

    /**
     * Obter seção de um campo
     * @param {HTMLElement} field
     * @returns {string}
     */
    static getFieldSection(field) {
        const section = field.closest('.form-section');
        if (section) {
            const heading = section.querySelector('h2, h3');
            return heading ? heading.textContent.trim() : section.id;
        }
        return 'Seção não identificada';
    }
}

// Expor globalmente
window.PMOProgressTracker = PMOProgressTracker;

export default PMOProgressTracker;
