using DEEMPPORTAL.Application.Library.Form;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Library;
using DEEMPPORTAL.Domain.Ticket;

using Microsoft.AspNetCore.Http;
using System.Data;
using System.Net.Mail;



namespace DEEMPPORTAL.Application.Ticket;

public class TicketService(ITicketRepository ticketRepository, EmailService emailService, CurrentUser cu) : ITicketService
{
    private readonly ITicketRepository _ticketRepository = ticketRepository;
    private readonly EmailService _emailService = emailService;
    private readonly CurrentUser _cu = cu;
    public async Task<TicketResponse> CreateTicketAsync(CreateTicketParams request)
    {
        var result = await _ticketRepository.CreateTicketAsync(request);
       
        return result;
    }
    public async Task<IEnumerable<TicketResponse>> GetAllTicketAsync(int OrgCode, int LocCode, int DeptCode)
    {
        return await _ticketRepository.GetAllTicketAsync(OrgCode,LocCode,DeptCode);
    }

    public async Task<IEnumerable<TicketSelectOptions>> GetUserOptionsAsync()
    {
        return await _ticketRepository.GetUserOptionsAsync();
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetAssigneeOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        return await _ticketRepository.GetAssigneeOptionsAsync(OrgCode, LocCode, DeptCode);
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetPriorityOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        return await _ticketRepository.GetPriorityOptionsAsync(OrgCode, LocCode, DeptCode);
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetTicketDepartmentOptionsAsync(int OrgCode, int LocCode)
    {
        return await _ticketRepository.GetTicketDepartmentOptionsAsync(OrgCode, LocCode);
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetModuleOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        return await _ticketRepository.GetModuleOptionsAsync(OrgCode, LocCode, DeptCode);
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetDurationUnitOptionsAsync()
    {
        return await _ticketRepository.GetDurationUnitOptionsAsync();
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetStatusOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        return await _ticketRepository.GetStatusOptionsAsync(OrgCode, LocCode, DeptCode);
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetTypeOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        return await _ticketRepository.GetTypeOptionsAsync(OrgCode, LocCode, DeptCode);
    }
    public async Task<bool> SendEmailNotificationAsync(TicketEmailNotification request)
    {
        return await _ticketRepository.SendEmailNotificationAsync(request);
    }
    public async Task<TicketResponse> UpdateTicketAsync(UpdateTicketParams ticket)
    {
        var updatedTicket = await _ticketRepository.UpdateTicketAsync(ticket);
        return updatedTicket;
    }

   
    public async Task<bool> UploadTicketAttachmentsAsync(int ticketId,IEnumerable<IFormFile> TicketAttachments)
    {
        var id = ticketId;
        // Prepare DataTable that matches the SQL TVP type "dbo.TicketAttachmentType"
        var dt = new DataTable();
        dt.Columns.Add("FileName", typeof(string));
        dt.Columns.Add("FileExtension", typeof(string));
        dt.Columns.Add("FileSize", typeof(int));
        dt.Columns.Add("FileAttachment", typeof(byte[]));
        dt.Columns.Add("UploadedDate", typeof(DateTime));
        dt.Columns.Add("UpdatedBy", typeof(int));

        foreach (var file in TicketAttachments)
        {
            if (file.Length > 0)
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);

                // Add a row. If you have a user id in CurrentUser, replace DBNull.Value with the real value.
                dt.Rows.Add(
                    file.FileName,
                    Path.GetExtension(file.FileName)?.TrimStart('.') ?? string.Empty,
                    (int)file.Length,
                    ms.ToArray(),
                    DateTime.UtcNow,
                    _cu.UserId
                );
            }
        }
        return await _ticketRepository.UploadTicketAttachmentsAsync(ticketId, dt);
    }
}
