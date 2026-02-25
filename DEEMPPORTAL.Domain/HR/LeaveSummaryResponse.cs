namespace DEEMPPORTAL.Domain.HR;

public class LeaveSummaryResponse
{
    public int TOTAL_PENDING
    {
        get;
        set;
    }

    public int TOTAL_FOR_HR_APPROVAL
    {
        get;
        set;
    }

    public int TOTAL_APPROVED
    {
        get;
        set;
    }

    public int TOTAL_DISAPPROVED
    {
        get;
        set;
    }

    public int TOTAL_DISAPPROVED_BY_MANAGER
    {
        get;
        set;
    }

    public int TOTAL_DISAPPROVED_BY_HR
    {
        get;
        set;
    }

    public int TOTAL_RESUMED
    {
        get;
        set;
    }

    public int TOTAL_TRASHED
    {
        get;
        set;
    }

    public int TOTAL_LOCAL
    {
        get;
        set;
    }

    public int TOTAL_ANNUAL
    {
        get;
        set;
    }

    public int TOTAL_MEDICAL
    {
        get;
        set;
    }

    public int TOTAL_EMERGENCY
    {
        get;
        set;
    }
}
