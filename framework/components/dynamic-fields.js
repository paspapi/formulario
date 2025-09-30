/**
 * PMO Dynamic Fields - Campos dinâmicos e tabelas
 * Adiciona/remove linhas dinamicamente em formulários
 * @version 2.0
 */

class PMODynamicFields {
  constructor() {
    this.tables = new Map();
    this.fieldCounter = new Map();
  }

  init() {
    const tables = document.querySelectorAll('[data-dynamic-table]');
    tables.forEach(table => {
      const tableId = table.id || `table_${Date.now()}`;
      this.initTable(tableId, table);
    });
  }

  initTable(tableId, tableElement) {
    if (!tableElement) {
      tableElement = document.getElementById(tableId);
    }
    if (!tableElement) return;

    this.tables.set(tableId, {
      element: tableElement,
      template: null,
      rowCount: 0
    });

    const tbody = tableElement.querySelector('tbody');
    const firstRow = tbody?.querySelector('tr[data-template]');

    if (firstRow) {
      this.tables.get(tableId).template = firstRow.cloneNode(true);
      firstRow.removeAttribute('data-template');
    }

    this.addAddButton(tableId, tableElement);
    this.attachRemoveListeners(tableId);
  }

  addAddButton(tableId, tableElement) {
    const addButton = tableElement.querySelector('[data-add-row]');
    if (addButton) {
      addButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.addRow(tableId);
      });
    }
  }

  attachRemoveListeners(tableId) {
    const table = this.tables.get(tableId);
    if (!table) return;

    const tbody = table.element.querySelector('tbody');
    const removeButtons = tbody.querySelectorAll('[data-remove-row]');

    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const row = button.closest('tr');
        this.removeRow(tableId, row);
      });
    });
  }

  addRow(tableId, data = {}) {
    const table = this.tables.get(tableId);
    if (!table) return null;

    const newRow = table.template.cloneNode(true);
    table.rowCount++;

    this.updateFieldIds(newRow, tableId, table.rowCount);

    if (Object.keys(data).length > 0) {
      this.fillRowData(newRow, data);
    }

    const tbody = table.element.querySelector('tbody');
    tbody.appendChild(newRow);

    const removeButton = newRow.querySelector('[data-remove-row]');
    if (removeButton) {
      removeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.removeRow(tableId, newRow);
      });
    }

    this.dispatchEvent('rowAdded', { tableId, row: newRow, rowCount: table.rowCount });
    return newRow;
  }

  removeRow(tableId, row) {
    const table = this.tables.get(tableId);
    if (!table) return;

    const tbody = table.element.querySelector('tbody');
    const rowCount = tbody.querySelectorAll('tr').length;

    if (rowCount <= 1) {
      alert('Não é possível remover a última linha');
      return;
    }

    row.remove();
    table.rowCount--;

    this.dispatchEvent('rowRemoved', { tableId, rowCount: table.rowCount });
  }

  updateFieldIds(row, tableId, index) {
    const fields = row.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      const originalName = field.getAttribute('data-field-name') || field.name;
      const originalId = field.getAttribute('data-field-id') || field.id;

      if (originalName) {
        field.name = `${tableId}_${originalName}_${index}`;
        field.setAttribute('data-field-name', originalName);
      }

      if (originalId) {
        field.id = `${tableId}_${originalId}_${index}`;
        field.setAttribute('data-field-id', originalId);
      }

      if (field.type !== 'hidden') {
        field.value = '';
      }
    });
  }

  fillRowData(row, data) {
    const fields = row.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      const fieldName = field.getAttribute('data-field-name') || field.name;
      const baseFieldName = fieldName.split('_').pop();

      if (data.hasOwnProperty(baseFieldName)) {
        field.value = data[baseFieldName];
      }
    });
  }

  getTableData(tableId) {
    const table = this.tables.get(tableId);
    if (!table) return [];

    const tbody = table.element.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const data = [];

    rows.forEach(row => {
      const rowData = this.getRowData(row);
      if (Object.keys(rowData).length > 0) {
        data.push(rowData);
      }
    });

    return data;
  }

  getRowData(row) {
    const data = {};
    const fields = row.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      const fieldName = field.getAttribute('data-field-name') || field.name;
      const baseFieldName = fieldName.split('_').pop();

      if (field.type === 'checkbox') {
        data[baseFieldName] = field.checked;
      } else if (field.type === 'radio') {
        if (field.checked) {
          data[baseFieldName] = field.value;
        }
      } else {
        data[baseFieldName] = field.value;
      }
    });

    return data;
  }

  setTableData(tableId, dataArray) {
    const table = this.tables.get(tableId);
    if (!table) return;

    this.clearTable(tableId);

    dataArray.forEach(rowData => {
      this.addRow(tableId, rowData);
    });
  }

  clearTable(tableId) {
    const table = this.tables.get(tableId);
    if (!table) return;

    const tbody = table.element.querySelector('tbody');
    tbody.innerHTML = '';
    table.rowCount = 0;
  }

  getRowCount(tableId) {
    const table = this.tables.get(tableId);
    if (!table) return 0;

    const tbody = table.element.querySelector('tbody');
    return tbody.querySelectorAll('tr').length;
  }

  initConditionalFields() {
    const triggers = document.querySelectorAll('[data-condition-trigger]');

    triggers.forEach(trigger => {
      const targetId = trigger.getAttribute('data-condition-target');
      const showValue = trigger.getAttribute('data-condition-show');

      if (!targetId) return;

      const toggleVisibility = () => {
        const target = document.getElementById(targetId);
        if (!target) return;

        let shouldShow = false;

        if (trigger.type === 'checkbox') {
          shouldShow = trigger.checked;
        } else if (trigger.type === 'radio') {
          shouldShow = trigger.checked && (!showValue || trigger.value === showValue);
        } else {
          shouldShow = !showValue || trigger.value === showValue;
        }

        if (shouldShow) {
          target.style.display = '';
          target.classList.add('visible');
          target.querySelectorAll('input, select, textarea').forEach(field => {
            field.removeAttribute('disabled');
          });
        } else {
          target.style.display = 'none';
          target.classList.remove('visible');
          target.querySelectorAll('input, select, textarea').forEach(field => {
            field.setAttribute('disabled', 'disabled');
          });
        }
      };

      toggleVisibility();
      trigger.addEventListener('change', toggleVisibility);
    });
  }

  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`pmo:${eventName}`, {
      detail: detail,
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  destroy() {
    this.tables.clear();
    this.fieldCounter.clear();
  }
}

const dynamicFields = new PMODynamicFields();

if (typeof window !== 'undefined') {
  window.PMODynamicFields = dynamicFields;
}

export default dynamicFields
