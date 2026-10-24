/**
 * Storage Service - Handles browser storage operations
 * Single Responsibility: Only manages data persistence
 */
class StorageService extends IStorage {
    constructor(useSessionStorage = false) {
        super();
        this.storage = useSessionStorage ? sessionStorage : localStorage;
    }

    set(key, value) {
        try {
            this.storage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set failed:', key, error);
        }
    }

    get(key) {
        try {
            const value = this.storage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Storage get failed:', key, error);
            return null;
        }
    }

    remove(key) {
        try {
            this.storage.removeItem(key);
        } catch (error) {
            console.error('Storage remove failed:', key, error);
        }
    }

    clear() {
        try {
            this.storage.clear();
        } catch (error) {
            console.error('Storage clear failed:', error);
        }
    }
}