/**
 * PMO Notifications
 * Sistema unificado de notificações flutuantes
 * @version 1.0.0
 */

class PMONotificationManager {
    constructor(options = {}) {
        this.options = {
            maxVisible: 4,
            defaultTimeout: 5000,
            position: 'top-right',
            ...options
        };

        this.notifications = new Map();
        this.queue = [];
        this.container = null;
        this.initialized = false;
        this.counter = 0;

        this.typeStyles = {
            success: { className: 'alert-success', borderColor: 'var(--success, #16a34a)' },
            error: { className: 'alert-error', borderColor: 'var(--error, #dc2626)' },
            warning: { className: 'alert-warning', borderColor: 'var(--warning, #f97316)' },
            info: { className: 'alert-info', borderColor: 'var(--primary, #2563eb)' }
        };

        this._injectStyles();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._init());
        } else {
            this._init();
        }
    }

    /**
     * Exibe uma notificação.
     * @param {string} message Mensagem principal
     * @param {'success'|'error'|'warning'|'info'} [type]
     * @param {Object} [options]
     * @param {string} [options.title] Título opcional
     * @param {number|false} [options.timeout] Tempo de exibição em ms (default 5000). Use false para não fechar automaticamente.
     * @param {boolean} [options.dismissible] Se true, sempre mostra botão de fechar
     * @param {{label: string, onClick: Function}} [options.action] Botão de ação
     * @returns {string} ID da notificação
     */
    show(message, type = 'info', options = {}) {
        const id = this._generateId();
        const payload = { id, message, type, options };

        if (!this.initialized) {
            this.queue.push(payload);
            return id;
        }

        return this._renderNotification(payload);
    }

    info(message, options) {
        return this.show(message, 'info', options);
    }

    success(message, options) {
        return this.show(message, 'success', options);
    }

    warning(message, options) {
        return this.show(message, 'warning', options);
    }

    error(message, options) {
        return this.show(message, 'error', options);
    }

    /**
     * Remove uma notificação específica.
     * @param {string} id
     */
    dismiss(id) {
        const entry = this.notifications.get(id);
        if (!entry) return;

        const { element, timerId } = entry;

        if (timerId) {
            clearTimeout(timerId);
        }

        // Animação de saída + remoção
        element.classList.add('is-leaving');

        const remove = () => {
            element.remove();
            this.notifications.delete(id);
            this._flushQueue();
        };

        element.addEventListener('animationend', remove, { once: true });
        element.addEventListener('transitionend', remove, { once: true });

        // fallback caso não tenha animação
        setTimeout(remove, 200);
    }

    /**
     * Remove todas as notificações.
     */
    clear() {
        this.notifications.forEach((_, id) => this.dismiss(id));
        this.queue = [];
    }

    /**
     * Vincula promessa às notificações (opcional).
     * @param {Promise} promise
     * @param {{pending?: string, success?: string, error?: string}} labels
     */
    async trackPromise(promise, labels = {}) {
        const pendingId = labels.pending ? this.info(labels.pending, { timeout: false, dismissible: true }) : null;

        try {
            const result = await promise;
            if (pendingId) this.dismiss(pendingId);
            if (labels.success) this.success(labels.success);
            return result;
        } catch (error) {
            if (pendingId) this.dismiss(pendingId);
            if (labels.error) this.error(labels.error);
            throw error;
        }
    }

    // ========= Métodos privados =========

    _init() {
        if (this.initialized) return;

        this.container = document.createElement('div');
        this.container.className = `pmo-notification-container position-${this.options.position}`;
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-live', 'polite');

        document.body.appendChild(this.container);

        this.initialized = true;
        this._flushQueue();
    }

    _flushQueue() {
        if (!this.initialized || this.queue.length === 0) return;

        const pending = [...this.queue];
        this.queue = [];

        pending.forEach(payload => this._renderNotification(payload));
    }

    _renderNotification({ id, message, type, options }) {
        const normalizedType = this.typeStyles[type] ? type : 'info';
        const { title, timeout, dismissible = false, action } = options;

        this._enforceMaxVisible();

        const notification = document.createElement('div');
        notification.className = `pmo-notification alert ${this.typeStyles[normalizedType].className}`;
        notification.dataset.notificationId = id;
        notification.setAttribute('role', normalizedType === 'error' ? 'alert' : 'status');
        notification.style.borderLeft = `4px solid ${this.typeStyles[normalizedType].borderColor}`;

        const content = document.createElement('div');
        content.className = 'pmo-notification-content';

        if (title) {
            const heading = document.createElement('div');
            heading.className = 'pmo-notification-title';
            heading.textContent = title;
            content.appendChild(heading);
        }

        const messageEl = document.createElement('div');
        messageEl.className = 'pmo-notification-message';
        messageEl.textContent = message;
        content.appendChild(messageEl);

        notification.appendChild(content);

        const actionsWrapper = document.createElement('div');
        actionsWrapper.className = 'pmo-notification-actions';

        if (action && action.label) {
            const actionButton = document.createElement('button');
            actionButton.type = 'button';
            actionButton.className = 'btn btn-secondary btn-sm';
            actionButton.textContent = action.label;
            actionButton.addEventListener('click', () => {
                if (typeof action.onClick === 'function') {
                    action.onClick();
                }
                this.dismiss(id);
            });
            actionsWrapper.appendChild(actionButton);
        }

        const userWantsClose = dismissible || timeout === false || timeout === 0;
        if (userWantsClose) {
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'pmo-notification-close';
            closeBtn.setAttribute('aria-label', 'Fechar notificação');
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => this.dismiss(id));
            actionsWrapper.appendChild(closeBtn);
        }

        if (actionsWrapper.childElementCount > 0) {
            notification.appendChild(actionsWrapper);
        }

        this.container.appendChild(notification);

        const notificationEntry = {
            element: notification,
            timerId: null,
            remaining: typeof timeout === 'number' ? timeout : this.options.defaultTimeout,
            startTime: null
        };

        this.notifications.set(id, notificationEntry);

        this._setupAutoDismiss(id, notificationEntry, timeout);

        return id;
    }

    _generateId() {
        return `pmo-notification-${Date.now()}-${++this.counter}`;
    }

    _setupAutoDismiss(id, entry, timeoutOption) {
        const timeoutValue = timeoutOption === false || timeoutOption === 0 ? false : (typeof timeoutOption === 'number' ? timeoutOption : this.options.defaultTimeout);
        const { element } = entry;

        if (!timeoutValue || timeoutValue <= 0) {
            return;
        }

        const startTimer = () => {
            entry.startTime = Date.now();
            entry.timerId = setTimeout(() => this.dismiss(id), entry.remaining);
        };

        const pauseTimer = () => {
            if (!entry.timerId) return;
            clearTimeout(entry.timerId);
            entry.timerId = null;
            entry.remaining -= Date.now() - entry.startTime;
        };

        element.addEventListener('mouseenter', pauseTimer);
        element.addEventListener('mouseleave', () => {
            if (entry.remaining <= 0) {
                this.dismiss(id);
                return;
            }
            startTimer();
        });

        entry.remaining = timeoutValue;
        startTimer();
    }

    _enforceMaxVisible() {
        if (!this.container) return;

        while (this.container.children.length >= this.options.maxVisible) {
            const oldest = this.container.firstElementChild;
            if (!oldest) break;
            const id = oldest.dataset.notificationId;
            if (id) {
                this.dismiss(id);
            } else {
                oldest.remove();
            }
        }
    }

    _injectStyles() {
        if (document.getElementById('pmo-notifications-style')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'pmo-notifications-style';
        style.textContent = `
            .pmo-notification-container {
                position: fixed;
                z-index: 11000;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                max-width: min(360px, 100vw - 2rem);
                pointer-events: none;
            }

            .pmo-notification-container.position-top-right {
                top: 1.5rem;
                right: 1.5rem;
            }

            .pmo-notification-container.position-top-left {
                top: 1.5rem;
                left: 1.5rem;
            }

            .pmo-notification-container.position-bottom-right {
                bottom: 1.5rem;
                right: 1.5rem;
            }

            .pmo-notification-container.position-bottom-left {
                bottom: 1.5rem;
                left: 1.5rem;
            }

            .pmo-notification {
                pointer-events: auto;
                box-shadow: var(--shadow-md, 0 10px 25px rgba(15, 23, 42, 0.15));
                border-radius: var(--radius-md, 12px);
                background: var(--gray-0, #ffffff);
                padding: 1rem 1.25rem;
                overflow: hidden;
                animation: pmo-notification-enter 0.25s ease forwards;
                position: relative;
            }

            .pmo-notification.is-leaving {
                animation: pmo-notification-leave 0.2s ease forwards;
            }

            .pmo-notification .alert {
                box-shadow: none;
                border-radius: 0;
            }

            .pmo-notification.alert {
                border: none;
            }

            .pmo-notification-content {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .pmo-notification-title {
                font-weight: 600;
                font-size: var(--text-sm, 0.875rem);
                color: var(--gray-800, #1f2937);
            }

            .pmo-notification-message {
                font-size: var(--text-sm, 0.875rem);
                color: var(--gray-700, #374151);
                line-height: 1.5;
            }

            .pmo-notification-actions {
                margin-top: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 0.5rem;
            }

            .pmo-notification-close {
                border: none;
                background: transparent;
                color: inherit;
                font-size: 1.15rem;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 1.5rem;
                height: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .pmo-notification-close:hover {
                opacity: 0.75;
            }

            @keyframes pmo-notification-enter {
                from {
                    opacity: 0;
                    transform: translate3d(20px, 0, 0);
                }
                to {
                    opacity: 1;
                    transform: translate3d(0, 0, 0);
                }
            }

            @keyframes pmo-notification-leave {
                from {
                    opacity: 1;
                    transform: translate3d(0, 0, 0);
                }
                to {
                    opacity: 0;
                    transform: translate3d(20px, 0, 0);
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .pmo-notification {
                    animation: none !important;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

const pmoNotifications = new PMONotificationManager();

if (typeof window !== 'undefined') {
    window.PMONotifications = pmoNotifications;
}

export default pmoNotifications;
