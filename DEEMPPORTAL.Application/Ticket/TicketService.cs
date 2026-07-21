using DEEMPPORTAL.Application.Manage.Menu;
using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.HR;
using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.Domain.Ticket;
using DocumentFormat.OpenXml.Office2016.Excel;
using System.Globalization;


namespace DEEMPPORTAL.Application.Ticket;

public class TicketService(ITicketRepository ticketRepository, EmailService emailService) : ITicketService
{
    private readonly ITicketRepository _ticketRepository = ticketRepository;
    private readonly EmailService _emailService = emailService;
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
        // todos instead of fetchhing the email by function include it in the response
        //string userEmail = await _fetchOnlyOneRepository.GetUserEmailByUserCode(request.USER_CODE);
        //string departmentManagerEmail = await _fetchOnlyOneRepository.GetManagerEmailByUserCode(request.USER_CODE);
        //string hrEmail = await _fetchOnlyOneRepository.GetHrEmailByUserCode(request.USER_CODE);
        //bool isManager = await _fetchOnlyOneRepository.IsUserManager(request.USER_CODE);


    }
    public async Task<TicketResponse> UpdateTicketAsync(UpdateTicketParams ticket)
    {
     
        var updatedTicket = await _ticketRepository.UpdateTicketAsync(ticket);
        return updatedTicket;
    }
}
