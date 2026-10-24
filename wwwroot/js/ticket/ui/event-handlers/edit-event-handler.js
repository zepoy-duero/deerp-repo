/**
 * Edit Event Handler - Manages ticket edit events
 * Single Responsibility: Only handles edit-related events
 * Dependency Inversion: Depends on service abstractions
 */
class EditEventHandler {
    constructor(config = {}) {
        this.ticketService = config.ticketService;
        this.notificationService = config.notificationService;
        this.ticketTableComponent = config.ticketTableComponent;

        this.init();
    }

    init() {
        this.attachTableRowClickEvents();
        this.attachEditFormEvents();
        this.attachToggleEditEvents();
        this.attachFileUploadEditEvents();
    }

    attachTableRowClickEvents() {
        const $table = $('#ticketsTable');

        $table.on('click-row.bs.table', async (e, row, $element, field) => {
            try {
                await this.openEditModal(row);
            } catch (error) {
                this.notificationService.error('Failed to load ticket details', 'Error');
                console.error('Edit modal error:', error);
            }
        });
    }

    attachEditFormEvents() {
        // Update Ticket
        $('#btnUpdateTicket').on('click', async (e) => {
            e.preventDefault();
            await this.updateTicket();
        });

        // Change Organization (Edit Modal)
        $('#changeOrganization').on('click', () => {
            $('#selectOrg, #SelectTicketOrganization').toggleClass('d-none');
            $('#changeOrganization').toggleClass('bi-pencil bi-sign-do-not-enter-fill');
        });

        // Change Location (Edit Modal)
        $('#changeLocation').on('click', () => {
            $('#selectLoc, #SelectTicketLocation').toggleClass('d-none');
            $('#changeLocation').toggleClass('bi-pencil bi-sign-do-not-enter-fill');
        });

        // Organization Change in Edit Modal
        $('#SelectTicketOrganization').on('change', async () => {
            try {
                const orgCode = $('#SelectTicketOrganization').val();
                await this.loadLocations(orgCode);
            } catch (error) {
                this.notificationService.error('Failed to load locations', 'Error');
            }
        });

        // Location Change in Edit Modal
        $('#SelectTicketLocation').on('change', async () => {
            try {
                const orgCode = $('#SelectTicketOrganization').val();
                const locCode = $('#SelectTicketLocation').val();
                await this.loadDepartments(orgCode, locCode);
            } catch (error) {
                this.notificationService.error('Failed to load departments', 'Error');
            }
        });

        // Modal Close
        $('#editTicketModal').on('hidden.bs.modal', () => {
            this.resetEditState();
        });
    }

    attachToggleEditEvents() {
        // Toggle Edit User Request
        $('#toggleEditUserRequest').on('change', (e) => {
            this.toggleUserRequestEdit(e);
        });

        // Toggle Edit Assignment
        $('#toggleEditAssignment').on('change', (e) => {
            this.toggleAssignmentEdit(e);
        });

        // Toggle Edit Approvals
        $('#toggleEditApprovals').on('change', (e) => {
            this.toggleApprovalsEdit(e);
        });

        // Toggle Edit Review
        $('#toggleEditReview').on('change', (e) => {
            this.toggleReviewEdit(e);
        });
    }

    attachFileUploadEditEvents() {
        // Add Attachment Button
        $('#addAttachmentBtn').on('click', (e) => {
            e.preventDefault();
            $('#editTicketAttachments').trigger('click');
        });

        // Edit File Input Change
        $('#editTicketAttachments').on('change', async (e) => {
            await this.handleEditFileSelect(e);
        });
    }

    async openEditModal(row) {
        window.selectedTicket = row;

        // Set modal title
        $('#editTicketModalTitle').empty().append(
            `<i class="bi bi-ticket-detailed-fill me-2"></i>Update Ticket - ${row.StringTicketId} (${row.TicketSubject})`
        );

        // Load all select options
        await window.ticketApp.lookupService.getOrganizations();
        await window.ticketApp.lookupService.getUsers();

        // Load attachments
        if (typeof loadTicketAttachments === 'function') {
            await loadTicketAttachments(row.TicketId);
        }

        // Show modal
        $('#editTicketModal').modal('show');
    }

