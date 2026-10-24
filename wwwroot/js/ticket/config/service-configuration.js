/**
 * Service Configuration - Centralized configuration management
 * This allows easy modification of service behavior without changing core code
 */
const ServiceConfiguration = {
    api: {
        baseUrl: '/MyTickets',
        timeout: 30000,
        retryAttempts: 3
    },

    storage: {
        useSessionStorage: false,
        cacheExpiration: 3600000 // 1 hour in milliseconds
    },

    fileValidation: {
        maxFileSize: 2 * 1024 * 1024, // 2MB
        maxFiles: 10,
        allowedExtensions: [
            '.jpg', '.jpeg', '.png', '.pdf', '.txt',
            '.doc', '.docx', '.xls', '.xlsx', '.csv'
        ],
        blockedExtensions: [
            '.exe', '.bat', '.sh', '.cmd', '.php', '.js', '.html', '.htm', '.aspx'
        ],
        allowedMimeTypes: [
            'image/jpeg', 'image/png', 'application/pdf', 'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv', 'application/csv'
        ]
    },

    notifications: {
        timeOut: 3000,
        extendedTimeOut: 5000,
        enableNotifications: true
    },

    defaults: {
        organization: 1,
        location: 1,
        department: 9
    }
};