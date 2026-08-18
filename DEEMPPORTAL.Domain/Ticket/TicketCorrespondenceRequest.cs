namespace DEEMPPORTAL.Domain.Ticket
{
    public class TicketCorrespondenceRequest
    {
        public int TicketId { get; set; }

        public string? Message { get; set; }

        public int CreatedByCode { get; set; }
    }


    public class UpdateTicketCorrespondenceRequest
    {
        public int CorrespondenceId { get; set; }

        public string? Message { get; set; }

        public int UpdatedBy { get; set; }
    }


    public class DeleteTicketCorrespondenceRequest
    {
        public int CorrespondenceId { get; set; }

        public int UpdatedBy { get; set; }
    }
}