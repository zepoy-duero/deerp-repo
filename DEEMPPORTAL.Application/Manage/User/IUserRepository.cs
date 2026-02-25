using DEEMPPORTAL.Domain.Manage.User;
using System.Data;

namespace DEEMPPORTAL.Application.Manage.User;

public interface IUserRepository
{
    Task<EmployeeResponse> GetEmployeeDetailsAsync(int empCode, string empName, int orgCode, int locCode);
    Task<IEnumerable<UserResponse>> GetUsersAsync(int orgCode,string searchParam, int pageNo);
    Task<UserDetailResponse> GetUserAsync(int userCode);
    Task<string> GetDefaultPassword();
    Task<string> GeneratePassword();
    Task<int> ResetPassword(int userCode, string encryptedPassword);
    Task<bool> IsUserNameExist(string userName);
    Task<int> UpdSertUserAsync(DataTable dt);
    Task<int> DeleteUserAsync(int userCode);
    Task<string> ShowPassword(int userCode);
}
