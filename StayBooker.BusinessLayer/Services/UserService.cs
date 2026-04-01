using StayBooker.BusinessLayer.Common;
using StayBooker.BusinessLayer.DTOs.Auth;
using StayBooker.BusinessLayer.DTOs.Users;
using StayBooker.BusinessLayer.Infrastructure;
using StayBooker.BusinessLayer.Interfaces;
using StayBooker.Domain.Entities;

namespace StayBooker.BusinessLayer.Services;

public sealed class UserService : IUserService
{
    private readonly InMemoryDataStore _store;

    public UserService(InMemoryDataStore store)
    {
        _store = store;
    }

    public Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginRequestDto request)
    {
        var email = NormalizeEmail(request.Email);
        var user = _store.Users.FirstOrDefault(candidate =>
            NormalizeEmail(candidate.Email) == email &&
            candidate.Password == request.Password);

        if (user is null)
        {
            return Task.FromResult(ServiceResult<AuthResponseDto>.Fail("Email sau parola incorecta."));
        }

        return Task.FromResult(ServiceResult<AuthResponseDto>.Ok(ToAuthResponse(user)));
    }

    public Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterRequestDto request)
    {
        var email = NormalizeEmail(request.Email);
        if (_store.Users.Any(user => NormalizeEmail(user.Email) == email))
        {
            return Task.FromResult(ServiceResult<AuthResponseDto>.Fail("Exista deja un cont cu acest email."));
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = email,
            Phone = request.Phone.Trim(),
            BirthDate = request.BirthDate,
            Password = request.Password,
            Role = UserRole.User,
        };

        _store.Users.Add(user);
        return Task.FromResult(ServiceResult<AuthResponseDto>.Ok(ToAuthResponse(user)));
    }

    public Task<UserDto?> GetByEmailAsync(string email)
    {
        var user = _store.Users.FirstOrDefault(candidate => NormalizeEmail(candidate.Email) == NormalizeEmail(email));
        return Task.FromResult(user is null ? null : ToDto(user));
    }

    public Task<ServiceResult<UserDto>> UpdateProfileAsync(string email, UpdateUserProfileDto request)
    {
        var normalizedEmail = NormalizeEmail(email);
        var user = _store.Users.FirstOrDefault(candidate => NormalizeEmail(candidate.Email) == normalizedEmail);
        if (user is null)
        {
            return Task.FromResult(ServiceResult<UserDto>.Fail("Utilizatorul nu a fost gasit."));
        }

        var nextEmail = NormalizeEmail(request.Email);
        var duplicate = _store.Users.FirstOrDefault(candidate =>
            NormalizeEmail(candidate.Email) == nextEmail &&
            NormalizeEmail(candidate.Email) != normalizedEmail);

        if (duplicate is not null)
        {
            return Task.FromResult(ServiceResult<UserDto>.Fail("Email-ul este deja folosit de alt cont."));
        }

        var previousEmail = user.Email;
        user.FullName = request.FullName.Trim();
        user.Email = nextEmail;
        user.Phone = request.Phone.Trim();
        user.City = request.City.Trim();
        user.Country = request.Country.Trim();
        user.Bio = request.Bio.Trim();

        foreach (var property in _store.Properties.Where(property => NormalizeEmail(property.OwnerEmail) == NormalizeEmail(previousEmail)))
        {
            property.OwnerEmail = user.Email;
            property.Host = user.FullName;
            property.UpdatedAt = DateTime.UtcNow;
        }

        return Task.FromResult(ServiceResult<UserDto>.Ok(ToDto(user)));
    }

    public Task<ServiceResult<bool>> ChangePasswordAsync(string email, ChangePasswordDto request)
    {
        var user = _store.Users.FirstOrDefault(candidate => NormalizeEmail(candidate.Email) == NormalizeEmail(email));
        if (user is null)
        {
            return Task.FromResult(ServiceResult<bool>.Fail("Utilizatorul nu a fost gasit."));
        }

        if (user.Password != request.CurrentPassword)
        {
            return Task.FromResult(ServiceResult<bool>.Fail("Parola curenta este incorecta."));
        }

        user.Password = request.NewPassword;
        return Task.FromResult(ServiceResult<bool>.Ok(true));
    }

    public Task<bool> DeleteAsync(string email)
    {
        var user = _store.Users.FirstOrDefault(candidate => NormalizeEmail(candidate.Email) == NormalizeEmail(email));
        if (user is null)
        {
            return Task.FromResult(false);
        }

        _store.Users.Remove(user);
        _store.Properties.RemoveAll(property => NormalizeEmail(property.OwnerEmail) == NormalizeEmail(email));
        return Task.FromResult(true);
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    private static string BuildInitials(string fullName)
    {
        var parts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0)
        {
            return "U";
        }

        var initials = string.Concat(parts.Select(part => part[0])).ToUpperInvariant();
        return initials[..Math.Min(2, initials.Length)];
    }

    private static AuthResponseDto ToAuthResponse(User user)
    {
        return new AuthResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Initials = BuildInitials(user.FullName),
            Role = user.Role == UserRole.Admin ? "admin" : "user",
        };
    }

    private static UserDto ToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            BirthDate = user.BirthDate,
            City = user.City,
            Country = user.Country,
            Bio = user.Bio,
            Role = user.Role == UserRole.Admin ? "admin" : "user",
        };
    }
}
