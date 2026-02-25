using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Manage.Role;
using DEEMPPORTAL.Domain.Manage.RoleMenu;

namespace DEEMPPORTAL.Application.Manage.Role;

public class RoleService(IRoleRepository roleRepository) : IRoleService
{
    private readonly IRoleRepository _roleRepository = roleRepository;

    public async Task<IEnumerable<RoleResponse>> GetAllRolesAsync(string searchParam)
    {
        return await _roleRepository.GetAllRolesAsync(searchParam);
    }

    public async Task<RoleDetailResponse> GetRoleAsync(int roleCode)
    {
        return await _roleRepository.GetRoleAsync(roleCode);
    }

    public async Task<int> UpdSertRoleAsync(RoleDetailRequest model)
    {
        var dt = ListToDataTableConverter.ToDataTable(model);
        return await _roleRepository.UpdSertRoleAsync(dt);
    }

    public async Task<int> DeleteRoleAsync(int roleCode)
    {
        return await _roleRepository.DeleteRoleAsync(roleCode);
    }

    public async Task<IEnumerable<UserRoleResponse>> GetRoleUsersAsync(int roleCode, string searchParam)
    {
        return await _roleRepository.GetRoleUsersAsync(roleCode, searchParam);
    }
}
