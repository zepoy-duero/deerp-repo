namespace DEEMPPORTAL.Domain.Report;

public class EmployeeReportResponse
{
    public int ROW_NO { get; set; }
    public int EMPLOYEE_PROFILE_ID { get; set; }
    public int USER_CODE { get; set; }
    public byte[]? EMP_PHOTO { get; set; }
    public string? EMPLOYEE_NAME { get; set; }
    public string? EMPLOYEE_POSITION { get; set; }
    public string? EMPLOYEE_STATUS { get; set; }
    public string EMAIL_ADDRESS { get; set; } = string.Empty;
    public string DEPARTMENT_NAME { get; set; } = string.Empty;
    public string BLOOD_GROUP { get; set; } = string.Empty;
    public string FOOD_PREFERENCE { get; set; } = string.Empty;
    public string DIETARY_RESTRICTION { get; set; } = string.Empty;
    public string MEDICAL_ALLERGIES { get; set; } = string.Empty;
    public string EMERGENCY_CONTACT { get; set; } = string.Empty;
    public string RESIDENTIAL_ADDRESS { get; set; } = string.Empty;
    public string? MOBILE_NO { get; set; }
}
