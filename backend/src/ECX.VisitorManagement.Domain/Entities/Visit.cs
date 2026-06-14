using ECX.VisitorManagement.Domain.Enums;

namespace ECX.VisitorManagement.Domain.Entities;

public class Visit : BaseEntity
{
    public string Purpose { get; set; } = string.Empty;
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public VisitStatus Status { get; set; } = VisitStatus.Pending;
    public string? Notes { get; set; }
    public string? BadgeCode { get; set; }

    public Guid VisitorId { get; set; }
    public Visitor Visitor { get; set; } = null!;

    public Guid HostId { get; set; }
    public Host Host { get; set; } = null!;

    public Guid? CheckedInById { get; set; }
    public Guid? CheckedOutById { get; set; }
}
