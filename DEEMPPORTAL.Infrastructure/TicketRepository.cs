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
    private const string StoredProcedure =
           "dbo.CLOUD_v1_ERP_TICKET_CORRESPONDENCE_request";

    public async Task<TicketResponse> CreateTicketAsync(CreateTicketParams request)
    {
        //var dt = new DataTable();
        //dt.Columns.Add("FileName", typeof(string));
        //dt.Columns.Add("FileExtension", typeof(string));
        //dt.Columns.Add("FileSize", typeof(int));
        //dt.Columns.Add("FileAttachment", typeof(byte[]));
        //dt.Columns.Add("UploadedDate", typeof(DateTime));
        //dt.Columns.Add("UpdatedBy", typeof(int));

        //if (request.TicketAttachments != null)
        //{
        //    foreach (var ticketAttachment in request.TicketAttachments)
        //    {
        //        using var ms = new MemoryStream();
        //        await ticketAttachment.CopyToAsync(ms);

        //        // Add a row. If you have a user id in CurrentUser, replace DBNull.Value with the real value.
        //        dt.Rows.Add(
        //            ticketAttachment.FileName,
        //            Path.GetExtension(ticketAttachment.FileName)?.TrimStart('.') ?? string.Empty,
        //            (int)ticketAttachment.Length / 1024,
        //            ms.ToArray(),
        //            DateTime.UtcNow,
        //            _cu.UserId
        //        );
        //    }
        //}

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
            request.TicketDescription,
            //TicketAttachments = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_TICKET_ATTACHMENTS")

        };

        try
        {
            _logger.LogInformation("CreateTicketAsync calling {StoredProcedure} with parameters: {Params}", storedProcedure, JsonSerializer.Serialize(parameters));
        }
        catch { /* ignore serialization errors */ }

        var newTicket = await conn.QuerySingleAsync<TicketResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();
      

        return newTicket;
    }
    public async Task<bool> UploadCorrespondenceAttachmentsAsync(DataTable dt)
    {

        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_TICKET_CORRESPONDENCE_ATTACHMENT_add";
        var parameters = new
        {
            CorrespondenceAttachments = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_TICKET_CORRESPONDENCE_ATTACHMENT")
        };

        try
        {
            _logger.LogInformation("UploadCorrespondenceAttachmentsAsync calling {StoredProcedure} with Files: {Count}", storedProcedure, dt.Rows.Count);
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
    public async Task<bool> UploadTicketAttachmentsAsync(DataTable dt)
    {

        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_TICKET_ATTACHMENT_add";
        var parameters = new
        {
            TicketAttachments = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_TICKET_ATTACHMENT")
        };

        try
        {
            _logger.LogInformation("UploadTicketAttachmentsAsync calling {StoredProcedure} with Files: {Count}", storedProcedure, dt.Rows.Count);
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
    public async Task<IEnumerable<TicketResponse>> GetAllTicketAsync(int OrgCode, int LocCode, int DeptCode)
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
        DateTime requestedDate = DateTime.Now;
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
                            <li style=""margin-bottom: 8px;""><strong>Date Submitted: </strong> {requestedDate:dd-MM-yyyy HH:mm:ss tt}</li>
                        
                            <li style=""margin-bottom: 8px;""><strong>Request Type: </strong> {request.TaskTypeName}</li>
                            <li style=""margin-bottom: 8px;""><strong>Subject: </strong> {request.TicketSubject}</li>
                            <li style=""margin-bottom: 8px;""><strong>Description: </strong> <br/> {request.TicketDescription} </li>
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
                            <li style=""margin-bottom: 8px;""><strong>Date Submitted: </strong> {requestedDate:dd-MM-yyyy HH:mm:ss tt}</li>
                        
                            <li style=""margin-bottom: 8px;""><strong>Request Type: </strong> {request.TaskTypeName}</li>
                            <li style=""margin-bottom: 8px;""><strong>Subject: </strong> {request.TicketSubject}</li>
                            <li style=""margin-bottom: 8px;""><strong>Description: </strong><br/> {request.TicketDescription}</li>
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
        var subject = "Ticket # " + (request.StringTicketId ?? string.Empty) + " (" + (request.TicketSubject ?? string.Empty) + ")";

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

  
    public async Task<IEnumerable<TicketAttachmentsResponse>> GetTicketAttachmentsAsync(int TicketId)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_ATTACHMENTS_sel";

        var parameters = new
        {
            TicketId
        };

        try
        {
            _logger.LogInformation("GetTicketAttachmentsAsync calling {StoredProcedure} with parameters: {Params}", storedProcedure, JsonSerializer.Serialize(parameters));
        }
        catch { }

        var data = await conn.QueryAsync<TicketAttachmentsResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return data;
    }
    public async Task<IEnumerable<CorrespondenceAttachmentsResponse>> GetCorrespondenceAttachmentsAsync(int TicketId)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_CORRESPONDENCE_ATTACHMENTS_sel";
        var parameters = new
        {
            TicketId = TicketId
        };

        try
        {
            _logger.LogInformation("GetCorrespondenceAttachmentsAsync calling {StoredProcedure} with parameters: {Params}", storedProcedure, JsonSerializer.Serialize(parameters));
        }
        catch { }

        var data = await conn.QueryAsync<CorrespondenceAttachmentsResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return data;
    }
    public async Task<CorrespondenceAttachmentsResponse> GetCorrespondenceAttachmentAsync(int AttachmentId)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_CORRESPONDENCE_ATTACHMENT_sel";
        var parameters = new
        {
            AttachmentId
        };

        try
        {
            _logger.LogInformation("GetCorrespondenceAttachmentAsync calling {StoredProcedure} with parameters: {Params}", storedProcedure, JsonSerializer.Serialize(parameters));
        }
        catch { }

        var data = await conn.QueryFirstOrDefaultAsync<CorrespondenceAttachmentsResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return data;
    }
    public async Task<AttachmentResponse> GetAttachmentAsync(int AttachmentId)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_ATTACHMENT_sel";

        var parameters = new
        {
            AttachmentId
        };

        try
        {
            _logger.LogInformation("GetAttachmentAsync calling {StoredProcedure} with parameters: {Params}", storedProcedure, JsonSerializer.Serialize(parameters));
        }
        catch { }

        var data = await conn.QueryFirstOrDefaultAsync<AttachmentResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return data;
    }
    public async Task<bool> DeleteTicketAttachmentAsync(int attachmentId)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_TICKET_ATTACHMENT_delete";

        var parameters = new
        {
            AttachmentId = attachmentId 
        };

        try
        {
            _logger.LogInformation("DeleteTicketAttachmentAsync calling {StoredProcedure} with AttachmentId: {AttachmentId}",
                storedProcedure, attachmentId);

            var result = await conn.ExecuteAsync(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return result > 0;
        }
        catch (SqlException ex)
        {
            _logger.LogError(ex, "SQL error executing {StoredProcedure}", storedProcedure);
            throw;
        }
    }
    public async Task<bool> DeleteCorrespondenceAttachmentAsync(int attachmentId)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_CORRESPONDENCE_ATTACHMENT_delete";

        var parameters = new
        {
            AttachmentId = attachmentId 
        };

        try
        {
            _logger.LogInformation("DeleteCorrespondenceAttachmentAsync calling {StoredProcedure} with AttachmentId: {AttachmentId}",
                storedProcedure, attachmentId);

            var result = await conn.ExecuteAsync(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return result > 0;
        }
        catch (SqlException ex)
        {
            _logger.LogError(ex, "SQL error executing {StoredProcedure}", storedProcedure);
            throw;
        }
    }

    /* =========================================================
          GET BY ID
       ========================================================= */

    public async Task<TicketCorrespondence?> GetByIdAsync(int correspondenceId)
    {
        await using var connection =
            new SqlConnection(_cp.ConnectionName);

        await using var command =
            new SqlCommand(StoredProcedure, connection);

        command.CommandType = CommandType.StoredProcedure;

        command.Parameters.Add(
            "@Action",
            SqlDbType.NVarChar, 20
        ).Value = "SELECT";

        command.Parameters.Add(
            "@CorrespondenceId",
            SqlDbType.Int
        ).Value = correspondenceId;

        await connection.OpenAsync();

        await using var reader =
            await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
            return null;

        return MapCorrespondence(reader);
    }


    /* =========================================================
       GET BY TICKET ID
    ========================================================= */

    public async Task<List<TicketCorrespondence>> GetByTicketIdAsync(int ticketId)
    {
        var result =
            new List<TicketCorrespondence>();

        await using var connection =
            new SqlConnection(_cp.ConnectionName);

        await using var command =
            new SqlCommand(StoredProcedure, connection);

        command.CommandType = CommandType.StoredProcedure;

        command.Parameters.Add(
            "@Action",
            SqlDbType.NVarChar, 20
        ).Value = "SELECT";

        command.Parameters.Add(
            "@TicketId",
            SqlDbType.Int
        ).Value = ticketId;

        await connection.OpenAsync();

        await using var reader =
            await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            result.Add(
                MapCorrespondence(reader)
            );
        }

        return result;
    }


    /* =========================================================
       INSERT
    ========================================================= */

    public async Task<TicketCorrespondence?> InsertAsync(TicketCorrespondenceRequest model)
    {
        await using var connection =
            new SqlConnection(_cp.ConnectionName);

        await using var command =
            new SqlCommand(StoredProcedure, connection);

        command.CommandType =
            CommandType.StoredProcedure;

        command.Parameters.Add(
            "@Action",
            SqlDbType.NVarChar, 20
        ).Value = "INSERT";

        command.Parameters.Add(
            "@TicketId",
            SqlDbType.Int
        ).Value = model.TicketId;

        command.Parameters.Add(
            "@Message",
            SqlDbType.NVarChar
        ).Value =
            (object?)model.Message ?? DBNull.Value;

        command.Parameters.Add(
            "@CreatedByCode",
            SqlDbType.Int
        ).Value = model.CreatedByCode;

        await connection.OpenAsync();

        await using var reader =
            await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
            return null;

        return MapCorrespondence(reader);
    }


    /* =========================================================
       UPDATE
    ========================================================= */

    public async Task<TicketCorrespondence?> UpdateAsync(UpdateTicketCorrespondenceRequest model)
    {
        await using var connection =
            new SqlConnection(_cp.ConnectionName);

        await using var command =
            new SqlCommand(StoredProcedure, connection);

        command.CommandType =
            CommandType.StoredProcedure;

        command.Parameters.Add(
            "@Action",
            SqlDbType.NVarChar, 20
        ).Value = "UPDATE";

        command.Parameters.Add(
            "@CorrespondenceId",
            SqlDbType.Int
        ).Value = model.CorrespondenceId;

        command.Parameters.Add(
            "@Message",
            SqlDbType.NVarChar
        ).Value =
            (object?)model.Message ?? DBNull.Value;

        command.Parameters.Add(
            "@UpdatedBy",
            SqlDbType.Int
        ).Value = model.UpdatedBy;

        await connection.OpenAsync();

        await using var reader =
            await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
            return null;

        return MapCorrespondence(reader);
    }


    /* =========================================================
       DELETE
    ========================================================= */

    public async Task<bool> DeleteAsync(DeleteTicketCorrespondenceRequest model)
    {
        await using var connection =
            new SqlConnection(_cp.ConnectionName);

        await using var command =
            new SqlCommand(StoredProcedure, connection);

        command.CommandType =
            CommandType.StoredProcedure;

        command.Parameters.Add(
            "@Action",
            SqlDbType.NVarChar, 20
        ).Value = "DELETE";

        command.Parameters.Add(
            "@CorrespondenceId",
            SqlDbType.Int
        ).Value = model.CorrespondenceId;

        command.Parameters.Add(
            "@UpdatedBy",
            SqlDbType.Int
        ).Value = model.UpdatedBy;

        await connection.OpenAsync();

        await using var reader =
            await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
            return false;

        return reader.GetBoolean(
            reader.GetOrdinal("IsDeleted")
        );
    }


    /* =========================================================
       MAPPER
    ========================================================= */

    private static TicketCorrespondence MapCorrespondence(SqlDataReader reader)
    {
        return new TicketCorrespondence
        {
            CorrespondenceId =
                reader.GetInt32(
                    reader.GetOrdinal(
                        "CorrespondenceId"
                    )
                ),

            TicketId =
                reader.GetInt32(
                    reader.GetOrdinal(
                        "TicketId"
                    )
                ),

            Message =
                reader.IsDBNull(
                    reader.GetOrdinal(
                        "Message"
                    )
                )
                ? null
                : reader.GetString(
                    reader.GetOrdinal(
                        "Message"
                    )
                ),

            CreatedDate =
                reader.GetDateTime(
                    reader.GetOrdinal(
                        "CreatedDate"
                    )
                ),

            CreatedByCode =
                reader.GetInt32(
                    reader.GetOrdinal(
                        "CreatedByCode"
                    )
                ),

            UpdatedBy =
                reader.GetInt32(
                    reader.GetOrdinal(
                        "UpdatedBy"
                    )
                ),

            IsDeleted =
                reader.GetBoolean(
                    reader.GetOrdinal(
                        "IsDeleted"
                    )
                )
        };
    }
}