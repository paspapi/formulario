// Drawing Module for Croqui
// PMO Form - ANC

class DrawingCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.currentColor = '#000000';
        this.currentLineWidth = 2;
        this.lastX = 0;
        this.lastY = 0;
        this.history = [];
        this.historyIndex = -1;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.saveState();
    }

    setupCanvas() {
        // Set canvas background to white
        this.context.fillStyle = '#ffffff';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set initial drawing properties
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.strokeStyle = this.currentColor;
        this.context.lineWidth = this.currentLineWidth;
        
        // Make canvas responsive
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const maxWidth = Math.min(containerWidth - 40, 800);
        
        if (this.canvas.width !== maxWidth) {
            const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.width = maxWidth;
            this.canvas.height = (maxWidth * 3) / 4; // 4:3 aspect ratio
            this.context.putImageData(imageData, 0, 0);
            this.setupCanvas();
        }
    }

    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Prevent scrolling when touching canvas
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }

    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    getTouchCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.touches[0].clientX - rect.left) * scaleX,
            y: (e.touches[0].clientY - rect.top) * scaleY
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCoordinates(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
        
        if (this.currentTool === 'text') {
            this.addText(coords.x, coords.y);
            this.isDrawing = false;
            return;
        }
        
        this.context.beginPath();
        this.context.moveTo(this.lastX, this.lastY);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const coords = this.getCoordinates(e);
        
        this.context.lineWidth = this.currentLineWidth;
        this.context.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.currentColor;
        this.context.globalCompositeOperation = this.currentTool === 'eraser' ? 'destination-out' : 'source-over';
        
        if (this.currentTool === 'eraser') {
            this.context.lineWidth = 20; // Make eraser bigger
        }
        
        this.context.lineTo(coords.x, coords.y);
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(coords.x, coords.y);
        
        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.context.globalCompositeOperation = 'source-over';
            this.saveState();
        }
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        this.canvas.dispatchEvent(mouseEvent);
    }

    setTool(tool) {
        this.currentTool = tool;
        
        // Update cursor
        switch(tool) {
            case 'pen':
                this.canvas.style.cursor = 'crosshair';
                break;
            case 'eraser':
                this.canvas.style.cursor = 'grab';
                break;
            case 'text':
                this.canvas.style.cursor = 'text';
                break;
            default:
                this.canvas.style.cursor = 'default';
        }
        
        // Update tool button states
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
    }

    setColor(color) {
        this.currentColor = color;
        this.context.strokeStyle = color;
    }

    setLineWidth(width) {
        this.currentLineWidth = width;
        this.context.lineWidth = width;
    }

    addText(x, y) {
        const text = prompt('Digite o texto:');
        if (text) {
            this.context.font = '16px Arial';
            this.context.fillStyle = this.currentColor;
            this.context.fillText(text, x, y);
            this.saveState();
        }
    }

    clearCanvas() {
        if (confirm('Tem certeza que deseja limpar todo o desenho?')) {
            this.context.fillStyle = '#ffffff';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.saveState();
        }
    }

    saveState() {
        this.historyIndex++;
        
        // Remove future history if we're not at the end
        if (this.historyIndex < this.history.length) {
            this.history.length = this.historyIndex;
        }
        
        // Add current state
        this.history.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
        
        // Limit history size
        if (this.history.length > 20) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.context.putImageData(this.history[this.historyIndex], 0, 0);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.context.putImageData(this.history[this.historyIndex], 0, 0);
        }
    }

    saveDrawing() {
        // Convert canvas to blob
        this.canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'croqui_propriedade.png';
            a.click();
            URL.revokeObjectURL(url);
            
            // Also save to hidden input for form submission
            this.saveToFormData(blob);
        }, 'image/png');
    }

    saveToFormData(blob) {
        // Create a File object from the blob
        const file = new File([blob], 'croqui_desenho.png', { type: 'image/png' });
        
        // Create a DataTransfer object and add the file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        
        // Set the files to a hidden file input
        let hiddenInput = document.getElementById('croqui-drawing-data');
        if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'file';
            hiddenInput.id = 'croqui-drawing-data';
            hiddenInput.name = 'croqui_drawing';
            hiddenInput.style.display = 'none';
            document.getElementById('croqui').appendChild(hiddenInput);
        }
        
        hiddenInput.files = dataTransfer.files;
        
        if (window.showSuccess) {
            window.showSuccess('Desenho salvo! Será incluído no envio do formulário.');
        }
    }

    loadFromFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.clearCanvas();
                this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                this.saveState();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    hasDrawing() {
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Check if any pixel is not white (255, 255, 255, 255)
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            if (a > 0 && (r !== 255 || g !== 255 || b !== 255)) {
                return true;
            }
        }
        
        return false;
    }
}

