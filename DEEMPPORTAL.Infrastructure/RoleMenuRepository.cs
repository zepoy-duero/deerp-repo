using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Manage.RoleMenu;
using DEEMPPORTAL.Application.Manage.RoleMenu;

namespace DEEMPPORTAL.Infrastructure;

public class RoleMenuRepository(ConnectionPool cp, CurrentUser cu) : IRoleMenuRepository
{
	private readonly ConnectionPool _cp = cp;
	private readonly CurrentUser _cu = cu;

	public async Task<IEnumerable<RoleMenuResponse>> GetRoleMenusAsync(int roleCode)
	{
		await using var conn = new SqlConnection(_cp.ConnectionName);
		await conn.OpenAsync();

		const string storedProcedure = "dbo.CLOUD_v1_ERP_ROLE_MENU_sel";
		var parameters = new
		{
			ROLE_CODE = roleCode
		};

		var results = await conn.QueryAsync<RoleMenuResponse>(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		await conn.CloseAsync();

		return results;
	}

	public async Task<int> UpdSertRoleMenuAsync(DataTable dt)
	{
		await using var conn = new SqlConnection(_cp.ConnectionName);
		await conn.OpenAsync();

		const string storedProcedure = "dbo.CLOUD_v1_ERP_ROLE_MENU_upd";
		var parameters = new
		{
			TT = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_ROLE_MENU"),
			USER_ID = _cu.UserId,
		};

		var rowsAffected = await conn.ExecuteAsync(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		await conn.CloseAsync();

		return rowsAffected;
	}
}
