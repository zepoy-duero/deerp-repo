using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Ticket;


[Authorize]
[Route("ticket")]
public class TicketController : Controller
    {
    [HttpGet("")]
    public IActionResult Index()
    {
        if (User?.Identity?.IsAuthenticated == false)
            return RedirectToAction("Index", "Login", new { area = "Auth" });
        else
            return View();
    }
    //[Route("/getTicket")]
    //public Task<IActionResult> GetTicket(int TicketId)
    //{

    //}
}

