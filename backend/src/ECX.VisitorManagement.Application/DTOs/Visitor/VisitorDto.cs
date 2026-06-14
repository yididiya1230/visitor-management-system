namespace ECX.VisitorManagement.Application.DTOs.Visitor;

public class VisitorDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? PhotoUrl { get; set; }
    public string? IdCardNumber { get; set; }
    public string? Address { get; set; }
    public DateTime CreatedAt { get; set; }
    public string FullName => $"{FirstName} {LastName}";
}

public class CreateVisitorRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? IdCardNumber { get; set; }
    public string? Address { get; set; }
}

public class UpdateVisitorRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? IdCardNumber { get; set; }
    public string? Address { get; set; }
}
