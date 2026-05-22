using DEEMPPORTAL.Application.PartsOrigin;
//using System.Globalization;
using DEEMPPORTAL.Domain.PartsOrigin;
using DEEMPPORTAL.Infrastructure;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.EMMA;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Data;
using System.Diagnostics;
using System.Globalization;
using DataTable = System.Data.DataTable;
using DataSet = System.Data.DataSet;


namespace DEEMPPORTAL.WebUI.Controllers.PartsOrigin

{
    [Authorize]
    [Route("parts-origin")]
    //public class PartsOriginController(IPartsOriginService partsRepo) : Controller
        public class PartsOriginController(IPartsOriginService partsRepo, PartsOriginRepository repo) : Controller
    {
       
        private readonly IPartsOriginService _partsRepo = partsRepo;
        private readonly PartsOriginRepository _repo = repo;
        //private bool IsLoggedIn() =>
        //   HttpContext.Session.GetString("IsLoggedIn") == "true";

        [HttpGet("")]
        public IActionResult Index()
        {
            //if (!IsLoggedIn())
            //    return RedirectToAction("Login", "LoginAccount");

            var model = new PartsOrgViewModel
            {
                Organizations = _partsRepo.GetOrganizations(),
                Suppliers = new()
            };

            // Default org contains "Dahbashi Group of Companies"
            var defaultOrg = model.Organizations.FirstOrDefault(x =>
                !string.IsNullOrWhiteSpace(x.Text) &&
                x.Text.Contains("Dahbashi Group of Companies", StringComparison.OrdinalIgnoreCase));

            if (defaultOrg != null && int.TryParse(defaultOrg.Value, out int orgCode))
            {
                model.SelectedOrganization = orgCode;
                model.Suppliers =  _partsRepo.GetSuppliersByOrg(orgCode);
            }
            else
            {
                model.Suppliers = new List<SelectListItem>();
            }

            return View(model);
        }

        [HttpGet("get-supplier-by-org")]
        public IActionResult GetSuppliersByOrg(int orgCode)
        {
            var suppliers =  _partsRepo.GetSuppliersByOrg(orgCode);
            return Json(suppliers.Select(x => new { value = x.Value, text = x.Text }));
        }

