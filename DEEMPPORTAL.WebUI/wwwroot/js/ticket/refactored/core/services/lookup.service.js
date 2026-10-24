/**
 * Lookup Service - Business logic for dropdown options
 * Single Responsibility: Orchestrates lookup data operations
 * Dependency Inversion: Depends on repository abstractions
 */
class LookupService {
    constructor(lookupRepository, storage, notificationService) {
        this.lookupRepository = lookupRepository;
        this.storage = storage;
        this.notificationService = notificationService;
    }

    async getOrganizations(useCache = true) {
        const cacheKey = 'organizations';

        if (useCache) {
            const cached = this.storage.get(cacheKey);
            if (cached) return cached;
        }

        try {
            const organizations = await this.lookupRepository.getOrganizations();
            this.storage.set(cacheKey, organizations);
            return organizations;
        } catch (error) {
            this.notificationService.error('Failed to load organizations', 'Error');
            throw error;
        }
    }

    async getLocations(orgCode, useCache = true) {
        const cacheKey = `locations_${orgCode}`;

        if (useCache) {
            const cached = this.storage.get(cacheKey);
            if (cached) return cached;
        }

        try {
            const locations = await this.lookupRepository.getLocations(orgCode);
            this.storage.set(cacheKey, locations);
            return locations;
        } catch (error) {
            this.notificationService.error('Failed to load locations', 'Error');
            throw error;
        }
    }

    async getDepartments(orgCode, locCode, useCache = true) {
        const cacheKey = `departments_${orgCode}_${locCode}`;

        if (useCache) {
            const cached = this.storage.get(cacheKey);
            if (cached) return cached;
        }

        try {
            const departments = await this.lookupRepository.getDepartments(orgCode, locCode);
            this.storage.set(cacheKey, departments);
            return departments;
        } catch (error) {
            this.notificationService.error('Failed to load departments', 'Error');
            throw error;
        }
    }

    async getUsers(useCache = true) {
        const cacheKey = 'users';

        if (useCache) {
            const cached = this.storage.get(cacheKey);
            if (cached) return cached;
        }

        try {
            const users = await this.lookupRepository.getUsers();
            this.storage.set(cacheKey, users);
            return users;
        } catch (error) {
            this.notificationService.error('Failed to load users', 'Error');
            throw error;
        }
    }

    async getAssignees(orgCode, locCode, deptCode) {
        try {
            return await this.lookupRepository.getAssignees(orgCode, locCode, deptCode);
        } catch (error) {
            this.notificationService.error('Failed to load assignees', 'Error');
            throw error;
        }
    }

    async getPriorities(orgCode, locCode, deptCode) {
        try {
            return await this.lookupRepository.getPriorities(orgCode, locCode, deptCode);
        } catch (error) {
            this.notificationService.error('Failed to load priorities', 'Error');
            throw error;
        }
    }

    async getModules(orgCode, locCode, deptCode) {
        try {
            return await this.lookupRepository.getModules(orgCode, locCode, deptCode);
        } catch (error) {
            this.notificationService.error('Failed to load modules', 'Error');
            throw error;
        }
    }

    async getTypes(orgCode, locCode, deptCode) {
        try {
            return await this.lookupRepository.getTypes(orgCode, locCode, deptCode);
        } catch (error) {
            this.notificationService.error('Failed to load types', 'Error');
            throw error;
        }
    }

    async getStatuses(orgCode, locCode, deptCode) {
        try {
            return await this.lookupRepository.getStatuses(orgCode, locCode, deptCode);
        } catch (error) {
            this.notificationService.error('Failed to load statuses', 'Error');
            throw error;
        }
    }

    async getDurationUnits() {
        try {
            return await this.lookupRepository.getDurationUnits();
        } catch (error) {
            this.notificationService.error('Failed to load duration units', 'Error');
            throw error;
        }
    }
}