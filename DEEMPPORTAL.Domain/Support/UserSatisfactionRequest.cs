namespace DEEMPPORTAL.Domain.Support
{
    public class UserSatisfactionRequest
    {
        public int RATING_VALUE { get; set; }
        public string? FEEDBACK { get; set; }
        public string? COMPLAINT { get; set; }
        public string? SUGGESTION { get; set; }
        public string IP_ADDRESS { get; set; }
        public string IP_COUNTRY { get; set; }
        public string IP_CITY { get; set; }
        public string BROWSER_INFO { get; set; }
        public string EMAIL_TEXT { get; set; }
    }
}
