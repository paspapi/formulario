/**
 * Flow Navigator - Navegador de Fluxo Dinâmico para PMO
 * Mostra a sequência de preenchimento baseada nos escopos selecionados
 * com indicação visual de progresso e página atual
 */

class FlowNavigator {
    constructor() {
        // Mapeamento de escopos para anexos
        this.scopeToAnexo = {
            'escopo_hortalicas': 'anexo-vegetal',
            'escopo_frutas': 'anexo-vegetal',
            'escopo_medicinais': 'anexo-vegetal',
            'escopo_pecuaria': 'anexo-animal',
            'escopo_apicultura': 'anexo-apicultura',
            'escopo_cogumelos': 'anexo-cogumelo',
            'escopo_proc_minimo': 'anexo-processamentominimo',
            'escopo_processamento': 'anexo-processamento'
        };

        // Configuração dos anexos
        this.anexos = {
            'pmo-principal': {
                name: 'PMO Principal',
                icon: '📋',
                path: '../pmo-principal/index.html',
                order: 0
            },
            'anexo-vegetal': {
                name: 'Anexo Vegetal',
                icon: '🌱',
                path: '../anexo-vegetal/index.html',
                order: 1
            },
            'anexo-animal': {
                name: 'Anexo Animal',
                icon: '🐄',
                path: '../anexo-animal/index.html',
                order: 2
            },
            'anexo-cogumelo': {
                name: 'Anexo Cogumelo',
                icon: '🍄',
                path: '../anexo-cogumelo/index.html',
                order: 3
            },
            'anexo-apicultura': {
                name: 'Anexo Apicultura',
                icon: '🐝',
                path: '../anexo-apicultura/index.html',
                order: 4
            },
            'anexo-processamentominimo': {
                name: 'Processamento Mínimo',
                icon: '🥗',
                path: '../anexo-processamentominimo/index.html',
                order: 5
            },
            'anexo-processamento': {
                name: 'Processamento',
                icon: '🏭',
                path: '../anexo-processamento/index.html',
                order: 6
            }
        };
    }

    /**
     * Detecta qual anexo é a página atual
     */
    getCurrentAnexo() {
        const path = window.location.pathname;

        for (const [key, anexo] of Object.entries(this.anexos)) {
            if (path.includes(key)) {
                return key;
            }
        }

        return 'pmo-principal'; // default
    }

    /**
     * Obtém escopos selecionados do localStorage (do PMO Principal)
     */
    getSelectedScopes() {
        try {
            // Primeiro tenta pegar do localStorage
            let data = null;
            const pmoData = localStorage.getItem('pmo-principal-form-data');

            if (pmoData) {
                data = JSON.parse(pmoData);
            } else {
                // Se não houver no localStorage, tenta ler do formulário atual
                const form = document.querySelector('#form-pmo-principal');
                if (form) {
                    const formData = new FormData(form);
                    data = {};
                    for (let [key, value] of formData.entries()) {
                        data[key] = value;
                    }
                }
            }

            if (!data) return [];

            const scopes = [];

            // Verifica cada campo de escopo
            for (const [key, value] of Object.entries(data)) {
                if (key.startsWith('escopo_') && (value === 'sim' || value === true || value === 'on' || value === 'true')) {
                    scopes.push(key);
                }
            }

            return scopes;
        } catch (error) {
            console.warn('Erro ao carregar escopos:', error);
            return [];
        }
    }

    /**
     * Determina quais anexos devem aparecer no fluxo
     */
    getFlowAnexos() {
        const selectedScopes = this.getSelectedScopes();
        const anexosSet = new Set(['pmo-principal']); // PMO Principal sempre aparece

        // Adiciona anexos baseados nos escopos selecionados
        selectedScopes.forEach(scope => {
            const anexo = this.scopeToAnexo[scope];
            if (anexo) {
                anexosSet.add(anexo);
            }
        });

        // Converte para array e ordena
        const anexosList = Array.from(anexosSet)
            .filter(key => this.anexos[key]) // Garante que o anexo existe
            .map(key => ({
                key,
                ...this.anexos[key]
            }))
            .sort((a, b) => a.order - b.order);

        return anexosList;
    }

    /**
     * Calcula o percentual de preenchimento de um formulário
     */
    getFormProgress(anexoKey) {
        try {
            const formData = localStorage.getItem(`${anexoKey}-form-data`);
            if (!formData) return 0;

            const data = JSON.parse(formData);
            const fields = Object.keys(data);
            const filledFields = fields.filter(key => {
                const value = data[key];
                return value !== null &&
                       value !== undefined &&
                       value !== '' &&
                       value !== false &&
                       !(Array.isArray(value) && value.length === 0);
            });

            if (fields.length === 0) return 0;

            const progress = Math.round((filledFields.length / fields.length) * 100);
            return Math.min(progress, 100);
        } catch (error) {
            console.warn(`Erro ao calcular progresso de ${anexoKey}:`, error);
            return 0;
        }
    }

    /**
     * Obtém o ícone de status baseado no progresso
     */
    getStatusIcon(progress, isCurrent) {
        if (isCurrent) {
            return '👉'; // Você está aqui
        } else if (progress === 100) {
            return '✅'; // Completo
        } else if (progress > 0) {
            return '⏳'; // Em progresso
        } else {
            return '⭕'; // Pendente
        }
    }

