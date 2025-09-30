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

    console.log('✅ PMO Framework inicializado');
  }

  /**
   * Registrar módulo
   */
  registerModule(name, moduleInstance) {
    this.modules.set(name, moduleInstance);
    console.log(`Módulo registrado: ${name}`);
  }

  /**
   * Obter módulo
   */
  getModule(name) {
    return this.modules.get(name);
  }

  /**
   * Navegar para rota
   */
  navigate(path) {
    this.currentRoute = path;
    window.location.href = path;
  }

  /**
   * Salvar no storage
   */
  save(key, data) {
    try {
      if (this.config.storageType === 'localStorage') {
        localStorage.setItem(key, JSON.stringify(data));
      } else if (this.config.storageType === 'sessionStorage') {
        sessionStorage.setItem(key, JSON.stringify(data));
      }
      return true;
    } catch (error) {
      console.error('Erro ao salvar:', error);
      return false;
    }
  }

  /**
   * Carregar do storage
   */
  load(key) {
    try {
      const data = this.config.storageType === 'localStorage' ?
        localStorage.getItem(key) :
        sessionStorage.getItem(key);

      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao carregar:', error);
      return null;
    }
  }

  /**
   * Limpar storage
   */
  clear(key) {
    if (key) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } else {
      localStorage.clear();
      sessionStorage.clear();
    }
  }

  /**
   * Validar formulário
   */
  validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return { valid: false, errors: ['Formulário não encontrado'] };

    const errors = [];
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        const label = field.closest('.form-group')?.querySelector('label')?.textContent || field.name;
        errors.push(`Campo obrigatório: ${label}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Mostrar notificação
   */
  notify(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  /**
   * Formatar data para pt-BR
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  /**
   * Formatar moeda BRL
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Instância global do framework
window.PMOFramework = new PMOFramework();

// Helper functions globais
window.PMOHelpers = {
  /**
   * Validar CPF
   */
  validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 > 9) digito1 = 0;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 > 9) digito2 = 0;

    return parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2;
  },

  /**
   * Validar CNPJ
   */
  validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado == digitos.charAt(1);
  },

  /**
   * Validar e-mail
   */
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Aplicar máscara CPF
   */
  maskCPF(value) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return value.substring(0, 14);
  },

  /**
   * Aplicar máscara CNPJ
   */
  maskCNPJ(value) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    return value.substring(0, 18);
  },

  /**
   * Aplicar máscara CEP
   */
  maskCEP(value) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    return value.substring(0, 9);
  },

  /**
   * Aplicar máscara Telefone
   */
  maskTelefone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value.substring(0, 15);
  }
};

console.log('✅ PMO Framework carregado com sucesso');