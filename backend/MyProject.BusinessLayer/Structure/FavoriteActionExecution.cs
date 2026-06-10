using MyProject.BusinessLayer.Core;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Favorite;
using MyProject.Domain.Models.Property;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Structure
{
    public class FavoriteActionExecution : FavoriteActions, IFavoriteAction
    {
        public FavoriteActionExecution()
        {
        }

        public List<PropertySummaryDto> GetByUserAction(int userId)
        {
            return GetByUserActionExecution(userId);
        }

        public FavoriteStatusDto CheckAction(int userId, int propertyId)
        {
            return CheckActionExecution(userId, propertyId);
        }

        public ActionResponse AddAction(int userId, AddFavoriteRequestDto request)
        {
            return AddActionExecution(userId, request);
        }

        public ActionResponse RemoveAction(int userId, int propertyId)
        {
            return RemoveActionExecution(userId, propertyId);
        }
    }
}
