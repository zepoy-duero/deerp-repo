using DEEMPPORTAL.Domain.Manage.Role;
using DEEMPPORTAL.Domain.Manage.RoleMenu;

namespace DEEMPPORTAL.Application.Manage.Role;

public interface IRoleService
{
    Task<IEnumerable<RoleResponse>> GetAllRolesAsync(string searchParam);
    Task<RoleDetailResponse> GetRoleAsync(int roleCode);
    Task<IEnumerable<UserRoleResponse>> GetRoleUsersAsync(int roleCode, string searchParam);
    Task<int> UpdSertRoleAsync(RoleDetailRequest model);
    Task<int> DeleteRoleAsync(int roleCode);
}