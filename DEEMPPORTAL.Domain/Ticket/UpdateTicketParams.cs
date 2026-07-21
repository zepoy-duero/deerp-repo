namespace DEEMPPORTAL.Domain.Ticket
{
    public class UpdateTicketParams
    {

        public int TicketId { get; set; }
        public int? OrgCode { get; set; }
        public int? LocCode { get; set; }
        public int? DeptCode { get; set; }
        public int? TicketNo { get; set; }
        public int? RequestedByCode { get; set; }
        public string? RequestedByName { get; set; }
        public DateTime? RequestedDate { get; set; }
        public string? TicketSubject { get; set; }
        public DateTime? StartDate { get; set; }
        public string? TicketDescription { get; set; }
        public int? TicketDuration { get; set; }
        public string? TicketDurationUnit { get; set; }
        public DateTime? FinishDate { get; set; }
        public int? AssignedToCode { get; set; }
        public string? AssignedToName { get; set; }
        public string? ModuleName { get; set; }
        public int? PriorityCode { get; set; }
        public int? StatusCode { get; set; }
        public int? TaskTypeCode { get; set; }
        public bool? ApproveByManager { get; set; }
        public bool? IsManagementApproval { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? ReviewedBy { get; set; }
        public DateTime? ReviewedDate { get; set; }
        public string? Remarks { get; set; }
        public string? VersionNo { get; set; }
        public string? ManagerEmailId { get; set; }
        public string? RequestedByEmail { get; set; }


    }
}