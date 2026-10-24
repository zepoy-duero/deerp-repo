/**
 * Notification Service - Centralized notification management
 * Single Responsibility: Only handles user notifications
 */
class NotificationService {
    static success(message, title = 'Success', options = {}) {
        const defaultOptions = { timeOut: 3000 };
        if (typeof toastr !== 'undefined') {
            toastr.success(message, title, { ...defaultOptions, ...options });
        } else {
            console.log('SUCCESS:', title, message);
        }
    }

    static error(message, title = 'Error', options = {}) {
        const defaultOptions = { timeOut: 3000 };
        if (typeof toastr !== 'undefined') {
            toastr.error(message, title, { ...defaultOptions, ...options });
        } else {
            console.error('ERROR:', title, message);
        }
    }

    static warning(message, title = 'Warning', options = {}) {
        const defaultOptions = { timeOut: 3000 };
        if (typeof toastr !== 'undefined') {
            toastr.warning(message, title, { ...defaultOptions, ...options });
        } else {
            console.warn('WARNING:', title, message);
        }
    }

    static info(message, title = 'Info', options = {}) {
        const defaultOptions = { timeOut: 3000 };
        if (typeof toastr !== 'undefined') {
            toastr.info(message, title, { ...defaultOptions, ...options });
        } else {
            console.info('INFO:', title, message);
        }
    }
}