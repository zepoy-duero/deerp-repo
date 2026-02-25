using AutoMapper;
using DEEMPPORTAL.Application.HR;
using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Domain.HR;
using DEEMPPORTAL.WebUI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.HR;

[Authorize]
[Route("hr/leave-application")]
public class LeaveApplicationController(
    ILeaveApplicationService leaveApplicationService,
    IFetchOnlyOneService fetchOnlyOneService,
    IMapper mapper) : BaseController
{
  private readonly ILeaveApplicationService _leaveApplicationService = leaveApplicationService;
  private readonly IFetchOnlyOneService _fetchOnlyOneService = fetchOnlyOneService;
  private readonly IMapper _mapper = mapper;

  public IActionResult Index() => View();

  [Authorize]
  [HttpGet("getLastResumptionDetails")]
  public async Task<IActionResult> GetLastResumptionDetail(int? userCode)
  {
    var results = await _leaveApplicationService.GetLeaveResumptionDateAsync(userCode);

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getTotalLeaveCountByDepartment")]
  public async Task<IActionResult> GetTotalLeaveCountByDepartment()
  {
    var results = await _leaveApplicationService.GetTotalLeaveCountByDepartmentAsync();

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getTotalLeaveCountByEmployee")]
  public async Task<IActionResult> GetTotalLeaveCountByEmployee()
  {
    var results = await _leaveApplicationService.GetTotalLeaveCountByEmployeeAsync();

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getTotalAccumulatedDays")]
  public async Task<IActionResult> GetTotalAccumulatedDays(string? startDate = null)
  {
    startDate = string.IsNullOrWhiteSpace(startDate) ? null : startDate.Trim();

    var results = await _fetchOnlyOneService.GetTotalAccumulatedDays(startDate);

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getTotalUserPerDepartment")]
  public async Task<IActionResult> GetTotalUserPerDepartment()
  {
    var results = await _leaveApplicationService.GetTotalUserPerDepartmentCountAsync();

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getUserEmailId")]
  public async Task<IActionResult> GetUserEmailId()
  {
    var result = await _fetchOnlyOneService.GetUserEmailByUserCode();

    return Ok(result);
  }

  [Authorize]
  [HttpGet("getManagerEmailId")]
  public async Task<IActionResult> GetManagerEmailId()
  {
    var result = await _fetchOnlyOneService.GetManagerEmailByUserCode();

    return Ok(result);
  }

  [Authorize]
  [HttpGet("getAllLeaveApplications")]
  public async Task<IActionResult> GetAllLeaveApplication()
  {
    var results = await _leaveApplicationService.GetLeaveApplicationRequestsAsync();

    return Ok(results);
  }

  [HttpGet("getAllLeaveApplicationsByDepartment")]
  public async Task<IActionResult> GetAllLeaveApplicationByDepartment(
    string searchParam
    , string filterType
    , string filterValue
    , int pageNo)
  {

    var results = await _leaveApplicationService.GetLeaveApplicationRequestsByDepartmentAsync(
      searchParam
      , filterType
      , filterValue
      , pageNo);

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getAllLeaveApplicationsByEmployee")]
  public async Task<IActionResult> GetAllLeaveApplicationByEmployee(
    string searchParam
    , string filterType
    , string filterValue
    , int pageNo)
  {

    var results = await _leaveApplicationService.GetLeaveApplicationRequestsByEmployeeAsync(
      searchParam
      , filterType
      , filterValue
      , pageNo);

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getLeaveApplicationDetails")]
  public async Task<IActionResult> GetLeaveApplicationDetails(int leaveApplicationCode)
  {
    var results = await _leaveApplicationService.GetLeaveApplicationRequestAsync(leaveApplicationCode);

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getLeaveApplicationForResumption")]
  public async Task<IActionResult> GetLeaveApplicationForResumption()
  {
    var results = await _leaveApplicationService.GetLeaveApplicationForResumption();

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getLeaveApplicationForManagerApproval")]
  public async Task<IActionResult> GetLeaveApplicationForManagerApproval()
  {
    var results = await _leaveApplicationService.GetLeaveApplicationForManagerApproval();

    return Ok(results);
  }

  [AllowAnonymous]
  [HttpGet("getLeaveApplicationAttachment")]
  public async Task<IActionResult> GetLeaveApplicationAttachment(int leaveApplicationCode)
  {
    var leaveDetails = await _leaveApplicationService.GetLeaveApplicationRequestAsync(leaveApplicationCode);
    if (leaveDetails == null)
      return NotFound("Leave application not found.");

    var pdfBytes = await _fetchOnlyOneService.GetLeaveApplicationAttachment(leaveApplicationCode);
    if (pdfBytes == null || pdfBytes.Length == 0)
      return NotFound("Attachment not found.");

    return File(pdfBytes, "application/pdf", $@"{leaveDetails.EMPLOYEE_NAME.ToUpper()} - {leaveDetails.LEAVE_TYPE}.pdf");
  }

  [Authorize]
  [HttpPost("updSertLeaveApplication")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> UpdSertLeaveApplication([FromForm] LeaveApplicationDetailViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);
    var mappedDto = _mapper.Map<LeaveApplicationRequest>(model);
    var rowsAffected = await _leaveApplicationService.UpdSertLeaveApplicationAsync(mappedDto, model.ATTACHMENT);
    return Ok(rowsAffected);
  }

  [Authorize]
  [HttpPost("updateLeaveApplicationStatus")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> UpdateLeaveApplicationStatus([FromForm] LeaveApplicationStatusViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);
    var mappedDto = _mapper.Map<LeaveStatusRequest>(model);
    var rowsAffected = await _leaveApplicationService.UpdateLeaveApplicationStatusAsync(mappedDto);
    return Ok(rowsAffected);
  }

  [Authorize]
  [HttpPost("deleteLeaveApplication")]
  public async Task<IActionResult> DeleteLeaveApplication(int leaveApplicationCode)
  {
    if (leaveApplicationCode == 0)
      return BadRequest("Invalid leave application. Please try again.");

    var rowsAffected = await _leaveApplicationService.DeleteLeaveApplicationTemporarilyAsync(leaveApplicationCode);

    return Ok(rowsAffected);
  }
}
