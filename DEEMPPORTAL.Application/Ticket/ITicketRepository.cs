using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Ticket;
using System.Data;

namespace DEEMPPORTAL.Application.Ticket;

public interface ITicketRepository
{
    Task<IEnumerable<TicketResponse>> GetAllTicketAsync(int OrgCode, int LocCode, int DeptCode);
    Task<IEnumerable<TicketSelectOptions>> GetAssigneeOptionsAsync(int OrgCode, int LocCode, int DeptCode);
    Task<IEnumerable<TicketSelectOptions>> GetDurationUnitOptionsAsync();
    Task<IEnumerable<TicketSelectOptions>> GetModuleOptionsAsync(int OrgCode, int LocCode, int DeptCode);
    Task<IEnumerable<TicketSelectOptions>> GetTicketDepartmentOptionsAsync(int OrgCode, int LocCode);
    Task<IEnumerable<TicketSelectOptions>> GetPriorityOptionsAsync(int OrgCode, int LocCode, int DeptCode);
    Task<IEnumerable<TicketSelectOptions>> GetStatusOptionsAsync(int OrgCode, int LocCode, int DeptCode);
    Task<IEnumerable<TicketSelectOptions>> GetUserOptionsAsync();
    Task<IEnumerable<TicketSelectOptions>> GetTypeOptionsAsync(int OrgCode, int LocCode, int DeptCode);
    Task<TicketResponse> CreateTicketAsync(CreateTicketParams request);
    Task<bool> SendEmailNotificationAsync(TicketEmailNotification request);
    Task<TicketResponse> UpdateTicketAsync(UpdateTicketParams ticket);

    // Accept prepared DataTable representing TVP for upload
    Task<bool> UploadTicketAttachmentsAsync(DataTable ticketAttachment);
    Task<IEnumerable<TicketAttachmentsResponse>> GetTicketAttachmentsAsync(int ticketId);
    Task<bool> DeleteTicketAttachmentAsync(int attachmentId);

    //TICKET CORRESPONDENCE
    Task<TicketCorrespondence?> GetByIdAsync(int correspondenceId);

    Task<List<TicketCorrespondence>> GetByTicketIdAsync(int ticketId);

    Task<TicketCorrespondence?> InsertAsync(TicketCorrespondenceRequest model);

    Task<TicketCorrespondence?> UpdateAsync(UpdateTicketCorrespondenceRequest model);

    Task<bool> DeleteAsync(DeleteTicketCorrespondenceRequest model);
}
