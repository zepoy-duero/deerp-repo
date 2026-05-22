namespace DEEMPPORTAL.Domain.Ticket
{
    public class TicketAttachmentsResponse
    {
        public int AttachmentID { get; set; }
        public int TicketId { get; set; }
        public DateTime? AttachmentDate { get; set; }
        public string? AttachmentPath { get; set; }

        public string? SubFolderPath { get; set; }
    }
}
