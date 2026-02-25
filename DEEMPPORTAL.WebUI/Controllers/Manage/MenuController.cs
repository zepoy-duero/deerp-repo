using AutoMapper;
using DEEMPPORTAL.Application.Manage.Menu;
using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Domain.Manage.Menu;
using DEEMPPORTAL.WebUI.Models;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Manage;

[Route("manage/menus")]
public class MenuController(
  ISelectOptionsService selectOptionsService,
  IMenuService menuService,
  IMapper mapper) : Controller
{
  private readonly ISelectOptionsService _selectOptionsService = selectOptionsService;
  private readonly IMenuService _menuService = menuService;
  private readonly IMapper _mapper = mapper;

  public IActionResult Index() => View();

  [HttpGet("getAllMainMenuOptions")]
  public async Task<IActionResult> GetAllMainMenuOption()
  {
    var options = await _selectOptionsService.GetAllMainMenuAsync();

    return Ok(options);
  }

  [HttpGet("getAllSubMenuOptions")]
  public async Task<IActionResult> GetAllSubMenuOption(int? mainMenuCode)
  {
    var options = await _selectOptionsService.GetAllSubMenuAsync(mainMenuCode);

    return Ok(options);
  }

  [HttpGet("getAllMainMenu")]
  public async Task<IActionResult> GetAllMainMenu(string searchParam = "")
  {
    var results = await _menuService.GetMainMenusAsync(searchParam);

    return Ok(results);
  }
  
  [HttpGet("getAllSubMenu")]
  public async Task<IActionResult> GetAllMenu(int? mainMenuCode)
  {
    var results = await _menuService.GetSubMenusAsync(mainMenuCode);

    return Ok(results);
  }

  [HttpGet("getAllSubLevelMenu")]
  public async Task<IActionResult> GetAllMenu(int? mainMenuCode, int? subMenuCode)
  {
    var results = await _menuService.GetSubLevelMenusAsync(mainMenuCode, subMenuCode);

    return Ok(results);
  }
  
  [HttpGet("getMenuDetails")]
  public async Task<IActionResult> GetMenuDetail(int? mainMenuCode, int? subMenuCode, int? subLevelMenuCode)
  {
    var results = await _menuService.GetMenuDetailAsync(
      mainMenuCode,
      subMenuCode,
      subLevelMenuCode);

    return Ok(results);
  }
  
  [HttpPost("updSertMainMenu")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> UpdSertMainMenu([FromForm] MenuDetailViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);

    var mapModel = _mapper.Map<MenuDetailRequest>(model);
    var rowsAffected = await _menuService.UpdSertMainMenuAsync(mapModel);

    return Ok(rowsAffected);
  }
  
  [HttpPost("updSertSubMenu")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> UpdSertSubMenu([FromForm] MenuDetailViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);

    var mapModel = _mapper.Map<MenuDetailRequest>(model);
    var rowsAffected = await _menuService.UpdSertSubMenuAsync(mapModel);

    return Ok(rowsAffected);
  }
  
  [HttpPost("updSertSubLevelMenu")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> UpdSertSubLevelMenu([FromForm] MenuDetailViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);

    var mapModel = _mapper.Map<MenuDetailRequest>(model);
    var rowsAffected = await _menuService.UpdSertSubLevelMenuAsync(mapModel);

    return Ok(rowsAffected);
  }
  
  [HttpPost("deleteMenu")]
  public async Task<IActionResult> DeleteMenu([FromBody] List<MenuViewModel> model)
  {
    if (model.Count == 0)
      return BadRequest("Please select at least one record.");

    var listOfCodes = new List<MenuRequest>();

    foreach (var item in model)
    {
      listOfCodes.Add(
        new MenuRequest
				{
          MAIN_MENU_CODE = item.MAIN_MENU_CODE,
          SUB_MENU_CODE = item.SUB_MENU_CODE,
          SUB_LEVEL_MENU_CODE = item.SUB_LEVEL_MENU_CODE,
        });
    }

    var rowsAffected = await _menuService.DeleteMenuAsync(listOfCodes);

    return Ok(rowsAffected);
  }
}
