using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Auth;

[Route("auth/logout")]
public class LogoutController : Controller
{
    [HttpGet("")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        HttpContext.Response.Cookies.Delete("JwtToken");

        //_userMenuService.ClearUserMenuCache();

        return RedirectToAction("Index", "Login", new { area = "Auth" });
    }
}
