using DEEMPPORTAL.Domain.Dashboard;

namespace DEEMPPORTAL.Application.Dashboard;

public class EmployeeHeadCountService(IEmployeeHeadCountRepository employeeHeadCountRepository) : IEmployeeHeadCountService
{
    private readonly IEmployeeHeadCountRepository _employeeHeadCountRepository = employeeHeadCountRepository;

    public Task<IEnumerable<EmployeeHeadCountByJobStatusResponse>> GetTotalCountByJobStatusAsync()
    {
        return _employeeHeadCountRepository.GetTotalCountByJobStatusAsync();
    }

    public Task<IEnumerable<EmployeeHeadCountByOrganizationResponse>> GetTotalEmployeesByLocationAsync()
    {
        return _employeeHeadCountRepository.GetTotalEmployeesByLocationAsync();
    }
}
