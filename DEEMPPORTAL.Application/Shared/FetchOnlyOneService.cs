namespace DEEMPPORTAL.Application.Shared;

public class FetchOnlyOneService(IFetchOnlyOneRepository fetchOnlyOneRepository) : IFetchOnlyOneService
{
    private readonly IFetchOnlyOneRepository _fetchOnlyOneRepository = fetchOnlyOneRepository;

    public async Task<string> GetHrEmailByUserCode(int userCode)
    {
        return await _fetchOnlyOneRepository.GetHrEmailByUserCode(userCode);
    }

    public Task<byte[]> GetLeaveApplicationAttachment(int leaveApplicationCode)
    {
        return _fetchOnlyOneRepository.GetLeaveApplicationAttachment(leaveApplicationCode);
    }

    public async Task<string> GetManagerEmailByLeaveApplicationCode(int leaveApplicationCode)
    {
        return await _fetchOnlyOneRepository.GetManagerEmailByLeaveApplicationCode(leaveApplicationCode);
    }

    public async Task<string> GetManagerEmailByUserCode(int userCode)
    {
        return await _fetchOnlyOneRepository.GetManagerEmailByUserCode(userCode);
    }

    public async Task<string> GetManagerEmailByUserCode()
    {
        return await _fetchOnlyOneRepository.GetManagerEmailByUserCode();
    }

    public async Task<string> GetTotalAccumulatedDays(string? startDate)
    {
        return await _fetchOnlyOneRepository.GetTotalAccumulatedDays(startDate);
    }

    public async Task<string> GetUserEmailByUserCode(int userCode)
    {
        return await _fetchOnlyOneRepository.GetUserEmailByUserCode(userCode);
    }

    public async Task<string> GetUserEmailByUserCode()
    {
        return await _fetchOnlyOneRepository.GetUserEmailByUserCode();
    }

    public async Task<int> GetUserSatisfactionLatestId()
    {
        return await _fetchOnlyOneRepository.GetUserSatisfactionLatestId();
    }

    public async Task<bool> IsUserManager(int userCode)
    {
        return await _fetchOnlyOneRepository.IsUserManager(userCode);
    }
}
