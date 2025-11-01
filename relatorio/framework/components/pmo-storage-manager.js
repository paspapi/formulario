/**
 * PMO Storage Manager
 * Gerenciador de múltiplos PMOs com sistema de ID único
 * @version 1.0.0
 * @author ANC - Associação de Agricultura Natural de Campinas e Região
 */

class PMOStorageManager {
    constructor() {
        this.REGISTRY_KEY = 'pmo_registry';
        this.DATA_SUFFIX = '_data';

        this.init();
    }

    /**
     * Inicializar gerenciador
     */
    init() {
        // Verificar se registry existe, senão criar
        if (!this.getRegistry()) {
            this.createRegistry();
        }

        // Migrar dados antigos automaticamente
        this.migrateOldData();

        console.log('✅ PMOStorageManager inicializado');
    }

    /**
     * Criar registry vazio
     */
    createRegistry() {
        const registry = {
            current_pmo_id: null,
            pmos: []
        };
        localStorage.setItem(this.REGISTRY_KEY, JSON.stringify(registry));
        return registry;
    }

    /**
     * Obter registry completo
     */
    getRegistry() {
        try {
            const data = localStorage.getItem(this.REGISTRY_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao carregar registry:', error);
            return null;
        }
    }

    /**
     * Salvar registry
     */
    saveRegistry(registry) {
        try {
            localStorage.setItem(this.REGISTRY_KEY, JSON.stringify(registry));
            return true;
        } catch (error) {
            console.error('Erro ao salvar registry:', error);
            return false;
        }
    }

    /**
     * Gerar ID único do PMO
     * Formato: pmo_{ano}_{cpf_cnpj}_{unidade_producao}
     */
    generatePMOId(cpf_cnpj, ano_vigente, unidade_producao) {
        // Limpar CPF/CNPJ (remover pontos, barras, hífens)
        const cpfCnpjLimpo = cpf_cnpj.replace(/[.\-\/]/g, '');

        // Limpar unidade (lowercase, sem espaços, sem acentos)
        const unidadeLimpa = unidade_producao
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-z0-9]/g, '-') // Substitui caracteres especiais por -
            .replace(/-+/g, '-') // Remove hífens duplicados
            .replace(/^-|-$/g, ''); // Remove hífens no início/fim

