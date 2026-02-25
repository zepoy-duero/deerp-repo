using Microsoft.AspNetCore.Http;

namespace DEEMPPORTAL.Domain.HR;

public class LeaveApplicationResponse
{
    public int LEAVE_APPLICATION_CODE { get; set; }
    public int USER_CODE { get; set; }
    public string EMPLOYEE_NAME { get; set; } = string.Empty;
    public string DEPARTMENT_NAME { get; set; } = string.Empty;
    public string LEAVE_TYPE { get; set; } = string.Empty;
    public string START_DATE_OF_LEAVE { get; set; } = string.Empty;
    public string END_DATE_OF_LEAVE { get; set; } = string.Empty;
    public int NO_OF_DAYS { get; set; } = 0;
    public int ACCUMULATED_DAYS { get; set; } = 0;
    public string IS_PAID_LEAVE_YN { get; set; } = string.Empty;
    public string REASONS { get; set; } = string.Empty;
    public string DATE_FILED { get; set; } = string.Empty;
    public string APPLICATION_STATUS { get; set; } = string.Empty;
    public IFormFile ATTACHMENT { get; set; }
    public string IS_APPROVED_BY_MANAGER { get; set; } = string.Empty;
    public string IS_APPROVED_BY_HR { get; set; } = string.Empty;
    public string REASON_FOR_DISAPPROVAL { get; set; } = string.Empty;
    public string HAS_ATTACHMENT { get; set; } = string.Empty;
    public int NO_OF_DAYS_PENDING { get; set; }
    public string IS_FOR_RESUMPTION { get; set; } = string.Empty;
    public string STATUS { get; set; } = string.Empty;
    public int PAGE_COUNT { get; set; }
    public int TOTAL_COUNT { get; set; }
  // add manager, hr email properties
}