        [HttpPost("process-file")]
        public IActionResult ProcessFile(int orgCode, string supCode, string supName, IFormFile uploadFile)
        {
            //if (!IsLoggedIn())
            //    return RedirectToAction("Login", "LoginAccount");

            if (orgCode <= 0) return BadRequest("Organization is required.");
            if (string.IsNullOrWhiteSpace(supCode)) return BadRequest("Supplier is required.");
            if (uploadFile == null || uploadFile.Length == 0) return BadRequest("File is required.");

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            // ---- Read Excel ONCE here ----
            DataSet ds;
            using (var ms = new MemoryStream())
            { 
                uploadFile.CopyTo(ms);
                ms.Position = 0;

                using var reader = ExcelReaderFactory.CreateReader(ms);
                ds = reader.AsDataSet();
            }
            // detect template from file content
            var detected = DetectTemplateFromExcel(ds);

            // Expected from dropdown supplier name
            var expected = ExpectedTemplateFromSupplierName(supName);

            // block mismatch (prevents wrong parsing)
            if (detected == SupplierTemplate.Unknown)
                return BadRequest("Unsupported Excel template. Please upload a valid DSG / INTERPART / BLUMAQ file.");

            if (expected != SupplierTemplate.Unknown && detected != expected)
                return BadRequest($"Wrong file selected. You selected '{supName}', but the uploaded file looks like '{detected}'.");

            // Now parse using the DETECTED template (source of truth)
            List<PartsOrgViewModel.PartRow> rows;

            if (detected == SupplierTemplate.DSG)
                rows = ReadDsgExcel(uploadFile, supName);

            else if (detected == SupplierTemplate.INTERPART)
                rows = ReadInterpartExcel(uploadFile, supName);

            else // BLUMAQ
                rows = ReadBlumaqExcel(uploadFile, supName, orgCode);

            return Json(new { total = rows.Count, data = rows });
        }
        private enum SupplierTemplate
        {
            Unknown,
            DSG,
            INTERPART,
            BLUMAQ
        }
        private SupplierTemplate DetectTemplateFromExcel(DataSet ds)
        {
            // pick the most “useful” sheet (same logic you used in Interpart/Blumaq)
            var table = ds.Tables.Cast<DataTable>()
                .OrderByDescending(t => t.Rows.Count)
                .FirstOrDefault();
            if (table == null) return SupplierTemplate.Unknown;

            return DetectTemplateFromTable(table);
        }
        private SupplierTemplate DetectTemplateFromTable(DataTable table)
        {
            // Scan first rows/cols for supplier names detection
            int maxR = Math.Min(60, table.Rows.Count);
            int maxC = Math.Min(25, table.Columns.Count);

            //1) BLUMAQ = detect by HEADER ROW containing ALL key headers
            for (int r = 0; r < Math.Min(15, table.Rows.Count); r++)
            {
                string rowText = "";
                for (int c = 0; c < maxC; c++)
                    rowText += " " + CellToText(table.Rows[r][c]).ToUpperInvariant().Trim();

                // normalize spaces so "Invoice No" and "InvoiceNo" both match
                rowText = rowText.Replace(" ", "");
                if (rowText.Contains("ORDERNO") && rowText.Contains("INVOICENO") && rowText.Contains("PARTNO") &&
                    rowText.Contains("ORIGIN") && rowText.Contains("HSCODE"))
                    {
                    return SupplierTemplate.BLUMAQ;
                }

                if (rowText.Contains("FACTURA") && rowText.Contains("CÓDIGO") && rowText.Contains("ARANCELARIO"))
                {
                    return SupplierTemplate.BLUMAQ;
                }

            }

            // 2) DSG / INTERPART = detect by strong branding words + headers
            for (int r = 0; r < maxR; r++)
            {
                for (int c = 0; c < maxC; c++)
                {
                    var cell = CellToText(table.Rows[r][c]).ToUpperInvariant().Trim();
                    if (cell.Contains("DSG INC"))
                    {
                        return SupplierTemplate.DSG;
                    }
                    if (cell.Contains("INTERPART"))
                    {
                        return SupplierTemplate.INTERPART;
                    }
                }
            }
            return SupplierTemplate.Unknown;
        }

        private SupplierTemplate ExpectedTemplateFromSupplierName(string supName)
        {
            var name = (supName ?? "").Trim();

            if (name.Contains("Blumaq", StringComparison.OrdinalIgnoreCase)) return SupplierTemplate.BLUMAQ;
            if (name.Contains("DSG", StringComparison.OrdinalIgnoreCase)) return SupplierTemplate.DSG;
            if (name.Contains("INTERPART", StringComparison.OrdinalIgnoreCase)) return SupplierTemplate.INTERPART;

            return SupplierTemplate.Unknown;
        }

        // ---------------- DSG ----------------
        private List<PartsOrgViewModel.PartRow> ReadDsgExcel(IFormFile file, string supplierName)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            var results = new List<PartsOrgViewModel.PartRow>();

            using var ms = new MemoryStream();
            file.CopyTo(ms);
            ms.Position = 0;

            using var reader = ExcelReaderFactory.CreateReader(ms);
            var ds = reader.AsDataSet();
            var table = ds.Tables[0];

            string invoiceNo = FindValueNextToLabel(table, "INVOICE NO");
            Console.WriteLine("DSG invoiceNo: " + invoiceNo);

            // DSG mapping with index
            const int COL_ITEMNO = 0;   // ITEM NO
            const int COL_DESC = 3;     // DESCRIPTION
            const int COL_HSCODE = 7;   // HS CODE
            const int COL_COO = 9;      // COO

            int startRow = FindRowContaining(table, "ITEM NO");
            if (startRow < 0) startRow = 0;

