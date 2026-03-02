using Azure.Core;
using DEEMPPORTAL.Application.PartsOrigin;
using DEEMPPORTAL.Domain.PartsOrigin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;


namespace DEEMPPORTAL.WebUI.Controllers.PartsOrigin
{
    [Authorize]
    [Route("single-record-update")]
    public class SingleRecordUpdateController(IPartsOriginService repo) : Controller
    {
        private readonly IPartsOriginService _repo = repo;

        [HttpGet("")]
        public IActionResult Index(int orgCode = 1)
        {
            var model = new SingleRecordUpdateModel();
            model.OrgCode = orgCode;

            model.Suppliers = _repo.GetSuppliersByOrg(model.OrgCode);
            model.Suppliers.Insert(0, new SelectListItem { Value = "ALL", Text = "All" });
            model.Categories = _repo.GetCategories(); // NEW
            model.Origins = _repo.GetCountries();

            return View(model);
        }

        [HttpPost]
        public IActionResult Search(SingleRecordUpdateModel model)
        {
            // refill dropdowns
            model.Suppliers = _repo.GetSuppliersByOrg(model.OrgCode);
            // Add ALL at top
            model.Suppliers.Insert(0, new SelectListItem { Value = "ALL", Text = "All" });

            model.Categories = _repo.GetCategories();

            model.Origins = _repo.GetCountries();

            model.Rows = _repo.SearchOriginHsCode(model.SelectedCategory ?? 0, model.SelectedSupplier, model.PartNo);

            foreach (var r in model.Rows)
            {
                // Category display name from dropdown (not hardcoded)
                r.Category = model.Categories.FirstOrDefault(x => x.Value == (model.SelectedCategory?.ToString() ?? ""))?.Text ?? "";

                // convert SupplierCode -> Supplier display name
                r.Supplier = model.Suppliers.FirstOrDefault(x => x.Value == r.SupplierCode)?.Text ?? r.SupplierCode;


                // Optional (if you show full name in grid)
                r.OriginName = model.Origins.FirstOrDefault(x => x.Value == r.Origin)?.Text ?? r.Origin;
            }

            model.IsSearched = true;
            return View("Index", model);
        }


        [HttpPost]
        public IActionResult SaveEdit([FromBody] SingleRecordUpdateModel.SaveOriginRequest req)
        {
            if (req == null)
                return Json(new { ok = false, message = "Request is null" });
            // get login user from session
            var user = HttpContext.Session.GetString("Username");
            if (string.IsNullOrWhiteSpace(user))
                return Json(new { ok = false, message = "Session expired. Please login again." });
            req.UpdUser = user;

            string Trim(string s) => (s ?? "").Trim();
            //if (string.IsNullOrWhiteSpace(req.NewPartNo))
            //    return Json(new { ok = false, message = "Part No is missing." });

            //if (string.IsNullOrWhiteSpace(req.NewInvoiceNo))
            //    return Json(new { ok = false, message = "Invoice No is missing." });

            //if (string.IsNullOrWhiteSpace(req.Description))
            //    return Json(new { ok = false, message = "Description is missing." });

            //if (string.IsNullOrWhiteSpace(req.HSCode))
            //    return Json(new { ok = false, message = "HS Code is missing." });

            //if (string.IsNullOrWhiteSpace(req.Origin))
            //    return Json(new { ok = false, message = "Origin is missing." });

            //// Length checks (DB limits)
            //if (Trim(req.NewInvoiceNo).Length > 200)
            //    return Json(new { ok = false, message = "Invoice No max 200 characters." });

            //if (Trim(req.NewPartNo).Length > 100)
            //    return Json(new { ok = false, message = "Part No max 100 characters." });

            //if (Trim(req.Description).Length > 100)
            //    return Json(new { ok = false, message = "Description max 100 characters." });

            //if (Trim(req.Origin).Length > 100)
            //    return Json(new { ok = false, message = "Origin max 100 characters." });

            //if (Trim(req.HSCode).Length > 100)
            //    return Json(new { ok = false, message = "HS Code max 100 characters." });

            int rows = _repo.UpdateOriginHsCode(req);
            return Json(new
            {
                ok = rows > 0,
                rows,
                message = rows > 0 ? "Data saved successfully" : "No matching record found"
            });
        }

