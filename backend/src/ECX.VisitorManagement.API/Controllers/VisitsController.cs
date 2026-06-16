using System.Security.Claims;
using ECX.VisitorManagement.Application.DTOs.Visit;
using ECX.VisitorManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECX.VisitorManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VisitsController : ControllerBase
{
    private readonly IVisitService _visitService;

    public VisitsController(IVisitService visitService)
    {
        _visitService = visitService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var visits = await _visitService.GetAllAsync();
        return Ok(visits);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var visit = await _visitService.GetByIdAsync(id);
        if (visit == null)
            return NotFound(new { message = $"Visit with ID {id} not found" });
        return Ok(visit);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var visits = await _visitService.GetActiveVisitsAsync();
        return Ok(visits);
    }

    [HttpGet("by-visitor/{visitorId}")]
    public async Task<IActionResult> GetByVisitor(Guid visitorId)
    {
        var visits = await _visitService.GetVisitsByVisitorAsync(visitorId);
        return Ok(visits);
    }

    [HttpGet("by-host/{hostId}")]
    public async Task<IActionResult> GetByHost(Guid hostId)
    {
        var visits = await _visitService.GetVisitsByHostAsync(hostId);
        return Ok(visits);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Receptionist")]
    public async Task<IActionResult> Create([FromBody] CreateVisitRequest request)
    {
        var userId = GetCurrentUserId();
        var visit = await _visitService.CreateAsync(request, userId);
        return CreatedAtAction(nameof(GetById), new { id = visit.Id }, visit);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Receptionist")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVisitRequest request)
    {
        var visit = await _visitService.UpdateAsync(id, request);
        return Ok(visit);
    }

    [HttpPost("{id}/check-in")]
    [Authorize(Roles = "Admin,Receptionist")]
    public async Task<IActionResult> CheckIn(Guid id)
    {
        var userId = GetCurrentUserId();
        var visit = await _visitService.CheckInAsync(id, userId);
        return Ok(visit);
    }

    [HttpPost("{id}/check-out")]
    [Authorize(Roles = "Admin,Receptionist")]
    public async Task<IActionResult> CheckOut(Guid id, [FromBody] CheckOutRequest? request)
    {
        var userId = GetCurrentUserId();
        var visit = await _visitService.CheckOutAsync(id, userId, request?.Notes);
        return Ok(visit);
    }

    [HttpPost("{id}/cancel")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        await _visitService.CancelVisitAsync(id);
        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        return Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }
}
