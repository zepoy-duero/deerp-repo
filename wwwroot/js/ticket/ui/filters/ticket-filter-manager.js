/**
 * Ticket Filter Manager - Manages ticket table filter controls
 * Single Responsibility: Manages filter UI only
 * Dependency Inversion: Depends on service abstractions
 */
class TicketFilterManager {
    constructor(config = {}) {
        this.containerSelector = config.containerSelector || '#filtersContainer';
        this.lookupService = config.lookupService;
        this.notificationService = config.notificationService;
        this.filterConfig = config.filterConfig || this.getDefaultFilters();
        this.init();
    }

    init() {
        this.loadFilterOptions();
    }

    getDefaultFilters() {
        return {
            department: {
                selector: '#DeptNameFilter',
                className: 'bootstrap-table-filter-control-DeptName',
                loader: (ls) => ls.getDepartments(1, 1)
            },
            requestedBy: {
                selector: '#requestedByNameFilter',
                className: 'bootstrap-table-filter-control-RequestedByName',
                loader: (ls) => ls.getUsers()
            },
            assignedTo: {
                selector: '#assignedToFilter',
                className: 'bootstrap-table-filter-control-AssignedToName',
                loader: (ls) => ls.getAssignees(1, 1, 9)
            },
            type: {
                selector: '#taskTypeNameFilter',
                className: 'bootstrap-table-filter-control-TaskTypeName',
                loader: (ls) => ls.getTypes(1, 1, 9)
            },
            priority: {
                selector: '#ticketPriorityFilter',
                className: 'bootstrap-table-filter-control-TicketPriority',
                loader: (ls) => ls.getPriorities(1, 1, 9)
            },
            status: {
                selector: '#statusNameFilter',
                className: 'bootstrap-table-filter-control-StatusName',
                loader: (ls) => ls.getStatuses(1, 1, 9)
            }
        };
    }

    async loadFilterOptions() {
        for (const [key, filter] of Object.entries(this.filterConfig)) {
            try {
                const options = await filter.loader(this.lookupService);
                this.renderFilterOptions(filter.selector, options);
            } catch (error) {
                console.error(`Failed to load ${key} options`);
            }
        }
    }

    renderFilterOptions(selector, options) {
        const $select = $(selector);
        if (!$select.length) return;

        let html = '<option value="">All</option>';
        options.forEach(option => {
            html += `<option value="${option.VALUE}">${this.escapeHtml(option.TEXT)}</option>`;
        });
        $select.html(html);
    }

    escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    clearAllFilters() {
        Object.values(this.filterConfig).forEach(filter => {
            $(filter.selector).val('');
        });
    }
}