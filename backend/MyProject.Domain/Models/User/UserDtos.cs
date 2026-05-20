namespace MyProject.Domain.Models.User
{
    public class SessionUserDto
    {
        public int UserId { get; set; }

        public string Email { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Initials { get; set; } = string.Empty;

        public string Role { get; set; } = "user";

        public string? Token { get; set; }
    }

    public class StoredUserDto
    {
        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string BirthDate { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string Bio { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "user";
    }

    public class LoginRequestDto
    {
        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequestDto
    {
        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string BirthDate { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }

    public class UpdateUserProfileRequestDto
    {
        public string CurrentEmail { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string Bio { get; set; } = string.Empty;
    }

    public class ChangePasswordRequestDto
    {
        public string Email { get; set; } = string.Empty;

        public string CurrentPassword { get; set; } = string.Empty;

        public string NewPassword { get; set; } = string.Empty;
    }
}
