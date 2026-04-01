namespace MyProject.Domain.Entities;

public sealed class UserEntity
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
