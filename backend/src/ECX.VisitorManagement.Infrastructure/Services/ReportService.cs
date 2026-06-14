using AutoMapper;
using ECX.VisitorManagement.Application.DTOs.Report;
using ECX.VisitorManagement.Application.Interfaces;
using ECX.VisitorManagement.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ECX.VisitorManagement.Infrastructure.Services;

public class ReportService : IReportService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ReportService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<VisitorReportDto> GetDailyReportAsync(DateTime date)
    {
        var startOfDay = date.Date;
        var endOfDay = startOfDay.AddDays(1);

        return await GenerateReport(startOfDay, endOfDay);
    }

    public async Task<VisitorReportDto> GetDateRangeReportAsync(DateRangeRequest request)
    {
        var startDate = request.StartDate.Date;
        var endDate = request.EndDate.Date.AddDays(1);

        return await GenerateReport(startDate, endDate);
    }

    public async Task<IEnumerable<ReportVisitDetailDto>> GetVisitorHistoryAsync(Guid visitorId)
    {
        var visits = await _unitOfWork.Visits.GetQueryable()
            .Include(v => v.Visitor)
            .Include(v => v.Host).ThenInclude(h => h.User)
            .Include(v => v.Host).ThenInclude(h => h.Department)
            .Where(v => v.VisitorId == visitorId)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();

        return visits.Select(v => new ReportVisitDetailDto
        {
            VisitorName = $"{v.Visitor.FirstName} {v.Visitor.LastName}",
            HostName = v.Host.User.FullName,
            Department = v.Host.Department.Name,
            Purpose = v.Purpose,
            CheckInTime = v.CheckInTime,
            CheckOutTime = v.CheckOutTime,
            Status = v.Status.ToString()
        });
    }

    private async Task<VisitorReportDto> GenerateReport(DateTime startDate, DateTime endDate)
    {
        var visits = await _unitOfWork.Visits.GetQueryable()
            .Include(v => v.Visitor)
            .Include(v => v.Host).ThenInclude(h => h.User)
            .Include(v => v.Host).ThenInclude(h => h.Department)
            .Where(v => v.CreatedAt >= startDate && v.CreatedAt < endDate)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();

        return new VisitorReportDto
        {
            Date = startDate,
            TotalVisits = visits.Count,
            CheckedIn = visits.Count(v => v.Status == VisitStatus.CheckedIn),
            CheckedOut = visits.Count(v => v.Status == VisitStatus.CheckedOut),
            Cancelled = visits.Count(v => v.Status == VisitStatus.Cancelled),
            Visits = visits.Select(v => new ReportVisitDetailDto
            {
                VisitorName = $"{v.Visitor.FirstName} {v.Visitor.LastName}",
                HostName = v.Host.User.FullName,
                Department = v.Host.Department.Name,
                Purpose = v.Purpose,
                CheckInTime = v.CheckInTime,
                CheckOutTime = v.CheckOutTime,
                Status = v.Status.ToString()
            }).ToList()
        };
    }
}
