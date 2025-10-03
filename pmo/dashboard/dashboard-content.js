/**
 * Conteúdo do Dashboard
 * Exibe resumo de progresso e estatísticas
 */

class DashboardContent {
    constructor() {
        this.init();
    }

    init() {
        this.renderContent();

        // Atualizar quando escopo ou progresso mudar
        window.addEventListener('pmo-scope-changed', () => this.renderContent());
        window.addEventListener('pmo-progress-changed', () => this.renderContent());

        // Atualizar a cada 10 segundos
        setInterval(() => this.renderContent(), 10000);
    }

    renderContent() {
        const container = document.getElementById('app-content');
        if (!container) return;

        if (!window.PMOScopeManager) {
            container.innerHTML = this.getLoadingHTML();
            return;
        }

        const enabledAnexos = window.PMOScopeManager.getEnabledAnexos();
        const allProgress = window.PMOScopeManager.getAllProgress();
        const overallProgress = window.PMOScopeManager.getOverallProgress();

        if (enabledAnexos.length === 0) {
            container.innerHTML = this.getNoScopeHTML();
        } else {
            container.innerHTML = this.getDashboardHTML(enabledAnexos, allProgress, overallProgress);
        }
    }

    getLoadingHTML() {
        return `
            <div style="text-align: center; padding: 4rem;">
                <div class="spinner" style="margin: 0 auto;"></div>
                <p style="margin-top: 1rem; color: var(--color-text-light);">Carregando...</p>
            </div>
        `;
    }

