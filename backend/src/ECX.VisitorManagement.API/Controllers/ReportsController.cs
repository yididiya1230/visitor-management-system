using ECX.VisitorManagement.Application.DTOs.Report;
using ECX.VisitorManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECX.VisitorManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("daily")]
    public async Task<IActionResult> GetDailyReport([FromQuery] DateTime? date)
    {
        var reportDate = date ?? DateTime.UtcNow;
        var report = await _reportService.GetDailyReportAsync(reportDate);
        return Ok(report);
    }

    [HttpPost("date-range")]
    public async Task<IActionResult> GetDateRangeReport([FromBody] DateRangeRequest request)
    {
        var report = await _reportService.GetDateRangeReportAsync(request);
        return Ok(report);
    }

    [HttpGet("visitor-history/{visitorId}")]
    public async Task<IActionResult> GetVisitorHistory(Guid visitorId)
    {
        var history = await _reportService.GetVisitorHistoryAsync(visitorId);
        return Ok(history);
    }
}