    toggleUserRequestEdit(e) {
        const isChecked = e.target.checked;

        $('#userRequestEditBtn, #userRequestUpdateBtn').toggleClass('d-none');

        // Toggle Requested By
        $('#displayRequestedByName')
            .toggleClass('form-control-plaintext form-select')
            .prop('disabled', (i, val) => !val);

        // Toggle Requested Date
        $('#displayRequestedDate, #editRequestedDate').toggleClass('d-none');
        if (isChecked && window.selectedTicket) {
            $('#editRequestedDate').val(
                moment(window.selectedTicket.RequestedDate).format('YYYY-MM-DD')
            );
        }

        // Toggle Subject
        $('#ticketSubject')
            .prop('disabled', (i, val) => !val)
            .toggleClass('form-control-plaintext form-control');

        // Toggle Description Editor
        if (isChecked) {
            $('#editTicketDescription').summernote('enable');
        } else {
            $('#editTicketDescription').summernote('disable');
        }

        // Toggle Attachment Buttons
        $('#attachmentsPreviewContainer .btn-toolbar').toggleClass('d-none');
        $('#addAttachmentBtn').toggleClass('d-none');
    }

    toggleAssignmentEdit(e) {
        const isChecked = e.target.checked;

        $('#assigneeDropdownSelect, #priorityCode, #moduleDropdownSelect, #typeDropdownSelect, #ticketDurationUnit')
            .toggleClass('form-control-plaintext form-select')
            .prop('disabled', (i, val) => !val);

        $('#ticketDuration, #startDate, #finishDate')
            .prop('disabled', (i, val) => !val);

        $('#statusCode, #statusName').toggleClass('d-none');
    }

    toggleApprovalsEdit(e) {
        const isChecked = e.target.checked;

        $('#approveByManager')
            .toggleClass('form-control-plaintext text-muted form-select')
            .prop('disabled', (i, val) => !val);

        if (isChecked) {
            $('#approvalStatus').val('Pending');
        }
    }

    toggleReviewEdit(e) {
        const isChecked = e.target.checked;

        $('#reviewedByName, #reviewedDate, #versionNo, #remarks, #txtCorrespondence')
            .prop('disabled', (i, val) => !val);

        $('#addCorrespondenceBtn, #addCorrespondenceAttachmentBtn')
            .toggleClass('d-none');
    }

    async handleEditFileSelect(e) {
        const files = e.target.files;
        if (files.length === 0) return;

        try {
            if (window.selectedTicket && window.selectedTicket.TicketId) {
                await window.ticketApp.attachmentComponent.filePickerComponent.processFiles(files);

                // Upload files
                await window.ticketApp.ticketService.uploadAttachments(
                    window.selectedTicket.TicketId,
                    Array.from(files)
                );

                // Reload attachments
                if (typeof loadTicketAttachments === 'function') {
                    await loadTicketAttachments(window.selectedTicket.TicketId);
                }

                this.notificationService.success('Attachments uploaded successfully', 'Success');
            }
        } catch (error) {
            this.notificationService.error('Failed to upload attachments', 'Error');
        }

        e.target.value = '';
    }

    async updateTicket() {
        try {
            if (!window.selectedTicket) {
                this.notificationService.error('No ticket selected', 'Error');
                return;
            }

            // Show loading state
            $('#btnUpdateTicket').prop('disabled', true).html(
                '<span class="spinner-border spinner-border-sm me-2"></span>Updating...'
            );

            // Prepare update data
            const updateData = {
                TicketId: window.selectedTicket.TicketId,
                // Add other fields as needed
            };

            // Call update service
            await window.ticketApp.ticketService.update(new TicketModel(updateData));

            // Update table
            const tickets = await window.ticketApp.ticketService.getAll(window.ticketApp.currentUser.USER_CODE);
            $('#ticketsTable').bootstrapTable('load', tickets);

            this.notificationService.success('Ticket updated successfully', 'Success');

            // Close modal
            $('#editTicketModal').modal('hide');
        } catch (error) {
            this.notificationService.error('Failed to update ticket', 'Error');
        } finally {
            $('#btnUpdateTicket').prop('disabled', false).html('Update Ticket');
        }
    }

    async loadLocations(orgCode) {
        const locations = await window.ticketApp.lookupService.getLocations(orgCode);
        this.renderOptions('#SelectTicketLocation', locations);
    }

    async loadDepartments(orgCode, locCode) {
        const departments = await window.ticketApp.lookupService.getDepartments(orgCode, locCode);
        this.renderOptions('#TicketDepartmentOptions', departments);
    }

    renderOptions(selector, options) {
        let html = '';
        options.forEach(option => {
            html += `<option value="${option.VALUE}">${option.TEXT}</option>`;
        });
        $(selector).html(html);
    }

    resetEditState() {
        window.selectedTicket = null;
        $('#toggleEditUserRequest').prop('checked', false).trigger('change');
        $('#toggleEditAssignment').prop('checked', false).trigger('change');
        $('#toggleEditApprovals').prop('checked', false).trigger('change');
        $('#toggleEditReview').prop('checked', false).trigger('change');
    }
}