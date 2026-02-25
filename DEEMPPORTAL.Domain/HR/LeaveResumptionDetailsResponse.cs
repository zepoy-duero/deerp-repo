namespace DEEMPPORTAL.Domain.HR;

public class LeaveResumptionDetailsResponse
{
    public string LOCAL
    {
        get;
        set;
    } = string.Empty;

    public string ANNUAL
    {
        get;
        set;
    } = string.Empty;

    public string MEDICAL
    {
        get;
        set;
    } = string.Empty;

    public string EMERGENCY
    {
        get;
        set;
    } = string.Empty;

    public int ACCUMULATED_DAYS
    {
        get;
        set;
    }
}
