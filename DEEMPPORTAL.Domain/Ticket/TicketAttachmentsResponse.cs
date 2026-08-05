namespace DEEMPPORTAL.Domain.Ticket
{
    public class TicketAttachmentsResponse
    {
        public int AttachmentID { get; set; }
        public int TicketId { get; set; }

        public string? FileName { get; set; }

        public string? FileExtension { get; set; }
        public int? FileSize { get; set; }
        public byte[]? FileAttachment { get; set; }
        public DateTime? UploadedDate { get; set; }
        public int? UpdatedBy { get; set; }
    }
}