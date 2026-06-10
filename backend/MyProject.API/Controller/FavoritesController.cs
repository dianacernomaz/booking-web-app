using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Favorite;
using MyProject.Domain.Models.Responses;

namespace MyProject.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteAction _favoriteAction;

        public FavoritesController()
        {
            var bl = new BusinessLogic();
            _favoriteAction = bl.FavoriteAction();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _favoriteAction.GetByUserAction(userId);
            return Ok(data);
        }

        [HttpGet("{propertyId:int}/check")]
        public IActionResult Check(int propertyId)
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _favoriteAction.CheckAction(userId, propertyId);
            return Ok(data);
        }

        [HttpPost]
        public IActionResult Add([FromBody] AddFavoriteRequestDto request)
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _favoriteAction.AddAction(userId, request);
            if (data.IsSuccess)
            {
                return NoContent();
            }

            return BuildErrorResponse(data);
        }

        [HttpDelete("{propertyId:int}")]
        public IActionResult Remove(int propertyId)
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Utilizatorul nu este autorizat." });
            }

            var data = _favoriteAction.RemoveAction(userId, propertyId);
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
