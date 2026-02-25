using DEEMPPORTAL.Domain.Support;

namespace DEEMPPORTAL.Application.Support.SpeedDialDirectoryService
{
    public class SpeedDialDirectoryService : ISpeedDialDirectoryService
    {
        private readonly ISpeedDialDirectoryRepository _repository;

        public SpeedDialDirectoryService(
            ISpeedDialDirectoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<SpeedDialDirectoryResponse>>
            GetAllSpeedDialDirectoryAsync(
                int orgCode,
                int locCode,
                string searchString)
        {
            return await _repository
                .GetAllSpeedDialDirectoryAsync(
                    orgCode,
                    locCode,
                    searchString);
        }
    }
}
