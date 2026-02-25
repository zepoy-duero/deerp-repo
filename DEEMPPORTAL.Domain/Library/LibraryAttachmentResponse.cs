namespace DEEMPPORTAL.Domain.Library;

public class LibraryAttachmentResponse
{
    public int LIBRARY_ATTACHMENT_CODE { get; set; }
    public string? FILE_NAME { get; set; }
    public byte[]? FILE_ATTACHMENT { get; set; }
    public string? FILE_EXTENSION { get; set; }
}
