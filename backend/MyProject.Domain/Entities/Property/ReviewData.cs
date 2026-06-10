using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyProject.Domain.Entities;

public sealed class ReviewData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public UserData? User { get; set; }

    public int PropertyId { get; set; }

    [ForeignKey(nameof(PropertyId))]
    public PropertyData? Property { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [StringLength(1000)]
    public required string Comment { get; set; }

    [DataType(DataType.DateTime)]
    public required DateTime CreatedAt { get; set; }

    [DataType(DataType.DateTime)]
    public required DateTime UpdatedAt { get; set; }
}
