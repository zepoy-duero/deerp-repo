using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
namespace DEEMPPORTAL.Domain.Ticket
{
    public class CreateTicketParams
    {
        public int OrgCode { get; set; }
        public int LocCode { get; set; }
        public int DeptCode { get; set; }
        // but shows department's name on the ui
        public int RequestedByCode { get; set; }
        public DateTime? RequestedDate { get; set; }
        public string? RequestedBy { get; set; }
        public string? RequestedByName { get; set; }
     
        public string? TaskTypeCode { get; set; }
        public string? TicketSubject { get; set; }
    
        public string? TicketDescription { get; set; }
       

    }
}