// Upload type selection
function selectUploadType(type) {
    // Hide all upload types
    document.querySelectorAll('.upload-type').forEach(element => {
        element.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.upload-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected type
    const selectedType = document.getElementById(type + '-upload-area') || 
                         document.getElementById(type.replace('file', 'file-upload') + '-area') ||
                         document.getElementById(type.replace('draw', 'draw') + '-area') ||
                         document.getElementById(type.replace('maps', 'maps') + '-area');
    
    if (selectedType) {
        selectedType.style.display = 'block';
    }
    
    // Add active class to selected button
    document.querySelector(`[onclick="selectUploadType('${type}')"]`).classList.add('active');
    
    // Initialize drawing canvas if draw is selected
    if (type === 'draw' && !window.drawingCanvas) {
        setTimeout(() => {
            window.drawingCanvas = new DrawingCanvas('drawing-canvas');
        }, 100);
    }
}

// Tool functions
function setTool(tool) {
    if (window.drawingCanvas) {
        window.drawingCanvas.setTool(tool);
    }
}

function setPenColor(color) {
    if (window.drawingCanvas) {
        window.drawingCanvas.setColor(color);
    }
}

function clearCanvas() {
    if (window.drawingCanvas) {
        window.drawingCanvas.clearCanvas();
    }
}

function saveDrawing() {
    if (window.drawingCanvas) {
        window.drawingCanvas.saveDrawing();
    }
}

function undoDrawing() {
    if (window.drawingCanvas) {
        window.drawingCanvas.undo();
    }
}

function redoDrawing() {
    if (window.drawingCanvas) {
        window.drawingCanvas.redo();
    }
}

// Maps integration
function embedMap(url) {
    if (!url) return;
    
    // Extract coordinates or place ID from Google Maps URL
    const mapEmbed = document.getElementById('map-embed');
    
    // Simple iframe embed (Note: in production, you'd want to use Google Maps API)
    mapEmbed.innerHTML = `
        <div style="text-align: center; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; margin: 1rem 0;">
            <p style="color: #666; margin-bottom: 1rem;">
                📍 Link do Google Maps fornecido
            </p>
            <p style="font-size: 0.9rem; word-break: break-all; background: #f5f5f5; padding: 1rem; border-radius: 4px;">
                ${url}
            </p>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                Para capturar o mapa, acesse o link e faça uma captura de tela, depois faça upload como imagem.
            </p>
            <button type="button" onclick="openMapInNewWindow('${url}')" class="btn-secondary" style="margin-top: 1rem;">
                🔗 Abrir Mapa em Nova Janela
            </button>
        </div>
    `;
    
    // Show capture button
    document.querySelector('[onclick="captureMap()"]').style.display = 'inline-block';
}

function loadMap() {
    const url = document.getElementById('maps-url').value;
    if (url) {
        embedMap(url);
    } else {
        if (window.showError) {
            window.showError('Por favor, insira um link do Google Maps');
        }
    }
}

function openMapInNewWindow(url) {
    window.open(url, '_blank', 'width=1000,height=800');
}

function captureMap() {
    alert('Para capturar o mapa:\n\n1. Abra o mapa em nova janela\n2. Faça uma captura de tela (Print Screen)\n3. Salve como imagem\n4. Volte aqui e faça upload da imagem na aba "Upload de Arquivo"');
}

// Drawing canvas setup
function setupDrawingCanvas() {
    // This will be called from the main app initialization
    const canvas = document.getElementById('drawing-canvas');
    if (canvas) {
        // Canvas will be initialized when draw tab is selected
        return true;
    }
    return false;
}

// Keyboard shortcuts for drawing
document.addEventListener('keydown', function(e) {
    if (document.getElementById('draw-area').style.display !== 'none') {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        redoDrawing();
                    } else {
                        undoDrawing();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    redoDrawing();
                    break;
            }
        }
        
        // Tool shortcuts
        switch(e.key) {
            case 'p':
                setTool('pen');
                break;
            case 'e':
                setTool('eraser');
                break;
            case 't':
                setTool('text');
                break;
            case 'c':
                if (e.ctrlKey) {
                    e.preventDefault();
                    clearCanvas();
                }
                break;
        }
    }
});

// Add drawing tools to the interface
function addDrawingTools() {
    const toolsContainer = document.querySelector('.drawing-tools');
    if (toolsContainer && !toolsContainer.querySelector('.advanced-tools')) {
        const advancedTools = document.createElement('div');
        advancedTools.className = 'advanced-tools';
        advancedTools.style.cssText = 'margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;';
        
        advancedTools.innerHTML = `
            <button type="button" onclick="undoDrawing()" class="btn-secondary" title="Ctrl+Z">
                ↶ Desfazer
            </button>
            <button type="button" onclick="redoDrawing()" class="btn-secondary" title="Ctrl+Y">
                ↷ Refazer
            </button>
            <div class="line-width-control" style="display: flex; align-items: center; gap: 0.5rem;">
                <label>Espessura:</label>
                <input type="range" min="1" max="20" value="2" 
                       onchange="if(window.drawingCanvas) window.drawingCanvas.setLineWidth(this.value)"
                       style="width: 80px;">
            </div>
            <button type="button" onclick="loadImageToCanvas()" class="btn-secondary">
                📁 Carregar Imagem
            </button>
        `;
        
        toolsContainer.appendChild(advancedTools);
    }
}

function loadImageToCanvas() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file && window.drawingCanvas) {
            window.drawingCanvas.loadFromFile(file);
        }
    };
    input.click();
}

// Initialize drawing functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add advanced tools when drawing area becomes visible
    const drawArea = document.getElementById('draw-area');
    if (drawArea) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (drawArea.style.display !== 'none') {
                        setTimeout(addDrawingTools, 100);
                    }
                }
            });
        });
        
        observer.observe(drawArea, { attributes: true });
    }
});