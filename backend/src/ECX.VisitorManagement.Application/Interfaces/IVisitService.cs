using ECX.VisitorManagement.Application.DTOs.Visit;

namespace ECX.VisitorManagement.Application.Interfaces;

public interface IVisitService
{
    Task<IEnumerable<VisitDto>> GetAllAsync();
    Task<VisitDto?> GetByIdAsync(Guid id);
    Task<VisitDto> CreateAsync(CreateVisitRequest request, Guid checkedInByUserId);
    Task<VisitDto> CheckInAsync(Guid visitId, Guid userId);
    Task<VisitDto> CheckOutAsync(Guid visitId, Guid userId, string? notes = null);
    Task<IEnumerable<VisitDto>> GetVisitsByVisitorAsync(Guid visitorId);
    Task<IEnumerable<VisitDto>> GetVisitsByHostAsync(Guid hostId);
    Task<IEnumerable<VisitDto>> GetActiveVisitsAsync();
    Task CancelVisitAsync(Guid visitId);
}
