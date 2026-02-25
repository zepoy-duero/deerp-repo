using AutoMapper;
using DEEMPPORTAL.Domain.MyProfile;
using DEEMPPORTAL.WebUI.Models;
using Erp.Application.MyProfile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.MyProfile;

[Authorize]
[Route("my-profile")]
public class MyProfileController(IMyProfileService myProfileService, IMapper mapper) : BaseController
{
  private readonly IMyProfileService _myProfileService = myProfileService;
  private readonly IMapper _mapper = mapper;

  [HttpGet("")]
  public IActionResult Index() => View();

  [HttpGet("getMyProfileDetails")]
  public async Task<IActionResult> GetMyProfileDetail()
  {
    var results = await _myProfileService.GetMyProfileDetailsAsync();
    return Ok(results);
  }

  [HttpPost("updSertMyProfile")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> UpdSertMedicalProfile([FromForm] EmployeeProfileViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);

    var mapped = _mapper.Map<MyProfileRequest>(model);
    var isSaved = await _myProfileService.UpdSertMyProfileAsync(mapped);

    return Ok(isSaved);
  }
}
