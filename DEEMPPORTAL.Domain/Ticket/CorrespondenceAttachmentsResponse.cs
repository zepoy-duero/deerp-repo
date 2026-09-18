using Microsoft.AspNetCore.Http;

namespace DEEMPPORTAL.Domain.Ticket
{
    public class CorrespondenceAttachmentsResponse
    {

        public int AttachmentId { get; set; }
        public int TicketId { get; set; }

        public string? FileName { get; set; }

        public string? FileExtension { get; set; }
        public int? FileSize { get; set; }
        public byte[] FileAttachment { get; set; }
        public DateTime? UploadedDate { get; set; }
        public int? UploadedBy { get; set; }
    }
}