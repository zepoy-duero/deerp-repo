using DEEMPPORTAL.Domain.Manage.Menu;

namespace DEEMPPORTAL.Application.Manage.Menu;

public interface IMenuService
{
    Task<IEnumerable<MenuResponse>> GetMainMenusAsync(string searchParam);
    Task<IEnumerable<MenuResponse>> GetSubMenusAsync(int? mainMenuCode);
    Task<IEnumerable<MenuResponse>> GetSubLevelMenusAsync(int? mainMenuCode, int? subMenuCode);
    Task<MenuDetailResponse> GetMenuDetailAsync(int? mainMenuCode, int? subMenuCode, int? subLevelMenuCode);
    Task<int> UpdSertMainMenuAsync(MenuDetailRequest request);
    Task<int> UpdSertSubMenuAsync(MenuDetailRequest request);
    Task<int> UpdSertSubLevelMenuAsync(MenuDetailRequest request);
    Task<int> DeleteMenuAsync(List<MenuRequest> menuCodes);
}