namespace DEEMPPORTAL.Domain.Account;

public class ResetPasswordRequest
{
    public string NEW_PASSWORD { get; set; } = string.Empty;
    public string RESET_TOKEN { get; set; } = string.Empty;
    public string HASHED_PASSWORD => Security.Encrypt(NEW_PASSWORD).Result;
}
