using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Booking;
using MyProject.Domain.Models.Responses;

namespace MyProject.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingsController : ControllerBase
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
            var data = _bookingAction.GetByOwnerAction(email);
            return Ok(data);
        }

        [HttpGet("host")]
        public IActionResult GetByHost([FromQuery] string email)
        {
            var data = _bookingAction.GetByHostAction(email);
            return Ok(data);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateBookingRequestDto request)
        {
            var data = _bookingAction.CreateAction(request);
            if (data.IsSuccess)
            {
                return Created(string.Empty, data.Data);
            }

            return BuildErrorResponse(data);
        }

        [HttpPatch("{id}/cancel")]
        public IActionResult Cancel(string id, [FromQuery] string ownerEmail)
        {
            var data = _bookingAction.CancelAction(id, ownerEmail);
            if (data.IsSuccess)
            {
                return NoContent();
            }

            return BuildErrorResponse(data);
        }

        [HttpGet("admin/stats")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAdminStats()
        {
            var data = _bookingAction.GetPlatformStatsAction();
            return Ok(data);
        }

        private IActionResult BuildErrorResponse(ActionResponse response)
        {
            return StatusCode(response.StatusCode, new { message = response.Message });
        }
    }
}
