using DEEMPPORTAL.Domain.Home;

namespace DEEMPPORTAL.Application.Home;

public class HomeService(IHomeRepository homeRepository) : IHomeService
{
    private readonly IHomeRepository _homeRepository = homeRepository;

    public async Task<HomeResponse> GetUserDetailsAsync()
    {
        return await _homeRepository.GetUserDetailsAsync();
    }
}
