using DEEMPPORTAL.Application.Support.EmployeeDirectoryService;
using DEEMPPORTAL.Domain.Support;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Support

{
    [Authorize]
    [Route("support/certified-firstaider")]
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
        [Authorize]
        [HttpGet("add-certified-firstaider")]
        public async Task<IActionResult> AddCertifiedFirstAider(int USER_CODE)
        {
            var data = await _employeeDirectoryService.AddCertifiedFirstAiderAsync(USER_CODE);

            return Ok(data);
        }
        [Authorize]
        [HttpGet("remove-certified-firstaider")]
        public async Task<IActionResult> RemoveCertifiedFirstAider(int USER_CODE)
        {
            var data = await _employeeDirectoryService.RemoveCertifiedFirstAiderAsync(USER_CODE);

            return Ok(data);
        }
        [HttpGet("get-user-firstaider-options")]
        public async Task<IEnumerable<SelectOptionResponse>> GetUserFirstAiderOptions()
        {
            var options = await _employeeDirectoryService.GetUserFirstAiderOptionsAsync();
            return options;
        }
    }
}
