using Microsoft.AspNetCore.Mvc;
using StayBooker.API.Models;
using StayBooker.BusinessLayer;
using StayBooker.BusinessLayer.DTOs.Auth;

namespace StayBooker.API.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly BusinessLogic _businessLogic;

    public AuthController(BusinessLogic businessLogic)
    {
        _businessLogic = businessLogic;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var result = await _businessLogic.Users.LoginAsync(request);
        if (!result.Success || result.Data is null)
        {
            return Unauthorized(new ApiMessageResponse { Message = result.Error ?? "Autentificare esuata." });
        }

        return Ok(result.Data);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var result = await _businessLogic.Users.RegisterAsync(request);
        if (!result.Success || result.Data is null)
        {
            return Conflict(new ApiMessageResponse { Message = result.Error ?? "Inregistrare esuata." });
        }

        return Created($"/api/users/{Uri.EscapeDataString(result.Data.Email)}", result.Data);
    }
}
