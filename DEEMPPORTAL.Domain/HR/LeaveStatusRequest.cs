namespace DEEMPPORTAL.Domain.HR;

public class LeaveStatusRequest
{
    public int LEAVE_APPLICATION_CODE { get; set; }
    public string APPLICATION_STATUS { get; set; } = string.Empty;
    public string REASONS { get; set; } = string.Empty;
}
