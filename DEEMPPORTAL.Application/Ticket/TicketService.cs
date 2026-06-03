using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.HR;
using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.Domain.Ticket;
using System.Globalization;


namespace DEEMPPORTAL.Application.Ticket;

public class TicketService(ITicketRepository ticketRepository, EmailService emailService) : ITicketService
{
    private readonly ITicketRepository _ticketRepository = ticketRepository;
    private readonly EmailService _emailService = emailService;
    public async Task<IEnumerable<TicketResponse>> CreateTicketAsync(CreateTicketParams request)
    {
        
        var result = await _ticketRepository.CreateTicketAsync(request);
        await SendEmailAsync();
        return result;
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
    public async Task SendEmailAsync()
    {
        string subject, body, sender, recipient, cc, bcc;
        // todos instead of fetchhing the email by function include it in the response
        //string userEmail = await _fetchOnlyOneRepository.GetUserEmailByUserCode(request.USER_CODE);
        //string departmentManagerEmail = await _fetchOnlyOneRepository.GetManagerEmailByUserCode(request.USER_CODE);
        //string hrEmail = await _fetchOnlyOneRepository.GetHrEmailByUserCode(request.USER_CODE);
        //bool isManager = await _fetchOnlyOneRepository.IsUserManager(request.USER_CODE);

       

        
        {
            sender = "info@dahbashi.com";
            recipient = "jeffvil@dahbashi.com";
            cc = string.Empty;
            bcc = "";
            subject = "Ticket Submission Confirmation";
            body = $@"<html>
                  <body style='font-family: Calibri; font-size:17px'>
                      <p>Dear Jeffvil,</p>
  			            <p>You have successfully submitted your ticket.</p>
                      <p>This is an automated email. Please don't reply.</p>

                      <p>From Dahbashi Engineering</p>
                      <p>Online Employee Portal</p>
                  </body>
              </html>";

            // send a notifcation to the ticket submitter
            await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);

            sender = "info@dahbashi.com";
            recipient = "jeffvil@dahbashi.com";
            cc = string.Empty;
            bcc = "";
            subject = "New Ticket Submitted";
            body = $@"<html>
                  <body style='font-family: Calibri; font-size:17px'>
                      <p>Dear Manager,</p>
  			            <p>A user submitted a new ticket - please check portal.</p>
                      <p>This is an automated email. Please don't reply.</p>

                      <p>From Dahbashi Engineering</p>
                      <p>Online Employee Portal</p>
                  </body>
              </html>";

            // send a different message to the manager
            await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);

        }
        
    }
}
