// Anexo I - Producao Vegetal - Sistema PMO ANC
// ENCODING: UTF-8 (sem acentos para compatibilidade)

const AnexoVegetal = {
    config: {
        formId: 'form-anexo-vegetal',
        storageKey: 'anexo_vegetal_data',
        autoSaveInterval: 30000,
        version: '2.0'
    },

    loadPMOPrincipal() {
        try {
            console.log('Carregando dados do PMO Principal...');
            let data = null;

            // Tentar carregar usando PMOStorageManager
            if (window.PMOStorageManager) {
                const pmo = window.PMOStorageManager.getActivePMO();
                if (pmo && pmo.dados && pmo.dados.cadastro_geral_pmo) {
                    data = pmo.dados.cadastro_geral_pmo;
                }
            }

            // Fallback para formato antigo
            if (!data) {
                const cadastroGeralPMO = localStorage.getItem('cadastro_geral_pmo_data');
                if (cadastroGeralPMO) {
                    data = JSON.parse(cadastroGeralPMO);
                }
            }

            if (!data) {
                console.log('Nenhum dado do PMO Principal encontrado.');
                this.showMessage('Aviso: Preencha o PMO Principal primeiro.', 'warning');
                return;
            }

            const form = document.getElementById(this.config.formId);
            if (!form) return;

            const nomeField = form.querySelector('[name="nome_fornecedor"]');
            if (nomeField && !nomeField.value) {
                nomeField.value = data.nome_completo || data.razao_social || '';
            }

            const unidadeField = form.querySelector('[name="nome_unidade_producao"]');
            if (unidadeField && !unidadeField.value) {
                unidadeField.value = data.nome_unidade_producao || '';
            }

            const dataField = form.querySelector('[name="data_preenchimento"]');
            if (dataField && !dataField.value) {
                dataField.value = new Date().toISOString().split('T')[0];
            }

            const grupoField = form.querySelector('[name="grupo_spg"]');
            if (grupoField && !grupoField.value && data.grupo_spg) {
                grupoField.value = data.grupo_spg;
            }

            const nomeAssinatura = form.querySelector('[name="nome_completo_produtor"]');
            if (nomeAssinatura && !nomeAssinatura.value) {
                nomeAssinatura.value = data.nome_completo || data.razao_social || '';
            }

            const grupoAssinatura = form.querySelector('[name="grupo_spg_anc"]');
            if (grupoAssinatura && !grupoAssinatura.value && data.grupo_spg) {
                grupoAssinatura.value = data.grupo_spg;
            }

            const dataElaboracao = form.querySelector('[name="data_elaboracao"]');
            if (dataElaboracao && !dataElaboracao.value) {
                dataElaboracao.value = new Date().toISOString().split('T')[0];
            }

            this.showMessage('Dados carregados do PMO Principal!', 'success');
        } catch (error) {
            console.error('Erro ao carregar PMO Principal:', error);
            this.showMessage('Erro ao carregar dados.', 'error');
        }
    },

    init() {
        console.log('Inicializando Anexo Vegetal...');
        this.setupEventListeners();
        this.loadPMOPrincipal();
        this.loadSavedData();
        this.setupAutoSave();
        this.updateProgress();
    },

    setupEventListeners() {
        const form = document.getElementById(this.config.formId);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        form.addEventListener('change', () => this.updateProgress());
        form.addEventListener('input', () => this.markAsChanged());

        // Configurar auto-save ao navegar
        if (window.AutoSaveNavigation) {
            window.AutoSaveNavigation.setup({
                state: { isModified: false },
                salvar: (isAutoSave) => this.saveForm(isAutoSave),
                get state() {
                    return { isModified: AnexoVegetal.hasChanges };
                }
            });
        }
    },

    setupAutoSave() {
        setInterval(() => {
            if (this.hasChanges) {
                this.saveForm(true);
                this.hasChanges = false;
            }
        }, this.config.autoSaveInterval);
    },

    markAsChanged() {
        this.hasChanges = true;
    },

    updateProgress() {
        const form = document.getElementById(this.config.formId);
        if (!form) return;

        const requiredFields = form.querySelectorAll('[required]');
        let filledFields = 0;

        requiredFields.forEach(field => {
            if (field.type === 'checkbox') {
                if (field.checked) filledFields++;
            } else {
                if (field.value.trim() !== '') filledFields++;
            }
        });

        const percentage = Math.round((filledFields / requiredFields.length) * 100);
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (progressBar) progressBar.style.width = percentage + '%';
        if (progressText) progressText.textContent = percentage + '% Completo';

        // Atualizar progresso no PMOStorageManager
        if (window.PMOStorageManager) {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (pmo) {
                window.PMOStorageManager.updateProgresso(pmo.id, 'anexo_vegetal', percentage);
            }
        }

        return percentage;
    },

    collectFormData() {
        const form = document.getElementById(this.config.formId);
        if (!form) return null;

        const formData = new FormData(form);

        // Converter FormData para objeto plano
        const formDataObj = {};
        for (let [key, value] of formData.entries()) {
            if (formDataObj[key]) {
                if (Array.isArray(formDataObj[key])) {
                    formDataObj[key].push(value);
                } else {
                    formDataObj[key] = [formDataObj[key], value];
                }
            } else {
                formDataObj[key] = value;
            }
        }

        // Usar SchemaMapper para estruturar conforme schema
        const data = window.SchemaMapper ?
            window.SchemaMapper.toVegetalSchema(formDataObj) :
            this.collectFormDataFallback(formDataObj);

        // Adicionar PMO info se disponível
        if (window.PMOStorageManager) {
            const pmo = window.PMOStorageManager.getActivePMO();
            if (pmo) {
                data.metadata.id_pmo = pmo.id;
                data.metadata.id_produtor = pmo.cpf_cnpj;
                data.metadata.grupo_spg = pmo.grupo_spg;
                data.metadata.nome_produtor = pmo.nome;
                data.metadata.nome_unidade = pmo.unidade;
                data.metadata.ano_vigente = pmo.ano_vigente;
            }
        }

        // Adicionar validação básica
        data.validacao = {
            percentual_completo: this.updateProgress(),
            campos_obrigatorios_completos: this.validateForm(),
            data_validacao: new Date().toISOString()
        };

        return data;
    },

    collectFormDataFallback(formDataObj) {
        // Fallback se SchemaMapper não estiver disponível
        return {
            metadata: {
                versao_schema: '2.0.0',
                tipo_formulario: 'anexo_vegetal',
                data_criacao: formDataObj.data_preenchimento || new Date().toISOString(),
                ultima_atualizacao: new Date().toISOString(),
                status: 'rascunho'
            },
            dados: formDataObj
        };
    },

    saveForm(isAutoSave = false) {
        try {
            const data = this.collectFormData();
            if (!data) throw new Error('Erro ao coletar dados');

            // Usar PMOStorageManager
            if (window.PMOStorageManager) {
                const pmo = window.PMOStorageManager.getActivePMO();
                if (pmo) {
                    window.PMOStorageManager.updateFormulario(pmo.id, 'anexo_vegetal', data);
                } else {
                    console.warn('Nenhum PMO ativo. Crie o Cadastro Geral primeiro.');
                    this.showMessage('Crie o Cadastro Geral PMO primeiro!', 'warning');
                    return false;
                }
            } else {
                // Fallback para formato antigo
                localStorage.setItem(this.config.storageKey, JSON.stringify(data));
            }

            if (!isAutoSave) {
                this.showMessage('Dados salvos com sucesso!', 'success');
            }
            return true;
        } catch (error) {
            console.error('Erro ao salvar:', error);
            if (!isAutoSave) this.showMessage('Erro ao salvar!', 'error');
            return false;
        }
    },

    loadSavedData() {
        try {
            let data = null;

            // Tentar carregar usando PMOStorageManager
            if (window.PMOStorageManager) {
                const pmo = window.PMOStorageManager.getActivePMO();
                if (pmo && pmo.dados && pmo.dados.anexo_vegetal) {
                    data = pmo.dados.anexo_vegetal;
                    console.log(`✅ Dados carregados do PMO: ${pmo.id}`);
                }
            }

            // Fallback para formato antigo
            if (!data) {
                const savedData = localStorage.getItem(this.config.storageKey);
                if (savedData) {
                    data = JSON.parse(savedData);
                    console.log('✅ Dados carregados do formato antigo');
                }
            }

            if (data) {
                this.showMessage('Dados anteriores carregados', 'info');
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    },

    validateForm() {
        const form = document.getElementById(this.config.formId);
        if (!form) return false;

        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        this.showMessage('Formulario valido!', 'success');
        return true;
    },

    exportJSON() {
        const data = this.collectFormData();
        if (!data) {
            this.showMessage('Erro ao coletar dados', 'error');
            return;
        }

        // Nome do arquivo com identificação do PMO
        const pmoId = data.metadata.id_pmo || 'sem-pmo';
        const fileName = `anexo-vegetal_${pmoId}_${new Date().toISOString().split('T')[0]}.json`;

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);

        this.showMessage('JSON exportado com sucesso!', 'success');
        console.log('✅ Anexo Vegetal exportado:', fileName);
    },

    exportPDF() {
        this.showMessage('Exportacao PDF em desenvolvimento...', 'info');
    },

    handleSubmit() {
        if (this.validateForm()) {
            this.saveForm();
            this.showMessage('Anexo Vegetal finalizado!', 'success');
        }
    },

    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message message-' + type;
        messageEl.textContent = message;
        messageEl.style.cssText = 'position:fixed;top:20px;right:20px;padding:15px 20px;border-radius:8px;background:' +
            (type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6') +
            ';color:white;font-weight:500;box-shadow:0 4px 6px rgba(0,0,0,0.1);z-index:10000;';

        document.body.appendChild(messageEl);
        setTimeout(function() { messageEl.remove(); }, 3000);
    }
};

function addSubstratoRow() {
    const tbody = document.getElementById('tbody-substrato');
    if (!tbody) return;
    const rowNumber = tbody.children.length + 1;
    const row = document.createElement('tr');
    row.innerHTML = '<td>' + rowNumber + '</td>' +
        '<td><input type="text" name="substrato_ingrediente_' + rowNumber + '" placeholder="Ex: Humus de minhoca"></td>' +
        '<td><input type="text" name="substrato_origem_' + rowNumber + '" placeholder="Origem"></td>' +
        '<td><input type="number" name="substrato_proporcao_' + rowNumber + '" min="0" max="100"></td>' +
        '<td><button type="button" onclick="removeTableRow(this)" class="btn-icon">X</button></td>';
    tbody.appendChild(row);
}

function addReceitaRow() {
    const tbody = document.getElementById('tbody-receitas');
    if (!tbody) return;
    const rowNumber = tbody.children.length + 1;
    const row = document.createElement('tr');
    row.innerHTML = '<td>' + rowNumber + '</td>' +
        '<td><input type="text" name="receita_nome_' + rowNumber + '"></td>' +
        '<td><input type="text" name="receita_ingredientes_' + rowNumber + '"></td>' +
        '<td><input type="text" name="receita_quantidade_' + rowNumber + '"></td>' +
        '<td><input type="text" name="receita_cultura_' + rowNumber + '"></td>' +
        '<td><select name="receita_status_' + rowNumber + '">' +
        '<option value="">Selecione...</option>' +
        '<option value="JA_USA">Ja usa</option>' +
        '<option value="PRETENDE_USAR">Pretende usar</option></select></td>' +
        '<td><button type="button" onclick="removeTableRow(this)" class="btn-icon">X</button></td>';
    tbody.appendChild(row);
}

function addProdutoComercialRow() {
    const tbody = document.getElementById('tbody-produtos-comerciais');
    if (!tbody) return;
    const rowNumber = tbody.children.length + 1;
    const row = document.createElement('tr');
    row.innerHTML = '<td>' + rowNumber + '</td>' +
        '<td><input type="text" name="produto_marca_' + rowNumber + '"></td>' +
        '<td><input type="text" name="produto_substancia_' + rowNumber + '"></td>' +
        '<td><input type="text" name="produto_fabricante_' + rowNumber + '"></td>' +
        '<td><input type="text" name="produto_finalidade_' + rowNumber + '"></td>' +
        '<td><input type="text" name="produto_culturas_' + rowNumber + '"></td>' +
        '<td><select name="produto_status_' + rowNumber + '">' +
        '<option value="">Selecione...</option>' +
        '<option value="JA_USA">Ja usa</option>' +
        '<option value="PRETENDE_USAR">Pretende usar</option></select></td>' +
        '<td><button type="button" onclick="removeTableRow(this)" class="btn-icon">X</button></td>';
    tbody.appendChild(row);
}

function addProdutoNaoCertificarRow() {
    const tbody = document.getElementById('tbody-produtos-nao-certificar');
    if (!tbody) return;
    const rowNumber = tbody.children.length + 1;
    const row = document.createElement('tr');
    row.innerHTML = '<td>' + rowNumber + '</td>' +
        '<td><input type="text" name="produto_nc_nome_' + rowNumber + '"></td>' +
        '<td><input type="text" name="produto_nc_variedade_' + rowNumber + '"></td>' +
        '<td><input type="text" name="produto_nc_talhao_' + rowNumber + '"></td>' +
        '<td><input type="text" name="produto_nc_origem_muda_' + rowNumber + '"></td>' +
        '<td><input type="text" name="produto_nc_origem_semente_' + rowNumber + '"></td>' +
        '<td><input type="text" name="produto_nc_tipo_cultivo_' + rowNumber + '"></td>' +
        '<td><input type="text" name="produto_nc_motivo_' + rowNumber + '"></td>' +
        '<td><button type="button" onclick="removeTableRow(this)" class="btn-icon">X</button></td>';
    tbody.appendChild(row);
}

function removeTableRow(button) {
    const row = button.closest('tr');
    if (row) row.remove();
}

function toggleConditional(fieldId, show) {
    const field = document.getElementById(fieldId);
    if (field) {
        if (show) {
            field.classList.add('show');
        } else {
            field.classList.remove('show');
        }
    }
}

function validateForm() {
    return AnexoVegetal.validateForm();
}

function saveForm() {
    return AnexoVegetal.saveForm(false);
}

function exportJSON() {
    return AnexoVegetal.exportJSON();
}

function exportPDF() {
    return AnexoVegetal.exportPDF();
}

document.addEventListener('DOMContentLoaded', function() {
    AnexoVegetal.init();
});
