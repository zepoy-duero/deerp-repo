namespace DEEMPPORTAL.Domain.Library;

public class LibraryAttachmentRequest
{
    public int LIBRARY_ATTACHMENT_CODE { get; set; }
    public int LIBRARY_INFORMATION_CODE { get; set; }
    public string? FILE_NAME { get; set; }
    public byte[]? FILE_ATTACHMENT { get; set; }
    public string? FILE_EXTENSION { get; set; }
}
