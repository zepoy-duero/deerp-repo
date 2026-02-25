using System.ComponentModel.DataAnnotations;

namespace DEEMPPORTAL.WebUI.Models
{
	public class ChangePasswordViewModel
	{
		[Required] public string CURRENT_PASSWORD { get; set; }
		[Required] public string NEW_PASSWORD { get; set; }
	}
}
