using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Responses;

namespace MyProject.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationAction _notificationAction;

        public NotificationsController()
        {
            var bl = new BusinessLogic();
            _notificationAction = bl.NotificationAction();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _notificationAction.GetByUserAction(userId);
            return Ok(data);
        }

        [HttpGet("unread-count")]
        public IActionResult GetUnreadCount()
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _notificationAction.GetUnreadCountAction(userId);
            return Ok(data);
        }

        [HttpPatch("{id:int}/read")]
        public IActionResult MarkAsRead(int id)
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _notificationAction.MarkAsReadAction(id, userId);
            if (data.IsSuccess)
            {
                return NoContent();
            }

            return BuildErrorResponse(data);
        }

        [HttpPatch("read-all")]
        public IActionResult MarkAllAsRead()
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _notificationAction.MarkAllAsReadAction(userId);
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

            var data = _notificationAction.DeleteAction(id, userId);
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
