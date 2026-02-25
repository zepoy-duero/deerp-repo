using Microsoft.Extensions.Configuration;

namespace DEEMPPORTAL.Common
{
	public class ConnectionPool(IConfiguration configuration)
	{
		public string ConnectionName { get; set; } = configuration.GetConnectionString("Default") ?? "";
	}
}
