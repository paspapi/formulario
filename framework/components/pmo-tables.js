/**
 * PMO Tables - Sistema de Tabelas Dinâmicas
 * Biblioteca unificada para manipulação de tabelas com linhas dinâmicas
 * Sistema PMO ANC - Versão 2.0
 */

const PMOTable = {
    /**
     * Adiciona uma nova linha à tabela
     * @param {string} tableId - ID da tabela (sem '#')
     */
    addRow(tableId) {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error(`Tabela não encontrada: ${tableId}`);
            return;
        }

        const tbody = table.querySelector('tbody');
        if (!tbody) {
            console.error(`tbody não encontrado na tabela: ${tableId}`);
            return;
        }

        // Procura por template específico
        const templateId = 'template-' + tableId.replace('tabela-', '');
        let template = document.getElementById(templateId);

        // Se não houver template, usa a primeira linha como modelo
        if (!template || !template.content) {
            const firstRow = tbody.querySelector('tr');
            if (!firstRow) {
                console.error(`Nenhuma linha de referência encontrada em: ${tableId}`);
                return;
            }

            const newRow = firstRow.cloneNode(true);
            this.clearRowInputs(newRow);
            tbody.appendChild(newRow);
            this.updateRowNumbers(tableId);
            return;
        }

        // Usa o template
        const newRow = template.content.cloneNode(true);
        tbody.appendChild(newRow);
        this.updateRowNumbers(tableId);
    },

    /**
     * Remove uma linha da tabela
     * @param {HTMLElement} button - Botão de remover clicado
     */
    removeRow(button) {
        const row = button.closest('tr');
        if (!row) return;

        const tbody = row.parentElement;
        const table = tbody.closest('table');

        // Não permite remover se for a única linha
        const rowCount = tbody.querySelectorAll('tr').length;
        if (rowCount <= 1) {
            alert('Não é possível remover a única linha da tabela.');
            return;
        }

        // Remove a linha
        row.remove();

        // Atualiza numeração
        if (table && table.id) {
            this.updateRowNumbers(table.id);
        }
    },

    /**
     * Duplica uma linha da tabela
     * @param {HTMLElement} button - Botão de duplicar clicado
     */
    duplicateRow(button) {
        const row = button.closest('tr');
        if (!row) return;

        const tbody = row.parentElement;
        const newRow = row.cloneNode(true);

        // Mantém os valores dos inputs
        tbody.appendChild(newRow);

        // Atualiza numeração
        const table = tbody.closest('table');
        if (table && table.id) {
            this.updateRowNumbers(table.id);
        }
    },

    /**
     * Limpa os inputs de uma linha
     * @param {HTMLElement} row - Linha a ser limpa
     */
    clearRowInputs(row) {
        const inputs = row.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    },

    /**
     * Atualiza a numeração das linhas
     * @param {string} tableId - ID da tabela
     */
    updateRowNumbers(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            const numberCell = row.querySelector('.row-number');
            if (numberCell) {
                numberCell.textContent = index + 1;
            }
        });
    },

    /**
     * Obtém dados de uma tabela
     * @param {string} tableId - ID da tabela
     * @returns {Array} Array com os dados de cada linha
     */
    getTableData(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return [];

        const rows = table.querySelectorAll('tbody tr');
        const data = [];

        rows.forEach(row => {
            const rowData = {};
            const inputs = row.querySelectorAll('input, select, textarea');

            inputs.forEach(input => {
                const name = input.name;
                if (!name) return;

                // Remove [] do final do name se houver
                const cleanName = name.replace(/\[\]$/, '');

                if (input.type === 'checkbox') {
                    rowData[cleanName] = input.checked;
                } else if (input.type === 'radio') {
                    if (input.checked) {
                        rowData[cleanName] = input.value;
                    }
                } else {
                    rowData[cleanName] = input.value;
                }
            });

            data.push(rowData);
        });

        return data;
    },

    /**
     * Preenche uma tabela com dados
     * @param {string} tableId - ID da tabela
     * @param {Array} data - Array com os dados
     */
    setTableData(tableId, data) {
        const table = document.getElementById(tableId);
        if (!table || !Array.isArray(data)) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // Limpa as linhas existentes
        tbody.innerHTML = '';

        // Adiciona linhas com os dados
        data.forEach(rowData => {
            this.addRow(tableId);
            const lastRow = tbody.querySelector('tr:last-child');
            if (!lastRow) return;

            Object.keys(rowData).forEach(key => {
                const input = lastRow.querySelector(`[name="${key}"], [name="${key}[]"]`);
                if (!input) return;

                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = rowData[key];
                } else {
                    input.value = rowData[key];
                }
            });
        });

        this.updateRowNumbers(tableId);
    },

    /**
     * Valida uma tabela (verifica campos required)
     * @param {string} tableId - ID da tabela
     * @returns {boolean} True se válida
     */
    validateTable(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return true;

        const requiredInputs = table.querySelectorAll('tbody [required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value || (input.type === 'checkbox' && !input.checked)) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    },

    /**
     * Inicializa todas as tabelas dinâmicas na página
     */
    initAll() {
        // Encontra todas as tabelas com classe dynamic-table
        const tables = document.querySelectorAll('table.dynamic-table, table.table');

        tables.forEach(table => {
            if (!table.id) return;

            // Adiciona primeira linha se tbody estiver vazio
            const tbody = table.querySelector('tbody');
            if (tbody && tbody.children.length === 0) {
                this.addRow(table.id);
            }

            // Atualiza numeração inicial
            this.updateRowNumbers(table.id);
        });

        console.log(`PMOTable: ${tables.length} tabelas inicializadas`);
    }
};

// Funções globais para compatibilidade com código existente
function addSubstratoRow() {
    PMOTable.addRow('tabela-substrato');
}

function addReceitaRow() {
    PMOTable.addRow('tabela-receitas');
}

function addProdutoComercialRow() {
    PMOTable.addRow('tabela-produtos-comerciais');
}

function addProdutoNaoCertificarRow() {
    PMOTable.addRow('tabela-produtos-nao-certificar');
}

// Função auxiliar para toggle de campos condicionais
function toggleConditional(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        if (show) {
            element.classList.add('show');
        } else {
            element.classList.remove('show');
        }
    }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PMOTable.initAll());
} else {
    PMOTable.initAll();
}

// Exporta para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PMOTable;
}
