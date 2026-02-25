namespace DEEMPPORTAL.Domain.HR;

public class LeaveDepartmentSummaryResponse
{
    public string DEPARTMENT_NAME
    {
        get;
        set;
    } = string.Empty;

    public int TOTAL_LEAVE_COUNT
    {
        get;
        set;
    }

    public int TOTAL_LEAVE_PERCENT
    {
        get;
        set;
    }
}
