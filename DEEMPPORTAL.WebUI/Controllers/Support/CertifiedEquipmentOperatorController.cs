using DEEMPPORTAL.Application.Support.EmployeeDirectoryService;
using DEEMPPORTAL.Domain.Support;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Support

{
    [Authorize]
    [Route("support/certified-equipment-operator")]
    public class CertifiedEquipmentOperatorController(IEmployeeDirectoryService employeeDirectoryService) : Controller
    {
        private readonly IEmployeeDirectoryService _employeeDirectoryService = employeeDirectoryService;

        [HttpGet("")]
        public IActionResult Index()
        {
            return View();
        }
        [Authorize]
        [HttpGet("get-all-employee-equipment-operator")]
        public async Task<IActionResult> GetAllEmployeeEquipmentOperator(int orgCode, int locCode, int deptCode)
        {
            var data = await _employeeDirectoryService.GetAllEmployeeEquipmentOperatorAsync(orgCode, locCode, deptCode);

            return Ok(data);
        }
        [Authorize]
        [HttpGet("add-certified-equipment-operator")]
        public async Task<IActionResult> AddCertifiedEquipmentOperator(int USER_CODE,string EQUIPMENT)
        {
            var data = await _employeeDirectoryService.AddCertifiedEquipmentOperatorAsync(USER_CODE, EQUIPMENT);

            return Ok(data);
        }
        [Authorize]
        [HttpGet("remove-certified-equipment-operator")]
        public async Task<IActionResult> RemoveCertifiedEquipmentOperator(int USER_CODE)
        {
            var data = await _employeeDirectoryService.RemoveCertifiedEquipmentOperatorAsync(USER_CODE);

            return Ok(data);
        }
        [HttpGet("get-user-equipment-operator-options")]
        public async Task<IEnumerable<SelectOptionResponse>> GetUserEquipmentOperatorOptions()
        {
            var options = await _employeeDirectoryService.GetUserEquipmentOperatorOptionsAsync();
            return options;
        }
    }
}
