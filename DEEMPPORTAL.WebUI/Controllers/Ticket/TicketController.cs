using AutoMapper;

using DEEMPPORTAL.Application.Shared;

using DEEMPPORTAL.Application.Ticket;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.MyProfile;
using DEEMPPORTAL.Domain.Ticket;
using DEEMPPORTAL.WebUI.Models;
using Erp.Application.MyProfile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Ticket;


[Authorize]
[Route("MyTickets")]
public class TicketController(ISelectOptionsService selectOptionsService,
      ITicketService ticketService, IMapper mapper) : Controller
{
  private readonly ITicketService _ticketService = ticketService;
    private readonly ISelectOptionsService _selectOptionsService = selectOptionsService;

    private readonly IMapper _mapper = mapper;
    [HttpGet("")]
    public IActionResult Index()
    {
            return View();
    }

    [HttpGet("get-tickets")]
    public async Task<IActionResult> GetAllTicket(int DeptCode)
    {
        var data = await _ticketService.GetAllTicketAsync(DeptCode);

        return Ok(data);
    }
    [HttpGet("get-user-options")]
    public async Task<IEnumerable<TicketSelectOptions>> GetUserOptions()
    {
        var options = await _ticketService.GetUserOptionsAsync();
        return options;
    }
    [HttpGet("get-assignee-options")]
    public async Task<IEnumerable<TicketSelectOptions>> GetAssigneeOptions(int OrgCode, int LocCode, int DeptCode)
    {
        var options = await _ticketService.GetAssigneeOptionsAsync(OrgCode, LocCode, DeptCode);
        return options;
    }
    [HttpGet("get-priority-options")]
    public async Task<IEnumerable<TicketSelectOptions>> GetPriorityOptions(int OrgCode, int LocCode, int DeptCode)
    {
        var options = await _ticketService.GetPriorityOptionsAsync(OrgCode, LocCode, DeptCode);
        return options!;
    }
    [HttpGet("get-module-options")]
    public async Task<IEnumerable<TicketSelectOptions>> GetModuleOptions(int OrgCode, int LocCode, int DeptCode)
    {
        var options = await _ticketService.GetModuleOptionsAsync(OrgCode, LocCode, DeptCode);
        return options;
    }
    [HttpGet("get-duration-unit-options")]
    public async Task<IEnumerable<TicketSelectOptions>> GetDurationUnitOptions()
    {
        var options = await _ticketService.GetDurationUnitOptionsAsync();
        return options;
    }
    [HttpGet("get-status-options")]
    public async Task<IEnumerable<TicketSelectOptions>> GetStatusOptions(int OrgCode, int LocCode, int DeptCode)
    {
        var options = await _ticketService.GetStatusOptionsAsync(OrgCode, LocCode, DeptCode);
        return options;
    }
    [HttpGet("get-type-options")]
    public async Task<IEnumerable<TicketSelectOptions>> GetTypeOptions(int OrgCode, int LocCode, int DeptCode)
    {
        var options = await _ticketService.GetTypeOptionsAsync(OrgCode, LocCode, DeptCode);
        return options;
    }

    [HttpGet("get-ticket-department-options")]
    public async Task<IActionResult> GetTicketDepartment(int OrgCode, int LocCode)
    {
        var options = await _ticketService.GetTicketDepartmentListAsync(OrgCode, LocCode);

        return Ok(options);
    }
    [HttpPost("create-ticket")]
    public async Task<IActionResult> CreateTicket(TicketModel model)
    {
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var mapped = _mapper.Map<CreateTicketParams>(model);
            var isSaved = await _ticketService.CreateTicketAsync(mapped);

            return Ok(isSaved);
        }
    }
    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file != null && file.Length > 0)
        {
            // Define where to save (e.g., wwwroot/uploads)
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/files/uploads", file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }
        return Ok();
    }
}

