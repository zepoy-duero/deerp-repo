using DEEMPPORTAL.Domain.Support;

namespace DEEMPPORTAL.Application.Support.SpeedDialDirectoryService
{
    public interface ISpeedDialDirectoryService
    {
        Task<IEnumerable<SpeedDialDirectoryResponse>>
            GetAllSpeedDialDirectoryAsync(
                int orgCode,
                int locCode,
                string searchString
                
            );
    }
}