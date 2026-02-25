using Dapper;
using DEEMPPORTAL.Application.Support;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Support;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class UserSatisfactionRepository(ConnectionPool cp) : IUserSatisfactionRepository
{
    private readonly ConnectionPool _cp = cp;

    public async Task<bool> InsertAsync(UserSatisfactionRequest request)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_USER_SATISFACTION_crt";
        var parameters = new
        {
            RATING = request.RATING_VALUE,
            FEEDBACK = request.FEEDBACK ?? "",
            COMPLAINT = request.COMPLAINT ?? "",
            SUGGESTION = request.SUGGESTION ?? "",
            IP_ADDRESS = request.IP_ADDRESS ?? "",
            IP_CITY = request.IP_CITY ?? "",
            IP_COUNTRY = request.IP_COUNTRY ?? "",
            BROWSER_INFO = request.BROWSER_INFO ?? "",
            EMAIL_TEXT = request.EMAIL_TEXT ?? ""
        };

        var rowsAffected = await conn.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected > 0;
    }
}
