namespace DEEMPPORTAL.Application.Shared;

public interface IFetchOnlyOneService
{
    Task<string> GetManagerEmailByLeaveApplicationCode(int leaveApplicationCode);
    Task<string> GetManagerEmailByUserCode(int userCode);
    Task<string> GetUserEmailByUserCode(int userCode);
    Task<string> GetHrEmailByUserCode(int userCode);
    Task<string> GetTotalAccumulatedDays(string? startDate);
    Task<byte[]> GetLeaveApplicationAttachment(int leaveApplicationCode);
    Task<string> GetUserEmailByUserCode();
    Task<string> GetManagerEmailByUserCode();
    Task<int> GetUserSatisfactionLatestId();
    Task<bool> IsUserManager(int userCode);
}
