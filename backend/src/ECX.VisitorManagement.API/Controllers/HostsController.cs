using ECX.VisitorManagement.Application.DTOs.Host;
using ECX.VisitorManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECX.VisitorManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class HostsController : ControllerBase
{
    private readonly IHostService _hostService;

    public HostsController(IHostService hostService)
    {
        _hostService = hostService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var hosts = await _hostService.GetAllAsync();
        return Ok(hosts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var host = await _hostService.GetByIdAsync(id);
        if (host == null)
            return NotFound(new { message = $"Host with ID {id} not found" });
        return Ok(host);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHostRequest request)
    {
        var host = await _hostService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = host.Id }, host);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateHostRequest request)
    {
        var host = await _hostService.UpdateAsync(id, request);
        return Ok(host);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _hostService.DeleteAsync(id);
        return NoContent();
    }
}
