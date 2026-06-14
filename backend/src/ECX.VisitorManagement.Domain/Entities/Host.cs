namespace ECX.VisitorManagement.Domain.Entities;

public class Host : BaseEntity
{
    public string EmployeeCode { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid DepartmentId { get; set; }
    public Department Department { get; set; } = null!;

    public ICollection<Visit> Visits { get; set; } = new List<Visit>();
}
