/**
 * PMO Framework - Core
 * Sistema de gerenciamento de Planos de Manejo Orgânico (PMO)
 * @version 2.0
 * @author ANC - Associação de Agricultura Natural de Campinas
 */

class PMOFramework {
  constructor(config = {}) {
    this.config = {
      autoSaveInterval: config.autoSaveInterval || 30000,
      validationMode: config.validationMode || 'strict',
      storageType: config.storageType || 'localStorage',
      basePath: config.basePath || '/',
      ...config
    };

    this.currentRoute = null;
    this.currentModule = null;
    this.modules = new Map();
    this.middleware = [];
    this.autoSaveTimer = null;

    this.init();
  }

  /**
   * Inicializa o framework
   */
  async init() {
    console.log('=€ Iniciando PMO Framework v2.0');

    // Configura event listeners
    this.setupEventListeners();

    // Inicializa router
    this.initRouter();

    // Inicia auto-save
    this.startAutoSave();

    // Carrega módulo inicial
    await this.loadInitialRoute();

    console.log(' PMO Framework inicializado');
  }

  /**
   * Configura event listeners globais
   */
  setupEventListeners() {
    // Navegação entre páginas
    window.addEventListener('popstate', (e) => {
      this.handleRouteChange(e.state);
    });

    // Previne perda de dados não salvos
    window.addEventListener('beforeunload', (e) => {
      if (this.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // Delegação de eventos para navegação SPA
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-navigate]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-navigate');
        this.navigate(route);
      }
    });

    // Validação em tempo real
    document.addEventListener('input', (e) => {
      if (e.target.hasAttribute('data-validate')) {
        this.validateField(e.target);
      }
    });

