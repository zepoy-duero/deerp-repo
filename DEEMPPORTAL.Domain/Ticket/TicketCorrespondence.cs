namespace DEEMPPORTAL.Domain.Ticket
{
    public class TicketCorrespondence
    {
        public int CorrespondenceId { get; set; }

        public int TicketId { get; set; }

        public string? Message { get; set; }

        public DateTime CreatedDate { get; set; }

        public int CreatedByCode { get; set; }

        public int UpdatedBy { get; set; }

        public bool IsDeleted { get; set; }
    }
}