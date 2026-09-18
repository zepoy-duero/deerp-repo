using DEEMPPORTAL.Application.Library.Form;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Library;
using DEEMPPORTAL.Domain.Ticket;

using Microsoft.AspNetCore.Http;
using System.Data;
using System.Net.Mail;



namespace DEEMPPORTAL.Application.Ticket;

public class TicketService(ITicketRepository ticketRepository,
    EmailService emailService, 
    CurrentUser cu
    ) : ITicketService
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
        return await _ticketRepository.GetAllTicketAsync(OrgCode, LocCode, DeptCode);
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


    public async Task<bool> UploadTicketAttachmentsAsync(int TicketId,List<IFormFile>? TicketAttachments)
    {
        var dt = new DataTable();
        dt.Columns.Add("TicketId", typeof(int));
        dt.Columns.Add("FileName", typeof(string));
        dt.Columns.Add("FileExtension", typeof(string));
        dt.Columns.Add("FileSize", typeof(int));
        dt.Columns.Add("FileAttachment", typeof(byte[]));
        dt.Columns.Add("UploadedDate", typeof(DateTime));
        dt.Columns.Add("UpdatedBy", typeof(int));

        if (TicketAttachments != null)
        {
            foreach (var ticketAttachment in TicketAttachments)
            {
                using var ms = new MemoryStream();
                await ticketAttachment.CopyToAsync(ms);

                // Add a row. If you have a user id in CurrentUser, replace DBNull.Value with the real value.
                dt.Rows.Add(
                    TicketId,
                    ticketAttachment.FileName,
                    Path.GetExtension(ticketAttachment.FileName)?.TrimStart('.') ?? string.Empty,
                    (int)ticketAttachment.Length / 1024,
                    ms.ToArray(),
                    DateTime.UtcNow,
                    _cu.UserId
                );
            }
        }
        return await _ticketRepository.UploadTicketAttachmentsAsync(dt);
    }
    public async Task<bool> UploadCorrespondenceAttachmentsAsync(int TicketId,List<IFormFile>? CorrespondenceAttachments)
    {
        var dt = new DataTable();
        dt.Columns.Add("TicketId", typeof(int));
        dt.Columns.Add("FileName", typeof(string));
        dt.Columns.Add("FileExtension", typeof(string));
        dt.Columns.Add("FileSize", typeof(int));
        dt.Columns.Add("FileAttachment", typeof(byte[]));
        dt.Columns.Add("UploadedDate", typeof(DateTime));
        dt.Columns.Add("UpdatedBy", typeof(int));

        if (CorrespondenceAttachments != null)
        {
            foreach (var correspondenceAttachment in CorrespondenceAttachments)
            {
                using var ms = new MemoryStream();
                await correspondenceAttachment.CopyToAsync(ms);

                // Add a row. If you have a user id in CurrentUser, replace DBNull.Value with the real value.
                dt.Rows.Add(
                    TicketId,
                    correspondenceAttachment.FileName,
                    Path.GetExtension(correspondenceAttachment.FileName)?.TrimStart('.') ?? string.Empty,
                    (int)correspondenceAttachment.Length / 1024,
                    ms.ToArray(),
                    DateTime.UtcNow,
                    _cu.UserId
                );
            }
        }
        return await _ticketRepository.UploadCorrespondenceAttachmentsAsync(dt);
    }
    public async Task<IEnumerable<TicketAttachmentsResponse>> GetTicketAttachmentsAsync(int TicketId)
    {
        return await _ticketRepository.GetTicketAttachmentsAsync(TicketId);
    }
    public async Task<AttachmentResponse> GetAttachmentAsync(int AttachmentId)
    {
        return await _ticketRepository.GetAttachmentAsync(AttachmentId);
    }
    public async Task<bool> DeleteTicketAttachmentAsync(int attachmentId)
    {
        return await _ticketRepository.DeleteTicketAttachmentAsync(attachmentId);
    }
    public async Task<bool> DeleteCorrespondenceAttachmentAsync(int attachmentId)
    {
        return await _ticketRepository.DeleteCorrespondenceAttachmentAsync(attachmentId);
    }
    public async Task<TicketCorrespondence?> GetByIdAsync(int correspondenceId)
    {
        return await _ticketRepository.GetByIdAsync(correspondenceId);
    }
    public async Task<List<TicketCorrespondence>> GetByTicketIdAsync(int ticketId)
    {
        return await _ticketRepository.GetByTicketIdAsync(ticketId);
    }
    public async Task<IEnumerable<CorrespondenceAttachmentsResponse>> GetCorrespondenceAttachmentsAsync(int TicketId)
    {
        return await _ticketRepository.GetCorrespondenceAttachmentsAsync(TicketId);
    }
    public async Task<CorrespondenceAttachmentsResponse> GetCorrespondenceAttachmentAsync(int AttachmentId)
    {
        return await _ticketRepository.GetCorrespondenceAttachmentAsync(AttachmentId);
    }
    public async Task<TicketCorrespondence?> InsertAsync(TicketCorrespondenceRequest model)
    {
        return await _ticketRepository.InsertAsync(model);
    }
    public async Task<TicketCorrespondence?> UpdateAsync(UpdateTicketCorrespondenceRequest model)
    {
        return await _ticketRepository.UpdateAsync(model);
    }
    public async Task<bool> DeleteAsync(DeleteTicketCorrespondenceRequest model)
    {
        return await _ticketRepository.DeleteAsync(model);
    }
}
