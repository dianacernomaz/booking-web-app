using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.DTOs;

namespace MyProject.BusinessLayer.Services;

public interface IBookingService
{
    IReadOnlyCollection<BookingDto> GetByOwner(string ownerEmail);

    ServiceResult<BookingDto> Create(CreateBookingRequestDto request);

    ServiceResult Cancel(string id, string ownerEmail);
}
