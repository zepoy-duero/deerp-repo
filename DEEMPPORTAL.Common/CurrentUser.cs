using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace DEEMPPORTAL.Common;

public class CurrentUser(IHttpContextAccessor contextAccessor)
{
	public int UserId { 
		get; 
		set; } = int.Parse(contextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "USER_CODE")?.Value ?? "0");
	
	public string UserName { 
		get; 
		set; } = contextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "";
	
	public string PersonnelName { 
		get; 
		set; } = contextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "PERSONNEL_NAME")?.Value ?? "";
}
