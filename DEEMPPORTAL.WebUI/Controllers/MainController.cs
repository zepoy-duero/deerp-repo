using DEEMPPORTAL.Application.Manage.Main;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers;

[Authorize]
[Route("main")]
public class MainController(IUserMenuService userMenuService) : Controller
{
	private readonly IUserMenuService _userMenuService = userMenuService;

	[HttpGet("getMainMenus")]
	public async Task<IActionResult> GetMainMenus()
	{
		var results = await _userMenuService.GetMainMenusAsync();
		return Ok(results);
	}

	[HttpGet("getSubMenus")]
	public async Task<IActionResult> GetSubMenus(int mainMenuCode)
	{
		var results = await _userMenuService.GetSubMenusAsync(mainMenuCode);
		return Ok(results);
	}

	[HttpGet("getSubLevelMenus")]
	public async Task<IActionResult> GetSubLevelMenus(int mainMenuCode, int subMenuCode)
	{
		var results = await _userMenuService.GetSubLevelMenusAsync(mainMenuCode, subMenuCode);
		return Ok(results);
	}
}
