using Dapper;
using DEEMPPORTAL.Application.Ticket;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Manage.User;
using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.Domain.Ticket;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json.Nodes;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace DEEMPPORTAL.Infrastructure;

public class TicketRepository(ConnectionPool cp, CurrentUser cu, EmailService emailService, ILogger<TicketRepository> logger) : ITicketRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;
    private readonly EmailService _emailService = emailService;
    private readonly ILogger<TicketRepository> _logger = logger;

    public async Task<TicketResponse> CreateTicketAsync(CreateTicketParams request)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_TICKET_add";
        var parameters = new
        {
            request.OrgCode,
            request.LocCode,
            request.DeptCode,
            request.RequestedByCode,
            request.RequestedByName,
            request.RequestedDate,
            request.TaskTypeCode,
            request.TicketSubject,
            request.TicketDescription
        };

        try
        {
            _logger.LogInformation("CreateTicketAsync calling {StoredProcedure} with parameters: {Params}", storedProcedure, JsonSerializer.Serialize(parameters));
        }
        catch { /* ignore serialization errors */ }

        var updatedTicket = await conn.QuerySingleAsync<TicketResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return updatedTicket;
    }

    public async Task<IEnumerable<TicketResponse>> GetAllTicketAsync(int OrgCode,int LocCode,int DeptCode )
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_TICKET_getAll";

        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };

        try
        {
            _logger.LogInformation("GetAllTicketAsync calling {StoredProcedure} with parameters: {Params}", storedProcedure, JsonSerializer.Serialize(parameters));
        }
        catch { }

        var data = await conn.QueryAsync<TicketResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

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
    public async Task<TicketResponse> UpdateTicketAsync(UpdateTicketParams ticket)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_TICKET_update";
        var parameters = new
        {
            ticket.TicketId,
            ticket.OrgCode,
            ticket.LocCode,
            ticket.DeptCode,
            ticket.TicketNo,
            ticket.RequestedByCode,
            ticket.RequestedByName,
            ticket.RequestedDate,
            ticket.TicketSubject,
            ticket.StartDate,
            ticket.TicketDescription,
            ticket.TicketDuration,
            ticket.TicketDurationUnit,
            ticket.FinishDate,
            ticket.AssignedToCode,
            ticket.AssignedToName,
            ticket.ModuleName,
            ticket.PriorityCode,
            ticket.StatusCode,
            ticket.TaskTypeCode,
            ticket.ApproveByManager,
            ticket.IsManagementApproval,
            ticket.UpdatedBy,
            ticket.UpdatedDate,
            ticket.ReviewedBy,
            ticket.ReviewedDate,
            ticket.Remarks,
            ticket.VersionNo,
            ticket.ManagerEmailId,
            ticket.RequestedByEmail,
        };

        try
        {
            _logger.LogInformation("UpdateTicketAsync calling {StoredProcedure} with parameters: {Params}", storedProcedure, JsonSerializer.Serialize(parameters));
        }
        catch { /* ignore serialization errors */ }

        try
        {
            var updatedTicket = await conn.QuerySingleAsync<TicketResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return updatedTicket;
        }
        catch (SqlException ex)
        {
            // log detailed context to help diagnose parameter conversion errors
            _logger.LogError(ex, "SQL error executing {StoredProcedure}. Parameters: {Params}", storedProcedure, SafeSerialize(parameters));
            throw;
        }
    }

    private object?[] SafeSerialize(object parameters)
    {
        throw new NotImplementedException();
    }

    // Replace the existing SendEmailNotificationAsync method with this safer implementation
    public async Task<bool> SendEmailNotificationAsync(TicketEmailNotification request)
    {
        if (request == null)
        {
            _logger.LogWarning("SendEmailNotificationAsync called with null request");
            return false;
        }

        // Prepare email bodies (keep as before)
        var userEmailBody = $@"<html>
                 <body style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 20px;"">
                    <div style=""max-width: 600px; margin: 0 auto; border: 1px solid #dddddd; padding: 20px; border-radius: 5px;"">
                        <p>Dear <strong>{request.RequestedByName}</strong>,</p>
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
                        
                        <p> <small>This is an automated email generated by Dahbashi Engineering Ticketing System</small></p>
                    </div>
                </body>
              </html>";

        var managerEmailBody = $@"<html>
                 <body style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 20px;"">
                    <div style=""max-width: 600px; margin: 0 auto; border: 1px solid #dddddd; padding: 20px; border-radius: 5px;"">
                        <p>Dear Manager,</p>
                        <p>A new ticket has been submitted and is currently pending for your approval.</p>
        
                        <h3 style=""color: #555555; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;"">Submission Details</h3>
                        <ul style=""list-style-type: none; padding-left: 0;"">
                            <li style=""margin-bottom: 8px;""><strong>Ticket ID: </strong> {request.StringTicketId}</li>
                            <li style=""margin-bottom: 8px;""><strong>Submitted By: </strong> {request.RequestedByName}</li>
                            <li style=""margin-bottom: 8px;""><strong>Date Submitted: </strong> {request.RequestedDate}</li>
                        
                            <li style=""margin-bottom: 8px;""><strong>Request Type: </strong> {request.TaskTypeName}</li>
                            <li style=""margin-bottom: 8px;""><strong>Subject: </strong> {request.TicketSubject}</li>
                            <li style=""margin-bottom: 8px;""><strong>Description: </strong> {request.TicketDescription}</li>
                        </ul>
        
                        <p>Please log in to the <a href=""employee.dahbashi.com/MyTickets"" style=""color: #0066cc; text-decoration: underline;"">Employee Portal</a> to review the request and approve or reject it.</p>
        
                        <hr style=""border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;"">
                        
                        <p style=""margin-top: 20px;""> <small>This is an automated email generated by Dahbashi Engineering Ticketing System</small></p>
                    </div>
                </body>
              </html>";

        // Constants / defaults
        const string sender = "info@dahbashi.com";
        const string cc = "jeffvil@dahbashi.com";
        const string bcc = "";
        var subject = "Ticket # "+ (request.StringTicketId ?? string.Empty) + " (" + (request.TicketSubject ?? string.Empty) + ")";

        bool sendToUser = false;
        bool sendToManager = false;

        // Send to user only if email is present
        if (!string.IsNullOrWhiteSpace(request.RequestedByEmail))
        {
            try
            {
                sendToUser = await _emailService.SendAsync(sender, request.RequestedByEmail!, subject, userEmailBody, cc, bcc);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending user email to {Recipient} for ticket {Ticket}", request.RequestedByEmail, request.StringTicketId);
                sendToUser = false;
            }
        }
        else
        {
            _logger.LogWarning("Skipped sending user email because RequestedByEmail is null/empty for ticket {Ticket}", request.StringTicketId);
        }

        // Send to manager only if email is present
        if (!string.IsNullOrWhiteSpace(request.ManagerEmailId))
        {
            try
            {
                sendToManager = await _emailService.SendAsync(sender, request.ManagerEmailId!, subject, managerEmailBody, cc, bcc);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending manager email to {Recipient} for ticket {Ticket}", request.ManagerEmailId, request.StringTicketId);
                sendToManager = false;
            }
        }
        else
        {
            _logger.LogWarning("Skipped sending manager email because ManagerEmailId is null/empty for ticket {Ticket}", request.StringTicketId);
        }

        // Keep previous behavior: consider full success only when both were sent.
        // If you prefer a different policy (e.g. return true if at least one sent), change accordingly.
        return sendToUser && sendToManager;
    }

    public async Task<bool> UploadTicketAttachmentsAsync(int ticketId, DataTable dt)
    {

        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_TICKET_ATTACHMENT_add";
        var parameters = new
        {
            TicketId = ticketId,
            TicketAttachments = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_TICKET_ATTACHMENTS")
        };

        try
        {
            _logger.LogInformation("UploadTicketAttachmentsAsync calling {StoredProcedure} with TicketId: {TicketId}, Files: {Count}", storedProcedure, ticketId, dt.Rows.Count);
        }
        catch { /* ignore logging errors */ }

        var rowsAffected = await conn.QueryAsync<TicketAttachmentsResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure
        );

        await conn.CloseAsync();

        return rowsAffected != null && rowsAffected.Any();
    }
  
}