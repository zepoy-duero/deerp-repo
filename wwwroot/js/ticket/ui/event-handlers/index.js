/**
 * Event Handlers Index - Initializes all event handlers
 * Dependency Injection: Wires up all event handlers
 */
class EventHandlerBootstrapper {
    static initialize(config = {}) {
        const {
            ticketForm,
            ticketService,
            lookupService,
            filePickerComponent,
            attachmentComponent,
            ticketTableComponent,
            filterManager,
            notificationService
        } = config;

        // Initialize Form Event Handler
        new FormEventHandler({
            ticketForm,
            ticketService,
            lookupService,
            notificationService,
            filePickerComponent
        });

        // Initialize Edit Event Handler
        new EditEventHandler({
            ticketService,
            notificationService,
            ticketTableComponent
        });

        // Initialize Table Event Handler
        new TableEventHandler({
            ticketTableComponent,
            filterManager,
            notificationService
        });

        // Initialize Attachment Event Handler
        new AttachmentEventHandler({
            attachmentComponent,
            notificationService
        });

        console.log('✅ Event Handlers Initialized');
    }
}