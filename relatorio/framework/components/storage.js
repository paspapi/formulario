/**
 * PMO Storage - Gerenciamento de armazenamento local
 * Suporta localStorage e IndexedDB
 * @version 2.0
 */

class PMOStorage {
  constructor(options = {}) {
    this.storageType = options.storageType || 'localStorage';
    this.dbName = options.dbName || 'PMO_Database';
    this.dbVersion = options.dbVersion || 1;
    this.storeName = options.storeName || 'pmo_data';
    this.db = null;

    // Prefixo para chaves do localStorage
    this.prefix = 'pmo_';
  }

  /**
   * Inicializa o storage
   */
  async init() {
    if (this.storageType === 'indexedDB') {
      await this.initIndexedDB();
    }
  }

  /**
   * Inicializa IndexedDB
   */
  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Erro ao abrir IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB inicializado');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Cria object stores
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: false
          });

          // Cria índices
          objectStore.createIndex('type', 'type', { unique: false });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store para arquivos/documentos
        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', {
            keyPath: 'id',
            autoIncrement: false
          });
          fileStore.createIndex('pmoId', 'pmoId', { unique: false });
        }

        console.log('IndexedDB estrutura criada');
      };
    });
  }

  /**
   * Salva dados
   */
  async save(key, data) {
    if (this.storageType === 'indexedDB' && this.db) {
      return this.saveToIndexedDB(key, data);
    } else {
      return this.saveToLocalStorage(key, data);
    }
  }

  /**
   * Carrega dados
   */
  async load(key) {
    if (this.storageType === 'indexedDB' && this.db) {
      return this.loadFromIndexedDB(key);
    } else {
      return this.loadFromLocalStorage(key);
    }
  }

  /**
   * Remove dados
   */
  async remove(key) {
    if (this.storageType === 'indexedDB' && this.db) {
      return this.removeFromIndexedDB(key);
    } else {
      return this.removeFromLocalStorage(key);
    }
  }

  /**
   * Lista todas as chaves
   */
  async listKeys() {
    if (this.storageType === 'indexedDB' && this.db) {
      return this.listKeysIndexedDB();
    } else {
      return this.listKeysLocalStorage();
    }
  }

  /**
   * Limpa todos os dados
   */
  async clear() {
    if (this.storageType === 'indexedDB' && this.db) {
      return this.clearIndexedDB();
    } else {
      return this.clearLocalStorage();
    }
  }

  // ========== LocalStorage ==========

  saveToLocalStorage(key, data) {
    try {
      const fullKey = this.prefix + key;
      const jsonData = JSON.stringify({
        data: data,
        timestamp: Date.now(),
        version: '2.0'
      });

      localStorage.setItem(fullKey, jsonData);
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);

      // Verifica se é erro de quota
      if (error.name === 'QuotaExceededError') {
        throw new Error('Armazenamento local cheio. Limpe dados antigos.');
      }

      throw error;
    }
  }

  loadFromLocalStorage(key) {
    try {
      const fullKey = this.prefix + key;
      const jsonData = localStorage.getItem(fullKey);

      if (!jsonData) {
        return null;
      }

      const parsed = JSON.parse(jsonData);
      return parsed.data;
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      return null;
    }
  }

  removeFromLocalStorage(key) {
    const fullKey = this.prefix + key;
    localStorage.removeItem(fullKey);
    return true;
  }

  listKeysLocalStorage() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''));
      }
    }
    return keys;
  }

  clearLocalStorage() {
    const keys = this.listKeysLocalStorage();
    keys.forEach(key => this.removeFromLocalStorage(key));
    return true;
  }

  // ========== IndexedDB ==========

  async saveToIndexedDB(key, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const record = {
        id: key,
        data: data,
        timestamp: Date.now(),
        version: '2.0'
      };

      const request = store.put(record);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async loadFromIndexedDB(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async removeFromIndexedDB(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async listKeysIndexedDB() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearIndexedDB() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // ========== Arquivos/Documentos ==========

  /**
   * Salva arquivo (como Base64)
   */
  async saveFile(file, metadata = {}) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileData = {
          id: metadata.id || `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          pmoId: metadata.pmoId || 'default',
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result, // Base64
          timestamp: Date.now(),
          ...metadata
        };

        try {
          if (this.storageType === 'indexedDB' && this.db) {
            await this.saveFileToIndexedDB(fileData);
          } else {
            await this.saveFileToLocalStorage(fileData);
          }
          resolve(fileData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async saveFileToIndexedDB(fileData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.put(fileData);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async saveFileToLocalStorage(fileData) {
    // Verifica tamanho (limite de 5MB)
    const jsonData = JSON.stringify(fileData);
    const sizeInMB = new Blob([jsonData]).size / (1024 * 1024);

    if (sizeInMB > 5) {
      throw new Error('Arquivo muito grande para localStorage (máx 5MB). Use IndexedDB.');
    }

    const key = `file_${fileData.id}`;
    localStorage.setItem(this.prefix + key, jsonData);
    return true;
  }

  /**
   * Carrega arquivo
   */
  async loadFile(fileId) {
    if (this.storageType === 'indexedDB' && this.db) {
      return this.loadFileFromIndexedDB(fileId);
    } else {
      return this.loadFileFromLocalStorage(fileId);
    }
  }

  async loadFileFromIndexedDB(fileId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(fileId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async loadFileFromLocalStorage(fileId) {
    const key = `file_${fileId}`;
    const jsonData = localStorage.getItem(this.prefix + key);
    return jsonData ? JSON.parse(jsonData) : null;
  }

  /**
   * Lista arquivos de um PMO
   */
  async listFiles(pmoId) {
    if (this.storageType === 'indexedDB' && this.db) {
      return this.listFilesIndexedDB(pmoId);
    } else {
      return this.listFilesLocalStorage(pmoId);
    }
  }

  async listFilesIndexedDB(pmoId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const index = store.index('pmoId');
      const request = index.getAll(pmoId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async listFilesLocalStorage(pmoId) {
    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix + 'file_')) {
        const fileData = JSON.parse(localStorage.getItem(key));
        if (fileData.pmoId === pmoId) {
          files.push(fileData);
        }
      }
    }
    return files;
  }

  /**
   * Remove arquivo
   */
  async removeFile(fileId) {
    if (this.storageType === 'indexedDB' && this.db) {
      return this.removeFileFromIndexedDB(fileId);
    } else {
      return this.removeFileFromLocalStorage(fileId);
    }
  }

  async removeFileFromIndexedDB(fileId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.delete(fileId);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async removeFileFromLocalStorage(fileId) {
    const key = `file_${fileId}`;
    localStorage.removeItem(this.prefix + key);
    return true;
  }

  // ========== Utilitários ==========

  /**
   * Verifica espaço disponível
   */
  async getStorageInfo() {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        usageInMB: (estimate.usage / (1024 * 1024)).toFixed(2),
        quotaInMB: (estimate.quota / (1024 * 1024)).toFixed(2),
        percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2)
      };
    }

    return null;
  }

  /**
   * Exporta todos os dados
   */
  async exportAll() {
    const keys = await this.listKeys();
    const data = {};

    for (const key of keys) {
      data[key] = await this.load(key);
    }

    return {
      version: '2.0',
      timestamp: Date.now(),
      data: data
    };
  }

  /**
   * Importa dados
   */
  async importAll(exportedData) {
    if (!exportedData.data) {
      throw new Error('Formato de dados inválido');
    }

    const results = {
      success: 0,
      errors: 0,
      total: Object.keys(exportedData.data).length
    };

    for (const [key, value] of Object.entries(exportedData.data)) {
      try {
        await this.save(key, value);
        results.success++;
      } catch (error) {
        console.error(`Erro ao importar ${key}:`, error);
        results.errors++;
      }
    }

    return results;
  }
}

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.PMOStorage = PMOStorage;
}

export default PMOStorage;