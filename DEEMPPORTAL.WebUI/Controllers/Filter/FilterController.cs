using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Filter
{
    [Authorize]
    [Route("filter")]
    public class FilterController : Controller
    {
        public IActionResult getOrganizationFilter()
        {
            return View();
        }
    }
}
