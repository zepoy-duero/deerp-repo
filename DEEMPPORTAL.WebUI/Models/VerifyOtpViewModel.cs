using System.ComponentModel.DataAnnotations;

namespace DEEMPPORTAL.WebUI.Models;

public class VerifyOtpViewModel
{
	[Required]
	public int UserCode { get; set; }
	[Required]
	public string Username { get; set; } = string.Empty;
	[Required]
	public string Password { get; set; } = string.Empty;
	[Required]
	public string OtpCode { get; set; } = string.Empty;
}
