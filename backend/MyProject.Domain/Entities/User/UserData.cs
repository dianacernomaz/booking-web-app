using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyProject.Domain.Entities;

public sealed class UserData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public required string FullName { get; set; }

    [Required]
    [StringLength(256)]
    [DataType(DataType.EmailAddress)]
    public required string Email { get; set; }

    [StringLength(20)]
    public string Phone { get; set; } = string.Empty;

    [StringLength(30)]
    public string BirthDate { get; set; } = string.Empty;

    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [StringLength(100)]
    public string Country { get; set; } = string.Empty;

    [StringLength(1000)]
    public string Bio { get; set; } = string.Empty;

    [Required]
    [StringLength(200, MinimumLength = 6)]
    public required string Password { get; set; }

    [StringLength(50)]
    public string Role { get; set; } = "user";

    public List<PropertyData> Properties { get; set; } = [];

    public List<BookingData> Bookings { get; set; } = [];

    public List<NotificationData> Notifications { get; set; } = [];

    public List<FavoriteData> Favorites { get; set; } = [];

    public List<ReviewData> Reviews { get; set; } = [];
}
