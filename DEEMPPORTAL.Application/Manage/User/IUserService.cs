using DEEMPPORTAL.Domain.Manage.User;

namespace DEEMPPORTAL.Application.Manage.User;

public interface IUserService
{
    Task<IEnumerable<UserResponse>> GetUsersAsync(int orgCode, string searchParam, int pageNo);
    Task<UserDetailResponse> GetUserAsync(int userCode);
    Task<bool> IsUserNameExist(string userName);
    Task<int> UpdSertUserAsync(UserDetailRequest model);
    Task<int> DeleteUserAsync(int userCode);
    Task<string> ShowPassword(int userCode);
    Task<int> ResetPassword(int userCode);
    Task<EmployeeResponse> GetEmployeeDetailsAsync(int empCode, string empName, int orgCode, int locCode);
}
