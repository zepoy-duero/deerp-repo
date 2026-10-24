/**
 * Attachment Component - UI logic for attachment handling
 * Single Responsibility: Manages attachment UI only
 * Dependency Inversion: Depends on service abstractions
 */
class AttachmentComponent {
    constructor(config = {}) {
        this.selector = config.selector || '#attachmentsPreviewContainer';
        this.attachmentRepository = config.attachmentRepository;
        this.fileValidator = config.fileValidator;
        this.notificationService = config.notificationService;
        this.container = document.querySelector(this.selector);
        this.selectedFiles = [];
    }

    render(attachments) {
        if (!attachments || attachments.length === 0) {
            this.renderEmpty();
            return;
        }

        const html = attachments.map(att => this.createAttachmentElement(att)).join('');
        this.container.innerHTML = html;
    }

    renderEmpty() {
        this.container.innerHTML = `
            <div id="emptyState" class="alert alert-light text-center border-dashed m-0">
                <i class="bi bi-paperclip text-muted fs-4"></i>
                <p class="text-muted small mb-0">No files attached yet.</p>
            </div>
        `;
    }

    createAttachmentElement(attachment) {
        const icon = this.getAttachmentIcon(attachment.FileExtension);
        return `
            <div class="file-preview-item px-3" data-attachment-id="${attachment.AttachmentId}">
                <div class="file-info">
                    <img class="file-icon" src="${icon}" />
                    <div>
                        <div>
                            <span style="cursor: pointer;" class="text-decoration-underline text-primary" 
                                onclick="window.ticketApp.attachmentComponent.viewAttachment(${attachment.AttachmentId})">
                                <strong>${this.escapeHtml(attachment.FileName)}</strong>
                            </span>
                        </div>
                        <small class="text-muted">${attachment.FileSize} KB</small>
                    </div>
                </div>
                <div class="btn-toolbar" role="toolbar">
                    <div class="btn-group me-2" role="group">
                        <button type="button" class="btn btn-primary btn-sm"
                            onclick="window.ticketApp.attachmentComponent.downloadAttachment(${attachment.AttachmentId})">
                            <i class="bi bi-download"></i>
                        </button>
                    </div>
                    <div class="btn-group me-2" role="group">
                        <button type="button" class="btn btn-danger btn-sm"
                            onclick="window.ticketApp.attachmentComponent.deleteAttachment(${attachment.AttachmentId})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getAttachmentIcon(fileExtension) {
        const iconMap = {
            '.pdf': 'img/pdf-icon.png',
            '.xlsx': 'img/excel-icon.png',
            '.xls': 'img/excel-icon.png',
            '.docx': 'img/docs-icon.png',
            '.doc': 'img/docs-icon.png',
            '.txt': 'img/textfile-icon.png'
        };
        return iconMap[fileExtension?.toLowerCase()] || 'img/image-icon.png';
    }

    escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    async viewAttachment(attachmentId) {
        try {
            const fileData = await this.attachmentRepository.get(attachmentId);
            this.showPreview(fileData);
        } catch (error) {
            this.notificationService.error('Failed to preview attachment', 'Error');
        }
    }

    async downloadAttachment(attachmentId) {
        try {
            const file = await this.attachmentRepository.get(attachmentId);
            this.downloadFile(file);
            this.notificationService.success(`Downloaded: ${file.FileName}`, 'Success');
        } catch (error) {
            this.notificationService.error('Failed to download attachment', 'Error');
        }
    }

    async deleteAttachment(attachmentId) {
        if (!confirm('Are you sure you want to delete this attachment?')) {
            return;
        }

        try {
            await this.attachmentRepository.delete(attachmentId);
            const element = document.querySelector(`[data-attachment-id="${attachmentId}"]`);
            if (element) {
                element.remove();
            }
            this.notificationService.success('Attachment deleted successfully', 'Success');
        } catch (error) {
            this.notificationService.error('Failed to delete attachment', 'Error');
        }
    }

    downloadFile(fileData) {
        const mimeType = this.getMimeType(fileData.FileName);
        const dataUrl = `data:${mimeType};base64,${fileData.FileAttachment}`;

        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileData.FileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            });
    }

    showPreview(fileData) {
        const mimeType = this.getMimeType(fileData.FileName);
        const extension = fileData.FileName.split('.').pop().toLowerCase();

        let previewHtml;
        if (extension === 'pdf') {
            previewHtml = `<iframe src="data:${mimeType};base64,${fileData.FileAttachment}" 
                class="w-100 h-100" style="border:none; min-height: 500px;"></iframe>`;
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
            previewHtml = `<img src="data:${mimeType};base64,${fileData.FileAttachment}" 
                class="img-fluid" style="max-height: 100%; object-fit: contain;" alt="Preview">`;
        } else {
            previewHtml = `<div class="text-center p-5">
                <h5>Preview unavailable for this file format</h5>
                <a href="javascript:void(0)" onclick="window.ticketApp.attachmentComponent.downloadAttachment('${fileData.AttachmentId}')" 
                    class="btn btn-secondary mt-2">Download File Instead</a>
            </div>`;
        }

        this.showPreviewModal(fileData.FileName, previewHtml);
    }

    showPreviewModal(fileName, html) {
        const modal = document.querySelector('#filePreviewModal');
        if (modal) {
            document.querySelector('#preview-filename').textContent = `Preview: ${fileName}`;
            document.querySelector('#file-preview-zone').innerHTML = html;
            new bootstrap.Modal(modal).show();
        }
    }

    getMimeType(filename) {
        const mimeTypes = {
            'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif',
            'svg': 'image/svg+xml', 'webp': 'image/webp', 'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'txt': 'text/plain', 'zip': 'application/zip', 'rar': 'application/vnd.rar'
        };
        const ext = filename.split('.').pop().toLowerCase();
        return mimeTypes[ext] || 'application/octet-stream';
    }
}