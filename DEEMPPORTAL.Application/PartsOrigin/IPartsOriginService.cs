using DEEMPPORTAL.Domain.PartsOrigin;
using Microsoft.AspNetCore.Mvc.Rendering;


namespace DEEMPPORTAL.Application.PartsOrigin
{
     public interface IPartsOriginService
    {
        List<SelectListItem> GetOrganizations();
        List<SelectListItem> GetSuppliersByOrg(int orgCode);

        string GetCountryNameByIso(string iso);
        void InsertSupplierPartsOriginHscode(
            List<PartsOrgViewModel.PartRow> rows,
            string updUser,
            int orgCode,
            string supCode);
         List<SingleRecordUpdateModel.OriginRow> SearchOriginHsCode(int ctgyCode, string supplierCode, string partNo);
        int UpdateOriginHsCode(SingleRecordUpdateModel.SaveOriginRequest req);
        List<SelectListItem> GetCategories();
        List<SelectListItem> GetCountries();

         int DeleteSupplierPartsOrigin(int orgCode, int ctgyCode, string supCode, string invoiceNo, string partNo,
                                         string origin, string hsCode, string updUser);
         string? GetDescriptionByPartNo(string partNo);
        

    }
}
