using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static DEEMPPORTAL.WebUI.Models.Ticket.Ticket;

namespace DEEMPPORTAL.WebUI.Models.Ticket
{
    public class TicketAttachment
    {
       
        public int AttachmentID { get; set; }
        public int TicketId { get; set; }
        public DateTime? AttachmentDate { get; set; }
        public string? AttachmentPath { get; set; }

        public string? SubFolderPath { get; set; }
    }
}
