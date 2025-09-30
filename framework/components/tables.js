/**
 * PMO Framework - Tabelas Dinâmicas
 * @module Tables
 * @description Sistema completo de tabelas dinâmicas com funcionalidade de clipboard
 * @version 2.0
 */

class PMOTable {
  constructor(containerId, config = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container #${containerId} não encontrado`);
    }

    this.config = {
      minRows: config.minRows || 1,
      maxRows: config.maxRows || 999,
      columns: config.columns || [],
      allowAdd: config.allowAdd !== false,
      allowRemove: config.allowRemove !== false,
      allowPaste: config.allowPaste !== false,
      allowExport: config.allowExport !== false,
      autoSave: config.autoSave !== false,
      storageKey: config.storageKey || `pmo_table_${containerId}`,
      validators: config.validators || {},
      onRowAdd: config.onRowAdd || null,
      onRowRemove: config.onRowRemove || null,
      onPaste: config.onPaste || null,
      onValidate: config.onValidate || null,
      zebra: config.zebra !== false, // Zebra striping
      ...config
    };

    this.rows = [];
    this.rowCount = 0;
    this.init();
  }

  /**
   * Inicializa a tabela
   */
  init() {
    this.createStructure();
    this.loadSavedData();
    this.setupEventListeners();
    this.updateButtons();

    console.log(` PMOTable inicializada: ${this.container.id}`);
  }

  /**
   * Cria a estrutura HTML da tabela
   */
  createStructure() {
    const tableHTML = `
      <div class="pmo-table-wrapper">
        <div class="pmo-table-toolbar">
          ${this.config.allowAdd ? `
            <button type="button" class="btn btn-add btn-add-row" title="Adicionar linha">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Adicionar linha
            </button>
          ` : ''}
          ${this.config.allowPaste ? `
            <button type="button" class="btn btn-secondary btn-paste-clipboard" title="Colar de planilha (Ctrl+V)">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
              </svg>
              Colar planilha
            </button>
          ` : ''}
          ${this.config.allowExport ? `
            <button type="button" class="btn btn-secondary btn-export-csv" title="Exportar para CSV">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Exportar CSV
            </button>
          ` : ''}
          <div class="pmo-table-info">
            <span class="row-counter">Linhas: <strong>0</strong></span>
          </div>
        </div>
        <div class="pmo-table-scroll">
          <table class="dynamic-table ${this.config.zebra ? 'zebra' : ''}">
            <thead>
              <tr>
                ${this.config.columns.map(col => `
                  <th data-field="${col.field}" ${col.width ? `style="width: ${col.width}"` : ''}>
                    ${col.label}
                    ${col.required ? '<span class="required">*</span>' : ''}
                    ${col.help ? `<span class="help-tooltip" title="${col.help}">?</span>` : ''}
                  </th>
                `).join('')}
                ${this.config.allowRemove ? '<th class="action-column">Ações</th>' : ''}
              </tr>
            </thead>
            <tbody class="table-body">
              <!-- Linhas serão inseridas aqui -->
            </tbody>
          </table>
        </div>
        ${this.config.allowPaste ? `
          <div class="paste-hint">
            =¡ <strong>Dica:</strong> Você pode copiar dados do Excel ou Google Sheets e colar aqui (Ctrl+V ou clique no botão "Colar planilha")
          </div>
        ` : ''}
      </div>
    `;

    this.container.innerHTML = tableHTML;
    this.tbody = this.container.querySelector('.table-body');
    this.rowCounter = this.container.querySelector('.row-counter strong');
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Adicionar linha
    const btnAdd = this.container.querySelector('.btn-add-row');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => this.addRow());
    }

    // Colar do clipboard
    const btnPaste = this.container.querySelector('.btn-paste-clipboard');
    if (btnPaste) {
      btnPaste.addEventListener('click', () => this.showPasteDialog());
    }

    // Exportar CSV
    const btnExport = this.container.querySelector('.btn-export-csv');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportToCSV());
    }

    // Remover linha (delegação de eventos)
    this.tbody.addEventListener('click', (e) => {
      const btnRemove = e.target.closest('.btn-remove-row');
      if (btnRemove) {
        const row = btnRemove.closest('tr');
        this.removeRow(row);
      }
    });

    // Validação em tempo real
    this.tbody.addEventListener('input', (e) => {
      if (e.target.matches('input, select, textarea')) {
        this.validateField(e.target);
        if (this.config.autoSave) {
          this.saveData();
        }
      }
    });

    // Detectar Ctrl+V em qualquer campo da tabela
    if (this.config.allowPaste) {
      this.tbody.addEventListener('paste', (e) => {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData('text');
        if (pastedData) {
          this.pasteFromClipboard(pastedData);
        }
      });
    }

    // Keyboard shortcuts
    this.container.addEventListener('keydown', (e) => {
      // Ctrl+V = Colar
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && this.config.allowPaste) {
        // Já tratado pelo evento paste
      }
    });
  }

  /**
   * Adiciona uma nova linha vazia
   */
  addRow(data = {}, skipValidation = false) {
    if (this.rowCount >= this.config.maxRows) {
      this.showMessage(`Máximo de ${this.config.maxRows} linhas permitido`, 'warning');
      return null;
    }

    const rowIndex = this.rowCount;
    const tr = document.createElement('tr');
    tr.dataset.rowIndex = rowIndex;
    tr.classList.add('dynamic-row');

    // Criar células
    this.config.columns.forEach(col => {
      const td = document.createElement('td');
      td.innerHTML = this.createFieldHTML(col, rowIndex, data[col.field] || '');
      tr.appendChild(td);
    });

    // Coluna de ações
    if (this.config.allowRemove) {
      const tdAction = document.createElement('td');
      tdAction.classList.add('action-column');
      tdAction.innerHTML = `
        <button type="button" class="btn btn-remove btn-remove-row" title="Remover linha">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </button>
      `;
      tr.appendChild(tdAction);
    }

    this.tbody.appendChild(tr);
    this.rows.push(tr);
    this.rowCount++;
    this.updateCounter();
    this.updateButtons();

    // Validar campos se necessário
    if (!skipValidation) {
      tr.querySelectorAll('input, select, textarea').forEach(field => {
        this.validateField(field);
      });
    }

    // Callback
    if (this.config.onRowAdd) {
      this.config.onRowAdd(tr, rowIndex, data);
    }

    if (this.config.autoSave) {
      this.saveData();
    }

    return tr;
  }

  /**
   * Cria HTML para um campo baseado na configuração da coluna
   */
  createFieldHTML(col, rowIndex, value = '') {
    const fieldName = `${col.field}[${rowIndex}]`;
    const fieldId = `${col.field}_${rowIndex}`;
    const required = col.required ? 'required' : '';
    const disabled = col.disabled ? 'disabled' : '';
    const dataValidate = col.validate ? `data-validate="${col.validate}"` : '';
    const dataField = `data-field="${col.field}"`;

    let html = '';

    switch (col.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'tel':
      case 'url':
      case 'date':
      case 'time':
      case 'datetime-local':
      case 'month':
        html = `
          <input
            type="${col.type}"
            id="${fieldId}"
            name="${fieldName}"
            value="${this.escapeHtml(value)}"
            ${required}
            ${disabled}
            ${dataValidate}
            ${dataField}
            ${col.placeholder ? `placeholder="${col.placeholder}"` : ''}
            ${col.min !== undefined ? `min="${col.min}"` : ''}
            ${col.max !== undefined ? `max="${col.max}"` : ''}
            ${col.step !== undefined ? `step="${col.step}"` : ''}
            ${col.pattern ? `pattern="${col.pattern}"` : ''}
            ${col.mask ? `data-mask="${col.mask}"` : ''}
            class="form-control"
          />
        `;
        break;

      case 'select':
        html = `
          <select
            id="${fieldId}"
            name="${fieldName}"
            ${required}
            ${disabled}
            ${dataValidate}
            ${dataField}
            class="form-control"
          >
            <option value="">Selecione...</option>
            ${(col.options || []).map(opt => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              const selected = optValue == value ? 'selected' : '';
              return `<option value="${optValue}" ${selected}>${optLabel}</option>`;
            }).join('')}
          </select>
        `;
        break;

      case 'textarea':
        html = `
          <textarea
            id="${fieldId}"
            name="${fieldName}"
            ${required}
            ${disabled}
            ${dataValidate}
            ${dataField}
            ${col.placeholder ? `placeholder="${col.placeholder}"` : ''}
            rows="${col.rows || 3}"
            class="form-control"
          >${this.escapeHtml(value)}</textarea>
        `;
        break;

      case 'checkbox':
        const checked = value ? 'checked' : '';
        html = `
          <label class="checkbox-inline">
            <input
              type="checkbox"
              id="${fieldId}"
              name="${fieldName}"
              value="1"
              ${checked}
              ${disabled}
              ${dataField}
            />
            ${col.checkboxLabel || ''}
          </label>
        `;
        break;

      case 'radio':
        html = (col.options || []).map((opt, idx) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          const checked = optValue == value ? 'checked' : '';
          return `
            <label class="radio-inline">
              <input
                type="radio"
                id="${fieldId}_${idx}"
                name="${fieldName}"
                value="${optValue}"
                ${checked}
                ${disabled}
                ${dataField}
              />
              ${optLabel}
            </label>
          `;
        }).join('');
        break;

      default:
        html = `<input type="text" name="${fieldName}" value="${this.escapeHtml(value)}" class="form-control" ${dataField} />`;
    }

    return html;
  }

  /**
   * Remove uma linha
   */
  removeRow(row) {
    if (this.rowCount <= this.config.minRows) {
      this.showMessage(`Mínimo de ${this.config.minRows} linha(s) obrigatória(s)`, 'warning');
      return;
    }

    const rowIndex = parseInt(row.dataset.rowIndex);

    // Callback
    if (this.config.onRowRemove) {
      this.config.onRowRemove(row, rowIndex);
    }

    row.remove();
    this.rows = this.rows.filter(r => r !== row);
    this.rowCount--;
    this.updateCounter();
    this.updateButtons();

    if (this.config.autoSave) {
      this.saveData();
    }
  }

  /**
   * Mostra diálogo para colar dados do clipboard
   */
  showPasteDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'paste-dialog-backdrop';
    dialog.innerHTML = `
      <div class="paste-dialog">
        <div class="paste-dialog-header">
          <h3>Colar dados de planilha</h3>
          <button type="button" class="btn-close-dialog">&times;</button>
        </div>
        <div class="paste-dialog-body">
          <p>Cole os dados copiados do Excel ou Google Sheets na área abaixo:</p>
          <textarea
            id="pasteArea"
            class="paste-textarea"
            placeholder="Cole aqui os dados copiados (Ctrl+V)..."
            rows="10"
          ></textarea>
          <div class="paste-options">
            <label>
              <input type="radio" name="delimiter" value="auto" checked />
              Detectar automaticamente
            </label>
            <label>
              <input type="radio" name="delimiter" value="tab" />
              Tab (TSV)
            </label>
            <label>
              <input type="radio" name="delimiter" value="comma" />
              Vírgula (CSV)
            </label>
            <label>
              <input type="radio" name="delimiter" value="semicolon" />
              Ponto-e-vírgula
            </label>
          </div>
          <div class="paste-preview hidden">
            <h4>Preview (primeiras 3 linhas):</h4>
            <div class="preview-content"></div>
          </div>
        </div>
        <div class="paste-dialog-footer">
          <button type="button" class="btn btn-secondary btn-cancel-paste">Cancelar</button>
          <button type="button" class="btn btn-primary btn-confirm-paste">Colar dados</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    const pasteArea = dialog.querySelector('#pasteArea');
    const btnClose = dialog.querySelector('.btn-close-dialog');
    const btnCancel = dialog.querySelector('.btn-cancel-paste');
    const btnConfirm = dialog.querySelector('.btn-confirm-paste');
    const previewDiv = dialog.querySelector('.paste-preview');
    const previewContent = dialog.querySelector('.preview-content');

    // Auto-preview ao digitar/colar
    let previewTimeout;
    pasteArea.addEventListener('input', () => {
      clearTimeout(previewTimeout);
      previewTimeout = setTimeout(() => {
        const data = pasteArea.value;
        if (data.trim()) {
          const delimiter = this.getSelectedDelimiter(dialog);
          const parsed = this.parseClipboardData(data, delimiter);
          this.showPreview(previewContent, parsed);
          previewDiv.classList.remove('hidden');
        } else {
          previewDiv.classList.add('hidden');
        }
      }, 300);
    });

    // Detectar mudança de delimitador
    dialog.querySelectorAll('input[name="delimiter"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const data = pasteArea.value;
        if (data.trim()) {
          const delimiter = this.getSelectedDelimiter(dialog);
          const parsed = this.parseClipboardData(data, delimiter);
          this.showPreview(previewContent, parsed);
        }
      });
    });

    // Fechar diálogo
    const closeDialog = () => dialog.remove();
    btnClose.addEventListener('click', closeDialog);
    btnCancel.addEventListener('click', closeDialog);
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeDialog();
    });

    // Confirmar e colar
    btnConfirm.addEventListener('click', () => {
      const data = pasteArea.value.trim();
      if (!data) {
        this.showMessage('Nenhum dado para colar', 'warning');
        return;
      }

      const delimiter = this.getSelectedDelimiter(dialog);
      this.pasteFromClipboard(data, delimiter);
      closeDialog();
    });

    // Focus no textarea
    pasteArea.focus();
  }

  /**
   * Obtém o delimitador selecionado
   */
  getSelectedDelimiter(dialog) {
    const selected = dialog.querySelector('input[name="delimiter"]:checked');
    return selected ? selected.value : 'auto';
  }

  /**
   * Mostra preview dos dados
   */
  showPreview(container, parsedData) {
    if (!parsedData || parsedData.length === 0) {
      container.innerHTML = '<p class="error-text">Nenhum dado detectado</p>';
      return;
    }

    const preview = parsedData.slice(0, 3);
    let html = '<table class="preview-table"><tbody>';
    preview.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        html += `<td>${this.escapeHtml(cell)}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += `<p class="info-text">Total de ${parsedData.length} linha(s) detectada(s)</p>`;

    container.innerHTML = html;
  }

  /**
   * Cola dados do clipboard
   */
  pasteFromClipboard(clipboardText, delimiter = 'auto') {
    const parsed = this.parseClipboardData(clipboardText, delimiter);

    if (!parsed || parsed.length === 0) {
      this.showMessage('Nenhum dado válido encontrado', 'error');
      return;
    }

    // Validar número de colunas
    const expectedCols = this.config.columns.length;
    const invalidRows = parsed.filter(row => row.length !== expectedCols);

    if (invalidRows.length > 0) {
      const confirm = window.confirm(
        `Algumas linhas têm número diferente de colunas.\n` +
        `Esperado: ${expectedCols} colunas\n` +
        `${invalidRows.length} linha(s) serão ignoradas.\n\n` +
        `Deseja continuar?`
      );
      if (!confirm) return;
    }

    // Perguntar se deve limpar tabela antes
    if (this.rowCount > 0) {
      const clearFirst = window.confirm(
        `A tabela possui ${this.rowCount} linha(s).\n\n` +
        `Deseja limpar as linhas existentes antes de colar?\n\n` +
        `Sim = Limpar e colar\n` +
        `Não = Adicionar ao final`
      );

      if (clearFirst) {
        this.clearRows();
      }
    }

    // Adicionar linhas
    let addedCount = 0;
    let errorCount = 0;

    parsed.forEach(row => {
      if (row.length !== expectedCols) {
        errorCount++;
        return;
      }

      const rowData = {};
      this.config.columns.forEach((col, idx) => {
        rowData[col.field] = row[idx] || '';
      });

      const addedRow = this.addRow(rowData, false);
      if (addedRow) {
        addedCount++;
      } else {
        errorCount++;
      }
    });

    // Callback
    if (this.config.onPaste) {
      this.config.onPaste(parsed, addedCount, errorCount);
    }

    // Mensagem de sucesso
    if (addedCount > 0) {
      this.showMessage(
        `${addedCount} linha(s) colada(s) com sucesso${errorCount > 0 ? ` (${errorCount} erro(s))` : ''}`,
        errorCount > 0 ? 'warning' : 'success'
      );
    } else {
      this.showMessage('Nenhuma linha foi adicionada', 'error');
    }
  }

  /**
   * Parse dados do clipboard com detecção automática de delimitador
   */
  parseClipboardData(text, delimiter = 'auto') {
    if (!text || !text.trim()) return [];

    const lines = text.split(/\r?\n/).filter(line => line.trim());

    if (delimiter === 'auto') {
      delimiter = this.detectDelimiter(lines);
    }

    const delimiters = {
      tab: '\t',
      comma: ',',
      semicolon: ';'
    };

    const sep = delimiters[delimiter] || '\t';

    return lines.map(line => {
      // Split com suporte a campos entre aspas
      return this.parseLine(line, sep);
    });
  }

  /**
   * Detecta automaticamente o delimitador mais provável
   */
  detectDelimiter(lines) {
    if (!lines || lines.length === 0) return 'tab';

    const firstLine = lines[0];
    const delimiters = {
      tab: (firstLine.match(/\t/g) || []).length,
      comma: (firstLine.match(/,/g) || []).length,
      semicolon: (firstLine.match(/;/g) || []).length
    };

    // Retorna o delimitador com maior ocorrência
    let maxCount = 0;
    let detected = 'tab';

    Object.keys(delimiters).forEach(key => {
      if (delimiters[key] > maxCount) {
        maxCount = delimiters[key];
        detected = key;
      }
    });

    // Se não detectou nenhum, assume tab (padrão do Excel)
    return maxCount > 0 ? detected : 'tab';
  }

  /**
   * Parse uma linha com suporte a campos entre aspas
   */
  parseLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Aspas duplas escapadas
          current += '"';
          i++;
        } else {
          // Toggle estado de aspas
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        // Delimitador fora de aspas = nova coluna
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Adicionar último campo
    result.push(current.trim());

    return result;
  }

  /**
   * Valida um campo
   */
  validateField(field) {
    const fieldName = field.dataset.field;
    const validator = this.config.validators[fieldName];

    if (!validator) {
      return true;
    }

    let isValid = true;
    let errorMessage = '';

    if (typeof validator === 'function') {
      const result = validator(field.value, field);
      isValid = typeof result === 'boolean' ? result : result.valid;
      errorMessage = result.message || '';
    } else if (typeof validator === 'string') {
      // Validadores pré-definidos (CPF, CNPJ, etc)
      const validatorFn = window.PMOValidators ? window.PMOValidators[validator] : null;
      if (validatorFn) {
        isValid = validatorFn(field.value);
        errorMessage = `${fieldName} inválido`;
      }
    }

    // Aplicar classes visuais
    if (field.value && field.required) {
      field.classList.toggle('field-valid', isValid);
      field.classList.toggle('field-invalid', !isValid);
    } else {
      field.classList.remove('field-valid', 'field-invalid');
    }

    // Mostrar/ocultar mensagem de erro
    const errorDiv = field.parentElement.querySelector('.error-text');
    if (!isValid && errorMessage) {
      if (!errorDiv) {
        const div = document.createElement('div');
        div.className = 'error-text';
        div.textContent = errorMessage;
        field.parentElement.appendChild(div);
      } else {
        errorDiv.textContent = errorMessage;
      }
    } else if (errorDiv) {
      errorDiv.remove();
    }

    // Callback
    if (this.config.onValidate) {
      this.config.onValidate(field, isValid, errorMessage);
    }

    return isValid;
  }

  /**
   * Valida todas as linhas
   */
  validateAll() {
    let isValid = true;
    const errors = [];

    this.rows.forEach((row, idx) => {
      row.querySelectorAll('input, select, textarea').forEach(field => {
        const fieldValid = this.validateField(field);
        if (!fieldValid) {
          isValid = false;
          errors.push({
            row: idx + 1,
            field: field.dataset.field || field.name,
            value: field.value
          });
        }
      });
    });

    return { valid: isValid, errors };
  }

  /**
   * Obtém todos os dados da tabela
   */
  getData() {
    const data = [];

    this.rows.forEach(row => {
      const rowData = {};
      row.querySelectorAll('[data-field]').forEach(field => {
        const fieldName = field.dataset.field;
        rowData[fieldName] = field.type === 'checkbox' ? field.checked : field.value;
      });
      data.push(rowData);
    });

    return data;
  }

  /**
   * Define os dados da tabela
   */
  setData(data) {
    this.clearRows();
    data.forEach(rowData => {
      this.addRow(rowData, true);
    });
  }

  /**
   * Limpa todas as linhas (mantém mínimo)
   */
  clearRows() {
    while (this.rowCount > this.config.minRows) {
      const lastRow = this.rows[this.rows.length - 1];
      if (lastRow) {
        lastRow.remove();
        this.rows.pop();
        this.rowCount--;
      }
    }

    // Limpar campos das linhas restantes
    this.rows.forEach(row => {
      row.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
          field.checked = false;
        } else {
          field.value = '';
        }
      });
    });

    this.updateCounter();
    this.updateButtons();

    if (this.config.autoSave) {
      this.saveData();
    }
  }

  /**
   * Exporta para CSV
   */
  exportToCSV() {
    const data = this.getData();
    if (data.length === 0) {
      this.showMessage('Nenhum dado para exportar', 'warning');
      return;
    }

    // Cabeçalhos
    const headers = this.config.columns.map(col => col.label);
    const csvLines = [headers.join(',')];

    // Dados
    data.forEach(row => {
      const values = this.config.columns.map(col => {
        let value = row[col.field] || '';
        // Escapar aspas e adicionar aspas se contém vírgula
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvLines.push(values.join(','));
    });

    const csvContent = csvLines.join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `${this.container.id}_${new Date().toISOString().split('T')[0]}.csv`;

    // Download
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    this.showMessage('Arquivo CSV exportado com sucesso', 'success');
  }

  /**
   * Salva dados no localStorage
   */
  saveData() {
    if (!this.config.autoSave) return;

    const data = this.getData();
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
      console.log(` Dados salvos: ${this.config.storageKey}`);
    } catch (e) {
      console.error('Erro ao salvar dados:', e);
    }
  }

  /**
   * Carrega dados salvos
   */
  loadSavedData() {
    if (!this.config.autoSave) return;

    try {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data) && data.length > 0) {
          this.setData(data);
          console.log(` Dados carregados: ${this.config.storageKey}`);
        }
      }
    } catch (e) {
      console.error('Erro ao carregar dados salvos:', e);
    }

    // Se não há dados salvos, adicionar linhas mínimas
    if (this.rowCount === 0) {
      for (let i = 0; i < this.config.minRows; i++) {
        this.addRow({}, true);
      }
    }
  }

  /**
   * Atualiza contador de linhas
   */
  updateCounter() {
    if (this.rowCounter) {
      this.rowCounter.textContent = this.rowCount;
    }
  }

  /**
   * Atualiza estado dos botões
   */
  updateButtons() {
    const btnAdd = this.container.querySelector('.btn-add-row');
    if (btnAdd) {
      btnAdd.disabled = this.rowCount >= this.config.maxRows;
    }

    this.rows.forEach(row => {
      const btnRemove = row.querySelector('.btn-remove-row');
      if (btnRemove) {
        btnRemove.disabled = this.rowCount <= this.config.minRows;
      }
    });
  }

  /**
   * Mostra mensagem
   */
  showMessage(text, type = 'info') {
    // Verifica se existe sistema de notificações do framework
    if (window.PMONotifications) {
      window.PMONotifications.show(text, type);
      return;
    }

    // Fallback: alert simples
    alert(text);
  }

  /**
   * Escapa HTML para prevenir XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Destrói a instância da tabela
   */
  destroy() {
    if (this.config.autoSave) {
      this.saveData();
    }
    this.container.innerHTML = '';
    this.rows = [];
    this.rowCount = 0;
  }
}

// Expor globalmente
window.PMOTable = PMOTable;

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar tabelas com atributo data-pmo-table
  document.querySelectorAll('[data-pmo-table]').forEach(container => {
    const config = container.dataset.pmoTableConfig
      ? JSON.parse(container.dataset.pmoTableConfig)
      : {};
    new PMOTable(container.id, config);
  });
});