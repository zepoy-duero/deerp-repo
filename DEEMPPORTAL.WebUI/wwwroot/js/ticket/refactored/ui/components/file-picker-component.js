/**
 * File Picker Component - UI logic for file selection and preview
 * Single Responsibility: Manages file selection UI only
 * Dependency Inversion: Depends on validator and notification services
 */
class FilePickerComponent {
    constructor(config = {}) {
        this.dropZoneSelector = config.dropZoneSelector || '#dropZone';
        this.fileInputSelector = config.fileInputSelector || '#TicketAttachments';
        this.previewContainerSelector = config.previewContainerSelector || '#previewContainer';
        this.fileValidator = config.fileValidator;
        this.notificationService = config.notificationService;
        this.maxFiles = config.maxFiles || 10;
        this.selectedFiles = [];

        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        const dropZone = document.querySelector(this.dropZoneSelector);
        const fileInput = document.querySelector(this.fileInputSelector);

        if (dropZone) {
            dropZone.addEventListener('click', () => this.openFileDialog());
            dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
            dropZone.addEventListener('dragleave', () => this.handleDragLeave());
            dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        document.addEventListener('paste', (e) => this.handlePaste(e));
    }

    openFileDialog() {
        const fileInput = document.querySelector(this.fileInputSelector);
        if (fileInput) {
            if (typeof fileInput.showPicker === 'function') {
                fileInput.showPicker();
            } else {
                fileInput.click();
            }
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        const dropZone = document.querySelector(this.dropZoneSelector);
        if (dropZone) dropZone.classList.add('dragover');
    }

    handleDragLeave() {
        const dropZone = document.querySelector(this.dropZoneSelector);
        if (dropZone) dropZone.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        const dropZone = document.querySelector(this.dropZoneSelector);
        if (dropZone) dropZone.classList.remove('dragover');
        const files = event.dataTransfer.files;
        this.processFiles(files);
    }

    handleFileSelect(event) {
        const files = event.target.files;
        this.processFiles(files);
        event.target.value = '';
    }

    handlePaste(event) {
        const clipboard = event.clipboardData;
        if (!clipboard) return;

        const pastedFiles = [];
        for (const item of clipboard.items) {
            if (!item.type.startsWith('image')) continue;

            const blob = item.getAsFile();
            if (blob) {
                const file = new File([blob], `screenshot_${Date.now()}.png`, { type: blob.type });
                pastedFiles.push(file);
            }
        }

        if (pastedFiles.length > 0) {
            this.processFiles(pastedFiles);
        }
    }

    processFiles(files) {
        if (this.selectedFiles.length + files.length > this.maxFiles) {
            this.notificationService.warning(
                `Maximum ${this.maxFiles} files allowed.`,
                'File Limit'
            );
            return;
        }

        Array.from(files).forEach(file => {
            const validation = this.fileValidator.validate(file);

            if (!validation.valid) {
                this.notificationService.warning(validation.message, 'Invalid File');
                return;
            }

            if (this.isDuplicate(file)) {
                this.notificationService.warning(`${file.name} is already selected.`, 'Duplicate');
                return;
            }

            this.selectedFiles.push(file);
            this.renderFilePreview(file);
        });
    }

    isDuplicate(file) {
        return this.selectedFiles.some(
            f => f.name === file.name && f.size === file.size
        );
    }

    renderFilePreview(file) {
        const container = document.querySelector(this.previewContainerSelector);
        const item = document.createElement('div');
        item.className = 'file-preview-item';

        const icon = document.createElement('img');
        icon.className = 'file-icon';
        icon.src = file.type.startsWith('image/') 
            ? URL.createObjectURL(file)
            : this.getFileIcon(file.type);

        const info = document.createElement('div');
        info.className = 'file-info';
        info.innerHTML = `
            <div><strong>${this.escapeHtml(file.name)}</strong></div>
            <small class="text-muted">${this.formatFileSize(file.size)}</small>
        `;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-sm btn-outline-danger';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.removeFile(file, item);
        });

        info.insertBefore(icon, info.firstChild);
        item.appendChild(info);
        item.appendChild(removeBtn);
        container.appendChild(item);
    }

    removeFile(file, element) {
        this.selectedFiles = this.selectedFiles.filter(f => f !== file);
        element.remove();
    }

    getFileIcon(mimeType) {
        if (mimeType === 'application/pdf') {
            return 'https://cdn-icons-png.flaticon.com/512/337/337946.png';
        }
        return 'https://cdn-icons-png.flaticon.com/512/732/732220.png';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    getSelectedFiles() {
        return this.selectedFiles;
    }

    clearSelectedFiles() {
        this.selectedFiles = [];
        const container = document.querySelector(this.previewContainerSelector);
        if (container) container.innerHTML = '';
    }
}