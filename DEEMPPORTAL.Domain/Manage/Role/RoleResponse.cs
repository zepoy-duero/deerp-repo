namespace DEEMPPORTAL.Domain.Manage.Role;

public class RoleResponse
{
	public int? ROLE_CODE { get; set; }
	public string ROLE_NAME { get; set; } = string.Empty;
	public int TOTAL_USERS { get; set; }
	public string IS_ACTIVE { get; set; } = "N";
}
