using DEEMPPORTAL.Domain;

namespace DEEMPPORTAL.Application.Shared;

public class SelectOptionsService(ISelectOptionsRepository selectOptionsRepository) : ISelectOptionsService
{
    private readonly ISelectOptionsRepository _selectOptionsRepository = selectOptionsRepository;

    public async Task<IEnumerable<SelectOption>> GetAllOrganizationAsync()
    {
        return await _selectOptionsRepository.GetAllOrganizationAsync();
    }

    public async Task<IEnumerable<SelectOption>> GetAllLocationAsync(int orgCode)
    {
        return await _selectOptionsRepository.GetAllLocationAsync(orgCode);
    }

    public async Task<IEnumerable<SelectOption>> GetAllMainMenuAsync()
    {
        return await _selectOptionsRepository.GetAllMainMenuAsync();
    }

    public async Task<IEnumerable<SelectOption>> GetAllSubMenuAsync(int? mainMenuCode)
    {
        return await _selectOptionsRepository.GetAllSubMenuAsync(mainMenuCode);
    }

    public async Task<IEnumerable<SelectOption>> GetEmployeeAsync(string searchParam)
    {
        return await _selectOptionsRepository.GetEmployeeAsync(searchParam);
    }

    public async Task<IEnumerable<SelectOption>> GetAllRoleAsync()
    {
        return await _selectOptionsRepository.GetAllRoleAsync();
    }

    public async Task<IEnumerable<SelectOption>> GetAllDepartmentAsync(int orgCode, int locCode)
    {
        return await _selectOptionsRepository.GetAllDepartmentAsync(orgCode, locCode);
    }
}
