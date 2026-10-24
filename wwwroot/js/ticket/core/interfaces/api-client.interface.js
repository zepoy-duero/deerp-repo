/**
 * API Client Interface - Defines contract for HTTP operations
 * Dependency Inversion: High-level modules depend on this abstraction
 */
class IApiClient {
    async get(url, params = {}) {
        throw new Error('get() must be implemented');
    }

    async post(url, data) {
        throw new Error('post() must be implemented');
    }

    async put(url, data) {
        throw new Error('put() must be implemented');
    }

    async delete(url) {
        throw new Error('delete() must be implemented');
    }
}