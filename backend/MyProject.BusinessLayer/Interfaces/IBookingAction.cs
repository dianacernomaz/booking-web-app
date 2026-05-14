using MyProject.Domain.Models.Booking;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Interfaces
{
    public interface IBookingAction
    {
        List<BookingDto> GetByOwnerAction(string ownerEmail);

        List<BookingDto> GetByHostAction(string hostEmail);

        ActionResponse<BookingDto> CreateAction(CreateBookingRequestDto request);

        ActionResponse CancelAction(string id, string ownerEmail);

        PlatformStatsDto GetPlatformStatsAction();
    }
}
