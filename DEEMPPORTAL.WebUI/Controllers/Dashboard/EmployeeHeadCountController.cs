using DEEMPPORTAL.Application.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Dashboard;

[Authorize]
[Route("dashboard/employee-headcount")]
public class EmployeeHeadCountController(IEmployeeHeadCountService employeeHeadCountService) : BaseController
{
  private readonly IEmployeeHeadCountService _employeeHeadCountService = employeeHeadCountService;

  [HttpGet]
  public IActionResult Index()
  {
    return View();
  }

  [HttpGet("getTotalEmployeeByJobStatus")]
  public async Task<IActionResult> GetTotalEmployeeByJobStatus()
  {
    var results = await _employeeHeadCountService.GetTotalCountByJobStatusAsync();

    return Ok(results);
  }

  [HttpGet("getTotalEmployeeByOrganization")]
  public async Task<IActionResult> GetTotalEmployeeByOrganization()
  {
    var results = await _employeeHeadCountService.GetTotalEmployeesByLocationAsync();

    return Ok(results);
  }
}
