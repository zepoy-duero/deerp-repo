/**
 * API Client Service - Implements HTTP operations
 * Single Responsibility: Only handles HTTP communication
 */
class ApiClientService extends IApiClient {
    constructor(baseUrl = '/MyTickets') {
        super();
        this.baseUrl = baseUrl;
    }

    async get(url, params = {}) {
        try {
            return await $.ajax({
                url: `${this.baseUrl}${url}`,
                type: 'GET',
                data: params,
                dataType: 'json'
            });
        } catch (error) {
            console.error('GET request failed:', url, error);
            throw error;
        }
    }

    async post(url, data) {
        try {
            return await $.ajax({
                url: `${this.baseUrl}${url}`,
                type: 'POST',
                data: data instanceof FormData ? data : JSON.stringify(data),
                contentType: data instanceof FormData ? false : 'application/json; charset=utf-8',
                processData: data instanceof FormData ? false : true,
                dataType: 'json'
            });
        } catch (error) {
            console.error('POST request failed:', url, error);
            throw error;
        }
    }

    async put(url, data) {
        try {
            return await $.ajax({
                url: `${this.baseUrl}${url}`,
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            });
        } catch (error) {
            console.error('PUT request failed:', url, error);
            throw error;
        }
    }

    async delete(url) {
        try {
            return await $.ajax({
                url: `${this.baseUrl}${url}`,
                type: 'DELETE',
                dataType: 'json'
            });
        } catch (error) {
            console.error('DELETE request failed:', url, error);
            throw error;
        }
    }
}