namespace DEEMPPORTAL.Domain.Ticket
{
    public class TicketEmailNotification
    {
        public string? RequestedByName { get; set; }
        //public string? ManagerName { get; set; }
        public string? RequestedDate { get; set; }
        public string? TicketSubject { get; set; }
        public string? TicketDeptName { get; set; }
        public string? TicketDescription { get; set; }
        public string? TaskTypeName{ get; set; }
        public string? TicketId { get; set; }
        public string? ManagerEmailId { get; set; }
        public string? RequestedByEmail { get; set; }
        public string? TicketNo { get; set; }
        public string? StringTicketId { get; set; }
    }
}
