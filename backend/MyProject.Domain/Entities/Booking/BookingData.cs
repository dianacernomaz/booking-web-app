using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyProject.Domain.Entities;

public sealed class BookingData
{
    [Key]
    [StringLength(64)]
    public required string Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public UserData? User { get; set; }

    public int PropertyId { get; set; }

    [ForeignKey(nameof(PropertyId))]
    public PropertyData? Property { get; set; }

    [Required]
    [StringLength(200)]
    public required string PropertyTitle { get; set; }

    [Required]
    [StringLength(200)]
    public required string PropertyLocation { get; set; }

    [Required]
    public required string PropertyImage { get; set; }

    [Required]
    [StringLength(30)]
    public required string CheckIn { get; set; }

    [Required]
    [StringLength(30)]
    public required string CheckOut { get; set; }

    public int Guests { get; set; }

    public int Nights { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }

    [Required]
    [StringLength(50)]
    public required string Status { get; set; }

    [Required]
    [StringLength(100)]
    public required string Code { get; set; }

    [DataType(DataType.DateTime)]
    public required DateTime CreatedAt { get; set; }

    [StringLength(100)]
    public string? PaymentMethod { get; set; }

    [StringLength(100)]
    public string? PaymentStatus { get; set; }

    [StringLength(100)]
    public string? PaymentLabel { get; set; }

    [StringLength(10)]
    public string? PaymentLast4 { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime? PaidAt { get; set; }
}
