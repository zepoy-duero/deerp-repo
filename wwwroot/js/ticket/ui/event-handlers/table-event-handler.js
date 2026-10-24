/**
 * Table Event Handler - Manages ticket table events
 * Single Responsibility: Only handles table-related events
 * Dependency Inversion: Depends on service abstractions
 */
class TableEventHandler {
    constructor(config = {}) {
        this.ticketTableComponent = config.ticketTableComponent;
        this.filterManager = config.filterManager;
        this.notificationService = config.notificationService;

        this.init();
    }

    init() {
        this.attachFilterEvents();
        this.attachColumnToggleEvents();
        this.attachTableToolbarEvents();
    }

    attachFilterEvents() {
        // Reset Filters
        $('#btnResetFilter').on('click', () => {
            this.ticketTableComponent.clearFilters();
            if (this.filterManager) {
                this.filterManager.clearAllFilters();
            }
            this.notificationService.success('Filters cleared', 'Success');
        });

        // Year Filter Change (if exists)
        $('#requestedDateFilter').on('change', async (e) => {
            try {
                this.ticketTableComponent.refresh();
            } catch (error) {
                this.notificationService.error('Failed to apply filter', 'Error');
            }
        });
    }

    attachColumnToggleEvents() {
        // Column Visibility Toggle
        $('.toggle-column').on('change', (e) => {
            const $checkbox = $(e.target);
            const field = $checkbox.data('field');

            if ($checkbox.is(':checked')) {
                this.ticketTableComponent.$table.bootstrapTable('showColumn', field);
            } else {
                this.ticketTableComponent.$table.bootstrapTable('hideColumn', field);
            }
        });
    }

    attachTableToolbarEvents() {
        // Export Button
        $('#btnExport').on('click', () => {
            this.ticketTableComponent.$table.bootstrapTable('export');
        });

        // Print Button
        $('#btnPrint').on('click', () => {
            this.ticketTableComponent.$table.bootstrapTable('print');
        });

        // Refresh Button
        $('#btnRefresh').on('click', () => {
            this.ticketTableComponent.refresh();
        });
    }
}