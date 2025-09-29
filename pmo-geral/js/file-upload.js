// File Upload Module
// PMO Form - ANC

class FileUploadManager {
    constructor() {
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        this.allowedDocumentTypes = ['application/pdf'];
        
        this.setupFileUploads();
    }

    setupFileUploads() {
        // Setup drag and drop
        this.setupDragAndDrop();
        
        // Setup file input changes
        document.querySelectorAll('input[type="file"]').forEach(input => {
            input.addEventListener('change', (e) => this.handleFileSelect(e));
        });
    }

    setupDragAndDrop() {
        const dropZones = document.querySelectorAll('.file-drop-zone');
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragenter', this.handleDragEnter.bind(this));
            zone.addEventListener('dragover', this.handleDragOver.bind(this));
            zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            zone.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('.file-drop-zone').classList.add('dragover');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Only remove dragover if actually leaving the drop zone
        if (!e.target.closest('.file-drop-zone').contains(e.relatedTarget)) {
            e.target.closest('.file-drop-zone').classList.remove('dragover');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropZone = e.target.closest('.file-drop-zone');
        dropZone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        const fileInput = dropZone.querySelector('input[type="file"]');
        
        if (files.length > 0 && fileInput) {
            // Create a new FileList
            const dt = new DataTransfer();
            for (let file of files) {
                dt.items.add(file);
            }
            fileInput.files = dt.files;
            
            // Trigger change event
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    handleFileSelect(e) {
        const input = e.target;
        const files = input.files;
        
        if (files.length === 0) return;
        
        // Validate files
        for (let file of files) {
            if (!this.validateFile(file, input)) {
                input.value = ''; // Clear invalid file
                return;
            }
        }
        
        // Handle preview based on input name/id
        if (input.id === 'croqui-file') {
            this.previewCroqui(files[0]);
        } else if (input.name && input.name.includes('fotos_propriedade')) {
            this.previewPhotos(files);
        } else {
            this.previewGenericFile(input, files[0]);
        }
    }

    validateFile(file, input) {
        // Check file size
        if (file.size > this.maxFileSize) {
            this.showError(`Arquivo "${file.name}" é muito grande. Máximo permitido: 10MB`);
            return false;
        }
        
        // Check file type based on input context
        const isImageInput = input.accept && input.accept.includes('image/*');
        const isPdfInput = input.accept && input.accept.includes('.pdf');
        
        if (isImageInput && !this.allowedImageTypes.includes(file.type)) {
            this.showError(`Tipo de arquivo não permitido: ${file.type}`);
            return false;
        }
        
        if (isPdfInput && !this.allowedDocumentTypes.includes(file.type) && 
            !this.allowedImageTypes.includes(file.type)) {
            this.showError(`Tipo de arquivo não permitido: ${file.type}`);
            return false;
        }
        
        return true;
    }

    previewCroqui(file) {
        const preview = document.getElementById('croqui-preview');
        preview.innerHTML = '';
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `
                    <div class="file-preview-item">
                        <img src="${e.target.result}" alt="Preview do croqui" style="max-width: 100%; max-height: 400px; object-fit: contain;">
                        <div class="file-info">
                            <p><strong>${file.name}</strong></p>
                            <p>Tamanho: ${this.formatFileSize(file.size)}</p>
                            <button type="button" onclick="this.closest('.file-preview').innerHTML=''" class="btn-remove">
                                ❌ Remover arquivo
                            </button>
                        </div>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            preview.innerHTML = `
                <div class="file-preview-item">
                    <div class="pdf-preview">
                        <div class="pdf-icon">📄</div>
                        <div class="file-info">
                            <p><strong>${file.name}</strong></p>
                            <p>Documento PDF</p>
                            <p>Tamanho: ${this.formatFileSize(file.size)}</p>
                            <button type="button" onclick="this.closest('.file-preview').innerHTML=''" class="btn-remove">
                                ❌ Remover arquivo
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    previewPhotos(files) {
        const preview = document.getElementById('photos-preview');
        preview.innerHTML = '';
        
        const photosGrid = document.createElement('div');
        photosGrid.className = 'photos-grid';
        photosGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem;';
        
        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const photoItem = document.createElement('div');
                    photoItem.className = 'photo-item';
                    photoItem.style.cssText = 'border: 1px solid #ddd; border-radius: 8px; overflow: hidden; position: relative;';
                    
                    photoItem.innerHTML = `
                        <img src="${e.target.result}" alt="Foto ${index + 1}" 
                             style="width: 100%; height: 120px; object-fit: cover;">
                        <div style="padding: 0.5rem;">
                            <p style="font-size: 0.8rem; margin: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                                ${file.name}
                            </p>
                            <p style="font-size: 0.7rem; color: #666; margin: 0;">
                                ${this.formatFileSize(file.size)}
                            </p>
                        </div>
                        <button type="button" onclick="this.parentElement.remove()" 
                                style="position: absolute; top: 5px; right: 5px; background: rgba(220,53,69,0.9); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 12px;">
                            ✕
                        </button>
                    `;
                    
                    photosGrid.appendChild(photoItem);
                };
                reader.readAsDataURL(file);
            }
        });
        
        preview.appendChild(photosGrid);
    }

