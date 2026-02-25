using DEEMPPORTAL.Domain.Manage.Role;
using DEEMPPORTAL.Domain.Manage.RoleMenu;
using System.Data;

namespace DEEMPPORTAL.Application.Manage.Role;

public interface IRoleRepository
{
    Task<IEnumerable<RoleResponse>> GetAllRolesAsync(string searchParam);
    Task<RoleDetailResponse> GetRoleAsync(int roleCode);
    Task<IEnumerable<UserRoleResponse>> GetRoleUsersAsync(int roleCode, string searchParam);
    Task<int> UpdSertRoleAsync(DataTable dt);
    Task<int> DeleteRoleAsync(int roleCode);
}