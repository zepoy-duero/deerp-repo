namespace DEEMPPORTAL.Application.Account;

public interface IResetPasswordRepository
{
	Task<bool> VerifyResetTokenAsync(string resetToken);
	Task<bool> ResetPasswordAsync(string newPassword, string resetToken);
}
