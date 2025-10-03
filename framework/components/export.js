/**
 * PMO Export - Exportação de dados
 * Exporta PMO para PDF, JSON e CSV
 * @version 2.0
 */

class PMOExport {
  constructor() {
    this.pdfLib = null; // jsPDF será carregado via CDN
  }

  /**
   * Exporta dados para JSON
   */
  async exportJSON(data, filename = 'pmo-export.json') {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      this.downloadBlob(blob, filename);
      return true;
    } catch (error) {
      console.error('Erro ao exportar JSON:', error);
      throw error;
    }
  }

  /**
   * Exporta dados para CSV
   */
  async exportCSV(data, filename = 'pmo-export.csv') {
    try {
      // Se for array de objetos, converte para CSV
      if (Array.isArray(data)) {
        const csv = this.arrayToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadBlob(blob, filename);
        return true;
      }

      // Se for objeto único, converte para CSV
      if (typeof data === 'object') {
        const csv = this.objectToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadBlob(blob, filename);
        return true;
      }

      throw new Error('Formato de dados inválido para CSV');
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      throw error;
    }
  }

  /**
   * Exporta PMO para PDF
   */
  async exportPDF(data, options = {}) {
    try {
      // Verifica se jsPDF está disponível
      if (typeof window.jspdf === 'undefined') {
        throw new Error('Biblioteca jsPDF não carregada. Adicione o script CDN.');
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Configurações
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let currentY = margin;

      // Cabeçalho
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Plano de Manejo Orgânico (PMO)', margin, currentY);
      currentY += 10;

      // Subtítulo
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Associação de Agricultura Natural de Campinas e Região', margin, currentY);
      currentY += 10;

      // Data de geração
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, currentY);
      currentY += 15;

      // Renderiza conteúdo
      currentY = this.renderPMOContent(doc, data, margin, currentY, pageWidth, pageHeight);

      // Rodapé
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Salva PDF
      const filename = options.filename || `PMO_${Date.now()}.pdf`;
      doc.save(filename);

      return true;
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      throw error;
    }
  }

  /**
   * Renderiza conteúdo do PMO no PDF
   */
  renderPMOContent(doc, data, margin, startY, pageWidth, pageHeight) {
    let currentY = startY;
    const lineHeight = 7;
    const maxWidth = pageWidth - (margin * 2);

    // Helper para verificar se precisa de nova página
    const checkNewPage = (requiredSpace = 20) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }
    };

    // Renderiza seções
    const sections = [
      { key: 'pmo_principal', title: 'PMO Principal' },
      { key: 'fornecedores', title: 'Dados dos Fornecedores' },
      { key: 'empresa', title: 'Dados da Empresa/Produtor' },
      { key: 'endereco', title: 'Endereço da Unidade' },
      { key: 'historico', title: 'Histórico da Área' },
      { key: 'produtos', title: 'Lista de Produtos' },
      { key: 'comercializacao', title: 'Comercialização' },
      { key: 'anexo_vegetal', title: 'Anexo I - Produção Vegetal' },
      { key: 'anexo_animal', title: 'Anexo III - Produção Animal' }
    ];

    sections.forEach(section => {
      if (data[section.key]) {
        checkNewPage(30);

        // Título da seção
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(section.title, margin, currentY);
        currentY += lineHeight + 3;

        // Linha separadora
        doc.setLineWidth(0.5);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 5;

        // Conteúdo da seção
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        const sectionData = data[section.key];
        currentY = this.renderObject(doc, sectionData, margin, currentY, maxWidth, lineHeight, checkNewPage);

        currentY += 10;
      }
    });

    return currentY;
  }

  /**
   * Renderiza objeto no PDF
   */
  renderObject(doc, obj, x, y, maxWidth, lineHeight, checkNewPage) {
    let currentY = y;

    for (const [key, value] of Object.entries(obj)) {
      checkNewPage();

      // Formata chave (remove underscores e capitaliza)
      const label = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());

      // Renderiza baseado no tipo
      if (Array.isArray(value)) {
        doc.setFont(undefined, 'bold');
        doc.text(`${label}:`, x, currentY);
        currentY += lineHeight;

        doc.setFont(undefined, 'normal');
        value.forEach((item, index) => {
          checkNewPage();
          if (typeof item === 'object') {
            doc.text(`  ${index + 1}.`, x, currentY);
            currentY += lineHeight;
            currentY = this.renderObject(doc, item, x + 5, currentY, maxWidth - 5, lineHeight, checkNewPage);
          } else {
            doc.text(`  • ${item}`, x, currentY);
            currentY += lineHeight;
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        doc.setFont(undefined, 'bold');
        doc.text(`${label}:`, x, currentY);
        currentY += lineHeight;

        doc.setFont(undefined, 'normal');
        currentY = this.renderObject(doc, value, x + 5, currentY, maxWidth - 5, lineHeight, checkNewPage);
      } else {
        doc.setFont(undefined, 'bold');
        const text = `${label}: `;
        doc.text(text, x, currentY);

        doc.setFont(undefined, 'normal');
        const textWidth = doc.getTextWidth(text);
        const valueText = String(value || '-');
        const splitText = doc.splitTextToSize(valueText, maxWidth - textWidth);

        doc.text(splitText, x + textWidth, currentY);
        currentY += lineHeight * splitText.length;
      }
    }

    return currentY;
  }

  /**
   * Converte array de objetos para CSV
   */
  arrayToCSV(data) {
    if (data.length === 0) return '';

    // Extrai headers
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Adiciona headers
    csvRows.push(headers.join(','));

    // Adiciona linhas
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Converte objeto para CSV
   */
  objectToCSV(data) {
    const csvRows = ['Campo,Valor'];

    for (const [key, value] of Object.entries(data)) {
      const label = key.replace(/_/g, ' ');
      const escaped = String(value).replace(/"/g, '""');
      csvRows.push(`"${label}","${escaped}"`);
    }

    return csvRows.join('\n');
  }

  /**
   * Download de blob
   */
  downloadBlob(blob, filename) {
    // Cria link temporário
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Importa JSON
   */
  async importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Arquivo JSON inválido'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Cria backup completo
   */
  async createBackup(storage) {
    try {
      const data = await storage.exportAll();

      const backup = {
        version: '2.0',
        type: 'backup',
        timestamp: Date.now(),
        date: new Date().toISOString(),
        data: data
      };

      const filename = `PMO_Backup_${new Date().toISOString().split('T')[0]}.json`;
      await this.exportJSON(backup, filename);

      return true;
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      throw error;
    }
  }

  /**
   * Restaura backup
   */
  async restoreBackup(file, storage) {
    try {
      const backup = await this.importJSON(file);

      // Valida backup
      if (!backup.version || !backup.data) {
        throw new Error('Formato de backup inválido');
      }

      // Restaura dados
      const result = await storage.importAll(backup.data);

      return result;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw error;
    }
  }

  /**
   * Exporta HTML para impressão
   */
  printHTML(element) {
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PMO - Impressão</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #2c5282; }
          h2 { color: #4a5568; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
          th { background-color: #f7fafc; }
          @media print {
            body { print-color-adjust: exact; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  /**
   * Exporta PDF de Avaliação de Conformidade
   */
  async exportPDFAvaliacao(dadosAvaliacao, options = {}) {
    try {
      // Verifica se jsPDF está disponível
      if (typeof window.jspdf === 'undefined') {
        throw new Error('Biblioteca jsPDF não carregada. Adicione o script CDN.');
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Configurações
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Helper para verificar se precisa de nova página
      const checkNewPage = (requiredSpace = 20) => {
        if (currentY + requiredSpace > pageHeight - margin - 15) {
          doc.addPage();
          currentY = margin;
        }
      };

      // ============ CABEÇALHO ============
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('RELATÓRIO DE AVALIAÇÃO DE CONFORMIDADE', margin, currentY);
      currentY += 8;

      doc.setFontSize(14);
      doc.text('Plano de Manejo Orgânico (PMO)', margin, currentY);
      currentY += 12;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text('Associação de Agricultura Natural de Campinas e Região - ANC', margin, currentY);
      currentY += 6;
      doc.text(`Data da Avaliação: ${new Date().toLocaleDateString('pt-BR')}`, margin, currentY);
      currentY += 10;

      // Linha separadora
      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;

      // ============ DADOS DO PMO AVALIADO ============
      checkNewPage(40);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('1. DADOS DO PMO AVALIADO', margin, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const pmoData = dadosAvaliacao.pmo_avaliado?.dados || {};

      const dadosPMO = [
        { label: 'Produtor', value: pmoData.nome_fornecedor || pmoData.nome_completo || '-' },
        { label: 'CPF/CNPJ', value: pmoData.cpf || pmoData.cnpj || '-' },
        { label: 'Unidade de Produção', value: pmoData.nome_unidade_producao || '-' },
        { label: 'Grupo SPG', value: pmoData.grupo_spg || '-' },
        { label: 'Município/UF', value: `${pmoData.municipio || '-'} / ${pmoData.uf || '-'}` },
        { label: 'Data de Preenchimento', value: pmoData.data_preenchimento || '-' }
      ];

      dadosPMO.forEach(item => {
        doc.setFont(undefined, 'bold');
        doc.text(`${item.label}:`, margin, currentY);
        doc.setFont(undefined, 'normal');
        doc.text(item.value, margin + 55, currentY);
        currentY += 6;
      });

      currentY += 5;

      // ============ DADOS DO AVALIADOR ============
      checkNewPage(30);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('2. DADOS DO AVALIADOR', margin, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const avaliador = dadosAvaliacao.avaliador || {};

      const dadosAvaliador = [
        { label: 'Nome', value: avaliador.nome || '-' },
        { label: 'CPF', value: avaliador.cpf || '-' },
        { label: 'Cargo/Função', value: avaliador.cargo || '-' }
      ];

      dadosAvaliador.forEach(item => {
        doc.setFont(undefined, 'bold');
        doc.text(`${item.label}:`, margin, currentY);
        doc.setFont(undefined, 'normal');
        doc.text(item.value, margin + 35, currentY);
        currentY += 6;
      });

      if (avaliador.observacao_geral) {
        currentY += 2;
        doc.setFont(undefined, 'bold');
        doc.text('Observação Geral:', margin, currentY);
        currentY += 5;
        doc.setFont(undefined, 'normal');
        const splitObs = doc.splitTextToSize(avaliador.observacao_geral, maxWidth);
        doc.text(splitObs, margin, currentY);
        currentY += splitObs.length * 5;
      }

      currentY += 5;

      // ============ RESULTADO GERAL ============
      checkNewPage(35);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('3. RESULTADO GERAL DA AVALIAÇÃO', margin, currentY);
      currentY += 8;

      // Calcular conformidade
      const conformidades = Object.values(dadosAvaliacao.conformidade || {});
      const conformidadesValidas = conformidades.filter(c => c !== 'nao_aplicavel');

      let pontos = 0;
      conformidadesValidas.forEach(conf => {
        if (conf === 'conforme') pontos += 100;
        else if (conf === 'parcial') pontos += 50;
      });

      const conformidadePercentual = conformidadesValidas.length > 0
        ? Math.round(pontos / conformidadesValidas.length)
        : 0;

      // Box de resultado
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, currentY, maxWidth, 25, 'F');

      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(`CONFORMIDADE GERAL: ${conformidadePercentual}%`, margin + 5, currentY + 8);

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      let statusTexto = '';
      let statusCor = '';
      if (conformidadePercentual >= 80) {
        statusTexto = 'CONFORMIDADE EXCELENTE';
        statusCor = '#48bb78';
      } else if (conformidadePercentual >= 60) {
        statusTexto = 'CONFORMIDADE PARCIAL';
        statusCor = '#ed8936';
      } else {
        statusTexto = 'NÃO CONFORME';
        statusCor = '#f56565';
      }

      doc.text(`Status: ${statusTexto}`, margin + 5, currentY + 16);

      currentY += 30;

      // Estatísticas
      const totalSecoes = conformidades.length;
      const secoesConformes = conformidades.filter(c => c === 'conforme').length;
      const secoesParciais = conformidades.filter(c => c === 'parcial').length;
      const secoesNaoConformes = conformidades.filter(c => c === 'nao_conforme').length;
      const secoesNA = conformidades.filter(c => c === 'nao_aplicavel').length;

      doc.setFontSize(10);
      doc.text(`Total de Seções Avaliadas: ${totalSecoes}`, margin, currentY);
      currentY += 6;
      doc.text(`Conformes: ${secoesConformes} | Parciais: ${secoesParciais} | Não Conformes: ${secoesNaoConformes} | N/A: ${secoesNA}`, margin, currentY);
      currentY += 10;

      // ============ AVALIAÇÃO DETALHADA POR SEÇÃO ============
      checkNewPage(30);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('4. AVALIAÇÃO DETALHADA POR SEÇÃO', margin, currentY);
      currentY += 10;

      // Mapeamento de seções
      const secoes = dadosAvaliacao.secoes || {
        'identificacao': 'Identificação do Produtor',
        'endereco': 'Endereço e Localização',
        'historico': 'Histórico da Área',
        'apiarios': 'Apiários',
        'colmeias': 'Especificações das Colmeias',
        'origem_abelhas': 'Origem das Abelhas',
        'ceras': 'Ceras',
        'forrageamento': 'Área de Forrageamento',
        'floradas': 'Floradas',
        'areas_risco': 'Áreas de Risco',
        'alimentacao': 'Alimentação Artificial',
        'manejo': 'Manejo de Colmeias',
        'sanidade': 'Sanidade Apícola',
        'colheita': 'Colheita do Mel',
        'processamento': 'Processamento',
        'outros_produtos': 'Outros Produtos Apícolas',
        'producao_estimada': 'Produção Estimada'
      };

      Object.keys(secoes).forEach((secaoKey, index) => {
        checkNewPage(25);

        const secaoTitulo = secoes[secaoKey];
        const conformidade = dadosAvaliacao.conformidade?.[secaoKey] || 'pendente';
        const observacao = dadosAvaliacao.avaliacoes?.[secaoKey]?.observacao || '';

        // Número e título da seção
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${secaoTitulo}`, margin, currentY);
        currentY += 6;

        // Status de conformidade
        doc.setFontSize(10);
        let statusIcon = '';
        let statusLabel = '';

        switch(conformidade) {
          case 'conforme':
            statusIcon = '[✓]';
            statusLabel = 'CONFORME';
            break;
          case 'nao_conforme':
            statusIcon = '[✗]';
            statusLabel = 'NÃO CONFORME';
            break;
          case 'parcial':
            statusIcon = '[!]';
            statusLabel = 'PARCIALMENTE CONFORME';
            break;
          case 'nao_aplicavel':
            statusIcon = '[-]';
            statusLabel = 'NÃO APLICÁVEL';
            break;
          default:
            statusIcon = '[?]';
            statusLabel = 'PENDENTE';
        }

        doc.setFont(undefined, 'normal');
        doc.text(`Status: ${statusIcon} ${statusLabel}`, margin + 5, currentY);
        currentY += 6;

        // Observações
        if (observacao && observacao.trim()) {
          doc.setFont(undefined, 'bold');
          doc.text('Observações:', margin + 5, currentY);
          currentY += 5;

          doc.setFont(undefined, 'normal');
          const splitObs = doc.splitTextToSize(observacao, maxWidth - 10);
          doc.text(splitObs, margin + 5, currentY);
          currentY += splitObs.length * 5;
        } else {
          doc.setFont(undefined, 'italic');
          doc.text('Sem observações', margin + 5, currentY);
          currentY += 5;
        }

        currentY += 3;

        // Linha separadora entre seções
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 5;
      });

      // ============ CONCLUSÃO ============
      checkNewPage(30);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('5. CONCLUSÃO E RECOMENDAÇÕES', margin, currentY);
      currentY += 10;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      let conclusaoTexto = '';
      if (conformidadePercentual >= 80) {
        conclusaoTexto = 'O PMO avaliado demonstra conformidade excelente com os requisitos da produção orgânica. ' +
                         'As práticas adotadas estão alinhadas com as normas e diretrizes estabelecidas. ' +
                         'Recomenda-se manter os procedimentos atuais e continuar o monitoramento regular.';
      } else if (conformidadePercentual >= 60) {
        conclusaoTexto = 'O PMO avaliado apresenta conformidade parcial com os requisitos da produção orgânica. ' +
                         'Foram identificados pontos que necessitam de ajustes e melhorias. ' +
                         'Recomenda-se atenção às observações específicas e implementação das correções necessárias.';
      } else {
        conclusaoTexto = 'O PMO avaliado apresenta pendências significativas em relação aos requisitos da produção orgânica. ' +
                         'É necessário revisar e corrigir os pontos não conformes identificados. ' +
                         'Recomenda-se nova avaliação após as adequações.';
      }

      const splitConclusao = doc.splitTextToSize(conclusaoTexto, maxWidth);
      doc.text(splitConclusao, margin, currentY);
      currentY += splitConclusao.length * 5 + 10;

      // ============ ASSINATURA ============
      checkNewPage(40);
      currentY += 15;

      doc.line(margin + 20, currentY, margin + 70, currentY);
      currentY += 5;
      doc.setFontSize(9);
      doc.text('Assinatura do Avaliador', margin + 30, currentY);
      currentY += 3;
      doc.text(avaliador.nome || '', margin + 25, currentY);

      // ============ RODAPÉ EM TODAS AS PÁGINAS ============
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Relatório de Avaliação PMO - ANC | Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        doc.text(
          `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
          pageWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        );
      }

      // ============ SALVAR PDF ============
      const filename = options.filename ||
        `Avaliacao_PMO_${pmoData.nome_fornecedor || 'PMO'}_${new Date().toISOString().split('T')[0]}.pdf`;

      doc.save(filename);

      return true;
    } catch (error) {
      console.error('Erro ao exportar PDF de avaliação:', error);
      throw error;
    }
  }
}

// Instância singleton
const pmoExport = new PMOExport();

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.PMOExport = pmoExport;
}

export default pmoExport;
