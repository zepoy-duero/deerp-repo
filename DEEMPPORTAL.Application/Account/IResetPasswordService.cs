using DEEMPPORTAL.Domain.Account;

namespace DEEMPPORTAL.Application.Account;

public interface IResetPasswordService
{
	Task<bool> VerifyResetTokenAsync(string resetToken);
	Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
}