    // Auto-save trigger
    document.addEventListener('change', (e) => {
      if (e.target.closest('form[data-auto-save]')) {
        this.markAsChanged();
      }
    });
  }

  /**
   * Inicializa o router SPA
   */
  initRouter() {
    this.routes = {
      '/': { module: 'dashboard', title: 'Dashboard - PMO' },
      '/pmo-principal': { module: 'pmo-principal', title: 'PMO Principal' },
      '/anexo-vegetal': { module: 'anexo-vegetal', title: 'Anexo I - Produção Vegetal' },
      '/anexo-animal': { module: 'anexo-animal', title: 'Anexo III - Produção Animal' },
      '/anexo-cogumelos': { module: 'anexo-cogumelos', title: 'Anexo II - Cogumelos' },
      '/anexo-apicultura': { module: 'anexo-apicultura', title: 'Anexo IV - Apicultura' },
      '/relatorios': { module: 'relatorios', title: 'Relatórios e Exportação' }
    };
  }

  /**
   * Carrega rota inicial
   */
  async loadInitialRoute() {
    const path = window.location.pathname.replace(this.config.basePath, '') || '/';
    await this.navigate(path, { replace: true });
  }

  /**
   * Navega para uma rota
   */
  async navigate(path, options = {}) {
    // Verifica mudanças não salvas
    if (!options.force && this.hasUnsavedChanges()) {
      const confirmed = await this.confirmNavigation();
      if (!confirmed) return;
    }

    // Executa middleware
    for (const mw of this.middleware) {
      const result = await mw(path);
      if (result === false) return; // Middleware bloqueou navegação
    }

    const route = this.routes[path];
    if (!route) {
      console.error(`Rota não encontrada: ${path}`);
      this.showNotification('Página não encontrada', 'error');
      return;
    }

    // Atualiza histórico
    if (options.replace) {
      window.history.replaceState({ path }, '', this.config.basePath + path);
    } else {
      window.history.pushState({ path }, '', this.config.basePath + path);
    }

    // Atualiza título
    document.title = route.title;

    // Carrega módulo
    await this.loadModule(route.module, path);

    this.currentRoute = path;
  }

  /**
   * Carrega módulo da aplicação
   */
  async loadModule(moduleName, path) {
    try {
      // Mostra loading
      this.showLoading();

      // Descarrega módulo anterior
      if (this.currentModule?.unload) {
        await this.currentModule.unload();
      }

      // Verifica se módulo já está em cache
      if (this.modules.has(moduleName)) {
        this.currentModule = this.modules.get(moduleName);
      } else {
        // Carrega módulo dinamicamente
        const modulePath = `../anc/${moduleName}/${moduleName}.js`;
        const module = await import(modulePath);
        this.currentModule = new module.default(this);
        this.modules.set(moduleName, this.currentModule);
      }

      // Renderiza módulo
      await this.currentModule.render();

      // Esconde loading
      this.hideLoading();

      // Trigger evento
      this.emit('moduleLoaded', { moduleName, path });

    } catch (error) {
      console.error(`Erro ao carregar módulo ${moduleName}:`, error);
      this.showNotification(`Erro ao carregar página: ${error.message}`, 'error');
      this.hideLoading();
    }
  }

  /**
   * Gerencia mudança de rota
   */
  handleRouteChange(state) {
    if (state?.path) {
      this.navigate(state.path, { force: true, replace: true });
    }
  }

  /**
   * Adiciona middleware de navegação
   */
  use(fn) {
    this.middleware.push(fn);
  }

  /**
   * Sistema de eventos
   */
  events = new Map();

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }

  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => callback(data));
    }
  }

  /**
   * Auto-save
   */
  startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      if (this.hasUnsavedChanges()) {
        this.autoSave();
      }
    }, this.config.autoSaveInterval);
  }

  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  async autoSave() {
    try {
      if (this.currentModule?.save) {
        await this.currentModule.save({ autoSave: true });
        this.showNotification('Dados salvos automaticamente', 'success', 2000);
      }
    } catch (error) {
      console.error('Erro no auto-save:', error);
    }
  }

  markAsChanged() {
    this._hasChanges = true;
  }

  clearChanges() {
    this._hasChanges = false;
  }

  hasUnsavedChanges() {
    return this._hasChanges || false;
  }

  /**
   * Confirmação de navegação
   */
  async confirmNavigation() {
    return confirm('Você tem alterações não salvas. Deseja continuar?');
  }

  /**
   * Validação de campo
   */
  validateField(field) {
    const validateType = field.getAttribute('data-validate');
    const value = field.value;

    let isValid = true;
    let message = '';

    // Importa validators (será implementado)
    if (window.PMOValidators) {
      const result = window.PMOValidators.validate(validateType, value);
      isValid = result.valid;
      message = result.message;
    }

    // Atualiza UI
    if (isValid) {
      field.classList.remove('invalid');
      field.classList.add('valid');
    } else {
      field.classList.remove('valid');
      field.classList.add('invalid');
    }

    // Mostra mensagem de erro
    const errorEl = field.nextElementSibling;
    if (errorEl && errorEl.classList.contains('error-message')) {
      errorEl.textContent = message;
      errorEl.style.display = isValid ? 'none' : 'block';
    }

    return isValid;
  }

  /**
   * Notificações
   */
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  /**
   * Loading
   */
  showLoading() {
    let loader = document.getElementById('global-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'global-loader';
      loader.className = 'loader';
      loader.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(loader);
    }
    loader.classList.add('active');
  }

  hideLoading() {
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.classList.remove('active');
    }
  }

  /**
   * Utilitários
   */
  getModule(name) {
    return this.modules.get(name);
  }

  getCurrentModule() {
    return this.currentModule;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getConfig() {
    return this.config;
  }
}

// Classe base para módulos
class PMOModule {
  constructor(framework) {
    this.framework = framework;
    this.container = document.getElementById('app-content') || document.body;
  }

  async render() {
    throw new Error('Método render() deve ser implementado');
  }

  async save(options = {}) {
    console.log('Save não implementado neste módulo');
  }

  async load() {
    console.log('Load não implementado neste módulo');
  }

  async unload() {
    console.log('Unload não implementado neste módulo');
  }

  getFormData(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    return data;
  }

  setFormData(formElement, data) {
    for (const [key, value] of Object.entries(data)) {
      const field = formElement.elements[key];
      if (field) {
        field.value = value;
      }
    }
  }
}

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.PMOFramework = PMOFramework;
  window.PMOModule = PMOModule;
}

export { PMOFramework, PMOModule };