using DEEMPPORTAL.Domain.Support;

namespace DEEMPPORTAL.Application.Support;

public interface IUserSatisfactionService
{
  Task<bool> InsertAsync(UserSatisfactionRequest request, int recordId);
  Task SendEmailAsync(UserSatisfactionRequest request, int recordId);
  Task<string> GetUserSatisfactionEmailContent(UserSatisfactionRequest request, int recordId);
}
