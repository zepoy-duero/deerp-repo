using DEEMPPORTAL.Domain.Manage.Menu;
using DEEMPPORTAL.WebUI.Models;

namespace DEEMPPORTAL.WebUI.Profile;

public class AppProfile : AutoMapper.Profile
{
	public AppProfile()
	{
		CreateMap<MenuDetailViewModel, MenuDetailRequest>();
		CreateMap<MenuDetailRequest, MenuDetailViewModel>();
	}
}