        [HttpPost]
        public IActionResult AddPartsOrigin(SingleRecordUpdateModel.AddPartsOriginRequest req)
        {
            try
            {
                // IMPORTANT: get user from session (because User.Identity.Name might be empty)
                //var updUser = HttpContext.Session.GetString("Username");
                //if (string.IsNullOrWhiteSpace(updUser))
                //    updUser = "WEB";

                var updUser = HttpContext.Session.GetString("Username");
                if (string.IsNullOrWhiteSpace(updUser))
                    return Json(new { success = false, message = "Session expired. Please login again." });

                req.Description = (req.Description ?? "").Trim();

                if (string.IsNullOrWhiteSpace(req.Description))
                {
                    var dbDesc = _repo.GetDescriptionByPartNo(req.PartNo); // implement below
                    if (!string.IsNullOrWhiteSpace(dbDesc))
                    {
                        // keep it within your grid limit (100)
                        req.Description = dbDesc.Length > 100 ? dbDesc.Substring(0, 100) : dbDesc;
                    }
                    else
                    {
                        req.Description = ""; // allow empty if not found
                    }
                }

                var rows = new List<PartsOrgViewModel.PartRow>
        {
            new PartsOrgViewModel.PartRow
            {
                InvoiceNo = req.InvoiceNo,
                PartNo = req.PartNo,
                Description = req.Description,
                Origin = req.Origin,
                HSCode = req.HSCode
            }
        };

                _repo.InsertSupplierPartsOriginHscode(rows, updUser, req.ORG_CODE, req.SUP_CODE);

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        //[HttpPost]
        //public IActionResult DeleteRow([FromBody] DeleteRowRequest req)
        //{
        //    var user = HttpContext.Session.GetString("Username");
        //    if (string.IsNullOrWhiteSpace(user))
        //        return Json(new { ok = false, message = "Session expired. Please login again." });

        //    // IMPORTANT: trim keys to match DB
        //    req.SupCode = (req.SupCode ?? "").Trim();
        //    req.InvoiceNo = (req.InvoiceNo ?? "").Trim();
        //    req.PartNo = (req.PartNo ?? "").Trim();

        //    int affected = _repo.DeleteSupplierPartsOrigin(req.OrgCode, req.CtgyCode, req.SupCode, req.InvoiceNo, req.PartNo, req.Origin,req.HSCode, user);

        //    if (affected == 0)
        //        return Json(new { ok = false, message = "Delete failed: record not found (key mismatch)." });

        //    return Json(new { ok = true, affected });
        //}
        public class DeleteRowsRequest
        {
            public List<SingleRecordUpdateModel.DeleteRowRequest> Items { get; set; } = new();
        }

        [HttpPost]
        public IActionResult DeleteRows([FromBody] DeleteRowsRequest req)
        {
            var user = HttpContext.Session.GetString("Username");
            if (string.IsNullOrWhiteSpace(user))
                return Json(new { ok = false, message = "Session expired. Please login again." });

            if (req?.Items == null || req.Items.Count == 0)
                return Json(new { ok = false, message = "No rows selected." });

            int deleted = 0;

            foreach (var r in req.Items)
            {
                r.SupCode = (r.SupCode ?? "").Trim();
                r.InvoiceNo = (r.InvoiceNo ?? "").Trim();
                r.PartNo = (r.PartNo ?? "").Trim();
                r.Origin = (r.Origin ?? "").Trim();
                r.HSCode = (r.HSCode ?? "").Trim();

                int affected = _repo.DeleteSupplierPartsOrigin(
                    r.OrgCode, r.CtgyCode, r.SupCode, r.InvoiceNo, r.PartNo, r.Origin, r.HSCode, user
                );

                if (affected > 0) deleted += affected;
            }

            return Json(new { ok = true, deleted });
        }

    }
}
