namespace DEEMPPORTAL.Domain.Home;

public class HomeResponse
{
	public string EMP_NAME { get; set; } = string.Empty;
	public string EMP_POSITION { get; set; } = string.Empty;
	public string DEPT_NAME { get; set; } = string.Empty;
	public byte[] EMP_PHOTO { get; set; } = [];
	public string EMP_STATUS { get; set; } = string.Empty;
	public string EMAIL_ADDRESS { get; set; } = string.Empty;
	public string VAT_NO { get; set; } = string.Empty;
}
