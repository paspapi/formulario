/**
 * PMO Validators - Validação de campos
 * Valida CPF, CNPJ, CEP, email e outros campos
 * @version 2.0
 */

class PMOValidators {
  /**
   * Valida um campo baseado no tipo
   */
  static validate(type, value) {
    const validators = {
      cpf: this.validateCPF,
      cnpj: this.validateCNPJ,
      cep: this.validateCEP,
      email: this.validateEmail,
      phone: this.validatePhone,
      required: this.validateRequired,
      number: this.validateNumber,
      date: this.validateDate,
      url: this.validateURL
    };

    const validator = validators[type];
    if (!validator) {
      return { valid: true, message: '' };
    }

    return validator.call(this, value);
  }

  /**
   * Valida CPF
   */
  static validateCPF(cpf) {
    if (!cpf) {
      return { valid: false, message: 'CPF é obrigatório' };
    }

    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
      return { valid: false, message: 'CPF deve ter 11 dígitos' };
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { valid: false, message: 'CPF inválido' };
    }

    // Valida primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;

    if (digito1 !== parseInt(cpf.charAt(9))) {
      return { valid: false, message: 'CPF inválido' };
    }

    // Valida segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;

    if (digito2 !== parseInt(cpf.charAt(10))) {
      return { valid: false, message: 'CPF inválido' };
    }

