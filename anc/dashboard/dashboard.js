/**
 * Dashboard Module - Página inicial do sistema PMO
 * @version 2.0
 */

import { PMOModule } from '../../framework/core/pmo-framework.js';

class Dashboard extends PMOModule {
  constructor(framework) {
    super(framework);
    this.pmos = [];
    this.stats = {
      total: 0,
      completos: 0,
      emAndamento: 0,
      progresso: 0
    };
  }

  async render() {
    // Carrega dados
    await this.loadData();

    // Renderiza HTML
    this.container.innerHTML = `
      <div class="dashboard">
        <h1 class="page-title">Dashboard PMO</h1>
        <p class="page-subtitle">Sistema de Planos de Manejo Orgânico - ANC</p>

        <!-- Cards de Resumo -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <h3 class="stat-value">${this.stats.total}</h3>
              <p class="stat-label">PMOs Totais</p>
            </div>
          </div>

          <div class="stat-card stat-card-success">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <h3 class="stat-value">${this.stats.completos}</h3>
              <p class="stat-label">Completos</p>
            </div>
          </div>

          <div class="stat-card stat-card-warning">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <h3 class="stat-value">${this.stats.emAndamento}</h3>
              <p class="stat-label">Em Andamento</p>
            </div>
          </div>

          <div class="stat-card stat-card-info">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3 class="stat-value">${this.stats.progresso}%</h3>
              <p class="stat-label">Progresso Médio</p>
            </div>
          </div>
        </div>

        <!-- Ações Rápidas -->
        <div class="section">
          <h2 class="section-title">Ações Rápidas</h2>
          <div class="actions-grid">
            <button class="action-btn action-btn-primary" data-action="novo-pmo">
              <span class="action-icon">➕</span>
              <span class="action-label">Novo PMO</span>
            </button>

            <button class="action-btn action-btn-secondary" data-action="importar">
              <span class="action-icon">📁</span>
              <span class="action-label">Importar PMO</span>
            </button>

            <button class="action-btn action-btn-secondary" data-action="exportar-todos">
              <span class="action-icon">💾</span>
              <span class="action-label">Exportar Todos</span>
            </button>

            <button class="action-btn action-btn-secondary" data-action="backup">
              <span class="action-icon">🔒</span>
              <span class="action-label">Backup Completo</span>
            </button>
          </div>
        </div>

        <!-- Escopos de Produção -->
        <div class="section">
          <h2 class="section-title">🌱 Escopos de Produção</h2>
          <div class="scopes-grid">
            <div class="scope-card" data-scope="vegetal">
              <div class="scope-header">
                <span class="scope-icon">🌱</span>
                <h3>Produção Vegetal</h3>
              </div>
              <p class="scope-description">Cultivo de hortaliças, frutas, grãos e plantas orgânicas</p>
              <button class="btn btn-primary" data-navigate="/anexo-vegetal">Acessar</button>
            </div>

            <div class="scope-card" data-scope="animal">
              <div class="scope-header">
                <span class="scope-icon">🐄</span>
                <h3>Produção Animal</h3>
              </div>
              <p class="scope-description">Criação de animais para produção orgânica</p>
              <button class="btn btn-primary" data-navigate="/anexo-animal">Acessar</button>
            </div>

            <div class="scope-card" data-scope="cogumelos">
              <div class="scope-header">
                <span class="scope-icon">🍄</span>
                <h3>Cogumelos</h3>
              </div>
              <p class="scope-description">Cultivo de cogumelos comestíveis orgânicos</p>
              <button class="btn btn-primary" data-navigate="/anexo-cogumelos">Acessar</button>
            </div>

            <div class="scope-card" data-scope="apicultura">
              <div class="scope-header">
                <span class="scope-icon">🐝</span>
                <h3>Apicultura</h3>
              </div>
              <p class="scope-description">Produção de mel e derivados orgânicos</p>
              <button class="btn btn-primary" data-navigate="/anexo-apicultura">Acessar</button>
            </div>
          </div>
        </div>

        <!-- Escopos de Processamento -->
        <div class="section">
          <h2 class="section-title">🏭 Escopos de Processamento</h2>
          <div class="scopes-grid">
            <div class="scope-card" data-scope="processamento-completo">
              <div class="scope-header">
                <span class="scope-icon">🏭</span>
                <h3>Processamento Completo</h3>
              </div>
              <p class="scope-description">Transformação industrial de produtos orgânicos</p>
              <button class="btn btn-primary" data-navigate="/processamento-completo">Acessar</button>
            </div>

            <div class="scope-card" data-scope="processamento-minimo">
              <div class="scope-header">
                <span class="scope-icon">🔪</span>
                <h3>Processamento Mínimo</h3>
              </div>
              <p class="scope-description">Beneficiamento simples (limpeza, corte, embalagem)</p>
              <button class="btn btn-primary" data-navigate="/processamento-minimo">Acessar</button>
            </div>
          </div>
        </div>

        <!-- Lista de PMOs -->
        <div class="section">
          <h2 class="section-title">PMOs Recentes</h2>
          <div class="pmo-list" id="pmo-list">
            ${this.renderPMOList()}
          </div>
        </div>

        <!-- Informações do Sistema -->
        <div class="section">
          <div class="info-box">
            <h3>ℹ️ Sobre o Sistema PMO</h3>
            <p>Sistema de gerenciamento de Planos de Manejo Orgânico conforme legislação MAPA (Portaria 52/2021).</p>

            <h4>📋 Estrutura do PMO:</h4>
            <ul>
              <li><strong>PMO Principal:</strong> Formulário base obrigatório para todos os produtores</li>
              <li><strong>Anexos de Produção:</strong> Vegetal, Animal, Cogumelos, Apicultura</li>
              <li><strong>Anexos de Processamento:</strong> Completo ou Mínimo</li>
              <li><strong>Relatórios:</strong> Exportação em PDF, JSON ou CSV</li>
            </ul>

            <h4>💾 Funcionalidades:</h4>
            <ul>
              <li>✅ Validação automática de campos (CPF, CNPJ, CEP)</li>
              <li>✅ Auto-save a cada 30 segundos</li>
              <li>✅ Integração com ViaCEP e BrasilAPI</li>
              <li>✅ Armazenamento local (localStorage/IndexedDB)</li>
              <li>✅ Exportação para PDF, JSON e CSV</li>
              <li>✅ Sistema 100% offline-first</li>
            </ul>

            <h4>📚 Legislação:</h4>
            <ul>
              <li>Lei 10.831/2003 - Lei de Orgânicos</li>
              <li>Portaria 52/2021 - Normas para PMO</li>
              <li>IN 19/2011 - Rastreabilidade</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // CSS inline
    this.injectStyles();

    // Event listeners
    this.attachEventListeners();
  }

  async loadData() {
    try {
      const storage = window.storage;
      if (!storage) {
        console.warn('Storage não inicializado');
        return;
      }

      const keys = await storage.listKeys();
      this.pmos = [];

      for (const key of keys) {
        if (key.startsWith('pmo_')) {
          const data = await storage.load(key);
          if (data) {
            this.pmos.push({
              id: key,
              ...data
            });
          }
        }
      }

      // Calcula estatísticas
      this.stats = {
        total: this.pmos.length,
        completos: this.pmos.filter(p => (p.progresso || 0) >= 100).length,
        emAndamento: this.pmos.filter(p => (p.progresso || 0) < 100).length,
        progresso: this.pmos.length > 0
          ? Math.round(this.pmos.reduce((acc, p) => acc + (p.progresso || 0), 0) / this.pmos.length)
          : 0
      };
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.stats = { total: 0, completos: 0, emAndamento: 0, progresso: 0 };
    }
  }

  renderPMOList() {
    if (this.pmos.length === 0) {
      return `
        <div class="empty-state">
          <p>📋 Nenhum PMO cadastrado</p>
          <p>Clique em "Novo PMO" para começar</p>
        </div>
      `;
    }

    const sortedPMOs = [...this.pmos].sort((a, b) => {
      const dateA = new Date(a.ultima_atualizacao || 0);
      const dateB = new Date(b.ultima_atualizacao || 0);
      return dateB - dateA;
    });

    return sortedPMOs.slice(0, 5).map(pmo => `
      <div class="pmo-item" data-id="${pmo.id}">
        <div class="pmo-info">
          <h4 class="pmo-title">${pmo.empresa?.razao_social || pmo.empresa?.nome || 'PMO sem nome'}</h4>
          <p class="pmo-meta">
            ${pmo.empresa?.cnpj || pmo.empresa?.cpf || 'Sem documento'}
            ${pmo.ultima_atualizacao ? ` • ${new Date(pmo.ultima_atualizacao).toLocaleDateString('pt-BR')}` : ''}
          </p>
        </div>
        <div class="pmo-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${pmo.progresso || 0}%"></div>
          </div>
          <span class="progress-label">${pmo.progresso || 0}%</span>
        </div>
        <div class="pmo-actions">
          <button class="btn-icon" data-action="editar" data-id="${pmo.id}" title="Editar">✏️</button>
          <button class="btn-icon" data-action="exportar" data-id="${pmo.id}" title="Exportar">💾</button>
          <button class="btn-icon" data-action="excluir" data-id="${pmo.id}" title="Excluir">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  attachEventListeners() {
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        await this.handleAction(action, e.currentTarget);
      });
    });
  }

  async handleAction(action, button) {
    const id = button.getAttribute('data-id');

    switch (action) {
      case 'novo-pmo':
        this.framework.navigate('/pmo-principal');
        break;

      case 'importar':
        await this.importPMO();
        break;

      case 'exportar-todos':
        await this.exportAll();
        break;

      case 'exportar':
        if (id) await this.exportPMO(id);
        break;

      case 'backup':
        await this.createBackup();
        break;

      case 'editar':
        if (id) this.editPMO(id);
        break;

      case 'excluir':
        if (id) await this.deletePMO(id);
        break;
    }
  }

  async importPMO() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const data = await window.PMOExport.importJSON(file);
          alert('PMO importado com sucesso!');
          await this.render();
        } catch (error) {
          alert('Erro ao importar: ' + error.message);
        }
      }
    };

    input.click();
  }

  async exportPMO(id) {
    try {
      const storage = window.storage;
      const data = await storage.load(id);
      await window.PMOExport.exportJSON(data, `PMO_${id}.json`);
    } catch (error) {
      alert('Erro ao exportar: ' + error.message);
    }
  }

  async exportAll() {
    try {
      const storage = window.storage;
      const data = await storage.exportAll();
      await window.PMOExport.exportJSON(data, 'PMO_TodosOsDados.json');
    } catch (error) {
      alert('Erro ao exportar: ' + error.message);
    }
  }

  async createBackup() {
    try {
      const storage = window.storage;
      await window.PMOExport.createBackup(storage);
      alert('Backup criado com sucesso!');
    } catch (error) {
      alert('Erro ao criar backup: ' + error.message);
    }
  }

  editPMO(id) {
    alert('Edição será implementada em breve');
  }

  async deletePMO(id) {
    if (!confirm('Tem certeza que deseja excluir este PMO?')) return;

    try {
      const storage = window.storage;
      await storage.remove(id);
      alert('PMO excluído!');
      await this.render();
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  }

  injectStyles() {
    if (document.getElementById('dashboard-styles')) return;

    const style = document.createElement('style');
    style.id = 'dashboard-styles';
    style.textContent = `
      .page-title { font-size: 2rem; margin-bottom: 0.5rem; }
      .page-subtitle { color: var(--gray-600); margin-bottom: 2rem; }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
      .stat-card { background: white; padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1rem; }
      .stat-card-success { border-left: 4px solid var(--success); }
      .stat-card-warning { border-left: 4px solid var(--warning); }
      .stat-card-info { border-left: 4px solid var(--info); }
      .stat-icon { font-size: 2.5rem; }
      .stat-value { font-size: 2rem; font-weight: bold; margin: 0; }
      .stat-label { color: var(--gray-600); margin: 0; }
      .section { background: white; padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); margin-bottom: 1.5rem; }
      .section-title { font-size: 1.5rem; margin-bottom: 1rem; }
      .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
      .action-btn { padding: 1rem; border: none; border-radius: var(--radius-md); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; transition: all 0.2s; }
      .action-btn-primary { background: var(--primary); color: white; }
      .action-btn-secondary { background: var(--gray-100); color: var(--gray-700); }
      .action-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
      .action-icon { font-size: 2rem; }
      .action-label { font-weight: 600; }
      .scopes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
      .scope-card { background: var(--gray-50); padding: 1.5rem; border-radius: var(--radius-lg); border: 2px solid var(--gray-200); transition: all 0.2s; }
      .scope-card:hover { border-color: var(--primary); box-shadow: var(--shadow-md); }
      .scope-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
      .scope-icon { font-size: 2rem; }
      .scope-header h3 { margin: 0; font-size: 1.25rem; }
      .scope-description { color: var(--gray-600); margin-bottom: 1rem; font-size: 0.875rem; }
      .pmo-list { display: flex; flex-direction: column; gap: 1rem; }
      .pmo-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--gray-50); border-radius: var(--radius-md); }
      .pmo-info { flex: 1; }
      .pmo-title { margin: 0; font-size: 1.125rem; }
      .pmo-meta { margin: 0; color: var(--gray-600); font-size: 0.875rem; }
      .pmo-progress { width: 200px; display: flex; align-items: center; gap: 0.5rem; }
      .progress-bar { flex: 1; height: 8px; background: var(--gray-200); border-radius: 4px; overflow: hidden; }
      .progress-fill { height: 100%; background: var(--success); transition: width 0.3s; }
      .progress-label { font-size: 0.875rem; font-weight: 600; }
      .pmo-actions { display: flex; gap: 0.5rem; }
      .btn-icon { background: none; border: none; font-size: 1.25rem; cursor: pointer; padding: 0.5rem; border-radius: var(--radius-md); }
      .btn-icon:hover { background: var(--gray-200); }
      .empty-state { text-align: center; padding: 3rem; color: var(--gray-600); }
      .info-box { background: var(--gray-50); padding: 1.5rem; border-radius: var(--radius-lg); }
      .info-box h3, .info-box h4 { margin-top: 1rem; margin-bottom: 0.5rem; }
      .info-box h3:first-child { margin-top: 0; }
      .info-box ul { margin: 0.5rem 0 1rem 1.5rem; }
      .info-box li { margin-bottom: 0.25rem; }
    `;
    document.head.appendChild(style);
  }
}

export default Dashboard;
