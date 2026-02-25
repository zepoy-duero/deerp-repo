namespace DEEMPPORTAL.Domain.HR;

public class LeaveApplicationRequest
{
    public int? LEAVE_APPLICATION_CODE { get; set; }
    public string? LEAVE_TYPE { get; set; }
    public string? START_DATE_OF_LEAVE { get; set; }
    public string? END_DATE_OF_LEAVE { get; set; }
    public int NO_OF_DAYS { get; set; }
    public int ACCUMULATED_DAYS { get; set; }
    public string? IS_PAID_LEAVE_YN { get; set; }
    public string? REASONS { get; set; }
}
