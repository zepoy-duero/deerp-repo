using DEEMPPORTAL.Domain.HR;
using Microsoft.AspNetCore.Http;

namespace DEEMPPORTAL.Application.HR;

public interface ILeaveApplicationService
{
    Task<LeaveResumptionDetailsResponse> GetLeaveResumptionDateAsync(int? userCode);
    Task<LeaveSummaryResponse> GetTotalLeaveCountByDepartmentAsync();
    Task<LeaveSummaryResponse> GetTotalLeaveCountByEmployeeAsync();
    Task<IEnumerable<LeaveDepartmentSummaryResponse>> GetTotalUserPerDepartmentCountAsync();
    Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationRequestsAsync();

    Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationRequestsByDepartmentAsync(
      string searchParam,
      string filterType,
      string filterValue,
      int pageNo);

    Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationRequestsByEmployeeAsync(
      string searchParam,
      string filterType,
      string filterValue,
      int pageNo);

    Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationForResumption();
    Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationForManagerApproval();

    Task<LeaveApplicationResponse> GetLeaveApplicationRequestAsync(int leaveApplicationCode);
    Task<int> UpdSertLeaveApplicationAsync(LeaveApplicationRequest model, IFormFile file);
    Task<int> UpdateLeaveApplicationStatusAsync(LeaveStatusRequest model);
    Task SendEmailAsync(LeaveApplicationResponse request);
    Task<int> DeleteLeaveApplicationTemporarilyAsync(int leaveApplicationCode);
}
