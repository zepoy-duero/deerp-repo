/**
 * Attachment Model - Represents file attachment data
 */
class AttachmentModel {
    constructor(data = {}) {
        this.AttachmentId = data.AttachmentId || null;
        this.TicketId = data.TicketId || null;
        this.AttachmentDate = data.AttachmentDate || null;
        this.AttachmentPath = data.AttachmentPath || null;
        this.SubfolderPath = data.SubfolderPath || null;
        this.FileName = data.FileName || null;
        this.FileExtension = data.FileExtension || null;
        this.FileSize = data.FileSize || null;
        this.FileAttachment = data.FileAttachment || null;
    }

    isValid() {
        return this.FileName && this.FileExtension && this.FileSize;
    }
}