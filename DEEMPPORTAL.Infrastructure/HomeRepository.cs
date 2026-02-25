using Dapper;
using DEEMPPORTAL.Application.Home;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Home;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class HomeRepository(ConnectionPool cp, CurrentUser cu) : IHomeRepository
{
	private readonly ConnectionPool _cp = cp;
	private readonly CurrentUser _cu = cu;

	public async Task<HomeResponse> GetUserDetailsAsync()
	{
		await using var conn = new SqlConnection(_cp.ConnectionName);

		await conn.OpenAsync();

		const string storedProcedure = "CLOUD_v1_ERP_HOME_USER_sel";
		var parameters = new
		{
			USER_CODE = _cu.UserId,
		};

		var results = await conn.QueryFirstOrDefaultAsync<HomeResponse>(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		await conn.CloseAsync();

		return results!;
	}
}
