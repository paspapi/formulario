/**
 * Auto-Save Navigation Helper
 * Utilitário para salvar automaticamente ao navegar entre páginas PMO
 * @version 1.0
 * @author ANC
 */

const AutoSaveNavigation = {
    /**
     * Configurar salvamento automático ao navegar
     * @param {Object} module - Módulo que contém o estado e método salvar
     * @param {string} navigationSelector - Seletor CSS para links de navegação
     */
    setup(module, navigationSelector = '.pmo-navigation a, a[href*="/pmo/"]') {
        if (!module || !module.state || typeof module.salvar !== 'function') {
            console.error('AutoSaveNavigation: módulo inválido');
            return;
        }

        const navLinks = document.querySelectorAll(navigationSelector);

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Se houver alterações não salvas, salvar automaticamente
                if (module.state.isModified) {
                    e.preventDefault();

                    // Salvar automaticamente
                    module.salvar(true);

                    // Mostrar feedback rápido
                    this.showQuickMessage('💾 Salvando alterações...');

                    // Aguardar um momento e então navegar
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 300);
                }
            });
        });

        console.log('✅ Auto-save navigation configurado');
    },

    /**
     * Mostrar mensagem rápida
     */
    showQuickMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'auto-save-quick-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 14px;
            animation: fadeIn 0.2s ease-in;
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }
};

// Expor globalmente
window.AutoSaveNavigation = AutoSaveNavigation;
