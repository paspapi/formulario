/**
 * Gerenciador de Escopo PMO
 * Gerencia atividades selecionadas e progresso de preenchimento
 * @version 1.0.0
 */

class PMOScopeManager {
    constructor() {
        this.STORAGE_KEY = 'pmo_scope_activities';
        this.PROGRESS_KEY_PREFIX = 'pmo_progress_';

        // Mapeamento de atividades para anexos (NOVOS NOMES)
        this.activityMap = {
            'escopo_hortalicas': 'anexo-vegetal',
            'escopo_frutas': 'anexo-vegetal',
            'escopo_medicinais': 'anexo-vegetal',
            'escopo_cogumelos': 'anexo-cogumelo',
            'escopo_pecuaria': 'anexo-animal',
            'escopo_apicultura': 'anexo-apicultura',
            'escopo_proc_minimo': 'anexo-processamentominimo',
            'escopo_processamento': 'anexo-processamento'
        };

        // Mapeamento de anexos para rotas
        this.anexoRoutes = {
            'anexo-vegetal': '../anexo-vegetal/index.html',
            'anexo-animal': '../anexo-animal/index.html',
            'anexo-cogumelo': '../anexo-cogumelo/index.html',
            'anexo-apicultura': '../anexo-apicultura/index.html',
            'anexo-processamento': '../anexo-processamento/index.html',
            'anexo-processamentominimo': '../anexo-processamentominimo/index.html'
        };

        // Labels amigáveis
        this.anexoLabels = {
            'anexo-vegetal': '🌱 Produção Vegetal',
            'anexo-animal': '🐄 Produção Animal',
            'anexo-cogumelo': '🍄 Cogumelos',
            'anexo-apicultura': '🐝 Apicultura',
            'anexo-processamento': '🏭 Processamento',
            'anexo-processamentominimo': '🥗 Proc. Mínimo'
        };

        this.init();
    }

    /**
     * Inicializar gerenciador
     */
    init() {
        // Verificar se há dados salvos, senão criar estrutura
        if (!this.getActivities()) {
            this.saveActivities({});
        }

        // Listener para mudanças entre abas/janelas
        window.addEventListener('storage', (e) => {
            if (e.key === this.STORAGE_KEY) {
                this.onScopeChanged();
            }
        });

        console.log('✅ PMOScopeManager inicializado');
    }

