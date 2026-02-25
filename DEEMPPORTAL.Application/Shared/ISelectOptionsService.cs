using DEEMPPORTAL.Domain;

namespace DEEMPPORTAL.Application.Shared;

public interface ISelectOptionsService
{
    Task<IEnumerable<SelectOption>> GetAllOrganizationAsync();
    Task<IEnumerable<SelectOption>> GetAllLocationAsync(int orgCode);
    Task<IEnumerable<SelectOption>> GetAllMainMenuAsync();
    Task<IEnumerable<SelectOption>> GetAllSubMenuAsync(int? mainMenuCode);
    Task<IEnumerable<SelectOption>> GetEmployeeAsync(string searchParam);
    Task<IEnumerable<SelectOption>> GetAllRoleAsync();
    Task<IEnumerable<SelectOption>> GetAllDepartmentAsync(int orgCode, int locCode);
}
