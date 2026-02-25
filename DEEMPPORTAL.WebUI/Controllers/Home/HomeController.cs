using DEEMPPORTAL.Application.Home;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Home;

[Authorize]
[Route("home")]
public class HomeController(IHomeService homeService) : BaseController
{
	private readonly IHomeService _homeService = homeService;

	[HttpGet("")]
	public IActionResult Index() => View();

	[HttpGet("getUserDetails")]
	public async Task<IActionResult> GetUserDetail()
	{
		var results = await _homeService.GetUserDetailsAsync();
		return Ok(results);
	}

	[AllowAnonymous]
	[HttpGet("debug-auth")]
	public IActionResult DebugAuth()
	{
		return Ok(new
		{
			isAuthenticated = User?.Identity?.IsAuthenticated ?? false,
			hasJwtCookie = Request.Cookies.ContainsKey("JwtToken"),
			jwtCookieLength = Request.Cookies["JwtToken"]?.Length ?? 0
		});
	}
}
