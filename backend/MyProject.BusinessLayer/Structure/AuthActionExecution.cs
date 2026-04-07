using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.Core;
using MyProject.BusinessLayer.DTOs;
using MyProject.BusinessLayer.Infrastructure;
using MyProject.BusinessLayer.Interfaces;

namespace MyProject.BusinessLayer.Structure;

public sealed class AuthActionExecution(InMemoryAppStore store) : AuthActions(store), IAuthAction
{
    public ServiceResult<SessionUserDto> LoginAction(LoginRequestDto request) => LoginExecution(request);

    public ServiceResult<SessionUserDto> RegisterAction(RegisterRequestDto request) => RegisterExecution(request);

    public ServiceResult<StoredUserDto> GetCurrentUserAction(string email) => GetCurrentUserExecution(email);

    public ServiceResult<StoredUserDto> UpdateProfileAction(UpdateUserProfileRequestDto request) => UpdateProfileExecution(request);

    public ServiceResult ChangePasswordAction(ChangePasswordRequestDto request) => ChangePasswordExecution(request);

    public ServiceResult DeleteUserAction(string email) => DeleteUserExecution(email);
}
