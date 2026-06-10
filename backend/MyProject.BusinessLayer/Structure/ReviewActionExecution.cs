using MyProject.BusinessLayer.Core;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Responses;
using MyProject.Domain.Models.Review;

namespace MyProject.BusinessLayer.Structure
{
    public class ReviewActionExecution : ReviewActions, IReviewAction
    {
        public ReviewActionExecution()
        {
        }

        public List<ReviewDto> GetByPropertyAction(int propertyId)
        {
            return GetByPropertyActionExecution(propertyId);
        }

        public ReviewAverageDto GetAverageAction(int propertyId)
        {
            return GetAverageActionExecution(propertyId);
        }

        public ReviewStatusDto CheckAction(int userId, int propertyId)
        {
            return CheckActionExecution(userId, propertyId);
        }

        public ActionResponse AddAction(int userId, UpsertReviewRequestDto request)
        {
            return AddActionExecution(userId, request);
        }

        public ActionResponse UpdateAction(int id, int userId, UpsertReviewRequestDto request)
        {
            return UpdateActionExecution(id, userId, request);
        }

        public ActionResponse DeleteAction(int id, int userId)
        {
            return DeleteActionExecution(id, userId);
        }
    }
}