        return `pmo_${ano_vigente}_${cpfCnpjLimpo}_${unidadeLimpa}`;
    }

    /**
     * Criar novo PMO
     * @param {Object} dados - { cpf_cnpj, nome, unidade, grupo_spg, ano_vigente }
     * @returns {String} ID do PMO criado
     */
    createPMO(dados) {
        const registry = this.getRegistry() || this.createRegistry();

        // Gerar ID
        const id = this.generatePMOId(
            dados.cpf_cnpj,
            dados.ano_vigente || new Date().getFullYear(),
            dados.unidade
        );

        // Verificar se já existe
        const exists = registry.pmos.find(p => p.id === id);
        if (exists) {
            console.warn(`PMO ${id} já existe. Retornando ID existente.`);
            return id;
        }

        // Criar entrada no registry
        const pmoEntry = {
            id: id,
            cpf_cnpj: dados.cpf_cnpj,
            nome: dados.nome,
            unidade: dados.unidade,
            grupo_spg: dados.grupo_spg || '',
            ano_vigente: dados.ano_vigente || new Date().getFullYear(),
            versao: '1.0',
            data_criacao: new Date().toISOString(),
            data_modificacao: new Date().toISOString(),
            status: 'rascunho',
            progresso: {
                total: 0
            },
            formularios_ativos: ['cadastro-geral-pmo'] // Sempre começa com cadastro geral
        };

        registry.pmos.push(pmoEntry);
        registry.current_pmo_id = id; // Define como PMO ativo
        this.saveRegistry(registry);

        // Criar storage de dados do PMO
        const pmoData = {
            cadastro_geral_pmo: dados.cadastro_geral_pmo || {},
            documentos_anexados: {},
            pdfs_gerados: {}
        };
        localStorage.setItem(id + this.DATA_SUFFIX, JSON.stringify(pmoData));

        console.log(`✅ PMO criado: ${id}`);
        return id;
    }

    /**
     * Obter dados completos de um PMO
     */
    getPMO(id) {
        const registry = this.getRegistry();
        if (!registry) return null;

        const pmoEntry = registry.pmos.find(p => p.id === id);
        if (!pmoEntry) return null;

        // Carregar dados do PMO
        try {
            const dataStr = localStorage.getItem(id + this.DATA_SUFFIX);
            const data = dataStr ? JSON.parse(dataStr) : {};

            return {
                ...pmoEntry,
                dados: data
            };
        } catch (error) {
            console.error(`Erro ao carregar dados do PMO ${id}:`, error);
            return pmoEntry;
        }
    }

    /**
     * Atualizar informações do PMO no registry
     */
    updatePMOInfo(id, updates) {
        const registry = this.getRegistry();
        if (!registry) return false;

        const pmoIndex = registry.pmos.findIndex(p => p.id === id);
        if (pmoIndex === -1) return false;

        // Atualizar campos
        registry.pmos[pmoIndex] = {
            ...registry.pmos[pmoIndex],
            ...updates,
            data_modificacao: new Date().toISOString()
        };

        return this.saveRegistry(registry);
    }

    /**
     * Atualizar dados de um formulário específico
     */
    updateFormulario(id, formularioNome, dados) {
        try {
            const dataStr = localStorage.getItem(id + this.DATA_SUFFIX);
            const pmoData = dataStr ? JSON.parse(dataStr) : {};

            // Atualizar dados do formulário
            pmoData[formularioNome] = dados;

            // Salvar
            localStorage.setItem(id + this.DATA_SUFFIX, JSON.stringify(pmoData));

            // Atualizar data de modificação no registry
            this.updatePMOInfo(id, {
                data_modificacao: new Date().toISOString()
            });

            console.log(`✅ Formulário ${formularioNome} atualizado no PMO ${id}`);
            return true;
        } catch (error) {
            console.error(`Erro ao atualizar formulário ${formularioNome}:`, error);
            return false;
        }
    }

    /**
     * Obter dados de um formulário específico
     */
    getFormulario(id, formularioNome) {
        try {
            const dataStr = localStorage.getItem(id + this.DATA_SUFFIX);
            if (!dataStr) return null;

            const pmoData = JSON.parse(dataStr);
            return pmoData[formularioNome] || null;
        } catch (error) {
            console.error(`Erro ao carregar formulário ${formularioNome}:`, error);
            return null;
        }
    }

    /**
     * Salvar documento anexado (PDF em base64)
     */
    saveDocumentoAnexado(id, nomeDocumento, base64Data) {
        try {
            const dataStr = localStorage.getItem(id + this.DATA_SUFFIX);
            const pmoData = dataStr ? JSON.parse(dataStr) : {};

            if (!pmoData.documentos_anexados) {
                pmoData.documentos_anexados = {};
            }

            pmoData.documentos_anexados[nomeDocumento] = base64Data;

            localStorage.setItem(id + this.DATA_SUFFIX, JSON.stringify(pmoData));
            console.log(`✅ Documento ${nomeDocumento} salvo no PMO ${id}`);
            return true;
        } catch (error) {
            console.error(`Erro ao salvar documento ${nomeDocumento}:`, error);
            return false;
        }
    }

    /**
     * Salvar PDF gerado de um formulário
     */
    savePDFGerado(id, formularioNome, pdfBytes) {
        try {
            const dataStr = localStorage.getItem(id + this.DATA_SUFFIX);
            const pmoData = dataStr ? JSON.parse(dataStr) : {};

            if (!pmoData.pdfs_gerados) {
                pmoData.pdfs_gerados = {};
            }

            // Converter para base64 se necessário
            const base64 = typeof pdfBytes === 'string' ? pdfBytes : btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));
            pmoData.pdfs_gerados[formularioNome] = base64;

            localStorage.setItem(id + this.DATA_SUFFIX, JSON.stringify(pmoData));
            console.log(`✅ PDF ${formularioNome} salvo no PMO ${id}`);
            return true;
        } catch (error) {
            console.error(`Erro ao salvar PDF ${formularioNome}:`, error);
            return false;
        }
    }

    /**
     * Atualizar progresso do PMO
     */
    updateProgresso(id, formularioNome, percentual) {
        const registry = this.getRegistry();
        if (!registry) return false;

        const pmoIndex = registry.pmos.findIndex(p => p.id === id);
        if (pmoIndex === -1) return false;

        // Atualizar progresso do formulário
        if (!registry.pmos[pmoIndex].progresso) {
            registry.pmos[pmoIndex].progresso = {};
        }
        registry.pmos[pmoIndex].progresso[formularioNome] = percentual;

        // Calcular progresso total (média dos formulários ativos)
        const formularios = registry.pmos[pmoIndex].formularios_ativos || [];
        let somaProgresso = 0;
        let count = 0;

        formularios.forEach(f => {
            const prog = registry.pmos[pmoIndex].progresso[f];
            if (typeof prog === 'number') {
                somaProgresso += prog;
                count++;
            }
        });

        registry.pmos[pmoIndex].progresso.total = count > 0 ? Math.round(somaProgresso / count) : 0;

        return this.saveRegistry(registry);
    }

    /**
     * Atualizar formulários ativos (escopo)
     */
    updateFormulariosAtivos(id, formularios) {
        return this.updatePMOInfo(id, {
            formularios_ativos: formularios
        });
    }

    /**
     * Definir PMO ativo
     */
    setActivePMO(id) {
        const registry = this.getRegistry();
        if (!registry) return false;

        // Permitir null para limpar PMO ativo
        if (id === null) {
            registry.current_pmo_id = null;
            this.saveRegistry(registry);
            console.log(`✅ PMO ativo limpo`);
            return true;
        }

        // Verificar se PMO existe
        const exists = registry.pmos.find(p => p.id === id);
        if (!exists) {
            console.error(`PMO ${id} não encontrado`);
            return false;
        }

        registry.current_pmo_id = id;
        this.saveRegistry(registry);
        console.log(`✅ PMO ativo: ${id}`);
        return true;
    }

    /**
     * Obter PMO ativo
     */
    getActivePMO() {
        const registry = this.getRegistry();
        if (!registry || !registry.current_pmo_id) return null;

        return this.getPMO(registry.current_pmo_id);
    }

    /**
     * Listar todos PMOs
     */
    listAllPMOs() {
        const registry = this.getRegistry();
        if (!registry) return [];

        return registry.pmos.map(pmoEntry => {
            // Retornar info básica sem carregar dados completos
            return { ...pmoEntry };
        });
    }

    /**
     * Deletar PMO
     */
    deletePMO(id) {
        const registry = this.getRegistry();
        if (!registry) return false;

        // Remover do registry
        const pmoIndex = registry.pmos.findIndex(p => p.id === id);
        if (pmoIndex === -1) return false;

        registry.pmos.splice(pmoIndex, 1);

        // Se era o PMO ativo, limpar
        if (registry.current_pmo_id === id) {
            registry.current_pmo_id = registry.pmos.length > 0 ? registry.pmos[0].id : null;
        }

        this.saveRegistry(registry);

        // Remover dados do localStorage
        localStorage.removeItem(id + this.DATA_SUFFIX);

        console.log(`✅ PMO ${id} deletado`);
        return true;
    }

    /**
     * Migrar dados antigos (sem ID) para novo formato
     */
    migrateOldData() {
        console.log('🔄 Verificando migração de dados antigos...');

        // Chaves antigas conhecidas
        const oldKeys = [
            'cadastro_geral_pmo_data',
            'anexo_vegetal_data',
            'pmo_anexo_animal',
            'anexo_cogumelo_data',
            'pmo_anexo_apicultura',
            'pmo_processamento',
            'pmo_processamento_minimo'
        ];

        // Verificar se existe dados antigos
        const cadastroAntigo = localStorage.getItem('cadastro_geral_pmo_data');
        if (!cadastroAntigo) {
            console.log('✅ Nenhum dado antigo encontrado');
            return;
        }

        try {
            const dados = JSON.parse(cadastroAntigo);

            // Verificar se já foi migrado
            const registry = this.getRegistry();
            if (registry && registry.pmos.length > 0) {
                console.log('✅ Dados já migrados anteriormente');
                return;
            }

            // Criar novo PMO com dados antigos
            const cpf_cnpj = dados.cpf_cnpj || dados.cpf || dados.cnpj || '000.000.000-00';
            const nome = dados.nome_completo || 'Produtor Migrado';
            const unidade = dados.nome_unidade_producao || 'Unidade Migrada';
            const ano = dados.ano_vigente || new Date().getFullYear();
            const grupo = dados.grupo_spg || '';

            const id = this.createPMO({
                cpf_cnpj: cpf_cnpj,
                nome: nome,
                unidade: unidade,
                grupo_spg: grupo,
                ano_vigente: ano,
                cadastro_geral_pmo: dados
            });

            // Migrar dados dos outros formulários
            const mapping = {
                'anexo_vegetal_data': 'anexo_vegetal',
                'pmo_anexo_animal': 'anexo_animal',
                'anexo_cogumelo_data': 'anexo_cogumelo',
                'pmo_anexo_apicultura': 'anexo_apicultura',
                'pmo_processamento': 'anexo_processamento',
                'pmo_processamento_minimo': 'anexo_processamentominimo'
            };

            Object.keys(mapping).forEach(oldKey => {
                const oldData = localStorage.getItem(oldKey);
                if (oldData) {
                    try {
                        const parsedData = JSON.parse(oldData);
                        this.updateFormulario(id, mapping[oldKey], parsedData);
                        console.log(`✅ Migrado: ${oldKey} → ${mapping[oldKey]}`);
                    } catch (error) {
                        console.warn(`Erro ao migrar ${oldKey}:`, error);
                    }
                }
            });

            console.log(`✅ Dados antigos migrados para PMO: ${id}`);
            console.log('ℹ️ Os dados antigos foram preservados. Você pode removê-los manualmente se desejar.');

        } catch (error) {
            console.error('Erro na migração:', error);
        }
    }

    /**
     * Limpar TODOS os dados (cuidado!)
     */
    clearAll() {
        if (confirm('⚠️ ATENÇÃO! Isso vai deletar TODOS os PMOs. Tem certeza?')) {
            const registry = this.getRegistry();
            if (registry) {
                // Remover dados de cada PMO
                registry.pmos.forEach(pmo => {
                    localStorage.removeItem(pmo.id + this.DATA_SUFFIX);
                });
            }

            // Remover registry
            localStorage.removeItem(this.REGISTRY_KEY);

            console.log('✅ Todos os dados foram removidos');
            this.createRegistry();
        }
    }
}

// Criar instância global
const pmoStorageManager = new PMOStorageManager();

// Expor globalmente
window.PMOStorageManager = pmoStorageManager;

console.log('✅ PMOStorageManager carregado e disponível globalmente');
