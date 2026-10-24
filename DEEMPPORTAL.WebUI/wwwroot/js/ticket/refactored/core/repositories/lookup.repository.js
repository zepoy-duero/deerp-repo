/**
 * Lookup Repository - Handles dropdown/select options data
 * Single Responsibility: Only manages lookup data operations
 * Dependency Inversion: Depends on IApiClient abstraction
 */
class LookupRepository {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    async getOrganizations() {
        return await $.get('/support/employee-directory/getAllOrganizationList');
    }

    async getLocations(orgCode) {
        return await $.get('/support/employee-directory/getFilteredLocationList', 
            { OrgCode: orgCode });
    }

    async getDepartments(orgCode, locCode) {
        return await $.get('/get-ticket-department-options', 
            { OrgCode: orgCode, LocCode: locCode });
    }

    async getUsers() {
        return await this.apiClient.get('/get-user-options');
    }

    async getAssignees(orgCode, locCode, deptCode) {
        return await this.apiClient.get('/get-assignee-options', 
            { OrgCode: orgCode, LocCode: locCode, DeptCode: deptCode });
    }

    async getPriorities(orgCode, locCode, deptCode) {
        return await this.apiClient.get('/get-priority-options', 
            { OrgCode: orgCode, LocCode: locCode, DeptCode: deptCode });
    }

    async getModules(orgCode, locCode, deptCode) {
        return await this.apiClient.get('/get-module-options', 
            { OrgCode: orgCode, LocCode: locCode, DeptCode: deptCode });
    }

    async getTypes(orgCode, locCode, deptCode) {
        return await this.apiClient.get('/get-type-options', 
            { OrgCode: orgCode, LocCode: locCode, DeptCode: deptCode });
    }

    async getStatuses(orgCode, locCode, deptCode) {
        return await this.apiClient.get('/get-status-options', 
            { OrgCode: orgCode, LocCode: locCode, DeptCode: deptCode });
    }

    async getDurationUnits() {
        return await this.apiClient.get('/get-duration-unit-options');
    }
}