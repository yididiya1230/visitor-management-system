using ECX.VisitorManagement.Application.DTOs.Visitor;
using ECX.VisitorManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECX.VisitorManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VisitorsController : ControllerBase
{
    private readonly IVisitorService _visitorService;

    public VisitorsController(IVisitorService visitorService)
    {
        _visitorService = visitorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var visitors = await _visitorService.GetAllAsync();
        return Ok(visitors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var visitor = await _visitorService.GetByIdAsync(id);
        if (visitor == null)
            return NotFound(new { message = $"Visitor with ID {id} not found" });
        return Ok(visitor);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string term)
    {
        var visitors = await _visitorService.SearchAsync(term);
        return Ok(visitors);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Receptionist")]
    public async Task<IActionResult> Create([FromBody] CreateVisitorRequest request)
    {
        var visitor = await _visitorService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = visitor.Id }, visitor);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Receptionist")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVisitorRequest request)
    {
        var visitor = await _visitorService.UpdateAsync(id, request);
        return Ok(visitor);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _visitorService.DeleteAsync(id);
        return NoContent();
    }
}