    /**
     * Gera o HTML do navegador de fluxo
     */
    render(containerId = 'flow-navigator') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn('Container do flow-navigator não encontrado');
            return;
        }

        const flowAnexos = this.getFlowAnexos();
        const currentAnexo = this.getCurrentAnexo();

        // Se estiver no PMO Principal e não houver escopos selecionados ainda
        if (currentAnexo === 'pmo-principal' && flowAnexos.length === 1) {
            container.innerHTML = `
                <div class="flow-navigator">
                    <a href="../dashboard/index.html" class="flow-back-link">
                        🏠 Voltar ao Dashboard
                    </a>
                    <div class="flow-current">
                        <span class="flow-icon">📋</span>
                        <span class="flow-title">PMO Principal</span>
                        <span class="flow-hint">Selecione os escopos na Seção 1 para ver o fluxo completo</span>
                    </div>
                </div>
            `;
            return;
        }

        // Gera o HTML do fluxo
        let html = `
            <div class="flow-navigator">
                <a href="../dashboard/index.html" class="flow-back-link">
                    🏠 Voltar ao Dashboard
                </a>
                <div class="flow-title-header">Fluxo de Preenchimento:</div>
                <div class="flow-steps">
        `;

        flowAnexos.forEach((anexo, index) => {
            const isCurrent = anexo.key === currentAnexo;
            const progress = this.getFormProgress(anexo.key);
            const statusIcon = this.getStatusIcon(progress, isCurrent);
            const statusClass = isCurrent ? 'current' :
                               progress === 100 ? 'complete' :
                               progress > 0 ? 'in-progress' :
                               'pending';

            html += `
                <div class="flow-step ${statusClass}">
                    <div class="flow-step-content">
                        <span class="flow-status-icon">${statusIcon}</span>
                        ${isCurrent ? `
                            <span class="flow-step-info">
                                <span class="flow-step-icon">${anexo.icon}</span>
                                <span class="flow-step-name">${anexo.name}</span>
                                ${isCurrent ? '<span class="flow-current-indicator">← Você está aqui</span>' : ''}
                            </span>
                        ` : `
                            <a href="${anexo.path}" class="flow-step-link">
                                <span class="flow-step-icon">${anexo.icon}</span>
                                <span class="flow-step-name">${anexo.name}</span>
                            </a>
                        `}
                        <span class="flow-progress">(${progress}%)</span>
                    </div>
                </div>
            `;

            // Adiciona seta entre os itens (exceto no último)
            if (index < flowAnexos.length - 1) {
                html += '<div class="flow-arrow">↓</div>';
            }
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Inicializa o navegador
     */
    init(containerId = 'flow-navigator') {
        // Renderiza imediatamente
        this.render(containerId);

        // Re-renderiza quando os dados mudarem
        window.addEventListener('storage', () => {
            this.render(containerId);
        });

        // Re-renderiza quando o formulário for salvo
        document.addEventListener('pmo-form-saved', () => {
            setTimeout(() => this.render(containerId), 100);
        });

        // Re-renderiza quando os checkboxes de escopo mudarem
        document.addEventListener('change', (e) => {
            if (e.target.name && e.target.name.startsWith('escopo_')) {
                // Salva o estado atual dos checkboxes no localStorage
                this.saveCurrentScopeState();
                // Re-renderiza o navegador
                setTimeout(() => this.render(containerId), 50);
            }
        });

        // Re-renderiza quando qualquer campo do formulário mudar (para atualizar %)
        document.addEventListener('input', () => {
            // Debounce para evitar renderizações excessivas
            clearTimeout(this._updateTimeout);
            this._updateTimeout = setTimeout(() => this.render(containerId), 500);
        });
    }

    /**
     * Salva o estado atual dos checkboxes de escopo no localStorage
     */
    saveCurrentScopeState() {
        try {
            const form = document.querySelector('#form-pmo-principal');
            if (!form) return;

            const formData = new FormData(form);
            const data = {};

            for (let [key, value] of formData.entries()) {
                if (key.startsWith('escopo_')) {
                    data[key] = value;
                }
            }

            // Também captura checkboxes desmarcados
            const scopeCheckboxes = form.querySelectorAll('input[name^="escopo_"]');
            scopeCheckboxes.forEach(checkbox => {
                if (!formData.has(checkbox.name)) {
                    data[checkbox.name] = null;
                }
            });

            // Atualiza apenas os campos de escopo no localStorage
            const existingData = JSON.parse(localStorage.getItem('pmo-principal-form-data') || '{}');
            const updatedData = { ...existingData, ...data };
            localStorage.setItem('pmo-principal-form-data', JSON.stringify(updatedData));

        } catch (error) {
            console.warn('Erro ao salvar estado do escopo:', error);
        }
    }
}

// Auto-inicialização quando o DOM estiver pronto
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('flow-navigator')) {
            const navigator = new FlowNavigator();
            navigator.init();
        }
    });
}

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.FlowNavigator = FlowNavigator;
}
