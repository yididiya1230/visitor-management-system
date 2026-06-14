using ECX.VisitorManagement.Application.DTOs.Visitor;

namespace ECX.VisitorManagement.Application.Interfaces;

public interface IVisitorService
{
    Task<IEnumerable<VisitorDto>> GetAllAsync();
    Task<VisitorDto?> GetByIdAsync(Guid id);
    Task<VisitorDto> CreateAsync(CreateVisitorRequest request);
    Task<VisitorDto> UpdateAsync(Guid id, UpdateVisitorRequest request);
    Task DeleteAsync(Guid id);
    Task<IEnumerable<VisitorDto>> SearchAsync(string searchTerm);
}
