namespace DEEMPPORTAL.Domain.Manage.Role;

public class RoleDetailRequest
{
	public int? ROLE_CODE { get; set; }
	public string ROLE_NAME { get; set; } = string.Empty;
	public string IS_ACTIVE { get; set; } = "N";
}
