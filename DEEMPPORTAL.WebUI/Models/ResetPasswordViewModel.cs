using System.ComponentModel.DataAnnotations;

namespace DEEMPPORTAL.WebUI.Models
{
	public class ResetPasswordViewModel
	{
		[Required] public string NEW_PASSWORD { get; set; } = string.Empty;
		[Required] public string RESET_TOKEN { get; set; } = string.Empty;
	}
}
