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
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistAction _wishlistAction;

        public WishlistController()
        {
            var bl = new BusinessLogic();
            _wishlistAction = bl.WishlistAction();
        }

        [HttpGet]
        public IActionResult GetWishlist([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return BadRequest("Email este obligatoriu.");
            var data = _wishlistAction.GetUserWishlistAction(email);
            return Ok(data);
        }

        [HttpPost("toggle")]
        public IActionResult ToggleWishlist([FromBody] ToggleWishlistRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || request.PropertyId <= 0)
            {
                return BadRequest(new { message = "Email și PropertyId sunt obligatorii." });
            }

            var data = _wishlistAction.ToggleWishlistAction(request.Email, request.PropertyId);
            if (data.IsSuccess)
            {
                return Ok(new { message = data.Message });
            }

            return StatusCode(data.StatusCode, new { message = data.Message });
        }
    }

    public class ToggleWishlistRequest
    {
        public string Email { get; set; } = string.Empty;
        public int PropertyId { get; set; }
    }
}
