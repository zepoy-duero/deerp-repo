using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Application.Shared;

namespace DEEMPPORTAL.Infrastructure;

public class FetchOnlyOneRepository(ConnectionPool cp, CurrentUser cu) : IFetchOnlyOneRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<string> GetHrEmailByUserCode(int userCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetHrEmailAddressByUserId(@USER_CODE)";
        var parameters = new
        {
            USER_CODE = userCode,
        };

        var retVal = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal!;
    }

    public async Task<byte[]> GetLeaveApplicationAttachment(int leaveApplicationCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetLeaveApplicationAttachment(@LEAVE_APPLICATION_CODE)";
        var parameters = new
        {
            LEAVE_APPLICATION_CODE = leaveApplicationCode
        };

        var retVal = await conn.ExecuteScalarAsync<byte[]>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal!;
    }

    public async Task<string> GetManagerEmailByLeaveApplicationCode(int leaveApplicationCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "";
        var parameters = new
        {
            LEAVE_APPLICATION_CODE = leaveApplicationCode,
        };

        var retVal = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal!;
    }

    public async Task<string> GetManagerEmailByUserCode(int userCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetManagerEmailAddressByUserId(@USER_CODE)";
        var parameters = new
        {
            USER_CODE = userCode,
        };

        var retVal = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal!;
    }

    public async Task<string> GetManagerEmailByUserCode()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetManagerEmailAddressByUserId(@USER_CODE)";
        var parameters = new
        {
            USER_CODE = _cu.UserId,
        };

        var retVal = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal!;
    }

    public async Task<string> GetTotalAccumulatedDays(string? startDate)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetTotalAccumulatedDays(@START_DATE, @USER_CODE)";
        var parameters = new
        {
            START_DATE = startDate,
            USER_CODE = _cu.UserId,
        };

        var retVal = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal!;
    }

    public async Task<string> GetUserEmailByUserCode(int userCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetUserEmailAddressByUserId(@USER_CODE)";
        var parameters = new
        {
            USER_CODE = userCode,
        };

        var retVal = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal!;
    }

    public async Task<string> GetUserEmailByUserCode()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetUserEmailAddressByUserId(@USER_CODE)";
        var parameters = new
        {
            USER_CODE = _cu.UserId,
        };

        var retVal = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal!;
    }

    public async Task<string> GetUserSatisfactionEmailRecipient()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetUserSatisfactionEmailRecipient()";
        var parameters = new { };

        var retVal = await conn.ExecuteScalarAsync<string>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal!;
    }

    public async Task<int> GetUserSatisfactionLatestId()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.GetUserSatisfactionLatestId()";
        var parameters = new { };

        var retVal = await conn.ExecuteScalarAsync<int>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal!;
    }

    public async Task<bool> IsUserManager(int userCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "SELECT dbo.IsUserManager(@USER_CODE)";
        var parameters = new
        {
            USER_CODE = userCode
        };

        var retVal = await conn.ExecuteScalarAsync<int>(
            storedProcedure,
            parameters,
            commandType: CommandType.Text);

        await conn.CloseAsync();

        return retVal > 0;
    }
}
