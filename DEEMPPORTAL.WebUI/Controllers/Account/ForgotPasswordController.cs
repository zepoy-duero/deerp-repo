using DEEMPPORTAL.Application.Account;
using DEEMPPORTAL.WebUI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Account;

[AllowAnonymous]
[Route("account/forgot-password")]
public class ForgotPasswordController(IForgotPasswordService forgotPasswordService) : Controller
{
  private readonly IForgotPasswordService _forgotPasswordService = forgotPasswordService;

  [HttpGet("")]
  public IActionResult Index() => View();

  [HttpPost("sendOtpCode")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> SendOtpCode([FromForm] ForgotPasswordViewModel model)
  {
    if (string.IsNullOrEmpty(model.EMAIL_ADDRESS))
      return BadRequest(new { isSuccess = false, message = "Email address is required." });

    if (!await _forgotPasswordService.IsEmailExistAsync(model.EMAIL_ADDRESS))
      return NotFound(new { isSuccess = false, message = "Invalid email address. Please try again." });

    var newOtpCode = await _forgotPasswordService.InsertOtpCodeAsync(model.EMAIL_ADDRESS);

    if (string.IsNullOrEmpty(newOtpCode))
      return NotFound(new
      {
        isSuccess = false,
        message = "Failed to generate otp code. Please try again."
      });

    await _forgotPasswordService.SendEmailOtpCodeAsync(model.EMAIL_ADDRESS, newOtpCode);

    return Ok(new
    {
      isSuccess = true,
      message = "Your otp code has been sent to your email address."
    });
  }

  [HttpPost("verifyOtpCode")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> VerifyOtpCode([FromForm] ForgotPasswordViewModel model)
  {
    if (string.IsNullOrEmpty(model.OTP_CODE))
      return BadRequest(new { isSuccess = false, message = "The Otp code field is required." });

    if (!await _forgotPasswordService.VerifyOtpCodeAsync(model.EMAIL_ADDRESS, model.OTP_CODE))
      return NotFound(new { isSuccess = false, message = "Invalid otp code. Please try again." });

    var newResetToken = await _forgotPasswordService.InsertResetTokenAsync(model.EMAIL_ADDRESS);

    if (string.IsNullOrEmpty(newResetToken))
      return NotFound(new { isSuccess = false, message = "Failed to generate reset token. Please try again." });

    await _forgotPasswordService.SendEmailResetTokenCodeAsync(model.EMAIL_ADDRESS, newResetToken);

    return Ok(new
    {
      isSuccess = true,
      message = "Your reset password link has been sent to your email address."
    });
  }
}
