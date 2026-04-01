using Microsoft.AspNetCore.Mvc;
using StayBooker.API.Models;
using StayBooker.BusinessLayer;
using StayBooker.BusinessLayer.DTOs.Properties;

namespace StayBooker.API.Controllers;

[ApiController]
[Route("api/properties")]
public sealed class PropertiesController : ControllerBase
{
    private readonly BusinessLogic _businessLogic;

    public PropertiesController(BusinessLogic businessLogic)
    {
        _businessLogic = businessLogic;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? ownerEmail)
    {
        var properties = await _businessLogic.Properties.GetAllAsync(ownerEmail);
        return Ok(properties);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var property = await _businessLogic.Properties.GetByIdAsync(id);
        return property is null ? NotFound(new ApiMessageResponse { Message = "Proprietatea nu a fost gasita." }) : Ok(property);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertManagedPropertyDto request)
    {
        var result = await _businessLogic.Properties.CreateAsync(request);
        if (!result.Success || result.Data is null)
        {
            return BadRequest(new ApiMessageResponse { Message = result.Error ?? "Crearea proprietatii a esuat." });
        }

        return Created($"/api/properties/{result.Data.Id}", result.Data);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertManagedPropertyDto request)
    {
        var result = await _businessLogic.Properties.UpdateAsync(id, request);
        if (!result.Success || result.Data is null)
        {
            if (string.Equals(result.Error, "Proprietatea nu a fost gasita.", StringComparison.Ordinal))
            {
                return NotFound(new ApiMessageResponse { Message = result.Error ?? "Proprietatea nu a fost gasita." });
            }

            return BadRequest(new ApiMessageResponse { Message = result.Error ?? "Actualizarea proprietatii a esuat." });
        }

        return Ok(result.Data);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, [FromQuery] string ownerEmail)
    {
        var deleted = await _businessLogic.Properties.DeleteAsync(id, ownerEmail);
        return deleted ? NoContent() : NotFound(new ApiMessageResponse { Message = "Proprietatea nu a fost gasita." });
    }
}
