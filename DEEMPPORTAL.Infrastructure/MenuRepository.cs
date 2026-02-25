using Dapper;
using DEEMPPORTAL.Application.Manage.Menu;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Manage.Menu;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class MenuRepository(ConnectionPool cp, CurrentUser cu) : IMenuRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<IEnumerable<MenuResponse>> GetMainMenusAsync(string searchParam)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_MENU_MAIN_sel";
        var parameters = new
        {
            SEARCH_PARAM = searchParam,
        };

        var results = await conn.QueryAsync<MenuResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results;
    }

    public async Task<IEnumerable<MenuResponse>> GetSubMenusAsync(int? mainMenuCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_MENU_SUB_sel";
        var parameters = new
        {
            MAIN_MENU_CODE = mainMenuCode
        };

        var results = await conn.QueryAsync<MenuResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results;
    }

    public async Task<IEnumerable<MenuResponse>> GetSubLevelMenusAsync(int? mainMenuCode, int? subMenuCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_MENU_SUB_LEVEL_sel";
        var parameters = new
        {
            MAIN_MENU_CODE = mainMenuCode,
            SUB_MENU_CODE = subMenuCode
        };

        var results = await conn.QueryAsync<MenuResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results;
    }

    public async Task<MenuDetailResponse> GetMenuDetailAsync(int? mainMenuCode, int? subMenuCode, int? subLevelMenuCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_MENU_DETAIL_sel";
        var parameters = new
        {
            MAIN_MENU_CODE = mainMenuCode,
            SUB_MENU_CODE = subMenuCode,
            SUB_LEVEL_MENU_CODE = subLevelMenuCode
        };

        var results = await conn.QueryFirstOrDefaultAsync<MenuDetailResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results ?? new MenuDetailResponse();
    }

    public async Task<int> UpdSertMainMenuAsync(DataTable dt)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_MENU_MAIN_upd";
        var parameters = new
        {
            TT = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_MENU_DETAIL"),
            USER_ID = _cu.UserId,
        };

        var rowsAffected = await conn.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected;
    }

    public async Task<int> UpdSertSubMenuAsync(DataTable dt)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_MENU_SUB_upd";
        var parameters = new
        {
            TT = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_MENU_DETAIL"),
            USER_ID = _cu.UserId,
        };

        var rowsAffected = await conn.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected;
    }

    public async Task<int> UpdSertSubLevelMenuAsync(DataTable dt)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_MENU_SUB_LEVEL_upd";
        var parameters = new
        {
            TT = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_MENU_DETAIL"),
            USER_ID = _cu.UserId,
        };

        var rowsAffected = await conn.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected;
    }

    public async Task<int> DeleteMenuAsync(DataTable dt)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_MENU_del";
        var parameters = new
        {
            TT = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_MENU_CODES")
        };

        var rowsAffected = await conn.ExecuteAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected;
    }
}
