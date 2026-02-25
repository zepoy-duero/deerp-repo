using DEEMPPORTAL.Domain.Manage.RoleMenu;

namespace DEEMPPORTAL.Application.Manage.RoleMenu;

public interface IRoleMenuService
{
    Task<IEnumerable<RoleMenuResponse>> GetRoleMenusAsync(int roleCode);
    Task<int> UpdSertRoleMenuAsync(List<RoleMenuRequest> list);
}