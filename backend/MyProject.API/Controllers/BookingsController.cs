using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.DTOs;

namespace MyProject.API.Controllers;

[Route("api/[controller]")]
public sealed class BookingsController(IBusinessLogic businessLogic) : ApiControllerBase
{
    [HttpGet("owner")]
    public IActionResult GetByOwner([FromQuery] string email)
    {
        return Ok(businessLogic.Bookings.GetByOwner(email));
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateBookingRequestDto request)
    {
        var result = businessLogic.Bookings.Create(request);
        return result.Succeeded ? Created(string.Empty, result.Value) : FromFailure(result);
    }

    [HttpPatch("{id}/cancel")]
    public IActionResult Cancel(string id, [FromQuery] string ownerEmail)
    {
        var result = businessLogic.Bookings.Cancel(id, ownerEmail);
        return result.Succeeded ? NoContent() : FromFailure(result);
    }
}
