using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.DTOs;

namespace MyProject.API.Controllers;

[Route("api/[controller]")]
public sealed class AuthController(IBusinessLogic businessLogic) : ApiControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequestDto request)
    {
        var result = businessLogic.Auth.Login(request);
        return result.Succeeded ? Ok(result.Value) : FromFailure(result);
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequestDto request)
    {
        var result = businessLogic.Auth.Register(request);
        return result.Succeeded ? Created(string.Empty, result.Value) : FromFailure(result);
    }
}
