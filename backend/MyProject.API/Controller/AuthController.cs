using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Responses;
using MyProject.Domain.Models.User;

namespace MyProject.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthAction _authAction;

        public AuthController()
        {
            var bl = new BusinessLogic();
            _authAction = bl.AuthAction();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto request)
        {
            var data = _authAction.LoginAction(request);
            if (data.IsSuccess)
            {
                return Ok(data.Data);
            }

            return BuildErrorResponse(data);
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequestDto request)
        {
            var data = _authAction.RegisterAction(request);
            if (data.IsSuccess)
            {
                return Ok(data.Data);
            }

            return BuildErrorResponse(data);
        }

        [HttpGet("profile")]
        [Authorize]
        public IActionResult GetProfile([FromQuery] string email)
        {
            var user = _authAction.GetCurrentUserAction(email);
            if (user == null)
            {
                return NotFound(new { message = "Utilizatorul nu a fost gasit." });
            }
            return Ok(user);
        }

        [HttpPut("profile")]
        [Authorize]
        public IActionResult UpdateProfile([FromBody] UpdateUserProfileRequestDto request)
        {
            var data = _authAction.UpdateProfileAction(request);
            if (data.IsSuccess) return Ok(data.Data);
            return BuildErrorResponse(data);
        }

        [HttpPost("change-password")]
        [Authorize]
        public IActionResult ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            var data = _authAction.ChangePasswordAction(request);
            if (data.IsSuccess) return Ok(new { message = data.Message });
            return BuildErrorResponse(data);
        }

        [HttpDelete("account")]
        [Authorize]
        public IActionResult DeleteAccount([FromQuery] string email)
        {
            var data = _authAction.DeleteUserAction(email);
            if (data.IsSuccess) return NoContent();
            return BuildErrorResponse(data);
        }

        [HttpGet("admin/users")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAdminUsers()
        {
            var data = _authAction.GetAllUsersAction();
            return Ok(data);
        }

        [HttpPatch("admin/user-role")]
        [Authorize(Roles = "admin")]
        public IActionResult UpdateUserRole([FromQuery] string email, [FromQuery] string role)
        {
            var data = _authAction.UpdateUserRoleAction(email, role);
            if (data.IsSuccess) return Ok(new { message = data.Message });
            return BuildErrorResponse(data);
        }

        private IActionResult BuildErrorResponse(ActionResponse response)
        {
            return StatusCode(response.StatusCode, new { message = response.Message });
        }
    }
}
