// Export Module
// PMO Form - ANC

class FormExporter {
    constructor() {
        this.form = document.getElementById('pmo-form');
        this.setupExportButtons();
    }

    setupExportButtons() {
        // Export buttons event listeners are set up in the main HTML
        console.log('Export functionality initialized');
    }

    // Export form data as JSON
    exportJSON() {
        try {
            const formData = this.collectFormData();
            const jsonData = JSON.stringify(formData, null, 2);
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `PMO_2026_${timestamp}.json`;
            
            this.downloadFile(jsonData, filename, 'application/json');
            
            if (window.showSuccess) {
                window.showSuccess('Dados exportados em JSON com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao exportar JSON:', error);
            if (window.showError) {
                window.showError('Erro ao exportar dados: ' + error.message);
            }
        }
    }

    // Collect all form data including files
    collectFormData() {
        const data = {
            metadata: {
                exportDate: new Date().toISOString(),
                formVersion: '1.0',
                producer: 'ANC - Associação de Agricultura Natural de Campinas',
                type: 'Plano de Manejo Orgânico 2026'
            },
            sections: {}
        };

        // Section 1: Company Data
        data.sections.dadosEmpresa = {
            razaoSocial: this.getValue('razao_social'),
            nomeFantasia: this.getValue('nome_fantasia'),
            tipoDocumento: this.getRadioValue('tipo_documento'),
            documento: this.getValue('documento'),
            inscricaoEstadual: this.getValue('inscricao_estadual'),
            inscricaoMunicipal: this.getValue('inscricao_municipal'),
            areaTotal: this.getValue('area_total'),
            areaOrganica: this.getValue('area_organica'),
            situacaoPropriedade: this.getRadioValue('situacao_propriedade'),
            contratoValidade: this.getValue('contrato_validade'),
            coordenadas: {
                latitude: this.getValue('latitude'),
                longitude: this.getValue('longitude')
            }
        };

        // Section 2: Suppliers/Responsible parties
        data.sections.fornecedores = this.collectArrayData([
            'fornecedor_nome',
            'fornecedor_cpf',
            'fornecedor_nascimento',
            'fornecedor_funcao',
            'fornecedor_telefone',
            'fornecedor_email'
        ]);

        // Section 3: Address
        data.sections.endereco = {
            cep: this.getValue('cep'),
            endereco: this.getValue('endereco'),
            numero: this.getValue('numero'),
            complemento: this.getValue('complemento'),
            bairro: this.getValue('bairro'),
            cidade: this.getValue('cidade'),
            estado: this.getValue('estado')
        };

        // Section 4: History
        data.sections.historico = this.collectHistoryData();

        // Section 5: Sketch (file references only)
        data.sections.croqui = {
            arquivo: this.getFileInfo('croqui-file'),
            elementosObrigatorios: this.getCheckboxGroup('req-')
        };

        // Section 6: Products
        data.sections.produtos = this.collectArrayData([
            'produto_nome',
            'produto_talhao',
            'produto_qtd',
            'produto_unidade',
            'produto_periodo',
            'produto_peso',
            'produto_origem_muda',
            'produto_origem_semente',
            'produto_tipo_conv_trat',
            'produto_tipo_conv_sem',
            'produto_tipo_org'
        ]);

        // Section 7: Inputs
        data.sections.insumos = {
            fertilizantes: this.collectArrayData([
                'fert_nome', 'fert_ingrediente', 'fert_fabricante', 'fert_fornecedor',
                'fert_culturas', 'fert_frequencia', 'fert_certificado'
            ]),
            fitossanitarios: this.collectArrayData([
                'fito_nome', 'fito_ingrediente', 'fito_fabricante', 'fito_registro',
                'fito_pragas', 'fito_culturas', 'fito_frequencia', 'fito_certificado'
            ]),
            sementes: this.collectArrayData([
                'sem_variedade', 'sem_fornecedor', 'sem_tipo', 'sem_tratamento', 'sem_certificado'
            ]),
            substratos: this.collectArrayData([
                'sub_nome', 'sub_composicao', 'sub_fabricante', 'sub_finalidade',
                'sub_quantidade', 'sub_certificado'
            ])
        };

        // Section 8: Commercialization
        data.sections.comercializacao = {
            status: this.getRadioValue('status_comercializacao'),
            previsaoInicio: this.getValue('previsao_inicio_vendas'),
            plano: this.getValue('plano_comercializacao'),
            canais: {
                vendaDireta: this.getCheckboxValues(['venda_feira', 'venda_domicilio', 'venda_csa', 'venda_horeca', 'venda_outro_direto']),
                revenda: this.getCheckboxValues(['revenda_produtores_spg', 'revenda_pequeno_varejo', 'revenda_lojas_naturais', 'revenda_supermercado_bairro', 'revenda_rede_supermercado', 'revenda_atacadista', 'revenda_exportacao', 'revenda_distribuidores']),
                governamental: this.getCheckboxValues(['venda_paa_pnae'])
            },
            feiras: this.collectArrayData(['feira_nome', 'feira_local']),
            transporte: this.getValue('descricao_transporte'),
            rastreabilidade: {
                metodos: this.getCheckboxValues(['rastreabilidade_lote', 'rastreabilidade_data', 'rastreabilidade_talhao', 'rastreabilidade_nf']),
                descricao: this.getValue('descricao_rastreabilidade')
            }
        };

        return data;
    }

    // Helper methods for data collection
    getValue(name) {
        const element = this.form.querySelector(`[name="${name}"]`);
        return element ? element.value : '';
    }

    getRadioValue(name) {
        const element = this.form.querySelector(`[name="${name}"]:checked`);
        return element ? element.value : '';
    }

    getCheckboxValues(names) {
        return names.map(name => {
            const element = this.form.querySelector(`[name="${name}"]`);
            return {
                name: name,
                checked: element ? element.checked : false
            };
        });
    }

    getCheckboxGroup(prefix) {
        const checkboxes = this.form.querySelectorAll(`[id^="${prefix}"]`);
        const result = {};
        checkboxes.forEach(cb => {
            result[cb.id] = cb.checked;
        });
        return result;
    }

    collectArrayData(fieldNames) {
        const firstFieldElements = this.form.querySelectorAll(`[name="${fieldNames[0]}[]"]`);
        const data = [];
        
        firstFieldElements.forEach((element, index) => {
            const item = {};
            fieldNames.forEach(fieldName => {
                const elements = this.form.querySelectorAll(`[name="${fieldName}[]"]`);
                if (elements[index]) {
                    if (elements[index].type === 'checkbox') {
                        item[fieldName] = elements[index].checked;
                    } else {
                        item[fieldName] = elements[index].value;
                    }
                }
            });
            data.push(item);
        });
        
        return data;
    }

    collectHistoryData() {
        const history = {};
        for (let year = 2025; year >= 2015; year--) {
            const cultura = this.getValue(`cultura_${year}`);
            const area = this.getValue(`area_${year}`);
            const organico = this.form.querySelector(`[name="organico_${year}"]`)?.checked || false;
            const certificado = this.form.querySelector(`[name="certificado_${year}"]`)?.checked || false;
            const insumo = this.getValue(`insumo_${year}`);
            const dataInsumo = this.getValue(`data_insumo_${year}`);
            
            if (cultura || area || organico || certificado || insumo || dataInsumo) {
                history[year] = {
                    cultura,
                    area,
                    organico,
                    certificado,
                    ultimoInsumo: insumo,
                    dataInsumo
                };
            }
        }
        return history;
    }

    getFileInfo(inputId) {
        const input = document.getElementById(inputId);
        if (input && input.files.length > 0) {
            const file = input.files[0];
            return {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            };
        }
        return null;
    }

    // Download file helper
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    // Generate PDF using html2pdf library
    async generatePDF() {
        try {
            // Show loading message
            if (window.showInfo) {
                window.showInfo('Gerando PDF... Isso pode levar alguns segundos.');
            }

            // Check if html2pdf is available
            if (typeof html2pdf === 'undefined') {
                await this.loadHtml2PdfLibrary();
            }

            const element = this.createPrintableVersion();
            
            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: `PMO_2026_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    letterRendering: true
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'a4', 
                    orientation: 'portrait' 
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'],
                    before: '.page-break-before',
                    after: '.page-break-after'
                }
            };

            await html2pdf().set(opt).from(element).save();
            
            // Clean up
            document.body.removeChild(element);
            
            if (window.showSuccess) {
                window.showSuccess('PDF gerado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            if (window.showError) {
                window.showError('Erro ao gerar PDF: ' + error.message);
            }
        }
    }

    // Load html2pdf library dynamically
    loadHtml2PdfLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Create a printable version of the form
    createPrintableVersion() {
        const printElement = document.createElement('div');
        printElement.style.cssText = `
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 20mm;
            background: white;
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
        `;

        const formData = this.collectFormData();
        
        printElement.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2d5a27; padding-bottom: 20px;">
                <h1 style="color: #2d5a27; margin-bottom: 10px;">PLANO DE MANEJO ORGÂNICO - PMO 2026</h1>
                <h2 style="color: #2d5a27; font-size: 16px; margin: 0;">ANC - Associação de Agricultura Natural de Campinas</h2>
                <p style="margin-top: 10px; color: #666;">Sistema Participativo de Garantia da Qualidade Orgânica</p>
                <p style="margin-top: 5px; font-size: 10px; color: #666;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            </div>

            ${this.generatePDFSection('1. DADOS DA EMPRESA/UNIDADE DE PRODUÇÃO', formData.sections.dadosEmpresa)}
            
            <div class="page-break-before"></div>
            ${this.generatePDFSection('2. DADOS DOS FORNECEDORES/RESPONSÁVEIS', formData.sections.fornecedores, 'table')}
            
            ${this.generatePDFSection('3. ENDEREÇO DA PROPRIEDADE', formData.sections.endereco)}
            
            <div class="page-break-before"></div>
            ${this.generatePDFSection('4. HISTÓRICO DA ÁREA', formData.sections.historico, 'history')}
            
            <div class="page-break-before"></div>
            ${this.generatePDFSection('5. CROQUI DA PROPRIEDADE', formData.sections.croqui, 'croqui')}
            
            <div class="page-break-before"></div>
            ${this.generatePDFSection('6. LISTA DE PRODUTOS PARA CERTIFICAÇÃO', formData.sections.produtos, 'products')}
            
            <div class="page-break-before"></div>
            ${this.generatePDFSection('7. INSUMOS E PRODUTOS COMERCIAIS', formData.sections.insumos, 'inputs')}
            
            <div class="page-break-before"></div>
            ${this.generatePDFSection('8. COMERCIALIZAÇÃO', formData.sections.comercializacao, 'comercializacao')}
        `;

        printElement.style.position = 'absolute';
        printElement.style.left = '-9999px';
        document.body.appendChild(printElement);

        return printElement;
    }

    generatePDFSection(title, data, type = 'default') {
        let html = `<div style="margin-bottom: 30px;">
            <h2 style="color: #2d5a27; border-bottom: 2px solid #2d5a27; padding-bottom: 5px; margin-bottom: 15px;">${title}</h2>`;

        switch (type) {
            case 'table':
                html += this.generatePDFTable(data);
                break;
            case 'history':
                html += this.generatePDFHistory(data);
                break;
            case 'croqui':
                html += this.generatePDFCroqui(data);
                break;
            case 'products':
                html += this.generatePDFProducts(data);
                break;
            case 'inputs':
                html += this.generatePDFInputs(data);
                break;
            case 'comercializacao':
                html += this.generatePDFComercializacao(data);
                break;
            default:
                html += this.generatePDFDefault(data);
        }

        html += '</div>';
        return html;
    }

    generatePDFDefault(data) {
        let html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">';
        
        Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                html += `<div style="grid-column: 1 / -1;"><strong>${this.formatFieldName(key)}:</strong></div>`;
                Object.entries(value).forEach(([subKey, subValue]) => {
                    html += `<div><strong>${this.formatFieldName(subKey)}:</strong> ${subValue || 'Não informado'}</div>`;
                });
            } else {
                html += `<div><strong>${this.formatFieldName(key)}:</strong> ${value || 'Não informado'}</div>`;
            }
        });
        
