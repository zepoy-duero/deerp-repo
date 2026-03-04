namespace DEEMPPORTAL.Domain.Manage.Menu;

public class MenuDetailRequest
{
	public int? MAIN_MENU_CODE { get; set; }
	public int? SUB_MENU_CODE { get; set; }
	public int? SUB_LEVEL_MENU_CODE { get; set; }
	public string MENU_NAME { get; set; } = string.Empty;
	public string ICON_NAME { get; set; } = string.Empty;
	public string IS_ACTIVE { get; set; } = string.Empty;
	public int SEQ_NO { get; set; }
}
