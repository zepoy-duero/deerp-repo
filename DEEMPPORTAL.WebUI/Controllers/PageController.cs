using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers;

[Authorize]
[Route("page")]
public class PageController : BaseController
{
	[HttpGet("")]
	public IActionResult Index(string name = "")
	{
		var trimMenuName = name.Replace(" ", "");
		return RedirectToAction("Index", trimMenuName);
	}
}
