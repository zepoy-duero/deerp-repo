using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace DEEMPPORTAL.WebUI.Controllers;

public class BaseController : Controller
{
	protected int UserId => int.Parse(User.Claims.FirstOrDefault(c => c.Type == "USER_CODE")?.Value ?? "0");
	protected string UserName => User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "";
	protected string PersonnelName => User.Claims.FirstOrDefault(c => c.Type == "PERSONNEL_NAME")?.Value ?? "";
	protected string DeptName => User.Claims.FirstOrDefault(c => c.Type == "DEPARTMENT")?.Value ?? "";

	public override void OnActionExecuting(ActionExecutingContext context)
	{
		ViewBag.UserId = UserId;
		ViewBag.UserName = UserName;
		ViewBag.PersonnelName = PersonnelName;
		ViewBag.DeptName = DeptName;

		base.OnActionExecuting(context);
	}
}
