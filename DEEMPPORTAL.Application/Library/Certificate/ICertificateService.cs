using DEEMPPORTAL.Domain.Library;
using Microsoft.AspNetCore.Http;

namespace DEEMPPORTAL.Application.Library.Certificate;

public interface ICertificateService
{
    Task<IEnumerable<LibraryInformationResponse>> GetAllLibraryInformation(int orgCode);
    Task<LibraryInformationResponse> GetLibraryInformation(int libraryInformationCode);
    Task<bool> SaveLibraryInformation(LibraryInformationRequest request);
    Task<bool> DeleteLibraryInformation(int libraryInformationCode);
    Task<IEnumerable<LibraryAttachmentResponse>> GetAllLibraryAttchment(int libraryInformationCode);
    Task<LibraryAttachmentResponse> GetLibraryAttachment(int libraryAttachmentCode);
    Task<bool> InsertLibraryAttachment(int libraryInformationCode, IFormFile file);
    Task<bool> DeleteLibraryAttachment(int libraryAttachmentCode);
}
