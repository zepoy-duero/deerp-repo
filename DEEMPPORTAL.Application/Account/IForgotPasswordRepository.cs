namespace DEEMPPORTAL.Application.Account;

public interface IForgotPasswordRepository
{
	Task<string> InsertOtpCodeAsync(string emailAddress);
	Task<string> InsertResetTokenAsync(string emailAddress);
	Task<bool> IsEmailExistAsync(string emailAddress);
	Task<bool> VerifyOtpCodeAsync(string emailAddress, string otpCode);
}
