using Microsoft.AspNetCore.Http;

namespace DEEMPPORTAL.Domain.Ticket
{

    public class TicketResponse
    {
        public int TicketId { get; set; }
        public int? OrgCode { get; set; }
        public int? LocCode { get; set; }
        public int? DeptCode { get; set; }
        public int? TicketNo { get; set; }
        public int? RequestedByCode { get; set; }
        public string? RequestedByName { get; set; } = string.Empty;
        public DateTime? RequestedDate { get; set; }
        public string? TicketSubject { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public string? TicketDescription { get; set; } = string.Empty;
        public int? TicketDuration { get; set; }
        public string? TicketDurationUnit { get; set; } = string.Empty;
        public DateTime? FinishDate { get; set; }
        public int? AssignedToCode { get; set; }
        public string? AssignedToName { get; set; } = string.Empty;
        public string? ModuleName { get; set; } = string.Empty;
        public int? PriorityCode { get; set; }
        public int? StatusCode { get; set; }
        public int? TaskTypeCode { get; set; }
        public bool? ApproveByManager { get; set; }
        public bool? IsManagementApproval { get; set; }
        public string? UpdatedBy { get; set; } = string.Empty;
        public DateTime? UpdatedDate { get; set; }
        public string? ReviewedBy { get; set; } = string.Empty;
        public DateTime? ReviewedDate { get; set; }
        public string? Remarks { get; set; } = string.Empty;
        public string? VersionNo { get; set; }
        public string? ManagerEmailId { get; set; } = string.Empty;
        public string? RequestedByEmail { get; set; } = string.Empty;
        public int? TicketYear { get; set; }
        public string? TaskTypeName { get; set; } = string.Empty;
        public string? StatusName { get; set; } = string.Empty;
        public string? TicketPriority { get; set; } = string.Empty;
        public string? DeptName { get; set; } = string.Empty;
        public string? StringTicketId { get; set; } = string.Empty;
        //public List<IFormFile>? TicketAttachments { get;set;} = [];
    }
}