using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.DTOs;

namespace MyProject.API.Controllers;

[Route("api/[controller]")]
public sealed class UsersController(IBusinessLogic businessLogic) : ApiControllerBase
{
    [HttpGet("profile")]
    public IActionResult GetProfile([FromQuery] string email)
    {
        var result = businessLogic.Auth.GetCurrentUser(email);
        return result.Succeeded ? Ok(result.Value) : FromFailure(result);
    }

    [HttpPut("profile")]
    public IActionResult UpdateProfile([FromBody] UpdateUserProfileRequestDto request)
    {
        var result = businessLogic.Auth.UpdateProfile(request);
        return result.Succeeded ? Ok(result.Value) : FromFailure(result);
    }

    [HttpPut("password")]
    public IActionResult ChangePassword([FromBody] ChangePasswordRequestDto request)
    {
        var result = businessLogic.Auth.ChangePassword(request);
        return result.Succeeded ? NoContent() : FromFailure(result);
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] string email)
    {
        var result = businessLogic.Auth.DeleteUser(email);
        return result.Succeeded ? NoContent() : FromFailure(result);
    }
}
