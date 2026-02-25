
using DEEMPPORTAL.Domain.Manage;

namespace DEEMPPORTAL.Application.Manage.Main;

public interface IUserMenuRepository
{
    Task<IEnumerable<UserMenuResponse>> GetMainMenusAsync();
    Task<IEnumerable<UserMenuResponse>> GetSubMenusAsync(int? mainMenuCode);
    Task<IEnumerable<UserMenuResponse>> GetSubLevelMenusAsync(int? mainMenuCode, int? subMenuCode);
}