namespace DEEMPPORTAL.Domain.Auth;

public class AuthResponse
{
	public int USER_CODE { get; set; }
	public string EMAIL_ADDRESS { get; set; } = string.Empty;
	public string USERNAME { get; set; } = string.Empty;
	public string PERSONNEL_NAME { get; set; } = string.Empty;
	public string ROLE { get; set; } = string.Empty;
	public string DEPARTMENT { get; set; } = string.Empty;
	public string IS_2FA_ENABLED { get; set; } = "N";
	public string WORK_PERSONAL_EMAIL { get; set; } = string.Empty;
}
