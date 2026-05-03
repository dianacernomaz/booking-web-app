using MyProject.BusinessLayer.Core;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Responses;
using MyProject.Domain.Models.User;
using Microsoft.Extensions.Configuration;
using MyProject.DataAccess;

namespace MyProject.BusinessLayer.Structure
{
    public class AuthActionExecution : AuthActions, IAuthAction
    {
        public AuthActionExecution()
        {
        }

        public ActionResponse<SessionUserDto> LoginAction(LoginRequestDto request)
        {
            return LoginActionExecution(request);
        }

        public ActionResponse<SessionUserDto> RegisterAction(RegisterRequestDto request)
        {
            return RegisterActionExecution(request);
        }

        public StoredUserDto? GetCurrentUserAction(string email)
        {
            return GetCurrentUserActionExecution(email);
        }

        public ActionResponse<StoredUserDto> UpdateProfileAction(UpdateUserProfileRequestDto request)
        {
            return UpdateProfileActionExecution(request);
        }

        public ActionResponse ChangePasswordAction(ChangePasswordRequestDto request)
        {
            return ChangePasswordActionExecution(request);
        }

        public List<StoredUserDto> GetAllUsersAction()
        {
            return GetAllUsersActionExecution();
        }

        public ActionResponse UpdateUserRoleAction(string email, string role)
        {
            return UpdateUserRoleActionExecution(email, role);
        }

        public ActionResponse DeleteUserAction(string email)
        {
            return DeleteUserActionExecution(email);
        }
    }
}
