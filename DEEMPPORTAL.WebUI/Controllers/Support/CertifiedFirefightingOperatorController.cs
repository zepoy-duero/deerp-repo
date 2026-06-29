using DEEMPPORTAL.Application.Support.EmployeeDirectoryService;
using DEEMPPORTAL.Domain.Support;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Support

{
    [Authorize]
    [Route("support/certified-firefighting-operator")]
    public class CertifiedFirefightingOperatorController(IEmployeeDirectoryService employeeDirectoryService) : Controller
    {
        private readonly IEmployeeDirectoryService _employeeDirectoryService = employeeDirectoryService;

        [HttpGet("")]
        public IActionResult Index()
        {
            return View();
        }
        [Authorize]
        [HttpGet("getAllEmployeeFirefighters")]
        public async Task<IActionResult> GetAllEmployeeFirefighters(int orgCode, int locCode, int deptCode)
        {
            var data = await _employeeDirectoryService.GetAllEmployeeFirefightersAsync(orgCode, locCode, deptCode);

            return Ok(data);
        }
        [Authorize]
        [HttpGet("add-certified-firefighter")]
        public async Task<IActionResult> AddCertifiedFirefighter(int USER_CODE)
        {
            var data = await _employeeDirectoryService.AddCertifiedFirefighterAsync(USER_CODE);

            return Ok(data);
        }
        [Authorize]
        [HttpGet("remove-certified-firefighter")]
        public async Task<IActionResult> RemoveCertifiedFirefighter(int USER_CODE)
        {
            var data = await _employeeDirectoryService.RemoveCertifiedFirefighterAsync(USER_CODE);

            return Ok(data);
        }
        [HttpGet("get-user-firefighter-options")]
        public async Task<IEnumerable<SelectOptionResponse>> GetUserFireFighterOptions()
        {
            var options = await _employeeDirectoryService.GetUserFireFighterOptionsAsync();
            return options;
        }
    }
}
