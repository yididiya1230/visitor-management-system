using AutoMapper;
using ECX.VisitorManagement.Application.DTOs.Department;
using ECX.VisitorManagement.Application.Interfaces;
using ECX.VisitorManagement.Domain.Entities;

namespace ECX.VisitorManagement.Infrastructure.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DepartmentService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
    {
        var departments = await _unitOfWork.Departments.GetAllAsync();
        return _mapper.Map<IEnumerable<DepartmentDto>>(departments);
    }

    public async Task<DepartmentDto?> GetByIdAsync(Guid id)
    {
        var department = await _unitOfWork.Departments.GetByIdAsync(id);
        return department == null ? null : _mapper.Map<DepartmentDto>(department);
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentRequest request)
    {
        var department = _mapper.Map<Department>(request);
        department.Id = Guid.NewGuid();
        department.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Departments.AddAsync(department);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task<DepartmentDto> UpdateAsync(Guid id, UpdateDepartmentRequest request)
    {
        var department = await _unitOfWork.Departments.GetByIdAsync(id);
        if (department == null)
            throw new KeyNotFoundException($"Department with ID {id} not found");

        _mapper.Map(request, department);
        department.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Departments.Update(department);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task DeleteAsync(Guid id)
    {
        var department = await _unitOfWork.Departments.GetByIdAsync(id);
        if (department == null)
            throw new KeyNotFoundException($"Department with ID {id} not found");

        department.IsDeleted = true;
        department.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Departments.Update(department);
        await _unitOfWork.SaveChangesAsync();
    }
}
