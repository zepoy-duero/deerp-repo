using DEEMPPORTAL.Application.PartsOrigin;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.PartsOrigin;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Data.SqlClient;
using System.Data;



namespace DEEMPPORTAL.Infrastructure
{
    public class PartsOriginRepository(ConnectionPool cp, CurrentUser cu) : IPartsOriginRepository
    {
       private readonly ConnectionPool _cp = cp;
       private readonly CurrentUser _cu = cu;
    public List<SelectListItem> GetOrganizations()
        {
            var list = new List<SelectListItem>();

            using var con = new SqlConnection(_cp.ConnectionName);
            using var cmd = new SqlCommand("CLOUD_v1_ERP_PARTS_ORIGIN_ORGANIZATION_NAME_opts", con); // your updated SP
            cmd.CommandType = CommandType.StoredProcedure;

            con.Open();
            using var dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                string orgCode = dr["ORG_CODE"]?.ToString() ?? "";
                string orgName = dr["OrgName"]?.ToString() ?? "";

                if (!string.IsNullOrWhiteSpace(orgCode) && !string.IsNullOrWhiteSpace(orgName))
                {
                    list.Add(new SelectListItem
                    {
                        Text = orgName,     // shows in dropdown
                        Value = orgCode     //selected value becomes ORG_CODE
                    });
                }
            }

            return list;
        }


        public List<SelectListItem> GetSuppliersByOrg(int orgCode)
        {
            var list = new List<SelectListItem>();

            using var con = new SqlConnection(_cp.ConnectionName);
            using var cmd = new SqlCommand("CLOUD_v1_ERP_PARTS_ORIGIN_SUPPLIER_NAME_opts", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@ORG_CODE", SqlDbType.Int).Value = orgCode;

            con.Open();
            using var dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                string supCode = dr["sup_code"]?.ToString() ?? "";
                string supName = dr["SupplierName"]?.ToString() ?? "";

                if (!string.IsNullOrWhiteSpace(supCode) && !string.IsNullOrWhiteSpace(supName))
                {
                    list.Add(new SelectListItem
                    {
                        Text = supName,     // show name
                        Value = supCode     // store code
                    });
                }
            }

            return list;
        }



        public string GetCountryNameByIso(string iso)
        {
            if (string.IsNullOrWhiteSpace(iso))
                return "";

            iso = iso.Trim();

            using (var con = new SqlConnection(_cp.ConnectionName))
            using (var cmd = new SqlCommand("CLOUD_v1_ERP_PARTS_ORIGIN_COUNTRY_FULLNAME", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ISO", iso);

                con.Open();

                using (var rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        // Stored procedure returns: COUNTRYISO_CODE, COUNTRY_NAME
                        var countryNameObj = rdr["COUNTRY_NAME"];
                        var countryName = countryNameObj == DBNull.Value ? "" : countryNameObj.ToString();

                        return string.IsNullOrWhiteSpace(countryName) ? iso : countryName.Trim();
                    }
                }

                // fallback if not found
                return iso;
            }
        }

