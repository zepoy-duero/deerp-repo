using DEEMPPORTAL.Domain.HR;
using System.Data;

namespace DEEMPPORTAL.Application.HR;

public interface ILeaveApplicationRepository
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

    Task<LeaveApplicationResponse> GetLeaveApplicationRequestAsync(int leaveApplicationCode);
    Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationForResumption();
    Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationForManagerApproval();

    Task<int> UpdSertLeaveApplicationAsync(
      DataTable dt,
      byte[] fileBytes,
      string fileName,
      string fileExtension);

    Task<int> UpdateLeaveApplicationStatusAsync(
      int leaveApplicationCode,
      string applicationStatus,
      string reasons);

    Task<int> DeleteLeaveApplicationTemporarilyAsync(int leaveApplicationCode);
}
