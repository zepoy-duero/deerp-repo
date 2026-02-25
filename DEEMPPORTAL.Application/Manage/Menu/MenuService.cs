using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Manage.Menu;

namespace DEEMPPORTAL.Application.Manage.Menu;

public class MenuService(IMenuRepository menuRepository) : IMenuService
{
	private readonly IMenuRepository _menuRepository = menuRepository;

	public async Task<int> DeleteMenuAsync(List<MenuRequest> menuCodes)
	{
		var dt = ListToDataTableConverter.ToDataTable(menuCodes);
		var rowsAffected = await _menuRepository.DeleteMenuAsync(dt);
		return rowsAffected;
	}

	public async Task<IEnumerable<MenuResponse>> GetMainMenusAsync(string searchParam)
	{
		return await _menuRepository.GetMainMenusAsync(searchParam);
	}

	public async Task<MenuDetailResponse> GetMenuDetailAsync(int? mainMenuCode, int? subMenuCode, int? subLevelMenuCode)
	{
		return await _menuRepository.GetMenuDetailAsync(mainMenuCode, subMenuCode, subLevelMenuCode);
	}

	public async Task<IEnumerable<MenuResponse>> GetSubLevelMenusAsync(int? mainMenuCode, int? subMenuCode)
	{
		return await _menuRepository.GetSubLevelMenusAsync(mainMenuCode, subMenuCode);
	}

	public async Task<IEnumerable<MenuResponse>> GetSubMenusAsync(int? mainMenuCode)
	{
		return await _menuRepository.GetSubMenusAsync(mainMenuCode);
	}

	public async Task<int> UpdSertMainMenuAsync(MenuDetailRequest request)
	{
		var dt = ListToDataTableConverter.ToDataTable(request);
		var rowsAffected = await _menuRepository.UpdSertMainMenuAsync(dt);
		return rowsAffected;
	}

	public async Task<int> UpdSertSubLevelMenuAsync(MenuDetailRequest request)
	{
		var dt = ListToDataTableConverter.ToDataTable(request);
		var rowsAffected = await _menuRepository.UpdSertSubLevelMenuAsync(dt);
		return rowsAffected;
	}

	public async Task<int> UpdSertSubMenuAsync(MenuDetailRequest request)
	{
		var dt = ListToDataTableConverter.ToDataTable(request);
		var rowsAffected = await _menuRepository.UpdSertSubMenuAsync(dt);
		return rowsAffected;
	}
}
