using ECX.VisitorManagement.Domain.Enums;

namespace ECX.VisitorManagement.Application.DTOs.Visit;

public class VisitDto
{
    public Guid Id { get; set; }
    public string VisitorName { get; set; } = string.Empty;
    public string HostName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string Purpose { get; set; } = string.Empty;
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? BadgeCode { get; set; }
    public string? Notes { get; set; }
    public Guid VisitorId { get; set; }
    public Guid HostId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateVisitRequest
{
    public Guid VisitorId { get; set; }
    public Guid HostId { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class CheckInRequest
{
    public Guid VisitId { get; set; }
}

public class CheckOutRequest
{
    public Guid VisitId { get; set; }
    public string? Notes { get; set; }
}

public class UpdateVisitRequest
{
    public Guid VisitorId { get; set; }
    public Guid HostId { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
