using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.Domain.Manage.User;
namespace DEEMPPORTAL.Application.Support.EmployeeDirectoryService;

public interface IEmployeeDirectoryRepository
{
  Task<IEnumerable<EmployeeDirectoryResponse>> GetAllEmployeeDirectoryAsync(
     int org_code,
     int loc_code,
     int dept_code, string status);
  Task<IEnumerable<EmployeeDirectoryResponse>> GetAllEmployeeFirefightersAsync(
     int org_code,
     int loc_code,
     int dept_code);
  Task<IEnumerable<EmployeeDirectoryResponse>> GetAllEmployeeFirstAidersAsync(
     int org_code,
     int loc_code,
     int dept_code);
  Task<IEnumerable<SelectOptionResponse>> GetAllOrganizationListAsync();
  Task<IEnumerable<SelectOptionResponse>> GetAllLocationListAsync();
  Task<IEnumerable<SelectOptionResponse>> GetAllDepartmentListAsync();
  Task<IEnumerable<SelectOptionResponse>> GetFilteredOrganizationListAsync();
  Task<IEnumerable<SelectOptionResponse>> GetFilteredLocationListAsync(int orgCode);
  Task<IEnumerable<SelectOptionResponse>> GetFilteredDepartmentListAsync(int orgCode, int locCode);
  Task<byte[]?> GetProfilePicAsync(int EMP_CODE);
  Task<IEnumerable<EmployeeDirectoryResponse>> AddCertifiedFirefighterAsync(int USER_CODE);
  Task<IEnumerable<EmployeeDirectoryResponse>> RemoveCertifiedFirefighterAsync(int USER_CODE);
  Task<IEnumerable<SelectOptionResponse>> GetUserFireFighterOptionsAsync();
    Task<IEnumerable<EmployeeDirectoryResponse>> AddCertifiedFirstAiderAsync(int USER_CODE);
    Task<IEnumerable<EmployeeDirectoryResponse>> RemoveCertifiedFirstAiderAsync(int USER_CODE);
    Task<IEnumerable<SelectOptionResponse>> GetUserFirstAiderOptionsAsync();
}
