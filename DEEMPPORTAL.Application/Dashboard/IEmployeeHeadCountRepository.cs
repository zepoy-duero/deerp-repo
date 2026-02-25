using DEEMPPORTAL.Domain.Dashboard;

namespace DEEMPPORTAL.Application.Dashboard;

public interface IEmployeeHeadCountRepository
{
    Task<IEnumerable<EmployeeHeadCountByOrganizationResponse>> GetTotalEmployeesByLocationAsync();
    Task<IEnumerable<EmployeeHeadCountByJobStatusResponse>> GetTotalCountByJobStatusAsync();
}
