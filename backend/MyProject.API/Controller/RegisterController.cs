using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Responses;
using MyProject.Domain.Models.User;

namespace MyProject.API.Controller
{
    [Route("api/reg")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly IAuthAction _authAction;

        public RegisterController()
        {
            var bl = new BusinessLogic();
            _authAction = bl.AuthAction();
        }

        [HttpPost]
        public IActionResult Register([FromBody] RegisterRequestDto request)
        {
            var data = _authAction.RegisterAction(request);
            if (data.IsSuccess)
            {
                return Ok(data.Data);
            }

            return StatusCode(data.StatusCode, new { message = data.Message });
        }
    }
}
