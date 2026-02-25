using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Manage.RoleMenu;

namespace DEEMPPORTAL.Application.Manage.RoleMenu;

public class RoleMenuService(IRoleMenuRepository roleMenuRepository) : IRoleMenuService
{
    private readonly IRoleMenuRepository _roleMenuRepository = roleMenuRepository;

    public async Task<IEnumerable<RoleMenuResponse>> GetRoleMenusAsync(int roleCode)
    {
        return await _roleMenuRepository.GetRoleMenusAsync(roleCode);
    }

    public async Task<int> UpdSertRoleMenuAsync(List<RoleMenuRequest> list)
    {
        var dt = ListToDataTableConverter.ToDataTable(list);
        var rowsAffected = await _roleMenuRepository.UpdSertRoleMenuAsync(dt);

        return rowsAffected;
    }
}
