using MyProject.Domain.Models.Favorite;
using MyProject.Domain.Models.Property;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Interfaces
{
    public interface IFavoriteAction
    {
        List<PropertySummaryDto> GetByUserAction(int userId);

        FavoriteStatusDto CheckAction(int userId, int propertyId);

        ActionResponse AddAction(int userId, AddFavoriteRequestDto request);

        ActionResponse RemoveAction(int userId, int propertyId);
    }
}
