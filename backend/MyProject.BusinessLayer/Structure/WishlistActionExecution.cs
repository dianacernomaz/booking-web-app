using MyProject.BusinessLayer.Core;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Property;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Structure
{
    public class WishlistActionExecution : WishlistActions, IWishlistAction
    {
        public WishlistActionExecution() { }

        public List<PropertySummaryDto> GetUserWishlistAction(string userEmail)
        {
            return GetUserWishlistActionExecution(userEmail);
        }

        public ActionResponse ToggleWishlistAction(string userEmail, int propertyId)
        {
            return ToggleWishlistActionExecution(userEmail, propertyId);
        }
    }
}