        html += '</div>';
        return html;
    }

    generatePDFTable(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return '<p>Nenhum dado cadastrado.</p>';
        }

        let html = '<table style="width: 100%; border-collapse: collapse; font-size: 10px;">';
        
        // Header
        const headers = Object.keys(data[0]);
        html += '<thead><tr style="background-color: #2d5a27; color: white;">';
        headers.forEach(header => {
            html += `<th style="border: 1px solid #ccc; padding: 5px; text-align: left;">${this.formatFieldName(header)}</th>`;
        });
        html += '</tr></thead>';

        // Body
        html += '<tbody>';
        data.forEach((row, index) => {
            html += `<tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'};">`;
            headers.forEach(header => {
                const value = row[header];
                const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : (value || '-');
                html += `<td style="border: 1px solid #ccc; padding: 5px;">${displayValue}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';

        return html;
    }

    generatePDFHistory(data) {
        let html = '<table style="width: 100%; border-collapse: collapse; font-size: 10px;">';
        html += `<thead>
            <tr style="background-color: #2d5a27; color: white;">
                <th style="border: 1px solid #ccc; padding: 5px;">Ano</th>
                <th style="border: 1px solid #ccc; padding: 5px;">Cultura</th>
                <th style="border: 1px solid #ccc; padding: 5px;">Área (ha)</th>
                <th style="border: 1px solid #ccc; padding: 5px;">Orgânico</th>
                <th style="border: 1px solid #ccc; padding: 5px;">Certificado</th>
                <th style="border: 1px solid #ccc; padding: 5px;">Último Insumo</th>
                <th style="border: 1px solid #ccc; padding: 5px;">Data</th>
            </tr>
        </thead><tbody>`;

        for (let year = 2025; year >= 2015; year--) {
            const yearData = data[year] || {};
            html += `<tr style="background-color: ${(2025 - year) % 2 === 0 ? '#f9f9f9' : 'white'};">
                <td style="border: 1px solid #ccc; padding: 5px;">${year}</td>
                <td style="border: 1px solid #ccc; padding: 5px;">${yearData.cultura || '-'}</td>
                <td style="border: 1px solid #ccc; padding: 5px;">${yearData.area || '-'}</td>
                <td style="border: 1px solid #ccc; padding: 5px;">${yearData.organico ? 'Sim' : 'Não'}</td>
                <td style="border: 1px solid #ccc; padding: 5px;">${yearData.certificado ? 'Sim' : 'Não'}</td>
                <td style="border: 1px solid #ccc; padding: 5px;">${yearData.ultimoInsumo || '-'}</td>
                <td style="border: 1px solid #ccc; padding: 5px;">${yearData.dataInsumo || '-'}</td>
            </tr>`;
        }

        html += '</tbody></table>';
        return html;
    }

    generatePDFCroqui(data) {
        let html = '<div>';
        
        if (data.arquivo) {
            html += `<p><strong>Arquivo:</strong> ${data.arquivo.name} (${this.formatFileSize(data.arquivo.size)})</p>`;
        } else {
            html += '<p><em>Nenhum arquivo de croqui anexado</em></p>';
        }

        html += '<div style="margin-top: 15px;"><strong>Elementos obrigatórios identificados:</strong><ul style="columns: 2; column-gap: 20px;">';
        
        Object.entries(data.elementosObrigatorios || {}).forEach(([key, checked]) => {
            const elementName = this.formatRequirementName(key);
            html += `<li style="margin-bottom: 5px;">${checked ? '✅' : '❌'} ${elementName}</li>`;
        });
        
        html += '</ul></div></div>';
        return html;
    }

    generatePDFProducts(data) {
        return this.generatePDFTable(data);
    }

    generatePDFInputs(data) {
        let html = '';
        
        ['fertilizantes', 'fitossanitarios', 'sementes', 'substratos'].forEach(category => {
            const categoryData = data[category];
            if (categoryData && categoryData.length > 0) {
                html += `<h3 style="color: #2d5a27; margin-top: 20px; margin-bottom: 10px;">${this.formatFieldName(category)}</h3>`;
                html += this.generatePDFTable(categoryData);
            }
        });
        
        return html || '<p>Nenhum insumo cadastrado.</p>';
    }

    generatePDFComercializacao(data) {
        let html = `<div>
            <p><strong>Status:</strong> ${data.status === 'ja_comercializo' ? 'Já comercializa' : 'Ainda não comercializa'}</p>`;
        
        if (data.status === 'ainda_nao') {
            html += `<p><strong>Previsão de Início:</strong> ${data.previsaoInicio || 'Não informado'}</p>
                     <p><strong>Plano:</strong> ${data.plano || 'Não informado'}</p>`;
        } else {
            html += '<div style="margin-top: 15px;"><strong>Canais de Comercialização:</strong>';
            
            ['vendaDireta', 'revenda', 'governamental'].forEach(tipo => {
                const canais = data.canais[tipo];
                if (canais && canais.some(c => c.checked)) {
                    html += `<div style="margin-top: 10px;"><em>${this.formatFieldName(tipo)}:</em><ul>`;
                    canais.filter(c => c.checked).forEach(canal => {
                        html += `<li>${this.formatFieldName(canal.name)}</li>`;
                    });
                    html += '</ul></div>';
                }
            });
            
            html += '</div>';
        }
        
        html += `<div style="margin-top: 15px;">
            <p><strong>Transporte:</strong> ${data.transporte || 'Não informado'}</p>
            <p><strong>Rastreabilidade:</strong> ${data.rastreabilidade.descricao || 'Não informado'}</p>
        </div></div>`;
        
        return html;
    }

    // Helper methods
    formatFieldName(fieldName) {
        const translations = {
            'razaoSocial': 'Razão Social',
            'nomeFantasia': 'Nome Fantasia',
            'tipoDocumento': 'Tipo de Documento',
            'documento': 'CPF/CNPJ',
            'inscricaoEstadual': 'Inscrição Estadual',
            'inscricaoMunicipal': 'Inscrição Municipal',
            'areaTotal': 'Área Total (ha)',
            'areaOrganica': 'Área Orgânica (ha)',
            'situacaoPropriedade': 'Situação da Propriedade',
            'contratoValidade': 'Validade do Contrato',
            'latitude': 'Latitude',
            'longitude': 'Longitude',
            'fornecedor_nome': 'Nome',
            'fornecedor_cpf': 'CPF',
            'fornecedor_nascimento': 'Nascimento',
            'fornecedor_funcao': 'Função',
            'fornecedor_telefone': 'Telefone',
            'fornecedor_email': 'Email',
            'cep': 'CEP',
            'endereco': 'Endereço',
            'numero': 'Número',
            'complemento': 'Complemento',
            'bairro': 'Bairro',
            'cidade': 'Cidade',
            'estado': 'Estado',
            'produto_nome': 'Produto',
            'produto_talhao': 'Talhão',
            'produto_qtd': 'Quantidade',
            'produto_unidade': 'Unidade',
            'produto_periodo': 'Período',
            'produto_peso': 'Peso (kg)',
            'produto_origem_muda': 'Origem Muda',
            'produto_origem_semente': 'Origem Semente',
            'fertilizantes': 'Fertilizantes',
            'fitossanitarios': 'Fitossanitários',
            'sementes': 'Sementes/Mudas',
            'substratos': 'Substratos',
            'vendaDireta': 'Venda Direta',
            'revenda': 'Revenda',
            'governamental': 'Venda Governamental'
        };
        
        return translations[fieldName] || fieldName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
    }

    formatRequirementName(key) {
        const requirements = {
            'req-entrada': 'Entrada da propriedade',
            'req-casa': 'Casa/Residência',
            'req-armazens': 'Armazéns e galpões',
            'req-insumos': 'Local de guarda de insumos',
            'req-rios': 'Rios e cursos d\'água',
            'req-plantio': 'Áreas de plantio',
            'req-barreiras': 'Barreiras vegetais',
            'req-perenes': 'Culturas perenes',
            'req-processamento': 'Locais de processamento',
            'req-composteira': 'Composteira',
            'req-estradas': 'Estradas',
            'req-mata': 'Áreas de mata',
            'req-animais': 'Instalações animais',
            'req-vizinhos': 'Vizinhos confrontantes'
        };
        
        return requirements[key] || key;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Global export functions
function exportJSON() {
    if (!window.formExporter) {
        window.formExporter = new FormExporter();
    }
    window.formExporter.exportJSON();
}

function generatePDF() {
    if (!window.formExporter) {
        window.formExporter = new FormExporter();
    }
    window.formExporter.generatePDF();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.formExporter = new FormExporter();
});