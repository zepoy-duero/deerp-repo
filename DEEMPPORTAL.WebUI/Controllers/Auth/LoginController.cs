using DEEMPPORTAL.Application.Auth;
using DEEMPPORTAL.WebUI.Models;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Auth;

[Route("auth/login")]
public class LoginController(ILoginService loginService) : Controller
{
	private readonly ILoginService _loginService = loginService;

	[HttpGet("")]
	public IActionResult Index() => View();

	[HttpPost("authenticate")]
	[ValidateAntiForgeryToken]
	public async Task<IActionResult> Authenticate([FromForm] LoginViewModel model)
	{
		if (!ModelState.IsValid)
			return Unauthorized(new 
			{ 
				isSuccess = false,
				message = "Invalid credentials. Please try again." 
			});

		var user = await _loginService.AuthenticateAsync(model.Username, model.Password);
		if (user is null)
			return Unauthorized(new
			{
				isSuccess = false,
				message = "Invalid credentials. Please try again."
			});

		var is2FAEnabled = string.Equals(user.IS_2FA_ENABLED, "Y", StringComparison.OrdinalIgnoreCase);
		if (is2FAEnabled)
		{
			var otpCode = _loginService.GenerateOTPCode();
			if (string.IsNullOrWhiteSpace(otpCode))
				return StatusCode(
					StatusCodes.Status500InternalServerError, new 
					{
						isSuccess = false,
						message = "Failed to generate OTP code. Please try again." 
					});

			var rowsAffected = await _loginService.InsertOtpCodeAsync(user.USER_CODE, user.WORK_PERSONAL_EMAIL, otpCode);
			if(rowsAffected == 0)
				return StatusCode(
					StatusCodes.Status500InternalServerError, new
					{
						isSuccess = false,
						message = "Failed to generate OTP code. Please try again."
					});

			// send the otp code to your designated email addresses
			await _loginService.SendEmailAsync(user.WORK_PERSONAL_EMAIL, otpCode);

			return Ok(new
			{
				isSuccess = true,
				emailAddress = user.WORK_PERSONAL_EMAIL,
				userCode = user.USER_CODE,
				is2FAEnabled
			});
		}
		
		var token = _loginService.GenerateJwtToken(user);

		HttpContext.Response.Cookies.Append(
			"JwtToken", 
			token, 
			new CookieOptions
			{
				HttpOnly = true,
				Secure = HttpContext.Request.IsHttps, // set it to true if its on production
				SameSite = SameSiteMode.Lax,
				Expires = DateTimeOffset.UtcNow.AddHours(8),
				Path = "/"
			});

		//await _loginService.TrackLoginLocationAsync(user.USERNAME);

		return Ok(new 
		{
			isSuccess = true,
			url = Url.Content("~/home") ,
			is2FAEnabled
		});
	}

	[HttpPost("verifyOTP")]
	[ValidateAntiForgeryToken]
	public async Task<IActionResult> VerifyOtp([FromForm] VerifyOtpViewModel model)
	{
		// verify the OTP code
		var isValidOtp = await _loginService.VerifyOtpCodeAsync(model.UserCode, model.OtpCode);
		if (!isValidOtp)
			return BadRequest("Invalid OTP code. Please try again.");

		// generate the JWT token and set it in the cookie
		var user = await _loginService.AuthenticateAsync(model.Username, model.Password);
		if (user is null)
			return Unauthorized(new
			{
				isSuccess = false,
				message = "Invalid credentials. Please try again."
			});

		var token = _loginService.GenerateJwtToken(user);

		HttpContext.Response.Cookies.Append(
			"JwtToken",
			token,
			new CookieOptions
			{
				HttpOnly = true,
				Secure = HttpContext.Request.IsHttps, // set it to true if its on production
				SameSite = SameSiteMode.Lax,
				Expires = DateTimeOffset.UtcNow.AddHours(8),
				Path = "/"
			});

		//await _loginService.TrackLoginLocationAsync(user.USERNAME);

		return Ok(new
		{
			isSuccess = true,
			url = Url.Content("~/home"),
		});
	}
}
