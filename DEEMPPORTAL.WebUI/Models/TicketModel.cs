namespace DEEMPPORTAL.WebUI.Models
{
    public class TicketModel
    {
        public int RequestedByCode { get; set; }
        public DateTime? RequestedDate { get; set; }
        public string? RequestedBy { get; set; }
        public string? RequestedByName { get; set; }
        public int DeptCode { get; set; } // but shows department's name on the ui
        public string? TaskTypeCode { get; set; }
        public string? TicketSubject { get; set; }

        public string? TicketDescription { get; set; }
    }
}