    getNoScopeHTML() {
        return `
            <div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
                <div style="background: white; border-radius: 1rem; padding: 3rem; text-align: center; box-shadow: var(--shadow-lg);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📋</div>
                    <h2 style="color: var(--color-primary); margin-bottom: 1rem;">
                        Bem-vindo ao PMO Digital!
                    </h2>
                    <p style="color: var(--color-text-light); margin-bottom: 2rem; font-size: 1.125rem;">
                        Para começar, você precisa preencher o PMO Principal e selecionar as atividades orgânicas que desenvolve.
                    </p>
                    <a href="../pmo-principal/index.html"
                       style="display: inline-block; background: var(--color-primary); color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: background 0.2s;">
                        📋 Preencher PMO Principal
                    </a>

                    <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--color-border);">
                        <h3 style="color: var(--color-text); margin-bottom: 1rem;">
                            Como funciona?
                        </h3>
                        <div style="text-align: left; max-width: 500px; margin: 0 auto;">
                            <ol style="color: var(--color-text-light); line-height: 2;">
                                <li>Preencha o <strong>PMO Principal</strong> com dados da sua propriedade</li>
                                <li>Marque as <strong>atividades orgânicas</strong> que você desenvolve (Seção 6)</li>
                                <li>O menu será <strong>automaticamente atualizado</strong> para mostrar apenas os anexos relevantes</li>
                                <li>Preencha os <strong>anexos habilitados</strong> e acompanhe seu progresso</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getDashboardHTML(enabledAnexos, allProgress, overallProgress) {
        const cards = enabledAnexos.map(anexoId => {
            const progress = allProgress[anexoId] || 0;
            const label = this.getAnexoLabel(anexoId);
            const emoji = this.getProgressEmoji(progress);
            const progressClass = this.getProgressClass(progress);
            const route = this.getAnexoRoute(anexoId);

            return `
                <div class="dashboard-card ${progressClass}" onclick="window.location.href='${route}'">
                    <div class="card-header">
                        <h3>${label}</h3>
                        <span class="card-emoji">${emoji}</span>
                    </div>
                    <div class="card-body">
                        <div class="progress-circle">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" class="progress-circle-bg"></circle>
                                <circle cx="50" cy="50" r="45" class="progress-circle-fill"
                                        style="stroke-dasharray: ${progress * 2.827}, 282.7"></circle>
                            </svg>
                            <div class="progress-percentage">${progress}%</div>
                        </div>
                        <p class="card-status">${this.getStatusText(progress)}</p>
                    </div>
                    <div class="card-footer">
                        <span>Clique para continuar →</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="dashboard-container">
                <!-- Header do Dashboard -->
                <div class="dashboard-header">
                    <h1>📊 Meu Progresso</h1>
                    <div class="overall-progress">
                        <div class="overall-progress-label">
                            Progresso Geral
                        </div>
                        <div class="overall-progress-bar-container">
                            <div class="overall-progress-bar" style="width: ${overallProgress}%"></div>
                        </div>
                        <div class="overall-progress-percentage">
                            ${overallProgress}%
                        </div>
                    </div>
                </div>

                <!-- Cards dos Anexos -->
                <div class="dashboard-grid">
                    ${cards}
                </div>

                <!-- Dicas -->
                <div class="dashboard-tips">
                    <h3>💡 Dicas</h3>
                    <ul>
                        <li>Campos obrigatórios estão marcados com <span style="color: red;">*</span></li>
                        <li>O progresso é salvo automaticamente a cada 30 segundos</li>
                        <li>Use o botão "Salvar Rascunho" para garantir que não perca seu trabalho</li>
                        <li>Você pode voltar e editar qualquer seção a qualquer momento</li>
                    </ul>
                </div>
            </div>

            <style>
                .dashboard-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .dashboard-header {
                    background: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: var(--shadow-md);
                    margin-bottom: 2rem;
                }

                .dashboard-header h1 {
                    color: var(--color-primary);
                    margin-bottom: 1.5rem;
                }

                .overall-progress {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .overall-progress-label {
                    font-weight: 600;
                    color: var(--color-text);
                    min-width: 150px;
                }

                .overall-progress-bar-container {
                    flex: 1;
                    height: 1.5rem;
                    background: var(--color-background);
                    border-radius: 9999px;
                    overflow: hidden;
                }

                .overall-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
                    transition: width 0.5s ease;
                    border-radius: 9999px;
                }

                .overall-progress-percentage {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: var(--color-primary);
                    min-width: 80px;
                    text-align: right;
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .dashboard-card {
                    background: white;
                    border-radius: 1rem;
                    box-shadow: var(--shadow-md);
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-left: 4px solid var(--color-primary);
                }

                .dashboard-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }

                .dashboard-card.progress-none { border-left-color: var(--gray-400); }
                .dashboard-card.progress-low { border-left-color: var(--error); }
                .dashboard-card.progress-medium { border-left-color: var(--warning); }
                .dashboard-card.progress-high { border-left-color: var(--info); }
                .dashboard-card.progress-complete { border-left-color: var(--success); }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .card-header h3 {
                    color: var(--color-text);
                    font-size: 1.125rem;
                    margin: 0;
                }

                .card-emoji {
                    font-size: 2rem;
                }

                .card-body {
                    text-align: center;
                    padding: 1rem 0;
                }

                .progress-circle {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 1rem;
                }

                .progress-circle svg {
                    width: 100%;
                    height: 100%;
                    transform: rotate(-90deg);
                }

                .progress-circle-bg {
                    fill: none;
                    stroke: var(--color-background);
                    stroke-width: 8;
                }

                .progress-circle-fill {
                    fill: none;
                    stroke: var(--color-primary);
                    stroke-width: 8;
                    stroke-linecap: round;
                    transition: stroke-dasharray 0.5s ease;
                }

                .dashboard-card.progress-none .progress-circle-fill { stroke: var(--gray-400); }
                .dashboard-card.progress-low .progress-circle-fill { stroke: var(--error); }
                .dashboard-card.progress-medium .progress-circle-fill { stroke: var(--warning); }
                .dashboard-card.progress-high .progress-circle-fill { stroke: var(--info); }
                .dashboard-card.progress-complete .progress-circle-fill { stroke: var(--success); }

                .progress-percentage {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: var(--color-text);
                }

                .card-status {
                    color: var(--color-text-light);
                    font-size: 0.875rem;
                    margin: 0;
                }

                .card-footer {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--color-border);
                    text-align: center;
                    color: var(--color-primary);
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .dashboard-tips {
                    background: var(--color-background);
                    padding: 1.5rem;
                    border-radius: 1rem;
                    border: 1px solid var(--color-border);
                }

                .dashboard-tips h3 {
                    color: var(--color-text);
                    margin-bottom: 1rem;
                }

                .dashboard-tips ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .dashboard-tips li {
                    padding: 0.5rem 0;
                    color: var(--color-text-light);
                    line-height: 1.6;
                }

                .dashboard-tips li::before {
                    content: '✓';
                    color: var(--color-success);
                    font-weight: bold;
                    margin-right: 0.5rem;
                }

                @media (max-width: 768px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }

                    .overall-progress {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .overall-progress-percentage {
                        text-align: center;
                    }
                }
            </style>
        `;
    }

    getAnexoLabel(anexoId) {
        const labels = {
            'anexo-vegetal': '🌱 Produção Vegetal',
            'anexo-animal': '🐄 Produção Animal',
            'anexo-cogumelo': '🍄 Cogumelos',
            'anexo-apicultura': '🐝 Apicultura',
            'anexo-processamento': '🏭 Processamento',
            'anexo-processamentominimo': '🥗 Proc. Mínimo'
        };
        return labels[anexoId] || anexoId;
    }

    getAnexoRoute(anexoId) {
        const routes = {
            'anexo-vegetal': '../anexo-vegetal/index.html',
            'anexo-animal': '../anexo-animal/index.html',
            'anexo-cogumelo': '../anexo-cogumelo/index.html',
            'anexo-apicultura': '../anexo-apicultura/index.html',
            'anexo-processamento': '../anexo-processamento/index.html',
            'anexo-processamentominimo': '../anexo-processamentominimo/index.html'
        };
        return routes[anexoId] || '#';
    }

    getProgressEmoji(progress) {
        if (progress === 0) return '⚪';
        if (progress < 34) return '🔴';
        if (progress < 67) return '🟡';
        if (progress < 100) return '🔵';
        return '✅';
    }

    getProgressClass(progress) {
        if (progress === 0) return 'progress-none';
        if (progress < 34) return 'progress-low';
        if (progress < 67) return 'progress-medium';
        if (progress < 100) return 'progress-high';
        return 'progress-complete';
    }

    getStatusText(progress) {
        if (progress === 0) return 'Não iniciado';
        if (progress < 34) return 'Iniciado';
        if (progress < 67) return 'Em andamento';
        if (progress < 100) return 'Quase completo';
        return 'Completo!';
    }
}

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
    new DashboardContent();
});

export default DashboardContent;
