using ECX.VisitorManagement.Application.DTOs.Report;

namespace ECX.VisitorManagement.Application.Interfaces;

public interface IReportService
{
    Task<VisitorReportDto> GetDailyReportAsync(DateTime date);
    Task<VisitorReportDto> GetDateRangeReportAsync(DateRangeRequest request);
    Task<IEnumerable<ReportVisitDetailDto>> GetVisitorHistoryAsync(Guid visitorId);
}
