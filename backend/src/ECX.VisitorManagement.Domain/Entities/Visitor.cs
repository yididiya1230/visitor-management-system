namespace ECX.VisitorManagement.Domain.Entities;

public class Visitor : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? PhotoUrl { get; set; }
    public string? IdCardNumber { get; set; }
    public string? Address { get; set; }

    public ICollection<Visit> Visits { get; set; } = new List<Visit>();
}
