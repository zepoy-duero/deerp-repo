using DEEMPPORTAL.Domain.Manage.RoleMenu;
using System.Data;

namespace DEEMPPORTAL.Application.Manage.RoleMenu;

public interface IRoleMenuRepository
{
    Task<IEnumerable<RoleMenuResponse>> GetRoleMenusAsync(int roleCode);
    Task<int> UpdSertRoleMenuAsync(DataTable dt);
}