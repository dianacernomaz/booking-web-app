using MyProject.Domain.Models.Property;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Interfaces
{
    public interface IWishlistAction
    {
        List<PropertySummaryDto> GetUserWishlistAction(string userEmail);
        ActionResponse ToggleWishlistAction(string userEmail, int propertyId);
    }
}
