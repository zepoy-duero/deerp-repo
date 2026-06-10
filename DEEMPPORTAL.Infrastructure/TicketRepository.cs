using Dapper;
using DEEMPPORTAL.Application.Ticket;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Manage.User;
using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.Domain.Ticket;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json.Nodes;

namespace DEEMPPORTAL.Infrastructure;

public class TicketRepository(ConnectionPool cp, CurrentUser cu, EmailService emailService) : ITicketRepository
{

    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;
    private readonly EmailService _emailService = emailService;
    public async Task<IEnumerable<TicketResponse>> CreateTicketAsync(CreateTicketParams request)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_TICKET_create";
        var parameters = new
        {
            request.DeptCode,
            request.RequestedByCode,
            request.RequestedByName,
            request.RequestedDate,
            request.TaskTypeCode,
            request.TicketDescription,
            request.TicketSubject
        };
        var rowsAffected = await conn.QueryAsync<TicketResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected;
    }
    public async Task<IEnumerable<TicketResponse>> GetAllTicketAsync(
   
     int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_TICKET_MAST_sel";
        var parameters = new
        {
             DeptCode
        };


        var data = await conn.QueryAsync<TicketResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        //var data = await multi.ReadAsync<TicketSelectOptions>();
        //var totalCount = await multi.ReadFirstAsync<int>();

        await conn.CloseAsync();

        return data;
    }

    public async Task<IEnumerable<TicketSelectOptions>> GetUserOptionsAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_USER_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetAssigneeOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_ASSIGNEE_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetPriorityOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_PRIORITY_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetTicketDepartmentOptionsAsync(int OrgCode, int LocCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_DEPARTMENT_opts";
        var parameters = new
        {
            OrgCode,
            LocCode
        };
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
              parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetModuleOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_MODULE_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetDurationUnitOptionsAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
      
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_DURATION_UNIT_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetStatusOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_STATUS_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetTypeOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_TASKTYPE_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<bool> SendEmailNotificationAsync(TicketEmailNotification request)
    {
        //var parameters = new
        //{

        //    request.RequestedByName,

        //    request.RequestedDate,
        //    request.TicketSubject,
        //    request.TicketDeptName,
        //    request.TicketDescription,
        //    request.TaskTypeName,
        //    request.TicketId,
        //    request.ManagerEmailId,
        //    request.RequestedByEmail,
        //    request.TicketNo,
        //};
        string subject, body, sender, recipient, cc, bcc;
   
        sender = "info@dahbashi.com";
        recipient = request.RequestedByEmail;
        cc = string.Empty;
        bcc = "";
        subject = "New Ticket " + request.StringTicketId ;
        body = $@"<html>
                 <body style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 20px;"">
                    <div style=""max-width: 600px; margin: 0 auto; border: 1px solid #dddddd; padding: 20px; border-radius: 5px;"">
                        <p>Dear <Strong>{request.RequestedByName}</strong> ,</p>
                        <p>Your ticket has been successfully submitted to the <strong>Management Information System</strong>  department.</p>
        
                        <h3 style=""color: #555555; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;"">Submission Details</h3>
                        <ul style=""list-style-type: none; padding-left: 0;"">
                                <li style=""margin-bottom: 8px;""><strong>Ticket ID: </strong> {request.StringTicketId}</li>
                            <li style=""margin-bottom: 8px;""><strong>Date Submitted: </strong> {request.RequestedDate}</li>
                        
                            <li style=""margin-bottom: 8px;""><strong>Request Type: </strong> {request.TaskTypeName}</li>
                            <li style=""margin-bottom: 8px;""><strong>Subject: </strong> {request.TicketSubject}</li>
                            <li style=""margin-bottom: 8px;""><strong>Description: </strong> {request.TicketDescription}</li>
                        </ul>
        
                        <p>You will receive an update as soon as your request is approved by the department manager.</p>
        
                        <hr style=""border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;"">
                        <p style=""font-size: 0.9em; margin-bottom: 0;"">Best regards,<br><strong>MIS Team</strong><br>Dahbashi Engineering</p>
                        <p> <small>This is an automated email generated by MIS Ticketing System</small></p>
                    </div>
                </body>
              </html>";
        // send a notifcation to the ticket submitter
        try
        {
            var res = await _emailService.SendAsync(sender, request.RequestedByEmail, subject, body, cc, bcc);
            return res;
        }
        catch { 
            return false;
        }
       

    }

}