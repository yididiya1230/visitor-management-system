using ECX.VisitorManagement.Application.DTOs.Host;

namespace ECX.VisitorManagement.Application.Interfaces;

public interface IHostService
{
    Task<IEnumerable<HostDto>> GetAllAsync();
    Task<HostDto?> GetByIdAsync(Guid id);
    Task<HostDto> CreateAsync(CreateHostRequest request);
    Task<HostDto> UpdateAsync(Guid id, UpdateHostRequest request);
    Task DeleteAsync(Guid id);
}
