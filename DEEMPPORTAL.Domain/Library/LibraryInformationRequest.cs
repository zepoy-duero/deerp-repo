namespace DEEMPPORTAL.Domain.Library;

public class LibraryInformationRequest
{
    public int? LIBRARY_INFORMATION_CODE { get; set; }
    public int ORG_CODE { get; set; }
    public int LOC_CODE { get; set; }
    public string? DESCRIPTION { get; set; }
    public string LIBRARY_TYPE_CODE { get; set; }
}
