const data = [
    {
        "ticketId": "MIS#1001",
        "requestedBy": "Alice Johnson",
        "assignedTo": "Michael Reyes",
        "description": "Printer in HR room is jammed.",
        "dateSubmitted": "2026-04-07",
        "status": "In Progress",
        "priority": "Medium"
    },
    {
        "ticketId": "MIS#1002",
        "requestedBy": "Bob Smith",
        "assignedTo": "Karen Lopez",
        "description": "VPN connectivity issues.",
        "dateSubmitted": "2026-04-07",
        "status": "Testing",
        "priority": "High"
    },
    {
        "ticketId": "MIS#1003",
        "requestedBy": "Charlie Davis",
        "assignedTo": "John Cruz",
        "description": "New monitor setup request.",
        "dateSubmitted": "2026-04-06",
        "status": "Complete",
        "priority": "Low"
    },
    {
        "ticketId": "MIS#1004",
        "requestedBy": "Diana Evans",
        "assignedTo": "Angela Santos",
        "description": "Cannot access shared drive.",
        "dateSubmitted": "2026-04-06",
        "status": "Pending",
        "priority": "High"
    },
    {
        "ticketId": "MIS#1005",
        "requestedBy": "Ethan Foster",
        "assignedTo": "Michael Reyes",
        "description": "Password reset required.",
        "dateSubmitted": "2026-04-05",
        "status": "Complete",
        "priority": "Medium"
    },
    {
        "ticketId": "MIS#1006",
        "requestedBy": "Fiona Green",
        "assignedTo": "Karen Lopez",
        "description": "Software update failing.",
        "dateSubmitted": "2026-04-05",
        "status": "Maintenance",
        "priority": "Medium"
    },
    {
        "ticketId": "MIS#1007",
        "requestedBy": "George Harris",
        "assignedTo": "John Cruz",
        "description": "Laptop keyboard malfunctioning.",
        "dateSubmitted": "2026-04-04",
        "status": "In Progress",
        "priority": "Medium"
    },
    {
        "ticketId": "MIS#1008",
        "requestedBy": "Hannah Ivey",
        "assignedTo": "Angela Santos",
        "description": "Email archive request.",
        "dateSubmitted": "2026-04-04",
        "status": "Complete",
        "priority": "Low"
    },
    {
        "ticketId": "MIS#1009",
        "requestedBy": "Ian Jones",
        "assignedTo": "Michael Reyes",
        "description": "Mouse not responding.",
        "dateSubmitted": "2026-04-03",
        "status": "Complete",
        "priority": "Low"
    },
    {
        "ticketId": "MIS#1010",
        "requestedBy": "Julia King",
        "assignedTo": "Karen Lopez",
        "description": "External speaker crackling.",
        "dateSubmitted": "2026-04-03",
        "status": "Pending",
        "priority": "Low"
    }
];

$(function () {

    $('#table').bootstrapTable({
        data: data,
        columns: [
            { checkbox: true },

            {
                field: 'ticketId',
                title: 'Ticket ID',
                sortable: true,
                resizable: true,

                filterControl: 'input'
            },

            {
                field: 'description',
                title: 'Description',
                resizable: true,
                filterControl: 'input'
            },

            {
                field: 'requestedBy',
                title: 'Requested By',
                resizable: true,
                filterControl: 'input'
            },

            {
                field: 'assignedTo',
                title: 'Assigned To',
                resizable: true,
                filterControl: 'input'
            },

            {
                field: 'priority',
                title: 'Priority',
                resizable: true,
                filterControl: 'select',
                filterData: 'obj:{"High":"High","Medium":"Medium","Low":"Low"}',
                formatter: value => {
                    const map = {
                        High: 'danger',
                        Medium: 'warning',
                        Low: 'success'
                    };
                    return `<span class="badge bg-${map[value]}">${value}</span>`;
                }
            },

            {
                field: 'status',
                title: 'Status',
                resizable: true,
                filterControl: 'select',
                filterData: 'obj:{"Pending":"Pending","In Progress":"In Progress","Resolved":"Resolved"}',
                formatter: value => {
                    const map = {
                        Pending: 'secondary',
                        'In Progress': 'primary',
                        Resolved: 'success'
                    };
                    return `<div class="container"><span class="badge badge- rounded-circle me-2 badge-${map[value] || 'dark'}"></span><strong>${value}</strong></div>`;
                }
            },

            {
                field: 'dateSubmitted',
                resizable: true,
                title: 'Date Submitted',
                sortable: true,
                filterControl: 'input', // or custom date picker
                sorter: (a, b) => new Date(a) - new Date(b),
                formatter: value => new Date(value).toLocaleDateString()
            },

            {
                title: 'Actions',
                formatter: () => `<button id="rowAction" class="btn btn-sm btn-light">⋮</button>`
            }
        ]
    });

    // 🔍 Custom Search
    $('#searchInput').on('keyup', function () {
        const value = $(this).val().toLowerCase();

        $('#table').bootstrapTable('filterBy', {
            subject: value
        }, {
            filterAlgorithm: (row, filters) => {
                return Object.values(row).some(val =>
                    String(val).toLowerCase().includes(value)
                );
            }
        });
    });

    // 📅 Date Filter
    $('#startDate, #endDate').on('change', function () {
        const start = $('#startDate').val();
        const end = $('#endDate').val();

        $('#table').bootstrapTable('filterBy', {}, {
            filterAlgorithm: (row) => {
                if (!start || !end) return true;

                return row.created >= start && row.created <= end;
            }
        });
    });

    // 🔄 Reset Filters
    $('#btnReset').on('click', function () {
        $('#searchInput').val('');
        $('#startDate').val('');
        $('#endDate').val('');

        $('#table').bootstrapTable('load', data);
    });

    // 🧩 Column Toggle Button
    $('#btnColumns').on('click', function () {
        $('.columns-toggle').trigger('click'); // triggers built-in dropdown
    });
    $('#rowAction').on('click-cell.bs.table', function (field, value, row,$element) {

        console.log(value)
        console.log(row)
        console.log($element)
        console.log(field)
        $("#editTicketModal").modal("toggle");
    });
});