using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.DTOs;
using MyProject.BusinessLayer.Infrastructure;

namespace MyProject.BusinessLayer.Services;

public sealed class AuthService(InMemoryAppStore store) : IAuthService
{
    public ServiceResult<SessionUserDto> Login(LoginRequestDto request)
    {
        var normalizedEmail = NormalizeEmail(request.Email);

        lock (store.SyncRoot)
        {
            var user = store.Users.FirstOrDefault(candidate =>
                string.Equals(candidate.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase) &&
                candidate.Password == request.Password);

            return user is null
                ? ServiceResult<SessionUserDto>.Failure(ServiceErrorType.Unauthorized, "Email sau parola incorecta.")
                : ServiceResult<SessionUserDto>.Success(Mappers.ToSession(user));
        }
    }

    public ServiceResult<SessionUserDto> Register(RegisterRequestDto request)
    {
        var normalizedEmail = NormalizeEmail(request.Email);
        if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(normalizedEmail))
        {
            return ServiceResult<SessionUserDto>.Failure(ServiceErrorType.Validation, "Full name si email sunt obligatorii.");
        }

        lock (store.SyncRoot)
        {
            if (store.Users.Any(user => string.Equals(user.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase)))
            {
                return ServiceResult<SessionUserDto>.Failure(ServiceErrorType.Conflict, "Exista deja un cont cu acest email.");
            }

            var user = new Domain.Entities.UserEntity
            {
                FullName = request.FullName.Trim(),
                Email = normalizedEmail,
                Phone = request.Phone.Trim(),
                BirthDate = request.BirthDate.Trim(),
                Password = request.Password,
                Role = "user"
            };

            store.Users.Add(user);
            return ServiceResult<SessionUserDto>.Success(Mappers.ToSession(user));
        }
    }

    public ServiceResult<StoredUserDto> GetCurrentUser(string email)
    {
        var normalizedEmail = NormalizeEmail(email);
        lock (store.SyncRoot)
        {
            var user = store.Users.FirstOrDefault(candidate =>
                string.Equals(candidate.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase));

            return user is null
                ? ServiceResult<StoredUserDto>.Failure(ServiceErrorType.NotFound, "Utilizatorul nu a fost gasit.")
                : ServiceResult<StoredUserDto>.Success(Mappers.ToStoredUser(user));
        }
    }

    public ServiceResult<StoredUserDto> UpdateProfile(UpdateUserProfileRequestDto request)
    {
        var currentEmail = NormalizeEmail(request.CurrentEmail);
        var nextEmail = NormalizeEmail(request.Email);

        lock (store.SyncRoot)
        {
            var user = store.Users.FirstOrDefault(candidate =>
                string.Equals(candidate.Email, currentEmail, StringComparison.OrdinalIgnoreCase));

            if (user is null)
            {
                return ServiceResult<StoredUserDto>.Failure(ServiceErrorType.NotFound, "Nu exista utilizator autentificat.");
            }

            var duplicate = store.Users.FirstOrDefault(candidate =>
                string.Equals(candidate.Email, nextEmail, StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(candidate.Email, currentEmail, StringComparison.OrdinalIgnoreCase));

            if (duplicate is not null)
            {
                return ServiceResult<StoredUserDto>.Failure(ServiceErrorType.Conflict, "Email-ul este deja folosit de alt cont.");
            }

            user.FullName = request.FullName.Trim();
            user.Email = nextEmail;
            user.Phone = request.Phone.Trim();
            user.City = request.City.Trim();
            user.Country = request.Country.Trim();
            user.Bio = request.Bio.Trim();

            foreach (var property in store.Properties.Where(property =>
                         string.Equals(property.OwnerEmail, currentEmail, StringComparison.OrdinalIgnoreCase)))
            {
                property.OwnerEmail = nextEmail;
                property.Host = user.FullName;
                property.UpdatedAt = DateTime.UtcNow;
            }

            foreach (var booking in store.Bookings.Where(booking =>
                         string.Equals(booking.OwnerEmail, currentEmail, StringComparison.OrdinalIgnoreCase)))
            {
                booking.OwnerEmail = nextEmail;
            }

            return ServiceResult<StoredUserDto>.Success(Mappers.ToStoredUser(user));
        }
    }

    public ServiceResult ChangePassword(ChangePasswordRequestDto request)
    {
        var normalizedEmail = NormalizeEmail(request.Email);

        lock (store.SyncRoot)
        {
            var user = store.Users.FirstOrDefault(candidate =>
                string.Equals(candidate.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase));

            if (user is null)
            {
                return ServiceResult.Failure(ServiceErrorType.NotFound, "Nu exista utilizator autentificat.");
            }

            if (!string.Equals(user.Password, request.CurrentPassword, StringComparison.Ordinal))
            {
                return ServiceResult.Failure(ServiceErrorType.Unauthorized, "Parola curenta este incorecta.");
            }

            user.Password = request.NewPassword;
            return ServiceResult.Success();
        }
    }

    public ServiceResult DeleteUser(string email)
    {
        var normalizedEmail = NormalizeEmail(email);

        lock (store.SyncRoot)
        {
            var user = store.Users.FirstOrDefault(candidate =>
                string.Equals(candidate.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase));

            if (user is null)
            {
                return ServiceResult.Failure(ServiceErrorType.NotFound, "Utilizatorul nu a fost gasit.");
            }

            store.Users.Remove(user);
            store.Properties.RemoveAll(property =>
                string.Equals(property.OwnerEmail, normalizedEmail, StringComparison.OrdinalIgnoreCase));
            store.Bookings.RemoveAll(booking =>
                string.Equals(booking.OwnerEmail, normalizedEmail, StringComparison.OrdinalIgnoreCase));

            return ServiceResult.Success();
        }
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
}
