using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace DEEMPPORTAL.Common;

public class IpInfo(IHttpContextAccessor httpContextAccessor)
{
	private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

	public async Task<(string? ip, string? country, string? city, string? browser)> GetIpAsync()
	{
		const string url = $"https://ipinfo.io/?token=8fb5474ca48976";
		using var httpClient = new HttpClient();
		var response = await httpClient.GetAsync(url);

		if (!response.IsSuccessStatusCode) return (ip: null, country: null, city: null, browser: null);

		var jsonResponse = await response.Content.ReadAsStringAsync();
		var ipInfo = JsonSerializer.Deserialize<JsonElement>(jsonResponse);

		var ip = ipInfo.GetProperty("ip").GetString();
		var country = ipInfo.GetProperty("country").GetString();
		var city = ipInfo.GetProperty("city").GetString();
		var browser = _httpContextAccessor.HttpContext?.Request.Headers["User-Agent"].ToString() ?? string.Empty;

		return (ip, country, city, browser);
	}
}
