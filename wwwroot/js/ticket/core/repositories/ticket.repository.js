/**
 * Ticket Repository - Handles ticket data persistence
 * Single Responsibility: Only manages ticket data operations
 * Dependency Inversion: Depends on IApiClient abstraction
 */
class TicketRepository {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    async getAll(userCode) {
        return await this.apiClient.get('/get-filtered-tickets', { UserCode: userCode });
    }

    async getById(ticketId) {
        return await this.apiClient.get(`/get-ticket/${ticketId}`);
    }

    async create(ticket) {
        return await this.apiClient.post('/create-ticket', ticket);
    }

    async update(ticket) {
        return await this.apiClient.put('/update-ticket', ticket);
    }

    async delete(ticketId) {
        return await this.apiClient.delete(`/delete-ticket/${ticketId}`);
    }

    async getTicketAttachments(ticketId) {
        return await this.apiClient.get('/get-ticket-attachments', { ticketId });
    }
}