    previewGenericFile(input, file) {
        // Find or create preview container
        let preview = input.parentElement.querySelector('.file-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.className = 'file-preview';
            input.parentElement.appendChild(preview);
        }
        
        preview.innerHTML = `
            <div class="file-preview-item">
                <div class="file-icon">
                    ${file.type.startsWith('image/') ? '🖼️' : 
                      file.type === 'application/pdf' ? '📄' : '📎'}
                </div>
                <div class="file-info">
                    <p><strong>${file.name}</strong></p>
                    <p>Tamanho: ${this.formatFileSize(file.size)}</p>
                    <button type="button" onclick="this.removeFile('${input.id}')" class="btn-remove">
                        ❌ Remover
                    </button>
                </div>
            </div>
        `;
    }

    removeFile(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = '';
            const preview = input.parentElement.querySelector('.file-preview');
            if (preview) {
                preview.innerHTML = '';
            }
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(message) {
        // Use the same notification system as main app
        if (window.showError) {
            window.showError(message);
        } else {
            alert(message);
        }
    }

    showSuccess(message) {
        if (window.showSuccess) {
            window.showSuccess(message);
        } else {
            console.log(message);
        }
    }
}

// Global functions for backwards compatibility
function previewCroqui(input) {
    if (input.files && input.files[0] && window.fileUploadManager) {
        window.fileUploadManager.previewCroqui(input.files[0]);
    }
}

function previewPhotos(input) {
    if (input.files && window.fileUploadManager) {
        window.fileUploadManager.previewPhotos(input.files);
    }
}

function dropHandler(e) {
    if (window.fileUploadManager) {
        window.fileUploadManager.handleDrop(e);
    }
}

function dragOverHandler(e) {
    if (window.fileUploadManager) {
        window.fileUploadManager.handleDragOver(e);
    }
}

// Multiple file upload management
class MultipleFileUpload {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.maxFiles = options.maxFiles || 10;
        this.files = [];
        this.allowedTypes = options.allowedTypes || [];
        
        this.setupMultipleUpload();
    }

    setupMultipleUpload() {
        const input = this.container.querySelector('input[type="file"]');
        if (input) {
            input.addEventListener('change', (e) => {
                this.handleMultipleFiles(e.target.files);
            });
        }
    }

    handleMultipleFiles(fileList) {
        const filesArray = Array.from(fileList);
        
        // Check file limits
        if (this.files.length + filesArray.length > this.maxFiles) {
            this.showError(`Máximo de ${this.maxFiles} arquivos permitidos`);
            return;
        }
        
        // Validate and add files
        filesArray.forEach(file => {
            if (this.validateFile(file)) {
                this.files.push({
                    file: file,
                    id: this.generateFileId(),
                    uploaded: false
                });
            }
        });
        
        this.renderFileList();
    }

    validateFile(file) {
        // File size validation
        if (file.size > 10 * 1024 * 1024) { // 10MB
            this.showError(`Arquivo "${file.name}" é muito grande (máx. 10MB)`);
            return false;
        }
        
        // File type validation
        if (this.allowedTypes.length > 0 && !this.allowedTypes.includes(file.type)) {
            this.showError(`Tipo de arquivo não permitido: ${file.type}`);
            return false;
        }
        
        return true;
    }

    renderFileList() {
        const listContainer = this.container.querySelector('.uploaded-files-list');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        
        this.files.forEach(fileData => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-list-item';
            fileItem.style.cssText = `
                display: flex; 
                align-items: center; 
                gap: 1rem; 
                padding: 0.5rem; 
                border: 1px solid #ddd; 
                border-radius: 4px; 
                margin-bottom: 0.5rem;
                background: white;
            `;
            
            const fileIcon = this.getFileIcon(fileData.file.type);
            const fileName = fileData.file.name;
            const fileSize = this.formatFileSize(fileData.file.size);
            
            fileItem.innerHTML = `
                <div class="file-icon">${fileIcon}</div>
                <div class="file-details" style="flex: 1;">
                    <div style="font-weight: 500;">${fileName}</div>
                    <div style="font-size: 0.8rem; color: #666;">${fileSize}</div>
                </div>
                <div class="file-status">
                    ${fileData.uploaded ? '✅' : '⏳'}
                </div>
                <button type="button" onclick="this.removeFileFromList('${fileData.id}')" 
                        class="btn-remove" style="padding: 0.25rem;">❌</button>
            `;
            
            listContainer.appendChild(fileItem);
        });
    }

    removeFileFromList(fileId) {
        this.files = this.files.filter(f => f.id !== fileId);
        this.renderFileList();
    }

    generateFileId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getFileIcon(mimeType) {
        if (mimeType.startsWith('image/')) return '🖼️';
        if (mimeType === 'application/pdf') return '📄';
        if (mimeType.includes('document')) return '📝';
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
        return '📎';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(message) {
        if (window.showError) {
            window.showError(message);
        } else {
            alert(message);
        }
    }
}

// Initialize file upload manager when DOM is ready
function setupFileUploads() {
    window.fileUploadManager = new FileUploadManager();
    
    // Setup specific multiple upload areas
    const nfUpload = document.getElementById('nf-list');
    if (nfUpload) {
        window.nfUploadManager = new MultipleFileUpload('documentos-complementares', {
            maxFiles: 20,
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
        });
    }
}

// Call setup when DOM is ready
document.addEventListener('DOMContentLoaded', setupFileUploads);