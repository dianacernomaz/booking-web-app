using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.DTOs;
using MyProject.BusinessLayer.Infrastructure;
using MyProject.Domain.Entities;

namespace MyProject.BusinessLayer.Services;

public sealed class BookingService(InMemoryAppStore store) : IBookingService
{
    public IReadOnlyCollection<BookingDto> GetByOwner(string ownerEmail)
    {
        var normalizedEmail = NormalizeEmail(ownerEmail);

        lock (store.SyncRoot)
        {
            return store.Bookings
                .Where(booking => string.Equals(booking.OwnerEmail, normalizedEmail, StringComparison.OrdinalIgnoreCase))
                .OrderByDescending(booking => booking.CheckIn)
                .Select(Mappers.ToBooking)
                .ToArray();
        }
    }

    public ServiceResult<BookingDto> Create(CreateBookingRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.OwnerEmail))
        {
            return ServiceResult<BookingDto>.Failure(ServiceErrorType.Validation, "Owner email este obligatoriu.");
        }

        lock (store.SyncRoot)
        {
            var booking = new BookingEntity
            {
                Id = Guid.NewGuid().ToString(),
                OwnerEmail = NormalizeEmail(request.OwnerEmail),
                PropertyId = request.PropertyId,
                PropertyTitle = request.PropertyTitle,
                PropertyLocation = request.PropertyLocation,
                PropertyImage = request.PropertyImage,
                CheckIn = request.CheckIn,
                CheckOut = request.CheckOut,
                Guests = request.Guests,
                Nights = request.Nights,
                Total = request.Total,
                Status = BookingStatusResolver.Resolve(request.CheckIn, request.CheckOut, null),
                Code = request.Code,
                CreatedAt = DateTime.UtcNow,
                PaymentMethod = request.PaymentMethod,
                PaymentStatus = request.PaymentStatus,
                PaymentLabel = request.PaymentLabel,
                PaymentLast4 = request.PaymentLast4,
                PaidAt = DateTime.TryParse(request.PaidAt, out var paidAt) ? paidAt : null
            };

            store.Bookings.Insert(0, booking);
            return ServiceResult<BookingDto>.Success(Mappers.ToBooking(booking));
        }
    }

    public ServiceResult Cancel(string id, string ownerEmail)
    {
        var normalizedEmail = NormalizeEmail(ownerEmail);

        lock (store.SyncRoot)
        {
            var booking = store.Bookings.FirstOrDefault(item =>
                string.Equals(item.Id, id, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(item.OwnerEmail, normalizedEmail, StringComparison.OrdinalIgnoreCase));

            if (booking is null)
            {
                return ServiceResult.Failure(ServiceErrorType.NotFound, "Rezervarea nu a fost gasita.");
            }

            booking.Status = "cancelled";
            return ServiceResult.Success();
        }
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
}
