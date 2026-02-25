using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

using DEEMPPORTAL.Common;
using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Domain;

namespace DEEMPPORTAL.Infrastructure;

public class SelectOptionsRepository(ConnectionPool cp, CurrentUser cu) : ISelectOptionsRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<IEnumerable<SelectOption>> GetAllOrganizationAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_ORGANIZATION_MAST_opts";
        var parameters = new { };

        var options = await conn.QueryAsync<SelectOption>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        return options;
    }

    public async Task<IEnumerable<SelectOption>> GetAllLocationAsync(int orgCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_LOCATION_MAST_opts";
        var parameters = new { ORG_CODE = orgCode };

        var options = await conn.QueryAsync<SelectOption>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        return options;
    }

    public async Task<IEnumerable<SelectOption>> GetAllMainMenuAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_MENU_MAIN_opts";
        var parameters = new { };

        var options = await conn.QueryAsync<SelectOption>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return options;
    }

    public async Task<IEnumerable<SelectOption>> GetAllSubMenuAsync(int? mainMenuCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_MENU_SUB_opts";
        var parameters = new
        {
            MAIN_MENU_CODE = mainMenuCode
        };

        var options = await conn.QueryAsync<SelectOption>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return options;
    }

    public async Task<IEnumerable<SelectOption>> GetEmployeeAsync(string searchParam)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_EMPLOYEE_MAST_opts";
        var parameters = new
        {
            SEARCH_PARAM = searchParam
        };

        var options = await conn.QueryAsync<SelectOption>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return options;
    }

    public async Task<IEnumerable<SelectOption>> GetAllRoleAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_ROLE_opts";
        var parameters = new { };

        var options = await conn.QueryAsync<SelectOption>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return options;
    }

    public async Task<IEnumerable<SelectOption>> GetAllDepartmentAsync(int orgCode, int locCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_DEPARTMENT_MAST_opts";
        var parameters = new
        {
            ORG_CODE = orgCode,
            LOC_CODE = locCode
        };

        var options = await conn.QueryAsync<SelectOption>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return options;
    }
}
