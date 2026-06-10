using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.HR;
using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.Domain.Ticket;

namespace DEEMPPORTAL.Application.Ticket
{
    public interface ITicketService
    {
        Task<IEnumerable<TicketResponse>> GetAllTicketAsync(int DeptCode);
        Task<IEnumerable<TicketResponse>> CreateTicketAsync(CreateTicketParams request);
        Task<IEnumerable<TicketSelectOptions>> GetUserOptionsAsync();
        Task<IEnumerable<TicketSelectOptions>> GetAssigneeOptionsAsync(int OrgCode, int LocCode, int DeptCode);
        Task<IEnumerable<TicketSelectOptions>> GetPriorityOptionsAsync(int OrgCode, int LocCode, int DeptCode);
        Task<IEnumerable<TicketSelectOptions>> GetModuleOptionsAsync(int OrgCode, int LocCode, int DeptCode);
        Task<IEnumerable<TicketSelectOptions>> GetTicketDepartmentOptionsAsync(int OrgCode, int LocCode);
        Task<IEnumerable<TicketSelectOptions>> GetDurationUnitOptionsAsync();
        Task<IEnumerable<TicketSelectOptions>> GetStatusOptionsAsync(int OrgCode, int LocCode, int DeptCode);
        Task<IEnumerable<TicketSelectOptions>> GetTypeOptionsAsync(int OrgCode, int LocCode, int DeptCode);
        Task<bool> SendEmailNotificationAsync(TicketEmailNotification request);
        //Task<IEnumerable<TicketSelectOptions>> GetAllLocationListAsync();
        //Task<IEnumerable<TicketSelectOptions>> GetAllDepartmentListAsync();
        //Task<IEnumerable<TicketSelectOptions>> GetFilteredOrganizationListAsync();
        //Task<IEnumerable<TicketSelectOptions>> GetFilteredLocationListAsync(int orgCode);
        //Task<IEnumerable<TicketSelectOptions>> GetFilteredDepartmentListAsync(int orgCode, int locCode);
        //Task<byte[]?> GetProfilePicAsync(int EMP_CODE);

    }
}
