namespace ECX.VisitorManagement.Application.DTOs.Report;

public class VisitorReportDto
{
    public DateTime Date { get; set; }
    public int TotalVisits { get; set; }
    public int CheckedIn { get; set; }
    public int CheckedOut { get; set; }
    public int Cancelled { get; set; }
    public List<ReportVisitDetailDto> Visits { get; set; } = new();
}

public class ReportVisitDetailDto
{
    public string VisitorName { get; set; } = string.Empty;
    public string HostName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Purpose { get; set; } = string.Empty;
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class DateRangeRequest
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
