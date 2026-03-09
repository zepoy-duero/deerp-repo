using DEEMPPORTAL.Domain.Manage.Menu;
using DEEMPPORTAL.Domain.Manage.User;
using DEEMPPORTAL.Domain.Manage.Role;
using DEEMPPORTAL.Domain.MyProfile;
using DEEMPPORTAL.Domain.HR;
using DEEMPPORTAL.Domain.Library;

namespace DEEMPPORTAL.WebUI.Models.Profile;

public class AppProfile : AutoMapper.Profile
{
	public AppProfile()
	{
        CreateMap<EmployeeProfileViewModel, MyProfileRequest>();
        CreateMap<MenuDetailViewModel, MenuDetailRequest>();
		CreateMap<RoleViewModel, RoleDetailRequest>();
        CreateMap<UserDetailViewModel, UserDetailRequest>();
        CreateMap<LeaveApplicationDetailViewModel, LeaveApplicationRequest>();
        CreateMap<LeaveApplicationStatusViewModel, LeaveStatusRequest>();
        CreateMap<LibraryAttachmentViewModel, LibraryAttachmentRequest>();
        CreateMap<LibraryInformationDetailViewModel, LibraryInformationRequest>();
        CreateMap<MenuViewModel, MenuRequest>();
        
    }
}
