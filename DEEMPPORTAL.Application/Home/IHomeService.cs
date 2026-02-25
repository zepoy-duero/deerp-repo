using DEEMPPORTAL.Domain.Home;

namespace DEEMPPORTAL.Application.Home;

public interface IHomeService
{
    Task<HomeResponse> GetUserDetailsAsync();
}
