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
        Task<bool> UploadTicketAttachmentsAsync(int ticketId, IEnumerable<IFormFile> files);

    }
}
