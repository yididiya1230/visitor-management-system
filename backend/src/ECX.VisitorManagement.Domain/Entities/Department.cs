namespace ECX.VisitorManagement.Domain.Entities;

public class Department : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<Host> Hosts { get; set; } = new List<Host>();
}
