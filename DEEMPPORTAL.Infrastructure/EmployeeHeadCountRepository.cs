using Dapper;
using DEEMPPORTAL.Application.Dashboard;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Dashboard;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class EmployeeHeadCountRepository(ConnectionPool cp, CurrentUser cu) : IEmployeeHeadCountRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<IEnumerable<EmployeeHeadCountByJobStatusResponse>> GetTotalCountByJobStatusAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_DASHBOARD_EMPLOYEE_HEADCOUNT_JOB_STATUS_sel";
        var parameters = new { };

        var results = await conn.QueryAsync<EmployeeHeadCountByJobStatusResponse>(
            storedProcedure,
            //parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results!;
    }

    public async Task<IEnumerable<EmployeeHeadCountByOrganizationResponse>> GetTotalEmployeesByLocationAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_DASHBOARD_EMPLOYEE_HEADCOUNT_ORGANIZATION_sel";
        var parameters = new { };

        var results = await conn.QueryAsync<EmployeeHeadCountByOrganizationResponse>(
            storedProcedure,
            //parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results!;
    }
}
