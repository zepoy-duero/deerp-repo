namespace DEEMPPORTAL.Domain.Manage.User;

public class UserResponse
{
	public int USER_CODE { get; set; }
	public int ORG_CODE { get; set; }
	public string ORG_NAME { get; set; } = string.Empty;
	public int LOC_CODE { get; set; }
	public string LOC_NAME { get; set; } = string.Empty;
	public int EMP_CODE { get; set; }
	public string EMP_ID { get; set; } = string.Empty;
	public string EMP_STATUS { get; set; } = string.Empty;
	public string EMP_NAME { get; set; } = string.Empty;
	public int DEPT_CODE { get; set; }
	public string DEPT_NAME { get; set; } = string.Empty;
	public int ROLE_CODE { get; set; }
	public string ROLE_NAME { get; set; } = string.Empty;
	public string USERNAME { get; set; } = string.Empty;
	public string PASSWORD { get; set; } = string.Empty;
	public string EMAIL_ADDRESS { get; set; } = string.Empty;
	public string IS_ACTIVE { get; set; } = string.Empty;
	public string IS_2FA_ENABLED { get; set; } = string.Empty;
	public int PAGE_COUNT { get; set; }
	public int TOTAL_COUNT { get; set; }
	public int TOTAL_ACTIVE_USERS { get; set; }
	public int TOTAL_INACTIVE_USERS { get; set; }
	public int TOTAL_CONSULTANTS { get; set; }
	public int TOTAL_ON_PAYROLL { get; set; }
	public int TOTAL_EMPLOYEES { get; set; }
}
