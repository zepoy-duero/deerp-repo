using DEEMPPORTAL.Domain.Dashboard;

namespace DEEMPPORTAL.Application.Dashboard;

public interface IEmployeeHeadCountService
{
    Task<IEnumerable<EmployeeHeadCountByOrganizationResponse>> GetTotalEmployeesByLocationAsync();
    Task<IEnumerable<EmployeeHeadCountByJobStatusResponse>> GetTotalCountByJobStatusAsync();
}
