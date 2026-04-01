using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.DTOs;

namespace MyProject.API.Controllers;

[Route("api/[controller]")]
public sealed class PropertiesController(IBusinessLogic businessLogic) : ApiControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(businessLogic.Properties.GetAllSummaries());
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var result = businessLogic.Properties.GetById(id);
        return result.Succeeded ? Ok(result.Value) : FromFailure(result);
    }

    [HttpGet("owner")]
    public IActionResult GetByOwner([FromQuery] string email)
    {
        return Ok(businessLogic.Properties.GetByOwner(email));
    }

    [HttpPost]
    public IActionResult Create([FromBody] UpsertPropertyRequestDto request)
    {
        var result = businessLogic.Properties.Create(request);
        return result.Succeeded
            ? CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value)
            : FromFailure(result);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] UpsertPropertyRequestDto request)
    {
        var result = businessLogic.Properties.Update(id, request);
        return result.Succeeded ? Ok(result.Value) : FromFailure(result);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id, [FromQuery] string ownerEmail)
    {
        var result = businessLogic.Properties.Delete(id, ownerEmail);
        return result.Succeeded ? NoContent() : FromFailure(result);
    }
}
