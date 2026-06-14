namespace ECX.VisitorManagement.Application.DTOs.Dashboard;

public class DashboardDto
{
    public int TotalVisitors { get; set; }
    public int ActiveVisitors { get; set; }
    public int CheckedOutToday { get; set; }
    public int TotalHosts { get; set; }
    public int TodayVisits { get; set; }
    public int PendingVisits { get; set; }
    public List<RecentVisitDto> RecentVisits { get; set; } = new();
}

public class RecentVisitDto
{
    public Guid Id { get; set; }
    public string VisitorName { get; set; } = string.Empty;
    public string HostName { get; set; } = string.Empty;
    public string Purpose { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
}
