/**
 * Attachment Event Handler - Manages attachment events
 * Single Responsibility: Only handles attachment-related events
 * Dependency Inversion: Depends on service abstractions
 */
class AttachmentEventHandler {
    constructor(config = {}) {
        this.attachmentComponent = config.attachmentComponent;
        this.notificationService = config.notificationService;

        this.init();
    }

    init() {
        this.attachAttachmentEvents();
    }

    attachAttachmentEvents() {
        // View Attachment (handled via inline onclick in AttachmentComponent)
        // Download Attachment (handled via inline onclick in AttachmentComponent)
        // Delete Attachment (handled via inline onclick in AttachmentComponent)

        // Alternative: Direct event delegation
        $(document).on('click', '[data-attachment-action="view"]', async (e) => {
            const attachmentId = $(e.target).closest('[data-attachment-id]').data('attachment-id');
            await this.attachmentComponent.viewAttachment(attachmentId);
        });

        $(document).on('click', '[data-attachment-action="download"]', async (e) => {
            const attachmentId = $(e.target).closest('[data-attachment-id]').data('attachment-id');
            await this.attachmentComponent.downloadAttachment(attachmentId);
        });

        $(document).on('click', '[data-attachment-action="delete"]', async (e) => {
            const attachmentId = $(e.target).closest('[data-attachment-id]').data('attachment-id');
            await this.attachmentComponent.deleteAttachment(attachmentId);
        });
    }
}