using DEEMPPORTAL.Domain.Manage.Menu;
using System.Data;

namespace DEEMPPORTAL.Application.Manage.Menu;

public interface IMenuRepository
{
    Task<IEnumerable<MenuResponse>> GetMainMenusAsync(string searchParam);
    Task<IEnumerable<MenuResponse>> GetSubMenusAsync(int? mainMenuCode);
    Task<IEnumerable<MenuResponse>> GetSubLevelMenusAsync(int? mainMenuCode, int? subMenuCode);
    Task<MenuDetailResponse> GetMenuDetailAsync(int? mainMenuCode, int? subMenuCode, int? subLevelMenuCode);
    Task<int> UpdSertMainMenuAsync(DataTable dt);
    Task<int> UpdSertSubMenuAsync(DataTable dt);
    Task<int> UpdSertSubLevelMenuAsync(DataTable dt);
    Task<int> DeleteMenuAsync(DataTable dt);
}