            for (int r = startRow + 1; r < table.Rows.Count; r++)
            {
                var row = table.Rows[r];

                string partNo = CellToText(row, COL_ITEMNO);
                string desc = CellToText(row, COL_DESC);
                string hs = CellToText(row, COL_HSCODE).Replace(".", "");
                string coo = CellToText(row, COL_COO).ToUpperInvariant();

                // Skip footer / junk lines
                if ((partNo + " " + desc + " " + hs + " " + coo)
                    .ToUpperInvariant()
                    .Contains("CUSTOMER PO#"))
                {
                    continue;
                }

                if (partNo.Contains("Sales Order", StringComparison.OrdinalIgnoreCase) ||
                    desc.Contains("Customer PO", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }
                // Only DSG part numbers
                if (!partNo.StartsWith("DSG-", StringComparison.OrdinalIgnoreCase))
                    continue;

                partNo = partNo.Trim();
                if (partNo.StartsWith("DSG-", StringComparison.OrdinalIgnoreCase))
                    partNo = partNo.Substring(4);

                if (string.IsNullOrWhiteSpace(partNo) || string.IsNullOrWhiteSpace(coo))
                continue;

                results.Add(new PartsOrgViewModel.PartRow
                {
                    Supplier = supplierName,
                    InvoiceNo = invoiceNo,
                    PartNo = partNo,
                    Description = desc,
                    Origin = coo,
                    HSCode = hs
                });
            }
            return results;
        }

        // ---------------- INTERPART ----------------
        private List<PartsOrgViewModel.PartRow> ReadInterpartExcel(IFormFile file, string supplierName)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            var results = new List<PartsOrgViewModel.PartRow>();

            using var ms = new MemoryStream();
            file.CopyTo(ms);
            ms.Position = 0;

            using var reader = ExcelReaderFactory.CreateReader(ms);
            var ds = reader.AsDataSet();

            //Choose sheet with most rows (safer than Tables[0])
            var table = ds.Tables.Cast<DataTable>()
                .OrderByDescending(t => t.Rows.Count)
                .First();

            // invoice number label in screenshot = "Invoice number"
            string invoiceNo = FindValueNextToLabel(table, "Invoice number");
            Console.WriteLine("INTERPART invoiceNo: " + invoiceNo);

            // A Stock code, D Stock description, G Tariff code, I C of O
            const int COL_STOCKCODE = 0;    // A
            const int COL_DESC = 3;         // D
            const int COL_TARIFF = 6;       // G
            const int COL_WEIGHT = 7;       // H
            const int COL_COO = 8;          // I

            int startRow = FindRowContaining(table, "Stock code");
            if (startRow < 0) startRow = 0;

            for (int r = startRow + 1; r < table.Rows.Count; r++)
            {
                var row = table.Rows[r];

                string stockCode = CellToText(row, COL_STOCKCODE);
                string desc = CellToText(row, COL_DESC);
                string hs = CellToText(row, COL_TARIFF).Replace(".", "");
                string weight = CellToText(row, COL_WEIGHT);
                string coo = CellToText(row, COL_COO).ToUpperInvariant();

                //Console.WriteLine("INTERPART weight: " + weight);
                string rowText = (stockCode + " " + desc + " " + hs + " " + coo).ToUpperInvariant();

                if (rowText.Contains("EXPORT DECLARATION") || rowText.Contains("TOTAL NET WEIGHT") || rowText.StartsWith("TOTAL"))
                {
                    break; // end of item table
                }

                // Stop/skip if we reached empty lines
                if (string.IsNullOrWhiteSpace(stockCode) &&
                    string.IsNullOrWhiteSpace(desc) &&
                    string.IsNullOrWhiteSpace(weight) &&
                    string.IsNullOrWhiteSpace(hs) &&
                    string.IsNullOrWhiteSpace(coo))
                {
                    continue;
                }

                // skip header row if it repeats
                if (stockCode.Equals("Stock code", StringComparison.OrdinalIgnoreCase))
                    continue;

                // minimum validations
                if (string.IsNullOrWhiteSpace(stockCode))
                    continue;

                // for get county full name
                string cooFull = string.IsNullOrWhiteSpace(coo)
                    ? "": _partsRepo.GetCountryNameByIso(coo.Trim());
                results.Add(new PartsOrgViewModel.PartRow
                {
                    Supplier = supplierName,
                    InvoiceNo = invoiceNo,
                    PartNo = stockCode.ToUpperInvariant(),
                    Description = desc.ToUpperInvariant(),
                    Weight = weight.ToUpperInvariant(),
                    Origin = string.IsNullOrWhiteSpace(cooFull) ? coo : cooFull.ToUpperInvariant(),
                    HSCode = hs
                });
            }

