using DEEMPPORTAL.Application.Account;
using DEEMPPORTAL.Domain.Account;
using DEEMPPORTAL.WebUI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Account;

[Authorize]
[Route("account/reset-password")]
public class ResetPasswordController(IResetPasswordService resetPasswordService) : Controller
{
  private readonly IResetPasswordService _resetPasswordService = resetPasswordService;

  [HttpGet("")]
  public async Task<IActionResult> Index(string token)
  {
    ViewData["IsValidToken"] = await _resetPasswordService.VerifyResetTokenAsync(token);
    ViewData["ResetToken"] = token;

    return View();
  }

  [HttpPost("resetPassword")]
  public async Task<IActionResult> ResetPassword([FromForm] ResetPasswordViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);

    if (!await _resetPasswordService.VerifyResetTokenAsync(model.RESET_TOKEN))
      return BadRequest(new
      {
        isSuccess = false,
        message = "Invalid or expired reset token."
      });

    var mapped = new ResetPasswordRequest
    {
      NEW_PASSWORD = model.NEW_PASSWORD,
      RESET_TOKEN = model.RESET_TOKEN
    };

    if (!await _resetPasswordService.ResetPasswordAsync(mapped))
      return BadRequest(new
      {
        isSuccess = false,
        message = "Failed to reset password. Please try again."
      });

    return Ok(new
    {
      isSuccess = true,
      message = "Password has been reset successfully. Please re-logged in your account."
    });
  }
}