    /**
     * Salvar atividades selecionadas
     * @param {Object} activities - { 'escopo_hortalicas': true, ... }
     * @param {boolean} pretendeCertificar - Se pretende certificar
     */
    saveActivities(activities, pretendeCertificar = true) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                pretende_certificar: pretendeCertificar,
                activities: activities,
                lastUpdated: new Date().toISOString()
            }));
            this.onScopeChanged();
            return true;
        } catch (error) {
            console.error('Erro ao salvar atividades:', error);
            return false;
        }
    }

    /**
     * Obter atividades salvas
     * @returns {Object}
     */
    getActivities() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return null;

            const parsed = JSON.parse(data);
            return parsed.activities || {};
        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            return {};
        }
    }

    /**
     * Verificar se pretende certificar
     * @returns {boolean}
     */
    pretendeCertificar() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return false;

            const parsed = JSON.parse(data);
            return parsed.pretende_certificar === true || parsed.pretende_certificar === 'sim';
        } catch (error) {
            console.error('Erro ao verificar intenção de certificar:', error);
            return false;
        }
    }

    /**
     * Verificar se uma atividade está ativa
     * @param {string} activityName
     * @returns {boolean}
     */
    isActivityActive(activityName) {
        const activities = this.getActivities();
        return activities[activityName] === true || activities[activityName] === 'sim';
    }

    /**
     * Obter anexos habilitados baseado nas atividades
     * @returns {Array} - ['anexo-vegetal', 'anexo-animal', ...]
     */
    getEnabledAnexos() {
        const activities = this.getActivities();
        const enabledAnexos = new Set();

        // Verificar cada atividade
        Object.keys(this.activityMap).forEach(activityKey => {
            if (this.isActivityActive(activityKey)) {
                const anexo = this.activityMap[activityKey];
                enabledAnexos.add(anexo);
            }
        });

        const enabledArray = Array.from(enabledAnexos);

        // Se há atividades habilitadas, considerar como "pretende certificar"
        // independentemente do flag pretende_certificar
        if (enabledArray.length > 0) {
            return enabledArray;
        }

        // Só verificar pretende_certificar se não houver atividades
        if (!this.pretendeCertificar()) {
            return [];
        }

        return enabledArray;
    }

    /**
     * Verificar se um anexo está habilitado
     * @param {string} anexoId
     * @returns {boolean}
     */
    isAnexoEnabled(anexoId) {
        const enabled = this.getEnabledAnexos();
        return enabled.includes(anexoId);
    }

    /**
     * Salvar progresso de um anexo
     * @param {string} anexoId - ID do anexo
     * @param {number} percentage - Porcentagem (0-100)
     */
    saveProgress(anexoId, percentage) {
        try {
            const key = this.PROGRESS_KEY_PREFIX + anexoId;
            localStorage.setItem(key, JSON.stringify({
                percentage: Math.round(percentage),
                lastUpdated: new Date().toISOString()
            }));
            this.onProgressChanged(anexoId);
            return true;
        } catch (error) {
            console.error('Erro ao salvar progresso:', error);
            return false;
        }
    }

    /**
     * Obter progresso de um anexo
     * @param {string} anexoId
     * @returns {number} - Porcentagem (0-100)
     */
    getProgress(anexoId) {
        try {
            const key = this.PROGRESS_KEY_PREFIX + anexoId;
            const data = localStorage.getItem(key);
            if (!data) return 0;

            const parsed = JSON.parse(data);
            return parsed.percentage || 0;
        } catch (error) {
            console.error('Erro ao carregar progresso:', error);
            return 0;
        }
    }

    /**
     * Obter progresso de todos os anexos habilitados
     * @returns {Object} - { 'anexo-vegetal': 75, ... }
     */
    getAllProgress() {
        const progress = {};
        const enabled = this.getEnabledAnexos();

        enabled.forEach(anexoId => {
            progress[anexoId] = this.getProgress(anexoId);
        });

        return progress;
    }

    /**
     * Calcular progresso geral (média dos anexos habilitados)
     * @returns {number}
     */
    getOverallProgress() {
        const enabled = this.getEnabledAnexos();
        if (enabled.length === 0) return 0;

        const total = enabled.reduce((sum, anexoId) => {
            return sum + this.getProgress(anexoId);
        }, 0);

        return Math.round(total / enabled.length);
    }

    /**
     * Obter classe CSS baseada no progresso
     * @param {number} percentage
     * @returns {string}
     */
    getProgressClass(percentage) {
        if (percentage === 0) return 'progress-none';
        if (percentage < 34) return 'progress-low';
        if (percentage < 67) return 'progress-medium';
        if (percentage < 100) return 'progress-high';
        return 'progress-complete';
    }

    /**
     * Obter emoji baseado no progresso
     * @param {number} percentage
     * @returns {string}
     */
    getProgressEmoji(percentage) {
        if (percentage === 0) return '⚪';
        if (percentage < 34) return '🔴';
        if (percentage < 67) return '🟡';
        if (percentage < 100) return '🔵';
        return '✅';
    }

    /**
     * Sincronizar atividades do formulário PMO Principal
     */
    syncFromPMOPrincipal() {
        const form = document.getElementById('form-pmo-principal');
        if (!form) return;

        // Verificar se pretende certificar
        const pretendeCertificarCheckbox = form.querySelector('input[name="pretende_certificar"]');
        const pretendeCertificar = pretendeCertificarCheckbox ? pretendeCertificarCheckbox.checked : false;

        const activities = {};

        // Ler todos os checkboxes de atividades (novo formato: escopo_*)
        Object.keys(this.activityMap).forEach(activityKey => {
            const checkbox = form.querySelector(`input[name="${activityKey}"]`);
            if (checkbox) {
                activities[activityKey] = checkbox.checked;
            }
        });

        this.saveActivities(activities, pretendeCertificar);
    }

    /**
     * Aplicar filtros visuais no dashboard
     * @param {string} containerSelector - Seletor do container (ex: '.nav-menu' ou '.dashboard-cards')
     */
    applyDashboardFilters(containerSelector = '.nav-menu') {
        console.log('🔍 applyDashboardFilters chamado');
        console.log('   - Pretende certificar:', this.pretendeCertificar());
        console.log('   - Atividades:', this.getActivities());
        console.log('   - Anexos habilitados:', this.getEnabledAnexos());

        const containers = document.querySelectorAll(containerSelector);
        if (!containers || containers.length === 0) {
            console.warn('⚠️ Nenhum container encontrado com seletor:', containerSelector);
            return;
        }

        containers.forEach(container => {
            const items = container.querySelectorAll('[data-form-type]');
            console.log(`   - Encontrados ${items.length} itens com data-form-type`);

            items.forEach(item => {
                const formType = item.getAttribute('data-form-type');

                if (formType === 'pmo-principal') {
                    // PMO Principal sempre disponível
                    item.classList.remove('form-disabled');
                    return;
                }

                const isAvailable = this.isAnexoEnabled(formType);
                console.log(`   - ${formType}: ${isAvailable ? '✅ Disponível' : '🔒 Bloqueado'}`);

                if (isAvailable) {
                    item.classList.remove('form-disabled');
                    item.classList.add('form-available');
                } else {
                    item.classList.add('form-disabled');
                    item.classList.remove('form-available');
                }

                // Atualizar badge se existir
                const badgeContainer = item.querySelector('.form-badge');
                if (badgeContainer) {
                    badgeContainer.innerHTML = this.getFormBadgeHTML(formType);
                }
            });
        });
    }

    /**
     * Obter badge HTML para status de formulário
     * @param {string} formType - Nome do formulário/anexo
     * @returns {string} HTML do badge
     */
    getFormBadgeHTML(formType) {
        if (!this.pretendeCertificar()) {
            return '<span class="badge badge-info" style="font-size: 0.625rem;">Configurar</span>';
        }

        if (this.isAnexoEnabled(formType)) {
            return '<span class="badge badge-success" style="font-size: 0.625rem;">Disponível</span>';
        } else {
            return '<span class="badge badge-secondary" style="font-size: 0.625rem;">Bloqueado</span>';
        }
    }

    /**
     * Callback quando escopo muda
     */
    onScopeChanged() {
        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('pmo-scope-changed', {
            detail: {
                activities: this.getActivities(),
                enabledAnexos: this.getEnabledAnexos()
            }
        }));
    }

    /**
     * Callback quando progresso muda
     */
    onProgressChanged(anexoId) {
        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('pmo-progress-changed', {
            detail: {
                anexoId: anexoId,
                progress: this.getProgress(anexoId)
            }
        }));
    }

    /**
     * Limpar todos os dados
     */
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);

        // Limpar todos os progressos
        Object.keys(this.anexoRoutes).forEach(anexoId => {
            localStorage.removeItem(this.PROGRESS_KEY_PREFIX + anexoId);
        });

        this.onScopeChanged();
    }

    /**
     * Exportar dados para debug
     */
    debug() {
        return {
            activities: this.getActivities(),
            enabledAnexos: this.getEnabledAnexos(),
            progress: this.getAllProgress(),
            overallProgress: this.getOverallProgress()
        };
    }
}

// Exportar como singleton
const scopeManager = new PMOScopeManager();
window.PMOScopeManager = scopeManager;

export default scopeManager;
