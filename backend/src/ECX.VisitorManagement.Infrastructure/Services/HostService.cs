using AutoMapper;
using ECX.VisitorManagement.Application.DTOs.Host;
using ECX.VisitorManagement.Application.Interfaces;
using ECX.VisitorManagement.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ECX.VisitorManagement.Infrastructure.Services;

public class HostService : IHostService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _passwordHasher;

    public HostService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<IEnumerable<HostDto>> GetAllAsync()
    {
        var hosts = await _unitOfWork.Hosts.GetAllAsync();
        return _mapper.Map<IEnumerable<HostDto>>(hosts);
    }

    public async Task<HostDto?> GetByIdAsync(Guid id)
    {
        var host = await _unitOfWork.Hosts.GetByIdAsync(id);
        return host == null ? null : _mapper.Map<HostDto>(host);
    }

    public async Task<HostDto> CreateAsync(CreateHostRequest request)
    {
        var role = await _unitOfWork.Roles
            .FindSingleAsync(r => r.Name == "Host");
        if (role == null)
            throw new InvalidOperationException("Host role not found");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            FullName = request.FullName,
            PhoneNumber = request.PhoneNumber,
            IsActive = true,
            RoleId = role.Id,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        var host = new Host
        {
            Id = Guid.NewGuid(),
            EmployeeCode = request.EmployeeCode,
            JobTitle = request.JobTitle,
            UserId = user.Id,
            DepartmentId = request.DepartmentId,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.Hosts.AddAsync(host);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<HostDto>(host);
    }

    public async Task<HostDto> UpdateAsync(Guid id, UpdateHostRequest request)
    {
        var host = await _unitOfWork.Hosts.GetByIdAsync(id);
        if (host == null)
            throw new KeyNotFoundException($"Host with ID {id} not found");

        host.EmployeeCode = request.EmployeeCode;
        host.JobTitle = request.JobTitle;
        host.DepartmentId = request.DepartmentId;
        host.UpdatedAt = DateTime.UtcNow;

        var user = await _unitOfWork.Users.GetByIdAsync(host.UserId);
        if (user != null)
        {
            user.FullName = request.FullName;
            user.PhoneNumber = request.PhoneNumber;
            user.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.Users.Update(user);
        }

        _unitOfWork.Hosts.Update(host);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<HostDto>(host);
    }

    public async Task DeleteAsync(Guid id)
    {
        var host = await _unitOfWork.Hosts.GetByIdAsync(id);
        if (host == null)
            throw new KeyNotFoundException($"Host with ID {id} not found");

        host.IsDeleted = true;
        host.UpdatedAt = DateTime.UtcNow;

        var user = await _unitOfWork.Users.GetByIdAsync(host.UserId);
        if (user != null)
        {
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.Users.Update(user);
        }

        _unitOfWork.Hosts.Update(host);
        await _unitOfWork.SaveChangesAsync();
    }
}
