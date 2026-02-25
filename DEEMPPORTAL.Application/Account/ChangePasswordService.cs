using DEEMPPORTAL.Domain;

namespace DEEMPPORTAL.Application.Account;

public class ChangePasswordService(IChangePasswordRepository changePasswordRepository) : IChangePasswordService
{
	private readonly IChangePasswordRepository _changePasswordRepository = changePasswordRepository;
	public async Task<bool> IsCurrentPasswordValid(string currentPassword)
	{
		return await _changePasswordRepository.IsCurrentPasswordValid(await Security.Encrypt(currentPassword));
	}

	public async Task<bool> UpdatePasswordAsync(string newPassword)
	{
		return await _changePasswordRepository.UpdatePasswordAsync(await Security.Encrypt(newPassword));
	}
}
