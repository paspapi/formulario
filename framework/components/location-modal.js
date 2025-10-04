/**
 * Location Modal - Modal Popup de Localização
 * Sistema PMO ANC - Versão 2.0
 * @description Modal reutilizável para captura de coordenadas em qualquer contexto
 */

const LocationModal = {
    /**
     * Estado interno do modal
     */
    state: {
        isOpen: false,
        targetLatInput: null,
        targetLonInput: null,
        currentAddress: '',
        onConfirm: null
    },

    /**
     * Abre o modal de localização
     * @param {Object} options - Configurações
     * @param {HTMLElement|string} options.latInput - Input de latitude (elemento ou ID)
     * @param {HTMLElement|string} options.lonInput - Input de longitude (elemento ou ID)
     * @param {string} options.address - Endereço para busca (opcional)
     * @param {Object} options.addressFields - IDs dos campos de endereço (opcional)
     * @param {Function} options.onConfirm - Callback ao confirmar (opcional)
     */
    open(options = {}) {
        if (this.state.isOpen) {
            this.close();
        }

        // Configurar campos target
        this.state.targetLatInput = this.getElement(options.latInput);
        this.state.targetLonInput = this.getElement(options.lonInput);

        // Obter endereço
        if (options.address) {
            this.state.currentAddress = options.address;
        } else if (options.addressFields) {
            this.state.currentAddress = this.buildAddress(options.addressFields);
        } else {
            // Tentar usar campos padrão do PMO
            this.state.currentAddress = this.buildAddress({
                endereco: 'endereco',
                bairro: 'bairro',
                municipio: 'municipio',
                uf: 'uf',
                cep: 'cep'
            });
        }

        // Callback
        this.state.onConfirm = options.onConfirm || null;

        // Criar e mostrar modal
        this.createModal();
        this.state.isOpen = true;

        // Preencher com coordenadas atuais se existirem
        this.loadCurrentCoordinates();
    },

    /**
     * Obtém elemento HTML
     * @param {HTMLElement|string} input - Elemento ou ID
     * @returns {HTMLElement|null}
     */
    getElement(input) {
        if (!input) return null;
        if (typeof input === 'string') {
            return document.getElementById(input) || document.querySelector(input);
        }
        return input;
    },

    /**
     * Monta endereço a partir de campos
     * @param {Object} fields - IDs dos campos
     * @returns {string}
     */
    buildAddress(fields) {
        const parts = [];

        Object.keys(fields).forEach(key => {
            const field = document.getElementById(fields[key]);
            if (field && field.value && field.value.trim()) {
                parts.push(field.value.trim());
            }
        });

        return parts.join(', ');
    },

    /**
     * Cria a estrutura HTML do modal
     */
    createModal() {
        // Remover modal anterior se existir
        const existingModal = document.getElementById('location-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'location-modal';
        modal.className = 'location-modal-overlay';
        modal.innerHTML = `
            <div class="location-modal">
                <div class="location-modal-header">
                    <h3>📍 Localização Exata</h3>
                    <button type="button" class="btn-close-modal" onclick="LocationModal.close()">
                        &times;
                    </button>
                </div>

                <div class="location-modal-body">
                    ${this.state.currentAddress ? `
                        <div class="address-display">
                            <strong>📍 Endereço:</strong>
                            <p>${this.escapeHtml(this.state.currentAddress)}</p>
                        </div>
                    ` : ''}

                    <button type="button" class="btn-open-maps" onclick="LocationModal.openGoogleMaps()">
                        🗺️ Abrir Google Maps
                    </button>

                    <div class="instructions-compact">
                        <p><strong>Como obter coordenadas:</strong></p>
                        <ol>
                            <li>Clique no botão acima para abrir o Google Maps</li>
                            <li>Encontre o ponto exato no mapa</li>
                            <li>Clique com <strong>botão direito</strong> → <strong>"Copiar coordenadas"</strong></li>
                            <li>Cole no campo abaixo</li>
                        </ol>
                    </div>

                    <div class="input-group">
                        <label for="modal-coords-input">Cole as coordenadas:</label>
                        <input
                            type="text"
                            id="modal-coords-input"
                            class="coords-input"
                            placeholder="Ex: -22.9068467, -47.0632881"
                            autocomplete="off"
                        >
                    </div>

                    <div class="coords-split">
                        <div class="coord-field">
                            <label for="modal-lat">Latitude</label>
                            <input
                                type="text"
                                id="modal-lat"
                                class="coord-value"
                                placeholder="-22.9068467"
                                readonly
                            >
                        </div>
                        <div class="coord-field">
                            <label for="modal-lon">Longitude</label>
                            <input
                                type="text"
                                id="modal-lon"
                                class="coord-value"
                                placeholder="-47.0632881"
                                readonly
                            >
                        </div>
                    </div>

                    <div id="modal-validation-msg" class="validation-msg"></div>
                </div>

                <div class="location-modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="LocationModal.close()">
                        Cancelar
                    </button>
                    <button type="button" class="btn btn-primary" id="btn-confirm-coords" disabled onclick="LocationModal.confirm()">
                        ✓ Confirmar Coordenadas
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalListeners();

        // Focus no input
        setTimeout(() => {
            const coordsInput = document.getElementById('modal-coords-input');
            if (coordsInput) coordsInput.focus();
        }, 100);
    },

    /**
     * Configura event listeners do modal
     */
    setupModalListeners() {
        const coordsInput = document.getElementById('modal-coords-input');
        const latInput = document.getElementById('modal-lat');
        const lonInput = document.getElementById('modal-lon');

        if (coordsInput) {
            coordsInput.addEventListener('input', (e) => {
                this.parseCoordinates(e.target.value);
            });

            coordsInput.addEventListener('paste', (e) => {
                setTimeout(() => {
                    this.parseCoordinates(e.target.value);
                }, 50);
            });
        }

        // Fechar ao clicar fora
        const overlay = document.getElementById('location-modal');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close();
                }
            });
        }

        // ESC para fechar
        document.addEventListener('keydown', this.handleEscape);
    },

    /**
     * Handler para tecla ESC
     */
    handleEscape(e) {
        if (e.key === 'Escape' && LocationModal.state.isOpen) {
            LocationModal.close();
        }
    },

    /**
     * Carrega coordenadas atuais se existirem
     */
    loadCurrentCoordinates() {
        if (!this.state.targetLatInput || !this.state.targetLonInput) return;

        const lat = this.state.targetLatInput.value;
        const lon = this.state.targetLonInput.value;

        if (lat && lon) {
            const coordsInput = document.getElementById('modal-coords-input');
            const modalLat = document.getElementById('modal-lat');
            const modalLon = document.getElementById('modal-lon');

            if (coordsInput) coordsInput.value = `${lat}, ${lon}`;
            if (modalLat) modalLat.value = lat;
            if (modalLon) modalLon.value = lon;

            this.validateCoordinates();
        }
    },

    /**
     * Parseia coordenadas coladas
     * @param {string} coords - String com coordenadas
     */
    parseCoordinates(coords) {
        if (!coords || coords.trim().length < 3) {
            this.clearModalCoords();
            return;
        }

        // Remove espaços extras e símbolos
        coords = coords.trim().replace(/°/g, '');

        // Padrões de coordenadas
        const patterns = [
            /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/,
            /^(-?\d+\.?\d*),(-?\d+\.?\d*)$/,
            /^(-?\d+\.?\d*)[SN]\s+(-?\d+\.?\d*)[WE]$/i
        ];

        let latitude = null;
        let longitude = null;

        for (const pattern of patterns) {
            const match = coords.match(pattern);
            if (match) {
                latitude = parseFloat(match[1]);
                longitude = parseFloat(match[2]);
                break;
            }
        }

        if (latitude !== null && longitude !== null) {
            const modalLat = document.getElementById('modal-lat');
            const modalLon = document.getElementById('modal-lon');

            if (modalLat) modalLat.value = latitude.toFixed(7);
            if (modalLon) modalLon.value = longitude.toFixed(7);

            this.validateCoordinates();
        } else {
            this.clearModalCoords();
        }
    },

    /**
     * Limpa coordenadas do modal
     */
    clearModalCoords() {
        const modalLat = document.getElementById('modal-lat');
        const modalLon = document.getElementById('modal-lon');
        const btnConfirm = document.getElementById('btn-confirm-coords');

        if (modalLat) modalLat.value = '';
        if (modalLon) modalLon.value = '';
        if (btnConfirm) btnConfirm.disabled = true;

        this.showValidationMessage('', 'info');
    },

    /**
     * Valida coordenadas
     * @returns {boolean}
     */
    validateCoordinates() {
        const modalLat = document.getElementById('modal-lat');
        const modalLon = document.getElementById('modal-lon');
        const btnConfirm = document.getElementById('btn-confirm-coords');

        if (!modalLat || !modalLon) return false;

        const lat = parseFloat(modalLat.value);
        const lon = parseFloat(modalLon.value);

        const latValid = !isNaN(lat) && lat >= -90 && lat <= 90;
        const lonValid = !isNaN(lon) && lon >= -180 && lon <= 180;

        const isValid = latValid && lonValid;

        if (btnConfirm) {
            btnConfirm.disabled = !isValid;
        }

        // Feedback visual
        if (modalLat.value && modalLon.value) {
            modalLat.classList.toggle('valid', latValid);
            modalLat.classList.toggle('invalid', !latValid);
            modalLon.classList.toggle('valid', lonValid);
            modalLon.classList.toggle('invalid', !lonValid);

            if (isValid) {
                this.showValidationMessage('✓ Coordenadas válidas!', 'success');
            } else {
                this.showValidationMessage('⚠ Coordenadas inválidas. Verifique os valores.', 'error');
            }
        } else {
            modalLat.classList.remove('valid', 'invalid');
            modalLon.classList.remove('valid', 'invalid');
            this.showValidationMessage('', 'info');
        }

        return isValid;
    },

    /**
     * Mostra mensagem de validação
     * @param {string} message
     * @param {string} type - 'success', 'error', 'info'
     */
    showValidationMessage(message, type = 'info') {
        const msgDiv = document.getElementById('modal-validation-msg');
        if (!msgDiv) return;

        msgDiv.textContent = message;
        msgDiv.className = `validation-msg validation-${type}`;
    },

    /**
     * Abre Google Maps com endereço ou coordenadas
     */
    openGoogleMaps() {
        let query = this.state.currentAddress;

        // Se não tem endereço, usa coordenadas atuais
        if (!query) {
            const modalLat = document.getElementById('modal-lat');
            const modalLon = document.getElementById('modal-lon');

            if (modalLat && modalLon && modalLat.value && modalLon.value) {
                query = `${modalLat.value},${modalLon.value}`;
            }
        }

        if (!query) {
            query = 'Brasil';
        }

        const encodedQuery = encodeURIComponent(query);
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

        window.open(mapsUrl, '_blank');

        if (query !== 'Brasil') {
            this.showValidationMessage('Google Maps aberto! Encontre o ponto exato e copie as coordenadas.', 'info');
        }
    },

    /**
     * Confirma e transfere coordenadas
     */
    confirm() {
        if (!this.validateCoordinates()) {
            return;
        }

        const modalLat = document.getElementById('modal-lat');
        const modalLon = document.getElementById('modal-lon');

        const lat = modalLat.value;
        const lon = modalLon.value;

        // Transferir para campos target
        if (this.state.targetLatInput) {
            this.state.targetLatInput.value = lat;
            // Disparar evento change
            const event = new Event('change', { bubbles: true });
            this.state.targetLatInput.dispatchEvent(event);
        }

        if (this.state.targetLonInput) {
            this.state.targetLonInput.value = lon;
            const event = new Event('change', { bubbles: true });
            this.state.targetLonInput.dispatchEvent(event);
        }

        // Callback
        if (this.state.onConfirm) {
            this.state.onConfirm({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
        }

        this.close();

        // Mostrar toast de sucesso
        this.showToast('✓ Coordenadas salvas com sucesso!', 'success');
    },

    /**
     * Fecha o modal
     */
    close() {
        const modal = document.getElementById('location-modal');
        if (modal) {
            modal.remove();
        }

        document.removeEventListener('keydown', this.handleEscape);

        this.state.isOpen = false;
        this.state.targetLatInput = null;
        this.state.targetLonInput = null;
        this.state.currentAddress = '';
        this.state.onConfirm = null;
    },

    /**
     * Escapa HTML
     * @param {string} text
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    },

    /**
     * Mostra toast notification
     * @param {string} message
     * @param {string} type
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `location-toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 99999;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Função helper global
function abrirModalLocalizacao(latInputId, lonInputId, address = null) {
    LocationModal.open({
        latInput: latInputId,
        lonInput: lonInputId,
        address: address
    });
}

// Auto-inicializar se houver dados de localização na página
console.log('✅ LocationModal carregado e pronto para uso');
