/**
 * Ticket Service - Business logic for ticket operations
 * Single Responsibility: Orchestrates ticket-related operations
 * Dependency Inversion: Depends on repository abstractions
 */
class TicketService {
    constructor(ticketRepository, attachmentRepository, notificationService) {
        this.ticketRepository = ticketRepository;
        this.attachmentRepository = attachmentRepository;
        this.notificationService = notificationService;
    }

    async getAll(userCode) {
        try {
            return await this.ticketRepository.getAll(userCode);
        } catch (error) {
            this.notificationService.error('Failed to load tickets', 'Error');
            throw error;
        }
    }

    async getById(ticketId) {
        try {
            return await this.ticketRepository.getById(ticketId);
        } catch (error) {
            this.notificationService.error('Failed to load ticket', 'Error');
            throw error;
        }
    }

    async create(ticket, files = []) {
        try {
            if (!ticket.isValid()) {
                this.notificationService.error('Invalid ticket data', 'Validation Error');
                return null;
            }

            const createdTicket = await this.ticketRepository.create(ticket);

            if (files.length > 0 && createdTicket.TicketId) {
                await this.uploadAttachments(createdTicket.TicketId, files);
            }

            this.notificationService.success(
                `Ticket created successfully: ${createdTicket.StringTicketId}`,
                'Success'
            );

            return createdTicket;
        } catch (error) {
            this.notificationService.error('Failed to create ticket', 'Error');
            throw error;
        }
    }

    async update(ticket) {
        try {
            if (!ticket.isValid()) {
                this.notificationService.error('Invalid ticket data', 'Validation Error');
                return null;
            }

            await this.ticketRepository.update(ticket);
            this.notificationService.success('Ticket updated successfully', 'Success');
            return ticket;
        } catch (error) {
            this.notificationService.error('Failed to update ticket', 'Error');
            throw error;
        }
    }

    async delete(ticketId) {
        try {
            await this.ticketRepository.delete(ticketId);
            this.notificationService.success('Ticket deleted successfully', 'Success');
        } catch (error) {
            this.notificationService.error('Failed to delete ticket', 'Error');
            throw error;
        }
    }

    async uploadAttachments(ticketId, files) {
        try {
            return await this.attachmentRepository.upload(ticketId, files);
        } catch (error) {
            this.notificationService.warning(
                'Ticket created but attachment upload failed',
                'Partial Success'
            );
            throw error;
        }
    }

    async getAttachments(ticketId) {
        try {
            return await this.ticketRepository.getTicketAttachments(ticketId);
        } catch (error) {
            this.notificationService.error('Failed to load attachments', 'Error');
            throw error;
        }
    }

    async deleteAttachment(attachmentId) {
        try {
            await this.attachmentRepository.delete(attachmentId);
            this.notificationService.success('Attachment deleted successfully', 'Success');
        } catch (error) {
            this.notificationService.error('Failed to delete attachment', 'Error');
            throw error;
        }
    }
}