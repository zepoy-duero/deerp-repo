using DEEMPPORTAL.Domain.Auth;

namespace DEEMPPORTAL.Application.Auth;

public interface ILoginRepository
{
	Task<AuthResponse> AuthenticateAsync(AuthRequest request);
	Task<int> InsertOtpCodeAsync(int userCode, string emailAddress, string otp);
	Task<bool> VerifyOtpCodeAsync(int userCode, string otp);
	Task<int> TrackLoginLocationAsync(string username, string browserDetails, string? ip, string? city, string? country);
	string GenerateJwtToken(AuthResponse user);
}
