using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyProject.BusinessLayer;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Property;
using MyProject.Domain.Models.Responses;
using System.Security.Claims;

namespace MyProject.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyAction _propertyAction;

        public PropertiesController()
        {
            var bl = new BusinessLogic();
            _propertyAction = bl.PropertyAction();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var data = _propertyAction.GetAllPropertiesAction(userEmail);
            return Ok(data);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public IActionResult Search([FromQuery] PropertySearchRequestDto request)
        {
            request.UserEmail = User.FindFirstValue(ClaimTypes.Email);
            var data = _propertyAction.SearchPropertiesAction(request);
            return Ok(data);
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public IActionResult GetById(int id)
        {
            var data = _propertyAction.GetByIdAction(id);
            if (data != null)
            {
                return Ok(data);
            }

            return NotFound(new { message = "Proprietatea nu a fost gasita." });
        }

        [HttpGet("owner")]
        public IActionResult GetByOwner([FromQuery] string email)
        {
            var data = _propertyAction.GetByOwnerAction(email);
            return Ok(data);
        }

        [HttpPost]
        public IActionResult Create([FromBody] UpsertPropertyRequestDto request)
        {
            var data = _propertyAction.CreateAction(request);
            if (data.IsSuccess)
            {
                var property = data.Data!;
                return CreatedAtAction(nameof(GetById), new { id = property.Id }, property);
            }

            return BuildErrorResponse(data);
        }

        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpsertPropertyRequestDto request)
        {
            var data = _propertyAction.UpdateAction(id, request);
            if (data.IsSuccess)
            {
                return Ok(data.Data);
            }

            return BuildErrorResponse(data);
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAdminAll()
        {
            var data = _propertyAction.GetAllForAdminAction();
            return Ok(data);
        }

        [HttpPut("admin/{id:int}")]
        [Authorize(Roles = "admin")]
        public IActionResult UpdateAsAdmin(int id, [FromBody] UpsertPropertyRequestDto request)
        {
            var data = _propertyAction.UpdateAsAdminAction(id, request);
            if (data.IsSuccess)
            {
                return Ok(data.Data);
            }

            return BuildErrorResponse(data);
        }

        [HttpPatch("admin/approve/{id:int}")]
        [Authorize(Roles = "admin")]
        public IActionResult Approve(int id)
        {
            var data = _propertyAction.ApproveAction(id);
            return Ok(data);
        }

        [HttpPatch("admin/reject/{id:int}")]
        [Authorize(Roles = "admin")]
        public IActionResult Reject(int id)
        {
            var data = _propertyAction.RejectAction(id);
            return Ok(data);
        }

        [HttpPatch("{id:int}/availability")]
        [Authorize]
        public IActionResult UpdateAvailability(int id, [FromBody] List<int> occupiedDays)
        {
            var data = _propertyAction.UpdateAvailabilityAction(id, occupiedDays);
            if (data.IsSuccess) return Ok(data);
            return BuildErrorResponse(data);
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public IActionResult Delete(int id, [FromQuery] string ownerEmail)
        {
            var data = _propertyAction.DeleteAction(id, ownerEmail);
            if (data.IsSuccess)
            {
                return NoContent();
            }

            return BuildErrorResponse(data);
        }

        [HttpDelete("admin/{id:int}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteAsAdmin(int id)
        {
            var data = _propertyAction.DeleteAsAdminAction(id);
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
