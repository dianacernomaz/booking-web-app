using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.DTOs;

namespace MyProject.BusinessLayer.Interfaces;

public interface IAuthAction
{
    ServiceResult<SessionUserDto> LoginAction(LoginRequestDto request);

    ServiceResult<SessionUserDto> RegisterAction(RegisterRequestDto request);

    ServiceResult<StoredUserDto> GetCurrentUserAction(string email);

    ServiceResult<StoredUserDto> UpdateProfileAction(UpdateUserProfileRequestDto request);

    ServiceResult ChangePasswordAction(ChangePasswordRequestDto request);

    ServiceResult DeleteUserAction(string email);
}
