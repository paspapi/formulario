/**
 * Location Picker - Seletor de Localização com Google Maps
 * Sistema PMO ANC - Versão 2.0
 * @description Componente para captura de coordenadas geográficas usando Google Maps
 */

const LocationPicker = {
    /**
     * Inicializa o componente de localização
     * @param {Object} config - Configurações
     * @param {string} config.addressFieldId - ID do campo de endereço
     * @param {string} config.coordsInputId - ID do campo de coordenadas
     * @param {string} config.latitudeId - ID do campo latitude
     * @param {string} config.longitudeId - ID do campo longitude
     * @param {Function} config.onLocationChange - Callback quando coordenadas mudam
     */
    init(config = {}) {
        this.config = {
            addressFieldId: config.addressFieldId || 'endereco_completo',
            coordsInputId: config.coordsInputId || 'coordenadas-google-maps',
            latitudeId: config.latitudeId || 'latitude',
            longitudeId: config.longitudeId || 'longitude',
            onLocationChange: config.onLocationChange || null,
            ...config
        };

        this.setupEventListeners();
        console.log('✅ LocationPicker inicializado');
    },

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Auto-separar coordenadas quando coladas
        const coordsInput = document.getElementById(this.config.coordsInputId);
        if (coordsInput) {
            coordsInput.addEventListener('input', (e) => {
                this.parseCoordinates(e.target.value);
            });

            coordsInput.addEventListener('paste', (e) => {
                setTimeout(() => {
                    this.parseCoordinates(e.target.value);
                }, 100);
            });
        }

        // Validar coordenadas individuais
        const latInput = document.getElementById(this.config.latitudeId);
        const lngInput = document.getElementById(this.config.longitudeId);

        if (latInput) {
            latInput.addEventListener('change', () => this.validateCoordinates());
        }

        if (lngInput) {
            lngInput.addEventListener('change', () => this.validateCoordinates());
        }
    },

    /**
     * Parseia coordenadas do formato do Google Maps
     * Formatos aceitos:
     * - "-22.9068467, -47.0632881"
     * - "-22.9068467,-47.0632881"
     * - "22.9068467°S 47.0632881°W"
     * @param {string} coords - String com coordenadas
     */
    parseCoordinates(coords) {
        if (!coords || coords.trim().length < 3) return;

        const latInput = document.getElementById(this.config.latitudeId);
        const lngInput = document.getElementById(this.config.longitudeId);

        if (!latInput || !lngInput) return;

        // Remove espaços extras e símbolos de grau
        coords = coords.trim().replace(/°/g, '');

        // Padrões de coordenadas
        const patterns = [
            // Formato: -22.9068467, -47.0632881
            /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/,
            // Formato: -22.9068467,-47.0632881
            /^(-?\d+\.?\d*),(-?\d+\.?\d*)$/,
            // Formato com S/N e W/E
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
            // Validar ranges
            if (this.isValidLatitude(latitude) && this.isValidLongitude(longitude)) {
                latInput.value = latitude.toFixed(7);
                lngInput.value = longitude.toFixed(7);

                // Adicionar indicador visual de sucesso
                this.showSuccess('Coordenadas separadas com sucesso!');

                // Callback
                if (this.config.onLocationChange) {
                    this.config.onLocationChange({ latitude, longitude });
                }

                // Atualizar status de validação
                this.validateCoordinates();
            } else {
                this.showError('Coordenadas fora do range válido');
            }
        }
    },

    /**
     * Valida se latitude está no range válido
     * @param {number} lat - Latitude
     * @returns {boolean}
     */
    isValidLatitude(lat) {
        return lat >= -90 && lat <= 90;
    },

    /**
     * Valida se longitude está no range válido
     * @param {number} lng - Longitude
     * @returns {boolean}
     */
    isValidLongitude(lng) {
        return lng >= -180 && lng <= 180;
    },

    /**
     * Valida as coordenadas atuais
     * @returns {boolean}
     */
    validateCoordinates() {
        const latInput = document.getElementById(this.config.latitudeId);
        const lngInput = document.getElementById(this.config.longitudeId);

        if (!latInput || !lngInput) return false;

        const lat = parseFloat(latInput.value);
        const lng = parseFloat(lngInput.value);

        const isValid = this.isValidLatitude(lat) && this.isValidLongitude(lng);

        // Adicionar/remover classes de validação
        if (isValid) {
            latInput.classList.add('valid');
            latInput.classList.remove('invalid');
            lngInput.classList.add('valid');
            lngInput.classList.remove('invalid');

            // Mostrar confirmação
            const confirmacao = document.querySelector('.confirmacao-localizacao');
            if (confirmacao) {
                confirmacao.style.display = 'block';
            }
        } else {
            latInput.classList.remove('valid');
            lngInput.classList.remove('invalid');

            const confirmacao = document.querySelector('.confirmacao-localizacao');
            if (confirmacao) {
                confirmacao.style.display = 'none';
            }
        }

        return isValid;
    },

    /**
     * Abre Google Maps com o endereço ou coordenadas
     * @param {string} query - Endereço ou coordenadas
     */
    openGoogleMaps(query = null) {
        let searchQuery = query;

        // Se não passou query, tenta pegar do campo de endereço
        if (!searchQuery) {
            const addressInput = document.getElementById(this.config.addressFieldId);
            if (addressInput && addressInput.value) {
                searchQuery = addressInput.value;
            }
        }

        // Se ainda não tem query, tenta usar coordenadas atuais
        if (!searchQuery) {
            const latInput = document.getElementById(this.config.latitudeId);
            const lngInput = document.getElementById(this.config.longitudeId);

            if (latInput && lngInput && latInput.value && lngInput.value) {
                searchQuery = `${latInput.value},${lngInput.value}`;
            }
        }

        // Se ainda não tem query, usa localização padrão (Brasil)
        if (!searchQuery) {
            searchQuery = 'Brasil';
        }

        // Codificar URL
        const encodedQuery = encodeURIComponent(searchQuery);
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

        // Abrir em nova aba
        window.open(mapsUrl, '_blank');
    },

    /**
     * Verifica localização atual no Google Maps
     */
    verifyLocation() {
        const latInput = document.getElementById(this.config.latitudeId);
        const lngInput = document.getElementById(this.config.longitudeId);

        if (!latInput || !lngInput || !latInput.value || !lngInput.value) {
            this.showError('Preencha as coordenadas primeiro');
            return;
        }

        const lat = parseFloat(latInput.value);
        const lng = parseFloat(lngInput.value);

        if (!this.isValidLatitude(lat) || !this.isValidLongitude(lng)) {
            this.showError('Coordenadas inválidas');
            return;
        }

        // Abrir Maps com coordenadas exatas
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(mapsUrl, '_blank');
    },

    /**
     * Obtém coordenadas atuais
     * @returns {Object|null} {latitude, longitude}
     */
    getCoordinates() {
        const latInput = document.getElementById(this.config.latitudeId);
        const lngInput = document.getElementById(this.config.longitudeId);

        if (!latInput || !lngInput) return null;

        const lat = parseFloat(latInput.value);
        const lng = parseFloat(lngInput.value);

        if (this.isValidLatitude(lat) && this.isValidLongitude(lng)) {
            return { latitude: lat, longitude: lng };
        }

        return null;
    },

    /**
     * Define coordenadas
     * @param {number} latitude
     * @param {number} longitude
     */
    setCoordinates(latitude, longitude) {
        const latInput = document.getElementById(this.config.latitudeId);
        const lngInput = document.getElementById(this.config.longitudeId);
        const coordsInput = document.getElementById(this.config.coordsInputId);

        if (latInput && lngInput) {
            latInput.value = latitude.toFixed(7);
            lngInput.value = longitude.toFixed(7);

            if (coordsInput) {
                coordsInput.value = `${latitude}, ${longitude}`;
            }

            this.validateCoordinates();

            if (this.config.onLocationChange) {
                this.config.onLocationChange({ latitude, longitude });
            }
        }
    },

    /**
     * Limpa coordenadas
     */
    clearCoordinates() {
        const latInput = document.getElementById(this.config.latitudeId);
        const lngInput = document.getElementById(this.config.longitudeId);
        const coordsInput = document.getElementById(this.config.coordsInputId);

        if (latInput) latInput.value = '';
        if (lngInput) lngInput.value = '';
        if (coordsInput) coordsInput.value = '';

        this.validateCoordinates();
    },

    /**
     * Mostra mensagem de sucesso
     * @param {string} message
     */
    showSuccess(message) {
        // Usar sistema de notificações se disponível
        if (window.PMONotifications) {
            window.PMONotifications.show(message, 'success');
        } else {
            // Fallback: criar notificação temporária
            this.showToast(message, 'success');
        }
    },

    /**
     * Mostra mensagem de erro
     * @param {string} message
     */
    showError(message) {
        if (window.PMONotifications) {
            window.PMONotifications.show(message, 'error');
        } else {
            this.showToast(message, 'error');
        }
    },

    /**
     * Mostra toast notification simples
     * @param {string} message
     * @param {string} type
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `location-toast location-toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Funções helpers globais
function abrirGoogleMaps() {
    LocationPicker.openGoogleMaps();
}

function verificarLocalizacao() {
    LocationPicker.verifyLocation();
}

// Auto-inicializar se houver campos de localização na página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('latitude') || document.getElementById('coordenadas-google-maps')) {
            LocationPicker.init();
        }
    });
} else {
    if (document.getElementById('latitude') || document.getElementById('coordenadas-google-maps')) {
        LocationPicker.init();
    }
}

// Exportar para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocationPicker;
}