    return { valid: true, message: 'CPF válido' };
  }

  /**
   * Valida CNPJ
   */
  static validateCNPJ(cnpj) {
    if (!cnpj) {
      return { valid: false, message: 'CNPJ é obrigatório' };
    }

    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');

    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) {
      return { valid: false, message: 'CNPJ deve ter 14 dígitos' };
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) {
      return { valid: false, message: 'CNPJ inválido' };
    }

    // Valida primeiro dígito verificador
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
    if (resultado != digitos.charAt(0)) {
      return { valid: false, message: 'CNPJ inválido' };
    }

    // Valida segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) {
      return { valid: false, message: 'CNPJ inválido' };
    }

    return { valid: true, message: 'CNPJ válido' };
  }

  /**
   * Valida CEP
   */
  static validateCEP(cep) {
    if (!cep) {
      return { valid: false, message: 'CEP é obrigatório' };
    }

    // Remove caracteres não numéricos
    cep = cep.replace(/[^\d]/g, '');

    // Verifica se tem 8 dígitos
    if (cep.length !== 8) {
      return { valid: false, message: 'CEP deve ter 8 dígitos' };
    }

    // Verifica se não é sequência de zeros
    if (cep === '00000000') {
      return { valid: false, message: 'CEP inválido' };
    }

    return { valid: true, message: 'CEP válido' };
  }

  /**
   * Valida email
   */
  static validateEmail(email) {
    if (!email) {
      return { valid: false, message: 'Email é obrigatório' };
    }

    // Regex para validar email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      return { valid: false, message: 'Email inválido' };
    }

    return { valid: true, message: 'Email válido' };
  }

  /**
   * Valida telefone
   */
  static validatePhone(phone) {
    if (!phone) {
      return { valid: false, message: 'Telefone é obrigatório' };
    }

    // Remove caracteres não numéricos
    phone = phone.replace(/[^\d]/g, '');

    // Verifica se tem 10 ou 11 dígitos (com DDD)
    if (phone.length < 10 || phone.length > 11) {
      return { valid: false, message: 'Telefone deve ter 10 ou 11 dígitos' };
    }

    return { valid: true, message: 'Telefone válido' };
  }

  /**
   * Valida campo obrigatório
   */
  static validateRequired(value) {
    if (!value || value.trim() === '') {
      return { valid: false, message: 'Este campo é obrigatório' };
    }

    return { valid: true, message: '' };
  }

  /**
   * Valida número
   */
  static validateNumber(value) {
    if (!value) {
      return { valid: false, message: 'Número é obrigatório' };
    }

    if (isNaN(value)) {
      return { valid: false, message: 'Valor deve ser um número' };
    }

    return { valid: true, message: 'Número válido' };
  }

  /**
   * Valida data
   */
  static validateDate(value) {
    if (!value) {
      return { valid: false, message: 'Data é obrigatória' };
    }

    // Verifica formato YYYY-MM-DD ou DD/MM/YYYY
    const regex1 = /^\d{4}-\d{2}-\d{2}$/;
    const regex2 = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!regex1.test(value) && !regex2.test(value)) {
      return { valid: false, message: 'Data inválida. Use DD/MM/YYYY ou YYYY-MM-DD' };
    }

    // Tenta criar objeto Date
    let date;
    if (regex1.test(value)) {
      date = new Date(value);
    } else {
      const parts = value.split('/');
      date = new Date(parts[2], parts[1] - 1, parts[0]);
    }

    if (isNaN(date.getTime())) {
      return { valid: false, message: 'Data inválida' };
    }

    return { valid: true, message: 'Data válida' };
  }

  /**
   * Valida URL
   */
  static validateURL(value) {
    if (!value) {
      return { valid: false, message: 'URL é obrigatória' };
    }

    try {
      new URL(value);
      return { valid: true, message: 'URL válida' };
    } catch {
      return { valid: false, message: 'URL inválida' };
    }
  }

  /**
   * Valida formulário completo
   */
  static validateForm(formElement) {
    const results = {
      valid: true,
      errors: [],
      warnings: []
    };

    // Valida todos os campos com data-validate
    const fields = formElement.querySelectorAll('[data-validate]');

    fields.forEach(field => {
      const type = field.getAttribute('data-validate');
      const value = field.value;
      const name = field.name || field.id;
      const label = field.getAttribute('data-label') || name;

      const result = this.validate(type, value);

      if (!result.valid) {
        results.valid = false;
        results.errors.push({
          field: name,
          label: label,
          message: result.message
        });

        // Adiciona classe de erro
        field.classList.add('invalid');
        field.classList.remove('valid');
      } else {
        // Remove classe de erro
        field.classList.remove('invalid');
        field.classList.add('valid');
      }
    });

    // Valida campos obrigatórios
    const requiredFields = formElement.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (!field.value || field.value.trim() === '') {
        const name = field.name || field.id;
        const label = field.getAttribute('data-label') || name;

        results.valid = false;
        results.errors.push({
          field: name,
          label: label,
          message: 'Campo obrigatório não preenchido'
        });

        field.classList.add('invalid');
      }
    });

    return results;
  }

  /**
   * Limpa validação visual
   */
  static clearValidation(formElement) {
    const fields = formElement.querySelectorAll('.valid, .invalid');
    fields.forEach(field => {
      field.classList.remove('valid', 'invalid');
    });

    const errors = formElement.querySelectorAll('.error-message');
    errors.forEach(error => {
      error.style.display = 'none';
      error.textContent = '';
    });
  }

  /**
   * Adiciona validação em tempo real a um formulário
   */
  static attachLiveValidation(formElement) {
    const fields = formElement.querySelectorAll('[data-validate]');

    fields.forEach(field => {
      // Validação ao perder foco
      field.addEventListener('blur', () => {
        const type = field.getAttribute('data-validate');
        const result = this.validate(type, field.value);

        if (!result.valid) {
          field.classList.add('invalid');
          field.classList.remove('valid');

          // Mostra mensagem de erro
          let errorEl = field.nextElementSibling;
          if (!errorEl || !errorEl.classList.contains('error-message')) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            field.parentNode.insertBefore(errorEl, field.nextSibling);
          }
          errorEl.textContent = result.message;
          errorEl.style.display = 'block';
        } else {
          field.classList.remove('invalid');
          field.classList.add('valid');

          // Remove mensagem de erro
          const errorEl = field.nextElementSibling;
          if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.style.display = 'none';
          }
        }
      });

      // Remove erro ao digitar
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) {
          field.classList.remove('invalid');
          const errorEl = field.nextElementSibling;
          if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.style.display = 'none';
          }
        }
      });
    });
  }
}

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.PMOValidators = PMOValidators;
}

export default PMOValidators;