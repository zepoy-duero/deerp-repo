using DEEMPPORTAL.Domain.Support;

namespace DEEMPPORTAL.Application.Support.EmployeeDirectoryService
{
  public class EmployeeDirectoryService(IEmployeeDirectoryRepository employeeDirectoryRepository) : IEmployeeDirectoryService
  {
    private readonly IEmployeeDirectoryRepository _employeeDirectoryRepository = employeeDirectoryRepository;
    public async Task<IEnumerable<EmployeeDirectoryResponse>> GetAllEmployeeDirectoryAsync(int org_code, int loc_code, int dept_code)
    {
      return await _employeeDirectoryRepository.GetAllEmployeeDirectoryAsync(org_code, loc_code, dept_code);
    }
    public async Task<IEnumerable<SelectOptionResponse>> GetAllOrganizationListAsync()
    {
      return await _employeeDirectoryRepository.GetAllOrganizationListAsync();
    }
    public async Task<IEnumerable<SelectOptionResponse>> GetAllLocationListAsync()
    {
      return await _employeeDirectoryRepository.GetAllLocationListAsync();
    }
    public async Task<IEnumerable<SelectOptionResponse>> GetAllDepartmentListAsync()
    {
      return await _employeeDirectoryRepository.GetAllDepartmentListAsync();
    }
    public async Task<IEnumerable<SelectOptionResponse>> GetFilteredOrganizationListAsync()
    {
      return await _employeeDirectoryRepository.GetFilteredOrganizationListAsync();
    }
    public async Task<IEnumerable<SelectOptionResponse>> GetFilteredLocationListAsync(int orgCode)
    {
      return await _employeeDirectoryRepository.GetFilteredLocationListAsync(orgCode);
    }
    public async Task<IEnumerable<SelectOptionResponse>> GetFilteredDepartmentListAsync(int orgCode, int locCode)
    {
      return await _employeeDirectoryRepository.GetFilteredDepartmentListAsync(orgCode, locCode);
    }
  }
}
