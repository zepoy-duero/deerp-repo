using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.HR;
using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.Domain.Ticket;
using Microsoft.AspNetCore.Http;

namespace DEEMPPORTAL.Application.Ticket
{
    public interface ITicketService
    {
        Task<IEnumerable<TicketResponse>> GetAllTicketAsync(int OrgCode, int LocCode, int DeptCode);
        Task<TicketResponse> CreateTicketAsync(CreateTicketParams request);
        Task<IEnumerable<TicketSelectOptions>> GetUserOptionsAsync();
        Task<IEnumerable<TicketSelectOptions>> GetAssigneeOptionsAsync(int OrgCode, int LocCode, int DeptCode);
        Task<IEnumerable<TicketSelectOptions>> GetPriorityOptionsAsync(int OrgCode, int LocCode, int DeptCode);
        Task<IEnumerable<TicketSelectOptions>> GetModuleOptionsAsync(int OrgCode, int LocCode, int DeptCode);
        Task<IEnumerable<TicketSelectOptions>> GetTicketDepartmentOptionsAsync(int OrgCode, int LocCode);
        Task<IEnumerable<TicketSelectOptions>> GetDurationUnitOptionsAsync();
        Task<IEnumerable<TicketSelectOptions>> GetStatusOptionsAsync(int OrgCode, int LocCode, int DeptCode);
        Task<IEnumerable<TicketSelectOptions>> GetTypeOptionsAsync(int OrgCode, int LocCode, int DeptCode);
        Task<bool> SendEmailNotificationAsync(TicketEmailNotification request);
        Task<TicketResponse> UpdateTicketAsync(UpdateTicketParams ticket);

        Task<IEnumerable<TicketAttachmentsResponse>> GetTicketAttachmentsAsync(int ticketId);
        Task<AttachmentResponse> GetAttachmentAsync(int AttachmentId);
        Task<bool> UploadTicketAttachmentsAsync(int TicketId,List<IFormFile>? ticketAttachment);
        Task<bool> DeleteTicketAttachmentAsync(int attachmentId);
        Task<bool> DeleteCorrespondenceAttachmentAsync(int attachmentId);

        //TICKET CORRESPONDENCE
        Task<TicketCorrespondence?> GetByIdAsync(
                int correspondenceId);

        Task<List<TicketCorrespondence>> GetByTicketIdAsync(
            int ticketId);

        Task<TicketCorrespondence?> InsertAsync(
            TicketCorrespondenceRequest model);

        Task<TicketCorrespondence?> UpdateAsync(
            UpdateTicketCorrespondenceRequest model);

        Task<bool> DeleteAsync(
            DeleteTicketCorrespondenceRequest model);
        Task<bool> UploadCorrespondenceAttachmentsAsync(int ticketId, List<IFormFile>? ticketAttachments);
        Task<IEnumerable<CorrespondenceAttachmentsResponse>> GetCorrespondenceAttachmentsAsync(int TicketId);
        Task<CorrespondenceAttachmentsResponse> GetCorrespondenceAttachmentAsync(int attachmentId);
    }
}
