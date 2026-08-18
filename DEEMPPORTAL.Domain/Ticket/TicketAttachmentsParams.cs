using Microsoft.AspNetCore.Http;

namespace DEEMPPORTAL.Domain.Ticket
{
    public class TicketAttachmentsParams
    {

        public int AttachmentID { get; set; }
        public int TicketId { get; set; }

        public string? FileName { get; set; }

        public string? FileExtension { get; set; }
        public int? FileSize { get; set; }
        public IFormFile? FileAttachment { get; set; }
        public DateTime? UploadedDate { get; set; }
        public int? UpdatedBy { get; set; }
    }
}