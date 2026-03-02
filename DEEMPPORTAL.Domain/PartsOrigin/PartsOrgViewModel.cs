using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace DEEMPPORTAL.Domain.PartsOrigin
{
    public class PartsOrgViewModel
    {
    
        public List<SelectListItem> Organizations { get; set; } = new();
        public List<SelectListItem> Suppliers { get; set; } = new();

        // Selected values
        public int SelectedOrganization { get; set; }
        public string SelectedSupplier { get; set; } = "";   // sup_code
        public string SelectedSupplierName { get; set; } = ""; // for display

        public string? UploadedFileName { get; set; }
        // Grid data
        public int TotalRecords => Rows?.Count ?? 0;
        public List<PartRow> Rows { get; set; } = new();

        // Row model inside same file (no separate file needed)
        public class PartRow
        {
            public string Supplier { get; set; } = "";
            public string InvoiceNo { get; set; } = "";
            public string PartNo { get; set; } = "";
            public string Description { get; set; } = "";
            public string Origin { get; set; } = "";
            public string HSCode { get; set; } = "";
        }
    }
}
