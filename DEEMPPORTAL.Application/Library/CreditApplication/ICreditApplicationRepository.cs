using DEEMPPORTAL.Domain.Library;
using System.Data;

namespace DEEMPPORTAL.Application.Library.CreditApplication;

public interface ICreditApplicationRepository
{
    Task<IEnumerable<LibraryInformationResponse>> GetAllLibraryInformation(int orgCode);
    Task<LibraryInformationResponse> GetLibraryInformation(int libraryInformationCode);
    Task<bool> SaveLibraryInformation(DataTable dt);
    Task<bool> DeleteLibraryInformation(int libraryInformationCode);
    Task<IEnumerable<LibraryAttachmentResponse>> GetAllLibraryAttchment(int libraryInformationCode);
    Task<LibraryAttachmentResponse> GetLibraryAttachment(int libraryAttachmentCode);
    Task<bool> InsertLibraryAttachment(DataTable dt);
    Task<bool> DeleteLibraryAttachment(int libraryAttachmentCode);
}
