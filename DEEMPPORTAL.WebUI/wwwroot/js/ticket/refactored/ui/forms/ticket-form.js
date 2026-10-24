/**
 * Ticket Form - Manages ticket form operations
 * Single Responsibility: Manages form UI and submission
 * Dependency Inversion: Depends on services and validators
 */
class TicketForm {
    constructor(config = {}) {
        this.formSelector = config.formSelector || '#createTicketForm';
        this.ticketService = config.ticketService;
        this.lookupService = config.lookupService;
        this.formValidator = config.formValidator;
        this.fileValidator = config.fileValidator;
        this.notificationService = config.notificationService;
        this.filePickerComponent = config.filePickerComponent;
        this.currentUser = config.currentUser;

        this.$form = $(this.formSelector);
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadInitialData();
    }

    attachEventListeners() {
        this.$form.on('submit', (e) => {
            e.preventDefault();
            this.submit();
        });

        $('#SelectTicketOrganization').on('change', () => this.loadLocations());
        $('#SelectTicketLocation').on('change', () => this.loadDepartments());
        $('#TicketDepartmentOptions').on('change', () => this.loadTypes());
    }

    async loadInitialData() {
        try {
            await this.loadOrganizations();
            const orgCode = $('#SelectTicketOrganization').val();
            await this.loadLocations(orgCode);
            const locCode = $('#SelectTicketLocation').val();
            await this.loadDepartments(orgCode, locCode);
            await this.loadTypes(orgCode, locCode, $('#TicketDepartmentOptions').val());
            this.setCurrentUserInfo();
        } catch (error) {
            this.notificationService.error('Failed to initialize form', 'Error');
        }
    }

    async loadOrganizations() {
        try {
            const organizations = await this.lookupService.getOrganizations();
            this.renderOptions('#SelectTicketOrganization', organizations);
        } catch (error) {
            this.notificationService.error('Failed to load organizations', 'Error');
        }
    }

    async loadLocations(orgCode = null) {
        try {
            orgCode = orgCode || $('#SelectTicketOrganization').val();
            if (!orgCode) return;

            const locations = await this.lookupService.getLocations(orgCode);
            this.renderOptions('#SelectTicketLocation', locations);
            await this.loadDepartments(orgCode);
        } catch (error) {
            this.notificationService.error('Failed to load locations', 'Error');
        }
    }

    async loadDepartments(orgCode = null, locCode = null) {
        try {
            orgCode = orgCode || $('#SelectTicketOrganization').val();
            locCode = locCode || $('#SelectTicketLocation').val();
            if (!orgCode || !locCode) return;

            const departments = await this.lookupService.getDepartments(orgCode, locCode);
            this.renderOptions('#TicketDepartmentOptions', departments);
            await this.loadTypes(orgCode, locCode);
        } catch (error) {
            this.notificationService.error('Failed to load departments', 'Error');
        }
    }

    async loadTypes(orgCode = null, locCode = null, deptCode = null) {
        try {
            orgCode = orgCode || $('#SelectTicketOrganization').val();
            locCode = locCode || $('#SelectTicketLocation').val();
            deptCode = deptCode || $('#TicketDepartmentOptions').val();
            if (!orgCode || !locCode || !deptCode) return;

            const types = await this.lookupService.getTypes(orgCode, locCode, deptCode);
            this.renderOptions('#TaskTypeCode', types);
        } catch (error) {
            this.notificationService.error('Failed to load types', 'Error');
        }
    }

    renderOptions(selector, options) {
        let html = '';
        options.forEach(option => {
            html += `<option value="${option.VALUE}">${this.escapeHtml(option.TEXT)}</option>`;
        });
        $(selector).html(html);
    }

    escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    setCurrentUserInfo() {
        if (!this.currentUser) return;

        $('#displayRequestedBy').text(this.currentUser.EMP_NAME);
        $('#RequestedByCode').val(this.currentUser.USER_CODE);
        $('#RequestedByName').val(this.currentUser.EMP_NAME);
        $('#requestedByCode').val(this.currentUser.USER_CODE);
        $('#requestedBy').val(this.currentUser.EMP_NAME);
        $('#RequestedDate').val(this.currentUser.DATE_TODAY);

        const formattedDate = typeof moment !== 'undefined'
            ? moment(this.currentUser.DATE_TODAY).format('MM-DD-YYYY')
            : this.currentUser.DATE_TODAY;

        $('#dateRequestedField').text(formattedDate);
    }

    async submit() {
        if (!this.validate()) {
            return;
        }

        try {
            this.setButtonLoading();

            const ticketData = this.getFormData();
            const ticket = new TicketModel(ticketData);
            const files = this.filePickerComponent.getSelectedFiles();

            const createdTicket = await this.ticketService.create(ticket, files);

            if (createdTicket) {
                this.reset();
                this.closeModal();
            }
        } catch (error) {
            this.notificationService.error('Failed to submit ticket', 'Error');
        } finally {
            this.resetButton();
        }
    }

    validate() {
        if (!this.formValidator.isValid(this.$form[0])) {
            this.$form.addClass('was-validated');
            return false;
        }

        const description = $('#TicketDescription').summernote('code');
        if (!description || description.replace(/<[^>]*>/g, '').trim().length === 0) {
            $('#summernoteInvalidFeedback').removeClass('d-none');
            return false;
        }

        $('#summernoteInvalidFeedback').addClass('d-none');
        return true;
    }

    getFormData() {
        const description = $('#TicketDescription').summernote('code');
        return {
            OrgCode: $('#SelectTicketOrganization').val(),
            LocCode: $('#SelectTicketLocation').val(),
            DeptCode: $('#TicketDepartmentOptions').val(),
            TaskTypeCode: $('#TaskTypeCode').val(),
            TicketSubject: $('#TicketSubject').val(),
            TicketDescription: description,
            RequestedByCode: this.currentUser.USER_CODE,
            RequestedByName: this.currentUser.EMP_NAME,
            RequestedByEmail: this.currentUser.EMAIL_ADDRESS,
            RequestedDate: this.currentUser.DATE_TODAY
        };
    }

    reset() {
        this.$form[0].reset();
        this.$form.removeClass('was-validated');
        this.filePickerComponent.clearSelectedFiles();
        if ($('#TicketDescription').length && $('#TicketDescription').next('.note-editor').length) {
            $('#TicketDescription').summernote('reset');
        }
        document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
    }

    setButtonLoading() {
        const $btn = $('#submitTicket');
        $btn.prop('disabled', true).html(`
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Submitting...
        `);
    }

    resetButton() {
        $('#submitTicket').prop('disabled', false).html('Submit Ticket');
    }

    closeModal() {
        $(this.formSelector).closest('.modal').modal('hide');
    }
}