
namespace DEERP.WebUI.Areas.Erp.Models
{
    public class TicketModel
    {
        public int RecordId { get; set; } //unique
        public int TicketId { get; set; } //format: department name abbr. + '#' + ticket number series. e.g. - MIS#1
        public int CreatedBy { get; set; } 
        public DateTime RequestDate { get; set; }
        public string RequestedBy { get; set; }
        public int DEPT_CODE { get; set; } // but shows department's name on the ui
        public string RequestType { get; set; }
        public string Description { get; set; }
        public ICollection<TicketAttachment> Attachments { get; set; } = new List<TicketAttachment>();

        //ASSIGNEE
        public int AssignedTo { get; set; } 
        public int ModuleName { get; set; }        
        public string Priority { get; set; }
        public string Status { get; set; }
        //DURATION
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }

        //REVIEWS
        public ICollection<TicketReview> Reviews { get; set; } = new List<TicketReview>();

    }
    public class TicketAttachment
    {
        public int AttachmentId { get; set; }
        public int TicketId { get; set; }
        public string AttachmentUrl { get; set; }
    }
    public class TicketReview
    {
        public int ReviewId { get; set; }
        public int ReviewBy { get; set; }
        public DateTime ReviewDate { get; set; }
        public string Remarks { get; set; }
    }
}
