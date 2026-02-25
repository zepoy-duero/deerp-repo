using DEEMPPORTAL.Domain.Report;

namespace DEEMPPORTAL.Application.Report;

public interface IEmployeeReportService
{
    Task<(IEnumerable<EmployeeReportResponse> Data, int TotalCount)> GetAllEmployeeProfileAsync(
      string searchParam,
      string filterValue,
      string filterStatus,
      int pageNo);
    Task<EmployeeReportSummaryResponse> GetTotalEmployeeProfileCountAsync();
    Task<IEnumerable<EmployeeReportResponse>> GetAllEmployeeProfileReportAsync(string filterValue, string filterStatus);
}

