    /**
 * Application Bootstrap - Initializes all services and components
 * Dependency Injection: Wires up all dependencies
 */
class TicketApplicationBootstrapper {
    static async initialize() {
        try {
            console.log('Initializing Ticket Application...');

            // 1. Initialize Services
            const apiClient = new ApiClientService('/MyTickets');
            const storage = new StorageService(false);
            const notificationService = NotificationService;

            // 2. Initialize Repositories
            const ticketRepository = new TicketRepository(apiClient);
            const attachmentRepository = new AttachmentRepository(apiClient);
            const lookupRepository = new LookupRepository(apiClient);

            // 3. Initialize Validators
            const fileValidator = new FileValidator();
            const formValidator = new FormValidator();

            // 4. Initialize Business Logic Services
            const ticketService = new TicketService(
                ticketRepository,
                attachmentRepository,
                notificationService
            );

            const lookupService = new LookupService(
                lookupRepository,
                storage,
                notificationService
            );

            // 5. Initialize UI Components
            const filePickerComponent = new FilePickerComponent({
                dropZoneSelector: '#dropZone',
                fileInputSelector: '#TicketAttachments',
                previewContainerSelector: '#previewContainer',
                fileValidator: fileValidator,
                notificationService: notificationService,
                maxFiles: 10
            });

            const attachmentComponent = new AttachmentComponent({
                selector: '#attachmentsPreviewContainer',
                attachmentRepository: attachmentRepository,
                fileValidator: fileValidator,
                notificationService: notificationService
            });

            const ticketTableComponent = new TicketTableComponent({
                tableSelector: '#ticketsTable',
                ticketService: ticketService,
                notificationService: notificationService,
                totalRecordsSelector: '#TicketsTotal'
            });

            // 6. Get current user
            const currentUser = await this.getCurrentUser(apiClient);

            // 7. Initialize Forms
            const ticketForm = new TicketForm({
                formSelector: '#createTicketForm',
                ticketService: ticketService,
                lookupService: lookupService,
                formValidator: formValidator,
                fileValidator: fileValidator,
                notificationService: notificationService,
                filePickerComponent: filePickerComponent,
                currentUser: currentUser
            });

            // 8. Initialize Filters
            const filterManager = new TicketFilterManager({
                containerSelector: '#filtersContainer',
                lookupService: lookupService,
                notificationService: notificationService
            });

            // 9. ✅ Initialize Event Handlers (NEW)
            EventHandlerBootstrapper.initialize({
                ticketForm,
                ticketService,
                lookupService,
                filePickerComponent,
                attachmentComponent,
                ticketTableComponent,
                filterManager,
                notificationService
            });

            // 10. Make components globally accessible
            window.ticketApp = {
                ticketService,
                lookupService,
                filePickerComponent,
                attachmentComponent,
                ticketTableComponent,
                ticketForm,
                filterManager,
                currentUser
            };

            // 11. Load initial data
            await ticketTableComponent.loadTickets(currentUser.USER_CODE);

            console.log('✅ Ticket Application Initialized Successfully');

        } catch (error) {
            console.error('❌ Failed to initialize ticket application:', error);
            NotificationService.error('Failed to initialize application', 'Error');
        }
    }

    static async getCurrentUser(apiClient) {
        try {
            const userData = await apiClient.get('/home/getUserDetails');
            return new UserModel(userData);
        } catch (error) {
            console.error('Failed to load user data:', error);
            throw error;
        }
    }
}

// Initialize on document ready
$(document).ready(() => {
    TicketApplicationBootstrapper.initialize();
});