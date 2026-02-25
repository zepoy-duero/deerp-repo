using DEEMPPORTAL.Application.Report;
using DEEMPPORTAL.Application.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;

namespace DEEMPPORTAL.WebUI.Controllers.Report;

[Authorize]
[Route("report/employee-report")]
public class EmployeeReportController(
  IEmployeeReportService employeeProfileService,
  IWebHostEnvironment webHostEnvironment) : Controller
{
  private readonly IEmployeeReportService _employeeProfileService = employeeProfileService;
  private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;

  [HttpGet("")]
  public IActionResult Index()
  {
    return View();
  }

  [Authorize]
  [HttpGet("getAllEmployeeProfiles")]
  public async Task<IActionResult> GetAllEmployeeProfiles(string searchParam, string filterValue, string filterStatus, int pageNo)
  {
    var (data, totalCount) = await _employeeProfileService.GetAllEmployeeProfileAsync(searchParam, filterValue, filterStatus, pageNo);

    return Ok(new
    {
      Rows = data,
      PageNo = pageNo,
      PageSize = 10,
      TotalCount = totalCount,
      PageCount = (int)Math.Ceiling((decimal)totalCount / 10)
    });
  }

  [Authorize]
  [HttpGet("getTotalEmployeeProfileCount")]
  public async Task<IActionResult> GetTotalEmployeeProfileCount()
  {
    var results = await _employeeProfileService.GetTotalEmployeeProfileCountAsync();

    return Ok(results);
  }

  [Authorize]
  [HttpPost("exportAsExcel")]
  public async Task<IActionResult> ExportAsExcel(string filterValue = "Y", string filterStatus = "")
  {
    var rootPath = _webHostEnvironment.WebRootPath; // locate the web root of the file
    var template = Path.Combine(rootPath, "files", "hr-report.xlsx"); // locate the file's location

    var results = await _employeeProfileService.GetAllEmployeeProfileReportAsync(filterValue, filterStatus); // fetch the quotation items

    await using var stream = new MemoryStream();

    ExcelService.GenerateEmployeeExcelAsync(results, template, stream); // Generate the Excel

    return File(stream.ToArray(), MediaTypeNames.Application.Octet, Guid.NewGuid().ToString() + ".xlsx");
  }
}
