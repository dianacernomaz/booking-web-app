using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer.Common;

namespace MyProject.API.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected IActionResult FromFailure(ServiceResult result)
    {
        var payload = new { message = result.Error ?? "Request failed." };

        return result.ErrorType switch
        {
            ServiceErrorType.Validation => BadRequest(payload),
            ServiceErrorType.NotFound => NotFound(payload),
            ServiceErrorType.Conflict => Conflict(payload),
            ServiceErrorType.Unauthorized => Unauthorized(payload),
            _ => StatusCode(StatusCodes.Status500InternalServerError, payload)
        };
    }
}
