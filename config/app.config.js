/**
 * Configuração da aplicação PMO
 * @version 2.0
 */

export const CONFIG = {
  MODE: 'development',
  VERSION: '2.0.0',

  ORGANIZATION: {
    name: 'ANC - Associação de Agricultura Natural de Campinas e Região',
    shortName: 'ANC'
  },

  STORAGE: {
    type: 'localStorage',
    dbName: 'PMO_Database',
    prefix: 'pmo_'
  },

  AUTO_SAVE: {
    enabled: true,
    interval: 30000
  },

  API: {
    cep: 'https://viacep.com.br/ws',
    brasilAPI: 'https://brasilapi.com.br/api'
  },

  ROUTES: {
    basePath: '/formulario'
  }
};

if (typeof window !== 'undefined') {
  window.PMO_CONFIG = CONFIG;
}

export default CONFIG;
