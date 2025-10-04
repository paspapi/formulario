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
     * Exibe diálogo para colar dados do clipboard
     * @param {string} tableId - ID da tabela
     */
    showPasteDialog(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;

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
                            Tab (Excel)
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
                alert('Nenhum dado para colar');
                return;
            }

            const delimiter = this.getSelectedDelimiter(dialog);
            this.pasteFromClipboard(tableId, data, delimiter);
            closeDialog();
        });

        // Focus no textarea
        pasteArea.focus();
    },

    /**
     * Obtém o delimitador selecionado
     * @param {HTMLElement} dialog - Elemento do diálogo
     * @returns {string} Delimitador selecionado
     */
    getSelectedDelimiter(dialog) {
        const selected = dialog.querySelector('input[name="delimiter"]:checked');
        return selected ? selected.value : 'auto';
    },

    /**
     * Mostra preview dos dados
     * @param {HTMLElement} container - Container do preview
     * @param {Array} parsedData - Dados parseados
     */
    showPreview(container, parsedData) {
        if (!parsedData || parsedData.length === 0) {
            container.innerHTML = '<p style="color: #ef4444;">Nenhum dado detectado</p>';
            return;
        }

        const preview = parsedData.slice(0, 3);
        let html = '<table style="width: 100%; border-collapse: collapse;"><tbody>';
        preview.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                html += `<td style="border: 1px solid #ddd; padding: 4px; font-size: 12px;">${this.escapeHtml(cell)}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        html += `<p style="margin-top: 8px; color: #666; font-size: 13px;">Total de ${parsedData.length} linha(s) detectada(s)</p>`;

        container.innerHTML = html;
    },

    /**
     * Escapa HTML para prevenir XSS
     * @param {string} text - Texto a escapar
     * @returns {string} Texto escapado
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    },

    /**
     * Cola dados do clipboard na tabela
     * @param {string} tableId - ID da tabela
     * @param {string} clipboardText - Texto do clipboard
     * @param {string} delimiter - Delimitador ('auto', 'tab', 'comma', 'semicolon')
     */
    pasteFromClipboard(tableId, clipboardText, delimiter = 'auto') {
        const table = document.getElementById(tableId);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const parsed = this.parseClipboardData(clipboardText, delimiter);

        if (!parsed || parsed.length === 0) {
            alert('Nenhum dado válido encontrado');
            return;
        }

        // Detectar número de colunas esperado (da primeira linha existente ou do cabeçalho)
        const firstRow = tbody.querySelector('tr');
        const expectedCols = firstRow
            ? firstRow.querySelectorAll('td:not(.action-column)').length
            : table.querySelectorAll('thead th:not(.action-column)').length;

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
        const rowCount = tbody.querySelectorAll('tr').length;
        let clearFirst = false;

        if (rowCount > 0) {
            clearFirst = window.confirm(
                `A tabela possui ${rowCount} linha(s).\n\n` +
                `Deseja limpar as linhas existentes antes de colar?\n\n` +
                `Sim = Limpar e colar\n` +
                `Não = Adicionar ao final`
            );
        }

        if (clearFirst) {
            // Remove todas as linhas exceto a primeira
            const rows = Array.from(tbody.querySelectorAll('tr'));
            rows.forEach((row, index) => {
                if (index > 0) row.remove();
            });
        }

        // Adicionar linhas
        let addedCount = 0;
        let errorCount = 0;

        parsed.forEach(rowData => {
            if (rowData.length !== expectedCols) {
                errorCount++;
                return;
            }

            try {
                this.addRow(tableId);
                const lastRow = tbody.querySelector('tr:last-child');
                if (!lastRow) return;

                // Preencher células
                const inputs = lastRow.querySelectorAll('input, select, textarea');
                rowData.forEach((cellValue, index) => {
                    if (inputs[index]) {
                        const input = inputs[index];
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            input.checked = ['sim', 'yes', '1', 'true', 'x'].includes(cellValue.toLowerCase());
                        } else {
                            input.value = cellValue;
                        }
                    }
                });

                addedCount++;
            } catch (e) {
                console.error('Erro ao adicionar linha:', e);
                errorCount++;
            }
        });

        // Mensagem de sucesso
        if (addedCount > 0) {
            alert(
                `${addedCount} linha(s) colada(s) com sucesso${errorCount > 0 ? ` (${errorCount} erro(s))` : ''}`
            );
        } else {
            alert('Nenhuma linha foi adicionada');
        }
    },

    /**
     * Parse dados do clipboard com detecção automática de delimitador
     * @param {string} text - Texto do clipboard
     * @param {string} delimiter - Delimitador ('auto', 'tab', 'comma', 'semicolon')
     * @returns {Array} Array de arrays com os dados
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
            return this.parseLine(line, sep);
        });
    },

    /**
     * Detecta automaticamente o delimitador mais provável
     * @param {Array} lines - Linhas do texto
     * @returns {string} Delimitador detectado
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
    },

    /**
     * Parse uma linha com suporte a campos entre aspas
     * @param {string} line - Linha a ser parseada
     * @param {string} delimiter - Delimitador
     * @returns {Array} Array com os valores da linha
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

// Função helper global para colar dados
function colarDadosTabela(tableId) {
    PMOTable.showPasteDialog(tableId);
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
