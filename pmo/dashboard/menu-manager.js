/**
 * Gerenciador de Menu Responsivo ao Escopo
 * Controla visibilidade e progresso dos itens do menu
 * @version 1.0.0
 */

class PMOMenuManager {
    constructor() {
        this.menuItems = {
            'anexo-vegetal': {
                element: null,
                label: '🌱 Produção Vegetal',
                selector: '[data-navigate="/pmo/anexo-vegetal"]'
            },
            'anexo-animal': {
                element: null,
                label: '🐄 Produção Animal',
                selector: '[data-navigate="/pmo/anexo-animal"]'
            },
            'anexo-cogumelo': {
                element: null,
                label: '🍄 Cogumelos',
                selector: '[data-navigate="/pmo/anexo-cogumelo"]'
            },
            'anexo-apicultura': {
                element: null,
                label: '🐝 Apicultura',
                selector: '[data-navigate="/pmo/anexo-apicultura"]'
            },
            'anexo-processamento': {
                element: null,
                label: '🏭 Processamento',
                selector: '[data-navigate="/pmo/anexo-processamento"]'
            },
            'anexo-processamentominimo': {
                element: null,
                label: '🥗 Proc. Mínimo',
                selector: '[data-navigate="/pmo/anexo-processamentominimo"]'
            }
        };

        this.init();
    }

    /**
     * Inicializar menu manager
     */
    init() {
        // Mapear elementos do menu
        Object.keys(this.menuItems).forEach(anexoId => {
            const item = this.menuItems[anexoId];
            item.element = document.querySelector(item.selector);
        });

        // Atualizar menu inicial
        this.updateMenu();

        // Listener para mudanças de escopo
        window.addEventListener('pmo-scope-changed', () => {
            this.updateMenu();
        });

        // Listener para mudanças de progresso
        window.addEventListener('pmo-progress-changed', (e) => {
            this.updateProgressBadge(e.detail.anexoId, e.detail.progress);
        });

        // Atualizar progresso a cada 30 segundos
        setInterval(() => {
            this.updateAllProgressBadges();
        }, 30000);

        console.log('✅ PMOMenuManager inicializado');
    }

    /**
     * Atualizar menu completo
     */
    updateMenu() {
        if (!window.PMOScopeManager) {
            console.warn('PMOScopeManager não disponível');
            return;
        }

        const enabledAnexos = window.PMOScopeManager.getEnabledAnexos();

        // Atualizar cada item do menu
        Object.keys(this.menuItems).forEach(anexoId => {
            const item = this.menuItems[anexoId];
            if (!item.element) return;

            const isEnabled = enabledAnexos.includes(anexoId);
            this.updateMenuItem(anexoId, isEnabled);

            // Atualizar badge de progresso
            if (isEnabled) {
                const progress = window.PMOScopeManager.getProgress(anexoId);
                this.updateProgressBadge(anexoId, progress);
            }
        });

        console.log('Menu atualizado:', enabledAnexos);
    }

    /**
     * Atualizar item individual do menu
     * @param {string} anexoId
     * @param {boolean} isEnabled
     */
    updateMenuItem(anexoId, isEnabled) {
        const item = this.menuItems[anexoId];
        if (!item || !item.element) return;

        const parentLi = item.element.closest('li');
        if (!parentLi) return;

        if (isEnabled) {
            // Habilitar item
            parentLi.style.display = '';
            item.element.classList.remove('nav-link-disabled');
            item.element.style.pointerEvents = '';
            item.element.style.opacity = '';
        } else {
            // Desabilitar item
            parentLi.style.display = 'none'; // Ou usar opacity para manter visível mas desabilitado
            item.element.classList.add('nav-link-disabled');
            item.element.style.pointerEvents = 'none';
            item.element.style.opacity = '0.4';
        }
    }

