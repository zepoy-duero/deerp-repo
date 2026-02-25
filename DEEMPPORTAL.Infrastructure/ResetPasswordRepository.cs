using Dapper;
using DEEMPPORTAL.Application.Account;
using DEEMPPORTAL.Common;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class ResetPasswordRepository(ConnectionPool cp) : IResetPasswordRepository
{
    private readonly ConnectionPool _cp = cp;

    public async Task<bool> ResetPasswordAsync(string newPassword, string resetToken)
    {
        await using var connection = new SqlConnection(_cp.ConnectionName);

        await connection.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_RESET_PASSWORD_upd";

        var parameters = new DynamicParameters();

        parameters.Add("@NEW_PASSWORD", newPassword);
        parameters.Add("@RESET_TOKEN", resetToken);
        parameters.Add("@RETVAL", dbType: DbType.Int32, direction: ParameterDirection.ReturnValue);

        await connection.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await connection.CloseAsync();

        var isValid = parameters.Get<int>("@RETVAL");

        return isValid > 0;
    }

    public async Task<bool> VerifyResetTokenAsync(string resetToken)
    {
        await using var connection = new SqlConnection(_cp.ConnectionName);

        await connection.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_RESET_TOKEN_sel";

        var parameters = new DynamicParameters();

        parameters.Add("@RESET_TOKEN", resetToken);
        parameters.Add("@RETVAL", dbType: DbType.Int32, direction: ParameterDirection.ReturnValue);

        await connection.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await connection.CloseAsync();

        var isValid = parameters.Get<int>("@RETVAL");

        return isValid > 0;
    }
}
