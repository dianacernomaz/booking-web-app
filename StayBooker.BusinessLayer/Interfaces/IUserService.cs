using StayBooker.BusinessLayer.Common;
using StayBooker.BusinessLayer.DTOs.Auth;
using StayBooker.BusinessLayer.DTOs.Users;

namespace StayBooker.BusinessLayer.Interfaces;

public interface IUserService
{
    Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginRequestDto request);
    Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterRequestDto request);
    Task<UserDto?> GetByEmailAsync(string email);
    Task<ServiceResult<UserDto>> UpdateProfileAsync(string email, UpdateUserProfileDto request);
    Task<ServiceResult<bool>> ChangePasswordAsync(string email, ChangePasswordDto request);
    Task<bool> DeleteAsync(string email);
}
