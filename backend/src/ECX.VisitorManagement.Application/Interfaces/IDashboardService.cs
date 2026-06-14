using ECX.VisitorManagement.Application.DTOs.Dashboard;

namespace ECX.VisitorManagement.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardDataAsync();
}