        public void InsertSupplierPartsOriginHscode(
            List<PartsOrgViewModel.PartRow> rows,
            string updUser,
            int orgCode,
            string supCode)
        {
            if (rows == null || rows.Count == 0) return;

            using var con = new SqlConnection(_cp.ConnectionName);
            con.Open();

            foreach (var r in rows)
            {
                using var cmd = new SqlCommand("CLOUD_v1_ERP_PARTS_ORIGIN_HSCODE_insrt", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@ORG_CODE", SqlDbType.Int).Value = orgCode;
                cmd.Parameters.Add("@SUP_CODE", SqlDbType.VarChar, 50).Value =
                    string.IsNullOrWhiteSpace(supCode) ? DBNull.Value : supCode;

                cmd.Parameters.AddWithValue("@INVOICENO", (object?)r.InvoiceNo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@PARTNO", (object?)r.PartNo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DESCRIPTION", (object?)r.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ORIGIN", (object?)r.Origin ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@HSCODE", (object?)r.HSCode ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@UPDUSER", updUser ?? "");

                cmd.ExecuteNonQuery();
            }
        }

        public List<SingleRecordUpdateModel.OriginRow> SearchOriginHsCode(int ctgyCode, string supplierCode, string partNo)
        {
            var list = new List<SingleRecordUpdateModel.OriginRow>();

            int? supCodeInt = null;
            if (!string.IsNullOrWhiteSpace(supplierCode) && supplierCode != "ALL")
                supCodeInt = int.Parse(supplierCode); // supplierCode must be numeric string

            using (var con = new SqlConnection(_cp.ConnectionName))
            using (var cmd = new SqlCommand("CLOUD_v1_ERP_PARTS_ORIGIN_SINGLE_RECORD_updt", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@CTGY_CODE", ctgyCode);
                cmd.Parameters.AddWithValue("@SUP_CODE", (object?)supCodeInt ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@PARTNO", string.IsNullOrWhiteSpace(partNo) ? DBNull.Value : partNo);

                con.Open();
                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        list.Add(new SingleRecordUpdateModel.OriginRow
                        {
                            SupplierCode = dr["SUP_CODE"]?.ToString() ?? "",   // keep the code here
                            InvoiceNo = dr["INVOICENO"]?.ToString() ?? "",
                            PartNo = dr["PARTNO"]?.ToString() ?? "",
                            Description = dr["DESCRIPTION"]?.ToString() ?? "",
                            Origin = dr["ORIGIN"]?.ToString() ?? "",
                            HSCode = dr["HSCODE"]?.ToString() ?? "",
                            UpdateDate = dr["UPDDATE"] == DBNull.Value ? null : Convert.ToDateTime(dr["UPDDATE"])
                        });
                    }
                }
            }

            return list;
        }

        public int UpdateOriginHsCode(SingleRecordUpdateModel.SaveOriginRequest req)
        {
            using var con = new SqlConnection(_cp.ConnectionName);
            using var cmd = new SqlCommand("CLOUD_v1_ERP_PARTS_ORIGIN_SINGLE_RECORD_edit", con);
            
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ORG_CODE", req.OrgCode);
                cmd.Parameters.AddWithValue("@CTGY_CODE", req.CtgyCode);

                cmd.Parameters.AddWithValue("@OLD_SUP_CODE", req.OldSupplierCode);
                cmd.Parameters.AddWithValue("@OLD_INVOICENO", req.OldInvoiceNo ?? "");
                cmd.Parameters.AddWithValue("@OLD_PARTNO", req.OldPartNo ?? "");
                cmd.Parameters.AddWithValue("@OLD_ORIGIN", req.OldOrigin ?? "");
                cmd.Parameters.AddWithValue("@OLD_HSCODE", req.OldHSCode ?? "");

                cmd.Parameters.AddWithValue("@NEW_SUP_CODE", req.NewSupplierCode);
                cmd.Parameters.AddWithValue("@NEW_INVOICENO", req.NewInvoiceNo ?? "");
                cmd.Parameters.AddWithValue("@NEW_PARTNO", req.NewPartNo ?? "");

                cmd.Parameters.AddWithValue("@NEW_DESCRIPTION", req.Description ?? "");
                cmd.Parameters.AddWithValue("@NEW_ORIGIN", req.Origin ?? "");
                cmd.Parameters.AddWithValue("@NEW_HSCODE", req.HSCode ?? "");

                cmd.Parameters.AddWithValue("@UPDUSER", req.UpdUser ?? "");

                con.Open();
            return Convert.ToInt32(cmd.ExecuteScalar()); // 1 or 0

        }

        public List<SelectListItem> GetCategories()
        {
            var list = new List<SelectListItem>();

            using var con = new SqlConnection(_cp.ConnectionName);
            using var cmd = new SqlCommand("CLOUD_v1_ERP_PARTS_ORIGIN_CATEGORY_list", con);
            cmd.CommandType = CommandType.StoredProcedure;

            con.Open();
            using var dr = cmd.ExecuteReader();
            while (dr.Read())
            {
                var code = dr["CTGY_CODE"]?.ToString() ?? "";
                var id = dr["CTGY_ID"]?.ToString() ?? "";

                if (!string.IsNullOrWhiteSpace(code))
                {
                    list.Add(new SelectListItem
                    {
                        Value = code,   // SelectedCategory will be CTGY_CODE
                        Text = id       // dropdown shows CT / JCB / KOM / etc.
                    });
                }
            }

            return list;
        }

        public List<SelectListItem> GetCountries()
        {
            var list = new List<SelectListItem>();

            using var con = new SqlConnection(_cp.ConnectionName);
            using var cmd = new SqlCommand("CLOUD_v1_ERP_PARTS_ORIGIN_COUNTRY_list", con);
            cmd.CommandType = CommandType.StoredProcedure;

            con.Open();
            using var dr = cmd.ExecuteReader();
            while (dr.Read())
            {
                var iso = dr["ISO"]?.ToString()?.Trim() ?? "";
                var name = dr["CountryName"]?.ToString()?.Trim() ?? "";

                if (!string.IsNullOrWhiteSpace(iso) && !string.IsNullOrWhiteSpace(name))
                {
                    list.Add(new SelectListItem
                    {
                        Value = name.ToUpperInvariant(),    // store ISO in DB
                        Text = name     // show full country name
                    });
                }
            }

            return list;
        }

        public int DeleteSupplierPartsOrigin(int orgCode, int ctgyCode, string supCode, string invoiceNo, string partNo,
                                         string origin, string hsCode, string updUser)
        {
            using var con = new SqlConnection(_cp.ConnectionName);
            using var cmd = new SqlCommand("CLOUD_v1_ERP_PARTS_ORIGIN_HSCODE_delete", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@ORG_CODE", SqlDbType.Int).Value = orgCode;
            cmd.Parameters.Add("@CTGY_CODE", SqlDbType.Int).Value = ctgyCode;
            cmd.Parameters.Add("@SUP_CODE", SqlDbType.VarChar, 50).Value = (supCode ?? "").Trim();
            cmd.Parameters.Add("@INVOICENO", SqlDbType.VarChar, 200).Value = (invoiceNo ?? "").Trim();
            cmd.Parameters.Add("@PARTNO", SqlDbType.VarChar, 100).Value = (partNo ?? "").Trim();

            cmd.Parameters.Add("@ORIGIN", SqlDbType.VarChar, 100).Value = (origin ?? "").Trim();
            cmd.Parameters.Add("@HSCODE", SqlDbType.VarChar, 100).Value = (hsCode ?? "").Trim();

            cmd.Parameters.Add("@UPDUSER", SqlDbType.VarChar, 50).Value = (updUser ?? "").Trim();

            var outParam = cmd.Parameters.Add("@AffectedRows", SqlDbType.Int);
            outParam.Direction = ParameterDirection.Output;

            con.Open();
            return cmd.ExecuteNonQuery();

            //return outParam.Value == DBNull.Value ? 0 : Convert.ToInt32(outParam.Value);
        }

        public string? GetDescriptionByPartNo(string partNo)
        {
            if (string.IsNullOrWhiteSpace(partNo)) return null;

            using var con = new SqlConnection(_cp.ConnectionName);
            using var cmd = new SqlCommand("CLOUD_v1_ERP_PARTS_ORIGIN_Description_get", con)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add("@PARTNO", SqlDbType.VarChar, 100).Value = partNo.Trim();

            con.Open();
            var result = cmd.ExecuteScalar();
            return result == DBNull.Value ? null : result?.ToString();
        }


    }
}