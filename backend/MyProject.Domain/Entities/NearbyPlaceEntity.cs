namespace MyProject.Domain.Entities;

public sealed class NearbyPlaceEntity
{
    public required string Icon { get; set; }

    public required string Name { get; set; }

    public required string Dist { get; set; }
}
