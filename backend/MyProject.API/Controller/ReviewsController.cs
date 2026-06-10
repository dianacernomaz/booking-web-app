using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Responses;
using MyProject.Domain.Models.Review;

namespace MyProject.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewAction _reviewAction;

        public ReviewsController()
        {
            var bl = new BusinessLogic();
            _reviewAction = bl.ReviewAction();
        }

        [HttpGet("property/{propertyId:int}")]
        [AllowAnonymous]
        public IActionResult GetByProperty(int propertyId)
        {
            var data = _reviewAction.GetByPropertyAction(propertyId);
            return Ok(data);
        }

        [HttpGet("property/{propertyId:int}/average")]
        [AllowAnonymous]
        public IActionResult GetAverage(int propertyId)
        {
            var data = _reviewAction.GetAverageAction(propertyId);
            return Ok(data);
        }

        [HttpGet("property/{propertyId:int}/check")]
        public IActionResult Check(int propertyId)
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _reviewAction.CheckAction(userId, propertyId);
            return Ok(data);
        }

        [HttpPost]
        public IActionResult Add([FromBody] UpsertReviewRequestDto request)
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _reviewAction.AddAction(userId, request);
            if (data.IsSuccess)
            {
                return NoContent();
            }

            return BuildErrorResponse(data);
        }

        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpsertReviewRequestDto request)
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _reviewAction.UpdateAction(id, userId, request);
            if (data.IsSuccess)
            {
                return NoContent();
            }

            return BuildErrorResponse(data);
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _reviewAction.DeleteAction(id, userId);
            if (data.IsSuccess)
            {
                return NoContent();
            }

            return BuildErrorResponse(data);
        }

        private bool TryGetCurrentUserId(out int userId)
        {
            var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(rawUserId, out userId);
        }

        private IActionResult BuildErrorResponse(ActionResponse response)
        {
            return StatusCode(response.StatusCode, new { message = response.Message });
        }
    }
}
