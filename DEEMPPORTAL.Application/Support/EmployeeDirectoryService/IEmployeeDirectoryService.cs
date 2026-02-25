using DEEMPPORTAL.Domain.Support;


namespace DEEMPPORTAL.Application.Support.EmployeeDirectoryService
{
  public interface IEmployeeDirectoryService
  {
    Task<IEnumerable<EmployeeDirectoryResponse>> GetAllEmployeeDirectoryAsync(int org_code, int loc_code, int dept_code);
    Task<IEnumerable<SelectOptionResponse>> GetAllOrganizationListAsync();
    Task<IEnumerable<SelectOptionResponse>> GetAllLocationListAsync();
    Task<IEnumerable<SelectOptionResponse>> GetAllDepartmentListAsync();
    Task<IEnumerable<SelectOptionResponse>> GetFilteredOrganizationListAsync();
    Task<IEnumerable<SelectOptionResponse>> GetFilteredLocationListAsync(int orgCode);
    Task<IEnumerable<SelectOptionResponse>> GetFilteredDepartmentListAsync(int orgCode, int locCode);

  }
}
