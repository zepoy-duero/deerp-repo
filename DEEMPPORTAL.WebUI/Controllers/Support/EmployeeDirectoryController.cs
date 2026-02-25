using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Application.Support.EmployeeDirectoryService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Support;

[Authorize]
[Route("support/employee-directory")]
public class EmployeeDirectoryController(
        ISelectOptionsService selectOptionsService,
      IEmployeeDirectoryService employeeDirectoryService
    ) : Controller
{
  private readonly ISelectOptionsService _selectOptionsService = selectOptionsService;
  private readonly IEmployeeDirectoryService _employeeDirectoryService = employeeDirectoryService;


  [HttpGet("")]
  public IActionResult Index()
  {
    return View();
  }

  [Authorize]
  [HttpGet("getAllEmployeeDirectory")]
  public async Task<IActionResult> GetAllEmployeeDirectory(int orgCode, int locCode, int deptCode)
  {
    var data = await _employeeDirectoryService.GetAllEmployeeDirectoryAsync(orgCode, locCode, deptCode);

    return Ok(data);
  }
  [Authorize]
  [HttpGet("getAllOrganizationList")]
  public async Task<IActionResult> GetAllOrganizationList()
  {
    var options = await _employeeDirectoryService.GetAllOrganizationListAsync();

    return Ok(options);
  }
  [Authorize]
  [HttpGet("getAllLocationList")]
  public async Task<IActionResult> GetAllLocationList()
  {
    var options = await _employeeDirectoryService.GetAllLocationListAsync();

    return Ok(options);
  }
  [Authorize]
  [HttpGet("getAllDepartmentList")]
  public async Task<IActionResult> GetAllDepartment()
  {
    var options = await _employeeDirectoryService.GetAllDepartmentListAsync();

    return Ok(options);
  }
  [Authorize]
  [HttpGet("getFilteredOrganizationList")]
  public async Task<IActionResult> GetAllFilteredOrganizationList()
  {
    var options = await _employeeDirectoryService.GetFilteredOrganizationListAsync();

    return Ok(options);
  }
  [Authorize]
  [HttpGet("getFilteredLocationList")]
  public async Task<IActionResult> GetFilteredLocationList(int orgCode)
  {
    var options = await _employeeDirectoryService.GetFilteredLocationListAsync(orgCode);

    return Ok(options);
  }
  [Authorize]
  [HttpGet("getFilteredDepartmentList")]
  public async Task<IActionResult> GetFilteredDepartment(int orgCode, int locCode)
  {
    var options = await _employeeDirectoryService.GetFilteredDepartmentListAsync(orgCode, locCode);

    return Ok(options);
  }
}
