using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
namespace DEEMPPORTAL.WebUI.Controllers.Ticket;


[Authorize]
[Route("ticket")]
public class TicketController : Controller
    {
    [Route("")]
        public IActionResult Index()
        {
            return View();
        }
        //[Route("/getTicket")]
        //public Task<IActionResult> GetTicket(int TicketId)
        //{
           
        //}
    }

