using DEEMPPORTAL.Domain.Support;

namespace DEEMPPORTAL.Application.Support;

public interface IUserSatisfactionRepository
{
  Task<bool> InsertAsync(UserSatisfactionRequest request);
}
