using Dapper;
using DEEMPPORTAL.Application.Manage.User;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Manage.User;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class UserRepository(ConnectionPool cp, CurrentUser cu) : IUserRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<IEnumerable<UserResponse>> GetUsersAsync(int orgCode,string searchParam, int pageNo)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_USER_sel";
        var parameters = new
        {
            orgCode = orgCode,
            SEARCH_PARAM = searchParam,
            PNO = pageNo
        };

        var results = await conn.QueryAsync<UserResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results;
    }

    public async Task<UserDetailResponse> GetUserAsync(int userCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_USER_DETAIL_sel";
        var parameters = new
        {
            USER_CODE = userCode
        };

        var results = await conn.QueryFirstOrDefaultAsync<UserDetailResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results ?? new UserDetailResponse();
    }

    public async Task<int> UpdSertUserAsync(DataTable dt)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_USER_upd";
        var parameters = new
        {
            TT = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_USER"),
            USER_ID = _cu.UserId,
        };

        var rowsAffected = await conn.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected;
    }

    public async Task<int> DeleteUserAsync(int userCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_USER_del";
        var parameters = new
        {
            USER_CODE = userCode
        };

        var rowsAffected = await conn.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected;
    }

    public async Task<string> GeneratePassword()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GeneratePassword()";
        var parameters = new { };

        var results = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters);

        await conn.CloseAsync();

        return results ?? "";
    }

    public async Task<string> ShowPassword(int userCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetUserPassword(@USER_CODE)";

        var parameters = new
        {
            USER_CODE = userCode
        };

        var results = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters);

        await conn.CloseAsync();

        return results ?? "";
    }

    public async Task<string> GetDefaultPassword()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetDefaultPassword()";

        var parameters = new { };

        var results = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters);

        await conn.CloseAsync();

        return results ?? "";
    }

    public async Task<int> ResetPassword(int userCode, string encryptedPassword)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_USER_reset_password";
        var parameters = new
        {
            ENCRYPTED_PASSWORD = encryptedPassword,
            USER_CODE = userCode
        };

        var rowsAffected = await conn.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected;
    }

    public async Task<EmployeeResponse> GetEmployeeDetailsAsync(int empCode, string empName, int orgCode, int locCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_EMPLOYEE_DETAIL_sel";
        var parameters = new
        {
            EMP_CODE = empCode,
            EMP_NAME = empName,
            ORG_CODE = orgCode,
            LOC_CODE = locCode
        };

        var results = await conn.QueryFirstOrDefaultAsync<EmployeeResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results ?? new EmployeeResponse();
    }

    public async Task<bool> IsUserNameExist(string userName)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.IsUserNameExist(@USERNAME)";
        var parameters = new
        {
            USERNAME = userName
        };

        var rowsCount = await conn.ExecuteScalarAsync<int>(
            storedProcedure,
            parameters);

        await conn.CloseAsync();

        return rowsCount > 0;
    }
}
