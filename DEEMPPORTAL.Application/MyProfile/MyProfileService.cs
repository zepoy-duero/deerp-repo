using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.MyProfile;
using Erp.Application.MyProfile;

namespace DEEMPPORTAL.Application.MyProfile;

public class MyProfileService(IMyProfileRespository myProfileRespository) : IMyProfileService
{
    private readonly IMyProfileRespository _myProfileRespository = myProfileRespository;

    public async Task<IEnumerable<MyProfileResponse>> GetMyProfileDetailsAsync()
    {
        return await _myProfileRespository.GetMyProfileDetailsAsync();
    }

    public async Task<bool> UpdSertMyProfileAsync(MyProfileRequest request)
    {
        var dt = ListToDataTableConverter.ToDataTable(request);
        return await _myProfileRespository.UpdSertMyProfileAsync(dt);
    }
}
