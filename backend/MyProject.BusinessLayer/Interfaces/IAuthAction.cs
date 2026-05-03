using MyProject.Domain.Models.User;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Interfaces
{
    public interface IAuthAction
    {
        ActionResponse<SessionUserDto> LoginAction(LoginRequestDto request);

        ActionResponse<SessionUserDto> RegisterAction(RegisterRequestDto request);

        StoredUserDto? GetCurrentUserAction(string email);

        ActionResponse<StoredUserDto> UpdateProfileAction(UpdateUserProfileRequestDto request);

        ActionResponse ChangePasswordAction(ChangePasswordRequestDto request);

        List<StoredUserDto> GetAllUsersAction();

        ActionResponse UpdateUserRoleAction(string email, string role);

        ActionResponse DeleteUserAction(string email);
    }
}
