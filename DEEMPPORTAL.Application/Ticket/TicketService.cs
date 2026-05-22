using DEEMPPORTAL.Application.MyProfile;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.MyProfile;
using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.Domain.Ticket;


namespace DEEMPPORTAL.Application.Ticket;

public class TicketService(ITicketRepository ticketRepository) : ITicketService
{
    private readonly ITicketRepository _ticketRepository = ticketRepository;
    public async Task<IEnumerable<TicketResponse>> CreateTicketAsync(CreateTicketParams request)
    {
        
        return await _ticketRepository.CreateTicketAsync(request);
    }
    public async Task<IEnumerable<TicketResponse>> GetAllTicketAsync(int DeptCode)
    {
        return await _ticketRepository.GetAllTicketAsync(DeptCode);
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
    public async Task<IEnumerable<SelectOptionResponse>> GetTicketDepartmentListAsync(int OrgCode, int LocCode)
    {
        return await _ticketRepository.GetTicketDepartmentListAsync(OrgCode, LocCode);
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
}
