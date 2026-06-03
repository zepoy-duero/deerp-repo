namespace DEEMPPORTAL.WebUI.Models.Ticket
{
    public class Ticket
    {
        //USER DETAIL
            public string? TicketId { get; set; }
            public string? DeptCode { get; set; }
            public string? TicketNo { get; set; } 
            public string? RequestedByCode { get; set; }
            public string? RequestedByName { get; set; }
            public DateTime? RequestedDate { get; set; }
            public string? TicketSubject { get; set; }
            public string? TicketDescription { get; set; }
            public ICollection<TicketAttachment>? Attachments { get; set; }

        //ASSIGNEE
             public DateTime? StartDate { get; set; }
            public decimal? TicketDuration { get; set; }
            public string? TicketDurationUnit { get; set; }
            public DateTime? FinishDate { get; set; }
            public string? AssignedToCode { get; set; }
            public string? AssignedToName { get; set; }
            public string? ModuleName { get; set; }
            public string? PriorityCode { get; set; }
            public string? StatusCode { get; set; }
            public string? TaskTypeCode { get; set; }
        
        //APPROVALS
            public bool ApproveByManager { get; set; }
            public bool IsManagementApproval { get; set; }
            public string? UpdatedBy { get; set; }
            public DateTime? UpdatedDate { get; set; }
        //REVIEWS
            public string? ReviewedBy { get; set; }
            public DateTime? ReviewedDate { get; set; }
            public string? Remarks { get; set; }

            // Navigation Properties
            //public virtual required TicketPriority Priority { get; set; }

            //public virtual required TicketStatus Status { get; set; }

            //public virtual required TicketTaskType TaskType { get; set; }

            //public virtual ICollection<TicketAttachment>? Attachments { get; set; }

            //public virtual ICollection<TicketApproval>? Approvals { get; set; }
        
    
}
}
