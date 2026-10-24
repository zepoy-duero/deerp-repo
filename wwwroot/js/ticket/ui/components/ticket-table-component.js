/**
 * Ticket Table Component - Manages ticket table rendering and interactions
 * Single Responsibility: Manages table UI only
 * Dependency Inversion: Depends on service abstractions
 */
class TicketTableComponent {
    constructor(config = {}) {
        this.tableSelector = config.tableSelector || '#ticketsTable';
        this.ticketService = config.ticketService;
        this.notificationService = config.notificationService;
        this.$table = $(this.tableSelector);
        this.totalRecordsSelector = config.totalRecordsSelector || '#TicketsTotal';
    }

    async initialize() {
        this.setupTableConfiguration();
    }

    setupTableConfiguration() {
        // Bootstrap Table configuration is handled in HTML via data- attributes
        // This method can be used for dynamic configuration if needed
    }

    async loadTickets(userCode) {
        try {
            this.$table.bootstrapTable('showLoading');
            const tickets = await this.ticketService.getAll(userCode);
            this.$table.bootstrapTable('load', tickets);
            this.showTotalRecords(tickets.length);
        } catch (error) {
            this.notificationService.error('Failed to load tickets', 'Error');
        } finally {
            this.$table.bootstrapTable('hideLoading');
        }
    }

    showTotalRecords(count) {
        const html = `
            <div class="btn rounded-pill bg-main text-white text-center">
                <div class="badge fs-6 bg-danger rounded-pill text-white ms-0">${count}</div>
                <span class="text-center ms-1">Records</span>
            </div>
        `;
        $(this.totalRecordsSelector).empty().html(html);
    }

    insertRow(rowData) {
        this.$table.bootstrapTable('insertRow', {
            index: 0,
            row: rowData
        });
    }

    clearFilters() {
        this.$table.bootstrapTable('clearFilterControl');
    }

    refresh() {
        this.$table.bootstrapTable('refresh');
    }

    getSelectedRows() {
        return this.$table.bootstrapTable('getSelections');
    }

    selectRow(index) {
        this.$table.bootstrapTable('check', index);
    }

    unselectRow(index) {
        this.$table.bootstrapTable('uncheck', index);
    }
}