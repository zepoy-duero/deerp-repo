/**
 * Storage Interface - Defines contract for data persistence
 */
class IStorage {
    set(key, value) {
        throw new Error('set() must be implemented');
    }

    get(key) {
        throw new Error('get() must be implemented');
    }

    remove(key) {
        throw new Error('remove() must be implemented');
    }

    clear() {
        throw new Error('clear() must be implemented');
    }
}