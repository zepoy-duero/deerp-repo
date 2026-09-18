using AutoMapper;
using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Application.Ticket;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.HR;
using DEEMPPORTAL.Domain.Ticket;
using DEEMPPORTAL.WebUI.Models;
using DocumentFormat.OpenXml.EMMA;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Net.Mail;
using System.Text.Json;


namespace DEEMPPORTAL.WebUI.Controllers.Ticket;


[Authorize]
[Route("MyTickets")]
public class TicketController(ISelectOptionsService selectOptionsService,
      IFetchOnlyOneService fetchOnlyOneService,
      ITicketService ticketService, 
      IMapper mapper, ILogger<TicketController> logger) : Controller
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
    [HttpPost("create-ticket")]
    public async Task<IActionResult> CreateTicket([FromForm] TicketModel model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var mapped = _mapper.Map<CreateTicketParams>(model);

        var updatedTicket = await _ticketService.CreateTicketAsync(mapped);
            
        return Ok(updatedTicket);
    }
    [HttpPost("upload-ticket-attachments")]
    public async Task<IActionResult> UploadTicketAttachments([FromForm] int TicketId, [FromForm] List<IFormFile>? TicketAttachments)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (!await _ticketService.UploadTicketAttachmentsAsync(TicketId,TicketAttachments))
            return BadRequest(new
            {
                isSuccess = false,
                message = "Failed to upload ticket attachment. Please try again."
            });

        return Ok(new
        {
            isSuccess = true,
            message = "Successfully created a new attachment."
        });
    }
    [HttpPost("delete-attachment")]
    public async Task<IActionResult> DeleteAttachment(int attachmentId)
    {
        if (attachmentId <= 0)
        {
            return BadRequest(new { success = false, message = "Invalid attachment or ticket ID." });
        }

        try
        {
            var result = await _ticketService.DeleteTicketAttachmentAsync(attachmentId);

            if (result)
            {
                return Ok(new { success = true, message = "Attachment deleted successfully." });
            }

            return BadRequest(new { success = false, message = "Failed to delete attachment." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting attachment {AttachmentId}", attachmentId);
            return StatusCode(500, new { success = false, message = "An error occurred while deleting the attachment." });
        }
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
   

    [HttpGet("get-ticket-attachments")]
    public async Task<IActionResult> GetTicketAttachments(int TicketId)
    {
        var ticketAttachments = await _ticketService.GetTicketAttachmentsAsync(TicketId);
        return Ok(ticketAttachments);
    }
    [HttpGet("get-attachment")]
    public async Task<AttachmentResponse> GetAttachment(int AttachmentId)
    {
        var ticketAttachment = await _ticketService.GetAttachmentAsync(AttachmentId);
        return ticketAttachment;
    }
    private string GetMimeType(string extension)
    {
        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".bmp" => "image/bmp",

            ".pdf" => "application/pdf",

            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            ".xls" => "application/vnd.ms-excel",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

            ".ppt" => "application/vnd.ms-powerpoint",
            ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",

            ".txt" => "text/plain",
            ".csv" => "text/csv",

            ".zip" => "application/zip",
            ".rar" => "application/x-rar-compressed",

            _ => "application/octet-stream"
        };
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

