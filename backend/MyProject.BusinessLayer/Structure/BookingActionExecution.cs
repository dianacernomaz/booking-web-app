using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.Core;
using MyProject.BusinessLayer.DTOs;
using MyProject.BusinessLayer.Infrastructure;
using MyProject.BusinessLayer.Interfaces;

namespace MyProject.BusinessLayer.Structure;

public sealed class BookingActionExecution(InMemoryAppStore store) : BookingActions(store), IBookingAction
{
    public IReadOnlyCollection<BookingDto> GetByOwnerAction(string ownerEmail) => GetByOwnerExecution(ownerEmail);

    public ServiceResult<BookingDto> CreateAction(CreateBookingRequestDto request) => CreateExecution(request);

    public ServiceResult CancelAction(string id, string ownerEmail) => CancelExecution(id, ownerEmail);
}
