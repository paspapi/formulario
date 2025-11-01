/**
 * PMO Timeline Component
 * Componente reutilizável para criar linhas do tempo visuais
 * @version 1.0.0
 */

class PMOTimeline {
    /**
     * Cria uma timeline horizontal
     * @param {Object} config - Configuração da timeline
     * @param {Array} config.steps - Array de etapas
     * @param {string} config.steps[].id - ID da etapa
     * @param {string} config.steps[].label - Label da etapa
     * @param {string} config.steps[].status - Status: 'completed', 'current', 'pending'
     * @param {string} config.steps[].date - Data da etapa (opcional)
     * @param {string} config.steps[].icon - Emoji ou ícone (opcional)
     * @param {string} config.containerId - ID do container onde renderizar
     * @returns {HTMLElement} Elemento da timeline
     */
    static createHorizontal(config) {
        const { steps, containerId } = config;

        const timeline = document.createElement('div');
        timeline.className = 'pmo-timeline pmo-timeline-horizontal';

        steps.forEach((step, index) => {
            const stepElement = this.createStep(step, index, steps.length);
            timeline.appendChild(stepElement);

            // Adicionar conector entre etapas (exceto a última)
            if (index < steps.length - 1) {
                const connector = this.createConnector(step.status, steps[index + 1].status);
                timeline.appendChild(connector);
            }
        });

        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
                container.appendChild(timeline);
            }
        }

        return timeline;
    }

    /**
     * Cria uma timeline vertical
     * @param {Object} config - Mesma estrutura do createHorizontal
     * @returns {HTMLElement} Elemento da timeline
     */
    static createVertical(config) {
        const { steps, containerId } = config;

        const timeline = document.createElement('div');
        timeline.className = 'pmo-timeline pmo-timeline-vertical';

        steps.forEach((step, index) => {
            const stepElement = this.createStepVertical(step, index, steps.length);
            timeline.appendChild(stepElement);
        });

        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
                container.appendChild(timeline);
            }
        }

        return timeline;
    }

    /**
     * Cria elemento de etapa horizontal
     */
    static createStep(step, index, total) {
        const stepDiv = document.createElement('div');
        stepDiv.className = `timeline-step timeline-step-${step.status}`;
        stepDiv.setAttribute('data-step-id', step.id);

        // Ícone/Badge
        const badge = document.createElement('div');
        badge.className = `timeline-badge timeline-badge-${step.status}`;

        if (step.icon) {
            badge.textContent = step.icon;
        } else {
            // Ícones padrão por status
            const defaultIcons = {
                completed: '✅',
                current: '🔄',
                pending: '⚪'
            };
            badge.textContent = defaultIcons[step.status] || '○';
        }

        // Label
        const label = document.createElement('div');
        label.className = 'timeline-label';
        label.textContent = step.label;

        // Data (opcional)
        if (step.date) {
            const date = document.createElement('div');
            date.className = 'timeline-date';
            date.textContent = this.formatDate(step.date);
            stepDiv.appendChild(date);
        }

        stepDiv.appendChild(badge);
        stepDiv.appendChild(label);

        return stepDiv;
    }

    /**
     * Cria elemento de etapa vertical
     */
    static createStepVertical(step, index, total) {
        const stepDiv = document.createElement('div');
        stepDiv.className = `timeline-step-vertical timeline-step-${step.status}`;
        stepDiv.setAttribute('data-step-id', step.id);

        // Container do badge
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'timeline-badge-container';

        const badge = document.createElement('div');
        badge.className = `timeline-badge timeline-badge-${step.status}`;

        if (step.icon) {
            badge.textContent = step.icon;
        } else {
            const defaultIcons = {
                completed: '✅',
                current: '🔄',
                pending: '⚪'
            };
            badge.textContent = defaultIcons[step.status] || '○';
        }

        badgeContainer.appendChild(badge);

        // Linha vertical (exceto último item)
        if (index < total - 1) {
            const line = document.createElement('div');
            line.className = `timeline-line timeline-line-${step.status}`;
            badgeContainer.appendChild(line);
        }

        // Conteúdo
        const content = document.createElement('div');
        content.className = 'timeline-content';

        const label = document.createElement('div');
        label.className = 'timeline-label';
        label.textContent = step.label;
        content.appendChild(label);

        if (step.date) {
            const date = document.createElement('div');
            date.className = 'timeline-date';
            date.textContent = this.formatDate(step.date);
            content.appendChild(date);
        }

        if (step.description) {
            const desc = document.createElement('div');
            desc.className = 'timeline-description';
            desc.textContent = step.description;
            content.appendChild(desc);
        }

        stepDiv.appendChild(badgeContainer);
        stepDiv.appendChild(content);

        return stepDiv;
    }

    /**
     * Cria conector entre etapas
     */
    static createConnector(currentStatus, nextStatus) {
        const connector = document.createElement('div');
        connector.className = 'timeline-connector';

        // Conector completo se ambas etapas estão completas
        if (currentStatus === 'completed' && nextStatus === 'completed') {
            connector.classList.add('timeline-connector-completed');
        } else if (currentStatus === 'completed') {
            connector.classList.add('timeline-connector-partial');
        } else {
            connector.classList.add('timeline-connector-pending');
        }

        return connector;
    }

    /**
     * Formata data para exibição
     */
    static formatDate(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    }

    /**
     * Atualiza status de uma etapa
     */
    static updateStepStatus(stepId, newStatus, newDate = null) {
        const step = document.querySelector(`[data-step-id="${stepId}"]`);
        if (!step) return;

        // Remover classes antigas
        step.classList.remove('timeline-step-completed', 'timeline-step-current', 'timeline-step-pending');
        step.classList.add(`timeline-step-${newStatus}`);

        // Atualizar badge
        const badge = step.querySelector('.timeline-badge');
        if (badge) {
            badge.classList.remove('timeline-badge-completed', 'timeline-badge-current', 'timeline-badge-pending');
            badge.classList.add(`timeline-badge-${newStatus}`);
        }

        // Atualizar data se fornecida
        if (newDate) {
            let dateElement = step.querySelector('.timeline-date');
            if (!dateElement) {
                dateElement = document.createElement('div');
                dateElement.className = 'timeline-date';
                step.appendChild(dateElement);
            }
            dateElement.textContent = this.formatDate(newDate);
        }
    }

    /**
     * Obtém progresso da timeline em porcentagem
     */
    static getProgress(steps) {
        const completed = steps.filter(s => s.status === 'completed').length;
        return Math.round((completed / steps.length) * 100);
    }

    /**
     * Injeta estilos CSS da timeline
     */
    static injectStyles() {
        if (document.getElementById('pmo-timeline-styles')) return;

        const style = document.createElement('style');
        style.id = 'pmo-timeline-styles';
        style.textContent = `
            /* Timeline Horizontal */
            .pmo-timeline-horizontal {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 2rem 1rem;
                background: white;
                border-radius: 0.5rem;
                overflow-x: auto;
            }

            .timeline-step {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 120px;
                position: relative;
            }

            .timeline-badge {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
                transition: all 0.3s ease;
            }

            .timeline-badge-completed {
                background: var(--success, #10b981);
                color: white;
            }

            .timeline-badge-current {
                background: var(--info, #3b82f6);
                color: white;
                animation: pulse 2s infinite;
            }

            .timeline-badge-pending {
                background: var(--gray-300, #d1d5db);
                color: var(--gray-600, #4b5563);
            }

            .timeline-label {
                text-align: center;
                font-weight: 600;
                font-size: 0.875rem;
                color: var(--gray-700, #374151);
                max-width: 120px;
            }

            .timeline-date {
                font-size: 0.75rem;
                color: var(--gray-500, #6b7280);
                margin-top: 0.25rem;
            }

            .timeline-connector {
                flex: 1;
                height: 3px;
                margin: 0 0.5rem;
                margin-bottom: 3rem;
            }

            .timeline-connector-completed {
                background: var(--success, #10b981);
            }

            .timeline-connector-partial {
                background: linear-gradient(to right, var(--success, #10b981) 50%, var(--gray-300, #d1d5db) 50%);
            }

            .timeline-connector-pending {
                background: var(--gray-300, #d1d5db);
            }

            /* Timeline Vertical */
            .pmo-timeline-vertical {
                padding: 1rem;
                background: white;
                border-radius: 0.5rem;
            }

            .timeline-step-vertical {
                display: flex;
                gap: 1rem;
                position: relative;
            }

            .timeline-badge-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
            }

            .timeline-line {
                width: 3px;
                flex: 1;
                margin-top: 0.5rem;
                min-height: 40px;
            }

            .timeline-line-completed {
                background: var(--success, #10b981);
            }

            .timeline-line-current,
            .timeline-line-pending {
                background: var(--gray-300, #d1d5db);
            }

            .timeline-content {
                flex: 1;
                padding-bottom: 1.5rem;
            }

            .timeline-description {
                font-size: 0.875rem;
                color: var(--gray-600, #4b5563);
                margin-top: 0.25rem;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.9; }
            }

            /* Responsivo */
            @media (max-width: 768px) {
                .pmo-timeline-horizontal {
                    flex-direction: column;
                    align-items: stretch;
                }

                .timeline-step {
                    min-width: auto;
                    width: 100%;
                    flex-direction: row;
                    justify-content: flex-start;
                    margin-bottom: 1rem;
                }

                .timeline-badge {
                    margin-right: 1rem;
                    margin-bottom: 0;
                }

                .timeline-label {
                    text-align: left;
                    max-width: none;
                }

                .timeline-connector {
                    display: none;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Auto-injetar estilos ao carregar
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PMOTimeline.injectStyles());
    } else {
        PMOTimeline.injectStyles();
    }
}

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PMOTimeline;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.PMOTimeline = PMOTimeline;
}

export default PMOTimeline;
