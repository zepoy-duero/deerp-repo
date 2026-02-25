using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Library;
using Microsoft.AspNetCore.Http;

namespace DEEMPPORTAL.Application.Library.Logo;

public class LogoService(ILogoRepository logoRepository) : ILogoService
{
    private readonly ILogoRepository _logoRepository = logoRepository;

    public async Task<bool> DeleteLibraryInformation(int libraryInformationCode)
    {
        return await _logoRepository.DeleteLibraryInformation(libraryInformationCode);
    }

    public async Task<IEnumerable<LibraryInformationResponse>> GetAllLibraryInformation(int orgCode)
    {
        return await _logoRepository.GetAllLibraryInformation(orgCode);
    }

    public async Task<LibraryInformationResponse> GetLibraryInformation(int libraryInformationCode)
    {
        return await _logoRepository.GetLibraryInformation(libraryInformationCode);
    }

    public async Task<bool> SaveLibraryInformation(LibraryInformationRequest request)
    {
        var dt = ListToDataTableConverter.ToDataTable(request);
        return await _logoRepository.SaveLibraryInformation(dt);
    }

    public async Task<IEnumerable<LibraryAttachmentResponse>> GetAllLibraryAttchment(int libraryInformationCode)
    {
        return await _logoRepository.GetAllLibraryAttchment(libraryInformationCode);
    }

    public async Task<bool> DeleteLibraryAttachment(int libraryInformationCode)
    {
        return await _logoRepository.DeleteLibraryAttachment(libraryInformationCode);
    }

    public async Task<bool> InsertLibraryAttachment(int libraryInformationCode, IFormFile file)
    {
        var fileBytes = Array.Empty<byte>();
        var fileName = string.Empty;
        var fileExtension = string.Empty;

        if (file != null && file.Length > 0)
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            fileBytes = ms.ToArray();
            fileName = Path.GetFileNameWithoutExtension(file.FileName);
            fileExtension = Path.GetExtension(file.FileName);
        }

        var dataList = ListToDataTableConverter.ToDataTable(new LibraryAttachmentRequest
        {
            LIBRARY_ATTACHMENT_CODE = 0,
            LIBRARY_INFORMATION_CODE = libraryInformationCode,
            FILE_NAME = fileName,
            FILE_ATTACHMENT = fileBytes,
            FILE_EXTENSION = fileExtension
        });

        return await _logoRepository.InsertLibraryAttachment(dataList);
    }

    public async Task<LibraryAttachmentResponse> GetLibraryAttachment(int libraryAttachmentCode)
    {
        return await _logoRepository.GetLibraryAttachment(libraryAttachmentCode);
    }
}
