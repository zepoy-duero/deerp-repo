using DEEMPPORTAL.Domain.MyProfile;
using System.Data;

namespace DEEMPPORTAL.Application.MyProfile;

public interface IMyProfileRespository
{
    Task<bool> UpdSertMyProfileAsync(DataTable dt);
    Task<IEnumerable<MyProfileResponse>> GetMyProfileDetailsAsync();
}
