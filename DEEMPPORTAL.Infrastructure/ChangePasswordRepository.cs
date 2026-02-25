using Dapper;
using System.Data;
using Microsoft.Data.SqlClient;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Application.Account;

namespace DEEMPPORTAL.Infrastructure;

public class ChangePasswordRepository(ConnectionPool cp, CurrentUser cu) : IChangePasswordRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<bool> IsCurrentPasswordValid(string currentPassword)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.IsEmployeePasswordExist(@CURRENT_PASSWORD, @USER_CODE)";
        var parameters = new
        {
            CURRENT_PASSWORD = currentPassword,
            USER_CODE = _cu.UserId
        };

        var retVal = await conn.ExecuteScalarAsync<int>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal > 0;
    }

    public async Task<bool> UpdatePasswordAsync(string newPassword)
    {
        await using var connection = new SqlConnection(_cp.ConnectionName);

        await connection.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_CHANGE_PASSWORD_upd";
        var parameters = new
        {
            NEW_PASSWORD = newPassword,
            USER_CODE = _cu.UserId
        };

        var rowsAffected = await connection.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await connection.CloseAsync();

        return rowsAffected > 0;
    }
}
