/**
 * Form Event Handler - Manages ticket form events
 * Single Responsibility: Only handles form-related events
 * Dependency Inversion: Depends on service abstractions
 */
class FormEventHandler {
    constructor(config = {}) {
        this.ticketForm = config.ticketForm;
        this.ticketService = config.ticketService;
        this.lookupService = config.lookupService;
        this.notificationService = config.notificationService;
        this.filePickerComponent = config.filePickerComponent;

        this.init();
    }

    init() {
        this.attachFormEvents();
        this.attachOrganizationLocationEvents();
        this.attachFileUploadEvents();
    }

    attachFormEvents() {
        // Open Create Ticket Modal
        $('#openCreateTicketModal').on('click', async (e) => {
            e.preventDefault();
            await this.openCreateTicketModal();
        });

        // Submit Create Ticket Form
        $('#submitTicket').on('click', async (e) => {
            e.preventDefault();
            await this.ticketForm.submit();
        });

        // Reset Form on Modal Close
        $('#createTicketModal').on('hidden.bs.modal', () => {
            this.ticketForm.reset();
        });
    }

    attachOrganizationLocationEvents() {
        // Organization Change
        $('#SelectTicketOrganization').on('change', async () => {
            try {
                const orgCode = $('#SelectTicketOrganization').val();
                $('#OrgCode').val(orgCode);
                await this.ticketForm.loadLocations(orgCode);
            } catch (error) {
                this.notificationService.error('Failed to load locations', 'Error');
            }
        });

        // Location Change
        $('#SelectTicketLocation').on('change', async () => {
            try {
                const orgCode = $('#SelectTicketOrganization').val();
                const locCode = $('#SelectTicketLocation').val();
                $('#LocCode').val(locCode);
                await this.ticketForm.loadDepartments(orgCode, locCode);
            } catch (error) {
                this.notificationService.error('Failed to load departments', 'Error');
            }
        });

        // Department Change
        $('#TicketDepartmentOptions').on('change', async () => {
            try {
                const orgCode = $('#SelectTicketOrganization').val();
                const locCode = $('#SelectTicketLocation').val();
                const deptCode = $('#TicketDepartmentOptions').val();
                await this.ticketForm.loadTypes(orgCode, locCode, deptCode);
            } catch (error) {
                this.notificationService.error('Failed to load types', 'Error');
            }
        });
    }

    attachFileUploadEvents() {
        // File Input Change
        $('#TicketAttachments').on('change', (e) => {
            this.handleFileSelect(e);
        });

        // Drop Zone Click
        $('#dropZone').on('click', () => {
            this.filePickerComponent.openFileDialog();
        });

        // Drag Over
        $('#dropZone').on('dragover', (e) => {
            e.preventDefault();
            $('#dropZone').addClass('dragover');
        });

        // Drag Leave
        $('#dropZone').on('dragleave', () => {
            $('#dropZone').removeClass('dragover');
        });

        // Drop
        $('#dropZone').on('drop', (e) => {
            e.preventDefault();
            $('#dropZone').removeClass('dragover');
            const files = e.dataTransfer.files;
            this.filePickerComponent.processFiles(files);
        });

        // Paste
        $(window).on('paste', (e) => {
            const clipboard = e.originalEvent.clipboardData;
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
                this.filePickerComponent.processFiles(pastedFiles);
            }
        });
    }

    handleFileSelect(e) {
        const files = e.target.files;
        this.filePickerComponent.processFiles(files);
        e.target.value = '';
    }

    async openCreateTicketModal() {
        this.ticketForm.reset();
        await this.ticketForm.loadInitialData();
        $('#createTicketModal').modal('show');
    }
}