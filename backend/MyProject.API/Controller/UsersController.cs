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
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IAuthAction _authAction;

        public UsersController()
        {
            var bl = new BusinessLogic();
            _authAction = bl.AuthAction();
        }

        [HttpGet("profile")]
        public IActionResult GetProfile([FromQuery] string email)
        {
            var data = _authAction.GetCurrentUserAction(email);
            if (data != null)
            {
                return Ok(data);
            }

            return NotFound(new { message = "Utilizatorul nu a fost gasit." });
        }

        [HttpPut("profile")]
        public IActionResult UpdateProfile([FromBody] UpdateUserProfileRequestDto request)
        {
            var data = _authAction.UpdateProfileAction(request);
            if (data.IsSuccess)
            {
                return Ok(data.Data);
            }

            return BuildErrorResponse(data);
        }

        [HttpPut("password")]
        public IActionResult ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            var data = _authAction.ChangePasswordAction(request);
            if (data.IsSuccess)
            {
                return NoContent();
            }

            return BuildErrorResponse(data);
        }

        [HttpDelete]
        public IActionResult Delete([FromQuery] string email)
        {
            var data = _authAction.DeleteUserAction(email);
            if (data.IsSuccess)
            {
                return NoContent();
            }

            return BuildErrorResponse(data);
        }

        private IActionResult BuildErrorResponse(ActionResponse response)
        {
            return StatusCode(response.StatusCode, new { message = response.Message });
        }
    }
}
