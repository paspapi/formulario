/**
 * Sistema de Armazenamento de Avaliações PMO
 * Gerencia avaliações de conformidade no localStorage
 * @version 1.0.0
 * @author ANC - Sistema PMO
 */

const AvaliacaoStorage = {
    // Chaves de storage
    STORAGE_KEY: 'pmo_avaliacoes',
    ACTIVE_KEY: 'pmo_avaliacao_ativa',

    /**
     * Inicializar storage
     */
    init() {
        if (!this.getStorage()) {
            this.setStorage([]);
        }
    },

    /**
     * Obter storage
     */
    getStorage() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao ler storage de avaliações:', error);
            return null;
        }
    },

    /**
     * Salvar storage
     */
    setStorage(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar storage de avaliações:', error);
            return false;
        }
    },

    /**
     * Salvar avaliação
     */
    salvarAvaliacao(avaliacao) {
        try {
            const avaliacoes = this.getStorage() || [];

            // Verificar se já existe
            const index = avaliacoes.findIndex(a => a.id_avaliacao === avaliacao.id_avaliacao);

            if (index >= 0) {
                // Atualizar existente
                avaliacoes[index] = {
                    ...avaliacoes[index],
                    ...avaliacao,
                    data_ultima_modificacao: new Date().toISOString()
                };
            } else {
                // Criar nova
                avaliacoes.push({
                    ...avaliacao,
                    data_criacao: new Date().toISOString(),
                    data_ultima_modificacao: new Date().toISOString()
                });
            }

            return this.setStorage(avaliacoes);
        } catch (error) {
            console.error('Erro ao salvar avaliação:', error);
            return false;
        }
    },

    /**
     * Obter avaliação por ID
     */
    getAvaliacao(id_avaliacao) {
        try {
            const avaliacoes = this.getStorage() || [];
            return avaliacoes.find(a => a.id_avaliacao === id_avaliacao) || null;
        } catch (error) {
            console.error('Erro ao obter avaliação:', error);
            return null;
        }
    },

    /**
     * Listar todas as avaliações
     */
    listarAvaliacoes() {
        try {
            const avaliacoes = this.getStorage() || [];

            // Ordenar por data de modificação (mais recentes primeiro)
            return avaliacoes.sort((a, b) => {
                const dateA = new Date(a.data_ultima_modificacao || a.data_criacao);
                const dateB = new Date(b.data_ultima_modificacao || b.data_criacao);
                return dateB - dateA;
            });
        } catch (error) {
            console.error('Erro ao listar avaliações:', error);
            return [];
        }
    },

    /**
     * Deletar avaliação
     */
    deletarAvaliacao(id_avaliacao) {
        try {
            const avaliacoes = this.getStorage() || [];
            const filtradas = avaliacoes.filter(a => a.id_avaliacao !== id_avaliacao);

            return this.setStorage(filtradas);
        } catch (error) {
            console.error('Erro ao deletar avaliação:', error);
            return false;
        }
    },

    /**
     * Definir avaliação ativa
     */
    setAvaliacaoAtiva(id_avaliacao) {
        try {
            localStorage.setItem(this.ACTIVE_KEY, id_avaliacao);
            return true;
        } catch (error) {
            console.error('Erro ao definir avaliação ativa:', error);
            return false;
        }
    },

    /**
     * Obter avaliação ativa
     */
    getAvaliacaoAtiva() {
        try {
            return localStorage.getItem(this.ACTIVE_KEY);
        } catch (error) {
            console.error('Erro ao obter avaliação ativa:', error);
            return null;
        }
    },

    /**
     * Limpar avaliação ativa
     */
    clearAvaliacaoAtiva() {
        try {
            localStorage.removeItem(this.ACTIVE_KEY);
            return true;
        } catch (error) {
            console.error('Erro ao limpar avaliação ativa:', error);
            return false;
        }
    },

    /**
     * Obter avaliações por status
     */
    getAvaliacoesPorStatus(status) {
        try {
            const avaliacoes = this.listarAvaliacoes();
            return avaliacoes.filter(a => a.status === status);
        } catch (error) {
            console.error('Erro ao filtrar avaliações por status:', error);
            return [];
        }
    },

    /**
     * Obter avaliações por PMO (CPF/CNPJ)
     */
    getAvaliacoesPorPMO(cpf_cnpj) {
        try {
            const avaliacoes = this.listarAvaliacoes();
            return avaliacoes.filter(a => {
                const dados = a.pmo_avaliado?.dados;
                return dados && (dados.cpf === cpf_cnpj || dados.cnpj === cpf_cnpj);
            });
        } catch (error) {
            console.error('Erro ao filtrar avaliações por PMO:', error);
            return [];
        }
    },

    /**
     * Obter avaliações por avaliador
     */
    getAvaliacoesPorAvaliador(cpf_avaliador) {
        try {
            const avaliacoes = this.listarAvaliacoes();
            return avaliacoes.filter(a => a.avaliador?.cpf === cpf_avaliador);
        } catch (error) {
            console.error('Erro ao filtrar avaliações por avaliador:', error);
            return [];
        }
    },

    /**
     * Exportar todas as avaliações
     */
    exportarTodas() {
        try {
            return {
                version: '1.0',
                type: 'avaliacoes_pmo',
                timestamp: Date.now(),
                date: new Date().toISOString(),
                avaliacoes: this.getStorage() || []
            };
        } catch (error) {
            console.error('Erro ao exportar avaliações:', error);
            return null;
        }
    },

    /**
     * Importar avaliações
     */
    importarAvaliacoes(data) {
        try {
            if (!data || !data.avaliacoes || !Array.isArray(data.avaliacoes)) {
                throw new Error('Formato de dados inválido');
            }

            const avaliacoesExistentes = this.getStorage() || [];

            // Mesclar avaliações (evitar duplicatas)
            const novasAvaliacoes = data.avaliacoes.filter(nova => {
                return !avaliacoesExistentes.some(existente =>
                    existente.id_avaliacao === nova.id_avaliacao
                );
            });

            const mescladas = [...avaliacoesExistentes, ...novasAvaliacoes];

            return this.setStorage(mescladas);
        } catch (error) {
            console.error('Erro ao importar avaliações:', error);
            return false;
        }
    },

    /**
     * Limpar todas as avaliações
     */
    limparTodas() {
        try {
            this.setStorage([]);
            this.clearAvaliacaoAtiva();
            return true;
        } catch (error) {
            console.error('Erro ao limpar avaliações:', error);
            return false;
        }
    },

    /**
     * Obter estatísticas
     */
    getEstatisticas() {
        try {
            const avaliacoes = this.listarAvaliacoes();

            const total = avaliacoes.length;
            const concluidas = avaliacoes.filter(a => a.status === 'concluida').length;
            const emAndamento = avaliacoes.filter(a => a.status === 'em_andamento').length;

            // Calcular média de conformidade (apenas das concluídas)
            const avaliacoesComScore = avaliacoes.filter(a => {
                if (a.status !== 'concluida' || !a.conformidade) return false;

                const conformidades = Object.values(a.conformidade);
                const validas = conformidades.filter(c => c !== 'nao_aplicavel');

                return validas.length > 0;
            });

            let mediaConformidade = 0;
            if (avaliacoesComScore.length > 0) {
                const somaScores = avaliacoesComScore.reduce((acc, aval) => {
                    const conformidades = Object.values(aval.conformidade);
                    const validas = conformidades.filter(c => c !== 'nao_aplicavel');

                    let pontos = 0;
                    validas.forEach(conf => {
                        if (conf === 'conforme') pontos += 100;
                        else if (conf === 'parcial') pontos += 50;
                    });

                    const score = validas.length > 0 ? pontos / validas.length : 0;
                    return acc + score;
                }, 0);

                mediaConformidade = Math.round(somaScores / avaliacoesComScore.length);
            }

            return {
                total,
                concluidas,
                emAndamento,
                mediaConformidade
            };
        } catch (error) {
            console.error('Erro ao calcular estatísticas:', error);
            return {
                total: 0,
                concluidas: 0,
                emAndamento: 0,
                mediaConformidade: 0
            };
        }
    },

    /**
     * Validar estrutura de avaliação
     */
    validarAvaliacao(avaliacao) {
        if (!avaliacao) return false;

        // Campos obrigatórios
        if (!avaliacao.id_avaliacao) return false;
        if (!avaliacao.pmo_avaliado) return false;
        if (!avaliacao.avaliador) return false;
        if (!avaliacao.status) return false;

        // Validar avaliador
        if (!avaliacao.avaliador.nome || !avaliacao.avaliador.cpf) return false;

        // Validar PMO
        if (!avaliacao.pmo_avaliado.dados) return false;

        return true;
    }
};

// Inicializar
AvaliacaoStorage.init();

// Exportar globalmente
if (typeof window !== 'undefined') {
    window.AvaliacaoStorage = AvaliacaoStorage;
}

export default AvaliacaoStorage;
