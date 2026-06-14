using AutoMapper;
using ECX.VisitorManagement.Application.DTOs.Dashboard;
using ECX.VisitorManagement.Application.Interfaces;
using ECX.VisitorManagement.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ECX.VisitorManagement.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DashboardService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<DashboardDto> GetDashboardDataAsync()
    {
        var today = DateTime.UtcNow.Date;
        var allVisits = _unitOfWork.Visits.GetQueryable()
            .Include(v => v.Visitor)
            .Include(v => v.Host).ThenInclude(h => h.User)
            .Include(v => v.Host).ThenInclude(h => h.Department);

        var todayVisits = await allVisits
            .Where(v => v.CreatedAt >= today)
            .ToListAsync();

        var activeVisits = await allVisits
            .Where(v => v.Status == VisitStatus.CheckedIn)
            .ToListAsync();

        var checkedOutToday = await allVisits
            .Where(v => v.Status == VisitStatus.CheckedOut && v.CheckOutTime >= today)
            .ToListAsync();

        var totalHosts = await _unitOfWork.Hosts.CountAsync();
        var totalVisitors = await _unitOfWork.Visitors.CountAsync();

        var recentVisits = await allVisits
            .OrderByDescending(v => v.CreatedAt)
            .Take(10)
            .ToListAsync();

        return new DashboardDto
        {
            TotalVisitors = totalVisitors,
            ActiveVisitors = activeVisits.Count,
            CheckedOutToday = checkedOutToday.Count,
            TotalHosts = totalHosts,
            TodayVisits = todayVisits.Count,
            PendingVisits = todayVisits.Count(v => v.Status == VisitStatus.Pending),
            RecentVisits = _mapper.Map<List<RecentVisitDto>>(recentVisits)
        };
    }
}
