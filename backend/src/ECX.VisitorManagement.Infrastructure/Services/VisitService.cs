using AutoMapper;
using ECX.VisitorManagement.Application.DTOs.Visit;
using ECX.VisitorManagement.Application.Interfaces;
using ECX.VisitorManagement.Domain.Entities;
using ECX.VisitorManagement.Domain.Enums;

namespace ECX.VisitorManagement.Infrastructure.Services;

public class VisitService : IVisitService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public VisitService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<VisitDto>> GetAllAsync()
    {
        var visits = await _unitOfWork.Visits.GetAllAsync();
        return _mapper.Map<IEnumerable<VisitDto>>(visits);
    }

    public async Task<VisitDto?> GetByIdAsync(Guid id)
    {
        var visit = await _unitOfWork.Visits.GetByIdAsync(id);
        return visit == null ? null : _mapper.Map<VisitDto>(visit);
    }

    public async Task<VisitDto> CreateAsync(CreateVisitRequest request, Guid checkedInByUserId)
    {
        var visit = new Visit
        {
            Id = Guid.NewGuid(),
            VisitorId = request.VisitorId,
            HostId = request.HostId,
            Purpose = request.Purpose,
            Notes = request.Notes,
            Status = VisitStatus.Pending,
            CheckedInById = checkedInByUserId,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Visits.AddAsync(visit);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<VisitDto>(visit);
    }

    public async Task<VisitDto> UpdateAsync(Guid id, UpdateVisitRequest request)
    {
        var visit = await _unitOfWork.Visits.GetByIdAsync(id);
        if (visit == null)
            throw new KeyNotFoundException($"Visit with ID {id} not found");

        if (visit.Status != VisitStatus.Pending)
            throw new InvalidOperationException("Cannot edit a visit that is not in Pending status");

        visit.VisitorId = request.VisitorId;
        visit.HostId = request.HostId;
        visit.Purpose = request.Purpose;
        visit.Notes = request.Notes;
        visit.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Visits.Update(visit);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<VisitDto>(visit);
    }

    public async Task<VisitDto> CheckInAsync(Guid visitId, Guid userId)
    {
        var visit = await _unitOfWork.Visits.GetByIdAsync(visitId);
        if (visit == null)
            throw new KeyNotFoundException($"Visit with ID {visitId} not found");

        if (visit.Status != VisitStatus.Pending)
            throw new InvalidOperationException($"Cannot check in. Current status: {visit.Status}");

        visit.Status = VisitStatus.CheckedIn;
        visit.CheckInTime = DateTime.UtcNow;
        visit.CheckedInById = userId;
        visit.BadgeCode = GenerateBadgeCode();
        visit.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Visits.Update(visit);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<VisitDto>(visit);
    }

    public async Task<VisitDto> CheckOutAsync(Guid visitId, Guid userId, string? notes = null)
    {
        var visit = await _unitOfWork.Visits.GetByIdAsync(visitId);
        if (visit == null)
            throw new KeyNotFoundException($"Visit with ID {visitId} not found");

        if (visit.Status != VisitStatus.CheckedIn)
            throw new InvalidOperationException($"Cannot check out. Current status: {visit.Status}");

        visit.Status = VisitStatus.CheckedOut;
        visit.CheckOutTime = DateTime.UtcNow;
        visit.CheckedOutById = userId;
        visit.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrEmpty(notes))
            visit.Notes = notes;

        _unitOfWork.Visits.Update(visit);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<VisitDto>(visit);
    }

    public async Task<IEnumerable<VisitDto>> GetVisitsByVisitorAsync(Guid visitorId)
    {
        var visits = await _unitOfWork.Visits
            .FindAsync(v => v.VisitorId == visitorId);
        return _mapper.Map<IEnumerable<VisitDto>>(visits.OrderByDescending(v => v.CreatedAt));
    }

    public async Task<IEnumerable<VisitDto>> GetVisitsByHostAsync(Guid hostId)
    {
        var visits = await _unitOfWork.Visits
            .FindAsync(v => v.HostId == hostId);
        return _mapper.Map<IEnumerable<VisitDto>>(visits.OrderByDescending(v => v.CreatedAt));
    }

    public async Task<IEnumerable<VisitDto>> GetActiveVisitsAsync()
    {
        var visits = await _unitOfWork.Visits
            .FindAsync(v => v.Status == VisitStatus.CheckedIn);
        return _mapper.Map<IEnumerable<VisitDto>>(visits);
    }

    public async Task CancelVisitAsync(Guid visitId)
    {
        var visit = await _unitOfWork.Visits.GetByIdAsync(visitId);
        if (visit == null)
            throw new KeyNotFoundException($"Visit with ID {visitId} not found");

        if (visit.Status == VisitStatus.CheckedOut)
            throw new InvalidOperationException("Cannot cancel a completed visit");

        visit.Status = VisitStatus.Cancelled;
        visit.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Visits.Update(visit);
        await _unitOfWork.SaveChangesAsync();
    }

    private static string GenerateBadgeCode()
    {
        return $"VMS-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
    }
}
