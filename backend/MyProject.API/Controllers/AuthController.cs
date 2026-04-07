using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.DTOs;
using MyProject.BusinessLayer.Interfaces;

namespace MyProject.API.Controllers;

[Route("api/[controller]")]
public sealed class AuthController : ApiControllerBase
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
        var result = _authAction.LoginAction(request);
        return result.Succeeded ? Ok(result.Value) : FromFailure(result);
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequestDto request)
    {
        var result = _authAction.RegisterAction(request);
        return result.Succeeded ? Created(string.Empty, result.Value) : FromFailure(result);
    }
}
