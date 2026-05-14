using MyProject.BusinessLayer.Core;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Booking;
using MyProject.Domain.Models.Responses;
using MyProject.DataAccess;

namespace MyProject.BusinessLayer.Structure
{
    public class BookingActionExecution : BookingActions, IBookingAction
    {
        public BookingActionExecution()
        {
        }

        public List<BookingDto> GetByOwnerAction(string ownerEmail)
        {
            return GetByOwnerActionExecution(ownerEmail);
        }

        public List<BookingDto> GetByHostAction(string hostEmail)
        {
            return GetByHostActionExecution(hostEmail);
        }

        public ActionResponse<BookingDto> CreateAction(CreateBookingRequestDto request)
        {
            return CreateBookingActionExecution(request);
        }

        public ActionResponse CancelAction(string id, string ownerEmail)
        {
            return CancelBookingActionExecution(id, ownerEmail);
        }

        public PlatformStatsDto GetPlatformStatsAction()
        {
            return GetPlatformStatsActionExecution();
        }
    }
}
