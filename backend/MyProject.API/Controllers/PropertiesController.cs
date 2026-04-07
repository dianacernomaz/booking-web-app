using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.DTOs;
using MyProject.BusinessLayer.Interfaces;

namespace MyProject.API.Controllers;

[Route("api/[controller]")]
public sealed class PropertiesController : ApiControllerBase
{
    private readonly IPropertyAction _propertyAction;

    public PropertiesController()
    {
        var bl = new BusinessLogic();
        _propertyAction = bl.PropertyAction();
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_propertyAction.GetAllSummariesAction());
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var result = _propertyAction.GetByIdAction(id);
        return result.Succeeded ? Ok(result.Value) : FromFailure(result);
    }

    [HttpGet("owner")]
    public IActionResult GetByOwner([FromQuery] string email)
    {
        return Ok(_propertyAction.GetByOwnerAction(email));
    }

    [HttpPost]
    public IActionResult Create([FromBody] UpsertPropertyRequestDto request)
    {
        var result = _propertyAction.CreateAction(request);
        return result.Succeeded
            ? CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value)
            : FromFailure(result);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] UpsertPropertyRequestDto request)
    {
        var result = _propertyAction.UpdateAction(id, request);
        return result.Succeeded ? Ok(result.Value) : FromFailure(result);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id, [FromQuery] string ownerEmail)
    {
        var result = _propertyAction.DeleteAction(id, ownerEmail);
        return result.Succeeded ? NoContent() : FromFailure(result);
    }
}
