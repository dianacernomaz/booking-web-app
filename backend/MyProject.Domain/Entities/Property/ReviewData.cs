using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyProject.Domain.Entities;

public sealed class ReviewData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int PropertyId { get; set; }

    [ForeignKey(nameof(PropertyId))]
    public PropertyData? Property { get; set; }

    [Required]
    [StringLength(150)]
    public required string Name { get; set; }

    [Required]
    [StringLength(100)]
    public required string Date { get; set; }

    public int Rating { get; set; }

    [Required]
    [StringLength(30)]
    public required string Color { get; set; }

    [Required]
    public required string Text { get; set; }
}
