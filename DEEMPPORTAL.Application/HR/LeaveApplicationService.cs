using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.HR;
using Microsoft.AspNetCore.Http;
using System.Globalization;

namespace DEEMPPORTAL.Application.HR;

public class LeaveApplicationService(ILeaveApplicationRepository leaveApplicationRepository
    , IFetchOnlyOneRepository fetchOnlyOneRepository
    , EmailService emailService) : ILeaveApplicationService
{
    private readonly ILeaveApplicationRepository _leaveApplicationRepository = leaveApplicationRepository;
    private readonly IFetchOnlyOneRepository _fetchOnlyOneRepository = fetchOnlyOneRepository;
    private readonly EmailService _emailService = emailService;

    public async Task<int> DeleteLeaveApplicationTemporarilyAsync(int leaveApplicationCode)
    {
        return await _leaveApplicationRepository.DeleteLeaveApplicationTemporarilyAsync(leaveApplicationCode);
    }

    public async Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationForManagerApproval()
    {
        return await _leaveApplicationRepository.GetLeaveApplicationForManagerApproval();
    }

    public async Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationForResumption()
    {
        return await _leaveApplicationRepository.GetLeaveApplicationForResumption();
    }

    public async Task<LeaveApplicationResponse> GetLeaveApplicationRequestAsync(int leaveApplicationCode)
    {
        return await _leaveApplicationRepository.GetLeaveApplicationRequestAsync(leaveApplicationCode);
    }

    public async Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationRequestsAsync()
    {
        return await _leaveApplicationRepository.GetLeaveApplicationRequestsAsync();
    }

    public async Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationRequestsByDepartmentAsync(string searchParam, string filterType, string filterValue, int pageNo)
    {
        return await _leaveApplicationRepository.GetLeaveApplicationRequestsByDepartmentAsync(
                searchParam,
                filterType,
                filterValue,
                pageNo);
    }

    public async Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationRequestsByEmployeeAsync(string searchParam, string filterType, string filterValue, int pageNo)
    {
        return await _leaveApplicationRepository.GetLeaveApplicationRequestsByEmployeeAsync(
                searchParam,
                filterType,
                filterValue,
                pageNo);
    }

    public async Task<LeaveResumptionDetailsResponse> GetLeaveResumptionDateAsync(int? userCode)
    {
        return await _leaveApplicationRepository.GetLeaveResumptionDateAsync(userCode);
    }

    public async Task<LeaveSummaryResponse> GetTotalLeaveCountByDepartmentAsync()
    {
        return await _leaveApplicationRepository.GetTotalLeaveCountByDepartmentAsync();
    }

    public async Task<LeaveSummaryResponse> GetTotalLeaveCountByEmployeeAsync()
    {
        return await _leaveApplicationRepository.GetTotalLeaveCountByEmployeeAsync();
    }

    public async Task<IEnumerable<LeaveDepartmentSummaryResponse>> GetTotalUserPerDepartmentCountAsync()
    {
        return await _leaveApplicationRepository.GetTotalUserPerDepartmentCountAsync();
    }

    public async Task<int> UpdateLeaveApplicationStatusAsync(LeaveStatusRequest model)
    {
        var rowsAffected = await _leaveApplicationRepository.UpdateLeaveApplicationStatusAsync(
            model.LEAVE_APPLICATION_CODE,
            model.APPLICATION_STATUS,
            model.REASONS);

        if (rowsAffected == 0) return 0;

        var request = await _leaveApplicationRepository.GetLeaveApplicationRequestAsync(model.LEAVE_APPLICATION_CODE);

        if (!string.Equals(model.APPLICATION_STATUS, "RESUMED") &&
          !string.Equals(model.APPLICATION_STATUS, "TRASHED") &&
          !string.Equals(model.APPLICATION_STATUS, "DELETED"))
            await SendEmailAsync(request);

        return rowsAffected;
    }

    public async Task<int> UpdSertLeaveApplicationAsync(LeaveApplicationRequest model, IFormFile file)
    {
        var dataList = ListToDataTableConverter.ToDataTable(model);
        var fileBytes = Array.Empty<byte>();
        var fileName = string.Empty;
        var fileExtension = string.Empty;

        // handle optional attachment
        if (file != null && file.Length > 0)
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            fileBytes = ms.ToArray();
            fileName = Path.GetFileNameWithoutExtension(file.FileName);
            fileExtension = Path.GetExtension(file.FileName);
        }

        var retLeaveApplicationCode = await _leaveApplicationRepository.UpdSertLeaveApplicationAsync(
            dataList,
            fileBytes,
            fileName,
            fileExtension);

        // send only an email for newly created a new application
        if (retLeaveApplicationCode > 0 && model.LEAVE_APPLICATION_CODE is null)
        {
            var request = await _leaveApplicationRepository.GetLeaveApplicationRequestAsync(retLeaveApplicationCode);
            await SendEmailAsync(request);
        }

        return retLeaveApplicationCode;
    }

    public async Task SendEmailAsync(LeaveApplicationResponse request)
    {
        string subject, body, sender, recipient, cc, bcc;
        // todos instead of fetchhing the email by function include it in the response
        string userEmail = await _fetchOnlyOneRepository.GetUserEmailByUserCode(request.USER_CODE);
        string departmentManagerEmail = await _fetchOnlyOneRepository.GetManagerEmailByUserCode(request.USER_CODE);
        string hrEmail = await _fetchOnlyOneRepository.GetHrEmailByUserCode(request.USER_CODE);
        bool isManager = await _fetchOnlyOneRepository.IsUserManager(request.USER_CODE);

        bool isPending = request.IS_APPROVED_BY_MANAGER == "" && request.IS_APPROVED_BY_HR == "";
        bool isManagerApproved = request.IS_APPROVED_BY_MANAGER == "Y" && request.IS_APPROVED_BY_HR == "";
        bool isHrApproved = request.IS_APPROVED_BY_MANAGER == "Y" && request.IS_APPROVED_BY_HR == "Y";

        if (isPending)
        {
            sender = "info@dahbashi.com";
            recipient = userEmail;
            cc = string.Empty;
            bcc = "landrex@dahbashi.com";
            subject = $"LEAVE APPLICATION ({request.LEAVE_TYPE}) - {request.EMPLOYEE_NAME} [PENDING]";
            body = $@"<html>
                  <body style='font-family: Calibri; font-size:17px'>
                      <p>Dear {request.EMPLOYEE_NAME.Split(" ")[0]},</p>
  			            <p>You have successfully submitted your leave application.</p>
                      <p>This is an automated email. Please don't reply.</p>

                      <p>From Dahbashi Engineering</p>
                      <p>Online Employee Portal</p>
                  </body>
              </html>";

            // send a notifcation to the applicant
            await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);

            sender = userEmail;
            recipient = departmentManagerEmail;
            cc = string.Empty;
            bcc = string.Empty;
            subject = $"LEAVE APPLICATION ({request.LEAVE_TYPE}) - {request.EMPLOYEE_NAME} [PENDING]";
            body = $@"<html>
                  <body style='font-family: Calibri; font-size:17px'>
                      <p>Dear Manager,</p>
  			            <p>Your team has filed a leave application - please check portal.</p>
                      <p>This is an automated email. Please don't reply.</p>

                      <p>From Dahbashi Engineering</p>
                      <p>Online Employee Portal</p>
                  </body>
              </html>";

            // send a different message to the manager
            await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);

        }
        else if (isManagerApproved)
        {
            sender = departmentManagerEmail;
            recipient = userEmail;
            cc = string.Empty;
            bcc = "landrex@dahbashi.com";
            subject = $"LEAVE APPLICATION ({request.LEAVE_TYPE}) - {request.EMPLOYEE_NAME} - Manager Approved - Waiting for HR APPROVAL";
            body = $@"
                <html>
                    <body style='font-family: Calibri; font-size:17px'>
                        <p>Dear {request.EMPLOYEE_NAME.Split(" ")[0]},</p>
                        <p>The leave application has been APPROVED by your department manager and is now submitted for HR approval.</p>
                        <p>This is an automated email. Please don't reply.</p>

                        <p>From Dahbashi Engineering</p>
                        <p>Online Employee Portal</p>     
                </body>
                </html> 
            ";

            // send a different message to the manager
            await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);

            sender = departmentManagerEmail;
            recipient = hrEmail;
            cc = string.Empty;
            bcc = string.Empty;
            subject = $"LEAVE APPLICATION ({request.LEAVE_TYPE}) - {request.EMPLOYEE_NAME} - Manager Approved";
            body = $@"
                <html>
                    <body style='font-family: Calibri; font-size:17px'>
                        <p>Dear HR Manager,</p>
                        <p>A new leave application of {request.EMPLOYEE_NAME} has been approved by the manager.</p>
                        <p>This is an automated email. Please don't reply.</p>

                        <p>From Dahbashi Engineering</p>
                        <p>Online Employee Portal</p>      
                </body>
                </html> 
            ";

            // send a different message to the hr manager
            await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);

            sender = "info@dahbashi.com";
            recipient = departmentManagerEmail;
            cc = string.Empty;
            bcc = string.Empty;
            subject = $"LEAVE APPLICATION ({request.LEAVE_TYPE}) - {request.EMPLOYEE_NAME} [APPROVED BY MANAGER]";
            body = $@"<html>
                    <body style='font-family: Calibri; font-size:17px'>
                        <p>Dear Manager,</p>
  			              <p>You have successfully approved the leave aplication.</p>
                        <p>This is an automated email. Please don't reply.</p>

                        <p>From Dahbashi Engineering</p>
                        <p>Online Employee Portal</p>
                    </body>
                </html>";

            // send a different message to the manager
            await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);
        }
        else if (isHrApproved)
        {
            var startDate = DateTime.ParseExact(request.START_DATE_OF_LEAVE, "MM/dd/yyyy hh:mm:ss", CultureInfo.InvariantCulture);
            var endDate = DateTime.ParseExact(request.END_DATE_OF_LEAVE, "MM/dd/yyyy hh:mm:ss", CultureInfo.InvariantCulture);
            var formattedStartDate = startDate.ToString("dd/MM/yyyy");
            var formattedEndDate = endDate.ToString("dd/MM/yyyy");

            sender = hrEmail;
            recipient = userEmail;
            cc = departmentManagerEmail;
            bcc = string.Empty;
            subject = $"LEAVE APPLICATION ({request.LEAVE_TYPE}) - {request.EMPLOYEE_NAME} - Approved by Human Resource (HR)";

            body = $@"
                <html>
                    <body style='font-family: Calibri; font-size:17px'>
                        <p>Dear {request.EMPLOYEE_NAME.Split(" ")[0]},</p>
                        <p>Your leave application has been APPROVED by the HR.</p>
                        <p>Below is your leave application details:</p>
                        <ul>
                            <li><strong>Employee name: </strong>{request.EMPLOYEE_NAME}</li>
                            <li><strong>Leave type: </strong>{request.LEAVE_TYPE}</li>
                            <li><strong>Start date of leave: </strong>{formattedStartDate}</li>
                            <li><strong>End date of leave: </strong>{formattedEndDate}</li>
                            <li><strong>Number of days: </strong>{request.NO_OF_DAYS}</li>
                            {(request.LEAVE_TYPE == "ANNUAL" ? $"<li><strong>Accumulated days: </strong>{request.ACCUMULATED_DAYS}</li>" : "")}
                            <li><strong>Reason(s): </strong>{request.REASONS}</li>
                        </ul>
                        <p>This is an automated email. Please don't reply.</p>
                        <p>From Dahbashi Engineering</p>
                        <p>Online Employee Portal</p> 
                </body>
                </html> 
            ";

            // send a different message to the human resource manager
            await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);

            sender = "info@dahbashi.com";
            recipient = hrEmail;
            cc = string.Empty;
            bcc = isManager ? "landrex@dahbashi.com, saleem@dahbashi.com" : "landrex@dahbashi.com";
            subject = $"{request.EMPLOYEE_NAME.Split(" ")[0]}: ({request.LEAVE_TYPE}) LEAVE APPLICATION - Approved by Human Resource (HR) : {request.EMPLOYEE_NAME}";
            body = $@"
                <html>
                    <body style='font-family: Calibri; font-size:17px'>
                        <p><strong>Dear HR Team,</strong></p>
                        <p><strong>Please process the below leave application in HR module.</strong></p>
                        <ul>
                            <li><strong>Employee name: </strong>{request.EMPLOYEE_NAME}</li>
                            <li><strong>Leave type: </strong>{request.LEAVE_TYPE}</li>
                            <li><strong>Start date of leave: </strong>{formattedStartDate}</li>
                            <li><strong>End date of leave: </strong>{formattedEndDate}</li>
                            <li><strong>Number of days: </strong>{request.NO_OF_DAYS}</li>
                            {(request.LEAVE_TYPE == "ANNUAL" ? $"<li><strong>Accumulated days: </strong>{request.ACCUMULATED_DAYS}</li>" : "")}
                            <li><strong>Reason(s): </strong>{request.REASONS}</li>
                        </ul>
                        <p>This is an automated email. Please don't reply.</p>
                        <p>From Dahbashi Engineering</p>
                        <p>Online Employee Portal</p> 
                </body>
                </html> 
            ";

            // send a different message to the human resource manager
            await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);
        }
        else
        {
            var startDate = DateTime.ParseExact(request.START_DATE_OF_LEAVE, "MM/dd/yyyy hh:mm:ss", CultureInfo.InvariantCulture);
            var endDate = DateTime.ParseExact(request.END_DATE_OF_LEAVE, "MM/dd/yyyy hh:mm:ss", CultureInfo.InvariantCulture);
            var formattedStartDate = startDate.ToString("dd/MM/yyyy");
            var formattedEndDate = endDate.ToString("dd/MM/yyyy");

            if (request.IS_APPROVED_BY_HR == "N")
            {
                subject = $"LEAVE APPLICATION ({request.LEAVE_TYPE}) - {request.EMPLOYEE_NAME} - Disapproved by HR";
                sender = hrEmail;
                recipient = userEmail;
                cc = departmentManagerEmail;
                bcc = "landrex@dahbashi.com";
            }
            else
            {
                subject = $"LEAVE APPLICATION ({request.LEAVE_TYPE}) - {request.EMPLOYEE_NAME} - Disapproved by Manager";
                sender = departmentManagerEmail;
                recipient = userEmail;
                cc = string.Empty;
                bcc = "landrex@dahbashi.com";
            }

            body = $@"
              <html>
                  <body style='font-family: Calibri; font-size:17px'>
                      <p>Dear {request.EMPLOYEE_NAME.Split(" ")[0]},</p>
                      <p>Following a thorough review of your leave application for the period {formattedStartDate} to {formattedEndDate}, we regret to inform you that we are unable to approve your request at this time due to:</p>
                      <p>
                          <strong>Reason(s): </strong>
                          <span>{request.REASON_FOR_DISAPPROVAL}</span>
                      </p>
                      <p>Thank you for your understanding and cooperation</p>
                      <p>This is an automated email. Please don't reply.</p>

                      <p>From Dahbashi Engineering</p>
                      <p>Online Employee Portal</p>     
                </body>
              </html> 
          ";

            // send a different message to the manager
            await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);

            if (request.IS_APPROVED_BY_HR == "N")
            {
                subject = $"LEAVE APPLICATION ({request.LEAVE_TYPE}) - {request.EMPLOYEE_NAME} - Disapproved by HR";
                sender = "info@dahbashi.com";
                recipient = hrEmail;
                cc = string.Empty;
                bcc = string.Empty;
            }
            else
            {
                subject = $"LEAVE APPLICATION ({request.LEAVE_TYPE}) - {request.EMPLOYEE_NAME} - Disapproved by Manager";
                sender = "info@dahbashi.com";
                recipient = departmentManagerEmail;
                cc = string.Empty;
                bcc = string.Empty;
            }

            body = $@"<html>
                        <body style='font-family: Calibri; font-size:17px'>
                            <p>Dear Manager,</p>
  			        <p>You have successfully rejected the leave aplication.</p>
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
