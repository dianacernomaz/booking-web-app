using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.DTOs;

namespace MyProject.BusinessLayer.Interfaces;

public interface IBookingAction
{
    IReadOnlyCollection<BookingDto> GetByOwnerAction(string ownerEmail);

    ServiceResult<BookingDto> CreateAction(CreateBookingRequestDto request);

    ServiceResult CancelAction(string id, string ownerEmail);
}
