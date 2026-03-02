using Microsoft.AspNetCore.Mvc.Rendering;
using DEEMPPORTAL.Domain.PartsOrigin;

namespace DEEMPPORTAL.Application.PartsOrigin
{

    public class PartsOriginService(IPartsOriginRepository partsOriginRepository) : IPartsOriginService
    {
        private readonly IPartsOriginRepository _partsOriginRepository = partsOriginRepository;

        public List<SelectListItem> GetOrganizations()
        {
            return _partsOriginRepository.GetOrganizations();
        }


        public List<SelectListItem> GetSuppliersByOrg(int orgCode)
        {
            return _partsOriginRepository.GetSuppliersByOrg(orgCode);
        }



        public string GetCountryNameByIso(string iso)
        {
            return  _partsOriginRepository.GetCountryNameByIso(iso);
        }

        public void InsertSupplierPartsOriginHscode(
            List<PartsOrgViewModel.PartRow> rows,
            string updUser,
            int orgCode,
            string supCode)
        {
            _partsOriginRepository.InsertSupplierPartsOriginHscode(rows, updUser, orgCode, supCode);
        }

        public List<SingleRecordUpdateModel.OriginRow> SearchOriginHsCode(int ctgyCode, string supplierCode, string partNo)
        {
            return _partsOriginRepository.SearchOriginHsCode(ctgyCode, supplierCode, partNo);
        }

        public int UpdateOriginHsCode(SingleRecordUpdateModel.SaveOriginRequest req)
        {
            return _partsOriginRepository.UpdateOriginHsCode(req);
        }

        public List<SelectListItem> GetCategories()
        {
            return _partsOriginRepository.GetCategories();
        }

        public List<SelectListItem> GetCountries()
        {
            return _partsOriginRepository.GetCountries();
        }

        public int DeleteSupplierPartsOrigin(int orgCode, int ctgyCode, string supCode, string invoiceNo, string partNo,
                                         string origin, string hsCode, string updUser)
        {
            return  _partsOriginRepository.DeleteSupplierPartsOrigin(orgCode, ctgyCode, supCode, invoiceNo, partNo, origin, hsCode, updUser);
        }

        public string? GetDescriptionByPartNo(string partNo)
        {
            return  _partsOriginRepository.GetDescriptionByPartNo(partNo);
        }

       
    }
}
