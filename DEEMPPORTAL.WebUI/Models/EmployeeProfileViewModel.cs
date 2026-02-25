namespace DEEMPPORTAL.WebUI.Models
{
	public class EmployeeProfileViewModel
	{
		public int? EMPLOYEE_PROFILE_ID { get; set; }
		public string BLOOD_GROUP { get; set; }
		public string FOOD_PREFERENCE { get; set; }
		public string DIETARY_RESTRICTION { get; set; }
		public string MEDICAL_ALLERGIES { get; set; }
		public string EMERGENCY_CONTACT_RELATIONSHIP { get; set; }
		public string EMERGENCY_CONTACT_NAME { get; set; }
		public string EMERGENCY_CONTACT_NUMBER { get; set; }
		public string RESIDENTIAL_ADDRESS { get; set; }
		public string MOBILE_NO { get; set; }
		public string TELEPHONE_NO { get; set; }
		public string EXTENSION_NO { get; set; }
		public string EMERGENCY_CONTACT =>
			$"{EMERGENCY_CONTACT_NAME} | {EMERGENCY_CONTACT_RELATIONSHIP} | {EMERGENCY_CONTACT_NUMBER}";
	}
}
