using DEEMPPORTAL.Common;
using Microsoft.AspNetCore.Http;

namespace DEEMPPORTAL.Application.Account;

public class ForgotPasswordService(IForgotPasswordRepository forgotPasswordRepository, EmailService emailService) : IForgotPasswordService
{
	private readonly IForgotPasswordRepository _forgotPasswordRepository = forgotPasswordRepository;
	private readonly EmailService _emailService = emailService;

	public async Task<string> InsertOtpCodeAsync(string emailAddress)
	{
		return await _forgotPasswordRepository.InsertOtpCodeAsync(emailAddress);
	}

	public async Task<string> InsertResetTokenAsync(string emailAddress)
	{
		return await _forgotPasswordRepository.InsertResetTokenAsync(emailAddress);
	}

	public async Task<bool> IsEmailExistAsync(string emailAddress)
	{
		return await _forgotPasswordRepository.IsEmailExistAsync(emailAddress);
	}

	public async Task SendEmailOtpCodeAsync(string emailAddress, string otpCode)
	{
		string recipient = emailAddress;
		string cc = "";
		string bcc = "";
		string subject = "Reset Password OTP Verification Code";

		string body = $@"
            <html>
                <body style='font-family: Arial Nova, Calibri; font-size:12pt'>
                    <p>Your <strong>OTP</strong> code for Reset password is</p>
                    <p style='font-weight:bold;font-size:30px'>{otpCode}</p>
                    <p>
                      <strong>From Dahbashi Engineering</strong><br/>
                      Online Employee Portal
                    </p>
                </body>
            </html>
        ";

		await _emailService.SendAsync(
				recipient,
				subject,
				body,
				cc,
				bcc,
				(IFormFile?)null);
	}

	public async Task SendEmailResetTokenCodeAsync(string emailAddress, string resetToken)
	{
		string recipient = emailAddress;
		string cc = "";
		string bcc = "";
		string subject = "Reset Password Link";

		string body = $@"
            <html>
                <body style='font-family: Arial Nova, Calibri;font-size:11pt'>
                    <p>Dear User,</p>
                    <p>If you want to reset your password, kindly click on the link below (or copy and paste the URL into your browser).</p>
                    <p>
                      <a href='https://dahbashionline.com/account/reset-password?token={resetToken}'>
                        https://dahbashionline.com/account/reset-password?token={resetToken}
                      </a>
                    </p>
                    <p>Note: Please DO NOT share your reset link.</p>
                    <p>
                      <strong>From Dahbashi Engineering</strong><br/>
                      Online Employee Portal
                    </p>
                </body>
            </html>
        ";

		await _emailService.SendAsync(
				recipient,
				subject,
				body,
				cc,
				bcc,
				(IFormFile?)null);
	}

	public async Task<bool> VerifyOtpCodeAsync(string emailAddress, string otpCode)
	{
		return await _forgotPasswordRepository.VerifyOtpCodeAsync(emailAddress, otpCode);
	}
}
