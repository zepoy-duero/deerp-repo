using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;

namespace DEEMPPORTAL.Domain.PartsOrigin
{
    public class SingleRecordUpdateModel
    {
        // Dropdown data
        public List<SelectListItem> Suppliers { get; set; } = new();
        public List<SelectListItem> Categories { get; set; } = new();
        // Search fieldspublic int? SelectedCategory { get; set; }
        public int? SelectedCategory { get; set; }


        public string SelectedCategoryName { get; set; } = "";

        public string PartNo { get; set; } = "";
        public string SelectedSupplier { get; set; } = "";
        public string SelectedSupplierName { get; set; } = "";
        public int OrgCode { get; set; } = 1;     

        // Grid
        public List<OriginRow> Rows { get; set; } = new();
        public List<SelectListItem> Origins { get; set; } = new();
        public bool IsSearched { get; set; }

        public class OriginRow
        {
            public string SupplierCode { get; set; } = "";  // DB code (sup_code)
            public string Supplier { get; set; } = "";      // display name
            public string InvoiceNo { get; set; } = "";
            public string Category { get; set; } = "";
            public string PartNo { get; set; } = "";
            public string Description { get; set; } = "";
            public string Origin { get; set; } = "";      // ISO/code stored in DB
            public string OriginName { get; set; } = "";
            public string SelectedOrigin { get; set; } = "";
            public string HSCode { get; set; } = "";
            public DateTime? UpdateDate { get; set; }
            public int CtgyCode { get; set; }
        }

        public class SaveOriginRequest
        {
            public int OrgCode { get; set; }
            public int CtgyCode { get; set; }
            // OLD key (row finder)
            public int OldSupplierCode { get; set; }
            public string OldInvoiceNo { get; set; } = "";
            public string OldPartNo { get; set; } = "";
            public string OldOrigin { get; set; } = "";
            public string OldHSCode { get; set; } = "";
            // NEW values (edited)
            public int NewSupplierCode { get; set; }
            public string NewInvoiceNo { get; set; } = "";
            public string NewPartNo { get; set; } = "";
            public string Description { get; set; } = "";
            public string Origin { get; set; } = "";
            public string HSCode { get; set; } = "";
            public string UpdUser { get; set; } = "";
        }

        public class AddPartsOriginRequest
        {
            public int ORG_CODE { get; set; }
            public string SUP_CODE { get; set; }

            public string InvoiceNo { get; set; }
            public string PartNo { get; set; }
            public string Description { get; set; }
            public string Origin { get; set; }
            public string HSCode { get; set; }

            public string UpdUser { get; set; } = "";
        }

        public class DeleteRowRequest
        {
            public int OrgCode { get; set; }
            public int CtgyCode { get; set; }
            public string SupCode { get; set; }
            public string InvoiceNo { get; set; }
            public string PartNo { get; set; }
            public string Origin { get; set; }  
            public string HSCode { get; set; }
            public string UpdUser { get; set; } = "";
        }
    }
}
