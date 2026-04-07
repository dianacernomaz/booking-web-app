namespace StayBooker.BusinessLayer.DTOs.Auth;

public sealed class AuthResponseDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public string Role { get; set; } = "user";
}
