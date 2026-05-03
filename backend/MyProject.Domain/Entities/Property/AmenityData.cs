using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyProject.Domain.Entities;

public sealed class AmenityData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int PropertyId { get; set; }

    [ForeignKey(nameof(PropertyId))]
    public PropertyData? Property { get; set; }

    [Required]
    [StringLength(50)]
    public required string Icon { get; set; }

    [Required]
    [StringLength(150)]
    public required string Label { get; set; }

    public bool Available { get; set; }
}
