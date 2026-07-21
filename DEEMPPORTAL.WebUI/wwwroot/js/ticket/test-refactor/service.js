export const TicketService = {

    async getAll() {
        return await $.get(
            `${BASE_URL}/get-tickets`,
            { DeptCode: null }
        );
    },

    async create(ticket) {
        return await $.post(
            `${BASE_URL}/create-ticket`,
            ticket
        );
    },

    async sendEmail(params) {
        return await $.post(
            `${BASE_URL}/send-email-notification`,
            params
        );
    },
     test() {
        return "test";
    }
};