    /**
     * Atualizar badge de progresso de um item
     * @param {string} anexoId
     * @param {number} progress
     */
    updateProgressBadge(anexoId, progress) {
        const item = this.menuItems[anexoId];
        if (!item || !item.element) return;

        // Remover badge antigo se existir
        const oldBadge = item.element.querySelector('.progress-badge');
        if (oldBadge) {
            oldBadge.remove();
        }

        // Criar novo badge
        const badge = this.createProgressBadge(progress);
        item.element.appendChild(badge);

        // Atualizar texto do link se necessário
        const navIcon = item.element.querySelector('.nav-icon');
        if (navIcon) {
            // Manter apenas o ícone e texto original
            const textNode = Array.from(item.element.childNodes)
                .find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) {
                textNode.textContent = textNode.textContent.replace(/\(\d+%\)/, '').trim();
            }
        }
    }

    /**
     * Criar badge de progresso
     * @param {number} progress
     * @returns {HTMLElement}
     */
    createProgressBadge(progress) {
        const badge = document.createElement('span');
        badge.className = 'progress-badge';

        // Adicionar classe baseada no progresso
        const progressClass = this.getProgressClass(progress);
        badge.classList.add(progressClass);

        // Emoji + porcentagem
        const emoji = this.getProgressEmoji(progress);
        badge.textContent = `${emoji} ${progress}%`;

        return badge;
    }

    /**
     * Obter classe CSS baseada no progresso
     * @param {number} progress
     * @returns {string}
     */
    getProgressClass(progress) {
        if (progress === 0) return 'progress-none';
        if (progress < 34) return 'progress-low';
        if (progress < 67) return 'progress-medium';
        if (progress < 100) return 'progress-high';
        return 'progress-complete';
    }

    /**
     * Obter emoji baseado no progresso
     * @param {number} progress
     * @returns {string}
     */
    getProgressEmoji(progress) {
        if (progress === 0) return '⚪';
        if (progress < 34) return '🔴';
        if (progress < 67) return '🟡';
        if (progress < 100) return '🔵';
        return '✅';
    }

    /**
     * Atualizar todos os badges de progresso
     */
    updateAllProgressBadges() {
        if (!window.PMOScopeManager) return;

        const allProgress = window.PMOScopeManager.getAllProgress();

        Object.keys(allProgress).forEach(anexoId => {
            this.updateProgressBadge(anexoId, allProgress[anexoId]);
        });
    }

    /**
     * Mostrar todos os itens (resetar filtro)
     */
    showAll() {
        Object.keys(this.menuItems).forEach(anexoId => {
            this.updateMenuItem(anexoId, true);
        });
    }

    /**
     * Ocultar todos os itens não habilitados
     */
    hideDisabled() {
        if (!window.PMOScopeManager) return;

        const enabledAnexos = window.PMOScopeManager.getEnabledAnexos();

        Object.keys(this.menuItems).forEach(anexoId => {
            const isEnabled = enabledAnexos.includes(anexoId);
            this.updateMenuItem(anexoId, isEnabled);
        });
    }

    /**
     * Adicionar indicador de "Nenhum escopo selecionado"
     */
    showNoScopeMessage() {
        const sidebar = document.querySelector('.app-sidebar nav');
        if (!sidebar) return;

        // Verificar se já existe
        let message = sidebar.querySelector('.no-scope-message');
        if (!message) {
            message = document.createElement('div');
            message.className = 'no-scope-message alert alert-info';
            message.innerHTML = `
                <p><strong>ℹ️ Nenhum escopo selecionado</strong></p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">
                    Preencha o <a href="../pmo-principal/index.html">PMO Principal</a> e
                    selecione as atividades orgânicas para habilitar os anexos.
                </p>
            `;
            sidebar.appendChild(message);
        }
    }

    /**
     * Remover mensagem de "Nenhum escopo selecionado"
     */
    hideNoScopeMessage() {
        const message = document.querySelector('.no-scope-message');
        if (message) {
            message.remove();
        }
    }

    /**
     * Verificar se há escopo selecionado
     */
    checkScope() {
        if (!window.PMOScopeManager) return;

        const enabledAnexos = window.PMOScopeManager.getEnabledAnexos();

        if (enabledAnexos.length === 0) {
            this.showNoScopeMessage();
        } else {
            this.hideNoScopeMessage();
        }
    }
}

// Auto-inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar scope manager estar disponível
    const initMenu = () => {
        if (window.PMOScopeManager) {
            window.menuManager = new PMOMenuManager();
            window.menuManager.checkScope();
        } else {
            setTimeout(initMenu, 100);
        }
    };

    initMenu();
});

// Expor globalmente
window.PMOMenuManager = PMOMenuManager;

export default PMOMenuManager;
