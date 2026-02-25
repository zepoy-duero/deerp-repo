namespace DEEMPPORTAL.WebUI.Models;

public class MenuDetailViewModel
{
	public int? MAIN_MENU_CODE { get; set; }
	public int? SUB_MENU_CODE { get; set; }
	public int? SUB_LEVEL_MENU_CODE { get; set; }
	public string MENU_NAME { get; set; }
	public string ICON_NAME { get; set; }
	public int SEQ_NO { get; set; }
	public string IS_ACTIVE { get; set; }
}
