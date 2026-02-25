using DEEMPPORTAL.Domain.Auth;

namespace DEEMPPORTAL.Application.Auth;

public interface ILoginService
{
	Task<AuthResponse> AuthenticateAsync(string username, string password);
	Task<int> InsertOtpCodeAsync(int userCode, string emailAddress, string otp);
	Task<bool> SendEmailAsync(string emailAddress, string otp);
	Task<bool> VerifyOtpCodeAsync(int userCode, string otp);
	Task<int> TrackLoginLocationAsync(string username);
	Task<string> DecryptPassword(string password);
	string GenerateJwtToken(AuthResponse response);
	string GenerateOTPCode();
}
