namespace DEEMPPORTAL.WebUI.Models.Ticket
{
    public class TicketApproval
    {
        public int Id { get; set; }
        public int OrgCode { get; set; }
        public int TicketId { get; set; }
        public string? ApprovalStatus { get; set; }
        public DateTime ApprovalDate { get; set; }
        public DateTime ViewedDate { get; set; }

    }
}
