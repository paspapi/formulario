/**
 * Croqui Modal - Modal de Desenho de Croqui Interativo
 * Sistema PMO ANC - Versão 2.0
 * @description Modal reutilizável para desenho de croqui sobre mapas com Leaflet.draw
 */

const CroquiModal = {
    /**
     * Estado interno do modal
     */
    state: {
        isOpen: false,
        map: null,
        drawnItems: null,
        drawControl: null,
        currentLayer: null,
        currentEditingLayer: null,
        selectedCategory: null,
        selectedColor: null,
        targetInput: null,
        onSave: null
    },

    /**
     * Sistema de cores por categoria
     */
    categoryColors: {
        // Áreas (Polígonos)
        'pastagem': '#27ae60',
        'cultivo': '#f39c12',
        'app': '#2ecc71',
        'reserva-legal': '#16a085',
        'apicultura': '#d68910',
        'edificacao': '#e74c3c',
        'vizinhanca': '#bdc3c7',
        'outros': '#95a5a6',

        // Linhas
        'cerca-viva': '#27ae60',
        'cerca-convencional': '#7f8c8d',
        'divisa': '#2c3e50',
        'caminho': '#f39c12',

        // Água
        'rio': '#3498db',
        'acude': '#2980b9',
        'nascente': '#1abc9c'
    },

    categoryNames: {
        // Áreas
        'pastagem': 'Pastagem/Pasto',
        'cultivo': 'Cultivo/Plantio',
        'app': 'APP (Área Preservação Permanente)',
        'reserva-legal': 'Reserva Legal',
        'apicultura': 'Apicultura',
        'edificacao': 'Edificações/Construções',
        'vizinhanca': 'Vizinhança',
        'outros': 'Outros',

        // Linhas
        'cerca-viva': 'Cerca Viva',
        'cerca-convencional': 'Cerca Convencional',
        'divisa': 'Divisa/Limite Propriedade',
        'caminho': 'Caminho/Estrada',

        // Água
        'rio': 'Rio/Córrego',
        'acude': 'Açude/Lago',
        'nascente': 'Nascente/Fonte'
    },

    /**
     * Grupos de categorias por tipo de elemento
     */
    categoryGroups: {
        polygon: [
            { id: 'app', color: '#2ecc71', name: 'APP (Área Preservação Permanente)' },
            { id: 'reserva-legal', color: '#16a085', name: 'Reserva Legal' },
            { id: 'pastagem', color: '#27ae60', name: 'Pastagem/Pasto' },
            { id: 'cultivo', color: '#f39c12', name: 'Cultivo/Plantio' },
            { id: 'apicultura', color: '#d68910', name: 'Apicultura' },
            { id: 'edificacao', color: '#e74c3c', name: 'Edificações/Construções' },
            { id: 'vizinhanca', color: '#bdc3c7', name: 'Vizinhança' },
            { id: 'outros', color: '#95a5a6', name: 'Outros' }
        ],
        polyline: [
            { id: 'divisa', color: '#2c3e50', name: 'Divisa/Limite Propriedade' },
            { id: 'cerca-viva', color: '#27ae60', name: 'Cerca Viva' },
            { id: 'cerca-convencional', color: '#7f8c8d', name: 'Cerca Convencional' },
            { id: 'caminho', color: '#f39c12', name: 'Caminho/Estrada' },
            { id: 'rio', color: '#3498db', name: 'Rio/Córrego' },
            { id: 'acude', color: '#2980b9', name: 'Açude/Lago (Perímetro)' },
            { id: 'outros', color: '#95a5a6', name: 'Outros' }
        ],
        marker: [
            { id: 'nascente', color: '#1abc9c', name: 'Nascente/Fonte' },
            { id: 'edificacao', color: '#e74c3c', name: 'Edificação/Construção' },
            { id: 'apiario', color: '#d68910', name: 'Apiário' },
            { id: 'porteira', color: '#7f8c8d', name: 'Porteira/Portão' },
            { id: 'outros', color: '#95a5a6', name: 'Outros' }
        ]
    },

    /**
     * Abre o modal de croqui
     * @param {Object} options - Configurações
     * @param {HTMLElement|string} options.targetInput - Input hidden para armazenar GeoJSON
     * @param {string} options.initialData - GeoJSON inicial (opcional)
     * @param {Array} options.initialCoords - [lat, lon] para centralizar mapa (opcional)
     * @param {Function} options.onSave - Callback ao salvar (opcional)
     */
    open(options = {}) {
        if (this.state.isOpen) {
            this.close();
        }

        // Configurar estado
        this.state.targetInput = this.getElement(options.targetInput);
        this.state.onSave = options.onSave || null;

        // Criar modal
        this.createModal();
        this.state.isOpen = true;

        // Aguardar o modal estar no DOM antes de inicializar o mapa
        setTimeout(() => {
            this.initMap(options.initialCoords || [-15.7801, -47.9292]);
            if (options.initialData) {
                this.loadGeoJSONData(options.initialData);
            }
        }, 100);
    },

    /**
     * Obtém elemento HTML
     */
    getElement(input) {
        if (!input) return null;
        if (typeof input === 'string') {
            return document.getElementById(input) || document.querySelector(input);
        }
        return input;
    },

    /**
     * Cria a estrutura HTML do modal
     */
    createModal() {
        const existingModal = document.getElementById('croqui-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div id="croqui-modal" class="croqui-modal-overlay">
                <div class="croqui-modal-content">
                    <div class="croqui-header">
                        <h2>🗺️ Desenho de Croqui da Propriedade</h2>
                        <button type="button" class="croqui-close-btn" onclick="CroquiModal.close()">&times;</button>
                    </div>

                    <div class="croqui-container">
                        <div id="croqui-map" class="croqui-map"></div>

                        <div class="croqui-sidebar">
                            <div class="croqui-control-group">
                                <h3>📊 Estatísticas</h3>
                                <div class="croqui-stats">
                                    <div><strong>Polígonos:</strong> <span id="croqui-polyCount">0</span></div>
                                    <div><strong>Linhas:</strong> <span id="croqui-lineCount">0</span></div>
                                    <div><strong>Marcadores:</strong> <span id="croqui-markerCount">0</span></div>
                                    <div><strong>Área Total:</strong> <span id="croqui-totalArea">0 m²</span></div>
                                </div>
                            </div>

                            <div class="croqui-control-group">
                                <h3>📋 Elementos Cadastrados</h3>
                                <div class="croqui-area-list" id="croqui-areaList">
                                    <p style="color: #95a5a6; font-size: 12px; text-align: center; padding: 20px;">
                                        Nenhum elemento cadastrado
                                    </p>
                                </div>
                            </div>

                            <div class="croqui-control-group">
                                <h3>💾 Ações</h3>
                                <button type="button" class="croqui-btn croqui-btn-success" onclick="CroquiModal.saveAndClose()">
                                    ✅ Salvar e Fechar
                                </button>
                                <button type="button" class="croqui-btn croqui-btn-warning" onclick="CroquiModal.exportGeoJSON()">
                                    💾 Exportar GeoJSON
                                </button>
                                <button type="button" class="croqui-btn croqui-btn-primary" onclick="CroquiModal.importGeoJSON()">
                                    📂 Importar GeoJSON
                                </button>
                                <button type="button" class="croqui-btn croqui-btn-danger" onclick="CroquiModal.clearAll()">
                                    🗑️ Limpar Tudo
                                </button>
                            </div>

                            <div class="croqui-info-box">
                                <strong>💡 Elementos Obrigatórios:</strong><br>
                                ✅ Divisas/Limites da propriedade<br>
                                ✅ APP e Reserva Legal<br>
                                ✅ Fontes de água (rios, nascentes)<br>
                                ✅ Edificações/Construções<br>
                                ✅ Áreas de produção
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal de Identificação de Elemento -->
                <div class="croqui-area-modal" id="croqui-areaModal">
                    <div class="croqui-area-modal-content">
                        <div class="croqui-area-modal-header">
                            <h2 id="croqui-modalTitle">Identificar Elemento</h2>
                        </div>

                        <form id="croqui-areaForm">
                            <div class="croqui-form-group">
                                <label for="croqui-areaName">Nome/Identificação *</label>
                                <input type="text" id="croqui-areaName" required placeholder="Ex: Talhão A, Pasto Sul, Apiário 1">
                            </div>

                            <div class="croqui-form-group">
                                <label id="croqui-categoryLabel">Tipo *</label>
                                <div class="croqui-color-categories" id="croqui-categoryOptions"></div>
                            </div>

                            <div class="croqui-form-group">
                                <label for="croqui-areaCulture">Cultura/Uso</label>
                                <input type="text" id="croqui-areaCulture" placeholder="Ex: Mel, Gado, Soja, etc">
                            </div>

                            <div class="croqui-form-group">
                                <label for="croqui-areaObs">Observações</label>
                                <textarea id="croqui-areaObs" placeholder="Informações adicionais"></textarea>
                            </div>

                            <div class="croqui-form-group" id="croqui-areaInfoDisplay" style="display: none;">
                                <label>Informações Calculadas</label>
                                <div id="croqui-calculatedInfo" style="background: #ecf0f1; padding: 10px; border-radius: 4px; font-size: 13px;"></div>
                            </div>

                            <div class="croqui-modal-buttons">
                                <button type="button" class="croqui-btn croqui-btn-danger" onclick="CroquiModal.closeAreaModal()">Cancelar</button>
                                <button type="submit" class="croqui-btn croqui-btn-success">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.attachStyles();
        this.attachEventListeners();
    },

    /**
     * Anexa estilos CSS ao documento
     */
    attachStyles() {
        if (document.getElementById('croqui-modal-styles')) return;

        const styles = `
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css" />
            <style id="croqui-modal-styles">
                .croqui-modal-overlay {
                    display: flex;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    z-index: 10000;
                    padding: 20px;
                }

                .croqui-modal-content {
                    background: white;
                    border-radius: 8px;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .croqui-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    background: #2c3e50;
                    color: white;
                    border-radius: 8px 8px 0 0;
                }

                .croqui-header h2 {
                    margin: 0;
                    font-size: 18px;
                }

                .croqui-close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 32px;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                }

                .croqui-container {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                }

                .croqui-map {
                    flex: 1;
                    height: 100%;
                }

                .croqui-sidebar {
                    width: 320px;
                    background: #ecf0f1;
                    padding: 15px;
                    overflow-y: auto;
                }

                .croqui-control-group {
                    background: white;
                    padding: 12px;
                    margin-bottom: 12px;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .croqui-control-group h3 {
                    margin: 0 0 10px 0;
                    color: #2c3e50;
                    font-size: 14px;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 5px;
                }

                .croqui-stats div {
                    padding: 4px 0;
                    font-size: 13px;
                    border-bottom: 1px solid #ecf0f1;
                }

                .croqui-btn {
                    width: 100%;
                    padding: 10px;
                    margin: 5px 0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: bold;
                    transition: all 0.3s;
                }

                .croqui-btn-success {
                    background: #27ae60;
                    color: white;
                }

                .croqui-btn-success:hover {
                    background: #229954;
                }

                .croqui-btn-primary {
                    background: #3498db;
                    color: white;
                }

                .croqui-btn-primary:hover {
                    background: #2980b9;
                }

                .croqui-btn-warning {
                    background: #f39c12;
                    color: white;
                }

                .croqui-btn-warning:hover {
                    background: #d68910;
                }

                .croqui-btn-danger {
                    background: #e74c3c;
                    color: white;
                }

                .croqui-btn-danger:hover {
                    background: #c0392b;
                }

                .croqui-info-box {
                    background: #d5f4e6;
                    padding: 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    border-left: 4px solid #27ae60;
                    line-height: 1.6;
                }

                .croqui-area-list {
                    max-height: 250px;
                    overflow-y: auto;
                }

                .croqui-area-item {
                    background: white;
                    padding: 8px;
                    margin-bottom: 6px;
                    border-radius: 4px;
                    border-left: 4px solid;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 12px;
                }

                .croqui-area-item:hover {
                    background: #f8f9fa;
                    transform: translateX(3px);
                }

                .croqui-area-item-name {
                    font-weight: bold;
                    color: #2c3e50;
                }

                .croqui-area-item-info {
                    font-size: 11px;
                    color: #7f8c8d;
                    margin-top: 2px;
                }

                /* Modal de Área */
                .croqui-area-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 10001;
                    justify-content: center;
                    align-items: center;
                }

                .croqui-area-modal.active {
                    display: flex;
                }

                .croqui-area-modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .croqui-area-modal-header {
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }

                .croqui-area-modal-header h2 {
                    margin: 0;
                    color: #2c3e50;
                    font-size: 18px;
                }

                .croqui-form-group {
                    margin-bottom: 12px;
                }

                .croqui-form-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: #2c3e50;
                    font-weight: bold;
                    font-size: 13px;
                }

                .croqui-form-group input,
                .croqui-form-group textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #bdc3c7;
                    border-radius: 4px;
                    font-size: 13px;
                    box-sizing: border-box;
                }

                .croqui-form-group textarea {
                    resize: vertical;
                    min-height: 50px;
                }

                .croqui-color-categories {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }

                .croqui-color-option {
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    border: 2px solid transparent;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .croqui-color-option:hover {
                    background: #f8f9fa;
                }

                .croqui-color-option.selected {
                    border-color: #2c3e50;
                    background: #e8f4f8;
                }

                .croqui-color-box {
                    width: 20px;
                    height: 20px;
                    border-radius: 3px;
                    margin-right: 8px;
                    border: 1px solid rgba(0, 0, 0, 0.2);
                }

                .croqui-color-option-label {
                    font-size: 12px;
                    color: #2c3e50;
                }

                .croqui-modal-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }

                .croqui-modal-buttons button {
                    flex: 1;
                }

                /* Label das áreas no mapa */
                .croqui-area-label {
                    background: rgba(255, 255, 255, 0.9) !important;
                    border: 2px solid #2c3e50 !important;
                    border-radius: 4px !important;
                    padding: 3px 6px !important;
                    font-weight: bold !important;
                    font-size: 11px !important;
                    color: #2c3e50 !important;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
                }

                .croqui-area-label::before {
                    border: none !important;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    },

    /**
     * Anexa event listeners
     */
    attachEventListeners() {
        const form = document.getElementById('croqui-areaForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitAreaForm();
        });
    },

    /**
     * Inicializa o mapa Leaflet
     */
    initMap(coords) {
        if (!window.L) {
            console.error('Leaflet não carregado');
            return;
        }

        const mapElement = document.getElementById('croqui-map');
        if (!mapElement) return;

        this.state.map = L.map('croqui-map').setView(coords, 15);

        // Tile layer do Google Satellite
        L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '© Google'
        }).addTo(this.state.map);

        // Layer para desenhos
        this.state.drawnItems = new L.FeatureGroup();
        this.state.map.addLayer(this.state.drawnItems);

        // Controles de desenho
        this.state.drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true,
                    shapeOptions: { color: '#3498db', weight: 3 }
                },
                polyline: {
                    shapeOptions: { color: '#e74c3c', weight: 3 }
                },
                rectangle: {
                    shapeOptions: { color: '#9b59b6', weight: 3 }
                },
                circle: {
                    shapeOptions: { color: '#f39c12', weight: 3 }
                },
                marker: true,
                circlemarker: false
            },
            edit: {
                featureGroup: this.state.drawnItems,
                remove: true
            }
        });
        this.state.map.addControl(this.state.drawControl);

        // Eventos de desenho
        this.state.map.on(L.Draw.Event.CREATED, (event) => {
            this.state.currentLayer = event.layer;
            this.state.currentEditingLayer = null;
            this.showCalculatedInfo(event.layer, event.layerType);
            this.openAreaModal();
        });

        this.state.map.on(L.Draw.Event.EDITED, () => {
            this.updateStats();
        });

        this.state.map.on(L.Draw.Event.DELETED, () => {
            this.updateStats();
            this.updateAreaList();
        });

        // Invalidar tamanho do mapa após renderização
        setTimeout(() => {
            this.state.map.invalidateSize();
        }, 200);
    },

    /**
     * Mostra informações calculadas de um layer
     */
    showCalculatedInfo(layer, type) {
        let info = '';

        if (type === 'polygon' || type === 'rectangle' || type === 'circle') {
            let area = 0;
            if (type === 'circle') {
                area = Math.PI * Math.pow(layer.getRadius(), 2);
            } else {
                area = this.calculateGeodesicArea(layer.getLatLngs()[0]);
            }
            info = `<strong>Área:</strong> ${(area / 10000).toFixed(4)} hectares (${area.toFixed(2)} m²)`;
        } else if (type === 'polyline') {
            const length = this.calculateLength(layer);
            info = `<strong>Comprimento:</strong> ${length.toFixed(2)} m`;
        } else if (type === 'marker') {
            const latlng = layer.getLatLng();
            info = `<strong>Coordenadas:</strong> ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
        }

        document.getElementById('croqui-calculatedInfo').innerHTML = info;
        document.getElementById('croqui-areaInfoDisplay').style.display = info ? 'block' : 'none';
    },

    /**
     * Calcula área geodésica
     */
    calculateGeodesicArea(latLngs) {
        let area = 0.0;
        const d2r = Math.PI / 180;
        const pointsCount = latLngs.length;

        if (pointsCount > 2) {
            for (let i = 0; i < pointsCount; i++) {
                const p1 = latLngs[i];
                const p2 = latLngs[(i + 1) % pointsCount];
                area += ((p2.lng - p1.lng) * d2r) * (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
            }
            area = area * 6378137.0 * 6378137.0 / 2.0;
        }

        return Math.abs(area);
    },

    /**
     * Calcula comprimento de linha
     */
    calculateLength(layer) {
        const latlngs = layer.getLatLngs();
        let totalLength = 0;

        for (let i = 0; i < latlngs.length - 1; i++) {
            totalLength += latlngs[i].distanceTo(latlngs[i + 1]);
        }

        return totalLength;
    },

    /**
     * Abre modal de identificação de área
     */
    openAreaModal(layer = null) {
        const modal = document.getElementById('croqui-areaModal');
        const form = document.getElementById('croqui-areaForm');

        form.reset();
        document.querySelectorAll('.croqui-color-option').forEach(opt => opt.classList.remove('selected'));

        // Determinar tipo de elemento
        let elementType = 'polygon';
        const layerToAnalyze = layer || this.state.currentLayer;

        if (layerToAnalyze) {
            if (layerToAnalyze instanceof L.Marker) {
                elementType = 'marker';
            } else if (layerToAnalyze instanceof L.Polyline && !(layerToAnalyze instanceof L.Polygon)) {
                elementType = 'polyline';
            }
        }

        // Atualizar label
        const categoryLabel = document.getElementById('croqui-categoryLabel');
        if (elementType === 'polygon') categoryLabel.textContent = 'Tipo de Área *';
        else if (elementType === 'polyline') categoryLabel.textContent = 'Tipo de Linha *';
        else if (elementType === 'marker') categoryLabel.textContent = 'Tipo de Ponto *';

        // Renderizar opções
        const categories = this.categoryGroups[elementType];
        const categoryOptions = document.getElementById('croqui-categoryOptions');
        categoryOptions.innerHTML = categories.map(cat => `
            <div class="croqui-color-option" data-category="${cat.id}" data-color="${cat.color}">
                <div class="croqui-color-box" style="background: ${cat.color};"></div>
                <span class="croqui-color-option-label">${cat.name}</span>
            </div>
        `).join('');

        // Event listeners para opções
        document.querySelectorAll('.croqui-color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.croqui-color-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.state.selectedCategory = option.getAttribute('data-category');
                this.state.selectedColor = option.getAttribute('data-color');
            });
        });

        // Modo edição
        if (layer) {
            this.state.currentEditingLayer = layer;
            this.state.currentLayer = null;
            document.getElementById('croqui-modalTitle').textContent = 'Editar Elemento';

            const props = layer.feature?.properties || layer.properties || {};
            document.getElementById('croqui-areaName').value = props.name || '';
            document.getElementById('croqui-areaCulture').value = props.culture || '';
            document.getElementById('croqui-areaObs').value = props.observations || '';

            if (props.category) {
                this.state.selectedCategory = props.category;
                this.state.selectedColor = this.categoryColors[props.category];
                const opt = document.querySelector(`.croqui-color-option[data-category="${props.category}"]`);
                if (opt) opt.classList.add('selected');
            }

            this.showCalculatedInfo(layer, elementType);
        } else {
            document.getElementById('croqui-modalTitle').textContent = 'Identificar Elemento';
        }

        modal.classList.add('active');
    },

    /**
     * Fecha modal de identificação
     */
    closeAreaModal() {
        const modal = document.getElementById('croqui-areaModal');
        modal.classList.remove('active');

        if (this.state.currentLayer && !this.state.currentEditingLayer) {
            this.state.currentLayer = null;
        }

        this.state.selectedCategory = null;
        this.state.selectedColor = null;
    },

    /**
     * Submete formulário de identificação
     */
    submitAreaForm() {
        if (!this.state.selectedCategory) {
            alert('Por favor, selecione um tipo!');
            return;
        }

        const properties = {
            name: document.getElementById('croqui-areaName').value,
            category: this.state.selectedCategory,
            categoryName: this.categoryNames[this.state.selectedCategory],
            color: this.state.selectedColor,
            culture: document.getElementById('croqui-areaCulture').value,
            observations: document.getElementById('croqui-areaObs').value,
            createdAt: new Date().toISOString()
        };

        if (this.state.currentEditingLayer) {
            this.applyPropertiesToLayer(this.state.currentEditingLayer, properties);
        } else if (this.state.currentLayer) {
            this.applyPropertiesToLayer(this.state.currentLayer, properties);
            this.state.drawnItems.addLayer(this.state.currentLayer);
        }

        this.updateStats();
        this.updateAreaList();
        this.closeAreaModal();
    },

    /**
     * Aplica propriedades a um layer
     */
    applyPropertiesToLayer(layer, properties) {
        if (!layer.feature) {
            layer.feature = { type: 'Feature', properties: {} };
        }
        layer.feature.properties = properties;
        layer.properties = properties;

        // Aplicar estilos
        if (layer instanceof L.Polygon) {
            layer.setStyle({
                color: properties.color,
                fillColor: properties.color,
                fillOpacity: 0.4,
                weight: 3
            });
        } else if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
            let weight = 3;
            let dashArray = null;

            if (properties.category === 'divisa') {
                weight = 4;
                dashArray = '10, 5';
            }

            layer.setStyle({
                color: properties.color,
                weight: weight,
                dashArray: dashArray
            });
        } else if (layer instanceof L.Marker) {
            const iconHtml = `
                <div style="background-color: ${properties.color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
            `;
            layer.setIcon(L.divIcon({
                className: 'custom-marker',
                html: iconHtml,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            }));
        }

        // Tooltip
        if (layer instanceof L.Polygon || layer instanceof L.Circle) {
            const center = layer.getBounds ? layer.getBounds().getCenter() : layer.getLatLng();
            layer.bindTooltip(properties.name, {
                permanent: true,
                direction: 'center',
                className: 'croqui-area-label'
            }).openTooltip();
        } else if (layer instanceof L.Marker) {
            layer.bindTooltip(properties.name, {
                permanent: true,
                direction: 'right',
                offset: [12, 0],
                className: 'croqui-area-label'
            }).openTooltip();
        }

        // Popup e clique para editar
        layer.bindPopup(this.createPopupContent(layer, properties));
        layer.off('click');
        layer.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            this.openAreaModal(layer);
        });
    },

    /**
     * Cria conteúdo do popup
     */
    createPopupContent(layer, props) {
        let info = `<div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: ${props.color};">${props.name}</h3>
            <p style="margin: 5px 0;"><strong>Tipo:</strong> ${props.categoryName}</p>`;

        if (props.culture) {
            info += `<p style="margin: 5px 0;"><strong>Cultura:</strong> ${props.culture}</p>`;
        }

        if (layer instanceof L.Polygon) {
            const area = this.calculateGeodesicArea(layer.getLatLngs()[0]);
            info += `<p style="margin: 5px 0;"><strong>Área:</strong> ${(area / 10000).toFixed(4)} ha</p>`;
        } else if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
            const length = this.calculateLength(layer);
            info += `<p style="margin: 5px 0;"><strong>Comprimento:</strong> ${length.toFixed(2)} m</p>`;
        }

        if (props.observations) {
            info += `<p style="margin: 5px 0;"><strong>Obs:</strong> ${props.observations}</p>`;
        }

        info += `</div>`;
        return info;
    },

    /**
     * Atualiza estatísticas
     */
    updateStats() {
        let polyCount = 0, lineCount = 0, markerCount = 0, totalArea = 0;

        this.state.drawnItems.eachLayer((layer) => {
            if (layer instanceof L.Polygon) {
                polyCount++;
                totalArea += this.calculateGeodesicArea(layer.getLatLngs()[0]);
            } else if (layer instanceof L.Polyline) {
                lineCount++;
            } else if (layer instanceof L.Marker) {
                markerCount++;
            } else if (layer instanceof L.Circle) {
                polyCount++;
                totalArea += Math.PI * Math.pow(layer.getRadius(), 2);
            }
        });

        document.getElementById('croqui-polyCount').textContent = polyCount;
        document.getElementById('croqui-lineCount').textContent = lineCount;
        document.getElementById('croqui-markerCount').textContent = markerCount;
        document.getElementById('croqui-totalArea').textContent = `${totalArea.toFixed(2)} m² (${(totalArea / 10000).toFixed(4)} ha)`;
    },

    /**
     * Atualiza lista de áreas
     */
    updateAreaList() {
        const areaList = document.getElementById('croqui-areaList');
        const areas = [];

        this.state.drawnItems.eachLayer((layer) => {
            const props = layer.feature?.properties || layer.properties;
            if (props?.name) {
                let areaValue = '';
                if (layer instanceof L.Polygon) {
                    const area = this.calculateGeodesicArea(layer.getLatLngs()[0]);
                    areaValue = `${(area / 10000).toFixed(2)} ha`;
                } else if (layer instanceof L.Circle) {
                    const area = Math.PI * Math.pow(layer.getRadius(), 2);
                    areaValue = `${(area / 10000).toFixed(2)} ha`;
                }

                areas.push({ layer, props, areaValue });
            }
        });

        if (areas.length === 0) {
            areaList.innerHTML = '<p style="color: #95a5a6; font-size: 12px; text-align: center; padding: 20px;">Nenhum elemento cadastrado</p>';
            return;
        }

        areaList.innerHTML = areas.map(item => `
            <div class="croqui-area-item" style="border-left-color: ${item.props.color};" onclick="CroquiModal.focusOnArea('${item.props.name}')">
                <div class="croqui-area-item-name">${item.props.name}</div>
                <div class="croqui-area-item-info">${item.props.categoryName}${item.areaValue ? ` • ${item.areaValue}` : ''}</div>
            </div>
        `).join('');
    },

    /**
     * Foca em uma área específica
     */
    focusOnArea(name) {
        let foundLayer = null;
        this.state.drawnItems.eachLayer((layer) => {
            const props = layer.feature?.properties || layer.properties;
            if (props?.name === name) foundLayer = layer;
        });

        if (foundLayer) {
            if (foundLayer.getBounds) {
                this.state.map.fitBounds(foundLayer.getBounds(), { padding: [50, 50] });
            } else if (foundLayer.getLatLng) {
                this.state.map.setView(foundLayer.getLatLng(), 16);
            }
            foundLayer.openPopup();
        }
    },

    /**
     * Carrega dados GeoJSON
     */
    loadGeoJSONData(geojsonString) {
        try {
            const geojson = typeof geojsonString === 'string' ? JSON.parse(geojsonString) : geojsonString;

            this.state.drawnItems.clearLayers();

            L.geoJSON(geojson, {
                style: (feature) => {
                    if (feature.properties?.color) {
                        return {
                            color: feature.properties.color,
                            fillColor: feature.properties.color,
                            fillOpacity: 0.4,
                            weight: 3
                        };
                    }
                },
                pointToLayer: (feature, latlng) => L.marker(latlng),
                onEachFeature: (feature, layer) => {
                    if (feature.properties?.name) {
                        this.applyPropertiesToLayer(layer, feature.properties);
                    }
                    this.state.drawnItems.addLayer(layer);
                }
            });

            if (this.state.drawnItems.getLayers().length > 0) {
                this.state.map.fitBounds(this.state.drawnItems.getBounds());
            }

            this.updateStats();
            this.updateAreaList();
        } catch (error) {
            console.error('Erro ao carregar GeoJSON:', error);
            alert('Erro ao carregar dados do croqui');
        }
    },

    /**
     * Exporta GeoJSON como arquivo
     */
    exportGeoJSON() {
        const geojson = this.state.drawnItems.toGeoJSON();

        if (geojson.features.length === 0) {
            alert('Nenhum desenho para exportar!');
            return;
        }

        const dataStr = JSON.stringify(geojson, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `croqui-propriedade-${new Date().getTime()}.geojson`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Importa GeoJSON de arquivo
     */
    importGeoJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.geojson,.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                this.loadGeoJSONData(event.target.result);
                alert('GeoJSON importado com sucesso!');
            };

            reader.readAsText(file);
        };

        input.click();
    },

    /**
     * Limpa todos os desenhos
     */
    clearAll() {
        if (confirm('Tem certeza que deseja limpar todos os desenhos?')) {
            this.state.drawnItems.clearLayers();
            this.updateStats();
            this.updateAreaList();
        }
    },

    /**
     * Salva e fecha o modal
     */
    saveAndClose() {
        const geojson = this.state.drawnItems.toGeoJSON();
        const geojsonString = JSON.stringify(geojson);

        // Salvar no input target
        if (this.state.targetInput) {
            this.state.targetInput.value = geojsonString;
        }

        // Callback
        if (this.state.onSave) {
            this.state.onSave(geojsonString, geojson);
        }

        this.close();
    },

    /**
     * Fecha o modal
     */
    close() {
        const modal = document.getElementById('croqui-modal');
        if (modal) {
            modal.remove();
        }

        if (this.state.map) {
            this.state.map.remove();
        }

        this.state = {
            isOpen: false,
            map: null,
            drawnItems: null,
            drawControl: null,
            currentLayer: null,
            currentEditingLayer: null,
            selectedCategory: null,
            selectedColor: null,
            targetInput: null,
            onSave: null
        };
    }
};

// Carregar scripts do Leaflet dinamicamente
if (!window.L) {
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletScript.async = true;
    document.head.appendChild(leafletScript);

    leafletScript.onload = () => {
        const drawScript = document.createElement('script');
        drawScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
        drawScript.async = true;
        document.head.appendChild(drawScript);
    };
}
