namespace DEEMPPORTAL.Application.Account;

public interface IForgotPasswordService
{
	Task<string> InsertOtpCodeAsync(string emailAddress);
	Task<string> InsertResetTokenAsync(string emailAddress);
	Task<bool> IsEmailExistAsync(string emailAddress);
	Task<bool> VerifyOtpCodeAsync(string emailAddress, string otpCode);
	Task SendEmailOtpCodeAsync(string emailAddress, string otpCode);
	Task SendEmailResetTokenCodeAsync(string emailAddress, string resetToken);
}
