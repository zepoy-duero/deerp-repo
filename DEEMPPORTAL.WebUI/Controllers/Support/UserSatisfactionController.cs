using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using DEEMPPORTAL.Application.Support;
using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.WebUI.Models;

namespace DEEMPPORTAL.WebUI.Controllers.Support;

[AllowAnonymous]
[Route("support/user-satisfaction")]
public class UserSatisfactionController(
  IUserSatisfactionService userSatisfactionService,
  IFetchOnlyOneService fetchOnlyOneService,
  IHttpClientFactory httpClientFactory) : Controller
{
  private readonly IUserSatisfactionService _userSatisfactionService = userSatisfactionService;
  private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
  private readonly IFetchOnlyOneService _fetchOnlyOneService = fetchOnlyOneService;

  [HttpGet("")]
  public IActionResult Index() => View();

  [HttpPost("sendUserSatisfaction")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> SendUserSatisfaction(UserSatisfactionViewModel model)
  {
    var secretKey = "6LfoV9krAAAAALfJQl02coJvHttQn2mrJQyVk06e";
    var client = _httpClientFactory.CreateClient();

    var response = await client.PostAsync($"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={model.CAPTCHA_TOKEN}"
    , null);

    var jsonString = await response.Content.ReadAsStringAsync();

    using var doc = JsonDocument.Parse(jsonString);
    bool isValid = doc.RootElement.GetProperty("success").GetBoolean();

    if (!isValid)
    {
      return BadRequest(new
      {
        success = false,
        message = "Captcha validation failed. Please try again."
      });
    }

    var mapped = new UserSatisfactionRequest
    {
      RATING_VALUE = model.RATING_VALUE,
      FEEDBACK = model.FEEDBACK,
      COMPLAINT = model.COMPLAINTS,
      SUGGESTION = model.SUGGESTIONS
    };

    try
    {
      var nextRecordId = await _fetchOnlyOneService.GetUserSatisfactionLatestId();

      if (!await _userSatisfactionService.InsertAsync(mapped, nextRecordId))
        return BadRequest(new
        {
          success = false,
          message = "Something went wrong. Please contact your administrator."
        });

      await _userSatisfactionService.SendEmailAsync(mapped, nextRecordId);

      return Ok(new
      {
        success = true,
        message = "Thank you for your feedback it helps the company make confident decisions and keep us improving.!"
      });
    }
    catch (Exception)
    {

      return BadRequest(new
      {
        success = false,
        message = "Something went wrong. Please contact your administrator."
      });
    }
  }
}
