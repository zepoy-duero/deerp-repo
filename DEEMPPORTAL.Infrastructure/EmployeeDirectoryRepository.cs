using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.Application.Support.EmployeeDirectoryService;

namespace DEEMPPORTAL.Infrastructure;

public class EmployeeDirectoryRepository(ConnectionPool cp, CurrentUser cu) : IEmployeeDirectoryRepository
{

    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<IEnumerable<EmployeeDirectoryResponse>> GetAllEmployeeDirectoryAsync(
     int orgCode,
     int locCode,
     int deptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_EMPLOYEE_DIRECTORY_sel";
        var parameters = new
        {
            ORG_CODE = orgCode,
            LOC_CODE = locCode,
            DEPT_CODE = deptCode
        };

        var multi = await conn.QueryMultipleAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        var data = await multi.ReadAsync<EmployeeDirectoryResponse>();
        //var totalCount = await multi.ReadFirstAsync<int>();

        await conn.CloseAsync();

        return (data);
    }

    public async Task<IEnumerable<SelectOptionResponse>> GetAllOrganizationListAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_ORGANIZATION_all_opts";
        var results = await conn.QueryAsync<SelectOptionResponse>(
            storedProcedure,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }

    public async Task<IEnumerable<SelectOptionResponse>> GetAllLocationListAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_LOCATION_all_opts";
        var results = await conn.QueryAsync<SelectOptionResponse>(
            storedProcedure,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<SelectOptionResponse>> GetAllDepartmentListAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_DEPARTMENT_all_opts";
        var results = await conn.QueryAsync<SelectOptionResponse>(
            storedProcedure,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }

    public async Task<IEnumerable<SelectOptionResponse>> GetFilteredOrganizationListAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_ORGANIZATION_MAST_opts";
        var results = await conn.QueryAsync<SelectOptionResponse>(
            storedProcedure,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }

    public async Task<IEnumerable<SelectOptionResponse>> GetFilteredLocationListAsync(int orgCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_LOCATION_MAST_opts";
        var parameters = new
        {
            ORG_CODE = orgCode
        };
        var results = await conn.QueryAsync<SelectOptionResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<SelectOptionResponse>> GetFilteredDepartmentListAsync(int orgCode, int locCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_DEPARTMENT_MAST_opts";
        var parameters = new
        {
            ORG_CODE = orgCode,
            LOC_CODE = locCode
        };
        var results = await conn.QueryAsync<SelectOptionResponse>(

            storedProcedure,
              parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
}