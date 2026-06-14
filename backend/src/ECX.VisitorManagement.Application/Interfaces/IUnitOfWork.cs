namespace ECX.VisitorManagement.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<Domain.Entities.Role> Roles { get; }
    IGenericRepository<Domain.Entities.User> Users { get; }
    IGenericRepository<Domain.Entities.Visitor> Visitors { get; }
    IGenericRepository<Domain.Entities.Host> Hosts { get; }
    IGenericRepository<Domain.Entities.Department> Departments { get; }
    IGenericRepository<Domain.Entities.Visit> Visits { get; }
    IGenericRepository<Domain.Entities.AuditLog> AuditLogs { get; }

    Task<int> SaveChangesAsync();
}
