namespace DEEMPPORTAL.Domain.Manage;

// this DTO is for sidebar menu results
public class UserMenuResponse
{
	public int? MAIN_MENU_CODE { get; set; }
	public int? MENU_SUB_CODE { get; set; }
	public int? MENU_SUB_LEVEL_CODE { get; set; }
	public string ICON_NAME { get; set; } = string.Empty;
	public string MENU_NAME { get; set; } = string.Empty;
	public string PARENT_MENU { get; set; } = string.Empty;
	public string MENU_URL { get; set; } = string.Empty;
	public int SEQ_NO { get; set; }
	public string IS_ACTIVE { get; set; } = "N";
	public string HAS_SUB_MENU { get; set; } = string.Empty;
}