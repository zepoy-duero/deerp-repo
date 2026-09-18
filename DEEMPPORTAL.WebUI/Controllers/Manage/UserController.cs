using AutoMapper;
using DEEMPPORTAL.Application.Manage.User;
using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Domain.Manage.User;
using DEEMPPORTAL.WebUI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DEEMPPORTAL.WebUI.Controllers.Manage;

[Authorize]
[Route("manage/users")]
public class UserController(
    IUserService userService,
    IMapper mapper,
    ISelectOptionsService selectOptionsService,
     ILogger<UserController> logger) : Controller
{
  private readonly ISelectOptionsService _selectOptionsService = selectOptionsService;
  private readonly IUserService _userService = userService;
  private readonly IMapper _mapper = mapper;
    private readonly ILogger<UserController> _logger = logger;

    [HttpGet("")]
  public IActionResult Index() => View();

  [HttpGet("getAllOrganizations")]
  public async Task<IActionResult> GetAllOrganization()
  {
    var options = await _selectOptionsService.GetAllOrganizationAsync();
    return Ok(options);
  }

  [HttpGet("getAllLocations")]
  public async Task<IActionResult> GetAllLocation(int orgCode)
  {
    var options = await _selectOptionsService.GetAllLocationAsync(orgCode);
    return Ok(options);
  }

    //[HttpGet("getEmployee")]
    //public async Task<IActionResult> GetEmployee(string searchParam, int orgCode)
    //{
    //          var options = await _selectOptionsService.GetEmployeeAsync(searchParam, orgCode);
    //          return Ok(options);    
    //}
    [HttpGet("getEmployee")]
    public async Task<IActionResult> GetEmployee(string searchParam, int orgCode)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(searchParam))
            {
                return BadRequest(new { error = "Search parameter is required" });
            }

            if (orgCode <= 0)
            {
                return BadRequest(new { error = "Invalid organization code" });
            }

            var options = await _selectOptionsService.GetEmployeeAsync(searchParam, orgCode);
            return Ok(options);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument in GetEmployee. SearchParam: {SearchParam}, OrgCode: {OrgCode}", searchParam, orgCode);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving employees. SearchParam: {SearchParam}, OrgCode: {OrgCode}", searchParam, orgCode);
            return StatusCode(500, new { error = "Failed to load employees. Please try again later." });
        }
    }

    [HttpGet("getEmployeeDetails")]
  public async Task<IActionResult> GetEmployeeDetails(int empCode, string empName, int orgCode, int locCode)
  {
    var results = await _userService.GetEmployeeDetailsAsync(empCode, empName, orgCode, locCode);
    return Ok(results);
  }

  [HttpGet("getAllRoles")]
  public async Task<IActionResult> GetAllRole()
  {
    var options = await _selectOptionsService.GetAllRoleAsync();
    return Ok(options);
  }

  [HttpGet("getAllDepartments")]
  public async Task<IActionResult> GetAllDepartment(int orgCode, int locCode)
  {
    var options = await _selectOptionsService.GetAllDepartmentAsync(orgCode, locCode);
    return Ok(options);
  }

  [HttpGet("getUsers")]
  public async Task<IActionResult> GetUsers(int orgCode, string searchParam, int pageNo)
  {
    var results = await _userService.GetUsersAsync(orgCode, searchParam, pageNo);
    return Ok(results);
  }

  [HttpGet("getUser")]
  public async Task<IActionResult> GetUser(int userCode)
  {
    var results = await _userService.GetUserAsync(userCode);
    return Ok(results);
  }

  [HttpPost("updSertUser")]
  public async Task<IActionResult> UpdSertUser(UserDetailViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);
    if (model.USER_CODE is null && await _userService.IsUserNameExist(model.USERNAME))
    {
      ModelState.AddModelError("Username", "Username already exists");
      return BadRequest(ModelState);
    }

    var mapModel = _mapper.Map<UserDetailRequest>(model);
    var rowsAffected = await _userService.UpdSertUserAsync(mapModel);
    return Ok(rowsAffected);
  }

  [HttpPost("deleteUser")]
  public async Task<IActionResult> DeleteUser(int userCode)
  {
    var rowsAffected = await _userService.DeleteUserAsync(userCode);
    return Ok(rowsAffected);
  }

  [HttpPost("resetPassword")]
  public async Task<IActionResult> ResetPassword(int userCode)
  {
    var rowsAffected = await _userService.ResetPassword(userCode);
    return Ok(rowsAffected);
  }

  [HttpGet("showPassword")]
  public async Task<IActionResult> ShowPassword(int userCode)
  {
    var result = await _userService.ShowPassword(userCode);
    return Ok(result);
  }

  // TODOS: 1. Deactivate account
  //        2. Reset Password
}