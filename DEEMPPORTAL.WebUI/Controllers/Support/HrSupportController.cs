using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Support;

[AllowAnonymous]
[Route("support/hr-support")]
public class HrSupportController : BaseController
{
  [HttpGet("")]
  public IActionResult Index() => View();
}
