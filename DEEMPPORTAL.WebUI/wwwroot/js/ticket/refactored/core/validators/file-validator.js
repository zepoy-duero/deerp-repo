/**
 * File Validator - Validates file attachments
 * Single Responsibility: Only validates files
 * Open/Closed: Can be extended for different file types
 */
class FileValidator extends IValidator {
    constructor(config = {}) {
        super();
        this.maxFileSize = config.maxFileSize || 2 * 1024 * 1024; // 2MB
        this.allowedExtensions = config.allowedExtensions || [
            '.jpg', '.jpeg', '.png', '.pdf', '.txt', 
            '.doc', '.docx', '.xls', '.xlsx', '.csv'
        ];
        this.blockedExtensions = config.blockedExtensions || [
            '.exe', '.bat', '.sh', '.cmd', '.php', '.js', '.html', '.htm', '.aspx'
        ];
        this.allowedMimeTypes = config.allowedMimeTypes || [
            'image/jpeg', 'image/png', 'application/pdf', 'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv', 'application/csv'
        ];
    }

    validate(file) {
        if (!file) {
            return { valid: false, message: 'No file selected.' };
        }

        const extension = '.' + file.name.split('.').pop().toLowerCase();

        if (this.blockedExtensions.includes(extension)) {
            return {
                valid: false,
                message: `File type "${extension}" is not allowed.`
            };
        }

        if (!this.allowedExtensions.includes(extension)) {
            return {
                valid: false,
                message: `File extension "${extension}" is not supported.`
            };
        }

        if (file.size > this.maxFileSize) {
            return {
                valid: false,
                message: `File size exceeds ${this.formatBytes(this.maxFileSize)} limit.`
            };
        }

        if (file.type && !this.allowedMimeTypes.includes(file.type.toLowerCase())) {
            return {
                valid: false,
                message: `File type "${file.type}" is not allowed.`
            };
        }

        return { valid: true, message: '' };
    }

    isValid(file) {
        return this.validate(file).valid;
    }

    validateMultiple(files) {
        const validFiles = [];
        const invalidFiles = [];

        Array.from(files).forEach(file => {
            const result = this.validate(file);
            if (result.valid) {
                validFiles.push(file);
            } else {
                invalidFiles.push({ file, message: result.message });
            }
        });

        return {
            valid: invalidFiles.length === 0,
            validFiles,
            invalidFiles
        };
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}