/**
 * Attachment Repository - Handles attachment data persistence
 * Single Responsibility: Only manages attachment data operations
 * Dependency Inversion: Depends on IApiClient abstraction
 */
class AttachmentRepository {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    async upload(ticketId, files) {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files', file);
        });
        formData.append('ticketId', ticketId);

        return await this.apiClient.post('/upload-ticket-attachments', formData);
    }

    async get(attachmentId) {
        return await this.apiClient.get('/get-attachment', { AttachmentId: attachmentId });
    }

    async delete(attachmentId) {
        return await this.apiClient.post(`/delete-attachment?attachmentId=${attachmentId}`);
    }

    async uploadEditFiles(ticketId, files) {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('file', file);
        });
        return await this.apiClient.post(
            `/upload-ticket-attachments?ticketId=${ticketId}`,
            formData
        );
    }
}