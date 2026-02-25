using Dapper;
using DEEMPPORTAL.Application.Manage.Role;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Manage.Role;
using DEEMPPORTAL.Domain.Manage.RoleMenu;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class RoleRepository(ConnectionPool cp, CurrentUser cu) : IRoleRepository
{
	private readonly ConnectionPool _cp = cp;
	private readonly CurrentUser _cu = cu;

	public async Task<IEnumerable<RoleResponse>> GetAllRolesAsync(string searchParam)
	{
		await using var conn = new SqlConnection(_cp.ConnectionName);
		await conn.OpenAsync();

		const string storedProcedure = "CLOUD_v1_ERP_ROLE_sel";
		var parameters = new
		{
			SEARCH_PARAM = searchParam,
		};

		var results = await conn.QueryAsync<RoleResponse>(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		await conn.CloseAsync();

		return results;
	}

	public async Task<RoleDetailResponse> GetRoleAsync(int roleCode)
	{
		await using var conn = new SqlConnection(_cp.ConnectionName);

		await conn.OpenAsync();
		const string storedProcedure = "CLOUD_v1_ERP_ROLE_DETAIL_sel";
		var parameters = new
		{
			ROLE_CODE = roleCode,
		};

		var results = await conn.QueryFirstOrDefaultAsync<RoleDetailResponse>(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		await conn.CloseAsync();

		return results ?? new RoleDetailResponse();
	}

	public async Task<int> UpdSertRoleAsync(DataTable dt)
	{
		await using var conn = new SqlConnection(_cp.ConnectionName);
		await conn.OpenAsync();

		const string storedProcedure = "dbo.CLOUD_v1_ERP_ROLE_upd";
		var parameters = new
		{
			TT = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_ROLE"),
			USER_ID = _cu.UserId,
		};

		var rowsAffected = await conn.ExecuteAsync(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		await conn.CloseAsync();

		return rowsAffected;
	}

	public async Task<int> DeleteRoleAsync(int roleCode)
	{
		await using var conn = new SqlConnection(_cp.ConnectionName);
		await conn.OpenAsync();

		const string storedProcedure = "dbo.CLOUD_v1_ERP_ROLE_del";
		var parameters = new
		{
			ROLE_CODE = roleCode,
		};

		var rowsAffected = await conn.ExecuteAsync(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		await conn.CloseAsync();

		return rowsAffected;
	}

	public async Task<IEnumerable<UserRoleResponse>> GetRoleUsersAsync(int roleCode, string searchParam)
	{
		await using var conn = new SqlConnection(_cp.ConnectionName);
		await conn.OpenAsync();

		const string storedProcedure = "CLOUD_v1_ERP_ROLE_USER_sel";
		var parameters = new
		{
			ROLE_CODE = roleCode,
			SEARCH_PARAM = searchParam,
		};

		var results = await conn.QueryAsync<UserRoleResponse>(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		await conn.CloseAsync();

		return results;
	}
}
