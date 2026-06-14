using ECX.VisitorManagement.Application.Interfaces;
using ECX.VisitorManagement.Domain.Entities;
using ECX.VisitorManagement.Infrastructure.Data;

namespace ECX.VisitorManagement.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IGenericRepository<Role>? _roles;
    private IGenericRepository<User>? _users;
    private IGenericRepository<Visitor>? _visitors;
    private IGenericRepository<Host>? _hosts;
    private IGenericRepository<Department>? _departments;
    private IGenericRepository<Visit>? _visits;
    private IGenericRepository<AuditLog>? _auditLogs;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IGenericRepository<Role> Roles =>
        _roles ??= new GenericRepository<Role>(_context);

    public IGenericRepository<User> Users =>
        _users ??= new GenericRepository<User>(_context);

    public IGenericRepository<Visitor> Visitors =>
        _visitors ??= new GenericRepository<Visitor>(_context);

    public IGenericRepository<Host> Hosts =>
        _hosts ??= new GenericRepository<Host>(_context);

    public IGenericRepository<Department> Departments =>
        _departments ??= new GenericRepository<Department>(_context);

    public IGenericRepository<Visit> Visits =>
        _visits ??= new GenericRepository<Visit>(_context);

    public IGenericRepository<AuditLog> AuditLogs =>
        _auditLogs ??= new GenericRepository<AuditLog>(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
