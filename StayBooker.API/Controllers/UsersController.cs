using Microsoft.AspNetCore.Mvc;
using StayBooker.API.Models;
using StayBooker.BusinessLayer;
using StayBooker.BusinessLayer.DTOs.Users;

namespace StayBooker.API.Controllers;

[ApiController]
[Route("api/users")]
public sealed class UsersController : ControllerBase
{
    private readonly BusinessLogic _businessLogic;

    public UsersController(BusinessLogic businessLogic)
    {
        _businessLogic = businessLogic;
    }

    [HttpGet("{email}")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var user = await _businessLogic.Users.GetByEmailAsync(email);
        return user is null ? NotFound(new ApiMessageResponse { Message = "Utilizatorul nu a fost gasit." }) : Ok(user);
    }

    [HttpPut("{email}/profile")]
    public async Task<IActionResult> UpdateProfile(string email, [FromBody] UpdateUserProfileDto request)
    {
        var result = await _businessLogic.Users.UpdateProfileAsync(email, request);
        if (!result.Success || result.Data is null)
        {
            return Conflict(new ApiMessageResponse { Message = result.Error ?? "Actualizarea profilului a esuat." });
        }

        return Ok(result.Data);
    }

    [HttpPut("{email}/password")]
    public async Task<IActionResult> ChangePassword(string email, [FromBody] ChangePasswordDto request)
    {
        var result = await _businessLogic.Users.ChangePasswordAsync(email, request);
        if (!result.Success)
        {
            return BadRequest(new ApiMessageResponse { Message = result.Error ?? "Schimbarea parolei a esuat." });
        }

        return Ok(new ApiMessageResponse { Message = "Parola a fost schimbata." });
    }

    [HttpDelete("{email}")]
    public async Task<IActionResult> Delete(string email)
    {
        var deleted = await _businessLogic.Users.DeleteAsync(email);
        return deleted ? NoContent() : NotFound(new ApiMessageResponse { Message = "Utilizatorul nu a fost gasit." });
    }
}
