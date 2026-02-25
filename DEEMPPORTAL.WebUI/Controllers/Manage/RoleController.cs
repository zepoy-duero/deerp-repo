using AutoMapper;
using DEEMPPORTAL.Application.Manage.Role;
using DEEMPPORTAL.Application.Manage.RoleMenu;
using DEEMPPORTAL.Domain.Manage.Role;
using DEEMPPORTAL.Domain.Manage.RoleMenu;
using DEEMPPORTAL.WebUI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Manage;

[Authorize]
[Route("manage/roles")]
public class RoleController(
    IRoleService roleService,
    IRoleMenuService roleMenuService,
    IMapper mapper) : Controller
{
  private readonly IRoleService _roleService = roleService;
  private readonly IRoleMenuService _roleMenuService = roleMenuService;
  private readonly IMapper _mapper = mapper;

  public IActionResult Index() => View();

  [HttpGet("getAllRoles")]
  public async Task<IActionResult> GetAllRole(string searchParam)
  {
    var results = await _roleService.GetAllRolesAsync(searchParam);
    return Ok(results);
  }

  [HttpGet("getRoleDetails")]
  public async Task<IActionResult> GetRoleDetail(int roleCode)
  {
    var results = await _roleService.GetRoleAsync(roleCode);
    return Ok(results);
  }

  [HttpGet("getRoleUsers")]
  public async Task<IActionResult> GetRoleUsers(int roleCode, string searchParam)
  {
    var results = await _roleService.GetRoleUsersAsync(roleCode, searchParam);
    return Ok(results);
  }

  [HttpPost("updSertRole")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> UpdSertRole([FromForm] RoleViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);

    var mapModel = _mapper.Map<RoleDetailRequest>(model);
    var rowsAffected = await _roleService.UpdSertRoleAsync(mapModel);

    return Ok(rowsAffected);
  }

  [HttpPost("deleteRole")]
  public async Task<IActionResult> DeleteRole(int roleCode)
  {
    var rowsAffected = await _roleService.DeleteRoleAsync(roleCode);
    return Ok(rowsAffected);
  }

  [HttpGet("getRoleMenus")]
  public async Task<IActionResult> GetRoleMenus(int roleCode)
  {
    var results = await _roleMenuService.GetRoleMenusAsync(roleCode);
    return Ok(results);
  }

  [HttpPost("updSertRoleMenu")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> UpdSertRoleMenu([FromBody] List<RoleMenuViewModel> list)
  {
    if (list.Count == 0)
      return BadRequest("Please select at least one (1) item.");

    var listofRoleMenuCodes = new List<RoleMenuRequest>();

    foreach (var item in list)
    {
      listofRoleMenuCodes.Add(
          new()
          {
            ROLE_CODE = item.ROLE_CODE,
            MAIN_MENU_CODE = item.MAIN_MENU_CODE,
            MENU_SUB_CODE = item.MENU_SUB_CODE,
            MENU_SUB_LEVEL_CODE = item.MENU_SUB_LEVEL_CODE
          });
    }

    var rowsAffected = await _roleMenuService.UpdSertRoleMenuAsync(listofRoleMenuCodes);

    return Ok(rowsAffected);
  }
}