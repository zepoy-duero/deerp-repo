using Dapper;
using DEEMPPORTAL.Application.Account;
using DEEMPPORTAL.Common;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

internal class ForgotPasswordRepository(ConnectionPool cp) : IForgotPasswordRepository
{
    private readonly ConnectionPool _cp = cp;

    public async Task<string> InsertOtpCodeAsync(string emailAddress)
    {
        await using var connection = new SqlConnection(_cp.ConnectionName);

        await connection.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_RESET_OTP_crt";
        var parameters = new DynamicParameters();

        parameters.Add("@EMAIL_ADDRESS", emailAddress);
        parameters.Add("@OTP_CODE", dbType: DbType.String, size: 6, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await connection.CloseAsync();

        var returnValue = parameters.Get<string>("@OTP_CODE");

        return returnValue;
    }

    public async Task<string> InsertResetTokenAsync(string emailAddress)
    {
        await using var connection = new SqlConnection(_cp.ConnectionName);

        await connection.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_RESET_TOKEN_crt";
        var parameters = new DynamicParameters();

        parameters.Add("@EMAIL_ADDRESS", emailAddress);
        parameters.Add("@RESET_TOKEN", dbType: DbType.String, size: 255, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await connection.CloseAsync();

        var returnValue = parameters.Get<string>("@RESET_TOKEN");

        return returnValue;
    }

    public async Task<bool> IsEmailExistAsync(string emailAddress)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.IsEmployeeEmailIdExist(@EMAIL_ADDRESS)";
        var parameters = new
        {
            EMAIL_ADDRESS = emailAddress,
        };

        var retVal = await conn.ExecuteScalarAsync<int>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal > 0;
    }

    public async Task<bool> VerifyOtpCodeAsync(string emailAddress, string otpCode)
    {
        await using var connection = new SqlConnection(_cp.ConnectionName);

        await connection.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_RESET_OTP_sel";

        var parameters = new DynamicParameters();

        parameters.Add("@EMAIL_ADDRESS", emailAddress);
        parameters.Add("@OTP_CODE", otpCode);
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
