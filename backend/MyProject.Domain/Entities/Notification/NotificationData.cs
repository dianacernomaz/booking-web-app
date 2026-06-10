using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyProject.Domain.Entities;

public sealed class NotificationData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public UserData? User { get; set; }

    [Required]
    [StringLength(200)]
    public required string Title { get; set; }

    [Required]
    public required string Message { get; set; }

    [Required]
    [StringLength(50)]
    public required string Type { get; set; }

    public bool IsRead { get; set; }

    [DataType(DataType.DateTime)]
    public required DateTime CreatedAt { get; set; }
}
