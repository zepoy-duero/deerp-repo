using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Manage.User;

namespace DEEMPPORTAL.Application.Manage.User;

public class UserService(IUserRepository userRepository) : IUserService
{
	private readonly IUserRepository _userRepository = userRepository;

	public async Task<IEnumerable<UserResponse>> GetUsersAsync(int orgCode, string searchParam, int pageNo)
	{
		return await _userRepository.GetUsersAsync(orgCode, searchParam, pageNo);
	}

	public async Task<UserDetailResponse> GetUserAsync(int userCode)
	{
		var result = await _userRepository.GetUserAsync(userCode);
		result.PASSWORD = Security.Decrypt(result.PASSWORD).Result;
		return result;
	}

	public async Task<int> UpdSertUserAsync(UserDetailRequest model)
	{
		model.PASSWORD = Security.Encrypt(model.PASSWORD).Result;
		var dt = ListToDataTableConverter.ToDataTable(model);
		return await _userRepository.UpdSertUserAsync(dt);
	}

	public Task<int> DeleteUserAsync(int userCode)
	{
		return _userRepository.DeleteUserAsync(userCode);
	}

	public async Task<string> ShowPassword(int userCode)
	{
		var encryptedPassword = await _userRepository.ShowPassword(userCode);
		var decryptedPassword = await Security.Decrypt(encryptedPassword);

		return decryptedPassword;
	}

	public async Task<int> ResetPassword(int userCode)
	{
		string defaultPassword = await _userRepository.GetDefaultPassword();
		string encryptPassword = await Security.Encrypt(defaultPassword);

		return await _userRepository.ResetPassword(userCode, encryptPassword);
	}

	public async Task<EmployeeResponse> GetEmployeeDetailsAsync(int empCode, string empName, int orgCode, int locCode)
	{
		return await _userRepository.GetEmployeeDetailsAsync(empCode, empName, orgCode, locCode);
	}

	public async Task<bool> IsUserNameExist(string userName)
	{
		return await _userRepository.IsUserNameExist(userName);
	}
}
