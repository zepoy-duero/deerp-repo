using DEEMPPORTAL.Domain.MyProfile;

namespace Erp.Application.MyProfile;

public interface IMyProfileService
{
    Task<bool> UpdSertMyProfileAsync(MyProfileRequest request);
    Task<IEnumerable<MyProfileResponse>> GetMyProfileDetailsAsync();
}
