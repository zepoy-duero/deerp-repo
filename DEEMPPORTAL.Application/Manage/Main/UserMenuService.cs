using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Manage;
using Microsoft.Extensions.Caching.Memory;

namespace DEEMPPORTAL.Application.Manage.Main;

public class UserMenuService(
		IUserMenuRepository menuRepository,
		IMemoryCache memoryCache,
		CurrentUser cu) : IUserMenuService
{
	private readonly IUserMenuRepository _menuRepository = menuRepository;
	private readonly IMemoryCache _memoryCache = memoryCache;
	private readonly CurrentUser _cu = cu;

	private static readonly MemoryCacheEntryOptions cacheEntryOptions = new()
	{
		AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(60),
		SlidingExpiration = TimeSpan.FromMinutes(10),
		Priority = CacheItemPriority.High
	};

	private string MainKey() => $"menu:{_cu.UserId}:main";
	private string SubKey(int? mainMenuCode) => $"menu:{_cu.UserId}:sub:{mainMenuCode ?? 0}";
	private string SubLevelKey(int? mainMenuCode, int? subMenuCode)
			=> $"menu:{_cu.UserId}:sublevel:{mainMenuCode ?? 0}:{subMenuCode ?? 0}";

	public async Task<IEnumerable<UserMenuResponse>> GetMainMenusAsync()
	{
		string key = MainKey();

		return await _memoryCache.GetOrCreateAsync(key, async entry =>
		{
			entry.SetOptions(cacheEntryOptions);
			return await _menuRepository.GetMainMenusAsync();
		}) ?? [];
	}

	public async Task<IEnumerable<UserMenuResponse>> GetSubMenusAsync(int? mainMenuCode)
	{
		var key = SubKey(mainMenuCode);

		return await _memoryCache.GetOrCreateAsync(key, async entry =>
		{
			entry.SetOptions(cacheEntryOptions);
			return await _menuRepository.GetSubMenusAsync(mainMenuCode);
		}) ?? [];
	}

	public async Task<IEnumerable<UserMenuResponse>> GetSubLevelMenusAsync(int? mainMenuCode, int? subMenuCode)
	{
		var key = SubLevelKey(mainMenuCode, subMenuCode);

		return await _memoryCache.GetOrCreateAsync(key, async entry =>
		{
			entry.SetOptions(cacheEntryOptions);
			return await _menuRepository.GetSubLevelMenusAsync(mainMenuCode, subMenuCode);
		}) ?? [];
	}

	public void ClearUserMenuCache()
	{
		_memoryCache.Remove(MainKey());
	}
}
