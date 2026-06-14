namespace ECX.VisitorManagement.Domain.Entities;

public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public string? CreatedById { get; set; }
    public string? UpdatedById { get; set; }
}
