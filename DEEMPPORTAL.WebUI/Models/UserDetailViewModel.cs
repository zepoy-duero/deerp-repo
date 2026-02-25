namespace DEEMPPORTAL.WebUI.Models
{
	public class UserDetailViewModel
	{
		public int? USER_CODE { get; set; }
		public int ORG_CODE { get; set; }
		public int LOC_CODE { get; set; }
		public int EMP_CODE { get; set; }
		public int DEPT_CODE { get; set; }
		public int ROLE_CODE { get; set; }
		public string EMAIL_ADDRESS { get; set; } = string.Empty;
		public string USERNAME { get; set; } = string.Empty;
		public string PASSWORD { get; set; } = string.Empty;
		public string IS_ACTIVE { get; set; } = string.Empty;
		public string IS_2FA_ENABLED { get; set; } = string.Empty;
	}
}