            return results;
        }
        // ---------------- BLUMAQ ----------------
        //private List<PartsOrgViewModel.PartRow> ReadBlumaqExcel(IFormFile file, string supplierName)
        private List<PartsOrgViewModel.PartRow> ReadBlumaqExcel(IFormFile file, string supplierName, int orgCode)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            var results = new List<PartsOrgViewModel.PartRow>();

            using var ms = new MemoryStream();
            file.CopyTo(ms);
            ms.Position = 0;

            using var reader = ExcelReaderFactory.CreateReader(ms);
            var ds = reader.AsDataSet();

            // choose the sheet with most rows (safer)
            var table = ds.Tables.Cast<DataTable>()
                .OrderByDescending(t => t.Rows.Count)
                .First();

            // Find header row by "InvoiceNo" (or "Invoice No")
            int headerRow = FindRowContaining(table, "INVOICENO");
            if (headerRow < 0)
                headerRow = FindRowContaining(table, "INVOICE");

            if (headerRow < 0) headerRow = 0;

            // Column indexes based on your screenshot
            const int COL_INVOICENO = 1; // B
            const int COL_PARTNO = 2; // C
            const int COL_DESC = 3; // D
            const int COL_WEIGHT = 7; // H
            const int COL_ORIGIN = 9; // J
            const int COL_HSCODE = 10; // K

            int invalidStreak = 0;
            const int MAX_INVALID_STREAK = 8;
          
            for (int r = headerRow + 1; r < table.Rows.Count; r++)
            {
                var row = table.Rows[r];

                string invoiceNo = CellToText(row, COL_INVOICENO);
                string partNo = CellToText(row, COL_PARTNO);
                partNo = (partNo ?? "").Trim().ToUpperInvariant();
                if (!string.IsNullOrWhiteSpace(partNo))
                {
                    Console.WriteLine("First resolve: " + partNo);

                    bool shouldResolve = true;

                    if (partNo.StartsWith("VO", StringComparison.OrdinalIgnoreCase))
                    {
                        partNo = partNo.Substring(2).Trim();   // VO20459855 -> 20459855
                        shouldResolve = false;
                    }
                    else if (partNo.StartsWith("CU", StringComparison.OrdinalIgnoreCase))
                    {
                        partNo = partNo.Substring(2).Trim();   // CU12345 -> 12345
                        shouldResolve = false;
                    }
                    else if (partNo.StartsWith("PK", StringComparison.OrdinalIgnoreCase))
                    {
                        partNo = partNo.Substring(2).Trim();   // PK12345 -> 12345
                        shouldResolve = false;
                    }
                    else if (partNo.StartsWith("JC", StringComparison.OrdinalIgnoreCase))
                    {
                        partNo = partNo.Substring(2).Trim();   // JC90414800 -> 90414800
                        shouldResolve = true;                  // then resolve in SP
                    }

                    Console.WriteLine("Before resolve: " + partNo);

                    if (shouldResolve)
                    {
                        var resolved = _repo.ResolveBlumaqPartNo(orgCode, partNo);
                        partNo = resolved.ResolvedPartNo;
                    }
                }

                string desc = CellToText(row, COL_DESC);
                string weight = CellToText(row, COL_WEIGHT);
                string origin = CellToText(row, COL_ORIGIN).ToUpperInvariant();
                string hs = CellToText(row, COL_HSCODE).Replace(".", "");

                bool allEmpty = string.IsNullOrWhiteSpace(invoiceNo)
                             && string.IsNullOrWhiteSpace(partNo)
                             && string.IsNullOrWhiteSpace(desc)
                             && string.IsNullOrWhiteSpace(weight)
                             && string.IsNullOrWhiteSpace(origin)
                             && string.IsNullOrWhiteSpace(hs);

                if (allEmpty)
                {
                    invalidStreak++;
                    if (invalidStreak >= MAX_INVALID_STREAK) break; // end of table
                    continue;
                }
                results.Add(new PartsOrgViewModel.PartRow
                {
                    Supplier = supplierName,
                    InvoiceNo = invoiceNo.Trim(),
                    PartNo = partNo.Trim().ToUpperInvariant(),
                    Description = (desc ?? "").Trim().ToUpperInvariant(),
                    Weight = (weight ?? "").Trim(),
                    Origin = (origin ?? "").Trim(),
                    HSCode = (hs ?? "").Trim()
                });
            }

