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
}

// Instância singleton
const pmoExport = new PMOExport();

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.PMOExport = pmoExport;
}

export default pmoExport;
