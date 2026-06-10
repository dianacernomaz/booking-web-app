using MyProject.Domain.Models.Responses;
using MyProject.Domain.Models.Review;

namespace MyProject.BusinessLayer.Interfaces
{
    public interface IReviewAction
    {
        List<ReviewDto> GetByPropertyAction(int propertyId);

        ReviewAverageDto GetAverageAction(int propertyId);

        ReviewStatusDto CheckAction(int userId, int propertyId);

        ActionResponse AddAction(int userId, UpsertReviewRequestDto request);

        ActionResponse UpdateAction(int id, int userId, UpsertReviewRequestDto request);

        ActionResponse DeleteAction(int id, int userId);
    }
}
