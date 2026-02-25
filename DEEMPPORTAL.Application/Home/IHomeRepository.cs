using DEEMPPORTAL.Domain.Home;

namespace DEEMPPORTAL.Application.Home;

public interface IHomeRepository
{
    Task<HomeResponse> GetUserDetailsAsync();
}
