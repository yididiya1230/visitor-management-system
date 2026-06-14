using AutoMapper;
using ECX.VisitorManagement.Application.DTOs.Visitor;
using ECX.VisitorManagement.Application.Interfaces;
using ECX.VisitorManagement.Domain.Entities;

namespace ECX.VisitorManagement.Infrastructure.Services;

public class VisitorService : IVisitorService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public VisitorService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<VisitorDto>> GetAllAsync()
    {
        var visitors = await _unitOfWork.Visitors.GetAllAsync();
        return _mapper.Map<IEnumerable<VisitorDto>>(visitors);
    }

    public async Task<VisitorDto?> GetByIdAsync(Guid id)
    {
        var visitor = await _unitOfWork.Visitors.GetByIdAsync(id);
        return visitor == null ? null : _mapper.Map<VisitorDto>(visitor);
    }

    public async Task<VisitorDto> CreateAsync(CreateVisitorRequest request)
    {
        var visitor = _mapper.Map<Visitor>(request);
        visitor.Id = Guid.NewGuid();
        visitor.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Visitors.AddAsync(visitor);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<VisitorDto>(visitor);
    }

    public async Task<VisitorDto> UpdateAsync(Guid id, UpdateVisitorRequest request)
    {
        var visitor = await _unitOfWork.Visitors.GetByIdAsync(id);
        if (visitor == null)
            throw new KeyNotFoundException($"Visitor with ID {id} not found");

        _mapper.Map(request, visitor);
        visitor.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Visitors.Update(visitor);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<VisitorDto>(visitor);
    }

    public async Task DeleteAsync(Guid id)
    {
        var visitor = await _unitOfWork.Visitors.GetByIdAsync(id);
        if (visitor == null)
            throw new KeyNotFoundException($"Visitor with ID {id} not found");

        visitor.IsDeleted = true;
        visitor.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Visitors.Update(visitor);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<VisitorDto>> SearchAsync(string searchTerm)
    {
        var term = searchTerm.ToLower();
        var visitors = await _unitOfWork.Visitors
            .FindAsync(v =>
                v.FirstName.ToLower().Contains(term) ||
                v.LastName.ToLower().Contains(term) ||
                (v.Email != null && v.Email.ToLower().Contains(term)) ||
                v.PhoneNumber.Contains(term) ||
                (v.IdCardNumber != null && v.IdCardNumber.ToLower().Contains(term)) ||
                (v.Company != null && v.Company.ToLower().Contains(term)));

        return _mapper.Map<IEnumerable<VisitorDto>>(visitors);
    }
}
