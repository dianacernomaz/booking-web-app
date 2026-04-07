using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.DTOs;
using MyProject.BusinessLayer.Interfaces;

namespace MyProject.API.Controllers;

[Route("api/[controller]")]
public sealed class UsersController : ApiControllerBase
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
        var result = _authAction.GetCurrentUserAction(email);
        return result.Succeeded ? Ok(result.Value) : FromFailure(result);
    }

    [HttpPut("profile")]
    public IActionResult UpdateProfile([FromBody] UpdateUserProfileRequestDto request)
    {
        var result = _authAction.UpdateProfileAction(request);
        return result.Succeeded ? Ok(result.Value) : FromFailure(result);
    }

    [HttpPut("password")]
    public IActionResult ChangePassword([FromBody] ChangePasswordRequestDto request)
    {
        var result = _authAction.ChangePasswordAction(request);
        return result.Succeeded ? NoContent() : FromFailure(result);
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] string email)
    {
        var result = _authAction.DeleteUserAction(email);
        return result.Succeeded ? NoContent() : FromFailure(result);
    }
}
