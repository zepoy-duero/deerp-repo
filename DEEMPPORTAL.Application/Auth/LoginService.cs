using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Auth;
using Microsoft.AspNetCore.Http;

namespace DEEMPPORTAL.Application.Auth;

public class LoginService(
	ILoginRepository loginRepository,
	IHttpContextAccessor httpContextAccessor,
	EmailService emailService,
	IpInfo ipInfo) : ILoginService
{
	private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
	private readonly ILoginRepository _loginRepository = loginRepository;
	private readonly EmailService _emailService = emailService;
	private readonly IpInfo _ipInfo = ipInfo;

	public async Task<AuthResponse> AuthenticateAsync(string username, string password)
	{
		var request = new AuthRequest
		{
			Username = username,
			Password = await Security.Encrypt(password)
		};

		return await _loginRepository.AuthenticateAsync(request);
	}

	public async Task<string> DecryptPassword(string password)
	{
		return await Security.Decrypt(password);
	}

	public string GenerateJwtToken(AuthResponse response)
	{
		return _loginRepository.GenerateJwtToken(response);
	}

	public string GenerateOTPCode()
	{
		Random random = new();
		return random.Next(100000, 999999).ToString();
	}

	public async Task<int> InsertOtpCodeAsync(int userCode, string emailAddress, string otp)
	{
		var rowsAffected = await _loginRepository.InsertOtpCodeAsync(userCode, emailAddress, otp);
		return rowsAffected;
	}

	public async Task<bool> SendEmailAsync(string emailAddress, string otp)
	{
		string recipient = emailAddress;
		string cc = "";
		string bcc = "";
		string subject = "Your OTP Code for Dahbashi Employee Portal";

		string body = $@"
            <html>
                <body style='font-family: Arial Nova'>
                    <p>Your <strong>OTP</strong> code for Dahbashi Employee Portal is</p>
                    <p style='font-weight:bold;font-size:30px'>{otp}</p>
                    <p>
                      From Dahbashi Engineering<br/>
                      Online Employee Portal
                    </p>
                </body>
            </html>
        ";

		return await _emailService.SendAsync(
				recipient,
				subject,
				body,
				cc,
				bcc,
				(IFormFile?)null);
	}

	public async Task<int> TrackLoginLocationAsync(string username)
	{
		var (ip, country, city, browser) = await _ipInfo.GetIpAsync();
		return await _loginRepository.TrackLoginLocationAsync(username, browser, ip, city, country);
	}

	public async Task<bool> VerifyOtpCodeAsync(int userCode, string otp)
	{
		return await _loginRepository.VerifyOtpCodeAsync(userCode, otp);
	}
}
