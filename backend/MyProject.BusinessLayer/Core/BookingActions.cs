using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyProject.DataAccess;
using MyProject.DataAccess.Context;
using MyProject.Domain.Entities;
using MyProject.Domain.Models.Booking;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Core
{
    public class BookingActions
    {
        private readonly IMapper _mapper;

        public BookingActions()
        {
            _mapper = BusinessLogic.Mapper;
        }

        internal List<BookingDto> GetByOwnerActionExecution(string ownerEmail)
        {
            var normalizedEmail = NormalizeEmail(ownerEmail);

            using (var db = new BookingContext())
            {
                var bookings = db.Bookings
                    .AsNoTracking()
                    .Include(booking => booking.User)
                    .Where(booking => booking.User != null && booking.User.Email == normalizedEmail)
                    .OrderByDescending(booking => booking.CheckIn)
                    .ToList();

                return _mapper.Map<List<BookingDto>>(bookings);
            }
        }

        internal List<BookingDto> GetByHostActionExecution(string hostEmail)
        {
            var normalizedEmail = NormalizeEmail(hostEmail);

            using (var db = new BookingContext())
            {
                var bookings = db.Bookings
                    .AsNoTracking()
                    .Include(booking => booking.User)
                    .Include(booking => booking.Property)
                    .ThenInclude(property => property!.Owner)
                    .Where(booking => booking.Property != null && booking.Property.Owner != null && booking.Property.Owner.Email == normalizedEmail)
                    .OrderByDescending(booking => booking.CreatedAt)
                    .ToList();

                return _mapper.Map<List<BookingDto>>(bookings);
            }
        }

        internal ActionResponse<BookingDto> CreateBookingActionExecution(CreateBookingRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.OwnerEmail))
            {
                return Failed<BookingDto>(400, "Owner email este obligatoriu.");
            }

            var normalizedEmail = NormalizeEmail(request.OwnerEmail);
            using (var db = new BookingContext())
            {
                var user = db.Users.FirstOrDefault(candidate => candidate.Email == normalizedEmail);
                if (user == null)
                {
                    return Failed<BookingDto>(404, "Utilizatorul rezervarii nu a fost gasit.");
                }

                var property = db.Properties.FirstOrDefault(candidate => candidate.Id == request.PropertyId);
                if (property == null)
                {
                    return Failed<BookingDto>(404, "Proprietatea nu a fost gasita.");
                }

                var booking = new BookingData
                {
                    Id = Guid.NewGuid().ToString("N"),
                    UserId = user.Id,
                    User = user,
                    PropertyId = property.Id,
                    Property = property,
                    PropertyTitle = property.Title,
                    PropertyLocation = BuildLocation(property.City, property.Country),
                    PropertyImage = property.Image,
                    CheckIn = request.CheckIn,
                    CheckOut = request.CheckOut,
                    Guests = request.Guests,
                    Nights = request.Nights,
                    Total = request.Total,
                    Status = ResolveBookingStatus(request.CheckIn, request.CheckOut, null),
                    Code = request.Code,
                    CreatedAt = DateTime.UtcNow,
                    PaymentMethod = request.PaymentMethod,
                    PaymentStatus = request.PaymentStatus,
                    PaymentLabel = request.PaymentLabel,
                    PaymentLast4 = request.PaymentLast4,
                    PaidAt = DateTime.TryParse(request.PaidAt, out var paidAt) ? paidAt : null
                };

                db.Bookings.Add(booking);
                db.Notifications.Add(new NotificationData
                {
                    UserId = user.Id,
                    User = user,
                    Title = "Rezervare confirmata",
                    Message = $"Rezervarea {booking.Code} pentru {booking.PropertyTitle} a fost creata cu succes.",
                    Type = "Reservation",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                });

                if (string.Equals(booking.PaymentStatus, "paid", StringComparison.OrdinalIgnoreCase))
                {
                    db.Notifications.Add(new NotificationData
                    {
                        UserId = user.Id,
                        User = user,
                        Title = "Plata confirmata",
                        Message = $"Plata pentru rezervarea {booking.Code} a fost confirmata.",
                        Type = "Reservation",
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow
                    });
                }

                db.SaveChanges();
                return Success(_mapper.Map<BookingDto>(booking), "Rezervare creata.");
            }
        }

        internal ActionResponse CancelBookingActionExecution(string id, string ownerEmail)
        {
            var normalizedEmail = NormalizeEmail(ownerEmail);
            using (var db = new BookingContext())
            {
                var booking = db.Bookings
                    .Include(item => item.User)
                    .FirstOrDefault(item =>
                        item.Id == id &&
                        item.User != null &&
                        item.User.Email == normalizedEmail);

                if (booking == null)
                {
                    return Failed(404, "Rezervarea nu a fost gasita.");
                }

                booking.Status = "cancelled";
                db.Notifications.Add(new NotificationData
                {
                    UserId = booking.UserId,
                    Title = "Rezervare anulata",
                    Message = $"Rezervarea {booking.Code} pentru {booking.PropertyTitle} a fost anulata.",
                    Type = "Reservation",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                });
                db.SaveChanges();
                return Success("Rezervarea a fost anulata.");
            }
        }

        internal PlatformStatsDto GetPlatformStatsActionExecution()
        {
            using (var db = new BookingContext())
            {
                return new PlatformStatsDto
                {
                    TotalUsers = db.Users.Count(),
                    TotalProperties = db.Properties.Count(),
                    PendingProperties = db.Properties.Count(p => !p.IsApproved),
                    TotalBookings = db.Bookings.Count(),
                    TotalRevenue = db.Bookings.Where(b => b.Status != "cancelled").Sum(b => b.Total)
                };
            }
        }

        private static ActionResponse Success(string message)
        {
            return new ActionResponse
            {
                IsSuccess = true,
                Message = message,
                StatusCode = 200
            };
        }

        private static ActionResponse<T> Success<T>(T data, string? message = null)
        {
            return new ActionResponse<T>
            {
                IsSuccess = true,
                Message = message,
                StatusCode = 200,
                Data = data
            };
        }

        private static ActionResponse Failed(int statusCode, string message)
        {
            return new ActionResponse
            {
                IsSuccess = false,
                Message = message,
                StatusCode = statusCode
            };
        }

        private static ActionResponse<T> Failed<T>(int statusCode, string message)
        {
            return new ActionResponse<T>
            {
                IsSuccess = false,
                Message = message,
                StatusCode = statusCode
            };
        }

        public static string ResolveBookingStatus(string checkIn, string checkOut, string? currentStatus)
        {
            if (string.Equals(currentStatus, "cancelled", StringComparison.OrdinalIgnoreCase))
            {
                return "cancelled";
            }

            if (!DateOnly.TryParse(checkIn, out var checkInDate) || !DateOnly.TryParse(checkOut, out var checkOutDate))
            {
                return string.IsNullOrWhiteSpace(currentStatus) ? "upcoming" : currentStatus;
            }

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            if (today < checkInDate)
            {
                return "upcoming";
            }

            if (today >= checkOutDate)
            {
                return "completed";
            }

            return "active";
        }

        private static string NormalizeEmail(string email)
        {
            return (email ?? string.Empty).Trim().ToLowerInvariant();
        }

        private static string BuildLocation(string city, string country)
        {
            return string.Join(", ", new[] { city, country }.Where(value => !string.IsNullOrWhiteSpace(value)));
        }
    }
}
