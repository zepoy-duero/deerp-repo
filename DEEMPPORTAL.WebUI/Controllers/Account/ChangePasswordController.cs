using DEEMPPORTAL.Application.Account;
using DEEMPPORTAL.WebUI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Account;

[Authorize]
[Route("account/change-password")]
public class ChangePasswordController(IChangePasswordService changePasswordService) : Controller
{
  private readonly IChangePasswordService _changePasswordService = changePasswordService;

  [HttpGet("")]
  public IActionResult Index() => View();

  [HttpPost("updatePassword")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> UpdatePassword([FromForm] ChangePasswordViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);

    if (!await _changePasswordService.IsCurrentPasswordValid(model.CURRENT_PASSWORD))
      return BadRequest(new
      {
        isSuccess = false,
        message = "Invalid current password. Please try again."
      });

    if (!await _changePasswordService.UpdatePasswordAsync(model.NEW_PASSWORD))
      return BadRequest(new
      {
        isSuccess = false,
        message = "Failed to update the password. Please try again."
      });

    return Ok(new
    {
      isSuccess = true,
      message = "You have successfully updated your password. Please sign out and try to use your new password."
    });
  }
}
