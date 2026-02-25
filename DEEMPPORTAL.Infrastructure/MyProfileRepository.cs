using Dapper;
using DEEMPPORTAL.Application.MyProfile;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.MyProfile;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class MyProfileRepository(ConnectionPool cp, CurrentUser cu) : IMyProfileRespository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<IEnumerable<MyProfileResponse>> GetMyProfileDetailsAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_EMPLOYEE_PROFILE_DETAIL_sel";
        var parameters = new
        {
            USER_CODE = _cu.UserId,
        };

        var results = await conn.QueryAsync<MyProfileResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results!;
    }

    public async Task<bool> UpdSertMyProfileAsync(DataTable dt)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_EMPLOYEE_PROFILE_DETAIL_upd";

        var parameters = new DynamicParameters();
        parameters.Add("@TT", dt.AsTableValuedParameter("dbo.TT_v1_CLOUD_ERP_EMPLOYEE_PROFILE"));
        parameters.Add("@USER_CODE", _cu.UserId);

        var rowsAffected = await conn.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected > 0;
    }
}
