namespace MyProject.Domain.Entities;

public sealed class AmenityEntity
{
    public required string Icon { get; set; }

    public required string Label { get; set; }

    public bool Available { get; set; }
}
