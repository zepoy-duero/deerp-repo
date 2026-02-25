using AutoMapper;
using DEEMPPORTAL.Application.Library.Form;
using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Domain.Library;
using DEEMPPORTAL.WebUI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace DEEMPPORTAL.WebUI.Controllers.Library;

[Authorize]
[Route("library/form")]
public class FormController(
  IMapper mapper,
  ISelectOptionsService selectOptionsService,
  IFormService formService) : BaseController
{
  private readonly ISelectOptionsService _selectOptionsService = selectOptionsService;
  private readonly IFormService _formService = formService;
  private readonly IMapper _mapper = mapper;

  public IActionResult Index() => View();

  [Authorize]
  [HttpGet("getAllOrganizations")]
  public async Task<IActionResult> GetAllOrganization()
  {
    var options = await _selectOptionsService.GetAllOrganizationAsync();

    return Ok(options);
  }

  [Authorize]
  [HttpGet("getAllLibraryInformation")]
  public async Task<IActionResult> GetAllLibraryInformation(int orgCode)
  {
    var results = await _formService.GetAllLibraryInformation(orgCode);

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getLibraryInformation")]
  public async Task<IActionResult> GetLibraryInformation(int libraryInformationCode)
  {
    var results = await _formService.GetLibraryInformation(libraryInformationCode);

    return Ok(results);
  }

  [Authorize]
  [HttpPost("updSertLibraryInformation")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> UpdSertLibraryInformation([FromForm] LibraryInformationDetailViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);

    var mapped = _mapper.Map<LibraryInformationRequest>(model);

    if (!await _formService.SaveLibraryInformation(mapped))
      return BadRequest(new
      {
        isSuccess = false,
        message = "Failed to save library information. Please try again."
      });

    return Ok(new
    {
      isSuccess = true,
      message = "Form library saved successfully."
    });
  }

  [Authorize]
  [HttpPost("deleteLibraryInformation")]
  public async Task<IActionResult> DeleteLibraryInformation(int libraryInformationCode)
  {
    if (!await _formService.DeleteLibraryInformation(libraryInformationCode))
      return BadRequest(new
      {
        isSuccess = false,
        message = "Failed to delete library information. Please try again."
      });

    return Ok(new
    {
      isSuccess = true,
      message = "Successfully deleted the library information."
    });
  }

  [Authorize]
  [HttpGet("getAllLibraryAttachments")]
  public async Task<IActionResult> GetAllLibraryAttachment(int libraryInformationCode)
  {
    var results = await _formService.GetAllLibraryAttchment(libraryInformationCode);

    return Ok(results);
  }

  [Authorize]
  [HttpGet("getLibraryAttachment")]
  public async Task<IActionResult> GetLibraryAttachment(int libraryInformationCode)
  {
    var results = await _formService.GetLibraryAttachment(libraryInformationCode);

    return Ok(results);
  }

  [Authorize]
  [HttpPost("insertLibraryAttachments")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> InsertLibraryAttachments([FromForm] LibraryAttachmentViewModel model)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);

    if (!await _formService.InsertLibraryAttachment(model.LIBRARY_INFORMATION_CODE, model.FILE_ATTACHMENT))
      return BadRequest(new
      {
        isSuccess = false,
        message = "Failed to upload library attachment. Please try again."
      });

    return Ok(new
    {
      isSuccess = true,
      message = "Successfully created a new attachment."
    });
  }

  [Authorize]
  [HttpPost("deleteLibraryAttachment")]
  public async Task<IActionResult> DeleteLibraryAttachment(int libraryAttachmentCode)
  {
    if (!await _formService.DeleteLibraryAttachment(libraryAttachmentCode))
      return BadRequest(new
      {
        isSuccess = false,
        message = "Failed to delete attachment. Please try again."
      });

    return Ok(new
    {
      isSuccess = true,
      message = "Successfully deleted the attachment."
    });
  }

  [Authorize]
  [HttpGet("downloadAttachment")]
  public async Task<IActionResult> DownloadAttachment(int libraryAttachmentCode)
  {
    var file = await _formService.GetLibraryAttachment(libraryAttachmentCode);

    if (file == null) return NotFound("Attachment not found.");

    var provider = new FileExtensionContentTypeProvider();
    string fileContentType;

    if (!provider.TryGetContentType(file.FILE_NAME + file.FILE_EXTENSION, out fileContentType))
    {
      fileContentType = "application/octet-stream";
    }

    return File(
        file.FILE_ATTACHMENT,                         // byte[]
        fileContentType,                              // MIME type
        file.FILE_NAME + file.FILE_EXTENSION          // download filename
    );
  }
}
