using DEEMPPORTAL.Application.Support.EmployeeDirectoryService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Support

{
    [Authorize]
    [Route("support/certified-first-aider")]
    public class CertifiedFirstAiderController(IEmployeeDirectoryService employeeDirectoryService) : Controller
    {
        private readonly IEmployeeDirectoryService _employeeDirectoryService = employeeDirectoryService;

        [HttpGet("")]
        public IActionResult Index()
        {
            return View();
        }
        [Authorize]
        [HttpGet("getAllEmployeeFirstAiders")]
        public async Task<IActionResult> GetAllEmployeeFirstAiders(int orgCode, int locCode, int deptCode)
        {
            var data = await _employeeDirectoryService.GetAllEmployeeFirstAidersAsync(orgCode, locCode, deptCode);

            return Ok(data);
        }
    }
}
