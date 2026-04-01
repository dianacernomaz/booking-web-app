using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.DTOs;

namespace MyProject.BusinessLayer.Services;

public interface IAuthService
{
    ServiceResult<SessionUserDto> Login(LoginRequestDto request);

    ServiceResult<SessionUserDto> Register(RegisterRequestDto request);

    ServiceResult<StoredUserDto> GetCurrentUser(string email);

    ServiceResult<StoredUserDto> UpdateProfile(UpdateUserProfileRequestDto request);

    ServiceResult ChangePassword(ChangePasswordRequestDto request);

    ServiceResult DeleteUser(string email);
}
