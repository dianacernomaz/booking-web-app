namespace MyProject.Domain.Entities;

public sealed class PropertyEntity
{
    public int Id { get; set; }

    public string OwnerEmail { get; set; } = string.Empty;

    public required string Host { get; set; }

    public required string Title { get; set; }

    public required string City { get; set; }

    public required string Country { get; set; }

    public required string Address { get; set; }

    public decimal Price { get; set; }

    public decimal Rating { get; set; }

    public int Reviews { get; set; }

    public required string Image { get; set; }

    public List<string> GalleryImages { get; set; } = [];

    public List<string> Features { get; set; } = [];

    public string? Badge { get; set; }

    public int MaxGuests { get; set; }

    public int Bedrooms { get; set; }

    public int Bathrooms { get; set; }

    public int Area { get; set; }

    public required string AvailableFrom { get; set; }

    public required string AvailableTo { get; set; }

    public required string Description { get; set; }

    public required string DescriptionExtra { get; set; }

    public List<AmenityEntity> Amenities { get; set; } = [];

    public List<int> OccupiedDays { get; set; } = [];

    public List<ReviewEntity> ReviewsList { get; set; } = [];

    public List<NearbyPlaceEntity> Nearby { get; set; } = [];

    public required DateTime CreatedAt { get; set; }

    public required DateTime UpdatedAt { get; set; }
}
