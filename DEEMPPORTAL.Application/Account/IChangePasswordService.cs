namespace DEEMPPORTAL.Application.Account;

public interface IChangePasswordService
{
	Task<bool> IsCurrentPasswordValid(string currentPassword);
	Task<bool> UpdatePasswordAsync(string newPassword);
}
