using DEEMPPORTAL.Domain.Account;

namespace DEEMPPORTAL.Application.Account;

public class ResetPasswordService(IResetPasswordRepository resetPasswordRepository) : IResetPasswordService
{
	private readonly IResetPasswordRepository _resetPasswordRepository = resetPasswordRepository;

	public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request)
	{
		return await _resetPasswordRepository.ResetPasswordAsync(request.HASHED_PASSWORD, request.RESET_TOKEN);
	}

	public async Task<bool> VerifyResetTokenAsync(string resetToken)
	{
		return await _resetPasswordRepository.VerifyResetTokenAsync(resetToken);
	}
}
