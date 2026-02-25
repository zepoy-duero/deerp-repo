using Dapper;
using DEEMPPORTAL.Application.Manage.Main;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Manage;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class UserMenuRepository(ConnectionPool cp, CurrentUser cu) : IUserMenuRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<IEnumerable<UserMenuResponse>> GetMainMenusAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_USER_MENU_MAIN_sel";
        var parameters = new
        {
            USER_ID = _cu.UserId,
        };

        var results = await conn.QueryAsync<UserMenuResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results;
    }

    public async Task<IEnumerable<UserMenuResponse>> GetSubMenusAsync(int? mainMenuCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_USER_MENU_SUB_sel";
        var parameters = new
        {
            MAIN_MENU_CODE = mainMenuCode,
            USER_ID = _cu.UserId,
        };

        var results = await conn.QueryAsync<UserMenuResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results;
    }

    public async Task<IEnumerable<UserMenuResponse>> GetSubLevelMenusAsync(int? mainMenuCode, int? subMenuCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_USER_MENU_SUB_LEVEL_sel";
        var parameters = new
        {
            MAIN_MENU_CODE = mainMenuCode,
            SUB_MENU_CODE = subMenuCode,
            USER_ID = _cu.UserId,
        };

        var results = await conn.QueryAsync<UserMenuResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results;
    }
}