            return results;
        }

        // ---------------- Helpers ----------------
        private static int FindRowContaining(DataTable table, string text)
        {
            text = (text ?? "").Trim().ToUpperInvariant();
            for (int r = 0; r < table.Rows.Count; r++)
            {
                for (int c = 0; c < table.Columns.Count; c++)
                {
                    var cell = CellToText(table.Rows[r][c]).ToUpperInvariant();
                    if (cell.Contains(text))
                        return r;
                }
            }
            return -1;
        }

        private static string FindValueNextToLabel(DataTable table, string label)
        {
            label = (label ?? "").Trim().ToUpperInvariant();
            for (int r = 0; r < Math.Min(table.Rows.Count, 80); r++)
            {
                for (int c = 0; c < table.Columns.Count; c++)
                {
                    var cell = CellToText(table.Rows[r][c]).ToUpperInvariant();
                    if (cell.Replace(":", "").Trim().Contains(label))
                    {
                        // scan right
                        for (int k = 1; k <= 10 && (c + k) < table.Columns.Count; k++)
                        {
                            var candidate = CellToText(table.Rows[r][c + k]);
                            if (!string.IsNullOrWhiteSpace(candidate))
                                return candidate.Trim();
                        }
                        // scan down
                        for (int k = 1; k <= 5 && (r + k) < table.Rows.Count; k++)
                        {
                            var candidate = CellToText(table.Rows[r + k][c]);
                            if (!string.IsNullOrWhiteSpace(candidate))
                                return candidate.Trim();
                        }

                        return "";
                    }
                }
            }
            return "";
        }

        private static string CellToText(DataRow row, int colIndex)
        {
            if (row == null) return "";
            if (colIndex < 0 || colIndex >= row.Table.Columns.Count) return "";
            return CellToText(row[colIndex]);
        }

        private static string CellToText(object value)
        {
            if (value == null || value == DBNull.Value) return "";
            // keep integer-looking numbers clean
            if (value is double d)
            {
                if (Math.Abs(d % 1) < 0.0000001)
                    return Convert.ToInt64(d).ToString(CultureInfo.InvariantCulture);
                return d.ToString(CultureInfo.InvariantCulture);
            }
            return value.ToString()?.Trim() ?? "";
        }

        [HttpPost("update-hscode")]
        public IActionResult UpdateOriginHscode([FromBody] UpdateRequest req)
        {
            //if (!IsLoggedIn())
            //    return RedirectToAction("Login", "LoginAccount");

            //Console.WriteLine("update origin button starts... ");
            //Console.WriteLine("UpdateOriginHscode HIT. Rows=" + (req?.Rows?.Count ?? -1));
            if (req == null) return BadRequest("Invalid request.");
            if (req.OrgCode <= 0) return BadRequest("Organization is required.");
            if (string.IsNullOrWhiteSpace(req.SupCode)) return BadRequest("Supplier is required.");
            if (req.Rows == null || req.Rows.Count == 0) return BadRequest("No records to insert.");

            string updUser = HttpContext.Session.GetString("Username") ?? "SYSTEM";
            Console.WriteLine("updUser from session = " + updUser);
            if (req.Rows.Any(r =>
            string.IsNullOrWhiteSpace(r.PartNo) ||
            string.IsNullOrWhiteSpace(r.Origin) ||
            string.IsNullOrWhiteSpace(r.HSCode)
))
            {
                return BadRequest("No data to be inserted because Part No / Origin / HS Code has empty value.");
            }
            // Insert
            _partsRepo.InsertSupplierPartsOriginHscode(req.Rows, updUser, req.OrgCode, req.SupCode);
            

            return Ok(new { inserted = req.Rows.Count });
        }
        // request DT
        public class UpdateRequest
        {
            public int OrgCode { get; set; }
            public string? SupCode { get; set; }
            public List<PartsOrgViewModel.PartRow>? Rows { get; set; }

        }

    }
}
