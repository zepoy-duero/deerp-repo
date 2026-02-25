namespace DEEMPPORTAL.Application.Account;

public interface IChangePasswordRepository
{
	Task<bool> IsCurrentPasswordValid(string currentPassword);
	Task<bool> UpdatePasswordAsync(string newPassword);
}
