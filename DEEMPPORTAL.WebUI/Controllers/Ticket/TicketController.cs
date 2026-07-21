using AutoMapper;
using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Application.Ticket;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Ticket;
using DEEMPPORTAL.WebUI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;


namespace DEEMPPORTAL.WebUI.Controllers.Ticket;


[Authorize]
[Route("MyTickets")]
public class TicketController(ISelectOptionsService selectOptionsService,
      IFetchOnlyOneService fetchOnlyOneService,
      ITicketService ticketService, IMapper mapper, ILogger<TicketController> logger) : Controller
{
    private readonly ITicketService _ticketService = ticketService;
    private readonly ISelectOptionsService _selectOptionsService = selectOptionsService;
    private readonly IFetchOnlyOneService _fetchOnlyOneService = fetchOnlyOneService;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<TicketController> _logger = logger;

    [HttpGet("")]
    public IActionResult Index()
    {
            return View();
    }

    [HttpGet("get-tickets")]
    public async Task<IActionResult> GetAllTicket(int OrgCode, int LocCode,int DeptCode)    
    {
        var data = await _ticketService.GetAllTicketAsync(OrgCode, LocCode,DeptCode);
        return Ok(data);
    }

    [HttpPost("update-ticket")]
    public async Task<IActionResult> UpdateTicket(TicketViewModel ticket)
    {
            if (!ModelState.IsValid) 
            {
                _logger.LogWarning("UpdateTicket called with invalid ModelState: {ModelStateErrors}", JsonSerializer.Serialize(ModelState.Where(m=>m.Value.Errors.Count>0).ToDictionary(k=>k.Key,v=>v.Value.Errors.Select(e=>e.ErrorMessage))));
                return BadRequest(ModelState);
            }

            // Defensive logging: log incoming payload and mapped DTO
            try
            {
                _logger.LogInformation("UpdateTicket called. Incoming model: {Model}", JsonSerializer.Serialize(ticket));
            }
            catch { /* ignore serialization errors */ }

            var mapped = _mapper.Map<UpdateTicketParams>(ticket);

            try
            {
                _logger.LogInformation("Mapped UpdateTicketParams: {Mapped}", JsonSerializer.Serialize(mapped));
            }
            catch { /* ignore serialization errors */ }

            var updatedTicket = await _ticketService.UpdateTicketAsync(mapped);

            return Ok(updatedTicket);
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
    public async Task<IEnumerable<TicketSelectOptions>> GetTicketDepartmentOptions(int OrgCode, int LocCode)
    {
        var options = await _ticketService.GetTicketDepartmentOptionsAsync(OrgCode, LocCode);

        return options;
    }
    [HttpPost("create-ticket")]
    public async Task<IActionResult> CreateTicket(TicketModel model)
    {
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var mapped = _mapper.Map<CreateTicketParams>(model);
            var updatedTicket = await _ticketService.CreateTicketAsync(mapped);
           
            //var managerEmailId = await _fetchOnlyOneService.GetManagerEmailByDeptCode(mapped.DeptCode);
            //var userEmailId = await _fetchOnlyOneService.GetUserEmailByUserCode(mapped.RequestedByCode);

            return Ok(updatedTicket);
        }
    }

    [HttpPost("upload-ticket-attachments")]
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
    [HttpPost("send-email-notification")]
    public async Task<IActionResult> SendEmailNotification(TicketEmailNotification request)
    {
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
          
            var emailReceipt = await _ticketService.SendEmailNotificationAsync(request);
            return Ok(emailReceipt);
        }
    }
}

