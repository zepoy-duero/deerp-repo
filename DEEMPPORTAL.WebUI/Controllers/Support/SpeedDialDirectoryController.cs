using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Application.Support.SpeedDialDirectoryService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;

namespace DEEMPPORTAL.WebUI.Controllers.Support
{
  [Authorize]
  [Route("support/speed-dial-directory")]

  public class SpeedDialDirectoryController(
    ISpeedDialDirectoryService _speedDialDirectoryService,
       IWebHostEnvironment webHostEnvironment
      ) : Controller
  {
    private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;
    public IActionResult Index()
    {
      return View();
    }

    [HttpGet("getAllSpeedDialDirectory")]
    public async Task<IActionResult> GetAllSpeedDialDirectory(
                int orgCode,
                int locCode,
                string searchString
                )
    {
      var result = await _speedDialDirectoryService
          .GetAllSpeedDialDirectoryAsync(
              orgCode,
              locCode,
              searchString
              );

      return Ok(result);
    }

    [HttpPost("exportAsExcel")]
    public async Task<IActionResult> ExportAsExcel(int orgCode,
                int locCode,
                string searchString)
    {
      var rootPath = _webHostEnvironment.WebRootPath; // locate the web root of the file
      var template = Path.Combine(rootPath, "files", "speed-dial-directory.xlsx"); // locate the file's location

      var results = await _speedDialDirectoryService.GetAllSpeedDialDirectoryAsync(orgCode,
              locCode,
              searchString); // fetch the quotation items

      await using var stream = new MemoryStream();

      ExcelService.GenerateSpeedDialDirectoryExcelAsync(results, template, stream); // Generate the Excel

      return File(stream.ToArray(), MediaTypeNames.Application.Octet, Guid.NewGuid().ToString() + ".xlsx");
    }
  }
}
