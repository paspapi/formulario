/**
 * PMO API Client - Integrações com APIs externas
 * ViaCEP, BrasilAPI e outras APIs públicas
 * @version 2.0
 */

class PMOAPIClient {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Busca endereço por CEP (ViaCEP)
   */
  async buscarCEP(cep) {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');

    // Valida formato
    if (cep.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    // Verifica cache
    const cacheKey = `cep_${cep}`;
    const cached = this.getCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = `https://viacep.com.br/ws/${cep}/json/`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      // Normaliza resposta
      const result = {
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf,
        ibge: data.ibge,
        gia: data.gia,
        ddd: data.ddd,
        siafi: data.siafi
      };

      // Salva no cache
      this.setCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      throw error;
    }
  }

  /**
   * Valida CNPJ via BrasilAPI
   */
  async buscarCNPJ(cnpj) {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/\D/g, '');

    // Valida formato
    if (cnpj.length !== 14) {
      throw new Error('CNPJ deve ter 14 dígitos');
    }

    // Verifica cache
    const cacheKey = `cnpj_${cnpj}`;
    const cached = this.getCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CNPJ não encontrado');
        }
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Normaliza resposta
      const result = {
        cnpj: data.cnpj,
        razaoSocial: data.razao_social,
        nomeFantasia: data.nome_fantasia,
        cnae: data.cnae_fiscal_descricao,
        dataAbertura: data.data_inicio_atividade,
        situacao: data.descricao_situacao_cadastral,
        email: data.email,
        telefone: data.ddd_telefone_1,
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.municipio,
        uf: data.uf,
        naturezaJuridica: data.natureza_juridica,
        capitalSocial: data.capital_social
      };

      // Salva no cache
      this.setCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);
      throw error;
    }
  }

  /**
   * Busca municípios por UF
   */
  async buscarMunicipiosPorUF(uf) {
    // Valida UF
    if (!uf || uf.length !== 2) {
      throw new Error('UF inválida');
    }

    uf = uf.toUpperCase();

    // Verifica cache
    const cacheKey = `municipios_${uf}`;
    const cached = this.getCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = `https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Normaliza resposta
      const result = data.map(municipio => ({
        codigo: municipio.codigo_ibge,
        nome: municipio.nome
      }));

      // Salva no cache
      this.setCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
      throw error;
    }
  }

  /**
   * Busca informações de banco por código
   */
  async buscarBanco(codigo) {
    // Remove caracteres não numéricos
    codigo = codigo.replace(/\D/g, '');

    // Verifica cache
    const cacheKey = `banco_${codigo}`;
    const cached = this.getCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = `https://brasilapi.com.br/api/banks/v1/${codigo}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Banco não encontrado');
        }
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Normaliza resposta
      const result = {
        codigo: data.code,
        nome: data.name,
        nomeCompleto: data.fullName
      };

      // Salva no cache
      this.setCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Erro ao buscar banco:', error);
      throw error;
    }
  }

  /**
   * Lista todos os bancos
   */
  async listarBancos() {
    // Verifica cache
    const cacheKey = 'bancos_lista';
    const cached = this.getCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = 'https://brasilapi.com.br/api/banks/v1';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Normaliza resposta
      const result = data.map(banco => ({
        codigo: banco.code,
        nome: banco.name,
        nomeCompleto: banco.fullName
      }));

      // Salva no cache
      this.setCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Erro ao listar bancos:', error);
      throw error;
    }
  }

  // ========== Cache ==========

  setCache(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Verifica se expirou
    const age = Date.now() - cached.timestamp;
    if (age > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clearCache() {
    this.cache.clear();
  }

  // ========== Helpers ==========

  /**
   * Preenchimento automático de endereço baseado em CEP
   */
  async preencherEndereco(cep, prefixo = '') {
    try {
      const endereco = await this.buscarCEP(cep);

      // Mapeamento de campos
      const campos = {
        [`${prefixo}logradouro`]: endereco.logradouro,
        [`${prefixo}bairro`]: endereco.bairro,
        [`${prefixo}cidade`]: endereco.cidade,
        [`${prefixo}uf`]: endereco.uf,
        [`${prefixo}complemento`]: endereco.complemento
      };

      // Preenche campos automaticamente
      for (const [campo, valor] of Object.entries(campos)) {
        const element = document.getElementById(campo) || document.querySelector(`[name="${campo}"]`);
        if (element && valor) {
          element.value = valor;
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      return endereco;
    } catch (error) {
      console.error('Erro ao preencher endereço:', error);
      throw error;
    }
  }

  /**
   * Preenchimento automático de dados da empresa baseado em CNPJ
   */
  async preencherDadosEmpresa(cnpj, prefixo = '') {
    try {
      const empresa = await this.buscarCNPJ(cnpj);

      // Mapeamento de campos
      const campos = {
        [`${prefixo}razao_social`]: empresa.razaoSocial,
        [`${prefixo}nome_fantasia`]: empresa.nomeFantasia,
        [`${prefixo}email`]: empresa.email,
        [`${prefixo}telefone`]: empresa.telefone,
        [`${prefixo}cep`]: empresa.cep,
        [`${prefixo}logradouro`]: empresa.logradouro,
        [`${prefixo}numero`]: empresa.numero,
        [`${prefixo}complemento`]: empresa.complemento,
        [`${prefixo}bairro`]: empresa.bairro,
        [`${prefixo}cidade`]: empresa.cidade,
        [`${prefixo}uf`]: empresa.uf
      };

      // Preenche campos automaticamente
      for (const [campo, valor] of Object.entries(campos)) {
        const element = document.getElementById(campo) || document.querySelector(`[name="${campo}"]`);
        if (element && valor) {
          element.value = valor;
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      return empresa;
    } catch (error) {
      console.error('Erro ao preencher dados da empresa:', error);
      throw error;
    }
  }
}

// Instância singleton
const apiClient = new PMOAPIClient();

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.PMOAPIClient = apiClient;
}

export default apiClient;
