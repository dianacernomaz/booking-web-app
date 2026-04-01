namespace MyProject.BusinessLayer.DTOs;

public sealed class SessionUserDto
{
    public required string Email { get; set; }

    public required string FullName { get; set; }

    public required string Initials { get; set; }

    public string Role { get; set; } = "user";
}

public sealed class StoredUserDto
{
    public required string FullName { get; set; }

    public required string Email { get; set; }

    public string Phone { get; set; } = string.Empty;

    public string BirthDate { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public required string Password { get; set; }

    public string Role { get; set; } = "user";
}

public sealed class LoginRequestDto
{
    public required string Email { get; set; }

    public required string Password { get; set; }
}

public sealed class RegisterRequestDto
{
    public required string FullName { get; set; }

    public required string Email { get; set; }

    public string Phone { get; set; } = string.Empty;

    public string BirthDate { get; set; } = string.Empty;

    public required string Password { get; set; }
}

public sealed class UpdateUserProfileRequestDto
{
    public required string CurrentEmail { get; set; }

    public required string FullName { get; set; }

    public required string Email { get; set; }

    public string Phone { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;
}

public sealed class ChangePasswordRequestDto
{
    public required string Email { get; set; }

    public required string CurrentPassword { get; set; }

    public required string NewPassword { get; set; }
}
