using DEEMPPORTAL.Domain.Report;

namespace DEEMPPORTAL.Application.Report;

public class EmployeeReportService(IEmployeeReportRepository employeeReportRepository) : IEmployeeReportService
{
    private readonly IEmployeeReportRepository _employeeReportRepository = employeeReportRepository;
    public async Task<(IEnumerable<EmployeeReportResponse> Data, int TotalCount)> GetAllEmployeeProfileAsync(
      string searchParam,
      string filterValue,
      string filterStatus,
      int pageNo)
    {
        return await _employeeReportRepository.GetAllEmployeeProfileAsync(searchParam, filterValue, filterStatus, pageNo);
    }

    public async Task<IEnumerable<EmployeeReportResponse>> GetAllEmployeeProfileReportAsync(string filterValue, string filterStatus)
    {
        return await _employeeReportRepository.GetAllEmployeeProfileReportAsync(filterValue, filterStatus);
    }

    public async Task<EmployeeReportSummaryResponse> GetTotalEmployeeProfileCountAsync()
    {
        return await _employeeReportRepository.GetTotalEmployeeProfileCountAsync();
    }
}
