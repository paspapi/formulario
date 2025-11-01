/**
 * PMO Formatters - Formatação de dados
 * Formata CPF, CNPJ, CEP, telefone, moeda, data, etc
 * @version 2.0
 */

const PMOFormatters = {
  /**
   * Formata CPF (###.###.###-##)
   */
  formatCPF(cpf) {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  /**
   * Formata CNPJ (##.###.###/####-##)
   */
  formatCNPJ(cnpj) {
    if (!cnpj) return '';
    cnpj = cnpj.replace(/\D/g, '');
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  },

  /**
   * Formata CEP (#####-###)
   */
  formatCEP(cep) {
    if (!cep) return '';
    cep = cep.replace(/\D/g, '');
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  },

  /**
   * Formata telefone ((##) ####-#### ou (##) #####-####)
   */
  formatPhone(phone) {
    if (!phone) return '';
    phone = phone.replace(/\D/g, '');

    if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return phone;
  },

  /**
   * Formata moeda (R$ #.###,##)
   */
  formatCurrency(value) {
    if (value === null || value === undefined || value === '') return 'R$ 0,00';

    // Converte para número se for string
    if (typeof value === 'string') {
      value = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }

    if (isNaN(value)) return 'R$ 0,00';

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  },

  /**
   * Formata data (DD/MM/YYYY)
   */
  formatDate(date) {
    if (!date) return '';

    // Se for string no formato YYYY-MM-DD
    if (typeof date === 'string' && date.includes('-')) {
      const parts = date.split('-');
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    // Se for objeto Date
    if (date instanceof Date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    return date;
  },

  /**
   * Formata data/hora (DD/MM/YYYY HH:MM)
   */
  formatDateTime(date) {
    if (!date) return '';

    if (typeof date === 'string') {
      date = new Date(date);
    }

    if (!(date instanceof Date) || isNaN(date)) {
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  },

  /**
   * Converte data BR para ISO (YYYY-MM-DD)
   */
  dateToISO(dateBR) {
    if (!dateBR) return '';

    // Se já estiver no formato ISO
    if (dateBR.includes('-')) {
      return dateBR;
    }

    // Se estiver no formato DD/MM/YYYY
    if (dateBR.includes('/')) {
      const parts = dateBR.split('/');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return dateBR;
  },

  /**
   * Formata número com separador de milhares
   */
  formatNumber(number, decimals = 0) {
    if (number === null || number === undefined || number === '') return '0';

    // Converte para número se for string
    if (typeof number === 'string') {
      number = parseFloat(number.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }

    if (isNaN(number)) return '0';

    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  /**
   * Remove formatação de CPF/CNPJ
   */
  unformatDocument(doc) {
    if (!doc) return '';
    return doc.replace(/[^\d]/g, '');
  },

  /**
   * Remove formatação de moeda
   */
  unformatCurrency(currency) {
    if (!currency) return 0;

    // Remove R$, pontos e substitui vírgula por ponto
    const cleaned = currency
      .replace(/R\$\s?/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    return parseFloat(cleaned) || 0;
  },

  /**
   * Formata porcentagem
   */
  formatPercentage(value, decimals = 0) {
    if (value === null || value === undefined || value === '') return '0%';

    // Converte para número se for string
    if (typeof value === 'string') {
      value = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }

    if (isNaN(value)) return '0%';

    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Formata área (hectares)
   */
  formatArea(value) {
    if (!value) return '0 ha';

    const number = this.formatNumber(value, 2);
    return `${number} ha`;
  },

  /**
   * Formata peso (kg, ton)
   */
  formatWeight(value, unit = 'kg') {
    if (!value) return `0 ${unit}`;

    const number = this.formatNumber(value, 2);
    return `${number} ${unit}`;
  },

  /**
   * Trunca texto
   */
  truncate(text, length = 50, suffix = '...') {
    if (!text) return '';
    if (text.length <= length) return text;

    return text.substring(0, length) + suffix;
  },

  /**
   * Capitaliza primeira letra
   */
  capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Capitaliza todas as palavras
   */
  capitalizeWords(text) {
    if (!text) return '';
    return text.replace(/\b\w/g, char => char.toUpperCase());
  },

  /**
   * Formata nome próprio (ignora preposições)
   */
  formatProperName(name) {
    if (!name) return '';

    const lowercase = ['da', 'de', 'do', 'das', 'dos', 'e'];

    return name
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        // Primeira palavra sempre maiúscula
        if (index === 0) {
          return this.capitalize(word);
        }
        // Preposições em minúscula
        if (lowercase.includes(word)) {
          return word;
        }
        return this.capitalize(word);
      })
      .join(' ');
  },

  /**
   * Remove acentos
   */
  removeAccents(text) {
    if (!text) return '';
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  /**
   * Slug (URL-friendly)
   */
  slugify(text) {
    if (!text) return '';

    return this.removeAccents(text)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Máscara genérica
   */
  applyMask(value, mask) {
    if (!value || !mask) return value;

    let maskedValue = '';
    let valueIndex = 0;

    value = value.toString().replace(/\D/g, '');

    for (let i = 0; i < mask.length; i++) {
      if (valueIndex >= value.length) break;

      if (mask[i] === '#') {
        maskedValue += value[valueIndex];
        valueIndex++;
      } else {
        maskedValue += mask[i];
      }
    }

    return maskedValue;
  },

  /**
   * Formata bytes (KB, MB, GB)
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  },

  /**
   * Formata tempo relativo (há X minutos/horas/dias)
   */
  formatTimeAgo(date) {
    if (!date) return '';

    if (typeof date === 'string') {
      date = new Date(date);
    }

    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'agora mesmo';
    if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 30) return `há ${days} dia${days > 1 ? 's' : ''}`;

    return this.formatDate(date);
  }
};

// Máscaras de input (aplicação em tempo real)
const PMOMasks = {
  /**
   * Aplica máscara de CPF em input
   */
  cpf(input) {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = value.substring(0, 11);
      e.target.value = PMOFormatters.formatCPF(value);
    });
  },

  /**
   * Aplica máscara de CNPJ em input
   */
  cnpj(input) {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = value.substring(0, 14);
      e.target.value = PMOFormatters.formatCNPJ(value);
    });
  },

  /**
   * Aplica máscara de CEP em input
   */
  cep(input) {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = value.substring(0, 8);
      e.target.value = PMOFormatters.formatCEP(value);
    });
  },

  /**
   * Aplica máscara de telefone em input
   */
  phone(input) {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = value.substring(0, 11);
      e.target.value = PMOFormatters.formatPhone(value);
    });
  },

  /**
   * Aplica máscara de moeda em input
   */
  currency(input) {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = (parseInt(value) / 100).toFixed(2);
      e.target.value = PMOFormatters.formatCurrency(value);
    });
  },

  /**
   * Inicializa máscaras automaticamente
   */
  init() {
    document.querySelectorAll('[data-mask="cpf"]').forEach(input => this.cpf(input));
    document.querySelectorAll('[data-mask="cnpj"]').forEach(input => this.cnpj(input));
    document.querySelectorAll('[data-mask="cep"]').forEach(input => this.cep(input));
    document.querySelectorAll('[data-mask="phone"]').forEach(input => this.phone(input));
    document.querySelectorAll('[data-mask="currency"]').forEach(input => this.currency(input));
  }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.PMOFormatters = PMOFormatters;
  window.PMOMasks = PMOMasks;
}

export { PMOFormatters, PMOMasks };
export default PMOFormatters;
