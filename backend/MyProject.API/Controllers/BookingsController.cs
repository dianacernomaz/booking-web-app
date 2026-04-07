using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.DTOs;
using MyProject.BusinessLayer.Interfaces;

namespace MyProject.API.Controllers;

[Route("api/[controller]")]
public sealed class BookingsController : ApiControllerBase
{
    private readonly IBookingAction _bookingAction;

    public BookingsController()
    {
        var bl = new BusinessLogic();
        _bookingAction = bl.BookingAction();
    }

    [HttpGet("owner")]
    public IActionResult GetByOwner([FromQuery] string email)
    {
        return Ok(_bookingAction.GetByOwnerAction(email));
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateBookingRequestDto request)
    {
        var result = _bookingAction.CreateAction(request);
        return result.Succeeded ? Created(string.Empty, result.Value) : FromFailure(result);
    }

    [HttpPatch("{id}/cancel")]
    public IActionResult Cancel(string id, [FromQuery] string ownerEmail)
    {
        var result = _bookingAction.CancelAction(id, ownerEmail);
        return result.Succeeded ? NoContent() : FromFailure(result);
    }
}
