using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Report;
using DEEMPPORTAL.Application.Report;

namespace DEEMPPORTAL.Infrastructure;

public class EmployeeReportRepository(ConnectionPool cp, CurrentUser cu) : IEmployeeReportRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<(IEnumerable<EmployeeReportResponse> Data, int TotalCount)> GetAllEmployeeProfileAsync(
      string searchParam,
      string filterValue,
      string filterStatus,
      int pageNo)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_EMPLOYEE_PROFILE_sel";
        var parameters = new
        {
            SEARCH_PARAM = searchParam,
            FILTER_VALUE = filterValue,
            FILTER_STATUS = filterStatus,
            PNO = pageNo,
        };

        var multi = await conn.QueryMultipleAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        var data = await multi.ReadAsync<EmployeeReportResponse>();
        var totalCount = await multi.ReadFirstAsync<int>();

        await conn.CloseAsync();

        return (data, totalCount);
    }

    public async Task<IEnumerable<EmployeeReportResponse>> GetAllEmployeeProfileReportAsync(string filterValue, string filterStatus)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_EMPLOYEE_PROFILE_rpt";
        var parameters = new
        {
            FILTER_VALUE = filterValue,
            FILTER_STATUS = filterStatus,
        };

        var results = await conn.QueryAsync<EmployeeReportResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results!;
    }

    public async Task<EmployeeReportSummaryResponse> GetTotalEmployeeProfileCountAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_EMPLOYEE_PROFILE_TOTAL_COUNT_sel";
        var parameters = new
        {
            USER_CODE = _cu.UserId
        };

        var results = await conn.QueryFirstOrDefaultAsync<EmployeeReportSummaryResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results!;
    }
}